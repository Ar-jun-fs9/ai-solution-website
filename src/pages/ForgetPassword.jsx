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
  faEnvelope,
  faLock,
  faArrowLeft,
  faCheckCircle,
  faClock,
  faKey,
  faShieldAlt,
  faUser,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faArrowRight,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP input, 3: New password
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const navigate = useNavigate();

  // Countdown timer for OTP expiration
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "newPassword") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    setError("");
    setSuccess("");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setSuccess("OTP sent successfully to your email!");
      setStep(2);
      setCountdown(60); // Start 60 second countdown
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const newAttempts = otpAttempts + 1;
        setOtpAttempts(newAttempts);

        if (newAttempts >= 3) {
          setError("Too many failed OTP attempts. Please request a new OTP.");
          setCountdown(0);
          return;
        }

        throw new Error(
          `${data.error || "Invalid OTP"} (${
            3 - newAttempts
          } attempts remaining)`
        );
      }

      setSuccess("OTP verified successfully!");
      setOtpAttempts(0);
      setResetToken(data.resetToken);
      setStep(3);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resetToken: resetToken,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess("Password reset successfully! Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/admin-login-55x");
      }, 2000);
    } catch (error) {
      console.error("Password reset error:", error);
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = () => {
    setStep(1);
    setError("");
    setSuccess("");
    setCountdown(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 25) return "danger";
    if (strength < 50) return "warning";
    if (strength < 75) return "info";
    return "success";
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 25) return "Very Weak";
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const getStepProgress = () => {
    return ((step - 1) / 2) * 100;
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Password Recovery";
      case 2:
        return "Verify OTP";
      case 3:
        return "Reset Password";
      default:
        return "Forgot Password";
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1:
        return faEnvelope;
      case 2:
        return faMobileAlt;
      case 3:
        return faKey;
      default:
        return faKey;
    }
  };

  return (
    <div
      className="forget-password-page min-vh-100 d-flex align-items-center position-relative"
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
              <Card.Body className="p-5">
                {/* Back to Login - Top of Card */}
                <div className="mb-4">
                  <Link to="/" className="text-decoration-none">
                    <Button
                      variant="link"
                      className="p-0 text-muted fw-semibold"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      {/* Back to Login */}
                    </Button>
                  </Link>
                </div>

                {/* Header Section */}
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block mb-3">
                    <div
                      className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "90px",
                        height: "90px",
                        boxShadow: "0 8px 25px rgba(255,193,7,0.3)",
                      }}
                    >
                      <FontAwesomeIcon icon={getStepIcon()} size="3x" />
                    </div>
                    <Badge
                      bg="primary"
                      className="position-absolute top-0 end-0 rounded-circle p-2"
                      style={{
                        width: "30px",
                        height: "30px",
                        fontSize: "12px",
                      }}
                    >
                      {step}/3
                    </Badge>
                  </div>

                  <h2 className="fw-bold text-primary mb-2">
                    {getStepTitle()}
                  </h2>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">Progress</small>
                      <small className="text-muted">
                        {Math.round(getStepProgress())}%
                      </small>
                    </div>
                    <ProgressBar
                      now={getStepProgress()}
                      className="mb-2"
                      style={{ height: "8px" }}
                      variant="warning"
                    />
                    <div className="d-flex justify-content-between">
                      <Badge
                        bg={step >= 1 ? "success" : "secondary"}
                        className="px-2 py-1"
                      >
                        <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                        Email
                      </Badge>
                      <Badge
                        bg={step >= 2 ? "success" : "secondary"}
                        className="px-2 py-1"
                      >
                        <FontAwesomeIcon icon={faMobileAlt} className="me-1" />
                        OTP
                      </Badge>
                      <Badge
                        bg={step >= 3 ? "success" : "secondary"}
                        className="px-2 py-1"
                      >
                        <FontAwesomeIcon icon={faKey} className="me-1" />
                        Reset
                      </Badge>
                    </div>
                  </div>

                  {/* Security Notice */}
                </div>

                {/* Error Alert */}
                {error && (
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

                {/* Step 1: Email Input */}
                {step === 1 && (
                  <Form onSubmit={handleEmailSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        Email Address
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light">
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="text-muted"
                          />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your admin email address"
                          className="border-start-0"
                          required
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        {/* <strong>HEHE:</strong> secure.seecurity.system@gmail.com */}
                      </Form.Text>
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 py-3 fw-semibold "
                      disabled={loading}
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
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          Send Verification Code
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="ms-2"
                          />
                        </>
                      )}
                    </Button>
                  </Form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                  <Form onSubmit={handleOTPSubmit}>
                    <div className="text-center mb-4">
                      <div className="bg-light rounded p-3 mb-3">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          size="2x"
                          className="text-primary mb-2"
                        />
                        <p className="text-muted mb-1">
                          Verification code sent to:
                        </p>
                        <p className="fw-semibold text-dark mb-0">
                          {formData.email}
                        </p>
                      </div>

                      {countdown > 0 && (
                        <div className="d-flex align-items-center justify-content-center text-warning mb-3">
                          <FontAwesomeIcon icon={faClock} className="me-2" />
                          <Badge bg="warning" className="px-3 py-2">
                            Code expires in: {formatTime(countdown)}
                          </Badge>
                        </div>
                      )}

                      {countdown === 0 && (
                        <Alert variant="warning" className="py-2">
                          <FontAwesomeIcon icon={faClock} className="me-2" />
                          Verification code has expired. Please request a new
                          one.
                        </Alert>
                      )}
                    </div>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-center d-block">
                        <FontAwesomeIcon
                          icon={faMobileAlt}
                          className="me-2 text-primary"
                        />
                        Enter 6-Digit Verification Code
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        placeholder="000000"
                        maxLength="6"
                        className="text-center fs-3 fw-bold"
                        style={{
                          letterSpacing: "0.5rem",
                          fontFamily: "monospace",
                          border: "2px solid #dee2e6",
                          borderRadius: "8px",
                        }}
                        required
                      />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        variant="success"
                        type="submit"
                        className="py-3 fw-semibold"
                        disabled={loading || countdown === 0}
                        style={{
                          background: "#28a745",
                          border: "none",
                          boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
                        }}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="me-2"
                            />
                            Verify Code
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="ms-2"
                            />
                          </>
                        )}
                      </Button>

                      {countdown === 0 && (
                        <Button
                          variant="outline-primary"
                          onClick={resendOTP}
                          className="py-2 fw-semibold"
                        >
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          Resend Verification Code
                        </Button>
                      )}
                    </div>
                  </Form>
                )}

                {/* Step 3: Password Reset */}
                {step === 3 && (
                  <Form onSubmit={handlePasswordReset}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        New Password
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light">
                          <FontAwesomeIcon
                            icon={faLock}
                            className="text-muted"
                          />
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your new password"
                          className="border-start-0 border-end-0"
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          className="border-start-0"
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                          />
                        </Button>
                      </InputGroup>

                      {/* Password Strength Indicator */}
                      {formData.newPassword && (
                        <div className="mt-2">
                          <div className="d-flex justify-content-between mb-1">
                            <small className="text-muted">
                              Password Strength:
                            </small>
                            <small
                              className={`fw-semibold text-${getPasswordStrengthColor(
                                passwordStrength
                              )}`}
                            >
                              {getPasswordStrengthText(passwordStrength)}
                            </small>
                          </div>
                          <ProgressBar
                            now={passwordStrength}
                            variant={getPasswordStrengthColor(passwordStrength)}
                            style={{ height: "6px" }}
                          />
                          <Form.Text className="text-muted">
                            <small>
                              Use at least 8 characters with uppercase,
                              lowercase, numbers, and symbols
                            </small>
                          </Form.Text>
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        Confirm New Password
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light">
                          <FontAwesomeIcon
                            icon={faLock}
                            className="text-muted"
                          />
                        </InputGroup.Text>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your new password"
                          className="border-start-0 border-end-0"
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="border-start-0"
                        >
                          <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                          />
                        </Button>
                      </InputGroup>

                      {/* Password Match Indicator */}
                      {formData.confirmPassword && (
                        <Form.Text
                          className={`mt-1 ${
                            formData.newPassword === formData.confirmPassword
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={
                              formData.newPassword === formData.confirmPassword
                                ? faCheckCircle
                                : faExclamationTriangle
                            }
                            className="me-1"
                          />
                          {formData.newPassword === formData.confirmPassword
                            ? "Passwords match"
                            : "Passwords do not match"}
                        </Form.Text>
                      )}
                    </Form.Group>

                    <Button
                      variant="success"
                      type="submit"
                      className="w-100 py-3 fw-semibold"
                      disabled={
                        loading ||
                        formData.newPassword !== formData.confirmPassword ||
                        passwordStrength < 50
                      }
                      style={{
                        background: "#28a745",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faKey} className="me-2" />
                          Reset Password & Sign In
                        </>
                      )}
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgetPassword;
