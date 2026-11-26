export type SupportedLang = 'he' | 'en';
export type PacketCategory = 'terminal_output' | 'build_debug' | 'master_handoff' | 'methodology_stage' | 'structured_prompt';

export interface SmartAssetRecommendation {
  id: string;
  triggerKeywords: string[];
  titleHe: string;
  titleEn: string;
  descHe: string;
  descEn: string;
  href: string;
  badgeHe: string;
  badgeEn: string;
  enabled: boolean;
}

export interface ContextStudioConfig {
  enabled: boolean;
  defaultChunkLimit: number;
  autoDetectLanguage: boolean;
  enableSmartEcosystemLinks: boolean;
  recommendations: SmartAssetRecommendation[];
}