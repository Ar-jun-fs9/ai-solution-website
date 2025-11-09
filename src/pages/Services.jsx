import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  ListGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheck,
  faLightbulb,
  faRocket,
  faShield,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/services");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const getServiceIcon = (iconName) => {
    const iconMap = {
      "fa-code": faCog,
      "fa-link": faRocket,
      "fa-cloud": faLightbulb,
      "fa-brain": faLightbulb,
      "fa-lightbulb": faLightbulb,
      "fa-mobile-alt": faRocket,
    };
    return iconMap[iconName] || faCog;
  };

  return (
    <div className="services-page">
      {/* Page Header */}
      <section className="page-header  text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-3">Our Services</h1>
              <p className="lead mb-0">
                Comprehensive software solutions designed to transform your
                business and drive innovation
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Overview */}
      <section className="services-overview py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="display-6 fw-bold mb-4">What We Offer</h2>
              <p className="lead text-muted">
                We provide end-to-end software solutions that help businesses
                modernize their operations, improve efficiency, and gain
                competitive advantages in today's digital landscape.
              </p>
            </Col>
          </Row>

          {/* Services Grid */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" className="mb-1" />
              <p className="text-muted">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <Alert variant="danger">
                <h5>Failed to load services</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <Row>
              {services.map((service) => (
                <Col lg={4} md={6} className="mb-4" key={service.id}>
                  <Card className="h-100 border-0 shadow-sm service-card">
                    <Card.Body className="p-4">
                      <div className="text-center mb-4">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="rounded-circle mb-3"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="service-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 d-none"
                          style={{ width: "80px", height: "80px" }}
                        >
                          <FontAwesomeIcon
                            icon={getServiceIcon(service.icon)}
                            size="3x"
                          />
                        </div>
                      </div>

                      <Card.Title className="h4 fw-bold text-center mb-3">
                        {service.title}
                      </Card.Title>
                      <Card.Text className="text-muted text-center mb-4">
                        {service.description}
                      </Card.Text>

                      <div className="text-center mb-4">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleServiceClick(service)}
                          className="px-4"
                        >
                          Learn More{" "}
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="ms-2"
                          />
                        </Button>
                      </div>

                      {/* Quick Features Preview */}
                      <div className="service-features-preview">
                        <h6 className="fw-bold mb-3">Key Features:</h6>
                        <ul className="list-unstyled">
                          {(service.features || [])
                            .slice(0, 3)
                            .map((feature, index) => (
                              <li key={index} className="mb-2">
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className="text-success me-2"
                                />
                                <small className="text-muted">{feature}</small>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-6 fw-bold mb-4">
                Why Choose AI Solution?
              </h2>
              <p className="lead text-muted">
                We deliver exceptional value through our proven expertise and
                commitment to excellence
              </p>
            </Col>
          </Row>

          <Row>
            <Col lg={3} md={6} className="mb-4">
              <div className="text-center">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <FontAwesomeIcon icon={faRocket} size="3x" />
                </div>
                <h5 className="fw-bold mb-3">Fast Delivery</h5>
                <p className="text-muted">
                  Agile development methodology ensures rapid delivery of
                  high-quality solutions
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="text-center">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <FontAwesomeIcon icon={faShield} size="3x" />
                </div>
                <h5 className="fw-bold mb-3">Quality Assurance</h5>
                <p className="text-muted">
                  Rigorous testing and quality control processes ensure
                  reliable, bug-free software
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="text-center">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <FontAwesomeIcon icon={faLightbulb} size="3x" />
                </div>
                <h5 className="fw-bold mb-3">Innovation</h5>
                <p className="text-muted">
                  Cutting-edge technologies and creative solutions to solve
                  complex business challenges
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="text-center">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <FontAwesomeIcon icon={faCog} size="3x" />
                </div>
                <h5 className="fw-bold mb-3">Ongoing Support</h5>
                <p className="text-muted">
                  Continuous support and maintenance to ensure your systems run
                  smoothly
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-6 fw-bold mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Let's discuss your project requirements and create a custom
                solution that drives your business forward.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button variant="light" size="lg" href="/contact">
                  Get Free Consultation
                </Button>
                <Button variant="outline-light" size="lg" href="/case-studies">
                  View Our Work
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Service Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedService?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <div>
              <div className="text-center mb-1">
                {selectedService.image ? (
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="rounded-circle mb-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="service-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 d-none"
                  style={{ width: "80px", height: "80px" }}
                >
                  <FontAwesomeIcon
                    icon={getServiceIcon(selectedService.icon)}
                    size="3x"
                  />
                </div>
                <h4 className="fw-bold">{selectedService.title}</h4>
                <p className="text-muted">{selectedService.longDescription}</p>
              </div>

              <Row>
                <Col md={6}>
                  <h5 className="fw-bold mb-3">Features</h5>
                  <ListGroup variant="flush">
                    {(selectedService.features || []).map((feature, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex align-items-start"
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-success me-2 mt-1"
                        />
                        {feature}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <h5 className="fw-bold mb-3">Benefits</h5>
                  <ListGroup variant="flush">
                    {(selectedService.benefits || []).map((benefit, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex align-items-start"
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-success me-2 mt-1"
                        />
                        {benefit}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" href="/contact">
            Get Started
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Services;
