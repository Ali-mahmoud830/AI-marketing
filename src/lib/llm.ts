import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize the Gemini client
// We will rely on process.env.GEMINI_API_KEY being set natively by the platform, 
// but in a production SaaS, this might be fetched from the global_settings DB table.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Reusable schema for Market Sentiment Analysis
export const MarketAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    competitor_weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of extracted competitor weaknesses."
    },
    recommended_angles: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of recommended ad angles."
    }
  },
  required: ["competitor_weaknesses", "recommended_angles"]
};

// Reusable schema for Script Generation
export const ScriptGenerationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    short_hook: {
      type: Type.STRING,
      description: "Short hook for Reels (max 15 seconds reading time)."
    },
    long_copy: {
      type: Type.STRING,
      description: "Trust-building Facebook post text."
    },
    sales_whatsapp_reply: {
      type: Type.STRING,
      description: "Professional template for the CRM team."
    },
    midjourney_prompt: {
      type: Type.STRING,
      description: "Highly engineered Midjourney prompt."
    }
  },
  required: ["short_hook", "long_copy", "sales_whatsapp_reply", "midjourney_prompt"]
};

export { ai };
