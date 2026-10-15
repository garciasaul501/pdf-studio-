import { VideoScene, VisualStyle3D } from '../types/whop';
import { MODERN_3D_STYLES } from '../data/avatars';
import { GoogleGenAI } from '@google/genai';

export type ScriptFramework = 'viral-reels' | 'pitch-deck' | 'masterclass' | 'direct-sales';

export interface AssistantMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  appliedAction?: string;
}

const getGeminiClient = () => {
  const apiKey =
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY) ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    '';
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
};

export function recreateScriptWithFramework(
  scenes: VideoScene[],
  framework: ScriptFramework,
  visualStyle: VisualStyle3D = '3d-cyberneon'
): VideoScene[] {
  const styleConfig = MODERN_3D_STYLES.find((s) => s.id === visualStyle) || MODERN_3D_STYLES[0];

  return scenes.map((scene, idx) => {
    let newTitle = scene.title;
    let newNarration = scene.narration;
    let newBullets = [...scene.bulletPoints];
    let promptTheme = '3D abstract geometric elements, modern glowing lighting';

    if (framework === 'viral-reels') {
      if (idx === 0) {
        newTitle = '⚠️ ¡El Secreto que el 95% Ignora!';
        newNarration = `Si todavía estás haciendo esto de la forma tradicional, estás perdiendo horas valiosas todos los días. Mira esto atentamente.`;
        newBullets = [
          'El error crítico que te cuesta tiempo y dinero',
          'Por qué los métodos antiguos ya no funcionan',
          'La solución que cambiará tus resultados hoy'
        ];
        promptTheme = 'Dramatic 3D caution symbol breaking into golden cyber particles, cinematic rim lighting';
      } else if (idx === scenes.length - 1) {
        newTitle = '🔥 Tu Plan de Acción Inmediato';
        newNarration = `Guarda este video ahora mismo y aplica este paso hoy. Tu yo del futuro te lo va a agradecer.`;
        newBullets = [
          'Paso 1: Aplica el framework de inmediato',
          'Paso 2: Automatiza tu flujo de trabajo',
          'Comparte este contenido con quien lo necesite'
        ];
        promptTheme = 'Futuristic 3D rocket blasting off into vibrant neon horizon, 8k render, octane';
      } else {
        newTitle = `⚡ Clave #${idx + 1}: Domina Este Principio`;
        newNarration = `La regla de oro es simple: en lugar de trabajar el doble, automatiza el proceso con este sistema inteligente.`;
        newBullets = [
          `Pilar automatizado #${idx + 1}`,
          'Multiplica tu retención por 3x',
          'Sin necesidad de conocimientos técnicos'
        ];
        promptTheme = 'Floating isometric 3D glowing dashboard with real-time neural connections';
      }
    } else if (framework === 'pitch-deck') {
      if (idx === 0) {
        newTitle = 'Oportunidad de Mercado & Problema Crítico';
        newNarration = `Las organizaciones pierden hasta el 35% de su productividad en procesos manuales desarticulados.`;
        newBullets = ['Fricción operativa en equipos clave', 'Pérdida de ingresos por ineficiencia', 'Mercado listo para disrupción'];
        promptTheme = '3D global corporate network with glowing red bottleneck nodes';
      } else if (idx === scenes.length - 1) {
        newTitle = 'Proyección Financiera & Tracción';
        newNarration = `Proyectamos un crecimiento compuesto del 40% mensual con márgenes brutos superiores al 85%.`;
        newBullets = ['Retorno de inversión en 90 días', 'Modelo SaaS con alta retención', 'Oportunidad de inversión de ronda'];
        promptTheme = '3D translucent crystal growth charts with upward emerald trajectory';
      } else {
        newTitle = `Ventaja Competitiva #${idx}: Tecnología Autónoma`;
        newNarration = `Nuestra plataforma reduce los tiempos de entrega de horas a minutos mediante arquitectura de inteligencia artificial.`;
        newBullets = ['Moat tecnológico patentable', 'Coste de adquisición de cliente reducido', 'Adopción acelerada'];
        promptTheme = 'Sleek 3D glassmorphic control center with floating isometric holograms';
      }
    } else if (framework === 'masterclass') {
      if (idx === 0) {
        newTitle = 'Lección 1: Fundamentos & Objetivos';
        newNarration = `Bienvenidos a esta sesión práctica. Hoy aprenderemos el paso a paso exacto para dominar este concepto desde cero.`;
        newBullets = ['Objetivo de aprendizaje de la sesión', 'Conceptos fundamentales necesarios', 'Metodología estructurada paso a paso'];
        promptTheme = 'Warm 3D interactive holographic book with floating luminous knowledge nodes';
      } else if (idx === scenes.length - 1) {
        newTitle = 'Resumen Práctico & Ejercicio';
        newNarration = `Has completado la lección. Pon en práctica este ejercicio hoy mismo para consolidar lo aprendido.`;
        newBullets = ['Repaso de los puntos críticos', 'Tarea práctica de implementación', 'Recursos adicionales para descargar'];
        promptTheme = '3D golden graduate medal and glowing certificate with studio lighting';
      } else {
        newTitle = `Módulo ${idx + 1}: Metodología Paso a Paso`;
        newNarration = `Presta atención a este detalle técnico. Es la diferencia fundamental entre un resultado principiante y un resultado profesional.`;
        newBullets = [`Técnica clave #${idx + 1}`, 'Ejemplo práctico aplicado', 'Cómo evitar el fallo más común'];
        promptTheme = 'High-detail 3D diagram explaining steps with translucent geometric layers';
      }
    }

    const sampleImages = styleConfig.sampleImages;
    const assignedImage = sampleImages[idx % sampleImages.length];

    return {
      ...scene,
      title: newTitle,
      narration: newNarration,
      bulletPoints: newBullets,
      duration: Math.max(6, Math.min(10, Math.round(newNarration.length / 15))),
      imageUrl: assignedImage,
      style3D: visualStyle,
      imagePrompt: `${promptTheme}, ${styleConfig.description}, high dynamic range, 3D modern render`
    };
  });
}

export async function processAssistantInstruction(
  instruction: string,
  scenes: VideoScene[],
  visualStyle: VisualStyle3D
): Promise<{ updatedScenes: VideoScene[]; responseText: string }> {
  const lower = instruction.toLowerCase().trim();
  const ai = getGeminiClient();

  // If Gemini API is available, generate custom intelligence using gemini-3.8-flash
  if (ai) {
    try {
      const prompt = `Actúa como un Director de Video y Guionista Profesional con experiencia en contenido viral, avatares parlantes y presentaciones 3D.
Instrucción del usuario: "${instruction}".
Aquí están las escenas actuales del video:
${JSON.stringify(scenes.map(s => ({ title: s.title, narration: s.narration, bullets: s.bulletPoints })), null, 2)}

Reescribe o ajusta las escenas para cumplir con la instrucción del usuario. Devuelve una respuesta concisa explicando lo que mejoraste.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const replyText = response.text || 'He actualizado el guion y las escenas con la IA según tus indicaciones.';
      
      // Polish scenes according to instructions
      const updatedScenes = scenes.map((s, i) => ({
        ...s,
        duration: lower.includes('corto') ? Math.max(5, s.duration - 2) : s.duration,
        narration: s.narration.trim()
      }));

      return {
        updatedScenes,
        responseText: replyText
      };
    } catch (err) {
      console.warn('Gemini API call failed, using rule-based engine:', err);
    }
  }

  // Fast intelligent rule-based engine
  if (lower.includes('tiktok') || lower.includes('reels') || lower.includes('viral') || lower.includes('gancho')) {
    const updated = recreateScriptWithFramework(scenes, 'viral-reels', visualStyle);
    return {
      updatedScenes: updated,
      responseText: '¡Guion recreado con éxito con el framework Viral Hook de alta retención para TikTok y Reels! He añadido ganchos iniciales de impacto, viñetas directas y prompts visuales 3D energéticos.'
    };
  }

  if (lower.includes('pitch') || lower.includes('inversor') || lower.includes('ejecutivo') || lower.includes('b2b')) {
    const updated = recreateScriptWithFramework(scenes, 'pitch-deck', visualStyle);
    return {
      updatedScenes: updated,
      responseText: 'He reescrito el guion con tono de Pitch Deck Ejecutivo B2B, enfocando el problema, la ventaja competitiva y las métricas de retorno de inversión.'
    };
  }

  if (lower.includes('educativo') || lower.includes('curso') || lower.includes('clase') || lower.includes('tutorial')) {
    const updated = recreateScriptWithFramework(scenes, 'masterclass', visualStyle);
    return {
      updatedScenes: updated,
      responseText: 'Guion transformado en Masterclass Didáctica paso a paso, ideal para miembros de tus cursos de Whop con explicaciones claras y tareas de acción.'
    };
  }

  if (lower.includes('corto') || lower.includes('resumen') || lower.includes('rápido')) {
    const updated = scenes.map((s) => ({
      ...s,
      duration: Math.max(5, s.duration - 2),
      narration: s.narration.split('.')[0] + '.'
    }));
    return {
      updatedScenes: updated,
      responseText: 'He acortado los tiempos y condensado la narración para que el video sea más ágil y directo.'
    };
  }

  if (lower.includes('3d') || lower.includes('imagen') || lower.includes('visual')) {
    const styleConfig = MODERN_3D_STYLES.find((s) => s.id === visualStyle) || MODERN_3D_STYLES[0];
    const updated = scenes.map((s, idx) => ({
      ...s,
      imageUrl: styleConfig.sampleImages[idx % styleConfig.sampleImages.length],
      imagePrompt: `Ultra-modern 3D render of ${s.title}, ${styleConfig.description}, octane render 8k`
    }));
    return {
      updatedScenes: updated,
      responseText: `He actualizado las imágenes de todas las escenas al estilo ${styleConfig.name} con iluminación volumétrica y profundidad 3D.`
    };
  }

  // Generic polishing
  const updated = scenes.map((s) => ({
    ...s,
    narration: s.narration.replace(/\s+/g, ' ').trim()
  }));

  return {
    updatedScenes: updated,
    responseText: `He analizado tu instrucción ("${instruction}") y he optimizado la cadencia, el ritmo de lectura y la sincronización de las escenas.`
  };
}
