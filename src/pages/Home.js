import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/moneylogo.jpg";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="homeContainer">
      {/* Navbar */}
      <nav className="nav">
        <div className="logo">💰 FinTrack</div>
        <div className="navLinks">
          <a href="#hero" className="link">Home</a>
          <a href="#tips" className="link">Features</a>
          <a href="#about" className="link">About Us</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="heroLeft">
          <h1 className="heading">Master Your Finances with FinTrack</h1>
          <p className="info">
            Take control of your financial future with <strong>FinTrack.</strong>
           Track every transaction effortlessly,giving you clear insights into your financial habits. 
           <strong>Visualize your spending</strong>, identify areas to save,
            and make <strong>smarter financial decisions</strong> every day.
          </p>
          <button className="button" onClick={() => navigate("/explore")}>
            Get Started
          </button>
        </div>
        <div className="heroRight">
          <img src={heroImage} alt="Finance Tracker" className="heroImage" />
        </div>
      </section>

      {/* Tips Section */}
      <section id="tips" className="tips">
        <h1 className="sectionHeading">FinTrack Features</h1>
        <div className="tipCards">
          <div className="tipCard">
            <h3>Real-time Expense Tracking</h3>
            <p>Track your income and expenses instantly with easy-to-use inputs.</p>
          </div>
          <div className="tipCard">
            <h3>Visual Reports & Insights</h3>
            <p>Analyze your spending habits with interactive charts and summaries.</p>
          </div>
          <div className="tipCard">
            <h3>Smart Budgeting & Savings</h3>
            <p>Set budgets, get alerts, and discover opportunities to save more.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2 className="sectionHeading">About FinTrack</h2>
        <p>
    <b>FinTrack</b> is your personal finance companion designed to help you <b>track income and expenses</b> effortlessly. 
    Visualize your spending patterns with clear charts and summaries, <b>identify areas to save</b>, and make informed decisions 
    to achieve your financial goals. Our mission is to empower you to <b>spend wisely, save effectively, and plan confidently</b> for a secure financial future.
  </p>

      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 FinTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
