import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faUser,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/blog");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlogPosts(data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.map((post) => post.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleBlogClick = (post) => {
    setSelectedBlogPost(post);
    setShowModal(true);
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt &&
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="blog-page">
      {/* Page Header */}
      <section className="page-header bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-3">Blog & Insights</h1>
              <p className="lead mb-0">
                Stay updated with the latest trends, insights, and innovations
                in technology
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Filters and Search */}
      <section className="filters-section py-4 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Label className="fw-bold">Category Filter</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label className="fw-bold">Search Articles</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Blog Posts Grid */}
      <section className="blog-posts py-5">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <Alert variant="danger">
                <h5>Failed to load blog posts</h5>
                <p className="mb-0">{error}</p>
              </Alert>
            </div>
          ) : (
            <>
              <Row>
                {filteredPosts.map((post) => (
                  <Col lg={4} md={6} className="mb-4" key={post.id}>
                    <Card className="h-100 border-0 shadow-sm">
                      {post.image ? (
                        <div
                          className="blog-image-container"
                          style={{ height: "200px", overflow: "hidden" }}
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-100 h-100 object-fit-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                          <div
                            className="d-none align-items-center justify-content-center h-100 bg-light"
                            style={{ display: "none" }}
                          >
                            <FontAwesomeIcon
                              icon={faUser}
                              size="3x"
                              className="text-primary"
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="blog-image-placeholder bg-light"
                          style={{ height: "200px" }}
                        >
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <FontAwesomeIcon
                              icon={faUser}
                              size="3x"
                              className="text-primary"
                            />
                          </div>
                        </div>
                      )}
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

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <small className="text-muted">
                            <FontAwesomeIcon
                              icon={faCalendar}
                              className="me-1"
                            />
                            {(() => {
                              const date =
                                post.publish_date || post.publishDate;
                              if (!date) return "Date not available";
                              try {
                                const parsedDate = new Date(date);
                                if (isNaN(parsedDate.getTime()))
                                  return "Invalid date";
                                return parsedDate.toLocaleDateString();
                              } catch (error) {
                                return "Invalid date";
                              }
                            })()}
                          </small>
                          <small className="text-muted">
                            <FontAwesomeIcon icon={faClock} className="me-1" />
                            {post.read_time || post.readTime || "N/A"}
                          </small>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <FontAwesomeIcon icon={faUser} className="me-1" />
                            {post.author_name ||
                              post.author?.name ||
                              post.author ||
                              "Anonymous"}
                          </small>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleBlogClick(post)}
                          >
                            Read More
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {filteredPosts.length === 0 && (
                <Row>
                  <Col className="text-center py-5">
                    <h4 className="text-muted">No articles found</h4>
                    <p className="text-muted">
                      Try adjusting your search criteria or category filter.
                    </p>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Container>
      </section>

      {/* Blog Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedBlogPost?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBlogPost && (
            <div>
              {/* Image */}
              {selectedBlogPost.image && (
                <div className="text-center mb-4">
                  <img
                    src={selectedBlogPost.image}
                    alt={selectedBlogPost.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Meta Information */}
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Author:</strong>{" "}
                  {selectedBlogPost.author_name ||
                    selectedBlogPost.author ||
                    "Anonymous"}
                </Col>
                <Col md={6}>
                  <strong>Published:</strong>{" "}
                  {(() => {
                    const date =
                      selectedBlogPost.publish_date ||
                      selectedBlogPost.publishDate;
                    if (!date) return "Date not available";
                    try {
                      const parsedDate = new Date(date);
                      if (isNaN(parsedDate.getTime())) return "Invalid date";
                      return parsedDate.toLocaleDateString();
                    } catch (error) {
                      return "Invalid date";
                    }
                  })()}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Read Time:</strong>{" "}
                  {selectedBlogPost.read_time ||
                    selectedBlogPost.readTime ||
                    "N/A"}
                </Col>
                <Col md={6}>
                  <strong>Category:</strong>{" "}
                  {selectedBlogPost.category || "Uncategorized"}
                </Col>
              </Row>

              {/* Tags */}
              {selectedBlogPost.tags && selectedBlogPost.tags.length > 0 && (
                <div className="mb-4">
                  <strong>Tags:</strong>
                  <div className="mt-2">
                    {selectedBlogPost.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="me-2 mb-2">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Content */}
              <div className="blog-content">
                <h5 className="fw-bold mb-3">Content</h5>
                <div style={{ whiteSpace: "pre-line" }}>
                  {selectedBlogPost.content}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" href="/contact">
            Contact Us
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Blog;
