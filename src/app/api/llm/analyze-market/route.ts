import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ai, MarketAnalysisSchema } from '@/lib/llm';

const AnalyzeMarketRequestSchema = z.object({
  brandName: z.string().min(1),
  industry: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const body = await request.json();
    const { brandName, industry } = AnalyzeMarketRequestSchema.parse(body);

    const prompt = `You are a senior market analyst and autonomous researcher.
Perform an internal knowledge search (and web search if grounded) for the top successful competitors in the ${industry} niche.
Identify their common marketing angles, estimated price points, and what current ads they are running.
Then provide Actionable Intelligence for ${brandName} to beat them.

STRICT RULES:
- The outputs (Top 3 Competitor Names, Common Winning Keywords, Competitor Weaknesses, Recommended Ad Angles) MUST be written in highly fluent, persuasive, and culturally resonant Arabic, acting as an elite Arab marketing director.
- The tone must be strategic and engineered to steal market share for ${brandName}.
- You must return ONLY raw, valid JSON. Do not include markdown code blocks like \`\`\`json or \`\`\`. Return just the parsable JSON object.`;

    // Optionally enable googleSearch grounding if needed, but the prompt itself will trigger internal knowledge synthesis
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseSchema: MarketAnalysisSchema,
        temperature: 0.5,
        tools: [{ googleSearch: {} }] // Enabling Google Search grounding for real-time competitor discovery
      }
    });

    if (!response.text) {
      throw new Error('Gemini API returned an empty response.');
    }

    let result;
    try {
      const rawText = response.text.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
      console.log("API Response:", rawText);
      result = JSON.parse(rawText);
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
