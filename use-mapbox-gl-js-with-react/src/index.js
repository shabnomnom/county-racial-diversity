import React from 'react';
import ReactDOM from 'react-dom';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import './SFData.geojson';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
