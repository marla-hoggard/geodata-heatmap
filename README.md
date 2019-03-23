# IPv4 Heatmap

This project displays a heatmap of IPv4 networks around the world. You can zoom in, zoom out or pan the map to see different geographic areas.

This project makes use of [Create React App](https://github.com/facebook/create-react-app), [LeafletJS](https://leafletjs.com/), [React-Leaflet](https://react-leaflet.js.org/) and [React-Leaflet-Heatmap-Layer](https://github.com/OpenGov/react-leaflet-heatmap-layer). The IP address data comes from [Geolite](https://www.maxmind.com/en/home) via this [Flask API](https://github.com/mglasser/geodata-api) that I created.

## Running the App

To run the app locally, simply clone the repo, `npm install` then `npm start` and open `localhost:3000`.

Additionally, the app is deployed on [Heroku](https://geodata-ip-heatmap.herokuapp.com/).
