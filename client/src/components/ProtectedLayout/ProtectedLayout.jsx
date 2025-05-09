import React from "react";
import NavigationBar from "../Navbar/NavigationBar";

const ProtectedLayout = ({ children }) => {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
};

export default ProtectedLayout;
