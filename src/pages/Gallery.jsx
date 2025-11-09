import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCalendar, faTag } from "@fortawesome/free-solid-svg-icons";

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryCategories, setGalleryCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add some custom styles
  const galleryStyles = {
    galleryItem: {
      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      cursor: "pointer",
    },
    galleryItemHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15) !important",
    },
  };

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/gallery");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGalleryItems(data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ];
        setGalleryCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const filteredImages =
    selectedCategory === "All"
      ? galleryItems
      : galleryItems.filter((img) => img.category === selectedCategory);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  return (
    <div className="gallery-page">
      {/* Page Header */}
      <section className="page-header bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-3">Photo Gallery</h1>
              <p className="lead mb-0">
                Explore our events, team activities, and project highlights
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Category Filter */}
      <section className="category-filter py-4 bg-light">
        <Container>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {galleryCategories.map((category, index) => (
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

      {/* Gallery Grid */}
      <section className="gallery-grid py-5">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading gallery...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <Alert variant="danger">
                <h5>Failed to load gallery</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <>
              <Row>
                {filteredImages.map((image) => (
                  <Col lg={4} md={6} className="mb-4" key={image.id}>
                    <Card
                      className="border-0 shadow-sm gallery-item"
                      onClick={() => handleImageClick(image)}
                      style={galleryStyles.galleryItem}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          galleryStyles.galleryItemHover.transform;
                        e.currentTarget.style.boxShadow =
                          galleryStyles.galleryItemHover.boxShadow;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          galleryStyles.galleryItem.style.transform;
                        e.currentTarget.style.boxShadow =
                          galleryStyles.galleryItem.style.boxShadow;
                      }}
                    >
                      <div
                        className="gallery-image-container"
                        style={{
                          height: "250px",
                          cursor: "pointer",
                          overflow: "hidden",
                        }}
                      >
                        {image.thumbnail ? (
                          <img
                            src={image.thumbnail}
                            alt={image.title}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`gallery-image-placeholder bg-light d-flex align-items-center justify-content-center h-100 ${
                            image.thumbnail ? "d-none" : ""
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={faImage}
                            size="4x"
                            className="text-primary"
                          />
                        </div>
                      </div>
                      <Card.Body className="p-3">
                        <Card.Title className="h6 fw-bold mb-2">
                          {image.title}
                        </Card.Title>
                        <Card.Text className="text-muted small mb-2">
                          {image.description}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <FontAwesomeIcon
                              icon={faCalendar}
                              className="me-1"
                            />
                            {new Date(image.created_at).toLocaleDateString()}
                          </small>
                          {image.category && (
                            <Badge bg="secondary">{image.category}</Badge>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {filteredImages.length === 0 && (
                <Row>
                  <Col className="text-center py-5">
                    <h4 className="text-muted">No images found</h4>
                    <p className="text-muted">
                      Try selecting a different category.
                    </p>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Container>
      </section>

      {/* Image Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedImage?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <div>
              <div
                className="gallery-image-container mb-3"
                style={{ height: "300px", overflow: "hidden" }}
              >
                {selectedImage.image ? (
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`gallery-image-placeholder bg-light d-flex align-items-center justify-content-center h-100 ${
                    selectedImage.image ? "d-none" : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faImage}
                    size="4x"
                    className="text-primary"
                  />
                </div>
              </div>
              <div className="mb-3">
                <h6 className="fw-bold">{selectedImage.title}</h6>
                <p className="text-muted mb-2">{selectedImage.description}</p>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <small className="text-muted">
                    <FontAwesomeIcon icon={faCalendar} className="me-1" />
                    {new Date(selectedImage.created_at).toLocaleDateString()}
                  </small>
                  <Badge bg="info">{selectedImage.category}</Badge>
                </div>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {selectedImage.tags &&
                  selectedImage.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary">
                      <FontAwesomeIcon icon={faTag} className="me-1" />
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Gallery;
