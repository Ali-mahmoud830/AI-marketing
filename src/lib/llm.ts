import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize the Gemini client
// We will rely on process.env.GEMINI_API_KEY being set natively by the platform, 
// but in a production SaaS, this might be fetched from the global_settings DB table.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Reusable schema for Market Sentiment Analysis (Competitor Spy)
export const MarketAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    top_competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          estimated_price_points: { type: Type.STRING },
          current_ads_summary: { type: Type.STRING }
        },
        required: ["name", "estimated_price_points", "current_ads_summary"]
      },
      description: "List of the top 3 successful competitors in this niche."
    },
    common_winning_keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of common winning SEO and Ad keywords."
    },
    strategic_weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of strategic weaknesses in the competitors' marketing."
    },
    recommended_ad_angles: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of recommended ad angles to beat them."
    }
  },
  required: ["top_competitors", "common_winning_keywords", "strategic_weaknesses", "recommended_ad_angles"]
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
