import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

const Feedback = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/testimonials");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTestimonials(data);

        // Calculate rating stats
        if (data.length > 0) {
          const totalRating = data.reduce(
            (sum, testimonial) => sum + testimonial.rating,
            0
          );
          const averageRating = (totalRating / data.length).toFixed(1);
          setRatingStats({
            averageRating: parseFloat(averageRating),
            totalReviews: data.length,
          });
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="feedback-page">
      {/* Page Header */}
      <section className="page-header bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-3">Client Feedback</h1>
              <p className="lead mb-0">
                Hear from our satisfied clients about their experience working
                with us
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Rating Stats */}
      <section className="rating-stats py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col lg={4} className="mb-4">
              <div className="bg-white rounded-3 p-4 shadow-sm">
                <h2 className="display-4 fw-bold text-primary mb-2">
                  {ratingStats.averageRating}
                </h2>
                {/* <div className="mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className="text-warning"
                    />
                  ))}
                </div> */}
                <p className="text-muted mb-0">Average Rating</p>
              </div>
            </Col>
            <Col lg={4} className="mb-4">
              <div className="bg-white rounded-3 p-4 shadow-sm">
                <h2 className="display-4 fw-bold text-primary mb-2">
                  {ratingStats.totalReviews}
                </h2>
                <p className="text-muted mb-0">Total Reviews</p>
              </div>
            </Col>
            <Col lg={4} className="mb-4">
              <div className="bg-white rounded-3 p-4 shadow-sm">
                <h2 className="display-4 fw-bold text-primary mb-2">500+</h2>
                <p className="text-muted mb-0">Happy Clients</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Grid */}
      <section className="testimonials-grid py-5">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading testimonials...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <Alert variant="danger">
                <h5>Failed to load testimonials</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <Row>
              {testimonials.map((testimonial) => (
                <Col lg={6} className="mb-4" key={testimonial.id}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-start mb-3">
                        <div
                          className="testimonial-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <FontAwesomeIcon icon={faQuoteLeft} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">{testimonial.name}</h6>
                          <p className="text-muted small mb-0">
                            {testimonial.position}
                          </p>
                          <p className="text-muted small mb-0">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        {[...Array(testimonial.rating || 5)].map((_, index) => (
                          <FontAwesomeIcon
                            key={index}
                            icon={faStar}
                            className="text-warning"
                          />
                        ))}
                      </div>

                      <Card.Text className="text-muted mb-3">
                        "{testimonial.text}"
                      </Card.Text>

                      {(testimonial.project || testimonial.industry) && (
                        <div>
                          {testimonial.project && (
                            <Badge bg="secondary" className="mb-2 me-2">
                              {testimonial.project}
                            </Badge>
                          )}
                          {testimonial.industry && (
                            <Badge bg="info" className="mb-2">
                              {testimonial.industry}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Feedback;
