import React from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Navigation />

      <section className="hero-section">
        <h1>
          Welcome to <span className="hero-title">GenDo</span>
        </h1>
        <p>
          Your personal task management solution for increased productivity and
          organized life
        </p>
        <div className="cta-buttons">
          <Link href="/login" className="cta-primary">
            Get Started
          </Link>
          <Link href="/about" className="cta-secondary">
            Learn More
          </Link>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Why Choose GenDo?</h2>
        <p className="section-subtitle">
          Discover how GenDo can help you stay organized and boost your
          productivity
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Simple Task Management</h3>
            <p>
              Create, organize, and track your tasks with an intuitive interface
              designed for efficiency
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>
              Your data is protected with industry-standard security measures
              and user authentication
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Updates</h3>
            <p>
              Stay synchronized with instant updates and seamless task
              management across devices
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>
              Access your tasks anywhere, anytime with our responsive design
              that works on all devices
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Goal Tracking</h3>
            <p>
              Set and achieve your goals with progress tracking and completion
              statistics
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Collaboration Ready</h3>
            <p>
              Share tasks and collaborate with team members for enhanced
              productivity
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
