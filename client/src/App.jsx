import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import NavigationBar from "./components/Navbar/NavigationBar";
import MapPage from "./pages/MapPage/MapPage";

function App() {
  return (
    <>
      <NavigationBar />
      <MapPage />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
