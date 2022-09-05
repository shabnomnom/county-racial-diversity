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
    let hoveredCountyId = null;
  

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

		map.on('load', () => {
			map.addSource('nbs', {
			'type': 'geojson',
			'data': NBData,
      generateId: true,
      })
      map.addSource('ethnicity',{
        type: 'vector',
        url: 'mapbox://examples.8fgz4egr'
      });

        map.addLayer({
        'id': 'NB-borders',
        'type': 'line',
        'source': 'nbs',
        'layout': {},
					'paint': {
					'line-color': '#627BC1',
					'line-width': 2
					}
        });

        map.addLayer({
          'id': 'NB-fills',
          'type': 'fill',
          'source': 'nbs',
          'layout': {},
          'paint': {
          'fill-color': '#627BC1',
          'fill-opacity': [
          'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.5
            ]
          }
        });
        map.addLayer({
          'id': 'population',
          'type': 'circle',
          'source': 'ethnicity',
          'source-layer': 'sf2010',
          'paint': {
          // Make circles larger as the user zooms from z12 to z22.
          'circle-radius': {
          'base': 1.75,
          'stops': [
          [12, 2],
          [22, 180]
          ]
          },
          // Color circles by ethnicity, using a `match` expression.
          'circle-color': [
          'match',
          ['get', 'ethnicity'],
          'White',
          '#fbb03b',
          'Black',
          '#223b53',
          'Hispanic',
          '#e55e5e',
          'Asian',
          '#3bb2d0',
          /* other */ '#ccc'
          ]
          }

		});
    // Updating feature state per hover 
    map.on('mousemove', 'NB-fills', (e)=> {
      if (e.features.length > 0) {
        if (hoveredCountyId !== null){
          console.log(e.features)
          map.setFeatureState(
            {
              source: 'nbs',
              id: hoveredCountyId,
            },{
              hover:false
            });
        }
        hoveredCountyId = 
        e.features[0].id;
        map.setFeatureState(
          {source: 'nbs', id:hoveredCountyId,},{ hover:true}
        );
      }    
    });
  
    map.on('mouseleave','NB-fills', ()=>
      {
        if (hoveredCountyId !== null) {
          map.setFeatureState(
            {source: 'nbs', id:hoveredCountyId,},{ hover:false}
          );
        }
        hoveredCountyId = null;
      });

  }


  render() {

    return (
      <div>
        <div ref={this.mapContainer} className="map-container"/>
        <button className="button"> Add Data</button>
      </div>
    );
  }
};