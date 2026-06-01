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
    let isFlagged = false;
    
    for (const regex of COMPLIANCE_VIOLATION_REGEX) {
      if (regex.test(fullText)) {
        isFlagged = true;
        break;
      }
    }

    if (isFlagged) {
      return NextResponse.json({ 
        success: false, 
        error: 'Content flagged for policy violations.' 
      }, { status: 403 });
    }

    // MOCK: Generate text variations (OpenAI)
    const generatedHeadline = "Discover Premium Care Today";
    const generatedPrimaryText = "We provide the best services for your needs.";

    // MOCK: Generate image (Midjourney/Flux)
    const generatedImageUrl = "https://mock-image-cdn.com/creative-1.png";

    // MOCK: Generate voiceover (ElevenLabs)
    const generatedVoiceoverUrl = validatedData.voiceoverScript ? "https://mock-audio-cdn.com/voice-1.mp3" : null;

    // Save to database with 'pending_approval' status for Human-in-the-loop review
    const insertQuery = `
      INSERT INTO ad_creatives 
      (ad_set_id, headline, primary_text, image_url, voiceover_url, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await query(insertQuery, [
      validatedData.adSetId,
      generatedHeadline,
      generatedPrimaryText,
      generatedImageUrl,
      generatedVoiceoverUrl,
      'pending_approval'
    ]);

    return NextResponse.json({ success: true, data: result.rows[0] });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
