import React from 'react';
import Navigation from './Navigation';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <Navigation />
      
      <div className="about-content">
        <h1>About Gendo</h1>
        <p className="about-description">
          Gendo is a modern task management application designed to help individuals and teams 
          stay organized and boost their productivity. Our mission is to provide a simple yet 
          powerful tool that makes task management effortless and enjoyable.
        </p>

        <div className="about-sections">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              We believe that staying organized shouldn't be complicated. That's why we've created 
              Gendo - a task management solution that combines simplicity with powerful features 
              to help you achieve more.
            </p>
          </div>

          <div className="about-section">
            <h2>What Sets Us Apart</h2>
            <p>
              Unlike traditional to-do apps, Gendo focuses on providing a seamless experience 
              with real-time updates, intuitive interface, and robust security. We're committed 
              to continuous improvement and user satisfaction.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Values</h2>
            <ul className="values-list">
              <li>Simplicity in design and functionality</li>
              <li>Security and privacy of user data</li>
              <li>Continuous innovation and improvement</li>
              <li>User-centered development approach</li>
              <li>Reliable and responsive support</li>
            </ul>
          </div>
        </div>

        <div className="team-section">
          <h2>Meet the Team</h2>
          <p>
            Gendo is developed by a passionate team of developers, designers, and productivity 
            enthusiasts who are committed to creating the best task management experience for our users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About; 