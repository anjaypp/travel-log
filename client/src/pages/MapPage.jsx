import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import { IoMdPin } from "react-icons/io";
import "mapbox-gl/dist/mapbox-gl.css";


function MapPage() {
  const [pins, setPins] = useState([]);
  const [addNewPins, setNewPins] = useState(null);

  // Fetch pins
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axiosInstance.get("/logs");
        setPins(res.data);
      } catch (err) {
        console.error("Error fetching pins", err);
      }
    };
    getPins();
  }, []);

  //Handle map click
  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPins({ lat, lng });
  };

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
      onDblClick={handleMapClick}
    >
      {pins.map((pin) => (
        <React.Fragment key={pin._id}>
      <Marker longitude={pin.location.lng} latitude={pin.location.lat} anchor="bottom">
        <IoMdPin size={30} color="rgb(227, 43, 43)" />
      </Marker>

      <Popup
        longitude={pin.location.lng}
        latitude={pin.location.lat}
        closeButton={true}
        closeOnClick={false}
        anchor="left"
        style={{ color: "rgb(0, 0, 0)" }}
      >
        <div>
          <h1>{pin.title}</h1>
          <p>{pin.description}</p>
        </div>
      </Popup>
        </React.Fragment>
      ))}

      {/* New pin on map click */}
      {addNewPins && (
        <Marker
          longitude={addNewPins.lng}
          latitude={addNewPins.lat}
          anchor="bottom"
        >
          <IoMdPin size={30} color="rgb(43, 132, 227)" />
        </Marker>
      )}
    </Map>
  );
}

export default MapPage;
