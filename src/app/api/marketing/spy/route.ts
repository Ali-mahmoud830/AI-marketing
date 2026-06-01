import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

const SpyRequestSchema = z.object({
  companyName: z.string().min(1),
  domainUrl: z.string().url().optional(),
  industryCategory: z.string(),
});

// User-Agent Spoofing Pool
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
];

// Configuration for Rotating Residential Proxies
const PROXY_CONFIG = {
  enabled: process.env.ENABLE_RESIDENTIAL_PROXIES === 'true',
  url: process.env.PROXY_URL || 'http://customer-scout:pass@pr.oxylabs.io:7777'
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

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

    // Stealth: Randomized Human-like Jitter Delay (2000ms - 7000ms)
    const jitter = Math.floor(Math.random() * (7000 - 2000) + 2000);
    await delay(jitter);

    // Stealth: Pick random User-Agent
    const randomUserAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    
    // MOCK: Meta Ad Library API Fetch using proxy config and headers
    /*
    const fetchOptions = {
      headers: { 'User-Agent': randomUserAgent },
      agent: PROXY_CONFIG.enabled ? new HttpsProxyAgent(PROXY_CONFIG.url) : undefined
    };
    const metaResponse = await fetch(`https://graph.facebook.com/v19.0/ads_archive...`, fetchOptions);
    */
    
    const mockAdsPayload = [
      { id: 'ad_1', text: 'Limited time offer!', status: 'ACTIVE' },
      { id: 'ad_2', text: 'Book your service today.', status: 'ACTIVE' }
    ];

    const mockPricingIntelligence = {
      basic: '$50',
      premium: '$150'
    };

    const mockKeywords = ['home nursing', 'cleaning services', 'nanny'];

    // Insert into Supabase
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

    return NextResponse.json({ success: true, jitter_applied_ms: jitter, data: result.rows[0] });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
