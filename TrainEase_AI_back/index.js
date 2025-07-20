const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const extractPPTText = require("./pptParser");
const generateNarration = require("./generateNarration");


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// File storage setup
const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
app.post("/upload-ppt", upload.single("pptFile"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("⚠️ No file uploaded");
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log("📄 File received:", req.file.path);

    const slides = await extractPPTText(req.file.path);
    console.log("✅ Slides extracted:", slides.length);

    res.json({ success: true, slides });
  } catch (err) {
    console.error("❌ Error during extraction:", err.message);
    res.status(500).json({ success: false, message: "Failed to extract PPT text" });
  }
});


app.post("/generate-narration", async (req, res) => {
  const { slides } = req.body;

  if (!slides || !Array.isArray(slides)) {
    return res.status(400).json({ success: false, error: "Slides array missing or invalid" });
  }


  console.log("🔁 Received slides:", slides.length);
  console.log("🔁 First slide text:", slides[0]?.text);


  try {
    const narrations = [];

    for (const slide of slides) {
      // ✅ Step 3: Log slide being processed
      console.log(`🧠 Generating narration for slide ${slide.slide}`);

      try {
        const narration = await generateNarration(slide.text);
        narrations.push({
          slide: slide.slide,
          text: slide.text,
          narration,
        });
      } catch (err) {
        // ✅ Step 4: Catch per-slide errors
        console.error("❌ Failed slide narration:", err.message);
      }
    }

    res.json({ success: true, narrations });
  } catch (err) {
    console.error("❌ Server narration error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});



// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
