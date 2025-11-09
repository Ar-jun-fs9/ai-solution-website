import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Form, InputGroup, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faTimes,
  faPaperPlane,
  faRobot,
  faMicrophone,
  faMicrophoneSlash,
  faVolumeUp,
  faVolumeMute,
  faKeyboard,
  faHeadphones,
} from "@fortawesome/free-solid-svg-icons";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Voice functionality states
  const [chatMode, setChatMode] = useState(null); // 'text' or 'voice'
  const [showModeModal, setShowModeModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Meaningful chat popup states
  const [showMeaningfulChatModal, setShowMeaningfulChatModal] = useState(false);
  const [isChatMeaningful, setIsChatMeaningful] = useState(null);

  // Refs for speech recognition and synthesis
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Start chat session when chat opens
  useEffect(() => {
    if (isOpen && !sessionId) {
      startNewSession();
    }
  }, [isOpen, sessionId]);

  const startNewSession = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/chatbot/session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
      }
    } catch (error) {
      console.error("Error starting chat session:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !sessionId) return;

    const userMessageText = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to UI
    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chatbot/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            message: userMessageText,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Add bot response to UI
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          isBot: true,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);

        // Speak the response if in voice mode
        if (chatMode === "voice") {
          speakText(data.response);
        }
      } else {
        // Handle error response - the server now provides contextual error messages
        const errorData = await response.json().catch(() => ({
          response:
            "I'm sorry, I'm experiencing technical difficulties. Please try again later.",
        }));
        const botMessage = {
          id: Date.now() + 1,
          text:
            errorData.response ||
            "I'm sorry, I'm experiencing technical difficulties. Please try again later.",
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const botMessage = {
        id: Date.now() + 1,
        text: "I apologize for the inconvenience! 🔧 As AI Solution's AI assistant, I'm here to help you with your software development needs. While I'm experiencing a temporary technical issue, our team of expert developers is always ready to assist you directly. You can visit our Services page: http://localhost:5173/services or contact us: http://localhost:5173/contact. Please try again in a moment!",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice functionality functions
  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      // Stop any ongoing speech when user starts speaking
      if (synthRef.current && isSpeaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text) => {
    if (synthRef.current && voiceEnabled && chatMode === "voice") {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Get available voices
      const voices = synthRef.current.getVoices();

      // Find a female voice (prefer English female voices)
      const femaleVoice =
        voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("girl") ||
            (voice.name.toLowerCase().includes("english") &&
              voice.name.toLowerCase().includes("us") &&
              voice.gender === "female") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("victoria") ||
            voice.name.toLowerCase().includes("alex") ||
            voice.name.toLowerCase().includes("zira")
        ) ||
        voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            voice.name.toLowerCase().includes("us")
        ) ||
        voices[0]; // Fallback to first available voice

      // Set voice if found
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      // Voice settings for sweet female voice
      utterance.rate = 1.3; // Faster speech (was 0.9)
      utterance.pitch = 1.15; // Slightly higher pitch for sweeter sound (was 1)
      utterance.volume = 0.9; // Slightly louder (was 0.8)

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      synthRef.current?.cancel();
      setIsSpeaking(false);
    }
  };

  const selectChatMode = (mode) => {
    setChatMode(mode);
    setShowModeModal(false);
    setIsOpen(true);
  };

  const toggleChat = () => {
    if (!chatMode) {
      setShowModeModal(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleEndChatClick = () => {
    setShowMeaningfulChatModal(true);
  };

  const handleMeaningfulChatResponse = async (wasMeaningful) => {
    setIsChatMeaningful(wasMeaningful);
    setShowMeaningfulChatModal(false);

    // Update conversion status in database
    if (sessionId) {
      try {
        await fetch("http://localhost:5000/api/chatbot/update-conversion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            isConverted: wasMeaningful,
          }),
        });
      } catch (error) {
        console.error("Error updating conversion status:", error);
      }
    }

    // Now actually end the chat
    await finalizeEndChat();
  };

  const finalizeEndChat = async () => {
    try {
      // End the session in the database if we have a session ID
      if (sessionId) {
        await fetch("http://localhost:5000/api/chatbot/end-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });
      }
    } catch (error) {
      console.error("Error ending chat session:", error);
    }

    // Reset all chat state
    setIsOpen(false);
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    setInputMessage("");
    setSessionId(null);
    setChatMode(null);
    setIsListening(false);
    setIsSpeaking(false);
    setIsChatMeaningful(null);

    // Stop any ongoing speech
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Function to render message text with clickable links
  const renderMessageWithLinks = (text) => {
    // Regular expression to match URLs (excluding trailing punctuation)
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split text by URLs and create elements
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        // Clean the URL by removing trailing punctuation
        let cleanUrl = part;
        // Remove trailing punctuation marks
        cleanUrl = cleanUrl.replace(/[.,!?;:]$/, "");

        return (
          <a
            key={index}
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-decoration-underline"
            style={{ wordBreak: "break-all" }}
          >
            {cleanUrl}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div
      className="chatbot-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1000 }}
    >
      {/* Custom styles for compact modal */}
      <style jsx>{`
        .compact-modal .modal-dialog {
          max-width: 300px;
          margin: 0;
        }
        .compact-modal .modal-content {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .compact-modal .modal-header {
          padding: 0.5rem 1rem;
        }
        .compact-modal .modal-body {
          padding: 0.75rem 1rem;
        }
        .x-small {
          font-size: 0.75rem;
        }
      `}</style>
      {/* Mode Selection Popup - Above Chatbot Icon */}
      {showModeModal && (
        <div
          className="position-absolute bg-white border rounded shadow-sm p-3"
          style={{
            bottom: "70px", // Position above the 60px button + some margin
            right: "15px", // Align with button's right edge
            width: "280px",
            zIndex: 1050,
            maxHeight: "250px",
          }}
        >
          <div className="text-center mb-3">
            <div className="fw-bold text-primary small">
              Choose AI Assistant Mode
            </div>
          </div>
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="sm"
              className="d-flex align-items-center justify-content-center py-2"
              onClick={() => selectChatMode("text")}
            >
              <FontAwesomeIcon icon={faKeyboard} className="me-2" />
              <div className="text-start">
                <div className="fw-semibold small mb-0">Text AI Assistant</div>
                <small className="text-white">Type your questions</small>
              </div>
            </Button>
            <Button
              variant="success"
              size="sm"
              className="d-flex align-items-center justify-content-center py-2"
              onClick={() => selectChatMode("voice")}
            >
              <FontAwesomeIcon icon={faHeadphones} className="me-2" />
              <div className="text-start">
                <div className="fw-semibold small mb-0">Voice AI Assistant</div>
                <small className="text-white">Speak your questions</small>
              </div>
            </Button>
          </div>
          <div className="text-center mt-2">
            <Button
              variant="link"
              size="sm"
              className="text-muted p-0"
              onClick={() => setShowModeModal(false)}
              style={{ fontSize: "0.75rem" }}
            >
              <FontAwesomeIcon icon={faTimes} className="me-1" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Meaningful Chat Modal - Ultra Compact Inline Version */}
      {showMeaningfulChatModal && (
        <div
          className="position-absolute bg-white border rounded shadow-sm p-2"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "200px",
            zIndex: 1060,
            maxHeight: "180px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small
              className="fw-bold text-primary"
              style={{ fontSize: "0.7rem" }}
            >
              <FontAwesomeIcon icon={faRobot} className="me-1" size="sm" />
              Chat Experience
            </small>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-muted"
              onClick={() => setShowMeaningfulChatModal(false)}
              style={{ fontSize: "0.7rem" }}
            >
              <FontAwesomeIcon icon={faTimes} size="sm" />
            </Button>
          </div>

          <div className="text-center mb-2">
            <FontAwesomeIcon
              icon={faRobot}
              className="text-primary mb-1"
              size="sm"
            />
            <div
              className="small fw-medium mb-1"
              style={{ fontSize: "0.75rem" }}
            >
              Was this chat helpful?
            </div>
            <div className="text-muted" style={{ fontSize: "0.65rem" }}>
              Help us improve
            </div>
          </div>

          <div className="d-grid gap-1">
            <Button
              variant="success"
              size="sm"
              onClick={() => handleMeaningfulChatResponse(true)}
              className="py-1"
              style={{ fontSize: "0.7rem" }}
            >
              <FontAwesomeIcon icon={faRobot} className="me-1" size="sm" />
              Yes, helpful!
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleMeaningfulChatResponse(false)}
              className="py-1"
              style={{ fontSize: "0.7rem" }}
            >
              <FontAwesomeIcon icon={faTimes} className="me-1" size="sm" />
              Not helpful
            </Button>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          variant="primary"
          size="lg"
          className={`rounded-circle shadow ${
            chatMode === "voice"
              ? "voice-mode-indicator"
              : chatMode === null
              ? "chatbot-initial-pulse"
              : ""
          }`}
          onClick={toggleChat}
          style={{ width: "60px", height: "60px" }}
          title={
            chatMode
              ? `Open ${chatMode === "voice" ? "Voice" : "Text"} AI Assistant`
              : "Choose AI Assistant Mode"
          }
        >
          <FontAwesomeIcon
            icon={
              chatMode === "voice"
                ? faHeadphones
                : chatMode === "text"
                ? faComments
                : faRobot
            }
            size="lg"
          />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="shadow-lg" style={{ width: "350px", height: "500px" }}>
          {/* Chat Header */}
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon
                icon={chatMode === "voice" ? faHeadphones : faRobot}
                className="me-2"
              />
              <div>
                <span className="fw-bold">
                  {chatMode === "voice"
                    ? "Voice AI Assistant"
                    : "Text AI Assistant"}
                </span>
                {chatMode === "voice" && (
                  <div className="small opacity-75">
                    {isListening
                      ? "🎤 Listening..."
                      : "Click microphone to speak"}
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleEndChatClick}
                title="End Chat & Reset"
                className="me-1"
              >
                <small>End Chat</small>
              </Button>
              {chatMode === "voice" && (
                <Button
                  variant="link"
                  className="text-white p-1"
                  onClick={toggleVoice}
                  title={voiceEnabled ? "Disable voice" : "Enable voice"}
                >
                  <FontAwesomeIcon
                    icon={voiceEnabled ? faVolumeUp : faVolumeMute}
                  />
                </Button>
              )}
              <Button
                variant="link"
                className="text-white p-0"
                onClick={toggleChat}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </div>
          </Card.Header>

          {/* Chat Messages */}
          <Card.Body
            className="p-0 d-flex flex-column"
            style={{ height: "400px" }}
          >
            <div className="flex-grow-1 p-3 overflow-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 d-flex ${
                    message.isBot
                      ? "justify-content-start"
                      : "justify-content-end"
                  }`}
                >
                  <div
                    className={`p-2 rounded-3 ${
                      message.isBot
                        ? "bg-light text-dark"
                        : "bg-primary text-white"
                    }`}
                    style={{ maxWidth: "80%" }}
                  >
                    <div className="small text-muted mb-1">
                      {message.isBot ? "AI Assistant" : "You"}
                    </div>
                    {message.isBot
                      ? renderMessageWithLinks(message.text)
                      : message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mb-3 d-flex justify-content-start">
                  <div
                    className="p-2 rounded-3 bg-light text-dark"
                    style={{ maxWidth: "80%" }}
                  >
                    <div className="small text-muted mb-1">AI Assistant</div>
                    <div className="d-flex align-items-center">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="ms-2 small text-muted">
                        AI is typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-top">
              {chatMode === "voice" ? (
                <div className="d-flex gap-2">
                  <Button
                    variant={isListening ? "danger" : "success"}
                    className="flex-grow-1 d-flex align-items-center justify-content-center"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon
                      icon={isListening ? faMicrophoneSlash : faMicrophone}
                      className="me-2"
                    />
                    {isListening ? "Stop Listening" : "Start Speaking"}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    {isLoading ? (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <FontAwesomeIcon icon={faPaperPlane} />
                    )}
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleSendMessage}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder={
                        isLoading ? "AI is typing..." : "Type your message..."
                      }
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="border-end-0"
                      disabled={isLoading}
                    />
                    <Button
                      variant="primary"
                      type="submit"
                      className="border-start-0"
                      disabled={isLoading || !inputMessage.trim()}
                    >
                      {isLoading ? (
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <FontAwesomeIcon icon={faPaperPlane} />
                      )}
                    </Button>
                  </InputGroup>
                </Form>
              )}

              {/* Voice status indicator */}
              {chatMode === "voice" && (
                <div className="mt-2 text-center">
                  <small className="text-muted">
                    {isSpeaking && "🔊 AI is speaking..."}
                    {isListening && "🎤 Listening for your voice..."}
                    {!isSpeaking &&
                      !isListening &&
                      voiceEnabled &&
                      "Click microphone to speak your question"}
                    {!voiceEnabled &&
                      "Voice responses disabled - click speaker icon to enable"}
                  </small>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Chatbot;
