// generateNarration.js
require("dotenv").config();
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

async function generateNarration(text) {
  try {
    const response = await cohere.generate({
      model: "command",
      prompt: `Convert the following slide text into a friendly, spoken narration. Keep it conversational, informative, and suitable for a training video.\n\nSlide Text:\n${text}`,
      maxTokens: 250,
      temperature: 0.7,
    });

    return response.generations[0].text.trim();
  } catch (error) {
    console.error("❌ Cohere API error:", error.message);
    throw new Error("Narration generation failed");
  }
}

module.exports = generateNarration;
