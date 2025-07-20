// src/pages/VideoView.jsx
import { useParams } from "react-router-dom";
import "./VideoView.css";

export default function VideoView() {
  const { id } = useParams(); // get video ID from URL

  // 🔁 Replace with actual fetch in backend
  const mockVideo = {
    id,
    title: "AI Basics Training",
    created: "2025-07-10",
    avatar: "Avatar 1",
    voice: "Male Voice",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // dummy video
  };

  return (
    <div className="video-page">
      <h2>{mockVideo.title}</h2>
      <video controls className="video-player">
        <source src={mockVideo.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="video-meta">
        <p>📅 {mockVideo.created}</p>
        <p>🧑‍💼 Avatar: {mockVideo.avatar}</p>
        <p>🎤 Voice: {mockVideo.voice}</p>
      </div>

      <div className="feedback-section">
        <h4>Feedback</h4>
        <textarea placeholder="Write your thoughts or questions here..."></textarea>
        <button disabled>Submit Feedback</button> {/* placeholder only */}
      </div>
    </div>
  );
}
