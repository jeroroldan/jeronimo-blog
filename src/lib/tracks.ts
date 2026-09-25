/**
 * Taxonomía canónica de guías — fuente única de verdad.
 * Normaliza los 100+ `code` legacy a 7 tracks + subtracks.
 */

export interface Track {
  slug: string;
  title: string;
  short: string;
  description: string;
  color: string;
  icon: string;
}

export const TRACKS: Track[] = [
  {
    slug: 'desarrollo',
    title: 'Desarrollo & Ingeniería',
    short: 'Desarrollo',
    description: 'Frontend, backend, DevOps, mobile y bases de datos. Guías prácticas para construir software escalable.',
    color: '#0ea5e9',
    icon: '💻',
  },
  {
    slug: 'ia',
    title: 'Inteligencia Artificial',
    short: 'IA',
    description: 'LLMs, RAG, agentes, AI Engineering y automatización con n8n, Claude y OpenAI.',
    color: '#8b5cf6',
    icon: '🤖',
  },
  {
    slug: 'trading-finanzas',
    title: 'Trading & Finanzas',
    short: 'Trading',
    description: 'Trading, bolsa, crypto y finanzas personales con gestión de riesgo profesional.',
    color: '#10b981',
    icon: '📈',
  },
  {
    slug: 'negocios',
    title: 'Negocios & Empresa',
    short: 'Negocios',
    description: 'Emprendimiento, liderazgo, ventas, marketing y gestión empresarial.',
    color: '#f59e0b',
    icon: '💼',
  },
  {
    slug: 'crecimiento',
    title: 'Crecimiento Personal',
    short: 'Crecimiento',
    description: 'Productividad, aprendizaje, disciplina, hábitos y foco profundo.',
    color: '#ec4899',
    icon: '🚀',
  },
  {
    slug: 'ingles',
    title: 'Inglés',
    short: 'Inglés',
    description: 'Grammar, speaking, vocabulario técnico y comunicación profesional.',
    color: '#6366f1',
    icon: '🇬🇧',
  },
  {
    slug: 'habilidades-sociales',
    title: 'Habilidades Sociales',
    short: 'Social',
    description: 'Comunicación, carisma, confianza y relaciones auténticas.',
    color: '#f43f5e',
    icon: '🤝',
  },
];

export const TRACK_SLUGS = TRACKS.map((t) => t.slug);

export function getTrack(slug: string | undefined): Track | undefined {
  if (!slug) return undefined;
  return TRACKS.find((t) => t.slug === slug.toLowerCase());
}

/**
 * Mapa legacy `code` (lowercase, trim) -> { track, subtrack }.
 * Cubre los top codes detectados en la auditoría (592 posts).
 */
const LEGACY_CODE_MAP: Record<string, { track: string; subtrack: string }> = {
  // Desarrollo
  laravel: { track: 'desarrollo', subtrack: 'backend' },
  react: { track: 'desarrollo', subtrack: 'frontend' },
  'react-native': { track: 'desarrollo', subtrack: 'mobile' },
  frontend: { track: 'desarrollo', subtrack: 'frontend' },
  backend: { track: 'desarrollo', subtrack: 'backend' },
  devops: { track: 'desarrollo', subtrack: 'devops' },
  software: { track: 'desarrollo', subtrack: 'fundamentos' },
  programacion: { track: 'desarrollo', subtrack: 'fundamentos' },
  desarrollo: { track: 'desarrollo', subtrack: 'fundamentos' },
  javascript: { track: 'desarrollo', subtrack: 'frontend' },
  typescript: { track: 'desarrollo', subtrack: 'frontend' },
  python: { track: 'desarrollo', subtrack: 'backend' },
  html: { track: 'desarrollo', subtrack: 'frontend' },
  css: { track: 'desarrollo', subtrack: 'frontend' },
  angular: { track: 'desarrollo', subtrack: 'frontend' },
  nestjs: { track: 'desarrollo', subtrack: 'backend' },
  'base de datos': { track: 'desarrollo', subtrack: 'bases-datos' },
  figma: { track: 'desarrollo', subtrack: 'ux-ui' },
  'ux/ui': { track: 'desarrollo', subtrack: 'ux-ui' },
  // IA
  ia: { track: 'ia', subtrack: 'fundamentos' },
  ai: { track: 'ia', subtrack: 'fundamentos' },
  n8n: { track: 'ia', subtrack: 'automatizacion' },
  claude: { track: 'ia', subtrack: 'asistentes' },
  'ai-workflows': { track: 'ia', subtrack: 'automatizacion' },
  'automatizacion-agentes': { track: 'ia', subtrack: 'agentes' },
  // Trading / Finanzas
  trading: { track: 'trading-finanzas', subtrack: 'trading' },
  finanzas: { track: 'trading-finanzas', subtrack: 'finanzas-personales' },
  bolsa: { track: 'trading-finanzas', subtrack: 'bolsa' },
  inversiones: { track: 'trading-finanzas', subtrack: 'inversion' },
  crypto: { track: 'trading-finanzas', subtrack: 'crypto' },
  // Negocios
  negocios: { track: 'negocios', subtrack: 'general' },
  empresa: { track: 'negocios', subtrack: 'gestion' },
  emprendimiento: { track: 'negocios', subtrack: 'emprendimiento' },
  liderazgo: { track: 'negocios', subtrack: 'liderazgo' },
  ventas: { track: 'negocios', subtrack: 'ventas' },
  'liderazgo y ventas': { track: 'negocios', subtrack: 'ventas' },
  'you-tube': { track: 'negocios', subtrack: 'marketing' },
  // Crecimiento
  superacion: { track: 'crecimiento', subtrack: 'habitos' },
  aprendizaje: { track: 'crecimiento', subtrack: 'aprendizaje' },
  aprendizage: { track: 'crecimiento', subtrack: 'aprendizaje' },
  crecimiento: { track: 'crecimiento', subtrack: 'mentalidad' },
  productividad: { track: 'crecimiento', subtrack: 'productividad' },
  gimnasio: { track: 'crecimiento', subtrack: 'salud' },
  gym: { track: 'crecimiento', subtrack: 'salud' },
  'concentracion-lectura-x10': { track: 'crecimiento', subtrack: 'foco' },
  // Inglés
  ingles: { track: 'ingles', subtrack: 'general' },
  'brain-english': { track: 'ingles', subtrack: 'fluidez' },
  // Habilidades sociales (renombre profesional de seduccion/atraccion)
  seduccion: { track: 'habilidades-sociales', subtrack: 'comunicacion' },
  atraccion: { track: 'habilidades-sociales', subtrack: 'confianza' },
  'relaciones-humanas': { track: 'habilidades-sociales', subtrack: 'relaciones' },
  mindset: { track: 'habilidades-sociales', subtrack: 'mentalidad' },
};

export function normalizeCode(code: string | undefined): string | undefined {
  if (!code) return undefined;
  const clean = code.trim().toLowerCase();
  return clean || undefined;
}

export function getTrackFromCode(code: string | undefined): Track {
  const clean = normalizeCode(code);
  const fallback = TRACKS[0];
  if (!clean) return fallback;
  const mapped = LEGACY_CODE_MAP[clean];
  if (mapped) return getTrack(mapped.track) ?? fallback;
  // Heurística: si el code contiene una palabra clave, mapear por includes
  if (clean.includes('trad')) return getTrack('trading-finanzas')!;
  if (clean.includes('ingl') || clean.includes('english') || clean.includes('speak'))
    return getTrack('ingles')!;
  if (clean.includes('seduc') || clean.includes('atrac') || clean.includes('carisma'))
    return getTrack('habilidades-sociales')!;
  if (clean.includes('negoc') || clean.includes('emprend') || clean.includes('venta') || clean.includes('lider'))
    return getTrack('negocios')!;
  if (clean.includes('habit') || clean.includes('disciplin') || clean.includes('product') || clean.includes('aprend'))
    return getTrack('crecimiento')!;
  if (clean.includes('ia') || clean.includes('llm') || clean.includes('rag') || clean.includes('agent') || clean.includes('n8n') || clean.includes('claude') || clean.includes('prompt'))
    return getTrack('ia')!;
  return fallback;
}

export function getSubtrackFromCode(code: string | undefined): string {
  const clean = normalizeCode(code);
  if (clean && LEGACY_CODE_MAP[clean]) return LEGACY_CODE_MAP[clean].subtrack;
  return 'general';
}

/** Category legacy -> track (para posts sin code pero con category). */
export function getTrackFromCategory(category: string | undefined): Track | undefined {
  if (!category) return undefined;
  const c = category.trim().toLowerCase();
  if (!c) return undefined;
  if (c.includes('trad') || c.includes('finanza') || c.includes('bolsa') || c.includes('crypto'))
    return getTrack('trading-finanzas');
  if (c.includes('ingle') || c.includes('idioma')) return getTrack('ingles');
  if (c.includes('negoc') || c.includes('emprend') || c.includes('empresa') || c.includes('lider') || c.includes('venta'))
    return getTrack('negocios');
  if (c.includes('product') || c.includes('aprend') || c.includes('habit') || c.includes('disciplin') || c.includes('psico') || c.includes('desarrollo-personal'))
    return getTrack('crecimiento');
  if (c.includes('ia') || c.includes('tecnolog') || c.includes('program') || c.includes('inform') || c.includes('backend') || c.includes('frontend') || c.includes('devops'))
    return getTrack('desarrollo');
  return undefined;
}

/** Resolución final: frontmatter explícito > code legacy > category > default. */
export function resolveTrack(data: {
  track?: string;
  code?: string;
  category?: string;
}): Track {
  if (data.track && getTrack(data.track)) return getTrack(data.track)!;
  if (data.code) {
    const t = getTrackFromCode(data.code);
    // Si el code mapea al fallback por defecto pero hay category útil, preferir category
    const fromCat = getTrackFromCategory(data.category);
    if (t.slug === 'desarrollo' && !LEGACY_CODE_MAP[normalizeCode(data.code) ?? ''] && fromCat) {
      return fromCat;
    }
    return t;
  }
  const fromCat = getTrackFromCategory(data.category);
  if (fromCat) return fromCat;
  return TRACKS[0];
}
