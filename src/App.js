import React, { Component, createRef } from 'react';
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
    this.handleMoveZoom = this.handleMoveZoom.bind(this);
  }

  componentDidMount() {
    const { lat, lg, ht, width } = this.state;
    this.getData(lat, lg, ht, width);
  }

  getData(lat, lg, ht, width) {
    fetch(`https://geodata-python-api.herokuapp.com/?lat=${lat}&lg=${lg}&ht=${ht}&width=${width}`)
      .then(res => res.json())
      .then(data => {
        const coords = data.map(point => [point.latitude, point.longitude, point.network]);
        this.setState({ data: coords, loading: false });
      })
      .catch(err => console.error(err));
  }

  handleMoveZoom(e) {
    const zoomLevel = e.target._zoom;
    const [lat, lg] = e.target.options.center;
    const ht = 180 / (2 ** zoomLevel);
    const width = ht * 2;
    this.setState({
      lat,
      lg,
      ht,
      width,
      zoom: zoomLevel,
      loading: true,
    });
    this.getData(lat, lg, ht, width);
  }

  render() {
    const { lat, lg, loading, data, zoom } = this.state;
    return (
      <>
      <p>{loading ? 
        'Loading IP map...' :
        `There are ${data.length} IP addresses in this region.`
      }</p>
      <Map
        center={[lat, lg]} 
        zoom={zoom}
        onMovestart={this.handleMoveZoom}
      >
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
