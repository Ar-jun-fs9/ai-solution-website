import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faStar,
  faUsers,
  faChartLine,
  faAward,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [services, setServices] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data from APIs
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          servicesResponse,
          caseStudiesResponse,
          testimonialsResponse,
          blogResponse,
          eventsResponse,
        ] = await Promise.all([
          fetch("http://localhost:5000/api/services"),
          fetch("http://localhost:5000/api/case-studies"),
          fetch("http://localhost:5000/api/testimonials"),
          fetch("http://localhost:5000/api/blog"),
          fetch("http://localhost:5000/api/events"),
        ]);

        if (
          !servicesResponse.ok ||
          !caseStudiesResponse.ok ||
          !testimonialsResponse.ok ||
          !blogResponse.ok ||
          !eventsResponse.ok
        ) {
          throw new Error("Failed to fetch data from one or more APIs");
        }

        const [
          servicesData,
          caseStudiesData,
          testimonialsData,
          blogData,
          eventsData,
        ] = await Promise.all([
          servicesResponse.json(),
          caseStudiesResponse.json(),
          testimonialsResponse.json(),
          blogResponse.json(),
          eventsResponse.json(),
        ]);

        setServices(servicesData);
        setCaseStudies(caseStudiesData);
        setTestimonials(testimonialsData);
        setBlogPosts(blogData);
        setUpcomingEvents(
          eventsData.filter((event) => event.type === "upcoming")
        );
      } catch (error) {
        console.error("Error fetching home page data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const featuredServices = services.slice(0, 3);
  const featuredCaseStudies = caseStudies.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);
  const featuredBlogPosts = blogPosts
    .filter((post) => post.featured)
    .slice(0, 3);

  // If no featured posts, show the most recent posts
  const latestBlogPosts =
    featuredBlogPosts.length > 0 ? featuredBlogPosts : blogPosts.slice(0, 3);
  const featuredEvents = upcomingEvents.slice(0, 2);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">
                Innovative Software Solutions for Modern Businesses
              </h1>
              <p className="lead mb-4">
                We specialize in custom software development, system
                integration, and digital transformation services that drive
                efficiency, growth, and competitive advantage for enterprises
                worldwide.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button variant="light" size="lg" as={Link} to="/contact">
                  Get Free Consultation
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  as={Link}
                  to="/services"
                >
                  Explore Services
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <img
                  src="/uploads/newlog.jpg"
                  alt="Technology Innovation Hub"
                  className="img-fluid rounded-3 shadow-lg"
                  style={{
                    maxHeight: "400px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-4">
              <div className="stat-item">
                <FontAwesomeIcon
                  icon={faUsers}
                  size="3x"
                  className="text-primary mb-3"
                />
                <h3 className="fw-bold text-primary">500+</h3>
                <p className="text-muted">Happy Clients</p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="stat-item">
                <FontAwesomeIcon
                  icon={faChartLine}
                  size="3x"
                  className="text-primary mb-3"
                />
                <h3 className="fw-bold text-primary">1000+</h3>
                <p className="text-muted">Projects Completed</p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="stat-item">
                <FontAwesomeIcon
                  icon={faAward}
                  size="3x"
                  className="text-primary mb-3"
                />
                <h3 className="fw-bold text-primary">15+</h3>
                <p className="text-muted">Years Experience</p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="stat-item">
                <FontAwesomeIcon
                  icon={faStar}
                  size="3x"
                  className="text-primary mb-3"
                />
                <h3 className="fw-bold text-primary">4.9/5</h3>
                <p className="text-muted">Client Rating</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="about-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4">About AI Solution</h2>
              <p className="lead mb-4">
                We are a leading technology company specializing in innovative
                software solutions that transform businesses and drive digital
                innovation.
              </p>
              <p className="mb-4">
                With over 15 years of experience, our team of experts has
                successfully delivered cutting-edge solutions across various
                industries including manufacturing, healthcare, finance, and
                retail. We pride ourselves on understanding our clients' unique
                challenges and delivering tailored solutions that exceed
                expectations.
              </p>
              <Button variant="primary" size="lg" as={Link} to="/services">
                Learn More About Us
              </Button>
            </Col>
            <Col lg={6}>
              <div className="about-image-placeholder bg-light rounded-3 p-5 text-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  size="6x"
                  className="text-primary"
                />
                <p className="mt-3 mb-0">Our Expert Team</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Our Services</h2>
            <p className="lead text-muted">
              Comprehensive software solutions designed to meet your business
              needs
            </p>
          </div>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <Alert variant="danger">
                <h5>Failed to load services</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <>
              <Row>
                {featuredServices.map((service) => (
                  <Col lg={4} md={6} className="mb-4" key={service.id}>
                    <Card className="h-100 border-0 shadow-sm pb-2">
                      <Card.Body className="p-4">
                        <div className="text-center mb-3">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.title}
                              className="rounded-circle mb-3"
                              style={{
                                width: "60px",
                                height: "60px",
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
                            style={{ width: "60px", height: "60px" }}
                          >
                            <FontAwesomeIcon icon={service.icon} size="2x" />
                          </div>
                        </div>
                        <Card.Title className="h5 fw-bold text-center mb-3">
                          {service.title}
                        </Card.Title>
                        <Card.Text className="text-muted text-center mb-4">
                          {service.description}
                        </Card.Text>
                      </Card.Body>
                      <div className="text-center mb-3">
                        <Button
                          variant="outline-primary"
                          as={Link}
                          to={`/services#${service.id}`}
                        >
                          Learn More{" "}
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="ms-2"
                          />
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <Button variant="primary" size="lg" as={Link} to="/services">
                  View All Services
                </Button>
              </div>
            </>
          )}
        </Container>
      </section>

      {/* Case Studies Section */}
      <section className="case-studies-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Success Stories</h2>
            <p className="lead text-muted">
              Real-world examples of how we've helped businesses transform and
              grow
            </p>
          </div>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading case studies...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <Alert variant="danger">
                <h5>Failed to load case studies</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <>
              <Row>
                {featuredCaseStudies.map((caseStudy) => (
                  <Col lg={4} md={6} className="mb-4" key={caseStudy.id}>
                    <Card className="h-100 border-0 shadow-sm pd-2">
                      {caseStudy.image ? (
                        <img
                          src={caseStudy.image}
                          alt={caseStudy.title}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="case-study-image-placeholder bg-light d-none"
                        style={{ height: "200px" }}
                      >
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <FontAwesomeIcon
                            icon={faChartLine}
                            size="3x"
                            className="text-primary"
                          />
                        </div>
                      </div>
                      <Card.Body className="p-4">
                        {caseStudy.industry && (
                          <Badge bg="primary" className="mb-2">
                            {caseStudy.industry}
                          </Badge>
                        )}
                        <Card.Title className="h5 fw-bold mb-3">
                          {caseStudy.title}
                        </Card.Title>
                        <Card.Text className="text-muted mb-3">
                          {caseStudy.challenge &&
                            caseStudy.challenge.substring(0, 120)}
                          ...
                        </Card.Text>
                        <div className="mb-3">
                          <strong>Results:</strong>
                          <ul className="list-unstyled mt-2">
                            {caseStudy.results &&
                              caseStudy.results
                                .slice(0, 2)
                                .map((result, index) => (
                                  <li key={index} className="text-muted small">
                                    <FontAwesomeIcon
                                      icon={faArrowRight}
                                      className="text-primary me-2"
                                    />
                                    {result}
                                  </li>
                                ))}
                          </ul>
                        </div>
                        <Button
                          variant="outline-primary"
                          as={Link}
                          to={`/case-studies/`}
                        >
                          Read Full Case Study
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  as={Link}
                  to="/case-studies"
                >
                  View All Case Studies
                </Button>
              </div>
            </>
          )}
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">What Our Clients Say</h2>
            <p className="lead text-muted">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading testimonials...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <Alert variant="danger">
                <h5>Failed to load testimonials</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <>
              <Row>
                {featuredTestimonials.map((testimonial) => (
                  <Col lg={4} md={6} className="mb-4" key={testimonial.id}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="testimonial-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: "50px", height: "50px" }}
                          >
                            <FontAwesomeIcon icon={faUsers} />
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
                          {testimonial.rating &&
                            [...Array(testimonial.rating)].map((_, index) => (
                              <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className="text-warning"
                              />
                            ))}
                        </div>
                        <Card.Text className="text-muted">
                          "
                          {testimonial.text &&
                            testimonial.text.substring(0, 150)}
                          ..."
                        </Card.Text>
                        <Button
                          variant="outline-primary"
                          as={Link}
                          to={`/feedback/`}
                        >
                          Read Full Feedback
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="text-center mt-4">
                <Button variant="primary" size="lg" as={Link} to="/feedback">
                  View All Testimonials
                </Button>
              </div>
            </>
          )}
        </Container>
      </section>

      {/* Blog Section */}
      <section className="blog-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Latest Insights</h2>
            <p className="lead text-muted">
              Stay updated with the latest trends and insights in technology
            </p>
          </div>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <Alert variant="danger">
                <h5>Failed to load blog posts</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <>
              <Row>
                {latestBlogPosts.map((post) => (
                  <Col lg={4} md={6} className="mb-4" key={post.id}>
                    <Card className="h-100 border-0 shadow-sm">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="blog-image-placeholder bg-light d-none"
                        style={{ height: "200px" }}
                      >
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <FontAwesomeIcon
                            icon={faUsers}
                            size="3x"
                            className="text-primary"
                          />
                        </div>
                      </div>
                      <Card.Body className="p-4">
                        {post.category && (
                          <Badge bg="secondary" className="mb-2">
                            {post.category}
                          </Badge>
                        )}
                        <Card.Title className="h5 fw-bold mb-3">
                          {post.title}
                        </Card.Title>
                        <Card.Text className="text-muted mb-3">
                          {post.excerpt}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {post.read_time || post.readTime}
                          </small>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as={Link}
                            to={`/blog/`}
                          >
                            Read More
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <Button variant="primary" size="lg" as={Link} to="/blog">
                  View All Articles
                </Button>
              </div>
            </>
          )}
        </Container>
      </section>

      {/* Events Section */}
      <section className="events-section py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Upcoming Events</h2>
            <p className="lead text-muted">
              Join us at industry events and workshops
            </p>
          </div>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <Alert variant="danger">
                <h5>Failed to load events</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <>
              <Row>
                {featuredEvents.map((event) => (
                  <Col lg={6} className="mb-4" key={event.id}>
                    <Card className="h-100 border-0 shadow-sm">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="event-image-placeholder bg-light d-none"
                        style={{ height: "200px" }}
                      >
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <FontAwesomeIcon
                            icon={faCalendar}
                            size="3x"
                            className="text-primary"
                          />
                        </div>
                      </div>
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <Badge bg="primary">{event.type}</Badge>
                          <small className="text-muted">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </small>
                        </div>
                        <Card.Title className="h5 fw-bold mb-3">
                          {event.title}
                        </Card.Title>
                        <Card.Text className="text-muted mb-3">
                          {event.description}
                        </Card.Text>
                        <div className="mb-3">
                          <small className="text-muted">
                            {event.location && (
                              <>
                                <strong>Location:</strong> {event.location}
                                <br />
                              </>
                            )}
                            {event.time && (
                              <>
                                <strong>Time:</strong> {event.time}
                              </>
                            )}
                          </small>
                        </div>
                        <Button variant="primary" as={Link} to={`/events/`}>
                          Learn More
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <Button variant="primary" size="lg" as={Link} to="/events">
                  View All Events
                </Button>
              </div>
            </>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-dark text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-6 fw-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="lead mb-4">
                Let's discuss how our innovative software solutions can help you
                achieve your goals and stay ahead of the competition.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button variant="light" size="lg" as={Link} to="/contact">
                  Get Started Today
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  as={Link}
                  to="/services"
                >
                  Explore Our Services
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
