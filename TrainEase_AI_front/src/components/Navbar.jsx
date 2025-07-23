// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">TrainEase AI</h2>
      <ul>
  <li><Link to="/home">Home</Link></li>
  <li><Link to="/home/upload">Upload</Link></li>
  <li><Link to="/home/dashboard">Dashboard</Link></li>
  
</ul>
    </nav>
  );
}
