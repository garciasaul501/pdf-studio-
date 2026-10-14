import { StorefrontSettings, Testimonial, FaqItem, VideoScene } from '../types/whop';

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
  ]
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
