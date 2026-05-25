import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

const SpyRequestSchema = z.object({
  companyName: z.string().min(1),
  domainUrl: z.string().url().optional(),
  industryCategory: z.string(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyName = searchParams.get('companyName');
    const domainUrl = searchParams.get('domainUrl') || undefined;
    const industryCategory = searchParams.get('industryCategory');

    const validatedData = SpyRequestSchema.parse({
      companyName,
      domainUrl,
      industryCategory,
    });

    // MOCK: Meta Ad Library API Fetch
    // const metaResponse = await fetch(`https://graph.facebook.com/v19.0/ads_archive?search_terms=${validatedData.companyName}&access_token=${process.env.META_ACCESS_TOKEN}`);
    // const metaData = await metaResponse.json();
    
    const mockAdsPayload = [
      { id: 'ad_1', text: 'Limited time offer!', status: 'ACTIVE' },
      { id: 'ad_2', text: 'Book your service today.', status: 'ACTIVE' }
    ];

    const mockPricingIntelligence = {
      basic: '$50',
      premium: '$150'
    };

    const mockKeywords = ['home nursing', 'cleaning services', 'nanny'];

    // Insert into Supabase via pg
    const insertQuery = `
      INSERT INTO competitor_spy 
      (company_name, domain_url, industry_category, active_ads_payload, pricing_intelligence, top_performing_keywords)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (company_name) DO UPDATE SET
        active_ads_payload = EXCLUDED.active_ads_payload,
        pricing_intelligence = EXCLUDED.pricing_intelligence,
        top_performing_keywords = EXCLUDED.top_performing_keywords,
        last_scraped_at = NOW()
      RETURNING *;
    `;

    const result = await query(insertQuery, [
      validatedData.companyName,
      validatedData.domainUrl || null,
      validatedData.industryCategory,
      JSON.stringify(mockAdsPayload),
      JSON.stringify(mockPricingIntelligence),
      mockKeywords
    ]);

    return NextResponse.json({ success: true, data: result.rows[0] });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
