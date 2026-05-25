import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

const CrmUpdateSchema = z.object({
  leadId: z.string().uuid(),
  newStage: z.enum(['New_Lead', 'Bot_Chatting', 'Interview_Scheduled', 'Closed_Won'])
});

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CrmUpdateSchema.parse(body);

    const updateQuery = `
      UPDATE crm_leads
      SET conversion_stage = $1
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
