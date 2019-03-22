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
      ht: 10,
      width: 20,
      loading: true,
      data: [],
    };
  }
  componentDidMount() {
    console.log('mounted');
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
    const position = [this.state.lat, this.state.lg];
    const zoom = 10;
    if (this.state.loading) {
      return <p>Loading...</p>;
    }
    return (
      <>
      <p>There are {this.state.data.length} IP addresses in this region.</p>
      <Map center={position} zoom={zoom}>
        <HeatmapLayer
          fitBoundsOnLoad
          fitBoundsOnUpdate
          points={this.state.data}
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
