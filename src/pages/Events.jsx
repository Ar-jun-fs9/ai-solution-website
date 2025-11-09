import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Tabs,
  Tab,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faMapMarkerAlt,
  faUsers,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [eventCategories, setEventCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.map((event) => event.category).filter(Boolean)),
        ];
        setEventCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const upcomingEvents = events.filter((event) => event.type === "upcoming");
  const pastEvents = events.filter((event) => event.type === "past");

  const filteredUpcomingEvents =
    selectedCategory === "all"
      ? upcomingEvents
      : upcomingEvents.filter((event) => event.category === selectedCategory);

  const filteredPastEvents =
    selectedCategory === "all"
      ? pastEvents
      : pastEvents.filter((event) => event.category === selectedCategory);

  return (
    <div className="events-page">
      {/* Page Header */}
      <section className="page-header bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-3">Events</h1>
              <p className="lead mb-0">
                Join us at industry events, workshops, and conferences
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Category Filter */}
      <section className="category-filter py-4 bg-light">
        <Container>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {eventCategories.map((category, index) => (
              <Button
                key={index}
                variant={
                  selectedCategory === category ? "primary" : "outline-primary"
                }
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* Events Tabs */}
      <section className="events-tabs py-5">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <Alert variant="danger">
                <h5>Failed to load events</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <Tabs defaultActiveKey="upcoming" className="mb-4">
              <Tab
                eventKey="upcoming"
                title={`Upcoming Events (${filteredUpcomingEvents.length})`}
              >
                <Row>
                  {filteredUpcomingEvents.map((event) => (
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
                              e.target.nextElementSibling.style.display =
                                "flex";
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
                              size="4x"
                              className="text-primary"
                            />
                          </div>
                        </div>
                        <Card.Body className="p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <Badge bg="primary">{event.type}</Badge>
                            {/* <small className="text-muted">{event.date}</small> */}
                            <small className="text-muted">
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </small>
                          </div>

                          <Card.Title className="h5 fw-bold mb-3">
                            {event.title}
                          </Card.Title>
                          <Card.Text className="text-muted mb-3">
                            {event.description}
                          </Card.Text>

                          <div className="mb-3">
                            {event.time && (
                              <div className="d-flex align-items-center mb-2">
                                <FontAwesomeIcon
                                  icon={faClock}
                                  className="text-muted me-2"
                                />
                                <small className="text-muted">
                                  {event.time}
                                </small>
                              </div>
                            )}
                            {event.location && (
                              <div className="d-flex align-items-center mb-2">
                                <FontAwesomeIcon
                                  icon={faMapMarkerAlt}
                                  className="text-muted me-2"
                                />
                                <small className="text-muted">
                                  {event.location}
                                </small>
                              </div>
                            )}
                            {(event.current_attendees || event.attendees) && (
                              <div className="d-flex align-items-center">
                                <FontAwesomeIcon
                                  icon={faUsers}
                                  className="text-muted me-2"
                                />
                                <small className="text-muted">
                                  {event.current_attendees || event.attendees}{" "}
                                  attendees
                                </small>
                              </div>
                            )}
                          </div>

                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              {event.is_free ? (
                                <Badge bg="success">Free</Badge>
                              ) : event.price ? (
                                <span className="text-primary fw-bold">
                                  {event.price}
                                </span>
                              ) : null}
                            </div>
                            {event.registration_link && (
                              <Button
                                variant="primary"
                                href={event.registration_link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FontAwesomeIcon
                                  icon={faExternalLinkAlt}
                                  className="me-2"
                                />
                                {event.is_free ? "Register" : "Learn More"}
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}

                  {filteredUpcomingEvents.length === 0 && (
                    <Col className="text-center py-5">
                      <h4 className="text-muted">No upcoming events found</h4>
                      <p className="text-muted">
                        Try selecting a different category or check back later.
                      </p>
                    </Col>
                  )}
                </Row>
              </Tab>

              <Tab
                eventKey="past"
                title={`Past Events (${filteredPastEvents.length})`}
              >
                <Row>
                  {filteredPastEvents.map((event) => (
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
                              e.target.nextElementSibling.style.display =
                                "flex";
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
                              size="4x"
                              className="text-primary"
                            />
                          </div>
                        </div>
                        <Card.Body className="p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <Badge bg="secondary">{event.type}</Badge>
                            {/* <small className="text-muted">{event.date}</small> */}
                            <small className="text-muted">
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </small>
                          </div>

                          <Card.Title className="h5 fw-bold mb-3">
                            {event.title}
                          </Card.Title>
                          <Card.Text className="text-muted mb-3">
                            {event.description}
                          </Card.Text>

                          <div className="mb-3">
                            {event.time && (
                              <div className="d-flex align-items-center mb-2">
                                <FontAwesomeIcon
                                  icon={faClock}
                                  className="text-muted me-2"
                                />
                                <small className="text-muted">
                                  {event.time}
                                </small>
                              </div>
                            )}
                            {event.location && (
                              <div className="d-flex align-items-center mb-2">
                                <FontAwesomeIcon
                                  icon={faMapMarkerAlt}
                                  className="text-muted me-2"
                                />
                                <small className="text-muted">
                                  {event.location}
                                </small>
                              </div>
                            )}
                            {(event.current_attendees || event.attendees) && (
                              <div className="d-flex align-items-center">
                                <FontAwesomeIcon
                                  icon={faUsers}
                                  className="text-muted me-2"
                                />
                                <small className="text-muted">
                                  {event.current_attendees || event.attendees}{" "}
                                  attendees
                                </small>
                              </div>
                            )}
                          </div>

                          {event.highlights && event.highlights.length > 0 && (
                            <div className="mb-3">
                              <h6 className="fw-bold mb-2">Highlights:</h6>
                              <ul className="list-unstyled">
                                {event.highlights.map((highlight, index) => (
                                  <li
                                    key={index}
                                    className="text-muted small mb-1"
                                  >
                                    <FontAwesomeIcon
                                      icon={faClock}
                                      className="text-primary me-2"
                                    />
                                    {highlight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}

                  {filteredPastEvents.length === 0 && (
                    <Col className="text-center py-5">
                      <h4 className="text-muted">No past events found</h4>
                      <p className="text-muted">
                        Try selecting a different category.
                      </p>
                    </Col>
                  )}
                </Row>
              </Tab>
            </Tabs>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Events;
