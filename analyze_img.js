import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

async function analyzeImage() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Fetch the image
    const response = await fetch('https://i.imgur.com/X7qnOCn.png');
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/png'
          }
        },
        'Extract all the text and the hierarchical structure from this organizational chart. Provide a detailed text representation of the hierarchy, including names and titles.'
      ]
    });

    console.log(result.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

analyzeImage();
