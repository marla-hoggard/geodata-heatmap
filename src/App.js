import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      lat: 36,
      lg: -79,
      ht: 0.75,
      width: 1.5,
      loading: true,
      data: [],
      zoom: 10,
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { lat, lg, ht, width } = this.state;
    fetch(`https://geodata-python-api.herokuapp.com/?lat=${lat}&lg=${lg}&ht=${ht}&width=${width}`)
      .then(res => res.json())
      .then(data => {
        const coords = data.map(point => [point.latitude, point.longitude, point.network]);
        this.setState({ data: coords, loading: false });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { lat, lg, loading, data, zoom } = this.state;
    return (
      <>
      <p>{loading ? 
        'Loading IP map...' :
        `There are ${data.length} IP addresses in this region.`
      }</p>
      <Map center={[lat, lg]} zoom={zoom}>
        <HeatmapLayer
          points={data}
          latitudeExtractor={m => m[0]}
          longitudeExtractor={m => m[1]}
          intensityExtractor={m => parseFloat(m[2])} 
        />
        <TileLayer
          url={`http://{s}.tile.osm.org/{z}/{x}/{y}.png`}
        />
      </Map>
      </>
    )
  }
}

export default App;
