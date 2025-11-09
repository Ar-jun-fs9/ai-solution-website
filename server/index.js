const express = require("express");
const cors = require("cors");   
const path = require("path");
const pool = require("./db");

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Routes
const authRoutes = require("./routes/authRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const servicesRoutes = require("./routes/servicesRoutes");
const caseStudiesRoutes = require("./routes/caseStudiesRoutes");
const testimonialsRoutes = require("./routes/testimonialsRoutes");
const blogRoutes = require("./routes/blogRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/case-studies", caseStudiesRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("Server is running ");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
