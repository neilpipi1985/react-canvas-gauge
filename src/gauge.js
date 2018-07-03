import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Gauge extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
    theme: PropTypes.oneOf(['light', 'dark']),
    mode: PropTypes.oneOf(['gauge', 'progress']),
    size: PropTypes.number,
    enableAnimation: PropTypes.bool,
    animationTimeout: PropTypes.number,
    enableColorful: PropTypes.bool,
    title: PropTypes.string,
    unit: PropTypes.string,
    scaleList: PropTypes.arrayOf(PropTypes.shape({
      scale: PropTypes.number,
      quantity: PropTypes.number,
      startColor: PropTypes.string,
      endColor: PropTypes.string
    })),
    minValue: PropTypes.number,
    value: PropTypes.number
  };

  static defaultProps = {
    style: {},
    theme: 'light',
    mode: 'gauge',
    size: 128,
    enableAnimation: true,
    animationTimeout: 250,
    enableColorful: true,
    title: '',
    unit: '',
    scaleList: [
      { scale: 10, quantity: 5, startColor: '#ff2a04', endColor: 'orange' },
      { scale: 10, quantity: 5, startColor: 'orange', endColor: '#32cd32' }
    ],
    minValue: 0,
    value: 0
  };

  constructor(props) {
    super(props);
    this.state = this.getNewState(props);
  }

  componentDidMount() {
    const newState = this.getNewState(this.props, undefined, true);
    this.drawProgress(this.getValueRate(), newState);
    this.refreshContext(newState);
  }

  componentDidUpdate(prevProps) {
    const newState = this.getNewState(this.props, prevProps);
    const isChangeGauge = this.isChangeGauge(this.props, prevProps);
    if (isChangeGauge) {
      const valueRate = this.getValueRate();
      if (this.props.enableAnimation && this.state.valueBefore !== valueRate) {
        const subValue = (valueRate - this.state.valueBefore);
        const time = (Math.abs(subValue) * 100) || 1;
        const optr = (subValue > 0) ? 0.01 : -0.01;
        const timeout = (this.props.animationTimeout / time);

        this.clearLastAnimator();
        this.animator(this.state.valueBefore, optr, valueRate, timeout, newState);
      } else {
        this.drawProgress(this.getValueRate(), newState);
      }
      this.refreshContext(newState);
    }
  }

  getNewState = (newProps = {}, oldProps = {}, enableRefresh = false) => {
    const newState = {};

    if (newProps.style !== oldProps.style) {
      newState.style = Object.assign({ WebkitUserSelect: 'none', MozUserSelect: 'none' }, newProps.style || {});
    }
    const isChange = (
      !this.state ||
      enableRefresh ||
      newProps.size !== oldProps.size ||
      newProps.theme !== oldProps.theme ||
      newProps.mode !== oldProps.mode
    );

    if (isChange) {
      const size = newProps.size || this.props.size;
      const mode = newProps.mode || this.props.mode;
      const theme = newProps.theme || this.props.theme;
      const sizeInfo = {
        borderWidth: size * 0.05,
        barWidth: size * 0.1
      };
      const colorInfo = {};
      switch (mode) {
        case 'progress': {
          Object.assign(sizeInfo, {
            title: size * 0.15,
            value: size * 0.15,
            unit: size * 0.15
          });
          Object.assign(colorInfo, { pen: 'transparent' });
          break;
        }
        default: {
          Object.assign(sizeInfo, {
            title: size * 0.12,
            value: size * 0.15,
            unit: size * 0.15
          });
          Object.assign(colorInfo, { pen: 'red' });
          break;
        }
      }

      switch (theme) {
        case 'light': {
          Object.assign(colorInfo, {
            background: '#efefef',
            defaultBar: '#ababab',
            centerCircle: '#ffffff',
            text: '#000000',
            graduation: '#000000',
            border: '#efefef'
          });
          break;
        }
        case 'dark': {
          Object.assign(colorInfo, {
            pen: 'red',
            background: '#2e2e2e',
            defaultBar: '#c0c0c0',
            centerCircle: '#000000',
            text: '#ffffff',
            graduation: '#ffffff',
            border: '#000000'
          });
          break;
        }
        default: {
          break;
        }
      }
      Object.assign(newState, { colorInfo, sizeInfo });
    }

    return newState;
  }

  getValueRate = () => {
    const {
      scaleList,
      minValue,
      value
    } = this.props;

    if (scaleList && scaleList.length > 0) {
      const scaleNumber = scaleList.length;
      const intervalScale = (2.25 - 0.75) / scaleNumber;

      let tmpScale = 0;
      let tmpMinValue = minValue || 0;
      const tmpValue = value || 0;
      for (let i = 0; i < scaleNumber; i += 1) {
        const quantity = scaleList[i].quantity || 0;
        const scale = scaleList[i].scale || 0;
        const maxScaleValue = (tmpMinValue + (quantity * scale));

        if (maxScaleValue >= tmpValue) {
          tmpScale += ((tmpValue - tmpMinValue) / (quantity * scale)) * intervalScale;
          break;
        }
        tmpScale += intervalScale;
        tmpMinValue += (quantity * scale);
      }

      let rateValue = parseFloat((((tmpScale * 200) / 3) * 0.01).toFixed(2));
      if (rateValue < 0) {
        rateValue = 0.00;
      } else if (rateValue > 1) {
        rateValue = 1.00;
      }
      return rateValue;
    }

    return 0.00;
  }

  isChangeGauge = (newProps = {}, oldProps = {}) => {
    return (
      newProps.style !== oldProps.style ||
      newProps.theme !== oldProps.theme ||
      newProps.mode !== oldProps.mode ||
      newProps.size !== oldProps.size ||
      newProps.colorInfo !== oldProps.colorInfo ||
      newProps.title !== oldProps.title ||
      newProps.unit !== oldProps.unit ||
      newProps.enableColorful !== oldProps.enableColorful ||
      newProps.scaleList !== oldProps.scaleList ||
      newProps.minValue !== oldProps.minValue ||
      newProps.value !== oldProps.value
    );
  }


  refreshContext = (newState = {}) => {
    this.setState(newState);
  }

  drawProgress = (valueRate, newState = {}) => {
    const {
      size,
      mode,
      enableColorful,
      title,
      unit,
      scaleList,
      minValue,
      value
    } = this.props;

    const sizeInfo = newState.sizeInfo || this.state.sizeInfo;
    const colorInfo = newState.colorInfo || this.state.colorInfo;

    const gaugeDOM = this.gaugue;
    if (gaugeDOM) {
      Object.assign(gaugeDOM, { width: size, height: size });
      const scaleNumber = (scaleList.length > 0) ? scaleList.length : 1;

      const gaugeCTX = gaugeDOM.getContext('2d');

      const gaugeHalfWidth = gaugeDOM.width / 2;
      const gaugeHalfHeight = gaugeDOM.height / 2;
      const radiusWidth = (gaugeDOM.width / 2) - sizeInfo.borderWidth;
      const scaleInterval = (2.25 - 0.75) / scaleNumber;
      // progress bar
      gaugeCTX.lineCap = 'round';

      switch (mode) {
        case 'progress': {
          // background ring
          gaugeCTX.beginPath();
          gaugeCTX.lineWidth = 0;
          gaugeCTX.fillStyle = colorInfo.background;
          gaugeCTX.arc(gaugeHalfWidth, gaugeHalfHeight, radiusWidth, 0, 2 * Math.PI);
          gaugeCTX.fill();

          gaugeCTX.beginPath();
          gaugeCTX.lineWidth = 0;
          gaugeCTX.fillStyle = colorInfo.centerCircle;
          gaugeCTX.arc(gaugeHalfWidth, gaugeHalfHeight, radiusWidth - sizeInfo.barWidth, 0.75 * Math.PI, 2.25 * Math.PI);
          gaugeCTX.fill();

          gaugeCTX.font = `bold ${sizeInfo.value}px Arial`;
          gaugeCTX.textAlign = 'center';
          gaugeCTX.fillStyle = colorInfo.text;
          gaugeCTX.fillText(`${value}${unit}`, gaugeHalfWidth, gaugeHalfHeight);

          gaugeCTX.font = `bold ${sizeInfo.title}px Arial`;
          gaugeCTX.textAlign = 'center';
          gaugeCTX.fillStyle = colorInfo.text;
          gaugeCTX.fillText(title, gaugeHalfWidth, (gaugeHalfHeight + radiusWidth) - (sizeInfo.barWidth / 2));

          // progress bar
          if (enableColorful) {
            gaugeCTX.beginPath();
            gaugeCTX.lineWidth = sizeInfo.barWidth;
            gaugeCTX.strokeStyle = colorInfo.defaultBar;
            gaugeCTX.arc(gaugeHalfWidth, gaugeHalfHeight, radiusWidth - (sizeInfo.barWidth / 2), 0.75 * Math.PI, 2.25 * Math.PI);
            gaugeCTX.stroke();
          }

          const tmpValue = valueRate * 1.5;
          for (let i = 0; i < scaleNumber; i += 1) {
            const startAngle = (0.75 + (i * scaleInterval)) * Math.PI;
            const endAngle = (0.75 + ((i + 1) * scaleInterval)) * Math.PI;
            const startColor = scaleList[i].startColor;
            const endColor = scaleList[i].endColor;

            const isVauleInterval = (((i + 1) * scaleInterval) >= tmpValue);
            if (enableColorful) {
              gaugeCTX.beginPath();
              const tmpScale = isVauleInterval ? ((0.75 + tmpValue) * Math.PI) : endAngle;
              const newRadiusWidth = (radiusWidth - (sizeInfo.barWidth / 2));
              const barColor = gaugeCTX.createLinearGradient(
                gaugeHalfWidth + (newRadiusWidth * Math.cos(startAngle)),
                gaugeHalfHeight + (newRadiusWidth * Math.sin(startAngle)),
                gaugeHalfWidth + (newRadiusWidth * Math.cos(tmpScale)),
                gaugeHalfHeight + (newRadiusWidth * Math.sin(tmpScale))
              );

              barColor.addColorStop(0, startColor);
              barColor.addColorStop(1.0, endColor);

              gaugeCTX.arc(gaugeHalfWidth, gaugeHalfHeight, radiusWidth - (sizeInfo.barWidth / 2), startAngle, tmpScale);
              gaugeCTX.lineWidth = sizeInfo.barWidth;
              gaugeCTX.strokeStyle = barColor;
              gaugeCTX.stroke();

              if (isVauleInterval) {
                break;
              }
            } else if (isVauleInterval) {
              gaugeCTX.beginPath();
              const barColor = gaugeCTX.createRadialGradient(
                gaugeHalfWidth,
                gaugeHalfHeight,
                radiusWidth,
                gaugeHalfWidth,
                gaugeHalfHeight,
                radiusWidth - (sizeInfo.barWidth / 2)
              );

              gaugeCTX.arc(gaugeHalfWidth, gaugeHalfHeight, radiusWidth - (sizeInfo.barWidth / 2), 0.75 * Math.PI, 2.25 * Math.PI);
              gaugeCTX.lineWidth = sizeInfo.barWidth;
              gaugeCTX.strokeStyle = barColor;
              gaugeCTX.stroke();
              break;
            }
          }

          break;
        }
        default: {
          const graduationPosition = radiusWidth;
          const graduationLength = sizeInfo.barWidth;
          const graduationSize = gaugeDOM.width * 0.01;
          const graduationFontSize = Math.floor(gaugeDOM.width * 0.08);
          const penHalfWidth = gaugeDOM.width * 0.02;

          gaugeCTX.beginPath();
          gaugeCTX.lineWidth = 0;
          gaugeCTX.fillStyle = colorInfo.centerCircle;
          gaugeCTX.arc(gaugeHalfWidth, gaugeHalfHeight, radiusWidth, 0 * Math.PI, 2 * Math.PI);
          gaugeCTX.fill();

          let graduationValue = minValue || 0;
          for (let i = 0; i < scaleNumber; i += 1) {
            const startAngle = (0.75 + (i * scaleInterval)) * Math.PI;
            const endAngle = (0.75 + ((i + 1) * scaleInterval)) * Math.PI;
            const quantity = scaleList[i].quantity;
            const scale = scaleList[i].scale;
            const intervalAngle = (endAngle - startAngle) / quantity;
            const startColor = scaleList[i].startColor;
            const endColor = scaleList[i].endColor;

            if (enableColorful) {
              gaugeCTX.beginPath();
              const barColor = gaugeCTX.createLinearGradient(
                gaugeHalfWidth + ((radiusWidth - (graduationLength / 4)) * Math.cos(startAngle)),
                gaugeHalfHeight + ((radiusWidth - (graduationLength / 4)) * Math.sin(startAngle)),
                gaugeHalfWidth + ((radiusWidth - (graduationLength / 4)) * Math.cos(endAngle)),
                gaugeHalfHeight + ((radiusWidth - (graduationLength / 4)) * Math.sin(endAngle))
              );

              barColor.addColorStop(0, startColor);
              barColor.addColorStop(1.0, endColor);
              gaugeCTX.arc(gaugeHalfWidth, gaugeHalfHeight, radiusWidth - (graduationLength / 4), startAngle, endAngle);
              gaugeCTX.lineWidth = graduationLength / 2;
              gaugeCTX.strokeStyle = barColor;
              gaugeCTX.stroke();
            }

            for (let j = 0; j <= quantity; j += 1) {
              const angle = (j * intervalAngle) + startAngle;

              gaugeCTX.beginPath();
              gaugeCTX.lineWidth = graduationSize;
              gaugeCTX.strokeStyle = colorInfo.graduation;
              gaugeCTX.moveTo(
                gaugeHalfWidth + (graduationPosition * Math.cos(angle)),
                gaugeHalfHeight + (graduationPosition * Math.sin(angle))
              );
              gaugeCTX.lineTo(
                gaugeHalfWidth + ((graduationPosition - (graduationLength / 2)) * Math.cos(angle)),
                gaugeHalfHeight + ((graduationPosition - (graduationLength / 2)) * Math.sin(angle))
              );
              gaugeCTX.stroke();
              gaugeCTX.closePath();

              const graduationText = `${(graduationValue + (j * scale))}`;
              gaugeCTX.font = `${graduationFontSize}px Arial`;
              gaugeCTX.textAlign = 'center';
              gaugeCTX.fillStyle = colorInfo.graduation;
              gaugeCTX.fillText(
                graduationText,
                gaugeHalfWidth + (
                  (graduationPosition - ((graduationLength / 2) + graduationFontSize)) *
                  Math.cos(angle)
                ),
                gaugeHalfHeight + (
                  (graduationPosition - ((graduationLength / 2) + graduationFontSize)) *
                  Math.sin(angle)
                )
              );
            }
            graduationValue += (scale * quantity);
          }

          gaugeCTX.font = `bold ${sizeInfo.title}px Arial`;
          gaugeCTX.textAlign = 'center';
          gaugeCTX.fillStyle = colorInfo.text;
          gaugeCTX.fillText(
            title,
            gaugeHalfWidth + (graduationLength * Math.cos(1.5 * Math.PI)),
            gaugeHalfHeight + (graduationLength * Math.sin(1.5 * Math.PI))
          );

          gaugeCTX.font = `bold ${sizeInfo.unit}px Arial`;
          gaugeCTX.textAlign = 'center';
          gaugeCTX.fillStyle = colorInfo.text;
          gaugeCTX.fillText(
            unit,
            gaugeHalfWidth + ((radiusWidth / 2) * Math.cos(0.5 * Math.PI)),
            gaugeHalfHeight + ((radiusWidth / 2) * Math.sin(0.5 * Math.PI))
          );

          gaugeCTX.font = `bold ${sizeInfo.value}px Arial`;
          gaugeCTX.textAlign = 'center';
          gaugeCTX.fillStyle = colorInfo.text;
          gaugeCTX.fillText(
            value,
            gaugeHalfWidth,
            (gaugeHalfHeight + radiusWidth) - (sizeInfo.barWidth / 2)
          );

          let valueAngle = (((2.25 - 0.75) * valueRate) + 0.75) * Math.PI;
          gaugeCTX.beginPath();
          gaugeCTX.lineWidth = 0;
          gaugeCTX.fillStyle = colorInfo.pen;
          gaugeCTX.moveTo(
            gaugeHalfWidth + (radiusWidth * Math.cos(valueAngle)),
            gaugeHalfHeight + (radiusWidth * Math.sin(valueAngle))
          );

          valueAngle += (0.5 * Math.PI);
          gaugeCTX.lineTo(
            gaugeHalfWidth + (penHalfWidth * Math.cos(valueAngle)),
            gaugeHalfHeight + (penHalfWidth * Math.sin(valueAngle))
          );

          valueAngle -= (1 * Math.PI);
          gaugeCTX.lineTo(
            gaugeHalfWidth + (penHalfWidth * Math.cos(valueAngle)),
            gaugeHalfHeight + (penHalfWidth * Math.sin(valueAngle))
          );

          valueAngle += (0.5 * Math.PI);
          gaugeCTX.lineTo(
            gaugeHalfWidth + (radiusWidth * Math.cos(valueAngle)),
            gaugeHalfHeight + (radiusWidth * Math.sin(valueAngle))
          );
          gaugeCTX.fill();
          // center point
          gaugeCTX.beginPath();
          gaugeCTX.lineWidth = 0;
          gaugeCTX.fillStyle = colorInfo.pen;
          gaugeCTX.arc(
            gaugeHalfWidth,
            gaugeHalfHeight,
            penHalfWidth,
            0,
            2 * Math.PI
          );
          gaugeCTX.fill();

          break;
        }
      }

      gaugeCTX.beginPath();
      const borderColor = gaugeCTX.createRadialGradient(
        gaugeHalfWidth,
        gaugeHalfHeight,
        radiusWidth + sizeInfo.borderWidth,
        gaugeHalfWidth,
        gaugeHalfHeight,
        radiusWidth
      );

      borderColor.addColorStop(0, colorInfo.border);
      borderColor.addColorStop(0.5, '#ffffff');
      borderColor.addColorStop(1, colorInfo.border);

      gaugeCTX.lineWidth = sizeInfo.borderWidth;
      gaugeCTX.arc(
        gaugeHalfWidth,
        gaugeHalfHeight,
        radiusWidth + (sizeInfo.borderWidth / 2),
        0 * Math.PI,
        2 * Math.PI
      );
      gaugeCTX.strokeStyle = borderColor;
      gaugeCTX.stroke();
      this.state.valueBefore = valueRate;
    }
  }

  clearLastAnimator = () => {
    if (this.animatorTimeout) {
      clearTimeout(this.animatorTimeout);
      this.animatorTimeout = undefined;
    }
  }

  animator = (lastValue, optr, finalValue, timeout, newState) => {
    let value = lastValue + optr;

    if ((optr > 0 && value >= finalValue) || (optr < 0 && value <= finalValue)) {
      value = finalValue;
    }

    this.drawProgress(value, newState);
    if (value !== finalValue) {
      this.animatorTimeout = setTimeout(() => { this.animator(value, optr, finalValue, timeout, newState); }, timeout);
    }
  }

  render() {
    const { style } = this.state;
    return (<canvas style={style} ref={(g) => { this.gaugue = g; }} />);
  }
}

export default Gauge;
