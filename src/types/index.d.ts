export type UserRole = 'SuperAdmin' | 'Sales' | 'CRM';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface GlobalSettings {
  id: string;
  meta_api_key?: string;
  midjourney_api_key?: string;
  luma_api_key?: string;
  elevenlabs_api_key?: string;
  llm_api_key?: string;
  target_cpl_vip: number;
  target_cpl_standard: number;
  updated_at: string;
}

export interface AdCreative {
  id: string;
  ad_set_id: string;
  headline: string;
  primary_text: string;
  image_url: string;
  voiceover_url?: string;
  video_url?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  created_at: string;
}

export interface MarketAnalysisResult {
  competitor_weaknesses: string[];
  recommended_angles: string[];
}

export interface ScriptGenerationResult {
  short_hook: string;
  long_copy: string;
  sales_whatsapp_reply: string;
  midjourney_prompt: string;
}
