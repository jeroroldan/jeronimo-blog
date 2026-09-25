#!/usr/bin/env node
/**
 * Auditoría + normalización de guías.
 * Uso:
 *   node scripts/normalize-guides.mjs --report   # solo reporte
 *   node scripts/normalize-guides.mjs --fix      # normaliza `code` (lowercase/trim) y añade track/subtrack si faltan
 */
import fs from 'node:fs';
import path from 'node:path';

const DIR = new URL('../src/content/blog/', import.meta.url);
const args = process.argv.slice(2);
const FIX = args.includes('--fix');

const LEGACY = {
  laravel: ['desarrollo', 'backend'], react: ['desarrollo', 'frontend'],
  'react-native': ['desarrollo', 'mobile'], frontend: ['desarrollo', 'frontend'],
  backend: ['desarrollo', 'backend'], devops: ['desarrollo', 'devops'],
  software: ['desarrollo', 'fundamentos'], programacion: ['desarrollo', 'fundamentos'],
  desarrollo: ['desarrollo', 'fundamentos'], javascript: ['desarrollo', 'frontend'],
  typescript: ['desarrollo', 'frontend'], python: ['desarrollo', 'backend'],
  html: ['desarrollo', 'frontend'], css: ['desarrollo', 'frontend'],
  angular: ['desarrollo', 'frontend'], nestjs: ['desarrollo', 'backend'],
  'base de datos': ['desarrollo', 'bases-datos'], figma: ['desarrollo', 'ux-ui'],
  'ux/ui': ['desarrollo', 'ux-ui'], ia: ['ia', 'fundamentos'], ai: ['ia', 'fundamentos'],
  n8n: ['ia', 'automatizacion'], claude: ['ia', 'asistentes'],
  'ai-workflows': ['ia', 'automatizacion'], 'automatizacion-agentes': ['ia', 'agentes'],
  trading: ['trading-finanzas', 'trading'], finanzas: ['trading-finanzas', 'finanzas-personales'],
  bolsa: ['trading-finanzas', 'bolsa'], inversiones: ['trading-finanzas', 'inversion'],
  crypto: ['trading-finanzas', 'crypto'], negocios: ['negocios', 'general'],
  empresa: ['negocios', 'gestion'], emprendimiento: ['negocios', 'emprendimiento'],
  liderazgo: ['negocios', 'liderazgo'], ventas: ['negocios', 'ventas'],
  'liderazgo y ventas': ['negocios', 'ventas'], 'you-tube': ['negocios', 'marketing'],
  superacion: ['crecimiento', 'habitos'], aprendizaje: ['crecimiento', 'aprendizaje'],
  aprendizage: ['crecimiento', 'aprendizaje'], crecimiento: ['crecimiento', 'mentalidad'],
  productividad: ['crecimiento', 'productividad'], gimnasio: ['crecimiento', 'salud'],
  gym: ['crecimiento', 'salud'], 'concentracion-lectura-x10': ['crecimiento', 'foco'],
  ingles: ['ingles', 'general'], 'brain-english': ['ingles', 'fluidez'],
  seduccion: ['habilidades-sociales', 'comunicacion'], atraccion: ['habilidades-sociales', 'confianza'],
  'relaciones-humanas': ['habilidades-sociales', 'relaciones'], mindset: ['habilidades-sociales', 'mentalidad'],
};

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
const codeCounts = new Map();
let sinCode = 0, sinCat = 0, fixed = 0;

for (const file of files) {
  const fp = path.join(DIR.pathname, file);
  let raw = fs.readFileSync(fp, 'utf8');
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) { sinCode++; continue; }
  let fm = m[1];
  const codeM = fm.match(/^code:\s*["']?(.*?)["']?\s*$/m);
  const catM = fm.match(/^category:\s*["']?(.*?)["']?\s*$/m);
  const trackM = fm.match(/^track:\s*(.*)$/m);
  const code = codeM?.[1]?.trim();
  if (!code) sinCode++;
  else codeCounts.set(code, (codeCounts.get(code) ?? 0) + 1);
  if (!catM?.[1]?.trim()) sinCat++;

  if (FIX && code) {
    const clean = code.toLowerCase().trim();
    let next = fm;
    if (code !== clean) {
      next = next.replace(/^code:.*$/m, `code: "${clean}"`);
    }
    const mapped = LEGACY[clean];
    if (mapped && !trackM) {
      next = next.replace(/^code:.*$/m, (line) => `${line}\ntrack: "${mapped[0]}"\nsubtrack: "${mapped[1]}"`);
    }
    // normaliza tags a lowercase si existen
    const tagsM = next.match(/^tags:\s*\[(.*)\]/m);
    if (tagsM) {
      const lowered = tagsM[1].toLowerCase();
      next = next.replace(/^tags:\s*\[.*\]/m, `tags: [${lowered}]`);
    }
    if (next !== fm) {
      raw = raw.replace(fm, next);
      fs.writeFileSync(fp, raw);
      fixed++;
    }
  }
}

console.log(`Total: ${files.length} | sin code: ${sinCode} | sin category: ${sinCat}`);
console.log('Top codes:');
[...codeCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([k, v]) => console.log(`  ${v}x ${k}`));
const dupCase = new Map();
for (const k of codeCounts.keys()) {
  const low = k.toLowerCase();
  if (!dupCase.has(low)) dupCase.set(low, []);
  dupCase.get(low).push(k);
}
for (const [low, vars] of dupCase) {
  if (vars.length > 1) console.log(`DUP CASE: ${vars.join(' vs ')}`);
}
if (FIX) console.log(`Archivos normalizados: ${fixed}`);
