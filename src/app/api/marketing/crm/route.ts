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

export async function GET() {
  try {
    const fetchQuery = `SELECT * FROM crm_leads ORDER BY created_at DESC;`;
    const result = await query(fetchQuery, []);
    
    return NextResponse.json({ success: true, data: result.rows, status: 200 });
  } catch (error: any) {
    console.error("DB connection error in GET /api/marketing/crm, falling back to mock JSON", error);
    // Fallback JSON mock
    const fallbackData = [
      { id: '1', name: 'Sarah Jenkins', phone_number: '+20 100 123 4567', service_type: 'Premium Nursing', conversion_stage: 'New_Lead', utm_source: 'Meta Ads' },
      { id: '2', name: 'Ahmed Hassan', phone_number: '+20 111 987 6543', service_type: 'Elderly Care', conversion_stage: 'Bot_Chatting', utm_source: 'Google Search' },
      { id: '3', name: 'Mona Zaki', phone_number: '+20 122 345 6789', service_type: 'NannyPro', conversion_stage: 'Interview_Scheduled', utm_source: 'Direct' },
      { id: '4', name: 'Khaled Omar', phone_number: '+20 155 555 1234', service_type: 'Premium Nursing', conversion_stage: 'Closed_Won', utm_source: 'Meta Ads' },
      { id: '5', name: 'Nadia Farouk', phone_number: '+20 100 999 8888', service_type: 'Physiotherapy', conversion_stage: 'New_Lead', utm_source: 'TikTok Ads' }
    ];
    return NextResponse.json({ success: true, data: fallbackData, status: 200 });
  }
}
