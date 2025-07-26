---
title: 'Astro Framework'
description: 'Guía Completa de Astro Framework - Desarrollo Profesional'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# 🚀 Guía Completa de Astro Framework - Desarrollo Profesional

## 📋 Índice

1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [Estructura de Proyecto Recomendada](#estructura-de-proyecto-recomendada)
3. [Patrones de Diseño](#patrones-de-diseño)
4. [Manejo de Contenido Estático](#manejo-de-contenido-estático)
5. [APIs y Endpoints](#apis-y-endpoints)
6. [Manejo de Errores](#manejo-de-errores)
7. [Proyectos Específicos](#proyectos-específicos)
8. [Optimización y Performance](#optimización-y-performance)
9. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Conceptos Fundamentales

### Islands Architecture

Astro utiliza la arquitectura de "islas" donde solo las partes interactivas se hidratan en el cliente.

```astro
---
// src/components/Counter.astro
import { useState } from 'react';

// Solo se ejecuta en el servidor por defecto
const serverMessage = "Renderizado en servidor";
---

<div>
  <h2>{serverMessage}</h2>
  <!-- Solo se hidrata si usas client:* directive -->
  <Counter client:load />
</div>

<script>
  // JavaScript del lado del cliente (se ejecuta en el browser)
  console.log('Esta isla está hidratada');
</script>
```

### Client Directives

Control preciso de cuándo hidratar componentes:

```astro
---
import InteractiveButton from './InteractiveButton.jsx';
import LazyChart from './LazyChart.jsx';
import MediaPlayer from './MediaPlayer.jsx';
---

<!-- Hidrata inmediatamente -->
<InteractiveButton client:load />

<!-- Hidrata cuando sea visible -->
<LazyChart client:visible />

<!-- Hidrata cuando hay interacción -->
<MediaPlayer client:idle />

<!-- Hidrata solo en cierto breakpoint -->
<MobileMenu client:media="(max-width: 768px)" />
```

---

## 📁 Estructura de Proyecto Recomendada

### Estructura Base Professional

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes de UI básicos
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   └── Modal.astro
│   ├── layout/          # Componentes de layout
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Sidebar.astro
│   └── features/        # Componentes específicos por feature
│       ├── blog/
│       ├── ecommerce/
│       └── landing/
├── layouts/             # Layouts base
│   ├── BaseLayout.astro
│   ├── BlogLayout.astro
│   └── ProductLayout.astro
├── pages/              # Rutas del sitio
│   ├── api/           # API endpoints
│   ├── blog/          # Blog posts
│   ├── products/      # Páginas de productos
│   └── index.astro    # Página principal
├── content/           # Contenido en formato de colecciones
│   ├── blog/
│   ├── products/
│   └── config.ts
├── styles/            # Estilos globales
│   ├── globals.css
│   └── components/
├── utils/             # Utilidades y helpers
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
├── data/              # Datos estáticos
│   └── site-config.ts
└── types/             # Tipos TypeScript
    └── index.ts
```

### Configuración del Proyecto

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://tu-sitio.com',
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    mdx()
  ],
  output: 'static', // o 'hybrid' para SSR selectivo
  adapter: undefined, // o vercel(), netlify(), etc.
  vite: {
    build: {
      rollupOptions: {
        external: ['sharp'] // Para optimización de imágenes
      }
    }
  }
});
```

---

## 🎨 Patrones de Diseño

### 1. Layout Pattern

```astro
---
// src/layouts/BaseLayout.astro
export interface Props {
  title: string;
  description?: string;
  image?: string;
}

const { title, description = "Mi sitio web", image = "/og-default.jpg" } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="canonical" href={canonicalURL} />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={Astro.url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(image, Astro.url)} />
  
  <title>{title}</title>
</head>
<body>
  <slot />
</body>
</html>
```

### 2. Component Composition Pattern

```astro
---
// src/components/ui/Card.astro
export interface Props {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  class?: string;
}

const { 
  variant = 'default', 
  padding = 'md', 
  class: className = '' 
} = Astro.props;

const baseClasses = 'rounded-lg bg-white';
const variantClasses = {
  default: '',
  bordered: 'border border-gray-200',
  elevated: 'shadow-lg'
};
const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

const cardClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;
---

<div class={cardClasses}>
  <slot />
</div>
```

### 3. Data Fetching Pattern

```astro
---
// src/components/ProductGrid.astro
import Card from './ui/Card.astro';
import { getProducts } from '../utils/api';

// Server-side data fetching
const products = await getProducts();
---

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map((product) => (
    <Card variant="bordered">
      <img src={product.image} alt={product.name} class="w-full h-48 object-cover rounded-t-lg" />
      <div class="p-4">
        <h3 class="text-lg font-semibold">{product.name}</h3>
        <p class="text-gray-600">{product.description}</p>
        <span class="text-xl font-bold text-green-600">${product.price}</span>
      </div>
    </Card>
  ))}
</div>
```

---

## 📝 Manejo de Contenido Estático

### Content Collections

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

const productCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string(),
    images: z.array(z.string()),
    featured: z.boolean().default(false),
    inStock: z.boolean().default(true),
    specifications: z.record(z.string()).optional()
  })
});

export const collections = {
  'blog': blogCollection,
  'products': productCollection
};
```

### Trabajando con Collections

```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogCard from '../../components/blog/BlogCard.astro';

// Obtener posts publicados y ordenados por fecha
const posts = await getCollection('blog', ({ data }) => {
  return !data.draft;
});

const sortedPosts = posts.sort((a, b) => 
  b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
);

const featuredPosts = posts.filter(post => post.data.featured);
---

<BaseLayout title="Blog" description="Últimos artículos del blog">
  <main class="container mx-auto px-4 py-8">
    {featuredPosts.length > 0 && (
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6">Artículos Destacados</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredPosts.map((post) => (
            <BlogCard post={post} featured />
          ))}
        </div>
      </section>
    )}
  
    <section>
      <h2 class="text-3xl font-bold mb-6">Todos los Artículos</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => (
          <BlogCard post={post} />
        ))}
      </div>
    </section>
  </main>
</BaseLayout>
```

### Dynamic Pages from Collections

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogLayout title={post.data.title} description={post.data.description}>
  <article class="prose prose-lg mx-auto">
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-4">{post.data.title}</h1>
      <div class="flex items-center gap-4 text-gray-600">
        <span>Por {post.data.author}</span>
        <span>•</span>
        <time datetime={post.data.publishDate.toISOString()}>
          {post.data.publishDate.toLocaleDateString('es-ES')}
        </time>
      </div>
      {post.data.tags && (
        <div class="flex gap-2 mt-4">
          {post.data.tags.map((tag) => (
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  
    <Content />
  </article>
</BlogLayout>
```

---

## 🔌 APIs y Endpoints

### Server-Side API Endpoints

```typescript
// src/pages/api/products.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
  
    let products = await getCollection('products');
  
    // Filtrar por categoría si se especifica
    if (category) {
      products = products.filter(product => 
        product.data.category.toLowerCase() === category.toLowerCase()
      );
    }
  
    // Limitar resultados
    products = products.slice(0, limit);
  
    // Transformar datos para la API
    const apiProducts = products.map(product => ({
      id: product.slug,
      name: product.data.name,
      description: product.data.description,
      price: product.data.price,
      category: product.data.category,
      inStock: product.data.inStock,
      image: product.data.images[0] || null
    }));
  
    return new Response(JSON.stringify(apiProducts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
  
    // Validación básica
    if (!body.name || !body.price) {
      return new Response(JSON.stringify({ 
        error: 'Nombre y precio son requeridos' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    // Aquí iría la lógica para guardar el producto
    // Por ejemplo, en una base de datos
  
    return new Response(JSON.stringify({ 
      message: 'Producto creado exitosamente',
      id: 'nuevo-producto-id'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al procesar solicitud' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### Form Handling

```astro
---
// src/pages/contact.astro
import BaseLayout from '../layouts/BaseLayout.astro';

let message = '';
let isSuccess = false;

if (Astro.request.method === 'POST') {
  try {
    const data = await Astro.request.formData();
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const messageContent = data.get('message') as string;
  
    // Validación
    if (!name || !email || !messageContent) {
      message = 'Todos los campos son requeridos';
    } else {
      // Procesar formulario (enviar email, guardar en DB, etc.)
      // await sendEmail({ name, email, message: messageContent });
    
      message = '¡Mensaje enviado exitosamente!';
      isSuccess = true;
    }
  } catch (error) {
    message = 'Error al enviar el mensaje. Intenta nuevamente.';
  }
}
---

<BaseLayout title="Contacto">
  <main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Contacto</h1>
  
    {message && (
      <div class={`p-4 rounded-lg mb-6 ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {message}
      </div>
    )}
  
    <form method="POST" class="max-w-lg">
      <div class="mb-6">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Nombre
        </label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    
      <div class="mb-6">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    
      <div class="mb-6">
        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
          Mensaje
        </label>
        <textarea 
          id="message" 
          name="message" 
          rows="5" 
          required 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
    
      <button 
        type="submit" 
        class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Enviar Mensaje
      </button>
    </form>
  </main>
</BaseLayout>
```

---

## ⚠️ Manejo de Errores

### Error Pages

```astro
---
// src/pages/404.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Página no encontrada">
  <main class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-300">404</h1>
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Página no encontrada</h2>
      <p class="text-gray-600 mb-8">Lo sentimos, la página que buscas no existe.</p>
      <a 
        href="/" 
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Volver al inicio
      </a>
    </div>
  </main>
</BaseLayout>
```

### Error Boundaries para Client Components

```typescript
// src/utils/error-handling.ts
export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown): APIError => {
  if (error instanceof APIError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new APIError(500, error.message);
  }
  
  return new APIError(500, 'Error desconocido');
};

export const withErrorHandling = async <T>(
  fn: () => Promise<T>
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    throw handleAPIError(error);
  }
};
```

---

## 🏗️ Proyectos Específicos

### Landing Page Pattern

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/landing/Hero.astro';
import Features from '../components/landing/Features.astro';
import Testimonials from '../components/landing/Testimonials.astro';
import CTA from '../components/landing/CTA.astro';

// Datos estáticos para landing
const features = [
  {
    title: "Rápido",
    description: "Rendimiento optimizado out-of-the-box",
    icon: "⚡"
  },
  {
    title: "Seguro",
    description: "Built-in security y mejores prácticas",
    icon: "🔒"
  },
  {
    title: "Escalable",
    description: "Crece con tu negocio sin complicaciones",
    icon: "📈"
  }
];

const testimonials = [
  {
    name: "Juan Pérez",
    role: "CEO, TechCorp",
    content: "Increíble experiencia, superó nuestras expectativas.",
    avatar: "/avatars/juan.jpg"
  }
];
---

<BaseLayout 
  title="Tu Solución Perfecta | LandingPro" 
  description="Descubre la mejor solución para tu negocio con nuestro producto revolucionario"
>
  <Hero />
  <Features features={features} />
  <Testimonials testimonials={testimonials} />
  <CTA />
</BaseLayout>
```

### E-commerce Pattern

```astro
---
// src/pages/shop/[category]/[...page].astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import ProductGrid from '../../../components/ecommerce/ProductGrid.astro';
import Pagination from '../../../components/ui/Pagination.astro';

export async function getStaticPaths({ paginate }) {
  const products = await getCollection('products');
  
  // Agrupar productos por categoría
  const categories = [...new Set(products.map(p => p.data.category))];
  
  return categories.flatMap(category => {
    const categoryProducts = products.filter(p => p.data.category === category);
  
    return paginate(categoryProducts, {
      params: { category: category.toLowerCase() },
      pageSize: 12
    });
  });
}

const { page } = Astro.props;
const { category } = Astro.params;
const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
---

<BaseLayout title={`${categoryName} | Tienda`}>
  <main class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">{categoryName}</h1>
      <p class="text-gray-600">
        {page.total} productos encontrados
      </p>
    </div>
  
    <ProductGrid products={page.data} />
  
    <Pagination 
      currentPage={page.currentPage}
      totalPages={page.lastPage}
      baseUrl={`/shop/${category}`}
    />
  </main>
</BaseLayout>
```

### Blog Pattern

```astro
---
// src/pages/blog/tag/[tag].astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import BlogCard from '../../../components/blog/BlogCard.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  
  // Obtener todos los tags únicos
  const allTags = posts.flatMap(post => post.data.tags);
  const uniqueTags = [...new Set(allTags)];
  
  return uniqueTags.map(tag => ({
    params: { tag },
    props: { 
      posts: posts.filter(post => post.data.tags.includes(tag)),
      tag 
    }
  }));
}

const { posts, tag } = Astro.props;
---

<BaseLayout title={`Tag: ${tag} | Blog`}>
  <main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-2">Tag: {tag}</h1>
    <p class="text-gray-600 mb-8">{posts.length} artículos encontrados</p>
  
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard post={post} />
      ))}
    </div>
  </main>
</BaseLayout>
```

---

## ⚡ Optimización y Performance

### Image Optimization

```astro
---
// src/components/OptimizedImage.astro
import { Image } from 'astro:assets';

export interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  class?: string;
}

const { 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  loading = 'lazy',
  class: className = ''
} = Astro.props;
---

<Image 
  src={src}
  alt={alt}
  width={width}
  height={height}
  loading={loading}
  class={className}
  format="webp"
  quality={80}
/>
```

### SEO Optimization

```astro
---
// src/components/SEO.astro
export interface Props {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

const {
  title,
  description,
  image = '/og-default.jpg',
  article = false,
  publishedTime,
  modifiedTime
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const socialImageURL = new URL(image, Astro.url);
---

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={article ? "article" : "website"} />
<meta property="og:url" content={Astro.url} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={socialImageURL} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={Astro.url} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={socialImageURL} />

<!-- Article specific -->
{article && publishedTime && (
  <meta property="article:published_time" content={publishedTime} />
)}
{article && modifiedTime && (
  <meta property="article:modified_time" content={modifiedTime} />
)}

<!-- JSON-LD -->
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": article ? "Article" : "WebPage",
  "headline": title,
  "description": description,
  "image": socialImageURL,
  "url": canonicalURL,
  ...(article && publishedTime && { "datePublished": publishedTime }),
  ...(article && modifiedTime && { "dateModified": modifiedTime })
})} />
```

---

## 💡 Mejores Prácticas

### 1. TypeScript Configuration

```typescript
// tsconfig.json
{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/layouts/*": ["src/layouts/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

### 2. Environment Variables

```typescript
// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly API_KEY: string;
  readonly PUBLIC_ANALYTICS_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 3. Utility Functions

```typescript
// src/utils/formatters.ts
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
```

### 4. Performance Monitoring

```astro
---
// src/components/Analytics.astro
const analyticsId = import.meta.env.PUBLIC_ANALYTICS_ID;
---

{analyticsId && (
  <>
    <!-- Google Analytics -->
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', import.meta.env.PUBLIC_ANALYTICS_ID);
    </script>
  
    <!-- Web Vitals -->
    <script>
      import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';
    
      function sendToAnalytics(metric) {
        gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }

      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    </script>
  </>
)}
```

### 5. Testing Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig(
  getViteConfig({
    test: {
      globals: true,
      environment: 'jsdom',
    },
  })
);
```

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build optimizado
npm run build

# Preview del build
npm run preview

# Verificar el bundle
npm run astro check

# Generar sitemap
npm run astro --experimental-content-collections

# Deploy a Vercel
vercel --prod

# Deploy a Netlify
netlify deploy --prod
```

---

## 📚 Recursos Adicionales

- **Documentación oficial**: [docs.astro.build](https://docs.astro.build)
- **Astro Themes**: [astro.build/themes](https://astro.build/themes)
- **Integrations**: [astro.build/integrations](https://astro.build/integrations)
- **Community Discord**: [astro.build/chat](https://astro.build/chat)

---

Esta guía te proporciona las bases sólidas para desarrollar proyectos profesionales con Astro. Recuerda que la clave está en aprovechar la arquitectura de islas para optimizar el rendimiento y mantener una estructura de proyecto limpia y escalable.
