import { PresenterAvatar, VisualStyle3D } from '../types/whop';

export const AI_PRESENTERS: PresenterAvatar[] = [
  {
    id: 'carlos',
    name: 'Carlos Valdés',
    title: 'Presentador Tech & Negocios',
    voiceId: 'carlos',
    gender: 'male',
    tone: 'Locutor Profesional Neutro',
    specialty: 'Ideal para B2B, SaaS, Finanzas y Pitch Decks',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    talkingAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sofia',
    name: 'Sofía Mendoza',
    title: 'Creadora Dinámica TikTok & Reels',
    voiceId: 'sofia',
    gender: 'female',
    tone: 'Enérgica, Viral & Expresiva',
    specialty: 'Máxima retención en videos cortos 9:16 y redes',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    talkingAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mateo',
    name: 'Mateo Silva',
    title: 'Director Educativo & Masterclass',
    voiceId: 'mateo',
    gender: 'male',
    tone: 'Claro, Didáctico & Confiable',
    specialty: 'Ideal para cursos online en Whop, tutoriales y guías',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    talkingAvatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'elena',
    name: 'Elena Castro',
    title: 'Storyteller & Consultora Estratégica',
    voiceId: 'elena',
    gender: 'female',
    tone: 'Persuasiva, Sofisticada & Cálida',
    specialty: 'Venta de infoproductos, casos de estudio e inspiración',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    talkingAvatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80'
  }
];

export interface VisualStyleConfig {
  id: VisualStyle3D;
  name: string;
  badge: string;
  description: string;
  previewImage: string;
  lightingColor: string;
  glowEffect: string;
  sampleImages: string[];
}

export const MODERN_3D_STYLES: VisualStyleConfig[] = [
  {
    id: '3d-glassmorphism',
    name: '3D Glassmorphism & UI',
    badge: 'MODERNO SAAS',
    description: 'Tarjetas de cristal flotante translúcido con iluminación difusa suave y reflejos dimensionales.',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    lightingColor: '#06B6D4',
    glowEffect: 'shadow-[0_0_50px_rgba(6,182,212,0.35)]',
    sampleImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '3d-cyberneon',
    name: '3D Cyber Neon & Neural Core',
    badge: 'ALTA RETENCIÓN',
    description: 'Estilo cinematográfico oscuro con nodos neuronales brillantes, líneas de luz cian y naranja vibrante.',
    previewImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    lightingColor: '#FF6243',
    glowEffect: 'shadow-[0_0_50px_rgba(255,98,67,0.4)]',
    sampleImages: [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '3d-hologram',
    name: '3D Holograma Isométrico',
    badge: 'ESTRATEGIA & FINANZAS',
    description: 'Estructuras isométricas flotantes, gráficos de barras 3D transparentes y partículas volumétricas.',
    previewImage: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    lightingColor: '#3B82F6',
    glowEffect: 'shadow-[0_0_50px_rgba(59,130,246,0.35)]',
    sampleImages: [
      'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '3d-pixar-tech',
    name: '3D Pixar Tech & Studio Character',
    badge: 'VIRAL & AMIGABLE',
    description: 'Ilustraciones 3D cálidas estilo animación moderna de alto nivel, con materiales plásticos mate y luz de estudio suave.',
    previewImage: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=800&auto=format&fit=crop&q=80',
    lightingColor: '#10B981',
    glowEffect: 'shadow-[0_0_50px_rgba(16,185,129,0.35)]',
    sampleImages: [
      'https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
    ]
  }
];
