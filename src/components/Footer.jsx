import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    // Implement newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-white text-white py-5">
      <Container>
        <Row>
          {/* Company Info */}
          <Col lg={4} md={6} className="mb-4">
            <h5 className="text-primary mb-3">AI Solution</h5>
            <p className="text-dark">
              Innovative software solutions for modern businesses. We specialize
              in custom software development, system integration, and digital
              transformation services.
            </p>
            <div className="d-flex align-items-center mb-2 text-dark">
              <FontAwesomeIcon icon={faPhone} className="me-2 text-primary" />
              <span>+977 981-765-9722</span>
            </div>
            <div className="d-flex align-items-center mb-2 text-dark">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="me-2 text-primary "
              />
              <span>info@aisolution.com</span>
            </div>
            <div className="d-flex align-items-center text-dark">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="me-2 text-primary"
              />
              <span>749 New Road Street, Kathmandu Valley, CA 44600</span>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-primary mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-black text-decoration-none ">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/services"
                  className="text-black text-decoration-none"
                >
                  Services
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/case-studies"
                  className="text-black text-decoration-none"
                >
                  Case Studies
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/blog" className="text-black text-decoration-none">
                  Blog
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-black text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>

          {/* Services */}
          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-primary mb-3">Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/services"
                  className="text-black text-decoration-none"
                >
                  Custom Software
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/services"
                  className="text-black text-decoration-none"
                >
                  System Integration
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/services"
                  className="text-black text-decoration-none"
                >
                  Cloud Solutions
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/services"
                  className="text-black text-decoration-none"
                >
                  AI & Machine Learning
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/services"
                  className="text-black text-decoration-none"
                >
                  Consulting
                </Link>
              </li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col lg={4} md={6} className="mb-4">
            <h6 className="text-primary mb-3">Newsletter</h6>
            <p className="text-black mb-3">
              Subscribe to our newsletter for the latest updates, industry
              insights, and company news.
            </p>
            <Form onSubmit={handleNewsletterSignup}>
              <div className="d-flex">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="me-2 border border-black"
                  required
                />
                <Button variant="primary" type="submit">
                  Subscribe
                </Button>
              </div>
            </Form>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Bottom Footer */}
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <p className="text-black mb-0">
              © 2025 AI Solution. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end">
              <Link
                to="/privacy"
                className="text-black text-decoration-none me-3"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-black text-decoration-none me-3"
              >
                Terms & Conditions
              </Link>
              <Link to="/sitemap" className="text-black text-decoration-none">
                Sitemap
              </Link>
            </div>
          </Col>
        </Row>

        {/* Social Media */}
        <Row className="mt-3">
          <Col className="text-center">
            <div className="d-flex justify-content-center">
              <a href="#" className="text-black me-3 fs-5">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="text-black me-3 fs-5">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-black me-3 fs-5">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="#" className="text-black me-3 fs-5">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="text-black fs-5">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
