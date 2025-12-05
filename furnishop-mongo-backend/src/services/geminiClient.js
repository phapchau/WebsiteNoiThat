// src/services/geminiClient.js
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

let ai = null;
if (!API_KEY) {
  console.warn('GEMINI_API_KEY not set. Gemini features disabled.');
} else {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

module.exports = ai;
