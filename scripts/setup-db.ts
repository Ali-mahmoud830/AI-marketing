import { Client } from 'pg';

const connectionString = 'postgresql://postgres:162004Kimokimo0100@db.cjtvxdcxpswtbywehrzu.supabase.co:5432/postgres';

const sql = `
-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. OMNICHANNEL CAMPAIGNS (Meta Ads, Google Search, TikTok)
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('Meta_Ads', 'Google_Ads', 'TikTok_Ads')),
    objective TEXT NOT NULL CHECK (objective IN ('Engagement', 'Lead_Generation', 'Traffic')),
    status TEXT NOT NULL DEFAULT 'paused' CHECK (status IN ('active', 'paused', 'archived')),
    daily_budget NUMERIC(12, 2) NOT NULL,
    api_campaign_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. DYNAMIC AD SETS & MICRO-TARGETING RULES
CREATE TABLE IF NOT EXISTS ad_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    geo_locations JSONB NOT NULL,
    targeting_interests TEXT[] NOT NULL,
    age_min INT NOT NULL DEFAULT 25,
    age_max INT NOT NULL DEFAULT 55,
    pixel_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. AI CREATIVE ASSETS (Generative Assets Management)
CREATE TABLE IF NOT EXISTS ad_creatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_set_id UUID REFERENCES ad_sets(id) ON DELETE CASCADE,
    headline TEXT NOT NULL,
    primary_text TEXT NOT NULL,
    image_url TEXT NOT NULL,
    voiceover_url TEXT,
    video_url TEXT,
    compliance_status TEXT DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'approved', 'flagged')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. OMNICHANNEL COMPETITORS SPY HUB
CREATE TABLE IF NOT EXISTS competitor_spy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL UNIQUE,
    domain_url TEXT,
    industry_category TEXT NOT NULL,
    active_ads_payload JSONB DEFAULT '[]'::jsonb,
    pricing_intelligence JSONB DEFAULT '{}'::jsonb,
    top_performing_keywords TEXT[],
    last_scraped_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. CLOSED-LOOP CRM & SYSTEM LEADS (Conversion Tracking & Screen Sessions)
CREATE TABLE IF NOT EXISTS crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    service_type TEXT NOT NULL,
    utm_source TEXT DEFAULT 'organic',
    utm_medium TEXT,
    utm_campaign TEXT,
    conversion_stage TEXT DEFAULT 'New_Lead' CHECK (conversion_stage IN ('New_Lead', 'Bot_Chatting', 'Interview_Scheduled', 'Closed_Won')),
    session_heatmap_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Advanced Speed Optimization Performance Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON marketing_campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_ad_sets_campaign ON ad_sets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_creatives_set ON ad_creatives(ad_set_id);
CREATE INDEX IF NOT EXISTS idx_spy_industry ON competitor_spy(industry_category);
CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON crm_leads(conversion_stage);
`;

async function setupDB() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database, executing schema...');
    await client.query(sql);
    console.log('Database schema executed successfully.');
  } catch (err) {
    console.error('Error executing schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDB();
