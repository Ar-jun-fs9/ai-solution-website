import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  return (
    <div className="not-found-page min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={6}>
            <div className="mb-4">
              <h1 className="display-1 fw-bold text-muted">404</h1>
              <h2 className="h3 fw-bold mb-3">Oops! Page Not Found</h2>
              <p className="lead text-muted mb-4">
                The page you're looking for doesn't exist or has been moved. 
                Don't worry, we're here to help you find what you need.
              </p>
            </div>

            <div className="mb-5">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px' }}>
                <FontAwesomeIcon icon={faSearch} size="4x" />
              </div>
            </div>

            <div className="d-grid gap-3 d-md-flex justify-content-md-center">
              <Button variant="primary" size="lg" as={Link} to="/">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                Go to Homepage
              </Button>
              <Button variant="outline-primary" size="lg" as={Link} to="/services">
                Explore Our Services
              </Button>
              <Button variant="outline-primary" size="lg" as={Link} to="/contact">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                Contact Us
              </Button>
            </div>

            <div className="mt-5">
              <h5 className="fw-bold mb-3">Popular Pages</h5>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link to="/services" className="btn btn-outline-secondary btn-sm">
                  Services
                </Link>
                <Link to="/case-studies" className="btn btn-outline-secondary btn-sm">
                  Case Studies
                </Link>
                <Link to="/blog" className="btn btn-outline-secondary btn-sm">
                  Blog
                </Link>
                <Link to="/events" className="btn btn-outline-secondary btn-sm">
                  Events
                </Link>
                <Link to="/gallery" className="btn btn-outline-secondary btn-sm">
                  Gallery
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
