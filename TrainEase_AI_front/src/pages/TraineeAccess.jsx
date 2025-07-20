// src/pages/TraineeAccess.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TraineeAccess.css";

const mockCodeMap = {
  TR12345: "vid001",
  TR67890: "vid002",
};

export default function TraineeAccess() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoId = mockCodeMap[code.trim().toUpperCase()];
    if (videoId) {
      navigate(`/presentation/${videoId}`);
    } else {
      setError("Invalid trainee code. Please try again.");
    }
  };

  return (
    <div className="trainee-access">
      <h2>Enter Your Trainee Code</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. TR12345"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">View Training</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
