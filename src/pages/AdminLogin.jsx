import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
  ProgressBar,
  Badge,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faQuestionCircle,
  faShieldAlt,
  faCheckCircle,
  faExclamationTriangle,
  faClock,
  faFingerprint,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faFacebook,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import {
  detectSecurityThreat,
  getSecurityErrorMessage,
} from "../utils/securityUtils";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasSecurityThreat, setHasSecurityThreat] = useState(false);
  const navigate = useNavigate();

  // Check for biometric authentication availability
  useEffect(() => {
    if (window.PublicKeyCredential) {
      setBiometricAvailable(true);
    }
  }, []);

  // Load remembered credentials
  useEffect(() => {
    const remembered = localStorage.getItem("adminRememberMe");
    if (remembered === "true") {
      const savedUsername = localStorage.getItem("adminUsername");
      if (savedUsername) {
        setFormData((prev) => ({ ...prev, username: savedUsername }));
        setRememberMe(true);
      }
    }
  }, []);

  // Handle account lockout timer
  useEffect(() => {
    let timer;
    if (lockoutTime > 0) {
      timer = setTimeout(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [lockoutTime]);

  // Auto-dismiss error messages after 3 seconds
  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  // Auto-dismiss success messages after 3 seconds
  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check for security threats
    const securityError = getSecurityErrorMessage(value);
    if (securityError) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: securityError,
      }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Check if any field has security threat
    const updatedFormData = { ...formData, [name]: value };
    const hasThreat =
      detectSecurityThreat(updatedFormData.username) ||
      detectSecurityThreat(updatedFormData.password);
    setHasSecurityThreat(hasThreat);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if account is locked
    if (isLocked) {
      setError(
        `Account is temporarily locked. Try again in ${Math.ceil(
          lockoutTime / 60
        )} minutes.`
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle login attempts and lockout
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockoutTime(15 * 60); // 15 minutes lockout
          setError("Too many failed attempts. Account locked for 15 minutes.");
        } else {
          setError(
            `${data.error || "Login failed"} (${
              5 - newAttempts
            } attempts remaining)`
          );
        }
        throw new Error(data.error || "Login failed");
      }

      // Reset login attempts on successful login
      setLoginAttempts(0);

      // Store authentication data
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUsername", data.user.username);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("adminRememberMe", "true");
        localStorage.setItem("adminUsername", formData.username);
      } else {
        localStorage.removeItem("adminRememberMe");
        localStorage.removeItem("adminUsername");
      }

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (error) {
      console.error("Login error:", error);
      if (
        !error.message.includes("attempts remaining") &&
        !error.message.includes("locked")
      ) {
        setError(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricAvailable) {
      setError("Biometric authentication is not available on this device.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // This is a placeholder for actual biometric authentication
      // In a real implementation, you would use WebAuthn API
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          userVerification: "required",
        },
      });

      if (credential) {
        setSuccess("Biometric authentication successful!");
        // Handle successful biometric login
        setTimeout(() => navigate("/admin/dashboard"), 1000);
      }
    } catch (error) {
      console.error("Biometric login error:", error);
      setError("Biometric authentication failed. Please use password login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // For demo purposes, show alert. In production, this would redirect to OAuth provider
    alert(
      `${provider} login is not fully implemented yet. Please use the standard login form.`
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="admin-login-page min-vh-100 d-flex align-items-center position-relative"
      style={{
        background: "#ffffff",
      }}
    >
      {/* Background Pattern */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container className="position-relative">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card
              className="border shadow-sm"
              style={{ background: "#ffffff", borderColor: "#e9ecef" }}
            >
              <Card.Body className="">
                {/* Header Section */}
                <div className="text-center">
                  <div className="position-relative d-inline-block mb-3">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "90px",
                        height: "90px",
                        boxShadow: "0 8px 25px rgba(0,123,255,0.3)",
                      }}
                    >
                      <FontAwesomeIcon icon={faShieldAlt} size="3x" />
                    </div>
                    {biometricAvailable && (
                      <Badge
                        bg="success"
                        className="position-absolute top-0 end-0 rounded-circle p-1"
                        style={{
                          width: "24px",
                          height: "24px",
                          fontSize: "10px",
                        }}
                      >
                        <FontAwesomeIcon icon={faFingerprint} />
                      </Badge>
                    )}
                  </div>
                  <h2 className="fw-bold text-primary mb-2">Admin Portal</h2>

                  {/* Security Status */}
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    <Badge bg="success" className="px-3 py-1">
                      <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                      SSL Encrypted
                    </Badge>
                    <Badge bg="info" className="px-3 py-1">
                      <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                      Secure Login
                    </Badge>
                  </div>
                </div>

                {/* Account Lockout Warning */}
                {isLocked && (
                  <Alert variant="warning" className="mb-3">
                    <FontAwesomeIcon icon={faClock} className="me-2" />
                    <strong>Account Temporarily Locked</strong>
                    <br />
                    Too many failed login attempts. Please wait{" "}
                    {formatTime(lockoutTime)} before trying again.
                    <ProgressBar
                      now={(lockoutTime / (15 * 60)) * 100}
                      className="mt-2"
                      variant="warning"
                      style={{ height: "6px" }}
                    />
                  </Alert>
                )}

                {/* Error Alert */}
                {error && !isLocked && (
                  <Alert variant="danger" className="mb-3">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="me-2"
                    />
                    {error}
                  </Alert>
                )}

                {/* Success Alert */}
                {success && (
                  <Alert variant="success" className="mb-3">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Username</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FontAwesomeIcon icon={faUser} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        className="border-start-0"
                        required
                        disabled={isLocked}
                        isInvalid={!!fieldErrors.username}
                      />
                      <Form.Control.Feedback type="invalid">
                        {fieldErrors.username}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FontAwesomeIcon icon={faLock} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="border-start-0 border-end-0"
                        required
                        disabled={isLocked}
                        isInvalid={!!fieldErrors.password}
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        className="border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLocked}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </Button>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Remember Me & Biometric Login */}
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Remember me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLocked}
                    />
                    {biometricAvailable && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={handleBiometricLogin}
                        disabled={loading || isLocked}
                        className="d-flex align-items-center"
                      >
                        <FontAwesomeIcon
                          icon={faFingerprint}
                          className="me-1"
                        />
                        Biometric
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-3 fw-semibold mb-1"
                    disabled={loading || isLocked || hasSecurityThreat}
                    style={{
                      background: "#007bff",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)",
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                        Login
                      </>
                    )}
                  </Button>
                </Form>

                {/* Social Media Login Options */}
                <div className="text-center my-2">
                  <div className="position-relative">
                    <hr className="my-4" />
                    <span
                      className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted"
                      style={{ fontSize: "14px" }}
                    >
                      Or continue with
                    </span>
                  </div>
                  <div className="d-flex gap-2 justify-content-center mt-1">
                    <Button
                      variant="outline-danger"
                      className="flex-fill"
                      onClick={() => handleSocialLogin("Google")}
                      disabled={isLocked}
                      style={{ maxWidth: "120px" }}
                    >
                      <FontAwesomeIcon icon={faGoogle} className="me-2" />
                      Google
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="flex-fill"
                      onClick={() => handleSocialLogin("Facebook")}
                      disabled={isLocked}
                      style={{ maxWidth: "120px" }}
                    >
                      <FontAwesomeIcon icon={faFacebook} className="me-2" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline-dark"
                      className="flex-fill"
                      onClick={() => handleSocialLogin("GitHub")}
                      disabled={isLocked}
                      style={{ maxWidth: "120px" }}
                    >
                      <FontAwesomeIcon icon={faGithub} className="me-2" />
                      GitHub
                    </Button>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="text-center">
                  <div className="d-flex justify-content-center gap-4 mb-3">
                    <Link
                      to="/admin/forgot-password"
                      className="text-decoration-none"
                    >
                      <small className="text-muted fw-semibold link-hover">
                        <FontAwesomeIcon
                          icon={faQuestionCircle}
                          className="me-1"
                        />
                        Forgot Password?
                      </small>
                    </Link>
                  </div>

                  {/* Security Notice */}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;
