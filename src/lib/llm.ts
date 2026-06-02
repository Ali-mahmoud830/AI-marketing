import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize the Gemini client
// We will rely on process.env.GEMINI_API_KEY being set natively by the platform, 
// but in a production SaaS, this might be fetched from the global_settings DB table.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Reusable schema for Market Sentiment Analysis (Competitor Spy)
export const MarketAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    seo_keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of top-performing Arabic SEO keywords extracted from the competitor."
    },
    strategic_weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of strategic weaknesses in the competitor's copy."
    },
    hybrid_superior_script: {
      type: Type.STRING,
      description: "A highly persuasive Arabic ad script that exploits their weaknesses."
    }
  },
  required: ["seo_keywords", "strategic_weaknesses", "hybrid_superior_script"]
};

// Reusable schema for Script Generation
export const ScriptGenerationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: "Short, punchy Arabic headline for the ad."
    },
    primary_text: {
      type: Type.STRING,
      description: "Main Arabic ad copy text, highly compliant and persuasive."
    },
    image_prompt: {
      type: Type.STRING,
      description: "English ONLY Midjourney prompt to generate the ad visual."
    }
  },
  required: ["headline", "primary_text", "image_prompt"]
};

export { ai };
