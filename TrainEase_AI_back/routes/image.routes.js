const express = require("express");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/extract-images", upload.single("pptFile"), (req, res) => {
  const pptxPath = path.join("uploads", req.file.filename);
  const outputDir = path.join("public", "images");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  exec(
    `python ppt-image-extractor/extract_images.py ${pptxPath} ${outputDir}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error("Error:", err.message);
        return res.status(500).send("Failed to extract images.");
      }
      console.log("✅ Image Extraction Success:\n", stdout);
      res.json({ message: "Images extracted successfully" });
    }
  );
});

module.exports = router;
