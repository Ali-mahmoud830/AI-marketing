import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ai, MarketAnalysisSchema } from '@/lib/llm';

const AnalyzeMarketRequestSchema = z.object({
  brandName: z.string().min(1),
  industry: z.string().min(1),
  competitorData: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const body = await request.json();
    const { brandName, industry, competitorData } = AnalyzeMarketRequestSchema.parse(body);

    const prompt = `You are an elite SEO expert, market analyst, and world-class direct-response copywriter.
Brand: ${brandName}
Industry: ${industry}

Analyze this competitor data (which may be raw ad text, links, or keywords). 
1. Extract top-performing SEO keywords relevant to the ${industry}.
2. Identify strategic weaknesses and gaps in their copy and messaging.
3. Write a 'Hybrid' superior ad script that exploits their weaknesses, uses better psychological triggers, and outperforms them.

STRICT RULES:
- The outputs (SEO keywords, strategic weaknesses, and the hybrid superior script) MUST be written in highly fluent, persuasive, and culturally resonant Arabic.
- Act as an elite Arab marketing director. The tone must be aggressive but professional, engineered to steal market share.

Competitor Data:
${competitorData}

Return ONLY valid JSON matching the required schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: MarketAnalysisSchema,
        temperature: 0.6,
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
    console.error("API /api/llm/analyze-market Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
