const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const extractPPTText = require("./pptParser");
const generateNarration = require("./generateNarration");
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
connectDB();
const authRouter = require('./routes/auth');
const imageRoutes = require("./routes/image.routes");




const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // for form POSTs

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

    // Extract images using Python script and wait for completion
    const { exec } = require("child_process");
    const pptxPath = req.file.path;
    const outputDir = path.join(__dirname, "public", "images");
    await new Promise((resolve) => {
      exec(`python ppt-image-extractor/extract_images.py ${pptxPath} ${outputDir}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error("[IMG EXTRACTION ERROR]", err.message);
          }
          if (stdout) {
            console.log("[IMG EXTRACTION STDOUT]", stdout);
          }
          if (stderr) {
            console.error("[IMG EXTRACTION STDERR]", stderr);
          }
          resolve();
        }
      );
    });

    // Build image URLs for each slide
    const slidesWithImages = slides.map(slide => ({
      ...slide,
      imageUrl: `http://localhost:5000/images/slide${slide.slide}_img3.png`
    }));
    res.json({ success: true, slides: slidesWithImages });
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

app.use('/api/auth', authRouter);
console.log('✅ [ROUTES] /api/auth routes loaded');

app.use("/api/images", imageRoutes);
// Serve static images with no cache and log requests
app.use("/images", (req, res, next) => {
  const imgPath = path.join(__dirname, "public", "images", req.path);
  console.log(`[STATIC IMG] Request for: ${imgPath}`);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  next();
});
app.use("/images", express.static(path.join(__dirname, 'public', 'images')));

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
