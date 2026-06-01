import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ai, ScriptGenerationSchema } from '@/lib/llm';

const GenerateScriptsRequestSchema = z.object({
  serviceType: z.string().min(1),
  targetAudience: z.string().min(1),
  specialOffer: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceType, targetAudience, specialOffer } = GenerateScriptsRequestSchema.parse(body);

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

Output strictly matching the required JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: ScriptGenerationSchema,
        temperature: 0.7,
      }
    });

    if (!response.text) {
      throw new Error('No response from Gemini API');
    }

    const result = JSON.parse(response.text);

    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
