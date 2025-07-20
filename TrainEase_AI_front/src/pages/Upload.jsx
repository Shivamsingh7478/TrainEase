import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

export default function Upload() {
  const [fileName, setFileName] = useState(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // ← ADD THIS

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith(".pptx") || droppedFile.name.endsWith(".ppt"))) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      handleUpload(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith(".pptx") || selectedFile.name.endsWith(".ppt"))) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (pptFile) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("pptFile", pptFile);

    try {
      const res = await fetch("http://localhost:5000/upload-ppt", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSlides(data.slides); // [{slide: 1, text: "..."}]
      } else {
        alert("Failed to extract slides from PPT.");
      }
    } catch (err) {
      alert("Upload failed. Check your backend.");
    }
    setLoading(false);
  };

  const handleSlideChange = (index, newText) => {
    const updated = [...slides];
    updated[index].text = newText;
    setSlides(updated);
  };

  const handleGenerateNarration = () => {
    if (slides.length === 0) {
      alert("No slides to process");
      return;
    }
    console.log("Slides to send to AI:", slides);

    // 👇 Redirect to narration page and send slide data via router state
    navigate("/narration", {
      state: {
        slides,
      },
    });
  };

  return (
    <div className="upload-page">
      <h2>Upload Your Presentation</h2>
      <div className="upload-container">
        <div
          className="drop-box"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p>Drag & drop your PPT file here</p>
          <p>or</p>
          <label htmlFor="ppt" className="choose-btn">Choose File</label>
          <input
            type="file"
            id="ppt"
            accept=".ppt,.pptx"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          {fileName && <p className="file-name">📎 {fileName}</p>}
        </div>

        <div className="avatar-section">
          <label>Select Avatar</label>
          <select>
            <option>Avatar 1</option>
            <option>Avatar 2</option>
            <option>Avatar 3</option>
          </select>
        </div>

        <div className="voice-section">
          <label>Select Voice</label>
          <select>
            <option>Male Voice</option>
            <option>Female Voice</option>
          </select>
        </div>

        {loading && <p>Extracting text from your PPT...</p>}

        {slides.length > 0 && (
          <div className="slides-editor">
            <h3>Edit Slide Text Before Narration</h3>
            {slides.map((slide, index) => (
              <div key={index} className="slide-block">
                <h4>Slide {slide.slide}</h4>
                <textarea
                  value={slide.text}
                  onChange={(e) => handleSlideChange(index, e.target.value)}
                />
              </div>
            ))}
            <div className="generate-btn">
              <button onClick={handleGenerateNarration}>Generate Narration</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
