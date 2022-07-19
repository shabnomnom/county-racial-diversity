import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import NBData from './SFData.geojson'

mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1c2h0YXJpIiwiYSI6ImNqc3dtdTNmMzBqZGE0NG4ycjM4OHIwZHoifQ.PZmk1aN5a3r-Kf1yFLdvZQ';

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lng: -122.44,
      lat: 37.76,
      zoom: 11.50
    };
    this.mapContainer = React.createRef(); // effectively creates the div
  }
  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,  
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

		map.on('load', () => {
			map.addSource('states', {
			'type': 'geojson',
			'data': NBData
			});
         
        map.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'layout': {},
					'paint': {
					'line-color': '#627BC1',
					'line-width': 2
					}
        });
		});
  }

  render() {
    const { lng, lat, zoom } = this.state;
    return (
      <div>
        <div ref={this.mapContainer} className="map-container"/>
        <button className="button"> Add Data</button>
      </div>
    );
  }
};