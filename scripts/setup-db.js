"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var connectionString = 'postgresql://postgres.yyfvvfhcmtfgiycdwyzv:162004Kimokimo0100@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
var sql = "\n-- Enable UUID extension if not present\nCREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";\n\n-- 1. OMNICHANNEL CAMPAIGNS (Meta Ads, Google Search, TikTok)\nCREATE TABLE IF NOT EXISTS marketing_campaigns (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    name TEXT NOT NULL,\n    platform TEXT NOT NULL CHECK (platform IN ('Meta_Ads', 'Google_Ads', 'TikTok_Ads')),\n    objective TEXT NOT NULL CHECK (objective IN ('Engagement', 'Lead_Generation', 'Traffic')),\n    status TEXT NOT NULL DEFAULT 'paused' CHECK (status IN ('active', 'paused', 'archived')),\n    daily_budget NUMERIC(12, 2) NOT NULL,\n    api_campaign_id TEXT UNIQUE,\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL\n);\n\n-- 2. DYNAMIC AD SETS & MICRO-TARGETING RULES\nCREATE TABLE IF NOT EXISTS ad_sets (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,\n    name TEXT NOT NULL,\n    geo_locations JSONB NOT NULL,\n    targeting_interests TEXT[] NOT NULL,\n    age_min INT NOT NULL DEFAULT 25,\n    age_max INT NOT NULL DEFAULT 55,\n    pixel_id TEXT NOT NULL,\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL\n);\n\n-- 3. AI CREATIVE ASSETS (Generative Assets Management)\nCREATE TABLE IF NOT EXISTS ad_creatives (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    ad_set_id UUID REFERENCES ad_sets(id) ON DELETE CASCADE,\n    headline TEXT NOT NULL,\n    primary_text TEXT NOT NULL,\n    image_url TEXT NOT NULL,\n    voiceover_url TEXT,\n    video_url TEXT,\n    compliance_status TEXT DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'approved', 'flagged')),\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL\n);\n\n-- 4. OMNICHANNEL COMPETITORS SPY HUB\nCREATE TABLE IF NOT EXISTS competitor_spy (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    company_name TEXT NOT NULL UNIQUE,\n    domain_url TEXT,\n    industry_category TEXT NOT NULL,\n    active_ads_payload JSONB DEFAULT '[]'::jsonb,\n    pricing_intelligence JSONB DEFAULT '{}'::jsonb,\n    top_performing_keywords TEXT[],\n    last_scraped_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL\n);\n\n-- 5. CLOSED-LOOP CRM & SYSTEM LEADS (Conversion Tracking & Screen Sessions)\nCREATE TABLE IF NOT EXISTS crm_leads (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    name TEXT NOT NULL,\n    phone_number TEXT NOT NULL,\n    service_type TEXT NOT NULL,\n    utm_source TEXT DEFAULT 'organic',\n    utm_medium TEXT,\n    utm_campaign TEXT,\n    conversion_stage TEXT DEFAULT 'New_Lead' CHECK (conversion_stage IN ('New_Lead', 'Bot_Chatting', 'Interview_Scheduled', 'Closed_Won')),\n    session_heatmap_url TEXT,\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL\n);\n\n-- Advanced Speed Optimization Performance Indexes\nCREATE INDEX IF NOT EXISTS idx_campaigns_platform ON marketing_campaigns(platform);\nCREATE INDEX IF NOT EXISTS idx_ad_sets_campaign ON ad_sets(campaign_id);\nCREATE INDEX IF NOT EXISTS idx_ad_creatives_set ON ad_creatives(ad_set_id);\nCREATE INDEX IF NOT EXISTS idx_spy_industry ON competitor_spy(industry_category);\nCREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON crm_leads(conversion_stage);\n";
function setupDB() {
    return __awaiter(this, void 0, void 0, function () {
        var client, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new pg_1.Client({ connectionString: connectionString });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 7]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _a.sent();
                    console.log('Connected to database, executing schema...');
                    return [4 /*yield*/, client.query(sql)];
                case 3:
                    _a.sent();
                    console.log('Database schema executed successfully.');
                    return [3 /*break*/, 7];
                case 4:
                    err_1 = _a.sent();
                    console.error('Error executing schema:', err_1);
                    process.exit(1);
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, client.end()];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
setupDB();
