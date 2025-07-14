import React from "react";
import Navigation from "./Navigation";

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-content">
        <h1 className="font-bold">About GenDo</h1>
        <p className="about-description">
          GenDo is a modern task management application designed to help
          individuals and teams stay organized and boost their productivity. Our
          mission is to provide a simple yet powerful tool that makes task
          management effortless and enjoyable.
        </p>

        <div className="about-sections">
          <div className="about-section">
            <h2 className="font-medium">Our Mission</h2>
            <p>
              We believe that staying organized shouldn&apos;t be complicated.
              That&apos;s why we&apos;ve created GenDo - a task management
              solution that combines simplicity with powerful features to help
              you achieve more.
            </p>
          </div>

          <div className="about-section">
            <h2 className="font-medium">What Sets Us Apart</h2>
            <p>
              Unlike traditional to-do apps, GenDo focuses on providing a
              seamless experience with real-time updates, intuitive interface,
              and robust security. We&apos;re committed to continuous
              improvement and user satisfaction.
            </p>
          </div>

          <div className="about-section">
            <h2 className="font-medium">Our Values</h2>
            <ul className="values-list">
              <li>Simplicity in design and functionality</li>
              <li>Security and privacy of user data</li>
              <li>Continuous innovation and improvement</li>
              <li>User-centered development approach</li>
              <li>Reliable and responsive support</li>
            </ul>
          </div>

          <div className="about-section">
            <h2 className="font-medium">Technologies Used</h2>
            <ul className="values-list">
              <li>Next.js</li>
              <li>TypeScript</li>
              <li>MongoDB</li>
              <li>Tailwind CSS</li>
              <li>Node.js</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
