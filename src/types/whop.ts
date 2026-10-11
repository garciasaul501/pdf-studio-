export interface PlanConfig {
  id: string;
  name: string;
  badge?: string;
  price: number;
  period: 'mes' | 'año' | 'único';
  originalPrice?: number;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stars: number;
  comment: string;
  metric: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'producto' | 'whop' | 'tecnico' | 'facturacion';
}

export interface VideoScene {
  id: number;
  title: string;
  narration: string;
  bulletPoints: string[];
  duration: number; // in seconds
  bgGradient: string;
  accentColor: string;
  iconName: string;
}

export interface StorefrontSettings {
  storeName: string;
  subdomain: string;
  category: string;
  tagline: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  accentColor: string;
  guaranteeDays: number;
  plans: PlanConfig[];
}
