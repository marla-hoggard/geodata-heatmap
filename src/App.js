import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

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
        console.log(data);
        this.setState({ data: [...data], loading: false });
      })
      .catch(err => console.error(err));
  }

  render() {
    const position = [36, 42];
    const zoom = 7;
    if (this.state.loading) {
      return <p>Loading...</p>;
    }
    return (
      <>
      <p>{this.state.data.length}</p>
      <Map center={position} zoom={zoom}>
        <TileLayer
          url={`https://tile.openstreetmap.org/${zoom}/${position[0]}/${position[1]}.png`}
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
      </>
    )
  }
}

export default App;
