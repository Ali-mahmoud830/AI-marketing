import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ai } from '@/lib/llm';
import { Type, Schema } from '@google/genai';

const GenerationRequestSchema = z.object({
  serviceType: z.string().min(1),
  targetAudience: z.string().min(1),
  specialOffer: z.string().min(1),
});

const GenerationOutputSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: "Short, punchy headline for the ad."
    },
    primary_text: {
      type: Type.STRING,
      description: "Main ad copy text, highly compliant and professional."
    },
    image_prompt: {
      type: Type.STRING,
      description: "Midjourney prompt to generate the ad visual."
    }
  },
  required: ["headline", "primary_text", "image_prompt"]
};

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const body = await request.json();
    const { serviceType, targetAudience, specialOffer } = GenerationRequestSchema.parse(body);

    const prompt = `You are an Elite Medical Copywriter and AI Prompter.
Generate marketing assets for the following OmniCare service:
- Service: ${serviceType}
- Target Audience: ${targetAudience}
- Special Offer: ${specialOffer}

STRICT COMPLIANCE RULES (Meta Medical Policies):
- Do NOT make "before/after" promises.
- Do NOT guarantee any cures or specific medical outcomes.
- Maintain a highly professional, trust-building tone.

MIDJOURNEY PROMPT RULES:
- Create a highly engineered prompt for a photorealistic medical scene representing the service.
- You MUST append exactly: --ar 9:16 --v 6.0
- Include explicit negative constraints to prevent distortion (e.g., "no distorted hands, no fake medical equipment, no unprofessional attire, anatomical correctness").

You must return ONLY valid JSON matching the required schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: GenerationOutputSchema,
        temperature: 0.7,
      }
    });

    if (!response.text) {
      throw new Error('Gemini API returned an empty response.');
    }

    let result;
    try {
      result = JSON.parse(response.text);
    } catch (parseError) {
      throw new Error('Failed to parse Gemini API response into valid JSON.');
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });

  } catch (error: any) {
    console.error("API /api/marketing/generation Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid payload structure', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
