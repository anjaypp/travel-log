import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axios";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import { IoMdPin } from "react-icons/io";
import { toast } from "react-hot-toast";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapPage.css";
import PinPopupView from "../../components/Popup/PinPopupView/PinPopupView";
import PinForm from "../../components/Popup/PinForm/PinForm";

function MapPage() {
  const [pins, setPins] = useState([]);
  const [addNewPins, setNewPins] = useState(null);
  const [currentPopupId, setCurrentPopupId] = useState(null);
  const hasFetched = useRef(false);


  const handleMarkerClick = (id) => setCurrentPopupId(id);

  // Fetch pins
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const getPins = async () => {
      const toastId = toast.loading("Loading pins...");
      try {
        const res = await axiosInstance.get("/logs");
        setPins(res.data);
        toast.dismiss(toastId);
        toast.success("Pins loaded successfully");
      } catch (err) {
        toast.dismiss(toastId);
        const message = err.response?.data?.message || "Failed to fetch pins";
        toast.error(message);
      }
    };
    getPins();
  }, []);

  //Handle map click
  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPins({ lat, lng });
  };

  // Handle edit submission from EditPinForm
  const handleEditPinSubmit = async (formData, pinId) => {
    const toastId = toast.loading("Updating pin...");
    try {
      const res = await axiosInstance.put(`/logs/${pinId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setPins((prev) =>
        prev.map((pin) => (pin._id === pinId ? res.data : pin))
      );
      setCurrentPopupId(null);
      toast.dismiss(toastId);
      toast.success("Pin updated successfully");
    } catch (err) {
      toast.dismiss(toastId);
      const message = err.response?.data?.message || "Failed to update pin";
      toast.error(message);
    }
  };

  // Handle delete pin
  const handleDeletePin = async (pinId) => {
    const toastId = toast.loading("Deleting pin...");
    try {
      await axiosInstance.delete(`/logs/${pinId}`);
      setPins((prev) => prev.filter((pin) => pin._id !== pinId));
      setCurrentPopupId(null);
      toast.dismiss(toastId);
      toast.success("Pin deleted successfully");
    } catch (err) {
      toast.dismiss(toastId);
      const message = err.response?.data?.message || "Failed to delete pin";
      toast.error(message);
    }
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
              <PinPopupView
                pin={pin}
                onEditSubmit={(formData) =>
                  handleEditPinSubmit(formData, pin._id)
                }
                onDelete={() => handleDeletePin(pin._id)}
              />
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
