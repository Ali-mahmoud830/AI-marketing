import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ai } from '@/lib/llm';
import { Type, Schema } from '@google/genai';

const GenerationRequestSchema = z.object({
  brandName: z.string().min(1),
  industry: z.string().min(1),
  serviceType: z.string().min(1),
  targetAudience: z.string().min(1),
  specialOffer: z.string().min(1),
});

const GenerationOutputSchema: Schema = {
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

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const body = await request.json();
    const { brandName, industry, serviceType, targetAudience, specialOffer } = GenerationRequestSchema.parse(body);

    const prompt = `You are a world-class, elite direct-response copywriter and marketing strategist. 
Brand: ${brandName} 
Industry: ${industry}

Task: Write highly persuasive, conversion-optimized ad copy for the following service: ${serviceType}, targeting: ${targetAudience}, with this offer: ${specialOffer}. 

STRICT COPYWRITING RULES (Arabic):
1. The ad copy (headline and primary_text) MUST be written in highly fluent, persuasive, and culturally resonant Arabic. It must sound like it was written by an elite Arab marketing director. DO NOT SOUND LIKE A MACHINE TRANSLATION.
2. The copy MUST use powerful psychological hooks, address deep pain points, and have a compelling Call-to-Action (CTA).
3. If the industry is medical, maintain strict compliance (no guarantees, no before/afters). Otherwise, adapt perfectly to the ${industry}.

STRICT MIDJOURNEY PROMPT RULES (English ONLY):
1. The Midjourney prompt MUST ALWAYS be in English.
2. Make it highly cinematic, professional, and perfectly aligned with the ${industry} and ${serviceType}.
3. Absolutely NO medical imagery unless the industry is specifically medical/healthcare.
4. Use parameters exactly: --ar 16:9 --v 6.0 --style raw
5. Include explicit negative constraints to prevent distortion (e.g., "no distorted hands, anatomical correctness, professional").

You must return ONLY valid JSON matching the required schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: GenerationOutputSchema,
        temperature: 0.8,
      }
    });

    if (!response.text) throw new Error('Gemini API returned an empty response.');

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
