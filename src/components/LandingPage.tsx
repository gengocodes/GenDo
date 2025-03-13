import React from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <h1>Welcome to GenDo</h1>
        <p>Your ultimate to-do list manager</p>
      </header>
      <section className="features">
        <div className="feature">
          <h2>Simple</h2>
          <p>Easy to use interface to manage your tasks</p>
        </div>
        <div className="feature">
          <h2>Organized</h2>
          <p>Keep your tasks organized by categories</p>
        </div>
        <div className="feature">
          <h2>Accessible</h2>
          <p>Access your to-do list from anywhere</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 