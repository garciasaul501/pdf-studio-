import { StorefrontSettings, Testimonial, FaqItem, VideoScene, SeoMetadataConfig } from '../types/whop';

export const OG_IMAGE_PRESETS = [
  {
    id: 'cyberneon',
    name: '3D Cyber Neon & Neural Core',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&auto=format&fit=crop&q=80',
    category: 'Alta Retención'
  },
  {
    id: 'glassmorphism',
    name: '3D Glassmorphism & Modern UI',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&auto=format&fit=crop&q=80',
    category: 'SaaS & Tech'
  },
  {
    id: 'hologram',
    name: '3D Isometric Hologram & Analytics',
    url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&h=630&auto=format&fit=crop&q=80',
    category: 'Negocios & Finanzas'
  },
  {
    id: 'creator-studio',
    name: 'Creator Studio & Video Producer',
    url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=630&auto=format&fit=crop&q=80',
    category: 'Creadores & Reels'
  },
  {
    id: 'growth-agency',
    name: 'Digital Growth & Educational AI',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&auto=format&fit=crop&q=80',
    category: 'Marketing & Whop'
  }
];

export const defaultSeoConfig: SeoMetadataConfig = {
  pageTitle: 'PDF to Video AI – Transforma Documentos en Videos Virales 3D',
  metaDescription: 'Convierte cualquier PDF en videos profesionales con avatar IA, voz sincronizada, guiones de alta retención y fondos 3D para TikTok, Reels y cursos en Whop.',
  keywords: 'pdf a video, convertidor pdf, whop storefront, avatar ia, generador de videos, video marketing, tiktok reels, cursos online, ia video studio',
  canonicalUrl: 'https://pdftovideo.whop.site',
  ogTitle: 'PDF to Video AI – Convierte tus PDFs en Videos Virales con IA',
  ogDescription: 'Sube tu PDF y genera videos interactivos con presentadores virtuales hablando sincronizados y fondos 3D de alta conversión.',
  ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&auto=format&fit=crop&q=80',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterCreator: '@whop',
  author: 'Whop Studio & Global Educación IA',
  robots: 'index, follow',
  schemaType: 'SoftwareApplication'
};

export const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    role: 'Creador de Cursos en Whop',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    stars: 5,
    comment: 'Tardaba 3 días en pasar mis diapositivas de PDF a videos para mi comunidad. Con esta herramienta en Whop subí mi PDF de 24 páginas y en 2 minutos tenía 6 videos listos para TikTok. Mis ventas subieron un 140%.',
    metric: '+140% en ventas'
  },
  {
    id: '2',
    name: 'Valeria Sotomayor',
    role: 'Agencia de Marketing de Contenidos',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    stars: 5,
    comment: 'La compré para nuestro equipo y se pagó sola en el primer día. Los clientes nos mandan sus PDFs informativos y les devolvemos reels con locución profesional sin tener que grabar voz ni animar desde cero.',
    metric: 'Ahorro de 15h semanales'
  },
  {
    id: '3',
    name: 'Mateo Rivas',
    role: 'Infoproductor & Afiliado',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    stars: 5,
    comment: 'El mejor software que he comprado en Whop este año. La integración con el portal de miembros es transparente y la calidad de los guiones que resume la IA es impecable.',
    metric: '45k reproducciones en 48h'
  }
];

export const initialStorefrontSettings: StorefrontSettings = {
  storeName: 'PDF to Video AI',
  subdomain: 'pdftovideo',
  category: 'Software & Herramientas de IA',
  tagline: 'Convierte tus documentos en videos virales y lecciones interactivas',
  headline: 'Transforma cualquier PDF en Videos atractivos con IA en menos de 60 segundos',
  subheadline: 'Sube tus guías, diapositivas, e-books o resúmenes. Nuestra IA genera el guion narrativo, crea las escenas animadas y agrega locución profesional con subtítulos automáticos. Listo para publicar en TikTok, Reels, YouTube o tus cursos.',
  primaryCtaText: 'Probar Convertidor en Vivo',
  secondaryCtaText: 'Ver Planes y Precios',
  accentColor: '#FF6243', // Whop signature vibrant orange
  guaranteeDays: 14,
  seo: defaultSeoConfig,
  plans: [
    {
      id: 'starter',
      name: 'Plan Creador',
      price: 19,
      period: 'mes',
      description: 'Ideal para creadores individuales, educadores y creadores de contenido que inician.',
      popular: false,
      features: [
        'Hasta 40 conversiones de PDF a video al mes',
        'Exportación en 1080p Full HD (16:9 y 9:16)',
        '12 Voces neuronales en español e inglés',
        'Subtítulos automáticos sincronizados',
        'Descarga de guiones en formato .TXT y .SRT',
        'Soporte estándar por comunidad Whop'
      ],
      cta: 'Comenzar con Creador'
    },
    {
      id: 'pro',
      name: 'Plan Pro Ilimitado',
      badge: 'MÁS VENDIDO EN WHOP',
      price: 39,
      period: 'mes',
      originalPrice: 59,
      description: 'Para agencias, infoproductores y creadores que publican contenido diario.',
      popular: true,
      features: [
        'Conversiones y renders ILIMITADOS',
        'Exportación en 4K Ultra HD sin marcas de agua',
        'Más de 40 voces IA ultra realistas con acentos neutros',
        'Estilos de subtítulos animados dinámicos',
        'Personalización de colores, fuentes y logos de marca',
        'Procesamiento en servidor acelerado por GPU',
        'Acceso prioritario a nuevas funciones y Discord VIP'
      ],
      cta: 'Desbloquear Pro Ilimitado'
    },
    {
      id: 'lifetime',
      name: 'Licencia Vitalicia',
      badge: 'PAGO ÚNICO',
      price: 99,
      period: 'único',
      originalPrice: 199,
      description: 'Acceso para siempre sin mensualidades. Un solo pago y uso perpetuo.',
      popular: false,
      features: [
        'Acceso de por vida a la herramienta en Whop',
        'Todas las características del Plan Pro incluidas',
        'Actualizaciones futuras de por vida garantizadas',
        'Derechos comerciales completos para revender a clientes',
        'Canal privado 1-a-1 de soporte técnico en Whop'
      ],
      cta: 'Obtener Licencia de por Vida'
    }
  ],
  testimonials: defaultTestimonials
};

export const defaultFaqs: FaqItem[] = [
  {
    category: 'producto',
    question: '¿Qué tipos de documentos PDF puedo subir?',
    answer: 'Puedes subir cualquier tipo de archivo PDF: presentaciones de diapositivas, libros electrónicos (e-books), informes empresariales, resúmenes académicos, guías prácticas o notas técnicas. La IA detecta la estructura y extrae los puntos más impactantes.'
  },
  {
    category: 'producto',
    question: '¿Necesito experiencia previa en edición de video?',
    answer: 'Ninguna. La plataforma está diseñada para ser 100% no-code y automatizada. Solo arrastras tu archivo PDF, seleccionas la voz y el estilo visual, y la herramienta genera las escenas, animaciones, voz y subtítulos automáticamente.'
  },
  {
    category: 'whop',
    question: '¿Cómo recibo acceso una vez que compre en Whop?',
    answer: 'El acceso es instantáneo y automático. En cuanto completas el pago seguro en Whop, serás redirigido directamente al área de miembros de tu cuenta de Whop, donde tendrás la aplicación lista para usar sin esperas ni configuraciones complejas.'
  },
  {
    category: 'facturacion',
    question: '¿Puedo cancelar mi suscripción en cualquier momento?',
    answer: 'Sí, totalmente. Tienes control absoluto desde tu panel de usuario de Whop. Puedes cancelar tu suscripción con un solo clic en cualquier momento sin penalizaciones ni preguntas.'
  },
  {
    category: 'tecnico',
    question: '¿Tengo derechos comerciales para publicar o monetizar los videos?',
    answer: 'Sí. Todos los videos generados con los planes Creador, Pro y Licencia Vitalicia son 100% libres de derechos y puedes usarlos en tus redes sociales (YouTube, TikTok, Instagram), cursos de pago, clientes de agencia o publicidad digital.'
  },
  {
    category: 'facturacion',
    question: '¿Qué métodos de pago acepta Whop?',
    answer: 'Whop Payments admite tarjetas de crédito y débito internacionales (Visa, Mastercard, American Express), Apple Pay, Google Pay y criptomonedas seleccionadas en un checkout cifrado de máxima seguridad.'
  }
];

export const samplePdfOptions = [
  {
    id: 'finance',
    name: 'Guía de Finanzas Personales e Inversión 2026.pdf',
    pages: 14,
    size: '2.4 MB',
    summary: 'Aprende la regla 50/30/20, fondo de emergencia e inversión pasiva.',
    scenes: [
      {
        id: 1,
        title: 'El Error #1 con tu Dinero',
        narration: 'La mayoría de las personas ahorran lo que les sobra después de gastar, cuando la regla de oro es apartar primero el 20% para tu futuro.',
        bulletPoints: ['No ahorres lo que sobra: ahorra primero', 'Automatiza tu transferencia bancaria', 'Construye tu fondo de paz mental'],
        duration: 7,
        bgGradient: 'from-amber-950/80 via-slate-900 to-black',
        accentColor: '#F59E0B',
        iconName: 'DollarSign',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
        imagePrompt: 'Futuristic golden currency and growth visualization, glowing dark neon ambience'
      },
      {
        id: 2,
        title: 'La Regla de Oro 50/30/20',
        narration: 'Divide tus ingresos netos: 50% en necesidades básicas, 30% en deseos y estilo de vida, y 20% directo a ahorro e inversión.',
        bulletPoints: ['50% Necesidades: Vivienda, comida y transporte', '30% Deseos: Ocio, salidas y hobbies', '20% Crecimiento: Inversión indexada'],
        duration: 8,
        bgGradient: 'from-emerald-950/80 via-slate-900 to-black',
        accentColor: '#10B981',
        iconName: 'PieChart',
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
        imagePrompt: 'Clean geometric breakdown of assets, emerald glowing segments, minimal 3D design'
      },
      {
        id: 3,
        title: 'Interés Compuesto: La Octava Maravilla',
        narration: 'Invertir 100 dólares al mes durante 20 años al 10% anual genera más de setenta mil dólares gracias al interés compuesto.',
        bulletPoints: ['El tiempo es más poderoso que el dinero', 'Reinvierte todos los dividendos', 'Empieza hoy sin esperar el momento perfecto'],
        duration: 7,
        bgGradient: 'from-blue-950/80 via-slate-900 to-black',
        accentColor: '#3B82F6',
        iconName: 'TrendingUp',
        imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
        imagePrompt: 'Exponential growth curve, holographic numbers and celestial blue illumination'
      },
      {
        id: 4,
        title: 'Tu Plan de Acción en 3 Pasos',
        narration: 'Abre hoy una cuenta de inversión de bajo costo, programa un débito automático mensual y no toques ese dinero por 10 años.',
        bulletPoints: ['Elige fondos indexados globales', 'Automatiza el primer día de cobro', '¡Comparte esta guía con alguien que lo necesite!'],
        duration: 6,
        bgGradient: 'from-orange-950/80 via-slate-900 to-black',
        accentColor: '#FF6243',
        iconName: 'CheckCircle2',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        imagePrompt: 'Action checklist and futuristic dashboard, warm amber lighting'
      }
    ]
  },
  {
    id: 'startup',
    name: 'Pitch Deck: Plataforma SaaS B2B 2026.pdf',
    pages: 10,
    size: '1.8 MB',
    summary: 'Presentación ejecutiva: problema, mercado, tracción y modelo de negocio.',
    scenes: [
      {
        id: 1,
        title: 'El Problema: Pérdida de 4 Horas Diarias',
        narration: 'Las empresas medianas pierden más de 4 horas al día en tareas administrativas repetitivas que no generan ingresos directos.',
        bulletPoints: ['Procesos manuales desconectados', 'Errores humanos en facturación y seguimiento', 'Equipos frustrados y costosos'],
        duration: 7,
        bgGradient: 'from-rose-950/80 via-slate-900 to-black',
        accentColor: '#EF4444',
        iconName: 'AlertCircle',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
        imagePrompt: 'Overwhelmed modern office scene with floating red warning particles'
      },
      {
        id: 2,
        title: 'Nuestra Solución: Automatización Inteligente',
        narration: 'Conectamos CRM, facturación y soporte en un único flujo autónomo impulsado por agentes de inteligencia artificial.',
        bulletPoints: ['Integración en 1 clic con tus herramientas', 'Reducción del 80% en tiempo operativo', 'Sin necesidad de personal técnico'],
        duration: 8,
        bgGradient: 'from-cyan-950/80 via-slate-900 to-black',
        accentColor: '#06B6D4',
        iconName: 'Cpu',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        imagePrompt: 'Seamless digital automation hub, cyan neon data bridges'
      },
      {
        id: 3,
        title: 'Tracción: Crecimiento Mensual del 28%',
        narration: 'En solo 6 meses alcanzamos más de 120 clientes de pago y una tasa de retención superior al 95%.',
        bulletPoints: ['$42,000 MRR actual recurrente', '96% Net Revenue Retention', 'CAC recuperado en solo 3 meses'],
        duration: 7,
        bgGradient: 'from-purple-950/80 via-slate-900 to-black',
        accentColor: '#A855F7',
        iconName: 'Rocket',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
        imagePrompt: 'Rocket propulsion into vibrant violet atmosphere, upward trajectory'
      }
    ]
  },
  {
    id: 'ai-prompting',
    name: 'Manual Maestro de Ingeniería de Prompts.pdf',
    pages: 18,
    size: '3.1 MB',
    summary: 'Frameworks avanzados para obtener respuestas perfectas de modelos de IA.',
    scenes: [
      {
        id: 1,
        title: 'El Framework R-T-C-O para Prompts',
        narration: 'Para obtener resultados de nivel experto en cualquier IA, estructura tu prompt en cuatro pilares: Rol, Tarea, Contexto y Formato de Salida.',
        bulletPoints: ['R: Define el Rol del experto', 'T: Describe la Tarea con precisión quirúrgica', 'C: Brinda el Contexto y restricciones', 'O: Especifica la Salida requerida'],
        duration: 8,
        bgGradient: 'from-indigo-950/80 via-slate-900 to-black',
        accentColor: '#6366F1',
        iconName: 'Sparkles',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        imagePrompt: 'Dimensional neural network brain, intricate indigo geometry'
      },
      {
        id: 2,
        title: 'Ejemplo: Prompt de Nivel Senior',
        narration: 'En lugar de pedir "escribe un post", pídele actuar como copywriter de respuesta directa con ejemplos específicos y tono persuasivo.',
        bulletPoints: ['Agrega ejemplos Few-Shot (positivo/negativo)', 'Pídele pensar paso a paso antes de responder', 'Evita lenguaje vago o abstracto'],
        duration: 8,
        bgGradient: 'from-emerald-950/80 via-slate-900 to-black',
        accentColor: '#10B981',
        iconName: 'Zap',
        imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
        imagePrompt: 'Luminous holographic typography emerging from dark matrix'
      }
    ]
  }
];

export interface StorefrontTemplatePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  accentColor: string;
  badge: string;
  settings: StorefrontSettings;
}

export const STOREFRONT_TEMPLATES: StorefrontTemplatePreset[] = [
  {
    id: 'saas-ai-tool',
    name: 'SaaS Software & AI Studio',
    category: 'Software & Herramientas de IA',
    description: 'Optimizada para creadores que venden software, convertidores de documentos a video y apps web en Whop.',
    badge: 'Predeterminada',
    accentColor: '#FF6243',
    settings: {
      ...initialStorefrontSettings,
      testimonials: defaultTestimonials,
      seo: defaultSeoConfig
    }
  },
  {
    id: 'academy-masterclass',
    name: 'Academia & Cursos Digitales',
    category: 'Educación & Cursos Online',
    description: 'Diseñada para formadores, infoproductores y educadores que venden cursos, workshops y mentorías en Whop.',
    badge: 'Educación VIP',
    accentColor: '#8B5CF6',
    settings: {
      storeName: 'Academia Video AI Pro',
      subdomain: 'academia-videoai',
      category: 'Educación & Cursos Online',
      tagline: 'Domina la creación de videos virales con IA y monetiza tu conocimiento en Whop',
      headline: 'Crea, Edita y Vende Videos Virales con Inteligencia Artificial',
      subheadline: 'El programa formativo definitivo para creadores y educadores que quieren dominar la producción audiovisual automatizada a partir de PDFs y diapositivas.',
      primaryCtaText: 'Inscribirme al Curso Ahora',
      secondaryCtaText: 'Ver Temario y Lecciones',
      accentColor: '#8B5CF6',
      guaranteeDays: 30,
      plans: [
        {
          id: 'starter-course',
          name: 'Acceso Básico al Curso',
          price: 29,
          period: 'mes',
          description: 'Acceso a las 18 lecciones base, biblioteca de prompts y comunidad de alumnos.',
          popular: false,
          features: [
            '18 Lecciones en video de alta calidad',
            'Plantillas de guiones virales descargables',
            'Comunidad privada de alumnos en Whop',
            'Actualizaciones mensuales de contenido',
            'Soporte por foro de preguntas'
          ],
          cta: 'Comenzar Formación Básica'
        },
        {
          id: 'pro-masterclass',
          name: 'Masterclass Pro + IA Tools',
          badge: 'MÁS POPULAR',
          price: 69,
          period: 'mes',
          originalPrice: 99,
          description: 'Para creadores serios que quieren mentoría semanal y herramientas avanzadas de IA.',
          popular: true,
          features: [
            'Todo lo del Acceso Básico',
            'Sesiones semanales de preguntas y respuestas en vivo',
            'Herramienta de conversión PDF a video incluida',
            'Revisión y feedback personalizado de tus videos',
            'Rol VIP en Discord y canal exclusivo'
          ],
          cta: 'Unirme a Masterclass Pro'
        },
        {
          id: 'mentorship-lifetime',
          name: 'Certificación & Mentoría VIP',
          badge: 'PAGO ÚNICO',
          price: 199,
          period: 'único',
          originalPrice: 350,
          description: 'Acceso vitalicio a todas las ediciones futuras con sesión 1-a-1 de asesoría.',
          popular: false,
          features: [
            'Acceso de por vida a la Academia y actualizaciones',
            'Sesión privada de 60 minutos de mentoría 1-a-1',
            'Certificado de finalización verificado por Whop',
            'Plantillas de contratos y kits para revender a marcas',
            'Contacto directo por WhatsApp con el instructor'
          ],
          cta: 'Obtener Certificación Vitalicia'
        }
      ],
      testimonials: [
        {
          id: 't-acad-1',
          name: 'Sofia Navas',
          role: 'Creadora Educativa en TikTok',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          stars: 5,
          comment: 'Pasé de tener cero seguidores a más de 80k en 3 meses gracias a los métodos de esta academia. La conversión de mis apuntes a videos cortos es una locura.',
          metric: '80k seguidores en 90 días'
        },
        {
          id: 't-acad-2',
          name: 'Javier Morales',
          role: 'Profesor Universitario & Formador',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
          stars: 5,
          comment: 'La mejor inversión que he hecho en Whop. Ahora mis clases y libros de texto se transforman en reels interactivos que mis alumnos disfrutan muchísimo.',
          metric: '95% de retención estudiantil'
        }
      ],
      seo: {
        pageTitle: 'Academia Video AI Pro – Domina la Creación de Video con IA en Whop',
        metaDescription: 'Aprende a producir videos virales y contenido de alta conversión utilizando inteligencia artificial. Curso oficial con mentorías en vivo en Whop.',
        keywords: 'curso video ia, masterclass whop, prompts video, generador de contenido, academia digital, infoproducto',
        canonicalUrl: 'https://academia-videoai.whop.site',
        ogTitle: 'Academia Video AI Pro – Transforma tus PDFs en Cursos Virales',
        ogDescription: 'Formación paso a paso para crear lecciones en video interactivas con avatares IA y voz sintética profesional.',
        ogImage: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&h=630&auto=format&fit=crop&q=80',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterCreator: '@whop',
        author: 'Academia Video AI & Whop Education',
        robots: 'index, follow',
        schemaType: 'Course'
      }
    }
  },
  {
    id: 'agency-growth',
    name: 'Agencia de Video Marketing B2B',
    category: 'Servicios de Agencia & Video Marketing',
    description: 'Optimizada para agencias de contenido, productoras y freelancers que ofrecen paquetes mensuales de videos a marcas.',
    badge: 'Alta Conversión B2B',
    accentColor: '#06B6D4',
    settings: {
      storeName: 'ViralScale Agency Studio',
      subdomain: 'viralscale',
      category: 'Servicios de Agencia & Video Marketing',
      tagline: 'Escalamos la presencia de tu marca con videos verticales generados por IA',
      headline: 'Entregamos 30 Videos Virales al Mes para tu Negocio sin Grabar ni Editar',
      subheadline: 'Tu equipo outsourced de video marketing: convertimos tus artículos, PDFs y presentaciones en piezas virales listas para TikTok, Reels y Shorts con locutores nativos.',
      primaryCtaText: 'Contratar Plan Mensual',
      secondaryCtaText: 'Ver Casos de Éxito',
      accentColor: '#06B6D4',
      guaranteeDays: 14,
      plans: [
        {
          id: 'starter-agency',
          name: 'Starter Marca Personal',
          price: 49,
          period: 'mes',
          description: '15 videos verticales al mes en Full HD con guiones de alta retención.',
          popular: false,
          features: [
            '15 Videos al mes en formato 9:16 (Reels/TikTok)',
            'Guiones adaptados desde tus PDFs o artículos',
            'Subtítulos dinámicos con emojis animados',
            '1 Ronda de revisiones por video',
            'Entrega en carpeta compartida de Google Drive'
          ],
          cta: 'Elegir Starter Marca'
        },
        {
          id: 'scale-agency',
          name: 'Growth Agencia & E-commerce',
          badge: 'MÁS SOLICITADO',
          price: 149,
          period: 'mes',
          originalPrice: 220,
          description: '45 videos al mes con avatares ultra realistas y estrategia editorial completa.',
          popular: true,
          features: [
            '45 Videos al mes con locución profesional nativa',
            'Avatares IA hiperrealistas y fondos 3D personalizados',
            'Investigación de tendencias y hooks de alto enganche',
            'Revisiones ilimitadas y entrega en 48 horas',
            'Canal privado de Slack/Discord con tu editor asignado'
          ],
          cta: 'Contratar Growth Agencia'
        },
        {
          id: 'enterprise-agency',
          name: 'Enterprise Ilimitado',
          badge: 'RETENCIÓN MÁXIMA',
          price: 399,
          period: 'mes',
          originalPrice: 599,
          description: 'Producción de volumen a gran escala para marcas globales y agencias con múltiples cuentas.',
          popular: false,
          features: [
            'Producción de videos ilimitada bajo demanda',
            'Adaptación multiformato (16:9 horizontal + 9:16 vertical)',
            'Derechos de uso publicitario pagado (Paid Ads)',
            'SLA de entrega prioritario de 24 horas',
            'Director creativo dedicado 1-a-1'
          ],
          cta: 'Consultar Plan Enterprise'
        }
      ],
      testimonials: [
        {
          id: 't-ag-1',
          name: 'Camila Herrera',
          role: 'CMO en FinTech Growth',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          stars: 5,
          comment: 'Teníamos 40 whitepapers y manuales en PDF que nadie leía. La agencia los convirtió en 90 reels virales y nuestro tráfico orgánico se triplicó en 60 días.',
          metric: '3.2M de visualizaciones orgánicas'
        },
        {
          id: 't-ag-2',
          name: 'Esteban Domínguez',
          role: 'Director de Marketing B2B',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          stars: 5,
          comment: 'La suscripción en Whop nos ahorró tener que contratar un editor y un locutor a tiempo completo. La calidad de los videos con IA es impecable.',
          metric: 'Ahorro de $3,500/mes'
        }
      ],
      seo: {
        pageTitle: 'ViralScale Agency – Producción de Videos Verticales con IA en Whop',
        metaDescription: 'Agencia especializada en transformar PDFs y documentos en videos de alto impacto para marcas y creadores en Whop. Entrega en 48h.',
        keywords: 'agencia video ia, reels automatizados, tiktok marketing, video vertical b2b, contenido viral whop',
        canonicalUrl: 'https://viralscale.whop.site',
        ogTitle: 'ViralScale Agency – Videos Virales Automatizados para tu Marca',
        ogDescription: 'Entregamos paquetes mensuales de videos de alto enganche sin grabaciones ni cámaras.',
        ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&auto=format&fit=crop&q=80',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterCreator: '@whop',
        author: 'ViralScale Media & Whop Partners',
        robots: 'index, follow',
        schemaType: 'Product'
      }
    }
  }
];

export interface StorefrontAnalyticsPoint {
  date: string;
  dayLabel: string;
  pageViews: number;
  uniqueVisitors: number;
  checkouts: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

export interface FunnelStage {
  id: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
  description: string;
}

export interface TrafficSource {
  source: string;
  share: number;
  views: number;
  conversions: number;
  conversionRate: number;
  color: string;
}

export const ANALYTICS_DATA_7D: StorefrontAnalyticsPoint[] = [
  { date: '11 Oct', dayLabel: 'Domingo', pageViews: 4210, uniqueVisitors: 2850, checkouts: 412, conversions: 189, conversionRate: 4.49, revenue: 5860 },
  { date: '12 Oct', dayLabel: 'Lunes', pageViews: 4890, uniqueVisitors: 3340, checkouts: 480, conversions: 240, conversionRate: 4.91, revenue: 7440 },
  { date: '13 Oct', dayLabel: 'Martes', pageViews: 5620, uniqueVisitors: 3910, checkouts: 565, conversions: 298, conversionRate: 5.30, revenue: 9240 },
  { date: '14 Oct', dayLabel: 'Miércoles', pageViews: 6340, uniqueVisitors: 4420, checkouts: 640, conversions: 345, conversionRate: 5.44, revenue: 10695 },
  { date: '15 Oct', dayLabel: 'Jueves', pageViews: 7580, uniqueVisitors: 5310, checkouts: 780, conversions: 426, conversionRate: 5.62, revenue: 13206 },
  { date: '16 Oct', dayLabel: 'Viernes', pageViews: 8940, uniqueVisitors: 6200, checkouts: 940, conversions: 524, conversionRate: 5.86, revenue: 16244 },
  { date: '17 Oct', dayLabel: 'Sábado (Hoy)', pageViews: 10670, uniqueVisitors: 7450, checkouts: 1150, conversions: 668, conversionRate: 6.26, revenue: 20708 }
];

export const ANALYTICS_DATA_30D: StorefrontAnalyticsPoint[] = [
  { date: '18 Sep', dayLabel: 'Semana 1', pageViews: 14200, uniqueVisitors: 9800, checkouts: 1250, conversions: 568, conversionRate: 4.00, revenue: 17608 },
  { date: '21 Sep', dayLabel: 'Semana 1', pageViews: 16800, uniqueVisitors: 11400, checkouts: 1520, conversions: 714, conversionRate: 4.25, revenue: 22134 },
  { date: '24 Sep', dayLabel: 'Semana 2', pageViews: 19500, uniqueVisitors: 13200, checkouts: 1810, conversions: 877, conversionRate: 4.50, revenue: 27187 },
  { date: '27 Sep', dayLabel: 'Semana 2', pageViews: 22400, uniqueVisitors: 15100, checkouts: 2130, conversions: 1053, conversionRate: 4.70, revenue: 32643 },
  { date: '30 Sep', dayLabel: 'Semana 3', pageViews: 25900, uniqueVisitors: 17400, checkouts: 2540, conversions: 1269, conversionRate: 4.90, revenue: 39339 },
  { date: '03 Oct', dayLabel: 'Semana 3', pageViews: 29800, uniqueVisitors: 20100, checkouts: 3010, conversions: 1520, conversionRate: 5.10, revenue: 47120 },
  { date: '06 Oct', dayLabel: 'Semana 4', pageViews: 34100, uniqueVisitors: 22900, checkouts: 3510, conversions: 1807, conversionRate: 5.30, revenue: 56017 },
  { date: '09 Oct', dayLabel: 'Semana 4', pageViews: 38900, uniqueVisitors: 26100, checkouts: 4080, conversions: 2140, conversionRate: 5.50, revenue: 66340 },
  { date: '13 Oct', dayLabel: 'Semana 5', pageViews: 43800, uniqueVisitors: 29400, checkouts: 4690, conversions: 2540, conversionRate: 5.80, revenue: 78740 },
  { date: '17 Oct', dayLabel: 'Cierre Mes', pageViews: 48250, uniqueVisitors: 32500, checkouts: 5280, conversions: 2991, conversionRate: 6.20, revenue: 92721 }
];

export const ANALYTICS_DATA_90D: StorefrontAnalyticsPoint[] = [
  { date: 'Julio S1', dayLabel: 'Jul', pageViews: 28000, uniqueVisitors: 19500, checkouts: 2400, conversions: 980, conversionRate: 3.50, revenue: 30380 },
  { date: 'Julio S3', dayLabel: 'Jul', pageViews: 39000, uniqueVisitors: 26800, checkouts: 3500, conversions: 1482, conversionRate: 3.80, revenue: 45942 },
  { date: 'Agosto S1', dayLabel: 'Ago', pageViews: 52000, uniqueVisitors: 35600, checkouts: 4900, conversions: 2184, conversionRate: 4.20, revenue: 67704 },
  { date: 'Agosto S3', dayLabel: 'Ago', pageViews: 68000, uniqueVisitors: 46200, checkouts: 6600, conversions: 3128, conversionRate: 4.60, revenue: 96968 },
  { date: 'Sept S1', dayLabel: 'Sep', pageViews: 86000, uniqueVisitors: 58100, checkouts: 8700, conversions: 4300, conversionRate: 5.00, revenue: 133300 },
  { date: 'Sept S3', dayLabel: 'Sep', pageViews: 108000, uniqueVisitors: 72900, checkouts: 11400, conversions: 5832, conversionRate: 5.40, revenue: 180792 },
  { date: 'Octubre S1', dayLabel: 'Oct', pageViews: 134000, uniqueVisitors: 90200, checkouts: 14800, conversions: 7772, conversionRate: 5.80, revenue: 240932 },
  { date: 'Octubre S2', dayLabel: 'Oct', pageViews: 162000, uniqueVisitors: 109000, checkouts: 18400, conversions: 10044, conversionRate: 6.20, revenue: 311364 }
];

export const STOREFRONT_FUNNEL_STAGES: FunnelStage[] = [
  {
    id: 'stage_1',
    label: 'Visita al Storefront',
    count: 48250,
    percentage: 100,
    color: '#FF6243',
    description: 'Tráfico total que llega a pdftovideo.whop.site'
  },
  {
    id: 'stage_2',
    label: 'Prueba del Convertidor en Vivo',
    count: 31480,
    percentage: 65.2,
    color: '#F59E0B',
    description: 'Usuarios que suben un PDF o seleccionan un demo'
  },
  {
    id: 'stage_3',
    label: 'Clic en Planes y Precios',
    count: 12940,
    percentage: 26.8,
    color: '#8B5CF6',
    description: 'Usuarios que exploran los planes Creador, Pro o Vitalicio'
  },
  {
    id: 'stage_4',
    label: 'Checkout Iniciado en Whop',
    count: 6150,
    percentage: 12.7,
    color: '#06B6D4',
    description: 'Usuarios que abren la pasarela segura de Whop Payments'
  },
  {
    id: 'stage_5',
    label: 'Suscripción / Compra Exitosa',
    count: 2560,
    percentage: 5.31,
    color: '#10B981',
    description: 'Clientes convertidos con licencia activa asignada'
  }
];

export const STOREFRONT_TRAFFIC_SOURCES: TrafficSource[] = [
  { source: 'Whop Marketplace & Explore', share: 41, views: 19780, conversions: 1186, conversionRate: 6.0, color: '#FF6243' },
  { source: 'Videos Virales (TikTok / Reels)', share: 32, views: 15440, conversions: 834, conversionRate: 5.4, color: '#06B6D4' },
  { source: 'Google Orgánico & SEO', share: 18, views: 8685, conversions: 399, conversionRate: 4.6, color: '#8B5CF6' },
  { source: 'Afiliados Whop & Referidos', share: 9, views: 4345, conversions: 282, conversionRate: 6.5, color: '#10B981' }
];
