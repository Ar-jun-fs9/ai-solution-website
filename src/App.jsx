import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import CaseStudies from "./pages/CaseStudies";
import Feedback from "./pages/Feedback";
import Blog from "./pages/Blog";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ForgetPassword from "./pages/ForgetPassword";
import NotFound from "./pages/NotFound";

// Context
import { AdminProvider } from "./contexts/AdminContext";

// Component to conditionally render header/footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPage =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/admin-login-55x";

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <Chatbot />
    </>
  );
};

function App() {
  return (
    <AdminProvider>
      <Router>
        <div className="App">
          <AppLayout>
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/events" element={<Events />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin-login-55x" element={<AdminLogin />} />
                <Route
                  path="/admin/forgot-password"
                  element={<ForgetPassword />}
                />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </AppLayout>
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;
