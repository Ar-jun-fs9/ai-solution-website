import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  InputGroup,
  Dropdown,
  DropdownButton,
  Nav,
  Tab,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faSearch,
  faFilter,
  faDownload,
  faSignOutAlt,
  faUser,
  faEnvelope,
  faPhone,
  faBuilding,
  faGlobe,
  faBriefcase,
  faFileAlt,
  faCog,
  faNewspaper,
  faCalendar,
  faImages,
  faStar,
  faCode,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    services,
    caseStudies,
    testimonials,
    blogPosts,
    upcomingEvents,
    pastEvents,
    galleryItems,
    inquiries,
    addService,
    updateService,
    deleteService,
    addCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addEvent,
    updateEvent,
    deleteEvent,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    updateInquiry,
    deleteInquiry,
    getStats,
    isLoading,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalType, setModalType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [apiInquiries, setApiInquiries] = useState([]);
  const [apiServices, setApiServices] = useState([]);
  const [apiCaseStudies, setApiCaseStudies] = useState([]);
  const [apiTestimonials, setApiTestimonials] = useState([]);
  const [apiBlogPosts, setApiBlogPosts] = useState([]);
  const [apiEvents, setApiEvents] = useState([]);
  const [apiGalleryItems, setApiGalleryItems] = useState([]);

  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [caseStudiesLoading, setCaseStudiesLoading] = useState(false);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [blogPostsLoading, setBlogPostsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const [inquiriesError, setInquiriesError] = useState(null);
  const [servicesError, setServicesError] = useState(null);
  const [caseStudiesError, setCaseStudiesError] = useState(null);
  const [testimonialsError, setTestimonialsError] = useState(null);
  const [blogPostsError, setBlogPostsError] = useState(null);
  const [eventsError, setEventsError] = useState(null);
  const [galleryError, setGalleryError] = useState(null);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  // Function to refresh all data
  const refreshAllData = async () => {
    try {
      // Refresh inquiries
      const inquiriesResponse = await fetch(
        "http://localhost:5000/api/inquiries"
      );
      if (inquiriesResponse.ok) {
        const inquiriesData = await inquiriesResponse.json();
        setApiInquiries(inquiriesData);
      }

      // Refresh services
      const servicesResponse = await fetch(
        "http://localhost:5000/api/services"
      );
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setApiServices(servicesData);
      }

      // Refresh case studies
      const caseStudiesResponse = await fetch(
        "http://localhost:5000/api/case-studies"
      );
      if (caseStudiesResponse.ok) {
        const caseStudiesData = await caseStudiesResponse.json();
        setApiCaseStudies(caseStudiesData);
      }

      // Refresh testimonials
      const testimonialsResponse = await fetch(
        "http://localhost:5000/api/testimonials"
      );
      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json();
        setApiTestimonials(testimonialsData);
      }

      // Refresh blog posts
      const blogResponse = await fetch("http://localhost:5000/api/blog");
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        setApiBlogPosts(blogData);
      }

      // Refresh events
      const eventsResponse = await fetch("http://localhost:5000/api/events");
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setApiEvents(eventsData);
      }

      // Refresh gallery items
      const galleryResponse = await fetch("http://localhost:5000/api/gallery");
      if (galleryResponse.ok) {
        const galleryData = await galleryResponse.json();
        setApiGalleryItems(galleryData);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Fetch inquiries from API
  useEffect(() => {
    const fetchInquiries = async () => {
      setInquiriesLoading(true);
      setInquiriesError(null);
      try {
        const response = await fetch("http://localhost:5000/api/inquiries");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApiInquiries(data);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        setInquiriesError(error.message);
      } finally {
        setInquiriesLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      setServicesError(null);
      try {
        const response = await fetch("http://localhost:5000/api/services");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApiServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServicesError(error.message);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch case studies from API
  useEffect(() => {
    const fetchCaseStudies = async () => {
      setCaseStudiesLoading(true);
      setCaseStudiesError(null);
      try {
        const response = await fetch("http://localhost:5000/api/case-studies");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApiCaseStudies(data);
      } catch (error) {
        console.error("Error fetching case studies:", error);
        setCaseStudiesError(error.message);
      } finally {
        setCaseStudiesLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      setTestimonialsLoading(true);
      setTestimonialsError(null);
      try {
        const response = await fetch("http://localhost:5000/api/testimonials");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApiTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonialsError(error.message);
      } finally {
        setTestimonialsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      setBlogPostsLoading(true);
      setBlogPostsError(null);
      try {
        const response = await fetch("http://localhost:5000/api/blog");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApiBlogPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPostsError(error.message);
      } finally {
        setBlogPostsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      setEventsError(null);
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApiEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEventsError(error.message);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleryItems = async () => {
      setGalleryLoading(true);
      setGalleryError(null);
      try {
        const response = await fetch("http://localhost:5000/api/gallery");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApiGalleryItems(data);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        setGalleryError(error.message);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const handleView = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setShowModal(true);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleEdit = (item, type) => {
    setEditingItem({ ...item });
    setModalType(type);
    setShowModal(true);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAdd = (type) => {
    setModalType(type);
    setEditingItem({});
    setIsEditing(false);
    setIsAdding(true);
    setShowModal(true);
  };

  const handleDelete = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem || !modalType) return;

    try {
      let apiEndpoint = "";

      // Set API endpoint based on modal type
      switch (modalType) {
        case "inquiry":
          apiEndpoint = "inquiries";
          break;
        case "service":
          apiEndpoint = "services";
          break;
        case "caseStudy":
          apiEndpoint = "case-studies";
          break;
        case "testimonial":
          apiEndpoint = "testimonials";
          break;
        case "blogPost":
          apiEndpoint = "blog";
          break;
        case "event":
          apiEndpoint = "events";
          break;
        case "galleryItem":
          apiEndpoint = "gallery";
          break;
        default:
          throw new Error(`Unknown modal type: ${modalType}`);
      }

      const response = await fetch(
        `http://localhost:5000/api/${apiEndpoint}/${selectedItem.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData.error || "Unknown error"
          }`
        );
      }

      console.log(`${modalType} deleted successfully`);

      // Update local state based on type immediately
      if (modalType === "inquiry") {
        setApiInquiries((prev) =>
          prev.filter((inquiry) => inquiry.id !== selectedItem.id)
        );
      } else if (modalType === "service") {
        setApiServices((prev) =>
          prev.filter((service) => service.id !== selectedItem.id)
        );
      } else if (modalType === "caseStudy") {
        setApiCaseStudies((prev) =>
          prev.filter((caseStudy) => caseStudy.id !== selectedItem.id)
        );
      } else if (modalType === "testimonial") {
        setApiTestimonials((prev) =>
          prev.filter((testimonial) => testimonial.id !== selectedItem.id)
        );
      } else if (modalType === "blogPost") {
        setApiBlogPosts((prev) =>
          prev.filter((post) => post.id !== selectedItem.id)
        );
      } else if (modalType === "event") {
        setApiEvents((prev) =>
          prev.filter((event) => event.id !== selectedItem.id)
        );
      } else if (modalType === "galleryItem") {
        setApiGalleryItems((prev) =>
          prev.filter((item) => item.id !== selectedItem.id)
        );
      }

      // Refresh all data in background to ensure consistency
      refreshAllData();

      setShowDeleteModal(false);
      setSelectedItem(null);
      setModalType("");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(`Failed to delete ${modalType}: ${error.message}`);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem || !modalType) return;

    try {
      let apiEndpoint = "";
      let apiData = editingItem;

      // Set API endpoint and prepare data based on modal type
      switch (modalType) {
        case "inquiry":
          apiEndpoint = "inquiries";
          apiData = {
            name: editingItem.name,
            email: editingItem.email,
            phone: editingItem.phone,
            company: editingItem.company,
            country: editingItem.country,
            job_title: editingItem.job_title || editingItem.jobTitle,
            job_details: editingItem.job_details || editingItem.jobDetails,
            status: editingItem.status,
            priority: editingItem.priority,
          };
          break;
        case "service":
          apiEndpoint = "services";
          apiData = {
            title: editingItem.title,
            description: editingItem.description,
            long_description: editingItem.long_description,
            icon: editingItem.icon,
            features: editingItem.features,
            benefits: editingItem.benefits,
            image: editingItem.image,
          };
          break;
        case "caseStudy":
          apiEndpoint = "case-studies";
          apiData = {
            title: editingItem.title,
            client: editingItem.client,
            industry: editingItem.industry,
            challenge: editingItem.challenge,
            solution: editingItem.solution,
            results: editingItem.results,
            technologies: editingItem.technologies,
            duration: editingItem.duration,
            team_size: editingItem.team_size,
            image: editingItem.image,
            testimonial_author: editingItem.testimonial_author,
            testimonial_position: editingItem.testimonial_position,
            testimonial_company: editingItem.testimonial_company,
            testimonial_text: editingItem.testimonial_text,
          };
          break;
        case "testimonial":
          apiEndpoint = "testimonials";
          apiData = {
            name: editingItem.name,
            position: editingItem.position,
            company: editingItem.company,
            company_logo: editingItem.company_logo,
            rating: editingItem.rating,
            text: editingItem.text,
            image: editingItem.image,
            project: editingItem.project,
            industry: editingItem.industry,
            date: editingItem.date,
          };
          break;
        case "blogPost":
          apiEndpoint = "blog";
          apiData = {
            title: editingItem.title,
            excerpt: editingItem.excerpt,
            content: editingItem.content,
            author_name: editingItem.author_name || editingItem.author?.name,
            publish_date: editingItem.publish_date || editingItem.publishDate,
            read_time: editingItem.read_time || editingItem.readTime,
            category: editingItem.category,
            tags: editingItem.tags,
            image: editingItem.image,
          };
          break;
        case "event":
          apiEndpoint = "events";
          apiData = {
            title: editingItem.title,
            date: editingItem.date,
            time: editingItem.time,
            location: editingItem.location,
            type: editingItem.type,
            description: editingItem.description,
            long_description: editingItem.long_description,
            speakers: editingItem.speakers,
            agenda: editingItem.agenda,
            registration_link: editingItem.registration_link,
            is_free: editingItem.is_free,
            price: editingItem.price,
            early_bird_price: editingItem.early_bird_price,
            early_bird_deadline: editingItem.early_bird_deadline,
            max_attendees: editingItem.max_attendees,
            current_attendees: editingItem.current_attendees,
            image: editingItem.image,
            category: editingItem.category,
            tags: editingItem.tags,
            attendees: editingItem.attendees,
            highlights: editingItem.highlights,
            gallery: editingItem.gallery,
          };
          break;
        case "galleryItem":
          apiEndpoint = "gallery";
          apiData = {
            title: editingItem.title,
            description: editingItem.description,
            category: editingItem.category,
            date: editingItem.date,
            image: editingItem.image,
            thumbnail: editingItem.thumbnail,
            tags: editingItem.tags,
          };
          break;
        default:
          throw new Error(`Unknown modal type: ${modalType}`);
      }

      if (isAdding) {
        // Adding new item via API
        const response = await fetch(
          `http://localhost:5000/api/${apiEndpoint}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${
              errorData.error || "Unknown error"
            }`
          );
        }

        const newItem = await response.json();
        console.log(`New ${modalType} created:`, newItem);

        // Update local state based on type immediately
        if (modalType === "inquiry") {
          setApiInquiries((prev) => [...prev, newItem]);
        } else if (modalType === "service") {
          setApiServices((prev) => [...prev, newItem]);
        } else if (modalType === "caseStudy") {
          setApiCaseStudies((prev) => [...prev, newItem]);
        } else if (modalType === "testimonial") {
          setApiTestimonials((prev) => [...prev, newItem]);
        } else if (modalType === "blogPost") {
          setApiBlogPosts((prev) => [...prev, newItem]);
        } else if (modalType === "event") {
          setApiEvents((prev) => [...prev, newItem]);
        } else if (modalType === "galleryItem") {
          setApiGalleryItems((prev) => [...prev, newItem]);
        }
      } else {
        // Updating existing item via API
        const response = await fetch(
          `http://localhost:5000/api/${apiEndpoint}/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${
              errorData.error || "Unknown error"
            }`
          );
        }

        const updatedItem = await response.json();
        console.log(`${modalType} updated:`, updatedItem);

        // Update local state based on type immediately
        if (modalType === "inquiry") {
          setApiInquiries((prev) =>
            prev.map((inquiry) =>
              inquiry.id === editingItem.id ? updatedItem : inquiry
            )
          );
        } else if (modalType === "service") {
          setApiServices((prev) =>
            prev.map((service) =>
              service.id === editingItem.id ? updatedItem : service
            )
          );
        } else if (modalType === "caseStudy") {
          setApiCaseStudies((prev) =>
            prev.map((caseStudy) =>
              caseStudy.id === editingItem.id ? updatedItem : caseStudy
            )
          );
        } else if (modalType === "testimonial") {
          setApiTestimonials((prev) =>
            prev.map((testimonial) =>
              testimonial.id === editingItem.id ? updatedItem : testimonial
            )
          );
        } else if (modalType === "blogPost") {
          setApiBlogPosts((prev) =>
            prev.map((post) =>
              post.id === editingItem.id ? updatedItem : post
            )
          );
        } else if (modalType === "event") {
          setApiEvents((prev) =>
            prev.map((event) =>
              event.id === editingItem.id ? updatedItem : event
            )
          );
        } else if (modalType === "galleryItem") {
          setApiGalleryItems((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? updatedItem : item
            )
          );
        }

        // Refresh all data in background to ensure consistency
        refreshAllData();
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving item:", error);
      alert(`Failed to save ${modalType}: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    setEditingItem({
      ...editingItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload/single", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Update the editing item with the uploaded file URL
      setEditingItem({
        ...editingItem,
        [fieldName]: result.file.url,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      // Get the current inquiry data to include all required fields
      const currentInquiry = apiInquiries.find(
        (inquiry) => inquiry.id === inquiryId
      );
      if (!currentInquiry) {
        throw new Error("Inquiry not found");
      }

      const response = await fetch(
        `http://localhost:5000/api/inquiries/${inquiryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: currentInquiry.name,
            email: currentInquiry.email,
            phone: currentInquiry.phone,
            company: currentInquiry.company,
            country: currentInquiry.country,
            jobTitle: currentInquiry.job_title, // API expects camelCase
            jobDetails: currentInquiry.job_details, // API expects camelCase
            status: newStatus,
            priority: currentInquiry.priority,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData.error || "Unknown error"
          }`
        );
      }

      // Update local state
      setApiInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
        )
      );

      // Refresh all data in background to ensure consistency
      refreshAllData();
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      alert(`Failed to update inquiry status: ${error.message}`);
    }
  };

  const handlePriorityChange = async (inquiryId, newPriority) => {
    try {
      // Get the current inquiry data to include all required fields
      const currentInquiry = apiInquiries.find(
        (inquiry) => inquiry.id === inquiryId
      );
      if (!currentInquiry) {
        throw new Error("Inquiry not found");
      }

      const response = await fetch(
        `http://localhost:5000/api/inquiries/${inquiryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: currentInquiry.name,
            email: currentInquiry.email,
            phone: currentInquiry.phone,
            company: currentInquiry.company,
            country: currentInquiry.country,
            jobTitle: currentInquiry.job_title, // API expects camelCase
            jobDetails: currentInquiry.job_details, // API expects camelCase
            status: currentInquiry.status,
            priority: newPriority,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData.error || "Unknown error"
          }`
        );
      }

      // Update local state
      setApiInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === inquiryId
            ? { ...inquiry, priority: newPriority }
            : inquiry
        )
      );

      // Refresh all data in background to ensure consistency
      refreshAllData();
    } catch (error) {
      console.error("Error updating inquiry priority:", error);
      alert(`Failed to update inquiry priority: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUsername");
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setEditingItem(null);
    setIsEditing(false);
    setIsAdding(false);
    setModalType("");
  };

  const getStatusBadge = (status) => {
    const variants = {
      new: "primary",
      "in-progress": "warning",
      completed: "success",
      cancelled: "danger",
    };
    return (
      <Badge bg={variants[status] || "secondary"}>
        {status.replace("-", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: "danger",
      medium: "warning",
      low: "success",
      normal: "info",
    };
    return <Badge bg={variants[priority] || "secondary"}>{priority}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Calculate real stats from API data
  const calculateRealStats = () => {
    const totalInquiries = apiInquiries.length;
    const newInquiries = apiInquiries.filter((i) => i.status === "new").length;
    const inProgressInquiries = apiInquiries.filter(
      (i) => i.status === "in-progress"
    ).length;
    const completedInquiries = apiInquiries.filter(
      (i) => i.status === "completed"
    ).length;

    const totalServices = apiServices.length;
    const totalCaseStudies = apiCaseStudies.length;
    const totalTestimonials = apiTestimonials.length;
    const totalBlogPosts = apiBlogPosts.length;
    const totalUpcomingEvents = apiEvents.filter(
      (e) => e.type === "upcoming"
    ).length;
    const totalPastEvents = apiEvents.filter((e) => e.type === "past").length;
    const totalGalleryItems = apiGalleryItems.length;

    return {
      totalInquiries,
      newInquiries,
      inProgressInquiries,
      completedInquiries,
      totalServices,
      totalCaseStudies,
      totalTestimonials,
      totalBlogPosts,
      totalUpcomingEvents,
      totalPastEvents,
      totalGalleryItems,
    };
  };

  const stats = calculateRealStats();

  // Render view content based on modal type
  const renderViewContent = () => {
    if (!selectedItem) return null;

    switch (modalType) {
      case "inquiry":
        return (
          <div>
            <Row>
              <Col md={6}>
                <h6>Contact Information</h6>
                <p>
                  <strong>Name:</strong> {selectedItem.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedItem.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedItem.phone}
                </p>
                <p>
                  <strong>Company:</strong> {selectedItem.company}
                </p>
                <p>
                  <strong>Country:</strong> {selectedItem.country}
                </p>
                <p>
                  <strong>Job Title:</strong> {selectedItem.job_title}
                </p>
              </Col>
              <Col md={6}>
                <h6>Project Details</h6>
                <p>
                  <strong>Status:</strong> {getStatusBadge(selectedItem.status)}
                </p>
                <p>
                  <strong>Priority:</strong>{" "}
                  {getPriorityBadge(selectedItem.priority)}
                </p>
                <p>
                  <strong>Last Update:</strong>{" "}
                  {formatDate(selectedItem.updated_at)}
                </p>
                <p>
                  <strong>Submitted Date:</strong>{" "}
                  {formatDate(selectedItem.inquiry_at)}
                </p>
                <p>
                  <strong>Job Details:</strong>
                </p>
                <div className="border rounded p-3 bg-light">
                  {selectedItem.job_details}
                </div>
              </Col>
            </Row>
          </div>
        );

      case "service":
        return (
          <div>
            <Row>
              <Col md={6}>
                <h6>Service Information</h6>
                <p>
                  <strong>Title:</strong> {selectedItem.title}
                </p>
                <p>
                  <strong>Icon:</strong> {selectedItem.icon || "Not specified"}
                </p>
                <p>
                  <strong>Description:</strong> {selectedItem.description}
                </p>
                <p>
                  <strong>Long Description:</strong>{" "}
                  {selectedItem.long_description}
                </p>
                {selectedItem.image && (
                  <div className="mb-3">
                    <p>
                      <strong>Image:</strong>
                    </p>
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="img-fluid rounded border"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
              </Col>
              <Col md={6}>
                <h6>Features & Benefits</h6>
                <p>
                  <strong>Features:</strong>
                </p>
                <ul>
                  {(selectedItem.features || []).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <p>
                  <strong>Benefits:</strong>
                </p>
                <ul>
                  {(selectedItem.benefits || []).map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </Col>
            </Row>
          </div>
        );

      case "caseStudy":
        return (
          <div>
            <Row>
              <Col md={6}>
                <h6>Project Information</h6>
                <p>
                  <strong>Title:</strong> {selectedItem.title}
                </p>
                <p>
                  <strong>Client:</strong> {selectedItem.client}
                </p>
                <p>
                  <strong>Industry:</strong> {selectedItem.industry}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedItem.duration}
                </p>
                <p>
                  <strong>Team Size:</strong> {selectedItem.team_size}
                </p>
                {selectedItem.image && (
                  <div className="mb-3">
                    <p>
                      <strong>Project Image:</strong>
                    </p>
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="img-fluid rounded border"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
              </Col>
              <Col md={6}>
                <h6>Project Details</h6>
                <p>
                  <strong>Challenge:</strong> {selectedItem.challenge}
                </p>
                <p>
                  <strong>Solution:</strong> {selectedItem.solution}
                </p>
                <p>
                  <strong>Results:</strong>
                </p>
                <ul>
                  {(selectedItem.results || []).map((result, index) => (
                    <li key={index}>{result}</li>
                  ))}
                </ul>
                <p>
                  <strong>Technologies:</strong>{" "}
                  {(selectedItem.technologies || []).join(", ")}
                </p>
                {(selectedItem.testimonial_author ||
                  selectedItem.testimonial_text) && (
                  <div className="mt-9">
                    <h6>Client Testimonial</h6>
                    <p>
                      <strong>Author:</strong> {selectedItem.testimonial_author}
                    </p>
                    <p>
                      <strong>Position:</strong>{" "}
                      {selectedItem.testimonial_position}
                    </p>
                    <p>
                      <strong>Company:</strong>{" "}
                      {selectedItem.testimonial_company}
                    </p>
                    <p>
                      <strong>Testimonial:</strong>
                    </p>
                    <div className="border rounded p-3 bg-light">
                      {selectedItem.testimonial_text}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        );

      case "testimonial":
        return (
          <div>
            <Row>
              <Col md={6}>
                <h6>Person Information</h6>
                <p>
                  <strong>Name:</strong> {selectedItem.name}
                </p>
                <p>
                  <strong>Position:</strong> {selectedItem.position}
                </p>
                <p>
                  <strong>Company:</strong> {selectedItem.company}
                </p>
                <p>
                  <strong>Project:</strong> {selectedItem.project}
                </p>
                <p>
                  <strong>Industry: </strong> {selectedItem.industry}
                </p>
                <p>
                  <strong>Date:</strong>
                  {selectedItem.created_at}{" "}
                  {/* {selectedItem.date
                    ? new Date(selectedItem.date).toLocaleDateString()
                    : "Not specified"} */}
                </p>
                <p>
                  <strong>Rating:</strong>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={
                        i < selectedItem.rating ? "text-warning" : "text-muted"
                      }
                      size="sm"
                    />
                  ))}
                </p>
                {selectedItem.company_logo && (
                  <div className="mb-3">
                    <p>
                      <strong>Company Logo:</strong>
                    </p>
                    <img
                      src={selectedItem.company_logo}
                      alt={`${selectedItem.company} logo`}
                      className="img-fluid rounded border"
                      style={{ maxHeight: "100px" }}
                    />
                  </div>
                )}
              </Col>
              <Col md={6}>
                {selectedItem.image && (
                  <div className="mb-3">
                    <p>
                      <strong>Person Image:</strong>
                    </p>
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="img-fluid rounded border"
                      style={{ maxHeight: "150px" }}
                    />
                  </div>
                )}
                <h6>Testimonial Content</h6>
                <p>
                  <strong>Testimonial:</strong>
                </p>
                <div className="border rounded p-3 bg-light">
                  {selectedItem.text}
                </div>
              </Col>
            </Row>
          </div>
        );

      case "blogPost":
        return (
          <div>
            <Row>
              <Col md={8}>
                <h6>Blog Post Details</h6>
                <p>
                  <strong>Title:</strong> {selectedItem.title}
                </p>
                <p>
                  <strong>Author:</strong>{" "}
                  {selectedItem.author_name || selectedItem.author?.name}
                </p>
                <p>
                  <strong>Category:</strong> {selectedItem.category}
                </p>
                <p>
                  <strong>Publish Date:</strong>{" "}
                  {formatDate(
                    selectedItem.publish_date || selectedItem.publishDate
                  )}
                </p>
                <p>
                  <strong>Read Time:</strong>{" "}
                  {selectedItem.read_time || selectedItem.readTime}
                </p>
                <p>
                  <strong>Tags:</strong> {(selectedItem.tags || []).join(", ")}
                </p>
                <p>
                  <strong>Excerpt:</strong>
                </p>
                <div className="border rounded p-2 bg-light">
                  {selectedItem.excerpt}
                </div>
                <p>
                  <strong>Content:</strong>
                </p>
                <div className="border rounded p-2 bg-light">
                  {selectedItem.content}
                </div>
              </Col>
              <Col md={4}>
                {selectedItem.image && (
                  <div className="mb-3">
                    <p>
                      <strong>Blog Image:</strong>
                    </p>
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="img-fluid rounded border"
                      style={{
                        maxHeight: "250px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="d-none align-items-center justify-content-center h-100 bg-light rounded border"
                      style={{ display: "none", minHeight: "200px" }}
                    >
                      <FontAwesomeIcon
                        icon={faNewspaper}
                        size="3x"
                        className="text-primary"
                      />
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        );

      case "event":
        return (
          <div>
            <Row>
              <Col md={6}>
                <h6>Event Information</h6>
                <p>
                  <strong>Title:</strong> {selectedItem.title}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedItem.date
                    ? new Date(selectedItem.date).toLocaleDateString()
                    : "Not specified"}
                </p>
                <p>
                  <strong>Time:</strong> {selectedItem.time}
                </p>
                <p>
                  <strong>Location:</strong> {selectedItem.location}
                </p>
                <p>
                  <strong>Type:</strong>{" "}
                  <Badge
                    bg={
                      selectedItem.type === "upcoming" ? "success" : "secondary"
                    }
                  >
                    {selectedItem.type}
                  </Badge>
                </p>
                <p>
                  <strong>Category:</strong> {selectedItem.category}
                </p>
                <p>
                  <strong>Is Free:</strong>{" "}
                  {selectedItem.is_free ? "Yes" : "No"}
                </p>
                {!selectedItem.is_free && (
                  <>
                    <p>
                      <strong>Price:</strong> {selectedItem.price}
                    </p>
                    <p>
                      <strong>Early Bird Price:</strong>{" "}
                      {selectedItem.early_bird_price}
                    </p>
                    <p>
                      <strong>Early Bird Deadline:</strong>{" "}
                      {selectedItem.early_bird_deadline
                        ? new Date(
                            selectedItem.early_bird_deadline
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </>
                )}
                <p>
                  <strong>Max Attendees:</strong> {selectedItem.max_attendees}
                </p>
                <p>
                  <strong>Current Attendees:</strong>{" "}
                  {selectedItem.current_attendees}
                </p>
                {selectedItem.type === "past" && (
                  <p>
                    <strong>Actual Attendees:</strong> {selectedItem.attendees}
                  </p>
                )}
                {selectedItem.registration_link && (
                  <p>
                    <strong>Registration Link:</strong>{" "}
                    <a
                      href={selectedItem.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedItem.registration_link}
                    </a>
                  </p>
                )}
                {selectedItem.image && (
                  <div className="mb-3">
                    <p>
                      <strong>Event Image:</strong>
                    </p>
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="img-fluid rounded border"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
              </Col>
              <Col md={6}>
                <h6>Event Details</h6>
                <p>
                  <strong>Description:</strong> {selectedItem.description}
                </p>
                <p>
                  <strong>Long Description:</strong>{" "}
                  {selectedItem.long_description}
                </p>
                <p>
                  <strong>Speakers:</strong>{" "}
                  {(selectedItem.speakers || []).join(", ")}
                </p>
                <p>
                  <strong>Agenda:</strong>
                </p>
                <ul>
                  {(selectedItem.agenda || []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p>
                  <strong>Tags:</strong>{" "}
                  {(selectedItem.tags || []).map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1">
                      {tag}
                    </Badge>
                  ))}
                </p>
                {selectedItem.type === "past" && selectedItem.highlights && (
                  <>
                    <p>
                      <strong>Highlights:</strong>
                    </p>
                    <ul>
                      {(selectedItem.highlights || []).map(
                        (highlight, index) => (
                          <li key={index}>{highlight}</li>
                        )
                      )}
                    </ul>
                  </>
                )}
                {selectedItem.type === "past" && selectedItem.gallery && (
                  <>
                    <p>
                      <strong>Gallery Images:</strong>
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      {(selectedItem.gallery || []).map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Gallery ${index + 1}`}
                          className="rounded border"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        );

      case "galleryItem":
        return (
          <div>
            <h6>Gallery Item Details</h6>
            <Row>
              <Col md={6}>
                <p>
                  <strong>Title:</strong> {selectedItem.title}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  <Badge bg="info">{selectedItem.category}</Badge>
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedItem.created_at)}
                </p>
                <p>
                  <strong>Tags:</strong>
                </p>
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {(selectedItem.tags || []).map((tag, index) => (
                    <Badge key={index} bg="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p>
                  <strong>Description:</strong>
                </p>
                <div className="border rounded p-3 bg-light">
                  {selectedItem.description}
                </div>
              </Col>
              <Col md={6}>
                {selectedItem.image && (
                  <div className="mb-3">
                    <p>
                      <strong>Main Image:</strong>
                    </p>
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="img-fluid rounded border"
                      style={{ maxHeight: "250px" }}
                    />
                  </div>
                )}
                {selectedItem.thumbnail && (
                  <div className="mb-3">
                    <p>
                      <strong>Thumbnail:</strong>
                    </p>
                    <img
                      src={selectedItem.thumbnail}
                      alt={selectedItem.title}
                      className="img-fluid rounded border"
                      style={{ maxHeight: "150px" }}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </div>
        );

      default:
        return <p>No details available for this item.</p>;
    }
  };

  // Render edit form based on modal type
  const renderEditForm = () => {
    if (!editingItem) return null;

    switch (modalType) {
      case "inquiry":
        return (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editingItem.name || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editingItem.email || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={editingItem.phone || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={editingItem.company || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={editingItem.country || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="job_title"
                    value={editingItem.job_title || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={editingItem.status || "new"}
                    onChange={handleInputChange}
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={editingItem.priority || "medium"}
                    onChange={handleInputChange}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Job Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="job_details"
                value={editingItem.job_details || ""}
                onChange={handleInputChange}
                placeholder="Please provide detailed information about your project requirements..."
              />
            </Form.Group>
          </Form>
        );

      case "service":
        return (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editingItem.title || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Icon</Form.Label>
                  <Form.Control
                    type="text"
                    name="icon"
                    value={editingItem.icon || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., fa-code, fa-cog, fa-brain"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <div className="mb-2">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="mb-2"
                    />
                    <small className="text-muted">
                      Upload from device or enter URL below
                    </small>
                  </div>
                  <Form.Control
                    type="url"
                    name="image"
                    value={editingItem.image || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg or leave empty if uploading file"
                  />
                  {editingItem.image && (
                    <div className="mt-2">
                      <img
                        src={editingItem.image}
                        alt="Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "100px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={editingItem.description || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Long Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="long_description"
                    value={editingItem.long_description || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Features (one per line)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="features"
                value={
                  editingItem.features ? editingItem.features.join("\n") : ""
                }
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    features: e.target.value
                      .split("\n")
                      .filter((f) => f.trim()),
                  })
                }
                placeholder="Enter features, one per line"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Benefits (one per line)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="benefits"
                value={
                  editingItem.benefits ? editingItem.benefits.join("\n") : ""
                }
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    benefits: e.target.value
                      .split("\n")
                      .filter((b) => b.trim()),
                  })
                }
                placeholder="Enter benefits, one per line"
              />
            </Form.Group>
          </Form>
        );

      case "caseStudy":
        return (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editingItem.title || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Client *</Form.Label>
                  <Form.Control
                    type="text"
                    name="client"
                    value={editingItem.client || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Industry</Form.Label>
                  <Form.Control
                    type="text"
                    name="industry"
                    value={editingItem.industry || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={editingItem.duration || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., 6 months, 1 year"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Team Size</Form.Label>
                  <Form.Control
                    type="text"
                    name="team_size"
                    value={editingItem.team_size || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 developers, 3 designers"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <div className="mb-2">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="mb-2"
                    />
                    <small className="text-muted">
                      Upload from device or enter URL below
                    </small>
                  </div>
                  <Form.Control
                    type="url"
                    name="image"
                    value={editingItem.image || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/case-study-image.jpg or leave empty if uploading file"
                  />
                  {editingItem.image && (
                    <div className="mt-2">
                      <img
                        src={editingItem.image}
                        alt="Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "100px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Testimonial Author</Form.Label>
                  <Form.Control
                    type="text"
                    name="testimonial_author"
                    value={editingItem.testimonial_author || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Testimonial Position</Form.Label>
                  <Form.Control
                    type="text"
                    name="testimonial_position"
                    value={editingItem.testimonial_position || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Testimonial Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="testimonial_company"
                    value={editingItem.testimonial_company || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Challenge</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="challenge"
                value={editingItem.challenge || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Solution</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="solution"
                value={editingItem.solution || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Results (one per line)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="results"
                value={
                  editingItem.results ? editingItem.results.join("\n") : ""
                }
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    results: e.target.value.split("\n").filter((r) => r.trim()),
                  })
                }
                placeholder="Enter results, one per line"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Technologies (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="technologies"
                value={
                  editingItem.technologies
                    ? editingItem.technologies.join(", ")
                    : ""
                }
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    technologies: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t),
                  })
                }
                placeholder="React, Node.js, MongoDB, etc."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Testimonial Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="testimonial_text"
                value={editingItem.testimonial_text || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        );

      case "testimonial":
        return (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editingItem.name || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    type="text"
                    name="position"
                    value={editingItem.position || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={editingItem.company || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Company Logo</Form.Label>
                  <div className="mb-2">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "company_logo")}
                      className="mb-2"
                    />
                    <small className="text-muted">
                      Upload from device or enter URL below
                    </small>
                  </div>
                  <Form.Control
                    type="url"
                    name="company_logo"
                    value={editingItem.company_logo || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.jpg or leave empty if uploading file"
                  />
                  {editingItem.company_logo && (
                    <div className="mt-2">
                      <img
                        src={editingItem.company_logo}
                        alt="Company Logo Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "50px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Project</Form.Label>
                  <Form.Control
                    type="text"
                    name="project"
                    value={editingItem.project || ""}
                    onChange={handleInputChange}
                    placeholder="Project name or title"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Industry</Form.Label>
                  <Form.Control
                    type="text"
                    name="industry"
                    value={editingItem.industry || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    name="rating"
                    value={editingItem.rating || 5}
                    onChange={handleInputChange}
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Person Image</Form.Label>
                  <div className="mb-2">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="mb-2"
                    />
                    <small className="text-muted">
                      Upload from device or enter URL below
                    </small>
                  </div>
                  <Form.Control
                    type="url"
                    name="image"
                    value={editingItem.image || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/person-image.jpg or leave empty if uploading file"
                  />
                  {editingItem.image && (
                    <div className="mt-2">
                      <img
                        src={editingItem.image}
                        alt="Person Image Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "100px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={editingItem.date || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Testimonial Text *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="text"
                value={editingItem.text || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form>
        );

      case "blogPost":
        return (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editingItem.title || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="author_name"
                    value={
                      editingItem.author_name || editingItem.author?.name || ""
                    }
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={editingItem.category || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Publish Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="publish_date"
                    value={
                      editingItem.publish_date || editingItem.publishDate || ""
                    }
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Read Time</Form.Label>
                  <Form.Control
                    type="text"
                    name="read_time"
                    value={editingItem.read_time || editingItem.readTime || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 min read"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Excerpt</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="excerpt"
                value={editingItem.excerpt || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={editingItem.tags ? editingItem.tags.join(", ") : ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t),
                  })
                }
                placeholder="technology, software, development, etc."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Blog Image</Form.Label>
              <div className="mb-2">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "image")}
                  className="mb-2"
                />
                <small className="text-muted">
                  Upload from device or enter URL below
                </small>
              </div>
              <Form.Control
                type="url"
                name="image"
                value={editingItem.image || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/blog-image.jpg or leave empty if uploading file"
              />
              {editingItem.image && (
                <div className="mt-2">
                  <img
                    src={editingItem.image}
                    alt="Blog Preview"
                    className="img-fluid rounded border"
                    style={{ maxHeight: "100px" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="content"
                value={editingItem.content || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        );

      case "event":
        return (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editingItem.title || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={editingItem.date || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={editingItem.time || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={editingItem.location || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={editingItem.type || "upcoming"}
                    onChange={handleInputChange}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={editingItem.category || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Event Image</Form.Label>
                  <div className="mb-2">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="mb-2"
                    />
                    <small className="text-muted">
                      Upload from device or enter URL below
                    </small>
                  </div>
                  <Form.Control
                    type="url"
                    name="image"
                    value={editingItem.image || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/event-image.jpg or leave empty if uploading file"
                  />
                  {editingItem.image && (
                    <div className="mt-2">
                      <img
                        src={editingItem.image}
                        alt="Event Image Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "100px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Registration Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="registration_link"
                    value={editingItem.registration_link || ""}
                    onChange={handleInputChange}
                    placeholder="https://eventbrite.com/event/123"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Is Free</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="is_free"
                    checked={editingItem.is_free || false}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        is_free: e.target.checked,
                      })
                    }
                  />
                </Form.Group>
                {!editingItem.is_free && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="text"
                        name="price"
                        value={editingItem.price || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., $99, Free, Contact for pricing"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Early Bird Price</Form.Label>
                      <Form.Control
                        type="text"
                        name="early_bird_price"
                        value={editingItem.early_bird_price || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., $79"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Early Bird Deadline</Form.Label>
                      <Form.Control
                        type="date"
                        name="early_bird_deadline"
                        value={editingItem.early_bird_deadline || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Max Attendees</Form.Label>
                  <Form.Control
                    type="number"
                    name="max_attendees"
                    value={editingItem.max_attendees || ""}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Current Attendees</Form.Label>
                  <Form.Control
                    type="number"
                    name="current_attendees"
                    value={editingItem.current_attendees || 0}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
                {editingItem.type === "past" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Actual Attendees</Form.Label>
                    <Form.Control
                      type="number"
                      name="attendees"
                      value={editingItem.attendees || ""}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editingItem.description || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Long Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="long_description"
                value={editingItem.long_description || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Speakers (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="speakers"
                value={
                  editingItem.speakers ? editingItem.speakers.join(", ") : ""
                }
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    speakers: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s),
                  })
                }
                placeholder="John Doe, Jane Smith, etc."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Agenda (one item per line)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="agenda"
                value={editingItem.agenda ? editingItem.agenda.join("\n") : ""}
                placeholder="Enter agenda items, one per line"
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    agenda: e.target.value.split("\n").filter((a) => a.trim()),
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={editingItem.tags ? editingItem.tags.join(", ") : ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t),
                  })
                }
                placeholder="technology, workshop, networking, etc."
              />
            </Form.Group>
            {editingItem.type === "past" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Highlights (one per line)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="highlights"
                    value={
                      editingItem.highlights
                        ? editingItem.highlights.join("\n")
                        : ""
                    }
                    placeholder="Enter event highlights, one per line"
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        highlights: e.target.value
                          .split("\n")
                          .filter((h) => h.trim()),
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Gallery Images (comma separated URLs)</Form.Label>
                  <Form.Control
                    type="text"
                    name="gallery"
                    value={
                      editingItem.gallery ? editingItem.gallery.join(", ") : ""
                    }
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        gallery: e.target.value
                          .split(",")
                          .map((g) => g.trim())
                          .filter((g) => g),
                      })
                    }
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </Form.Group>
              </>
            )}
          </Form>
        );

      case "galleryItem":
        return (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editingItem.title || ""}
                    onChange={handleInputChange}
                    placeholder="Enter gallery item title"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={editingItem.category || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    <option value="Events">Events</option>
                    <option value="Team">Team</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Client Meetings">Client Meetings</option>
                    <option value="Projects">Projects</option>
                    <option value="Training">Training</option>
                    <option value="Product Launches">Product Launches</option>
                    <option value="Office">Office</option>
                    <option value="Client Success">Client Success</option>
                    <option value="Demos">Demos</option>
                    <option value="Development">Development</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={editingItem.date || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Main Image *</Form.Label>
                  <div className="mb-2">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="mb-2"
                    />
                    <small className="text-muted">
                      Upload from device or enter URL below
                    </small>
                  </div>
                  <Form.Control
                    type="url"
                    name="image"
                    value={editingItem.image || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg or leave empty if uploading file"
                    required
                  />
                  {editingItem.image && (
                    <div className="mt-2">
                      <img
                        src={editingItem.image}
                        alt="Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "100px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Thumbnail</Form.Label>
                  <div className="mb-2">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "thumbnail")}
                      className="mb-2"
                    />
                    <small className="text-muted">
                      Upload from device or enter URL below
                    </small>
                  </div>
                  <Form.Control
                    type="url"
                    name="thumbnail"
                    value={editingItem.thumbnail || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/thumbnail.jpg or leave empty if uploading file"
                  />
                  {editingItem.thumbnail && (
                    <div className="mt-2">
                      <img
                        src={editingItem.thumbnail}
                        alt="Thumbnail Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "80px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={editingItem.description || ""}
                onChange={handleInputChange}
                placeholder="Enter detailed description of the gallery item"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={editingItem.tags ? editingItem.tags.join(", ") : ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t),
                  })
                }
                placeholder="technology, project, team, etc."
              />
            </Form.Group>
          </Form>
        );

      default:
        return <p>Edit form not available for this item type.</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading Admin Dashboard...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard min-vh-100 bg-light">
      {/* Admin Header */}
      <div className="bg-dark text-white py-3">
        <Container fluid>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Admin Dashboard
              </h4>
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => setShowLogoutModal(true)}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Logout
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="py-4">
        {/* Dashboard Stats */}
        {/* <Row className="mb-4">
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-primary mb-2">{stats.totalInquiries}</h3>
                <p className="text-muted mb-0">Inquiries</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-info mb-2">{stats.totalServices}</h3>
                <p className="text-muted mb-0">Services</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-success mb-2">{stats.totalCaseStudies}</h3>
                <p className="text-muted mb-0">Case Studies</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-warning mb-2">{stats.totalBlogPosts}</h3>
                <p className="text-muted mb-0">Blog Posts</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-danger mb-2">
                  {stats.totalUpcomingEvents}
                </h3>
                <p className="text-muted mb-0">Events</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-secondary mb-2">
                  {stats.totalGalleryItems}
                </h3>
                <p className="text-muted mb-0">Gallery</p>
              </Card.Body>
            </Card>
          </Col>
        </Row> */}
        <Row className="mb-4">
          <Col md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    size="2x"
                    className="text-primary me-2"
                  />
                  <h3 className="text-primary mb-0">{stats.totalInquiries}</h3>
                </div>
                <p className="text-muted mb-1">Total Inquiries</p>
                <div className="d-flex justify-content-center gap-2">
                  <Badge bg="success">{stats.newInquiries} New</Badge>
                  <Badge bg="warning">
                    {stats.inProgressInquiries} In Progress
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <FontAwesomeIcon
                    icon={faCode}
                    size="2x"
                    className="text-info me-2"
                  />
                  <h3 className="text-info mb-0">{stats.totalServices}</h3>
                </div>
                <p className="text-muted mb-1">Services</p>
                <Badge bg="info">Active</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    size="2x"
                    className="text-success me-2"
                  />
                  <h3 className="text-success mb-0">
                    {stats.totalCaseStudies}
                  </h3>
                </div>
                <p className="text-muted mb-1">Case Studies</p>
                <Badge bg="success">Completed</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <FontAwesomeIcon
                    icon={faNewspaper}
                    size="2x"
                    className="text-warning me-2"
                  />
                  <h3 className="text-warning mb-0">{stats.totalBlogPosts}</h3>
                </div>
                <p className="text-muted mb-1">Blog Posts</p>
                <Badge bg="warning">Published</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    size="2x"
                    className="text-danger me-2"
                  />
                  <h3 className="text-danger mb-0">
                    {stats.totalUpcomingEvents}
                  </h3>
                </div>
                <p className="text-muted mb-1">Events</p>
                <Badge bg="danger">Scheduled</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <FontAwesomeIcon
                    icon={faImages}
                    size="2x"
                    className="text-secondary me-2"
                  />
                  <h3 className="text-secondary mb-0">
                    {stats.totalGalleryItems}
                  </h3>
                </div>
                <p className="text-muted mb-1">Gallery</p>
                <Badge bg="secondary">Active</Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-0">
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
              <Nav.Item>
                <Nav.Link eventKey="overview" className="border-0">
                  <FontAwesomeIcon icon={faChartBar} className="me-2" />
                  Overview
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="inquiries" className="border-0">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  Customer Inquiries
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="services" className="border-0">
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  Services
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="caseStudies" className="border-0">
                  <FontAwesomeIcon icon={faCode} className="me-2" />
                  Case Studies
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="testimonials" className="border-0">
                  <FontAwesomeIcon icon={faStar} className="me-2" />
                  Testimonials
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="blogPosts" className="border-0">
                  <FontAwesomeIcon icon={faNewspaper} className="me-2" />
                  Blog Posts
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="events" className="border-0">
                  <FontAwesomeIcon icon={faCalendar} className="me-2" />
                  Events
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="gallery" className="border-0">
                  <FontAwesomeIcon icon={faImages} className="me-2" />
                  Gallery
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Body>
        </Card>

        {/* Content based on active tab */}
        <Tab.Container activeKey={activeTab}>
          <Tab.Content>
            {/* Overview Tab */}
            <Tab.Pane eventKey="overview">
              <Row>
                <Col md={6}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white">
                      <h6 className="mb-0">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="me-2 text-primary"
                        />
                        Recent Customer Inquiries
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="list-group list-group-flush">
                        {apiInquiries.slice(0, 3).map((inquiry) => (
                          <div
                            key={inquiry.id}
                            className="list-group-item d-flex justify-content-between align-items-center border-0 px-0"
                          >
                            <div className="d-flex align-items-center">
                              <div
                                className="avatar-circle bg-primary text-white me-3 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                }}
                              >
                                {inquiry.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-semibold">
                                  {inquiry.name}
                                </div>
                                <small className="text-muted">
                                  {inquiry.company} •{" "}
                                  {formatDate(inquiry.inquiry_at)}
                                </small>
                              </div>
                            </div>
                            {getStatusBadge(inquiry.status)}
                          </div>
                        ))}
                        {apiInquiries.length === 0 && (
                          <div className="text-muted text-center py-3">
                            <FontAwesomeIcon
                              icon={faEnvelope}
                              size="2x"
                              className="mb-2 text-muted"
                            />
                            <p>No inquiries yet</p>
                          </div>
                        )}
                      </div>
                      {apiInquiries.length > 3 && (
                        <div className="text-center mt-3">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setActiveTab("inquiries")}
                          >
                            View All Inquiries ({apiInquiries.length})
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white">
                      <h6 className="mb-0">
                        <FontAwesomeIcon
                          icon={faNewspaper}
                          className="me-2 text-success"
                        />
                        Latest Blog Posts
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="list-group list-group-flush">
                        {apiBlogPosts.slice(0, 3).map((post) => (
                          <div
                            key={post.id}
                            className="list-group-item d-flex justify-content-between align-items-center border-0 px-0"
                          >
                            <div className="d-flex align-items-center">
                              {post.image ? (
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="rounded me-3"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextElementSibling.style.display =
                                      "flex";
                                  }}
                                />
                              ) : (
                                <div
                                  className="bg-light rounded me-3 d-flex align-items-center justify-content-center"
                                  style={{ width: "50px", height: "50px" }}
                                >
                                  <FontAwesomeIcon
                                    icon={faNewspaper}
                                    className="text-muted"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="fw-semibold">{post.title}</div>
                                <small className="text-muted">
                                  {post.author_name || post.author?.name} •{" "}
                                  {formatDate(
                                    post.publish_date || post.publishDate
                                  )}
                                </small>
                              </div>
                            </div>
                            <Badge bg="info">{post.category}</Badge>
                          </div>
                        ))}
                        {apiBlogPosts.length === 0 && (
                          <div className="text-muted text-center py-3">
                            <FontAwesomeIcon
                              icon={faNewspaper}
                              size="2x"
                              className="mb-2 text-muted"
                            />
                            <p>No blog posts yet</p>
                          </div>
                        )}
                      </div>
                      {apiBlogPosts.length > 3 && (
                        <div className="text-center mt-3">
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => setActiveTab("blogPosts")}
                          >
                            View All Posts ({apiBlogPosts.length})
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white">
                      <h6 className="mb-0">
                        <FontAwesomeIcon
                          icon={faCalendar}
                          className="me-2 text-warning"
                        />
                        Upcoming Events
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="list-group list-group-flush">
                        {apiEvents
                          .filter((e) => e.type === "upcoming")
                          .slice(0, 3)
                          .map((event) => (
                            <div
                              key={event.id}
                              className="list-group-item d-flex justify-content-between align-items-center border-0 px-0"
                            >
                              <div className="d-flex align-items-center">
                                <div
                                  className="calendar-icon bg-warning text-white me-3 d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <FontAwesomeIcon icon={faCalendar} />
                                </div>
                                <div>
                                  <div className="fw-semibold">
                                    {event.title}
                                  </div>
                                  <small className="text-muted">
                                    {formatDate(event.date)} • {event.location}
                                  </small>
                                </div>
                              </div>
                              <Badge bg="warning">{event.type}</Badge>
                            </div>
                          ))}
                        {apiEvents.filter((e) => e.type === "upcoming")
                          .length === 0 && (
                          <div className="text-muted text-center py-3">
                            <FontAwesomeIcon
                              icon={faCalendar}
                              size="2x"
                              className="mb-2 text-muted"
                            />
                            <p>No upcoming events</p>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white">
                      <h6 className="mb-0">
                        <FontAwesomeIcon
                          icon={faImages}
                          className="me-2 text-secondary"
                        />
                        Recent Gallery Items
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="list-group list-group-flush">
                        {apiGalleryItems.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="list-group-item d-flex justify-content-between align-items-center border-0 px-0"
                          >
                            <div className="d-flex align-items-center">
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="rounded me-3"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextElementSibling.style.display =
                                      "flex";
                                  }}
                                />
                              ) : (
                                <div
                                  className="bg-light rounded me-3 d-flex align-items-center justify-content-center"
                                  style={{ width: "50px", height: "50px" }}
                                >
                                  <FontAwesomeIcon
                                    icon={faImages}
                                    className="text-muted"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="fw-semibold">{item.title}</div>
                                <small className="text-muted">
                                  {item.category} •{" "}
                                  {formatDate(item.created_at)}
                                </small>
                              </div>
                            </div>
                            <Badge bg="secondary">{item.category}</Badge>
                          </div>
                        ))}
                        {apiGalleryItems.length === 0 && (
                          <div className="text-muted text-center py-3">
                            <FontAwesomeIcon
                              icon={faImages}
                              size="2x"
                              className="mb-2 text-muted"
                            />
                            <p>No gallery items yet</p>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white">
                      <h6 className="mb-0">Quick Actions</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-2">
                        <Col xs={6} className="mb-1">
                          <Button
                            variant="outline-primary"
                            className="w-100 d-flex flex-column align-items-center py-3"
                            onClick={() => handleAdd("inquiry")}
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              size="lx"
                              className="mb-2"
                            />
                            <span className="small">Add Inquiry</span>
                          </Button>
                        </Col>
                        <Col xs={6} className="mb-1">
                          <Button
                            variant="outline-info"
                            className="w-100 d-flex flex-column align-items-center py-3"
                            onClick={() => handleAdd("service")}
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              size="lx"
                              className="mb-2"
                            />
                            <span className="small">Add Service</span>
                          </Button>
                        </Col>
                        <Col xs={6} className="mb-2">
                          <Button
                            variant="outline-success"
                            className="w-100 d-flex flex-column align-items-center py-3"
                            onClick={() => handleAdd("blogPost")}
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              size="lx"
                              className="mb-2"
                            />
                            <span className="small">Add Blog Post</span>
                          </Button>
                        </Col>
                        <Col xs={6} className="mb-2">
                          <Button
                            variant="outline-warning"
                            className="w-100 d-flex flex-column align-items-center py-3"
                            onClick={() => handleAdd("event")}
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              size="lx"
                              className="mb-2"
                            />
                            <span className="small">Add Event</span>
                          </Button>
                        </Col>
                        <Col xs={12} className="mb-2">
                          <Button
                            variant="outline-secondary"
                            className="w-100 d-flex align-items-center justify-content-center py-2"
                            onClick={() => handleAdd("galleryItem")}
                          >
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            <span>Add Gallery Item</span>
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white">
                      <h6 className="mb-0">System Status</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Data Loading</span>
                        <Badge
                          bg={
                            inquiriesLoading ||
                            servicesLoading ||
                            blogPostsLoading
                              ? "warning"
                              : "success"
                          }
                        >
                          {inquiriesLoading ||
                          servicesLoading ||
                          blogPostsLoading
                            ? "Loading..."
                            : "Ready"}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Total Content Items</span>
                        <Badge bg="info">
                          {stats.totalServices +
                            stats.totalCaseStudies +
                            stats.totalBlogPosts +
                            stats.totalGalleryItems +
                            stats.totalUpcomingEvents +
                            stats.totalPastEvents}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Active Inquiries</span>
                        <Badge bg="primary">
                          {stats.newInquiries + stats.inProgressInquiries}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Published Content</span>
                        <Badge bg="success">
                          {stats.totalBlogPosts + stats.totalServices}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Customer Inquiries Tab */}
            <Tab.Pane eventKey="inquiries">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Customer Inquiries</h5>
                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAdd("inquiry")}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Add New Inquiry
                    </Button>
                    <InputGroup style={{ width: "300px" }}>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faSearch} />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search inquiries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                    <Form.Select
                      style={{ width: "150px" }}
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  {inquiriesLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading inquiries...
                        </span>
                      </div>
                      <p className="text-muted">Loading inquiries...</p>
                    </div>
                  ) : inquiriesError ? (
                    <div className="text-center py-4">
                      <Alert variant="danger">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="me-2"
                        />
                        Error loading inquiries: {inquiriesError}
                      </Alert>
                    </div>
                  ) : (
                    <Table responsive className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Company</th>
                          <th>Job Details</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(apiInquiries || [])
                          .filter((inquiry) => {
                            const matchesSearch =
                              inquiry.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              inquiry.email
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              inquiry.company
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              inquiry.job_details
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase());

                            const matchesStatus =
                              statusFilter === "all" ||
                              inquiry.status === statusFilter;

                            return matchesSearch && matchesStatus;
                          })
                          .map((inquiry) => (
                            <tr key={inquiry.id}>
                              <td>{inquiry.id}</td>
                              <td>
                                <div>
                                  <div className="fw-semibold">
                                    {inquiry.name}
                                  </div>
                                  <small className="text-muted">
                                    {inquiry.email}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="fw-semibold">
                                    {inquiry.company}
                                  </div>
                                  <small className="text-muted">
                                    {inquiry.country}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div
                                  className="text-truncate"
                                  style={{ maxWidth: "200px" }}
                                >
                                  {inquiry.job_details}
                                </div>
                              </td>
                              <td>
                                <DropdownButton
                                  size="sm"
                                  variant="outline-secondary"
                                  title={getStatusBadge(inquiry.status)}
                                  onSelect={(status) =>
                                    handleStatusChange(inquiry.id, status)
                                  }
                                  style={{ position: "static" }}
                                  menuStyle={{ zIndex: 1050 }}
                                >
                                  <Dropdown.Item eventKey="new">
                                    New
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="in-progress">
                                    In Progress
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="completed">
                                    Completed
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="cancelled">
                                    Cancelled
                                  </Dropdown.Item>
                                </DropdownButton>
                              </td>
                              <td>
                                <DropdownButton
                                  size="sm"
                                  variant="outline-secondary"
                                  title={getPriorityBadge(inquiry.priority)}
                                  onSelect={(priority) =>
                                    handlePriorityChange(inquiry.id, priority)
                                  }
                                  style={{ position: "static" }}
                                  menuStyle={{ zIndex: 1050 }}
                                >
                                  <Dropdown.Item eventKey="high">
                                    High
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="medium">
                                    Medium
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="low">
                                    Low
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="normal">
                                    Normal
                                  </Dropdown.Item>
                                </DropdownButton>
                              </td>
                              <td>{formatDate(inquiry.inquiry_at)}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() =>
                                      handleView(inquiry, "inquiry")
                                    }
                                  >
                                    <FontAwesomeIcon icon={faEye} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-warning"
                                    onClick={() =>
                                      handleEdit(inquiry, "inquiry")
                                    }
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() =>
                                      handleDelete(inquiry, "inquiry")
                                    }
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Services Tab */}
            <Tab.Pane eventKey="services">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Services Management</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAdd("service")}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Add Service
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  {servicesLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading services...
                        </span>
                      </div>
                      <p className="text-muted">Loading services...</p>
                    </div>
                  ) : servicesError ? (
                    <div className="text-center py-4">
                      <Alert variant="danger">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="me-2"
                        />
                        Error loading services: {servicesError}
                      </Alert>
                    </div>
                  ) : (
                    <Table responsive className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Features</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(apiServices || []).map((service) => (
                          <tr key={service.id}>
                            <td>{service.id}</td>
                            <td className="fw-semibold">{service.title}</td>
                            <td>
                              <div
                                className="text-truncate"
                                style={{ maxWidth: "300px" }}
                              >
                                {service.description}
                              </div>
                            </td>
                            <td>{(service.features || []).length} features</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleView(service, "service")}
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-warning"
                                  onClick={() => handleEdit(service, "service")}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleDelete(service, "service")
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Case Studies Tab */}
            <Tab.Pane eventKey="caseStudies">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Case Studies Management</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAdd("caseStudy")}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Add Case Study
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  {caseStudiesLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading case studies...
                        </span>
                      </div>
                      <p className="text-muted">Loading case studies...</p>
                    </div>
                  ) : caseStudiesError ? (
                    <div className="text-center py-4">
                      <Alert variant="danger">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="me-2"
                        />
                        Error loading case studies: {caseStudiesError}
                      </Alert>
                    </div>
                  ) : (
                    <Table responsive className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Client</th>
                          <th>Industry</th>
                          <th>Challenge</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(apiCaseStudies || []).map((caseStudy) => (
                          <tr key={caseStudy.id}>
                            <td>{caseStudy.id}</td>
                            <td className="fw-semibold">{caseStudy.client}</td>
                            <td>{caseStudy.industry}</td>
                            <td>
                              <div
                                className="text-truncate"
                                style={{ maxWidth: "300px" }}
                              >
                                {caseStudy.challenge}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() =>
                                    handleView(caseStudy, "caseStudy")
                                  }
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-warning"
                                  onClick={() =>
                                    handleEdit(caseStudy, "caseStudy")
                                  }
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleDelete(caseStudy, "caseStudy")
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Testimonials Tab */}
            <Tab.Pane eventKey="testimonials">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Testimonials Management</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAdd("testimonial")}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Add Testimonial
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  {testimonialsLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading testimonials...
                        </span>
                      </div>
                      <p className="text-muted">Loading testimonials...</p>
                    </div>
                  ) : testimonialsError ? (
                    <div className="text-center py-4">
                      <Alert variant="danger">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="me-2"
                        />
                        Error loading testimonials: {testimonialsError}
                      </Alert>
                    </div>
                  ) : (
                    <Table responsive className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Company</th>
                          <th>Rating</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(apiTestimonials || []).map((testimonial) => (
                          <tr key={testimonial.id}>
                            <td>{testimonial.id}</td>
                            <td className="fw-semibold">{testimonial.name}</td>
                            <td>{testimonial.company}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                {[...Array(5)].map((_, i) => (
                                  <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={
                                      i < testimonial.rating
                                        ? "text-warning"
                                        : "text-muted"
                                    }
                                    size="sm"
                                  />
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() =>
                                    handleView(testimonial, "testimonial")
                                  }
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-warning"
                                  onClick={() =>
                                    handleEdit(testimonial, "testimonial")
                                  }
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleDelete(testimonial, "testimonial")
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Blog Posts Tab */}
            <Tab.Pane eventKey="blogPosts">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Blog Posts Management</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAdd("blogPost")}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Add Blog Post
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  {blogPostsLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading blog posts...
                        </span>
                      </div>
                      <p className="text-muted">Loading blog posts...</p>
                    </div>
                  ) : blogPostsError ? (
                    <div className="text-center py-4">
                      <Alert variant="danger">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="me-2"
                        />
                        Error loading blog posts: {blogPostsError}
                      </Alert>
                    </div>
                  ) : (
                    <Table responsive className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Author</th>
                          <th>Category</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(apiBlogPosts || []).map((post) => (
                          <tr key={post.id}>
                            <td>{post.id}</td>
                            <td className="fw-semibold">{post.title}</td>
                            <td>{post.author?.name || post.author_name}</td>
                            <td>{post.category}</td>
                            <td>
                              {formatDate(
                                post.publish_date || post.publishDate
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleView(post, "blogPost")}
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-warning"
                                  onClick={() => handleEdit(post, "blogPost")}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDelete(post, "blogPost")}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Events Tab */}
            <Tab.Pane eventKey="events">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Events Management</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAdd("event")}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Add Event
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  {eventsLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading events...
                        </span>
                      </div>
                      <p className="text-muted">Loading events...</p>
                    </div>
                  ) : eventsError ? (
                    <div className="text-center py-4">
                      <Alert variant="danger">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="me-2"
                        />
                        Error loading events: {eventsError}
                      </Alert>
                    </div>
                  ) : (
                    <Table responsive className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Location</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(apiEvents || [])
                          .sort((a, b) => a.id - b.id)
                          .map((event) => (
                            <tr key={event.id}>
                              <td>{event.id}</td>
                              <td className="fw-semibold">{event.title}</td>
                              <td>{formatDate(event.date)}</td>
                              <td>
                                <Badge
                                  bg={
                                    event.type === "upcoming"
                                      ? "success"
                                      : "secondary"
                                  }
                                >
                                  {event.type}
                                </Badge>
                              </td>
                              <td>{event.location}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => handleView(event, "event")}
                                  >
                                    <FontAwesomeIcon icon={faEye} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-warning"
                                    onClick={() => handleEdit(event, "event")}
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleDelete(event, "event")}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Gallery Tab */}
            <Tab.Pane eventKey="gallery">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Gallery Management</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAdd("galleryItem")}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Add Gallery Item
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  {galleryLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading gallery items...
                        </span>
                      </div>
                      <p className="text-muted">Loading gallery items...</p>
                    </div>
                  ) : galleryError ? (
                    <div className="text-center py-4">
                      <Alert variant="danger">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="me-2"
                        />
                        Error loading gallery items: {galleryError}
                      </Alert>
                    </div>
                  ) : (
                    <Table responsive className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Image</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Tags</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(apiGalleryItems || [])
                          .sort((a, b) => a.id - b.id)
                          .map((item) => (
                            <tr key={item.id}>
                              <td>{item.id}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {item.thumbnail ? (
                                    <img
                                      src={item.thumbnail}
                                      alt={item.title}
                                      className="rounded me-2"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <div
                                      className="bg-light rounded d-flex align-items-center justify-content-center me-2"
                                      style={{ width: "50px", height: "50px" }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faImages}
                                        className="text-muted"
                                      />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="fw-semibold">{item.title}</td>
                              <td>
                                <Badge bg="info">{item.category}</Badge>
                              </td>
                              <td>
                                <div className="d-flex flex-wrap gap-1">
                                  {(item.tags || [])
                                    .slice(0, 3)
                                    .map((tag, index) => (
                                      <Badge
                                        key={index}
                                        bg="secondary"
                                        className="small"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  {(item.tags || []).length > 3 && (
                                    <Badge
                                      bg="light"
                                      text="dark"
                                      className="small"
                                    >
                                      +{(item.tags || []).length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td>{formatDate(item.created_at)}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() =>
                                      handleView(item, "galleryItem")
                                    }
                                  >
                                    <FontAwesomeIcon icon={faEye} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-warning"
                                    onClick={() =>
                                      handleEdit(item, "galleryItem")
                                    }
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() =>
                                      handleDelete(item, "galleryItem")
                                    }
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>

      {/* View/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton onHide={handleCloseModal}>
          <Modal.Title>
            {isAdding
              ? `Add New ${modalType}`
              : isEditing
              ? `Edit ${modalType}`
              : `View ${modalType} Details`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(isEditing || isAdding) && editingItem ? (
            <div>{renderEditForm()}</div>
          ) : selectedItem && !isEditing && !isAdding ? (
            <div>{renderViewContent()}</div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {(isEditing || isAdding) && editingItem && (
            <Button variant="primary" onClick={handleSaveEdit}>
              {isAdding ? "Add Item" : "Save Changes"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this {modalType}?
          <br />
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FontAwesomeIcon
              icon={faSignOutAlt}
              size="3x"
              className="text-warning mb-3"
            />
            <h5>Are you sure you want to logout?</h5>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
            Yes, Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
