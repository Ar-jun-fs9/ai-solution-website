export const galleryItems = [
  {
    id: 1,
    title: "Tech Innovation Conference 2024",
    description: "Our flagship technology conference showcasing the latest innovations in software development and system integration.",
    category: "Events",
    date: "2024-02-15",
    image: "/src/image/gallery1.jpg",
    thumbnail: "/src/image/gallery1.jpg",
    tags: ["Conference", "Technology", "Innovation", "Networking"]
  },
  {
    id: 2,
    title: "Team Collaboration Session",
    description: "Our development team working together on a complex system integration project.",
    category: "Team",
    date: "2024-03-01",
    image: "/src/image/gallery2.jpg",
    thumbnail: "/src/image/gallery2.jpg",
    tags: ["Team", "Collaboration", "Development", "Innovation"]
  },
  {
    id: 3,
    title: "AI & Machine Learning Workshop",
    description: "Interactive workshop on implementing AI and machine learning solutions in enterprise applications.",
    category: "Workshops",
    date: "2024-02-28",
    image: "/src/image/gallery3.jpg",
    thumbnail: "/src/image/gallery3.jpg",
    tags: ["AI", "Machine Learning", "Workshop", "Education"]
  },
  {
    id: 4,
    title: "Client Presentation",
    description: "Presenting our digital transformation solution to a major manufacturing client.",
    category: "Client Meetings",
    date: "2024-03-10",
    image: "/src/image/gallery4.jpg",
    thumbnail: "/src/image/gallery4.jpg",
    tags: ["Client", "Presentation", "Digital Transformation", "Manufacturing"]
  },
  {
    id: 5,
    title: "Cloud Migration Project",
    description: "Successfully completing a major cloud migration project for a financial services client.",
    category: "Projects",
    date: "2024-02-20",
    image: "/src/image/gallery5.jpg",
    thumbnail: "/src/image/gallery5.jpg",
    tags: ["Cloud", "Migration", "Financial Services", "Success"]
  },




  
  {
    id: 6,
    title: "Cybersecurity Training",
    description: "Our cybersecurity team conducting training sessions for clients on best practices and threat prevention.",
    category: "Training",
    date: "2024-03-05",
    image: "/images/gallery/cybersecurity-training.jpg",
    thumbnail: "/images/gallery/thumbnails/cybersecurity-training-thumb.jpg",
    tags: ["Cybersecurity", "Training", "Best Practices", "Security"]
  },
  {
    id: 7,
    title: "Product Launch Event",
    description: "Launching our new AI-powered customer service platform at a major industry event.",
    category: "Product Launches",
    date: "2024-01-25",
    image: "/images/gallery/product-launch.jpg",
    thumbnail: "/images/gallery/thumbnails/product-launch-thumb.jpg",
    tags: ["Product Launch", "AI", "Customer Service", "Innovation"]
  },
  {
    id: 8,
    title: "Office Innovation Hub",
    description: "Our state-of-the-art innovation hub where we develop cutting-edge solutions for clients.",
    category: "Office",
    date: "2024-03-12",
    image: "/images/gallery/innovation-hub.jpg",
    thumbnail: "/images/gallery/thumbnails/innovation-hub-thumb.jpg",
    tags: ["Office", "Innovation", "Technology", "Workspace"]
  },
  {
    id: 9,
    title: "Healthcare Technology Symposium",
    description: "Presenting our healthcare data management solutions at the annual healthcare technology symposium.",
    category: "Events",
    date: "2023-12-10",
    image: "/images/gallery/healthcare-symposium.jpg",
    thumbnail: "/images/gallery/thumbnails/healthcare-symposium-thumb.jpg",
    tags: ["Healthcare", "Symposium", "Data Management", "Technology"]
  },
  {
    id: 10,
    title: "Team Building Event",
    description: "Annual team building event to strengthen collaboration and celebrate our achievements.",
    category: "Team",
    date: "2024-01-15",
    image: "/images/gallery/team-building.jpg",
    thumbnail: "/images/gallery/thumbnails/team-building-thumb.jpg",
    tags: ["Team Building", "Collaboration", "Celebration", "Culture"]
  },
  {
    id: 11,
    title: "Client Success Celebration",
    description: "Celebrating the successful completion of a major digital transformation project with our client team.",
    category: "Client Success",
    date: "2024-02-10",
    image: "/images/gallery/client-success.jpg",
    thumbnail: "/images/gallery/thumbnails/client-success-thumb.jpg",
    tags: ["Client Success", "Digital Transformation", "Celebration", "Partnership"]
  },
  {
    id: 12,
    title: "Technology Demo Day",
    description: "Demonstrating our latest AI and machine learning solutions to potential clients and partners.",
    category: "Demos",
    date: "2024-03-08",
    image: "/images/gallery/tech-demo.jpg",
    thumbnail: "/images/gallery/thumbnails/tech-demo-thumb.jpg",
    tags: ["Demo", "AI", "Machine Learning", "Technology"]
  },
  {
    id: 13,
    title: "Industry Conference Panel",
    description: "Our experts participating in a panel discussion on the future of enterprise software development.",
    category: "Events",
    date: "2024-02-22",
    image: "/images/gallery/industry-panel.jpg",
    thumbnail: "/images/gallery/thumbnails/industry-panel-thumb.jpg",
    tags: ["Conference", "Panel", "Enterprise Software", "Expertise"]
  },
  {
    id: 14,
    title: "Mobile App Development",
    description: "Our mobile development team working on cross-platform applications for enterprise clients.",
    category: "Development",
    date: "2024-03-15",
    image: "/images/gallery/mobile-development.jpg",
    thumbnail: "/images/gallery/thumbnails/mobile-development-thumb.jpg",
    tags: ["Mobile", "Development", "Cross-platform", "Enterprise"]
  },
  {
    id: 15,
    title: "Data Center Visit",
    description: "Visiting our secure data center facilities to ensure optimal performance and security for client solutions.",
    category: "Infrastructure",
    date: "2024-02-28",
    image: "/images/gallery/data-center.jpg",
    thumbnail: "/images/gallery/thumbnails/data-center-thumb.jpg",
    tags: ["Data Center", "Infrastructure", "Security", "Performance"]
  }
];

export const galleryCategories = [
  "All",
  "Events",
  "Team",
  "Workshops",
  "Client Meetings",
  "Projects",
  "Training",
  "Product Launches",
  "Office",
  "Client Success",
  "Demos",
  "Development",
  "Infrastructure"
];

export const featuredImages = galleryItems.filter(img =>
  ["Conference", "Product Launch", "Client Success", "Innovation"].some(tag =>
    img.tags.includes(tag)
  )
).slice(0, 6);
