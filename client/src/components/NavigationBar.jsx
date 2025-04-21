import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { FaMapMarkedAlt } from "react-icons/fa";

const NavigationBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <FaMapMarkedAlt
            style={{
              marginRight: "10px",
              paddingBottom: "5px",
              height: "30px",
              width: "30px"
            }}
          />
          MapVerse
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Button variant="outline-dark" className="me-2">
              Login
            </Button>
            <Button variant="dark">Sign Up</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
