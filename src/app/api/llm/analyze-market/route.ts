import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ai, MarketAnalysisSchema } from '@/lib/llm';

const AnalyzeMarketRequestSchema = z.object({
  competitorData: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { competitorData } = AnalyzeMarketRequestSchema.parse(body);

    const prompt = `You are a Senior Market Analyst specializing in Medical SaaS and B2B Healthcare.
Analyze the following competitor data (ads, pricing, keywords).
Identify their weaknesses, gaps in their messaging, and recommend unique marketing angles for OmniCare to exploit.

Competitor Data:
${competitorData}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: MarketAnalysisSchema,
        temperature: 0.4,
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
