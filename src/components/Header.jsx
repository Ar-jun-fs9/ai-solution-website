import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-dark text-white py-2">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faPhone} className="me-2" />
              <span className="me-3">+977 981-765-9722</span>
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              <span>info@aisolution.com</span>
            </div>
            <div>
              <Button variant="outline-light" size="sm" as={Link} to="/contact">
                Get Free Quote
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Primary Navigation Bar */}
      <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-3 text-primary d-flex align-items-center"
          >
            <img
              src="/src/media/Finalogo.png"
              alt="AI Solution Logo"
              className="me-2"
              style={{ height: "40px", width: "auto" }}
            />
            {/* AI Solution */}
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="primary-navbar-nav" />
          <Navbar.Collapse id="primary-navbar-nav">
            {/* Search Bar */}
            <Form className="d-flex me-3" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Search our services..."
                className="me-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-primary" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Form>

            {/* Primary Navigation Links - Right Aligned */}
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={
                  isActive("/") ? "active fw-bold text-primary" : "text-dark"
                }
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/services"
                className={
                  isActive("/services")
                    ? "active fw-bold text-primary"
                    : "text-dark"
                }
              >
                Services
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className={
                  isActive("/contact")
                    ? "active fw-bold text-primary"
                    : "text-dark"
                }
              >
                Contact Us
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Secondary Navigation Bar */}
      <Navbar bg="light" expand="lg" className="py-1">
        <Container>
          <Navbar.Toggle
            aria-controls="secondary-navbar-nav"
            className="ms-auto"
          />
          <Navbar.Collapse id="secondary-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link
                as={Link}
                to="/gallery"
                className={
                  isActive("/gallery")
                    ? "active fw-bold text-primary"
                    : "text-muted"
                }
              >
                Gallery
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/case-studies"
                className={
                  isActive("/case-studies")
                    ? "active fw-bold text-primary"
                    : "text-muted"
                }
              >
                Case Studies
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/events"
                className={
                  isActive("/events")
                    ? "active fw-bold text-primary"
                    : "text-muted"
                }
              >
                Events
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/blog"
                className={
                  isActive("/blog")
                    ? "active fw-bold text-primary"
                    : "text-muted"
                }
              >
                Blog
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/feedback"
                className={
                  isActive("/feedback")
                    ? "active fw-bold text-primary"
                    : "text-muted"
                }
              >
                Customer Feedback
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
