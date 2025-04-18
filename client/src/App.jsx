import * as React from 'react';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      initialViewState={{
        longitude: 0,
        latitude: 0,
        zoom: 1.5
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}

export default App