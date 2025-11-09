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
  faChartLine,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch case studies from API
  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/case-studies");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCaseStudies(data);
      } catch (error) {
        console.error("Error fetching case studies:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  const handleCaseStudyClick = (caseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setShowModal(true);
  };

  return (
    <div className="case-studies-page">
      {/* Page Header */}
      <section className="page-header bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-3">Case Studies</h1>
              <p className="lead mb-0">
                Real-world examples of how we've helped businesses transform and
                achieve remarkable results
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Case Studies Grid */}
      <section className="case-studies-grid py-5">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading case studies...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <Alert variant="danger">
                <h5>Failed to load case studies</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <Row>
              {caseStudies.map((caseStudy) => (
                <Col lg={6} className="mb-4" key={caseStudy.id}>
                  <Card className="h-100 border-0 shadow-sm">
                    {caseStudy.image ? (
                      <img
                        src={caseStudy.image}
                        alt={caseStudy.title}
                        className="card-img-top"
                        style={{ height: "250px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="case-study-image-placeholder bg-light d-none"
                      style={{ height: "250px" }}
                    >
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <FontAwesomeIcon
                          icon={faChartLine}
                          size="4x"
                          className="text-primary"
                        />
                      </div>
                    </div>
                    <Card.Body className="p-4">
                      <Badge bg="primary" className="mb-2">
                        {caseStudy.industry}
                      </Badge>
                      <Card.Title className="h4 fw-bold mb-3">
                        {caseStudy.title}
                      </Card.Title>
                      <Card.Text className="text-muted mb-3">
                        {caseStudy.challenge?.substring(0, 150)}...
                      </Card.Text>

                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Key Results:</h6>
                        <ul className="list-unstyled">
                          {(caseStudy.results || [])
                            .slice(0, 3)
                            .map((result, index) => (
                              <li key={index} className="text-muted small mb-1">
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="text-primary me-2"
                                />
                                {result}
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <strong>Duration:</strong> {caseStudy.duration} |{" "}
                          <strong>Team:</strong> {caseStudy.team_size}
                        </small>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleCaseStudyClick(caseStudy)}
                        >
                          Read Full Case Study
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Case Study Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedCaseStudy?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCaseStudy && (
            <div>
              {/* Image */}
              {selectedCaseStudy.image && (
                <div className="text-center mb-4">
                  <img
                    src={selectedCaseStudy.image}
                    alt={selectedCaseStudy.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Client and Industry */}
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Client:</strong> {selectedCaseStudy.client}
                </Col>
                <Col md={6}>
                  <strong>Industry:</strong> {selectedCaseStudy.industry}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Duration:</strong> {selectedCaseStudy.duration}
                </Col>
                <Col md={6}>
                  <strong>Team Size:</strong> {selectedCaseStudy.team_size}
                </Col>
              </Row>

              {/* Challenge */}
              <h5 className="fw-bold mb-3">Challenge</h5>
              <p className="text-muted mb-4">{selectedCaseStudy.challenge}</p>

              {/* Solution */}
              <h5 className="fw-bold mb-3">Solution</h5>
              <p className="text-muted mb-4">{selectedCaseStudy.solution}</p>

              {/* Results */}
              <h5 className="fw-bold mb-3">Results</h5>
              <ListGroup variant="flush" className="mb-4">
                {selectedCaseStudy.results.map((result, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex align-items-start"
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-success me-2 mt-1"
                    />
                    {result}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* Technologies */}
              <h5 className="fw-bold mb-3">Technologies Used</h5>
              <div className="mb-4">
                {selectedCaseStudy.technologies.map((tech, index) => (
                  <Badge key={index} bg="secondary" className="me-2 mb-2">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Testimonial */}
              {selectedCaseStudy.testimonial && (
                <div className="bg-light p-3 rounded">
                  <h6 className="fw-bold mb-2">Client Testimonial</h6>
                  <blockquote className="mb-2">
                    "{selectedCaseStudy.testimonial.text}"
                  </blockquote>
                  <footer className="text-muted small">
                    - {selectedCaseStudy.testimonial.author},{" "}
                    {selectedCaseStudy.testimonial.position} at{" "}
                    {selectedCaseStudy.testimonial.company}
                  </footer>
                </div>
              )}
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

export default CaseStudies;
