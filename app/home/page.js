"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "../globals.css";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [stats, setStats] = useState({
    totalQueries: 0,
    avgResponseTime: "< 2s",
    userSatisfaction: "98%",
    uptime: "99.9%",
  });

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

    fetchUserData();
  }, []);

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
    <div className="home-page">
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
          <nav className="nav-links">
            <Link href="/home" className="nav-link active">
              Home
            </Link>
            <Link href="/" className="nav-link">
              Chat
            </Link>
          </nav>
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Powered by Advanced AI Technology</span>
          </div>
          <h1 className="hero-title">
            Your Trusted <span className="gradient-text">AI Medical</span>{" "}
            Information Assistant
          </h1>
          <p className="hero-description">
            Get reliable, evidence-based health information instantly. Joshua
            Smith AI combines cutting-edge artificial intelligence with medical
            knowledge to provide you with accurate answers to your health
            questions.
          </p>
          <div className="hero-actions">
            <Link href="/" className="cta-button primary">
              <span>Start Chatting</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <button
              className="cta-button secondary"
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>Learn More</span>
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-icon">🩺</div>
            <div className="card-content">
              <h4>Medical Expertise</h4>
              <p>Evidence-based insights</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">⚡</div>
            <div className="card-content">
              <h4>Instant Response</h4>
              <p>Real-time answers</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🔒</div>
            <div className="card-content">
              <h4>100% Secure</h4>
              <p>Privacy guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.totalQueries}+</div>
            <div className="stat-label">Questions Answered</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">{stats.avgResponseTime}</div>
            <div className="stat-label">Avg Response Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats.userSatisfaction}</div>
            <div className="stat-label">User Satisfaction</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-value">{stats.uptime}</div>
            <div className="stat-label">System Uptime</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title">Why Choose Joshua Smith AI?</h2>
          <p className="section-description">
            Experience the future of medical information assistance with our
            advanced AI technology
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card-large">
            <div className="feature-icon-large">🧠</div>
            <h3>Advanced AI Intelligence</h3>
            <p>
              Powered by state-of-the-art language models trained on vast
              medical literature and research papers.
            </p>
            <ul className="feature-list">
              <li>✓ Evidence-based responses</li>
              <li>✓ Constantly updated knowledge</li>
              <li>✓ Context-aware conversations</li>
            </ul>
          </div>
          <div className="feature-card-large">
            <div className="feature-icon-large">🔒</div>
            <h3>Privacy & Security First</h3>
            <p>
              Your health information is sensitive. We employ enterprise-grade
              security to protect your data.
            </p>
            <ul className="feature-list">
              <li>✓ End-to-end encryption</li>
              <li>✓ HIPAA-compliant storage</li>
              <li>✓ No data sharing with third parties</li>
            </ul>
          </div>
          <div className="feature-card-large">
            <div className="feature-icon-large">⚡</div>
            <h3>Lightning Fast Responses</h3>
            <p>
              Get instant answers to your health questions without waiting for
              appointments or phone calls.
            </p>
            <ul className="feature-list">
              <li>✓ Sub-second response times</li>
              <li>✓ 24/7 availability</li>
              <li>✓ No waiting queues</li>
            </ul>
          </div>
          <div className="feature-card-large">
            <div className="feature-icon-large">📚</div>
            <h3>Comprehensive Knowledge</h3>
            <p>
              Access a vast database of medical information covering symptoms,
              conditions, and treatments.
            </p>
            <ul className="feature-list">
              <li>✓ Thousands of medical topics</li>
              <li>✓ Regular knowledge updates</li>
              <li>✓ Plain language explanations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Important Information Section */}
      <section className="info-section">
        <div className="info-container">
          <div className="info-card important">
            <div className="info-header">
              <div className="info-icon">⚠️</div>
              <h3>Important Medical Disclaimer</h3>
            </div>
            <div className="info-content">
              <p>
                <strong>
                  Joshua Smith AI is an information assistant only.
                </strong>{" "}
                This service is designed to provide general health information
                and should NOT be used as a substitute for professional medical
                advice, diagnosis, or treatment.
              </p>
              <ul>
                <li>
                  Always consult with a qualified healthcare provider for
                  medical concerns
                </li>
                <li>
                  In case of emergency, call your local emergency services
                  immediately
                </li>
                <li>
                  Do not delay seeking medical care based on information from
                  this AI
                </li>
                <li>
                  This AI cannot prescribe medications or provide specific
                  treatment plans
                </li>
              </ul>
            </div>
          </div>

          <div className="info-card guidelines">
            <div className="info-header">
              <div className="info-icon">📋</div>
              <h3>How to Get the Best Results</h3>
            </div>
            <div className="info-content">
              <ul>
                <li>
                  <strong>Be specific:</strong> Provide detailed information
                  about your question
                </li>
                <li>
                  <strong>Ask follow-ups:</strong> Feel free to ask for
                  clarification or more details
                </li>
                <li>
                  <strong>Context matters:</strong> Include relevant background
                  information
                </li>
                <li>
                  <strong>One topic at a time:</strong> Focus on one health
                  topic per conversation
                </li>
              </ul>
            </div>
          </div>

          <div className="info-card privacy">
            <div className="info-header">
              <div className="info-icon">🔐</div>
              <h3>Your Privacy Matters</h3>
            </div>
            <div className="info-content">
              <p>
                We take your privacy seriously. Here's how we protect your
                information:
              </p>
              <ul>
                <li>All conversations are encrypted in transit and at rest</li>
                <li>We never share your personal health information</li>
                <li>You can delete your chat history at any time</li>
                <li>
                  No personally identifiable information is required to use the
                  service
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of users who trust Joshua Smith AI for reliable
            health information
          </p>
          <Link href="/" className="cta-button primary large">
            <span>Start Your First Conversation</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
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
              <div>
                <h3>Joshua Smith AI</h3>
                <p>Medical Information Assistant</p>
              </div>
            </div>
            <p className="footer-description">
              Providing reliable, AI-powered health information to help you make
              informed decisions about your wellbeing.
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link href="/home">Home</Link>
              </li>
              <li>
                <Link href="/">Chat Assistant</Link>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#help">Help Center</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
              <li>
                <a href="#terms">Terms of Service</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Disclaimer</h4>
            <p className="footer-disclaimer">
              This AI assistant provides general health information only. Always
              consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Joshua Smith AI. All rights reserved.</p>
          <p>Made with ❤️ for better health information access</p>
        </div>
      </footer>
    </div>
  );
}
