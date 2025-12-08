"use client";

import { useState, useEffect, useRef } from "react";
import "./globals.css";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUserName(data.user.name || data.user.email);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.log("Not authenticated");
      }
    };

    // Load chat history if authenticated
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/mefi");
        if (res.ok) {
          const history = await res.json();
          const formattedHistory = history.flatMap((item) => [
            { role: "user", content: item.question },
            { role: "assistant", content: item.answer },
          ]);
          setMessages(formattedHistory);
        }
      } catch (error) {
        console.log("No history available");
      }
    };

    fetchUserData();
    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/mefi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const assistantMessage = { role: "assistant", content: data.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    try {
      const endpoint =
        authMode === "signin"
          ? "/api/auth/sign-in/email"
          : "/api/auth/sign-up/email";

      const body =
        authMode === "signin" ? { email, password } : { email, password, name };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setShowAuth(false);
        // Fetch user data after successful auth
        const userRes = await fetch("/api/user");
        if (userRes.ok) {
          const data = await userRes.json();
          if (data.user) {
            setUserName(data.user.name || data.user.email);
          }
        }
        window.location.reload();
      } else {
        alert("Authentication failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="app-container">
      {/* Background Animation */}
      <div className="bg-gradient-animated"></div>
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="logo-text">
              <h1>Joshua Smith</h1>
              <span>AI Medical Assistant</span>
            </div>
          </div>
          <button
            className="auth-button"
            onClick={() => setShowAuth(!showAuth)}
          >
            {isAuthenticated ? userName || "Account" : "Sign In"}
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuth && (
        <div className="modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowAuth(false)}>
              ×
            </button>
            <h2>{authMode === "signin" ? "Welcome Back" : "Create Account"}</h2>
            <form onSubmit={handleAuth}>
              {authMode === "signup" && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  className="auth-input"
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="auth-input"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="auth-input"
              />
              <button type="submit" className="submit-button">
                {authMode === "signin" ? "Sign In" : "Sign Up"}
              </button>
            </form>
            <button
              className="toggle-auth"
              onClick={() =>
                setAuthMode(authMode === "signin" ? "signup" : "signin")
              }
            >
              {authMode === "signin"
                ? "Need an account? Sign up"
                : "Have an account? Sign in"}
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <main className="chat-container">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2>Hello! I'm Joshua Smith AI</h2>
            <p>Your trusted medical information assistant</p>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">🩺</div>
                <h3>Medical Info</h3>
                <p>Get reliable health information</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Safe & Secure</h3>
                <p>Your privacy is our priority</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Instant Response</h3>
                <p>Quick answers to your questions</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-area">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${
                  msg.role === "user" ? "user" : "assistant"
                }`}
              >
                <div className="message-avatar">
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className="message-content">
                  <div className="message-bubble">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-bubble loading">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about health..."
            className="message-input"
            rows="1"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="send-button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 2L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <p className="disclaimer">
          ⚠️ This is an AI assistant for information only. Always consult a
          healthcare professional.
        </p>
      </div>
    </div>
  );
}
