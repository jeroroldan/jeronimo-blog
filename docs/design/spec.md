# Blog Platform UI/UX Redesign Specification

## 1. Overview
This document outlines the comprehensive redesign of the blog platform to organize content by major themes: **Seducción**, **Informática**, **Trading**, **Negocios**, and **Superación Personal**. The goal is to improve discoverability, reduce content overlap, and enhance user engagement through a clear information hierarchy, distinct visual styles per theme, and interactive elements.

## 2. Site Map
```
Home (/)
├── About (/about)
├── Blog (/blog)
│   ├── Seducción (/blog/seduccion)
│   ├── Informática (/blog/informatica)
│   ├── Trading (/blog/trading)
│   ├── Negocios (/blog/negocios)
│   └── Superación Personal (/blog/superacion)
│   └── All Posts (default blog listing with filters)
└── Other pages (RSS, etc.)
```
Each theme page lists all posts belonging to that theme. The default blog listing (/blog) shows all posts with filtering capabilities.

## 3. Top-Level Navigation Menu
- **Desktop**: Horizontal menu bar in header.
  - Links: Inicio, Blog (dropdown with themes), Acerca de
  - Blog dropdown: Seducción, Informática, Trading, Negocios, Superación Personal, Todas las publicaciones
- **Mobile/Tablet**: Hamburger menu that expands to vertical list of the same links.
- Active link highlighted with theme-specific accent color (see Design System).

## 4. Layout & Responsiveness
- **Base Layout**: Centered content container with max-width 960px (desktop), fluid padding on sides.
- **Breakpoints**:
  - Desktop: ≥1024px
  - Tablet: 768px - 1023px
  - Mobile: ≤767px
- **Grid System**:
  - Desktop: 2-column layout for post listings (featured post full width, then two columns)
  - Tablet: 1-column listing with optional sidebar for filters
  - Mobile: 1-column full width
- **Responsive Images**: Use Astro Image component with appropriate widths.
- **Touch Targets**: Minimum 44x44px for interactive elements on mobile.

## 5. Design System
Each theme has a distinct visual style while maintaining brand consistency through shared typography, spacing, and component styles.

### 5.1 Color Palettes
| Theme | Primary | Secondary | Background | Accent (Hover/Active) |
|-------|---------|-----------|------------|-----------------------|
| Seducción | #E91E63 (Pink) | #F8BBD0 | #FFF0F5 | #C2185B |
| Informática | #2196F3 (Blue) | #BBDEFB | #E3F2FD | #1565C0 |
| Trading | #4CAF50 (Green) | #C8E6C9 | #E8F5E9 | #2E7D32 |
| Negocios | #FF9800 (Orange) | #FFE0B2 | #FFF3E0 | #EF6C00 |
| Superación Personal | #9C27B0 (Purple) | #E1BEE7 | #F3E5F5 | #6A1B9A |

Shared neutrals:
- Text: #212121 (dark), #757575 (medium), #FFFFFF (white on dark)
- Background: #FFFFFF (light), #121212 (dark mode)
- Borders/Dividers: #E0E0E0

### 5.2 Typography
- **Primary Font**: Inter (sans-serif) for headings and body.
- **Secondary Font**: Roboto Mono (monospace) for code snippets.
- **Hierarchy**:
  - H1: 2.5rem (40px), Bold
  - H2: 2rem (32px), SemiBold
  - H3: 1.75rem (28px), SemiBold
  - H4: 1.5rem (24px), Medium
  - Body: 1rem (16px), Regular
  - Caption: 0.875rem (14px), Regular
- **Line Height**: 1.6 for body, 1.2 for headings.
- **Letter Spacing**: -0.5px for headings, normal for body.

### 5.3 Iconography
- Use a consistent icon set (e.g., Heroicons or Font Awesome) with theme-specific color overrides.
- Icons for navigation: home, bookmark (blog), user (about), moon/sun (dark mode).
- Category icons: Seducción (heart), Informática (laptop), Trading (chart-line), Negocios (briefcase), Superación Personal (star).

## 6. Components
### 6.1 Header
- Logo/site title on left.
- Navigation links on right (desktop) or hidden behind hamburger (mobile).
- Dark mode toggle (sun/moon) on far right.
- Sticky on scroll (optional).

### 6.2 Footer
- Copyright text.
- Social media links (icons).
- Small navigation links (privacy, terms).

### 6.3 SearchBox
- Input field with search icon.
- Placeholder: "Buscar publicaciones..."
- Visible in blog listing pages.
- Enhanced with debounced search and autocomplete (future).

### 6.4 Post Card
- Used in listings and theme pages.
- Elements:
  - Hero image (top, rounded corners)
  - Category badge (top-left, theme-specific background, white text)
  - Title (h2)
  - Excerpt (optional, first 2 lines or meta description)
  - Date (small, muted)
  - Tags (optional, small pills)
- Hover effect: slight elevation, accent color on title/link.
- Mobile: full-width card, image width 100%.

### 6.5 Filter Bar
- Horizontal wrap of filter buttons.
- "Todos" button active by default.
- Each button: outline with theme color, text.
- Active state: filled background with theme color, white text.
- On mobile: vertical stack or scrollable horizontal.

### 6.6 Pagination
- Centered navigation: Previous, Page X of Y, Next.
- Disabled states for first/last page.
- Hover/active: theme accent background, white text.

### 6.7 Modal Preview
- Triggered by clicking on a post card (or a preview button).
- Displays: featured image, title, excerpt, metadata (date, tags), CTA button to read full post.
- Backdrop click or ESC to close.
- Animation: fade-in/scale-up.

### 6.8 Accordion List
- Used for FAQ or detailed table of contents within long posts.
- Header: theme accent background on hover, icon indicating expand/collapse.
- Content: padded, border-top.

## 7. Interactive Elements
- **Hover States**: Post cards, filters, pagination links, buttons.
- **Focus Styles**: Outline-2 offset-2 in theme accent color for accessibility.
- **Dark Mode Toggle**: Smooth transition, sun/moon icons.
- **Scroll-to-Top Button**: Appears after 300px scroll, bottom-right.
- **Modal Previews**: As described.
- **Accordion Smooth Expansion**.

## 8. Search & Filter System
- **Current Filtering**: By `code` (existing) via JavaScript.
- **Enhanced Filtering**:
  - Add `theme` field to each post (derived from code mapping or frontmatter).
  - Faceted search: filter by theme, then by code within theme.
  - Search box: full-text search across title, description, content (using Astro's content collection filtering).
- **URL Parameters**: 
  - Theme: `/blog?theme=seduccion`
  - Code: `/blog?code=trading`
  - Search: `/blog?q=javascript`
  - Combine: `/blog?theme=trading&code=docvb`
- **Server-Side Rendering**: Filters applied in `getStaticPaths` or `getCollection` for SEO.

## 9. SEO Best Practices
- **Clean URLs**: 
  - Theme: `/blog/seduccion/`
  - Post: `/blog/seduccion/titulo-del-post/` (or keep existing `/blog/[slug]/` with redirect)
  - Implement redirects from old to new if needed.
- **Meta Tags**: 
  - Title: `{Post Title} | {Theme} | Jero's Blog`
  - Description: Use `description` frontmatter or auto-generated excerpt.
  - Open Graph: `og:title`, `og:description`, `og:image` (heroImage).
  - Twitter Card: similar.
- **Schema Markup**: 
  - BlogPosting schema for each post.
  - BreadcrumbList: Home > Theme > Post.
- **Heading Hierarchy**: H1 for page title, H2 for section titles, H3+ for subsections.
- **Image Optimization**: Use Astro Image component with format, width, quality.
- **Internal Linking**: Related posts section at end of each post (same theme).
- **Sitemap**: Already integrated via `@astrojs/sitemap`.

## 10. Accessibility Considerations
- **Color Contrast**: Ensure WCAG AA compliance for text/background.
- **Keyboard Navigation**: All interactive elements accessible via Tab.
- **ARIA Labels**: 
  - Search box: `label="Buscar publicaciones"`
  - Filter buttons: `aria-pressed="true/false"`
  - Navigation: `aria-label="Menú principal"`
  - Modal: `role="dialog"`, `aria-modal="true"`
- **Focus Visible**: Custom focus outlines.
- **Skip to Main Content**: Link at top of page.
- **Language Attributes**: `lang="es"` on html.

## 11. Technical Implementation Notes (Astro)
- **Content Collection**: Add `theme` field to blog schema in `content.config.ts` (optional, can compute from code).
- **Mapping File**: Create `src/lib/themeMapping.ts` that maps codes to themes.
- **Theme Pages**: Create `src/pages/blog/[theme].astro` that fetches posts by theme.
- **Blog Index**: Update `src/pages/blog/[...page].astro` to accept theme/query params and filter accordingly.
- **Components**: Reuse existing components (Header, Footer, etc.) with theme props for colors.
- **CSS**: Use CSS variables for theme colors; set `--theme-primary`, `--theme-secondary`, etc. on root or container.
- **Dark Mode**: Keep existing implementation; theme colors adapt via CSS variables.

## 12. Wireframe Descriptions
### 12.1 Home Page (Desktop)
- Header with logo, nav (Inicio, Blog▼, Acerca de), dark mode toggle.
- Hero section: optional featured post or welcome message.
- Section: "Últimas publicaciones por tema" with 5 cards (one per theme) in a row.
- Section: "Todas las categorías" with links to each theme page.
- Footer.

### 12.2 Theme Listing Page (e.g., /blog/seduccion) (Desktop)
- Header.
- Page title: "Seducción" with icon and brief description.
- Filter bar: buttons for each code under Seducción (if many, show top 5 + "Ver todos").
- Post grid: 2-column cards (featured first full width, then two columns).
- Pagination at bottom.
- Sidebar (optional on wide desktop): popular posts, newsletter signup.
- Footer.

### 12.3 Mobile View
- Header: hamburger menu icon, logo, dark mode toggle.
- Tap hamburger to slide out menu with same links.
- Theme listing: single column cards, full width.
- Filter bar becomes vertical list or scrollable horizontal.
- Search box expands to full width when tapped.

### 12.4 Post Detail Page
- Header.
- Hero image full width.
- Title (h1), date, category badge.
- Prose content with stylized headings, blockquotes, code.
- Related posts section (same theme) at bottom.
- Footer.

## 13. High-Fidelity Mockup Notes
- Mockups should be created in Figma or similar tool.
- Use the defined color palettes, typography, and spacing.
- Include states: default, hover, focus, active, dark mode.
- Show both desktop and mobile breakpoints for each template.
- Provide asset exports (icons, images) and CSS variables file.

## 14. Prototype Delivery
- **Design Specification**: This document.
- **Wireframes**: Low-fidelity sketches (can be described in this doc or separate files).
- **Mockups**: High-fidelity PNG/JPEG or Figma link.
- **Style Guide**: PDF or web page showing colors, typography, components.
- **Component Library**: HTML/CSS snippets for key components (Header, Post Card, Filter, Modal).
- **Implementation Guide**: Steps for developer to integrate into Astro project (files to create/modify).

## 15. Next Steps
1. Approve site map and navigation.
2. Finalize theme-color mappings.
3. Create wireframes for each template.
4. Design high-fidelity mockups.
5. Develop style guide and component specifications.
6. Hand off to development team with this spec and assets.

---
*Prepared for: Blog Platform Redesign*
*Date: 2026-03-29*