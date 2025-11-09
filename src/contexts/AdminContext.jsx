import React, { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  // Services Management
  const [services, setServices] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from data files
  useEffect(() => {
    const loadData = async () => {
      try {
        // Import data files dynamically
        const [
          servicesModule,
          caseStudiesModule,
          testimonialsModule,
          blogModule,
          eventsModule,
          galleryModule,
          inquiriesModule,
        ] = await Promise.all([
          import("../data/services"),
          import("../data/caseStudies"),
          import("../data/testimonials"),
          import("../data/blog"),
          import("../data/events"),
          import("../data/gallery"),
          import("../data/inquiries"),
        ]);

        setServices(servicesModule.services);
        setCaseStudies(caseStudiesModule.caseStudies);
        setTestimonials(testimonialsModule.testimonials);
        setBlogPosts(blogModule.blogPosts);
        setUpcomingEvents(eventsModule.upcomingEvents);
        setPastEvents(eventsModule.pastEvents);
        setGalleryItems(galleryModule.galleryItems);
        setInquiries(inquiriesModule.inquiries);

        // Load additional inquiries from localStorage if any
        const savedInquiries = localStorage.getItem("customerInquiries");
        if (savedInquiries) {
          const additionalInquiries = JSON.parse(savedInquiries);
          setInquiries((prev) => [...prev, ...additionalInquiries]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save inquiries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customerInquiries", JSON.stringify(inquiries));
  }, [inquiries]);

  // Services CRUD
  const addService = (service) => {
    const newService = {
      ...service,
      id: Date.now(),
      icon: service.icon || "fa-code",
    };
    setServices((prev) => [...prev, newService]);
  };

  const updateService = (id, updatedService) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, ...updatedService } : service
      )
    );
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  // Case Studies CRUD
  const addCaseStudy = (caseStudy) => {
    const newCaseStudy = {
      ...caseStudy,
      id: Date.now(),
    };
    setCaseStudies((prev) => [...prev, newCaseStudy]);
  };

  const updateCaseStudy = (id, updatedCaseStudy) => {
    setCaseStudies((prev) =>
      prev.map((caseStudy) =>
        caseStudy.id === id ? { ...caseStudy, ...updatedCaseStudy } : caseStudy
      )
    );
  };

  const deleteCaseStudy = (id) => {
    setCaseStudies((prev) => prev.filter((caseStudy) => caseStudy.id !== id));
  };

  // Testimonials CRUD
  const addTestimonial = (testimonial) => {
    const newTestimonial = {
      ...testimonial,
      id: Date.now(),
      rating: parseInt(testimonial.rating) || 5,
    };
    setTestimonials((prev) => [...prev, newTestimonial]);
  };

  const updateTestimonial = (id, updatedTestimonial) => {
    setTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === id
          ? { ...testimonial, ...updatedTestimonial }
          : testimonial
      )
    );
  };

  const deleteTestimonial = (id) => {
    setTestimonials((prev) =>
      prev.filter((testimonial) => testimonial.id !== id)
    );
  };

  // Blog Posts CRUD
  const addBlogPost = (blogPost) => {
    const newBlogPost = {
      ...blogPost,
      id: Date.now(),
      publishDate:
        blogPost.publishDate || new Date().toISOString().split("T")[0],
      readTime: blogPost.readTime || "5 min read",
    };
    setBlogPosts((prev) => [...prev, newBlogPost]);
  };

  const updateBlogPost = (id, updatedBlogPost) => {
    setBlogPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, ...updatedBlogPost } : post
      )
    );
  };

  const deleteBlogPost = (id) => {
    setBlogPosts((prev) => prev.filter((post) => post.id !== id));
  };

  // Events CRUD
  const addEvent = (event, type = "upcoming") => {
    const newEvent = {
      ...event,
      id: Date.now(),
    };

    if (type === "upcoming") {
      setUpcomingEvents((prev) => [...prev, newEvent]);
    } else {
      setPastEvents((prev) => [...prev, newEvent]);
    }
  };

  const updateEvent = (id, updatedEvent, type = "upcoming") => {
    if (type === "upcoming") {
      setUpcomingEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      );
    } else {
      setPastEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      );
    }
  };

  const deleteEvent = (id, type = "upcoming") => {
    if (type === "upcoming") {
      setUpcomingEvents((prev) => prev.filter((event) => event.id !== id));
    } else {
      setPastEvents((prev) => prev.filter((event) => event.id !== id));
    }
  };

  // Gallery Items CRUD
  const addGalleryItem = (galleryItem) => {
    const newGalleryItem = {
      ...galleryItem,
      id: Date.now(),
      date: galleryItem.date || new Date().toISOString().split("T")[0],
    };
    setGalleryItems((prev) => [...prev, newGalleryItem]);
  };

  const updateGalleryItem = (id, updatedGalleryItem) => {
    setGalleryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedGalleryItem } : item
      )
    );
  };

  const deleteGalleryItem = (id) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Inquiries CRUD
  const addInquiry = (inquiry) => {
    const newInquiry = {
      ...inquiry,
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      status: "new",
      priority: "medium",
    };
    setInquiries((prev) => [...prev, newInquiry]);
  };

  const updateInquiry = (id, updatedInquiry) => {
    setInquiries((prev) =>
      prev.map((inquiry) =>
        inquiry.id === id ? { ...inquiry, ...updatedInquiry } : inquiry
      )
    );
  };

  const deleteInquiry = (id) => {
    setInquiries((prev) => prev.filter((inquiry) => inquiry.id !== id));
  };

  // Get statistics
  const getStats = () => {
    const totalInquiries = inquiries?.length || 0;
    const newInquiries =
      inquiries?.filter((i) => i.status === "new")?.length || 0;
    const inProgressInquiries =
      inquiries?.filter((i) => i.status === "in-progress")?.length || 0;
    const completedInquiries =
      inquiries?.filter((i) => i.status === "completed")?.length || 0;

    return {
      totalInquiries,
      newInquiries,
      inProgressInquiries,
      completedInquiries,
      totalServices: services?.length || 0,
      totalCaseStudies: caseStudies?.length || 0,
      totalTestimonials: testimonials?.length || 0,
      totalBlogPosts: blogPosts?.length || 0,
      totalUpcomingEvents: upcomingEvents?.length || 0,
      totalPastEvents: pastEvents?.length || 0,
      totalGalleryItems: galleryItems?.length || 0,
    };
  };

  const value = {
    // Data
    services,
    caseStudies,
    testimonials,
    blogPosts,
    upcomingEvents,
    pastEvents,
    galleryItems,
    inquiries,
    isLoading,

    // Services CRUD
    addService,
    updateService,
    deleteService,

    // Case Studies CRUD
    addCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,

    // Testimonials CRUD
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,

    // Blog Posts CRUD
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,

    // Events CRUD
    addEvent,
    updateEvent,
    deleteEvent,

    // Gallery Items CRUD
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,

    // Inquiries CRUD
    addInquiry,
    updateInquiry,
    deleteInquiry,

    // Statistics
    getStats,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
