import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import { IoMdPin } from "react-icons/io";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapPage.css"
import PinPopupView from "../../components/Popup/PinPopupView/PinPopupView";
import PinForm from "../../components/Popup/PinForm/PinForm";

function MapPage() {
  const [pins, setPins] = useState([]);
  const [addNewPins, setNewPins] = useState(null);
  const [currentPopupId, setCurrentPopupId] = useState(null);

  const handleMarkerClick = (id) => setCurrentPopupId(id);

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
          <Marker
            onClick={() => handleMarkerClick(pin._id)}
            longitude={pin.location.lng}
            latitude={pin.location.lat}
            anchor="bottom"
          >
            <IoMdPin className="existing-pins" />
          </Marker>

          {currentPopupId === pin._id && (

          <Popup
            className="custom-popup"
            longitude={pin.location.lng}
            latitude={pin.location.lat}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setCurrentPopupId(null)}

          >
            <PinPopupView pin={pin} />
          </Popup>
             )}
        </React.Fragment>
      ))}

      {/* New pin on map click */}
      {addNewPins && (
        <>
        <Marker
          longitude={addNewPins.lng}
          latitude={addNewPins.lat}
          anchor="bottom"
        >
          <IoMdPin className="new-pins" />
        </Marker>
       
       <Popup
       className="custom-popup"
       longitude={addNewPins.lng}
       latitude={addNewPins.lat}
       closeButton={true}
       closeOnClick={false}
       anchor="left"
       onClose={() => setNewPins(null)}
       >
        <PinForm
          location={addNewPins}
          onSuccess={(newPin) => {
            setPins((prev) => [...prev, newPin]);
            setNewPins(null);
          }}
        />
       </Popup>
       </>
      )}
    </Map>
  );
}

export default MapPage;
