import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

const GenerationRequestSchema = z.object({
  adSetId: z.string().uuid(),
  headlinePrompt: z.string(),
  primaryTextPrompt: z.string(),
  imageStylePrompt: z.string(),
  voiceoverScript: z.string().optional(),
});

// Advertising health policy compliance filters
const COMPLIANCE_VIOLATION_REGEX = [
  /guarantee.*results/i,
  /cure.*disease/i,
  /get rich quick/i,
  /lose weight fast/i,
  /crypto.*investment/i
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = GenerationRequestSchema.parse(body);

    // 1. Compliance Check
    const fullText = `${validatedData.headlinePrompt} ${validatedData.primaryTextPrompt} ${validatedData.voiceoverScript || ''}`;
    let complianceStatus = 'approved';
    
    for (const regex of COMPLIANCE_VIOLATION_REGEX) {
      if (regex.test(fullText)) {
        complianceStatus = 'flagged';
        break;
      }
    }

    if (complianceStatus === 'flagged') {
      return NextResponse.json({ 
        success: false, 
        error: 'Content flagged for policy violations.' 
      }, { status: 403 });
    }

    // MOCK: Generate text variations (OpenAI)
    // const gptResponse = await openai.createCompletion({...})
    const generatedHeadline = "Discover Premium Care Today";
    const generatedPrimaryText = "We provide the best services for your needs.";

    // MOCK: Generate image (Midjourney/Flux)
    // const mjResponse = await fetch('https://api.midjourney.com/...', {...})
    const generatedImageUrl = "https://mock-image-cdn.com/creative-1.png";

    // MOCK: Generate voiceover (ElevenLabs)
    // const elResponse = await fetch('https://api.elevenlabs.io/...', {...})
    const generatedVoiceoverUrl = validatedData.voiceoverScript ? "https://mock-audio-cdn.com/voice-1.mp3" : null;

    // Save to database
    const insertQuery = `
      INSERT INTO ad_creatives 
      (ad_set_id, headline, primary_text, image_url, voiceover_url, compliance_status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await query(insertQuery, [
      validatedData.adSetId,
      generatedHeadline,
      generatedPrimaryText,
      generatedImageUrl,
      generatedVoiceoverUrl,
      complianceStatus
    ]);

    return NextResponse.json({ success: true, data: result.rows[0] });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
