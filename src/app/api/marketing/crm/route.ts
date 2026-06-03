import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

const CrmUpdateSchema = z.object({
  leadId: z.string().uuid(),
  newStage: z.string()
});

const CrmInsertSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  source: z.string().optional(),
  service: z.string().optional()
});

export async function GET() {
  try {
    const fetchQuery = `SELECT * FROM leads ORDER BY created_at DESC;`;
    const result = await query(fetchQuery, []);
    return NextResponse.json({ success: true, data: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error("DB connection error in GET /api/marketing/crm", error);
    return NextResponse.json({ success: false, error: 'Database connection failed', data: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CrmInsertSchema.parse(body);

    const insertQuery = `
      INSERT INTO leads (name, phone, source, service, status)
      VALUES ($1, $2, $3, $4, 'New_Lead')
      RETURNING *;
    `;
    const result = await query(insertQuery, [
      validatedData.name,
      validatedData.phone,
      validatedData.source || 'Organic',
      validatedData.service || 'General'
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
    const validatedData = CrmUpdateSchema.parse(body);

    const updateQuery = `
      UPDATE leads
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;

    const result = await query(updateQuery, [
      validatedData.newStage,
      validatedData.leadId
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
