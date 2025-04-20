import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import { IoMdPin } from "react-icons/io";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      initialViewState={{
        longitude: 0,
        latitude: 0,
        zoom: 1.5
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Marker longitude={-100} latitude={40} anchor="bottom">
      <IoMdPin size={30} color="rgb(227, 43, 43)"/>
      </Marker>

      <Popup longitude={-100} latitude={40}
        closeButton={true}
        closeOnClick={false}
        anchor="left"
        style={{ color: "rgb(0, 0, 0)" }}>
        <div>
          <h1>Some Title</h1>
          <p>Some description</p>
        </div>
      </Popup>

    </Map>
  );
}

export default App;
