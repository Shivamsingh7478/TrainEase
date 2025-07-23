import "./Home.css";
import homeImage from "../assets/Screenshot 2025-07-11 001936.png"; // Make sure to move the image into src/assets
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <div className="home-content">
        <div className="text-section">
          <h1>Welcome to TrainEase AI</h1>
          <p>Convert your PPTs into avatar-based video presentations that engage and educate.</p>
          <a href="/upload" className="home-btn">Get Started</a>
          <div style={{ marginTop: 20, display: 'flex', gap: '10px' }}>
            <Link to="/signup" className="home-btn">Signup</Link>
            <Link to="/login" className="home-btn">Login</Link>
          </div>
          <p className="trainee-note">
            Are you a trainee?{" "}
            <a href="/trainee" className="trainee-link">Click here to enter your code.</a>
          </p>
        </div>
        
      </div>
      <div className="image-section">
          <img src={homeImage} alt="Convert PPT to HD Video" />
        </div>
    </div>
  );
}
