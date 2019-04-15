import React, { Component } from 'react';
import {
  FormControl, Select, MenuItem, InputLabel, Button
} from '@material-ui/core';

import Gauge from '../../src/gauge';

require('../public/styles/normalize.css');
require('../public/styles/App.css');

const STAGE_STYLE = Object.freeze({
  backgroundColor: '#90CAF9',
  backgroundSize: '100% auto',
  position: 'relative',
  width: '100%',
  height: '100%'
});

const THEME_LIST = [{ key: 'light', value: 'Light' }, { key: 'dark', value: 'Dark' }];
const MODE_LIST = [{ key: 'gauge', value: 'Gauge' }, { key: 'progress', value: 'Progress' }];
const TF_LIST = [{ key: 'yes', value: 'Yes' }, { key: 'no', value: 'No' }];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.initState();
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  initState = () => {
    return {
      gaugeStyle: {
        display: 'inline-block',
        margin: '10px auto',
        width: '128px',
        height: '128px'
      },
      gaugeTheme: 'light',
      gaugeMode: 'gauge',
      gaugeSize: 64,
      enableAnimation: true,
      enableColorful: true,
      title: 'Temp.',
      unit: decodeURI('%C2%B0C'),
      scaleList: [
        { scale: 10, quantity: 4, startColor: '#327aff', endColor: '#327aff' },
        { scale: 5, quantity: 4, startColor: '#327aff', endColor: 'orange' },
        { scale: 20, quantity: 4, startColor: 'orange', endColor: 'red' }
      ],
      minValue: -40,
      value: 0
    };
  }

  handleResize = () => {
    const stageSpecs = this.stage.getBoundingClientRect();

    const width = (stageSpecs.width > 480) ? stageSpecs.width : 480;
    const height = (stageSpecs.height > 320) ? stageSpecs.height : 320;

    const gaugeSize = (width > height) ? (height * 0.3) : ((width * 0.3) - 10);

    this.setState({
      gaugeSize,
      gaugeStyle: {
        display: 'inline-block',
        margin: `10px ${(width - gaugeSize) * 0.5}px`
      },
    });
  }

  changeValue = () => {
    const newValue = parseFloat(((Math.random() * 140) - 40).toFixed(2));

    this.setState({
      value: newValue || 0
    });
  }

  render() {
    const {
      gaugeStyle,
      gaugeTheme,
      gaugeMode,
      gaugeSize,
      enableAnimation,
      enableColorful,
      title,
      unit,
      scaleList,
      minValue,
      value
    } = this.state;

    return (
      <div style={STAGE_STYLE} ref={(s) => { this.stage = s; }}>
        <Gauge
          style={gaugeStyle}
          theme={gaugeTheme}
          mode={gaugeMode}
          size={gaugeSize}
          enableAnimation={enableAnimation}
          enableColorful={enableColorful}
          title={title}
          unit={unit}
          scaleList={scaleList}
          minValue={minValue}
          value={value}
          isTickTextEnable={false}
        />
        <div style={{ width: '95%', margin: '5px auto' }}>
          <FormControl fullWidth>
            <InputLabel>Theme</InputLabel>
            <Select
              value={gaugeTheme}
              onChange={(e) => { this.setState({ gaugeTheme: e.target.value }); }}
            >
              {
                THEME_LIST.map((item, i) => (<MenuItem key={`theme${i + 1}`} value={item.key}>{item.value}</MenuItem>))
              }
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Mode</InputLabel>
            <Select
              value={gaugeMode}
              onChange={(e) => { this.setState({ gaugeMode: e.target.value }); }}
            >
              {
                MODE_LIST.map((item, i) => (<MenuItem key={`mode${i + 1}`} value={item.key}>{item.value}</MenuItem>))
              }
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Enable Colorful</InputLabel>
            <Select
              value={enableColorful ? 'yes' : 'no'}
              onChange={(e) => { this.setState({ enableColorful: e.target.value === 'yes' }); }}
            >
              {
                TF_LIST.map((item, i) => (<MenuItem key={`color${i + 1}`} value={item.key}>{item.value}</MenuItem>))
              }
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Enable Animation</InputLabel>
            <Select
              value={enableAnimation ? 'yes' : 'no'}
              onChange={(e) => { this.setState({ enableAnimation: e.target.value === 'yes' }); }}
            >
              {
                TF_LIST.map((item, i) => (<MenuItem key={`animation${i + 1}`} value={item.key}>{item.value}</MenuItem>))
              }
            </Select>
          </FormControl>
          <Button color="primary" onClick={() => this.changeValue()}>Random Value</Button>
        </div>
      </div>
    );
  }
}

export default (App);
