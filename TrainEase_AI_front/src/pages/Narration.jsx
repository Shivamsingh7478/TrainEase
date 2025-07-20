import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Narration.css";
import NarrationPlayer from "../components/NarrationPlayer"; // ✅ import TTS player

export default function Narration() {
  const { state } = useLocation();
  const slides = state?.slides || [];
  const [narrations, setNarrations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slides.length === 0) return;

    const fetchNarrations = async () => {
      setLoading(true);
      try {
        console.log("Sending slides to backend:", slides);
        const res = await axios.post("http://localhost:5000/generate-narration", {
          slides,
        });
        console.log("Received response:", res.data);
        const narrationOnly = res.data.narrations.map(n => n.narration);
        setNarrations(narrationOnly);
      } catch (err) {
        console.error("Narration generation failed:", err);
        alert("Narration generation failed");
      } finally {
        setLoading(false);
      }
    };

    fetchNarrations();
  }, [slides]);

  return (
    <div className="narration-page">
      <h2>AI-Generated Narration</h2>
      {loading && <p>⏳ Loading narration...</p>}
      
      {!loading && narrations.length > 0 && (
        <div className="narration-results">
          {narrations.map((text, idx) => (
            <div key={idx} className="narration-block">
              <h4>Slide {idx + 1}</h4>
              <textarea
                rows="4"
                value={text}
                onChange={(e) => {
                  const updated = [...narrations];
                  updated[idx] = e.target.value;
                  setNarrations(updated);
                }}
              />
              <NarrationPlayer text={text} /> {/* ✅ Play button for this narration */}
            </div>
          ))}
        </div>
      )}

      {!loading && narrations.length > 0 && (
        <div className="next-btn">
          <button onClick={() => alert("Proceeding to video generation...")}>
            🎥 Proceed to Video Generation
          </button>
        </div>
      )}
    </div>
  );
}
