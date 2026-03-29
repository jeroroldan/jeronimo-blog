// Mapping from code to theme
// Add more mappings as needed
export const codeToTheme: Record<string, string> = {
  // Seducción
  seduccion: 'Seducción',
  atraccion: 'Seducción',
  'relaciones-humanas': 'Seducción',
  mindset: 'Seducción',
  // Informática
  IA: 'Informática',
  'Ingles': 'Informática', // Assuming English learning is under Informática
  programacion: 'Informática',
  software: 'Informática',
  desarrollo: 'Informática',
  react: 'Informática',
  laravel: 'Informática',
  python: 'Informática',
  javascript: 'Informática',
  typescript: 'Informática',
  html: 'Informática',
  css: 'Informática',
  n8n: 'Informática',
  figma: 'Informática',
  'ux/ui': 'Informática',
  frontend: 'Informática',
  backend: 'Informática',
  devops: 'Informática',
  // Trading
  trading: 'Trading',
  finanzas: 'Trading',
  bolsa: 'Trading',
  inversiones: 'Trading',
  crypto: 'Trading',
  // Negocios
  negocios: 'Negocios',
  empresa: 'Negocios',
  emprendimiento: 'Negocios',
  liderazgo: 'Negocios',
  ventas: 'Negocios',
  'Liderazgo y ventas': 'Negocios',
  // Superación Personal
  superacion: 'Superación Personal',
  aprendizaje: 'Superación Personal',
  crecimiento: 'Superación Personal',
  productividad: 'Superación Personal',
  gimnasio: 'Superación Personal',
  gym: 'Superación Personal',
  // Default theme for unmapped codes
  // We'll assign a default theme, but ideally every code should be mapped
};

// Get theme for a given code, returns 'Informática' as default if not found
export function getThemeFromCode(code: string | undefined): string {
  if (!code) return 'Informática'; // Default theme
  return codeToTheme[code] || 'Informática';
}

// Get all unique themes
export const themes = [...new Set(Object.values(codeToTheme))].sort();

// Mapping from theme name to URL slug
export const themeToSlug: Record<string, string> = {
  'Seducción': 'seduccion',
  'Informática': 'informatica',
  'Trading': 'trading',
  'Negocios': 'negocios',
  'Superación Personal': 'superacion'
};

// Map slug back to theme name
export const slugToTheme: Record<string, string> = {
  'seduccion': 'Seducción',
  'informatica': 'Informática',
  'trading': 'Trading',
  'negocios': 'Negocios',
  'superacion': 'Superación Personal'
};

// Get codes for a given theme
export function getCodesForTheme(theme: string): string[] {
  return Object.entries(codeToTheme)
    .filter(([, t]) => t === theme)
    .map(([code]) => code);
}