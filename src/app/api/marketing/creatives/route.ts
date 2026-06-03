import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

const CreativeInsertSchema = z.object({
  brandName: z.string().min(1),
  industry: z.string().min(1),
  adCopy: z.string().min(1),
  midjourneyPrompt: z.string().min(1)
});

const CreativeUpdateSchema = z.object({
  creativeId: z.string().uuid(),
  newStatus: z.enum(['approved', 'rejected'])
});

export async function GET() {
  try {
    const fetchQuery = `SELECT * FROM creatives WHERE status = 'pending' ORDER BY created_at DESC;`;
    const result = await query(fetchQuery, []);
    return NextResponse.json({ success: true, data: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error("DB connection error in GET /api/marketing/creatives", error);
    return NextResponse.json({ success: false, error: 'Database connection failed', data: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CreativeInsertSchema.parse(body);

    const insertQuery = `
      INSERT INTO creatives (brand_name, industry, ad_copy, midjourney_prompt, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *;
    `;
    const result = await query(insertQuery, [
      validatedData.brandName,
      validatedData.industry,
      validatedData.adCopy,
      validatedData.midjourneyPrompt
    ]);

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CreativeUpdateSchema.parse(body);

    const updateQuery = `
      UPDATE creatives
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;

    const result = await query(updateQuery, [
      validatedData.newStatus,
      validatedData.creativeId
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Creative not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
