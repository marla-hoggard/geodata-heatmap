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
      zoom: 10,
      data: [],
      loading: true,
      shouldFetch: false,
    };
    this.getData = this.getData.bind(this);
    this.handleMoveZoom = this.handleMoveZoom.bind(this);
  }

  mapRef = createRef();

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {
    if (this.state.shouldFetch) {
      this.getData();
      this.setState({ shouldFetch: false });
    }
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

  handleMoveZoom() {
    const map = this.mapRef.current.leafletElement;
    const zoom = map.getZoom();
    const center = map.getCenter();
    const bounds = map.getBounds();
    const lat = center.lat;
    const lg = center.lng;
    const ht = Math.abs(bounds._northEast.lat - bounds._southWest.lat) * 2;
    const width = Math.abs(bounds._northEast.lng - bounds._southWest.lng) * 2;
    this.setState({
      lat,
      lg,
      ht,
      width,
      zoom,
      shouldFetch: true,
      loading: true,
    });
  }

  render() {
    const { lat, lg, loading, data, zoom } = this.state;
    return (
      <>
      <p>
        {loading ? 
          'Loading IP map...' :
          `There are ${data.length} IP addresses in this region.`
        }
      </p>
      <Map
        center={[lat, lg]} 
        zoom={zoom}
        ref={this.mapRef}
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
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </Map>
      </>
    )
  }
}

export default App;
