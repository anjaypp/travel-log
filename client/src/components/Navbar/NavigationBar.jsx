import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { FaMapMarkedAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

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
            {isAuthenticated ? (
              <Button variant="dark" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  <Button variant="outline-dark" className="me-2">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="nav-link">
                  <Button variant="dark">Sign Up</Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
