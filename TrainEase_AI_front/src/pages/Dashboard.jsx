// src/pages/Dashboard.jsx
import "./Dashboard.css";

const mockVideos = [
  {
    id: "vid001",
    title: "AI Basics Training",
    created: "2025-07-10",
    avatar: "Avatar 1",
    voice: "Male Voice",
    views: 128,
    thumbnail: "https://via.placeholder.com/300x160?text=AI+Basics",
  },
  {
    id: "vid002",
    title: "Sales Onboarding",
    created: "2025-07-09",
    avatar: "Avatar 2",
    voice: "Female Voice",
    views: 89,
    thumbnail: "https://via.placeholder.com/300x160?text=Sales+Training",
  },
];

export default function Dashboard() {
  return (
    <div className="dashboard">
        <h2>Your training Videos</h2>
        <div className="video-grid">
           {mockVideos.map((video) => (
            <div className="video-card" key={video.id}>
                <div className="video-details" >
                  <h3>{video.title}</h3>
                  <p>{video.avatar} | {video.voice}</p>
                  <p>{video.views}  views</p>
                </div>
                <div className="actions">
                <a href={`/presentation/${video.id}`} className="view-btn">View</a>
                <button className="share-btn">Share</button>
                <button className="delete-btn">Delete</button>
              </div>

            </div>

           )
        )}
        </div>
    
    </div>
    
  );
}
