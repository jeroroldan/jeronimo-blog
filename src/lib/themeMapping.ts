// LEGACY COMPAT: este archivo se mantiene para no romper imports existentes.
// La fuente canónica es ahora `src/lib/tracks.ts` (7 tracks).
// getThemeFromCode sigue funcionando pero normaliza case y delega a tracks.
import { getTrackFromCode, TRACKS } from './tracks';

export const codeToTheme: Record<string, string> = {
  seduccion: 'Habilidades Sociales',
  atraccion: 'Habilidades Sociales',
  'relaciones-humanas': 'Habilidades Sociales',
  mindset: 'Habilidades Sociales',
  Ingles: 'Inglés',
  ingles: 'Inglés',
  'brain-english': 'Inglés',
  IA: 'Inteligencia Artificial',
  programacion: 'Desarrollo & Ingeniería',
  software: 'Desarrollo & Ingeniería',
  desarrollo: 'Desarrollo & Ingeniería',
  react: 'Desarrollo & Ingeniería',
  laravel: 'Desarrollo & Ingeniería',
  python: 'Desarrollo & Ingeniería',
  javascript: 'Desarrollo & Ingeniería',
  typescript: 'Desarrollo & Ingeniería',
  html: 'Desarrollo & Ingeniería',
  css: 'Desarrollo & Ingeniería',
  n8n: 'Inteligencia Artificial',
  figma: 'Desarrollo & Ingeniería',
  'ux/ui': 'Desarrollo & Ingeniería',
  frontend: 'Desarrollo & Ingeniería',
  backend: 'Desarrollo & Ingeniería',
  devops: 'Desarrollo & Ingeniería',
  trading: 'Trading & Finanzas',
  finanzas: 'Trading & Finanzas',
  bolsa: 'Trading & Finanzas',
  inversiones: 'Trading & Finanzas',
  crypto: 'Trading & Finanzas',
  negocios: 'Negocios & Empresa',
  empresa: 'Negocios & Empresa',
  emprendimiento: 'Negocios & Empresa',
  liderazgo: 'Negocios & Empresa',
  ventas: 'Negocios & Empresa',
  'Liderazgo y ventas': 'Negocios & Empresa',
  superacion: 'Crecimiento Personal',
  aprendizaje: 'Crecimiento Personal',
  crecimiento: 'Crecimiento Personal',
  productividad: 'Crecimiento Personal',
  gimnasio: 'Crecimiento Personal',
  gym: 'Crecimiento Personal',
};

export function getThemeFromCode(code: string | undefined): string {
  if (!code) return 'Desarrollo & Ingeniería';
  // Normaliza case antes de buscar (fix Figma/figma, IA/ia, Devops/devops)
  const clean = code.trim().toLowerCase();
  const hit = Object.entries(codeToTheme).find(([k]) => k.toLowerCase() === clean);
  if (hit) return hit[1];
  return getTrackFromCode(code).title;
}

// Temas canónicos (derivan de tracks para no duplicar)
export const themes = TRACKS.map((t) => t.title).sort();

export const themeToSlug: Record<string, string> = {
  'Habilidades Sociales': 'habilidades-sociales',
  'Desarrollo & Ingeniería': 'desarrollo',
  'Trading & Finanzas': 'trading-finanzas',
  'Negocios & Empresa': 'negocios',
  'Crecimiento Personal': 'crecimiento',
  'Inglés': 'ingles',
  'Inteligencia Artificial': 'ia',
  // Aliases legacy
  'Seducción': 'habilidades-sociales',
  'Informática': 'desarrollo',
  'Trading': 'trading-finanzas',
  'Negocios': 'negocios',
  'Superación Personal': 'crecimiento',
};

export const slugToTheme: Record<string, string> = {
  'habilidades-sociales': 'Habilidades Sociales',
  'desarrollo': 'Desarrollo & Ingeniería',
  'trading-finanzas': 'Trading & Finanzas',
  'negocios': 'Negocios & Empresa',
  'crecimiento': 'Crecimiento Personal',
  'ingles': 'Inglés',
  'ia': 'Inteligencia Artificial',
  // Aliases legacy
  'seduccion': 'Habilidades Sociales',
  'informatica': 'Desarrollo & Ingeniería',
  'trading': 'Trading & Finanzas',
  'superacion': 'Crecimiento Personal',
};

export function getCodesForTheme(theme: string): string[] {
  return Object.entries(codeToTheme)
    .filter(([, t]) => t === theme)
    .map(([code]) => code);
}
