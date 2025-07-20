const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const xml2js = require("xml2js");

async function extractPPTText(filePath) {
  const fullPath = path.resolve(filePath);
  const slides = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(fullPath)
      .pipe(unzipper.Parse())
      .on("entry", async (entry) => {
        const fileName = entry.path;

        // Only parse slide XML files
        if (/ppt\/slides\/slide\d+\.xml/.test(fileName)) {
          let xml = "";
          entry.on("data", (chunk) => (xml += chunk));
          entry.on("end", async () => {
            try {
              const result = await xml2js.parseStringPromise(xml);
              const textElements =
                result["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:sp"] || [];

              let slideText = "";
              for (const element of textElements) {
                const paragraphs =
                  element["p:txBody"]?.[0]["a:p"] || [];

                for (const para of paragraphs) {
                  const texts = para["a:r"]?.map((r) => r["a:t"]?.[0]) || [];
                  slideText += texts.join(" ") + " ";
                }
              }

              slides.push({
                slide: slides.length + 1,
                text: slideText.trim() || "(No text found)",
              });
            } catch (e) {
              console.error("❌ Slide parsing error:", e.message);
            }
          });
        } else {
          entry.autodrain();
        }
      })
      .on("close", () => {
        if (slides.length === 0) {
          reject(new Error("No text slides found in presentation."));
        } else {
          resolve(slides);
        }
      })
      .on("error", (err) => {
        reject(new Error("Failed to unzip .pptx file: " + err.message));
      });
  });
}

module.exports = extractPPTText;
