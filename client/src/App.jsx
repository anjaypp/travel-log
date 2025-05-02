import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import MapPage from "./pages/MapPage/MapPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ProtectedLayout from "./components/ProtectedLayout/ProtectedLayout";


function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute />}>
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <MapPage />
            </ProtectedLayout>
          }
        />
      </Route>
      </Routes>
    </>
  );
}

export default App;
