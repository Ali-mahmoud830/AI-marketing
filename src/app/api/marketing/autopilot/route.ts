import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

const WebhookEventSchema = z.object({
  campaignId: z.string().uuid(),
  event_name: z.string(),
  event_time: z.number(),
  value: z.number().optional(),
  currency: z.string().optional(),
  spend: z.number().optional(),
  leads_count: z.number().optional()
});

const TARGET_CPL = 150; // In reality, this would be fetched from global_settings
const LEARNING_PHASE_MS = 72 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = WebhookEventSchema.parse(body);
    const { campaignId, spend, leads_count, value } = validatedData;

    // Fetch Campaign to check created_at
    const fetchQuery = `SELECT * FROM marketing_campaigns WHERE id = $1`;
    const campaignResult = await query(fetchQuery, [campaignId]);
    
    if (campaignResult.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
    }
    const campaign = campaignResult.rows[0];

    // 1. 72-hour Learning Phase Lock
    const campaignAgeMs = Date.now() - new Date(campaign.created_at).getTime();
    if (campaignAgeMs < LEARNING_PHASE_MS) {
      return NextResponse.json({ 
        success: true, 
        action: 'learning_phase',
        message: 'Campaign is in 72-hour learning phase. No actions taken.'
      });
    }

    const currentSpend = spend || 1; 
    const currentLeads = leads_count || 1;
    const cpl = currentSpend / currentLeads;

    let budgetMultiplier = 1.0;
    let newStatus = campaign.status;

    // 2. Dynamic Budget Scaling (Anti-Ban Protection)
    if (cpl < TARGET_CPL) {
      budgetMultiplier = 1.2; // Scale UP 20%
    } else if (cpl > TARGET_CPL) {
      budgetMultiplier = 0.5; // Scale DOWN 50%, do not kill
      newStatus = 'Warning';
    }

    if (budgetMultiplier !== 1.0 || newStatus !== campaign.status) {
      const updateQuery = `
        UPDATE marketing_campaigns
        SET daily_budget = daily_budget * $1, status = $2
        WHERE id = $3
        RETURNING *;
      `;
      
      const dbResult = await query(updateQuery, [budgetMultiplier, newStatus, campaignId]);
      const updatedCampaign = dbResult.rows[0];

      return NextResponse.json({ 
        success: true, 
        action: cpl > TARGET_CPL ? 'scale_down_warning' : 'scale_up',
        new_budget: updatedCampaign.daily_budget,
        status: newStatus
      });
    }

    return NextResponse.json({ success: true, action: 'budget_maintained' });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
