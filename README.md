# react-canvas-gauge

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/react-canvas-gauge.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/react-canvas-gauge
[download-image]: https://img.shields.io/npm/dm/react-canvas-gauge.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-canvas-gauge

![image](https://raw.githubusercontent.com/neilpipi1985/react-canvas-gauge/master/demo.gif)

## Quick start

**Installing via npm**

```
$ npm install --save-dev react-canvas-gauge
```

### Example

```js
import React, { Component } from 'react';
import Gauge from 'react-canvas-gauge';

class MyGauge extends Component {
  render() {
    return (<Gauge />);
  }
}

export default MyGauge;
```

### Props

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th style="width: 100px;">name</th>
      <th style="width: 50px;">type</th>
      <th style="width: 150px;">default</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>style</td>
      <td>object</td>
      <td>{}</td>
    </tr>
    <tr>
      <td>theme</td>
      <td>string: 'light' , 'dark'</td>
      <td>'light'</td>
    </tr>
    <tr>
      <td>mode</td>
      <td>string: 'gauge', 'progress'</td>
      <td>'gauge'</td>
    </tr>
    <tr>
      <td>size</td>
      <td>number</td>
      <td>128</td>
    </tr>
    <tr>
      <td>enableAnimation</td>
      <td>bool</td>
      <td>true</td>
    </tr>
    <tr>
      <td>animationTimeout</td>
      <td>number</td>
      <td>250</td>
    </tr>
    <tr>
      <td>enableColorful</td>
      <td>bool</td>
      <td>true</td>
    </tr>
    <tr>
      <td>title</td>
      <td>string</td>
      <td>''</td>
    </tr>
    <tr>
      <td>unit</td>
      <td>string</td>
      <td>''</td>
    </tr>
    <tr>
      <td>scaleList</td>
      <td>array</td>
      <td>[{scale:10,quantity:5,startColor:'#ff2a04',endColor:'orange'},{scale:10,quantity:5,startColor:'orange',endColor:'#32cd32'}]</td>
    </tr>
    <tr>
      <td>minValue</td>
      <td>number</td>
      <td>0</td>
    </tr>
    <tr>
      <td>value</td>
      <td>number</td>
      <td>0</td>
    </tr>
  </tbody>
  </table>

See the [examples](https://github.com/neilpipi1985/react-canvas-gauge/blob/master/example/render/app.js) for a more complete sample.


### Running Local Example

```   
$ git clone https://github.com/neilpipi1985/react-canvas-gauge
$ cd ./react-canvas-gauge
$ npm install
$ npm run test
```
