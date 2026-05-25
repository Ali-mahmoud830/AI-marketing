import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

const WebhookEventSchema = z.object({
  campaignId: z.string().uuid(),
  event_name: z.string(),
  event_time: z.number(),
  value: z.number().optional(),
  currency: z.string().optional(),
  spend: z.number().optional(), // Injected metric for calculation
  leads_count: z.number().optional() // Injected metric for calculation
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = WebhookEventSchema.parse(body);

    const { campaignId, spend, leads_count, value } = validatedData;

    // Autopilot logic: calculate ROAS and Cost-Per-Lead (CPL)
    const currentSpend = spend || 1; 
    const currentLeads = leads_count || 1;
    const revenue = value || 0;

    const cpl = currentSpend / currentLeads;
    const roas = revenue / currentSpend;

    let budgetMultiplier = 1.0;

    // Simple Autopilot Rules
    if (roas > 3.0 || cpl < 15) {
      // Performing well, scale up 20%
      budgetMultiplier = 1.2;
    } else if (roas < 1.0 || cpl > 50) {
      // Underperforming, scale down 20%
      budgetMultiplier = 0.8;
    }

    if (budgetMultiplier !== 1.0) {
      // Update local database budget
      const updateQuery = `
        UPDATE marketing_campaigns
        SET daily_budget = daily_budget * $1
        WHERE id = $2
        RETURNING *;
      `;
      
      const dbResult = await query(updateQuery, [budgetMultiplier, campaignId]);
      const updatedCampaign = dbResult.rows[0];

      // MOCK: Update budget via Meta API
      // await fetch(`https://graph.facebook.com/v19.0/${updatedCampaign.api_campaign_id}`, {
      //   method: 'POST',
      //   body: JSON.stringify({ daily_budget: updatedCampaign.daily_budget * 100 }), // Meta expects cents
      // });

      return NextResponse.json({ 
        success: true, 
        action: 'budget_adjusted',
        new_budget: updatedCampaign.daily_budget
      });
    }

    return NextResponse.json({ 
      success: true, 
      action: 'budget_maintained'
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
