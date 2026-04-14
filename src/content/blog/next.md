---
title: 'Masterclass: Arquitectura Next.js con Server Components'
code: 'React'
description: 'El Arte de Construir Aplicaciones Web Modernas y Escalables*'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# Masterclass: Arquitectura Next.js con Server Components
## *El Arte de Construir Aplicaciones Web Modernas y Escalables*

---

## 🎯 La Revolución de Server Components

### ¿Por Qué Server Components Cambia Todo?

**Analogía del Restaurante Híbrido:** Imagina un restaurante donde algunos platos se preparan en la cocina (server) y se sirven listos, mientras otros se preparan en tu mesa (client). Server Components es exactamente eso - el mejor de ambos mundos.

**Beneficios Revolucionarios:**
- **Zero Bundle Size** para componentes server
- **Direct Database Access** sin APIs intermedias
- **Automatic Code Splitting** a nivel de componente
- **Better SEO** y Core Web Vitals
- **Streaming** y loading states granulares

### El Cambio de Paradigma

```
ANTES (Client-Side):
Browser → API Route → Database → API Response → Browser Render

DESPUÉS (Server Components):
Browser → Server Component → Database → Pre-rendered HTML → Browser
```

---

## 🏗️ PARTE 1: Arquitectura Fundamental

### 1.1 Estructura de Directorios Enterprise

```
my-nextjs-app/
├── app/                          # App Router (Next.js 13+)
│   ├── (auth)/                   # Route Groups
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── analytics/
│   │   │   ├── @modal/           # Parallel Routes
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── users/
│   │   └── products/
│   ├── globals.css
│   ├── layout.tsx                # Root Layout
│   ├── loading.tsx               # Global Loading
│   ├── error.tsx                 # Global Error
│   ├── not-found.tsx            # 404 Page
│   └── page.tsx                 # Home Page
├── components/                   # Shared Components
│   ├── ui/                      # Base UI Components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── modal.tsx
│   ├── features/                # Feature-specific Components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── products/
│   └── layouts/                 # Layout Components
├── lib/                         # Utilities & Config
│   ├── auth.ts
│   ├── database.ts
│   ├── utils.ts
│   └── validations.ts
├── hooks/                       # Custom Hooks
├── store/                       # State Management
├── types/                       # TypeScript Types
└── middleware.ts                # Edge Middleware
```

### 1.2 Server vs Client Components - La Decision Matrix

#### Cuándo Usar Server Components

```tsx
// ✅ PERFECTO para Server Components
// components/ProductList.tsx
import { db } from '@/lib/database'
import { ProductCard } from './ProductCard'

interface Product {
  id: string
  name: string
  price: number
  image: string
}

// Server Component - Ejecuta en el servidor
export default async function ProductList() {
  // Direct database access - ¡No APIs needed!
  const products: Product[] = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
        />
      ))}
    </div>
  )
}

// components/ProductCard.tsx - También Server Component
interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-2xl font-bold text-blue-600">
          ${product.price}
        </p>
        {/* AddToCartButton será Client Component */}
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  )
}
```

#### Cuándo Usar Client Components

```tsx
// ✅ PERFECTO para Client Components
// components/AddToCartButton.tsx
'use client' // Directive para Client Component

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'

interface AddToCartButtonProps {
  productId: string
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    setIsLoading(true)
    
    try {
      await addItem(productId)
      // Mostrar toast de éxito
    } catch (error) {
      // Manejar error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
    </button>
  )
}
```

### 1.3 La Decision Matrix: Server vs Client

| Necesitas | Server Component | Client Component |
|-----------|------------------|------------------|
| Fetch data | ✅ Perfecto | ❌ Usar SWR/React Query |
| Acceso a DB | ✅ Directo | ❌ Via API |
| SEO | ✅ Excelente | ⚠️ Limitado |
| Interactividad | ❌ No disponible | ✅ Perfecto |
| Estado local | ❌ No disponible | ✅ useState, etc |
| Eventos | ❌ No disponible | ✅ onClick, etc |
| Browser APIs | ❌ No disponible | ✅ localStorage, etc |
| Bundle size | ✅ Zero impact | ❌ Aumenta bundle |

---

## 🧭 PARTE 2: Navegación y Routing Avanzado

### 2.1 App Router - La Nueva Era

#### Estructura de Rutas Básica

```
app/
├── page.tsx                    # / (Home)
├── about/
│   └── page.tsx               # /about
├── blog/
│   ├── page.tsx               # /blog
│   ├── [slug]/
│   │   └── page.tsx          # /blog/[slug]
│   └── category/
│       └── [category]/
│           └── page.tsx      # /blog/category/[category]
└── dashboard/
    ├── layout.tsx            # Layout para /dashboard/*
    ├── page.tsx              # /dashboard
    ├── analytics/
    │   └── page.tsx         # /dashboard/analytics
    └── settings/
        ├── page.tsx         # /dashboard/settings
        └── profile/
            └── page.tsx     # /dashboard/settings/profile
```

#### Page Component con Server Component

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { db } from '@/lib/database'
import { BlogContent } from '@/components/blog/BlogContent'
import { RelatedPosts } from '@/components/blog/RelatedPosts'

interface PageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Generar metadata dinámicamente
export async function generateMetadata({ params }: PageProps) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  })

  if (!post) {
    return {
      title: 'Post not found'
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  }
}

// Generar rutas estáticas en build time
export async function generateStaticParams() {
  const posts = await db.post.findMany({
    select: { slug: true }
  })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  // Server Component - fetch data directamente
  const post = await db.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      tags: true,
      _count: {
        select: { comments: true }
      }
    }
  })

  if (!post) {
    notFound() // Renderiza not-found.tsx
  }

  // Fetch related posts en paralelo
  const relatedPosts = await db.post.findMany({
    where: {
      AND: [
        { id: { not: post.id } },
        { 
          tags: {
            some: {
              id: { in: post.tags.map(tag => tag.id) }
            }
          }
        }
      ]
    },
    take: 3,
    include: { author: true }
  })

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center text-gray-600 mb-4">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-8 h-8 rounded-full mr-3"
          />
          <span>{post.author.name}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.publishedAt.toISOString()}>
            {post.publishedAt.toLocaleDateString()}
          </time>
          <span className="mx-2">•</span>
          <span>{post._count.comments} comentarios</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span 
              key={tag.id}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </header>

      {/* Content Component - También Server Component */}
      <BlogContent content={post.content} />

      {/* Related Posts */}
      <RelatedPosts posts={relatedPosts} />
      
      {/* Comments - Client Component para interactividad */}
      <CommentsSection postId={post.id} />
    </article>
  )
}
```

### 2.2 Layout System - Composition Pattern

#### Root Layout - La Base de Todo

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { CartProvider } from '@/components/providers/CartProvider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'Mi E-Commerce',
    template: '%s | Mi E-Commerce'
  },
  description: 'La mejor tienda online',
  keywords: ['ecommerce', 'tienda', 'productos'],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {/* Global Navigation - Server Component */}
            <MainNavigation />
            
            {/* Main Content */}
            <main className="min-h-screen">
              {children}
            </main>
            
            {/* Global Footer - Server Component */}
            <Footer />
            
            {/* Client-side notifications */}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

#### Feature Layout - Dashboard Example

```tsx
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { DashboardHeader } from '@/components/dashboard/Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Server-side authentication check
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Check user permissions
  if (session.user.role !== 'ADMIN' && session.user.role !== 'USER') {
    redirect('/unauthorized')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Server Component con navigation */}
      <DashboardSidebar user={session.user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Server Component */}
        <DashboardHeader user={session.user} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 2.3 Route Groups y Parallel Routes

#### Route Groups - Organización Lógica

```
app/
├── (marketing)/           # No afecta la URL
│   ├── about/
│   ├── contact/
│   ├── pricing/
│   └── layout.tsx        # Layout específico para marketing
├── (shop)/               # No afecta la URL
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   └── layout.tsx        # Layout específico para shop
└── (auth)/               # No afecta la URL
    ├── login/
    ├── register/
    └── layout.tsx        # Layout específico para auth
```

#### Parallel Routes - Multiple Views

```tsx
// app/dashboard/@analytics/page.tsx
export default async function AnalyticsSlot() {
  const analytics = await getAnalyticsData()
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      <AnalyticsChart data={analytics} />
    </div>
  )
}

// app/dashboard/@notifications/page.tsx  
export default async function NotificationsSlot() {
  const notifications = await getNotifications()
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <NotificationsList notifications={notifications} />
    </div>
  )
}

// app/dashboard/layout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode
  analytics: React.ReactNode    // @analytics slot
  notifications: React.ReactNode // @notifications slot
}

export default function DashboardLayout({ 
  children, 
  analytics, 
  notifications 
}: DashboardLayoutProps) {
  return (
    <div className="dashboard-grid">
      <div className="main-content">
        {children}
      </div>
      
      <div className="analytics-panel">
        {analytics}
      </div>
      
      <div className="notifications-panel">
        {notifications}
      </div>
    </div>
  )
}
```

---

## 🔄 PARTE 3: Data Fetching y State Management

### 3.1 Server-Side Data Fetching Patterns

#### Pattern 1: Direct Database Access

```tsx
// app/products/page.tsx
import { db } from '@/lib/database'
import { Suspense } from 'react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductFilters } from '@/components/products/ProductFilters'

interface ProductsPageProps {
  searchParams: {
    category?: string
    sort?: 'price_asc' | 'price_desc' | 'name' | 'newest'
    page?: string
  }
}

// Server Component con data fetching
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page) || 1
  const limit = 12
  const offset = (page - 1) * limit

  // Multiple data fetches en paralelo
  const [products, categories, totalCount] = await Promise.all([
    db.product.findMany({
      where: {
        ...(searchParams.category && {
          category: { slug: searchParams.category }
        }),
        published: true
      },
      include: {
        category: true,
        images: true,
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: getOrderBy(searchParams.sort),
      take: limit,
      skip: offset
    }),
    
    db.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    }),
    
    db.product.count({
      where: {
        ...(searchParams.category && {
          category: { slug: searchParams.category }
        }),
        published: true
      }
    })
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-1/4">
          <ProductFilters 
            categories={categories}
            currentCategory={searchParams.category}
            currentSort={searchParams.sort}
          />
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              Productos ({totalCount})
            </h1>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} />
          </Suspense>

          {/* Pagination */}
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            searchParams={searchParams}
          />
        </main>
      </div>
    </div>
  )
}

function getOrderBy(sort?: string) {
  switch (sort) {
    case 'price_asc':
      return { price: 'asc' }
    case 'price_desc':
      return { price: 'desc' }
    case 'name':
      return { name: 'asc' }
    case 'newest':
      return { createdAt: 'desc' }
    default:
      return { createdAt: 'desc' }
  }
}
```

#### Pattern 2: Streaming con Suspense

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cada card se carga independientemente */}
        <Suspense fallback={<MetricCardSkeleton />}>
          <RevenueCard />
        </Suspense>
        
        <Suspense fallback={<MetricCardSkeleton />}>
          <OrdersCard />
        </Suspense>
        
        <Suspense fallback={<MetricCardSkeleton />}>
          <CustomersCard />
        </Suspense>
        
        <Suspense fallback={<MetricCardSkeleton />}>
          <ConversionCard />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <SalesChart />
        </Suspense>
        
        <Suspense fallback={<TableSkeleton />}>
          <RecentOrders />
        </Suspense>
      </div>
    </div>
  )
}

// Cada component es independiente y puede fallar sin afectar otros
async function RevenueCard() {
  // Simulate slow API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const revenue = await db.order.aggregate({
    _sum: { total: true },
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          ${revenue._sum.total?.toLocaleString() || 0}
        </p>
        <p className="text-sm text-gray-600">This month</p>
      </CardContent>
    </Card>
  )
}

async function SalesChart() {
  // Simulate very slow API
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  const salesData = await getSalesData()
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <SalesChartComponent data={salesData} />
      </CardContent>
    </Card>
  )
}
```

### 3.2 Client-Side State Management

#### Context Pattern para Client State

```tsx
// components/providers/CartProvider.tsx
'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  items: CartItem[]
  total: number
  isOpen: boolean
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        }
      }
      
      const newItems = [...state.items, { ...action.payload, quantity: 1 }]
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)
      
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      }
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload)
      }
    
    default:
      return state
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    isOpen: false
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: items })
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
  }, [])

  // Save cart to localStorage when items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
```

### 3.3 Server Actions - The Game Changer

```tsx
// lib/actions/products.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '@/lib/database'
import { auth } from '@/lib/auth'

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).min(1, 'At least one image is required')
})

export async function createProduct(formData: FormData) {
  // Authentication check
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Validate form data
  const validatedFields = createProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: Number(formData.get('price')),
    categoryId: formData.get('categoryId'),
    images: formData.getAll('images')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, price, categoryId, images } = validatedFields.data

  try {
    // Create product in database
    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        slug: generateSlug(name),
        images: {
          create: images.map((url, index) => ({
            url,
            alt: `${name} image ${index + 1}`,
            order: index
          }))
        }
      }
    })

    // Revalidate relevant pages
    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidateTag('products')

  } catch (error) {
    return {
      message: 'Database Error: Failed to create product.',
    }
  }

  // Redirect to products list
  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    await db.product.delete({
      where: { id }
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidateTag('products')
    
    return { message: 'Product deleted successfully' }
  } catch (error) {
    return {
      message: 'Database Error: Failed to delete product.',
    }
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}
```

#### Form Component usando Server Actions

```tsx
// components/admin/ProductForm.tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createProduct } from '@/lib/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const initialState = {
  message: null,
  errors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Product'}
    </Button>
  )
}

export function ProductForm({ categories }: { categories: Category[] }) {
  const [state, dispatch] = useFormState(createProduct, initialState)

  return (
    <form action={dispatch} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Product Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          className={state.errors?.name ? 'border-red-500' : ''}
        />
        {state.errors?.name && (
          <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          className={state.errors?.description ? 'border-red-500' : ''}
        />
        {state.errors?.description && (
          <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium">
          Price
        </label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          required
          className={state.errors?.price ? 'border-red-500' : ''}
        />
        {state.errors?.price && (
          <p className="text-red-500 text-sm mt-1">{state.errors.price}</p>
        )}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className={`w-full border rounded-md px-3 py-2 ${
            state.errors?.categoryId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {state.errors?.categoryId && (
          <p className="text-red-500 text-sm mt-1">{state.errors.categoryId}</p>
        )}
      </div>

      {state.message && (
        <p className="text-red-500">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  )
}
```

---

## 🏢 PARTE 4: Casos de Uso Reales - Arquitecturas Enterprise

### 4.1 E-Commerce Platform

#### Estructura de Features

```
app/
├── (shop)/
│   ├── layout.tsx
│   ├── page.tsx                 # Home/Landing
│   ├── products/
│   │   ├── page.tsx            # Products listing
│   │   ├── [slug]/
│   │   │   ├── page.tsx        # Product detail
│   │   │   └── loading.tsx
│   │   └── category/
│   │       └── [category]/
│   │           └── page.tsx
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   ├── page.tsx
│   │   ├── success/
│   │   │   └── page.tsx
│   │   └── error/
│   │       └── page.tsx
│   └── account/
│       ├── layout.tsx
│       ├── page.tsx            # Account dashboard
│       ├── orders/
│       │   ├── page.tsx
│       │   └── [orderId]/
│       │       └── page.tsx
│       └── profile/
│           └── page.tsx
├── (admin)/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── products/
│   │   │   ├── page.tsx        # Products management
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── analytics/
│   │       └── page.tsx
```

#### Product Detail - Complete Implementation

```tsx
// app/(shop)/products/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { cache } from 'react'
import { db } from '@/lib/database'
import { ProductGallery } from '@/components/products/ProductGallery'
import { ProductInfo } from '@/components/products/ProductInfo'
import { ProductReviews } from '@/components/products/ProductReviews'
import { RelatedProducts } from '@/components/products/RelatedProducts'
import { BreadcrumbNav } from '@/components/ui/BreadcrumbNav'

// Cache the product fetch function
const getProduct = cache(async (slug: string) => {
  return db.product.findUnique({
    where: { 
      slug,
      published: true 
    },
    include: {
      category: true,
      images: {
        orderBy: { order: 'asc' }
      },
      reviews: {
        include: {
          user: {
            select: { name: true, avatar: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      _count: {
        select: { reviews: true }
      }
    }
  })
})

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)

  if (!product) {
    return {
      title: 'Product not found'
    }
  }

  return {
    title: `${product.name} | Mi E-Commerce`,
    description: product.description,
    keywords: [product.name, product.category.name, 'comprar', 'tienda online'],
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map(img => ({
        url: img.url,
        alt: img.alt
      })),
      type: 'product',
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'USD',
    }
  }
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { published: true },
    select: { slug: true },
    take: 100 // Generate top 100 products at build time
  })

  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  // Fetch related products in parallel
  const relatedProductsPromise = db.product.findMany({
    where: {
      AND: [
        { id: { not: product.id } },
        { categoryId: product.categoryId },
        { published: true }
      ]
    },
    include: {
      images: {
        take: 1,
        orderBy: { order: 'asc' }
      }
    },
    take: 4
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.category.name, href: `/products/category/${product.category.slug}` },
          { label: product.name, href: `/products/${product.slug}` }
        ]}
      />

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        {/* Product Gallery - Client Component */}
        <ProductGallery images={product.images} />

        {/* Product Info - Hybrid Component */}
        <ProductInfo product={product} />
      </div>

      {/* Product Reviews Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8">
          Customer Reviews ({product._count.reviews})
        </h2>
        <ProductReviews 
          productId={product.id}
          reviews={product.reviews}
          totalCount={product._count.reviews}
        />
      </section>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts promise={relatedProductsPromise} />
        </Suspense>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.images.map(img => img.url),
            "sku": product.id,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": product.reviews.length > 0 ? {
              "@type": "AggregateRating",
              "ratingValue": calculateAverageRating(product.reviews),
              "reviewCount": product._count.reviews
            } : undefined
          })
        }}
      />
    </div>
  )
}

function calculateAverageRating(reviews: any[]) {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.length).toFixed(1)
}
```

### 4.2 SaaS Dashboard Platform

#### Multi-tenant Architecture

```tsx
// app/(dashboard)/[workspaceSlug]/layout.tsx
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/database'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { WorkspaceSwitcher } from '@/components/dashboard/WorkspaceSwitcher'

interface WorkspaceLayoutProps {
  children: React.ReactNode
  params: { workspaceSlug: string }
}

export default async function WorkspaceLayout({ 
  children, 
  params 
}: WorkspaceLayoutProps) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Get workspace and user permissions
  const workspace = await db.workspace.findUnique({
    where: { slug: params.workspaceSlug },
    include: {
      members: {
        where: { userId: session.user.id },
        include: {
          role: true
        }
      }
    }
  })

  if (!workspace) {
    notFound()
  }

  const membership = workspace.members[0]
  if (!membership) {
    redirect('/unauthorized')
  }

  // Get user's workspaces for switcher
  const userWorkspaces = await db.workspace.findMany({
    where: {
      members: {
        some: { userId: session.user.id }
      }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true
    }
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar 
        workspace={workspace}
        userRole={membership.role.name}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <WorkspaceSwitcher 
              currentWorkspace={workspace}
              workspaces={userWorkspaces}
            />
            
            <div className="flex items-center space-x-4">
              <NotificationsDropdown />
              <UserDropdown user={session.user} />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

#### Analytics Dashboard with Real-time Data

```tsx
// app/(dashboard)/[workspaceSlug]/analytics/page.tsx
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { db } from '@/lib/database'
import { MetricCard } from '@/components/analytics/MetricCard'
import { ChartContainer } from '@/components/analytics/ChartContainer'
import { RealtimeVisitors } from '@/components/analytics/RealtimeVisitors'

interface AnalyticsPageProps {
  params: { workspaceSlug: string }
  searchParams: {
    period?: '7d' | '30d' | '90d'
    compare?: 'previous' | 'year'
  }
}

export default async function AnalyticsPage({ 
  params, 
  searchParams 
}: AnalyticsPageProps) {
  const session = await auth()
  const period = searchParams.period || '30d'
  
  // Get workspace
  const workspace = await db.workspace.findUnique({
    where: { slug: params.workspaceSlug }
  })

  if (!workspace) {
    notFound()
  }

  // Calculate date ranges
  const { startDate, endDate, compareStartDate, compareEndDate } = 
    getDateRanges(period, searchParams.compare)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center space-x-4">
          <PeriodSelector currentPeriod={period} />
          <CompareSelector currentCompare={searchParams.compare} />
        </div>
      </div>

      {/* Realtime Metrics - Client Component with WebSocket */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Realtime</h2>
        <Suspense fallback={<RealtimeVisitorsSkeleton />}>
          <RealtimeVisitors workspaceId={workspace.id} />
        </Suspense>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Suspense fallback={<MetricCardSkeleton />}>
          <PageviewsMetric 
            workspaceId={workspace.id}
            startDate={startDate}
            endDate={endDate}
            compareStartDate={compareStartDate}
            compareEndDate={compareEndDate}
          />
        </Suspense>

        <Suspense fallback={<MetricCardSkeleton />}>
          <UniqueVisitorsMetric 
            workspaceId={workspace.id}
            startDate={startDate}
            endDate={endDate}
            compareStartDate={compareStartDate}
            compareEndDate={compareEndDate}
          />
        </Suspense>

        <Suspense fallback={<MetricCardSkeleton />}>
          <BounceRateMetric 
            workspaceId={workspace.id}
            startDate={startDate}
            endDate={endDate}
            compareStartDate={compareStartDate}
            compareEndDate={compareEndDate}
          />
        </Suspense>

        <Suspense fallback={<MetricCardSkeleton />}>
          <AverageSessionMetric 
            workspaceId={workspace.id}
            startDate={startDate}
            endDate={endDate}
            compareStartDate={compareStartDate}
            compareEndDate={compareEndDate}
          />
        </Suspense>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <TrafficChart 
            workspaceId={workspace.id}
            startDate={startDate}
            endDate={endDate}
            period={period}
          />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <TopPagesChart 
            workspaceId={workspace.id}
            startDate={startDate}
            endDate={endDate}
          />
        </Suspense>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<TableSkeleton />}>
          <TopReferrersTable 
            workspaceId={workspace.id}
            startDate={startDate}
            endDate={endDate}
          />
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <DevicesTable 
            workspaceId={workspace.id}
            startDate={startDate}
            endDate={endDate}
          />
        </Suspense>
      </div>
    </div>
  )
}

// Individual metric components - Each fetches its own data
async function PageviewsMetric({ 
  workspaceId, 
  startDate, 
  endDate, 
  compareStartDate, 
  compareEndDate 
}: MetricProps) {
  const [current, previous] = await Promise.all([
    db.pageview.count({
      where: {
        workspaceId,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      }
    }),
    compareStartDate && compareEndDate ? db.pageview.count({
      where: {
        workspaceId,
        timestamp: {
          gte: compareStartDate,
          lte: compareEndDate
        }
      }
    }) : null
  ])

  const change = previous ? ((current - previous) / previous) * 100 : null

  return (
    <MetricCard
      title="Page Views"
      value={current.toLocaleString()}
      change={change}
      trend={change ? (change > 0 ? 'up' : 'down') : undefined}
    />
  )
}
```

---

## 🔧 PARTE 5: Performance y Optimización Avanzada

### 5.1 Caching Strategies

#### Cache Configuration

```tsx
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Cache headers for static assets
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

#### Data Fetching with Cache Tags

```tsx
// lib/data.ts
import { cache } from 'react'
import { unstable_cache } from 'next/cache'

// Cache function with tags for revalidation
export const getProducts = cache(
  unstable_cache(
    async (category?: string, page: number = 1) => {
      const products = await db.product.findMany({
        where: {
          ...(category && { category: { slug: category } }),
          published: true
        },
        include: {
          category: true,
          images: { take: 1 }
        },
        skip: (page - 1) * 12,
        take: 12,
        orderBy: { createdAt: 'desc' }
      })

      return products
    },
    ['products'], // Cache key
    {
      tags: ['products'], // Tags for revalidation
      revalidate: 3600, // Revalidate every hour
    }
  )
)

// Cache with dynamic tags
export const getProductBySlug = cache(
  unstable_cache(
    async (slug: string) => {
      const product = await db.product.findUnique({
        where: { slug },
        include: {
          category: true,
          images: true,
          reviews: {
            include: { user: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      return product
    },
    ['product-by-slug'],
    {
      tags: (slug: string) => [`product-${slug}`, 'products'],
      revalidate: 1800, // 30 minutes
    }
  )
)
```

#### Revalidation Strategies

```tsx
// lib/actions/revalidation.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidateProductPages(productSlug?: string) {
  // Revalidate specific paths
  revalidatePath('/products')
  revalidatePath('/') // Home page if it shows products
  
  if (productSlug) {
    revalidatePath(`/products/${productSlug}`)
  }

  // Revalidate by tags
  revalidateTag('products')
  
  if (productSlug) {
    revalidateTag(`product-${productSlug}`)
  }
}

export async function revalidateUserSpecificData(userId: string) {
  revalidateTag(`user-${userId}`)
  revalidateTag(`cart-${userId}`)
  revalidateTag(`orders-${userId}`)
}
```

### 5.2 Image Optimization

```tsx
// components/OptimizedImage.tsx
import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'blur',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!error ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL || generateBlurDataURL(width, height)}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true)
            setIsLoading(false)
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Image not available</span>
        </div>
      )}
      
      {isLoading && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}

function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, width, height)
  }
  
  return canvas.toDataURL()
}
```

### 5.3 Bundle Optimization

```tsx
// Dynamic imports for heavy components
import { lazy, Suspense } from 'react'

// Lazy load heavy components
const ChartComponent = lazy(() => 
  import('@/components/charts/ChartComponent').then(module => ({
    default: module.ChartComponent
  }))
)

const DataTable = lazy(() => import('@/components/tables/DataTable'))

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1>Dashboard</h1>
      
      {/* Critical above-the-fold content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Revenue" value="$12,345" />
        <MetricCard title="Orders" value="456" />
        <MetricCard title="Customers" value="789" />
      </div>

      {/* Lazy loaded heavy components */}
      <Suspense fallback={<ChartSkeleton />}>
        <ChartComponent />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <DataTable />
      </Suspense>
    </div>
  )
}
```

---

## 🎯 PARTE 6: Testing y Quality Assurance

### 6.1 Testing Strategy

```tsx
// __tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductCard } from '@/components/products/ProductCard'
import { CartProvider } from '@/components/providers/CartProvider'

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test-image.jpg',
  category: { name: 'Electronics' }
}

// Wrapper para providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <ProductCard product={mockProduct} />,
      { wrapper: TestWrapper }
    )

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByAltText('Test Product')).toBeInTheDocument()
  })

  it('adds product to cart when button is clicked', async () => {
    render(
      <ProductCard product={mockProduct} />,
      { wrapper: TestWrapper }
    )

    const addToCartButton = screen.getByText('Add to Cart')
    fireEvent.click(addToCartButton)

    await waitFor(() => {
      expect(screen.getByText('Added to Cart')).toBeInTheDocument()
    })
  })
})
```

### 6.2 E2E Testing con Playwright

```typescript
// e2e/product-purchase.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Product Purchase Flow', () => {
  test('user can complete purchase', async ({ page }) => {
    // Navigate to product page
    await page.goto('/products/test-product')
    
    // Verify product details
    await expect(page.locator('h1')).toContainText('Test Product')
    await expect(page.locator('[data-testid=price]')).toContainText('$99.99')
    
    // Add to cart
    await page.click('[data-testid=add-to-cart]')
    await expect(page.locator('[data-testid=cart-count]')).toContainText('1')
    
    // Go to cart
    await page.click('[data-testid=cart-icon]')
    await expect(page.url()).toContain('/cart')
    
    // Proceed to checkout
    await page.click('[data-testid=checkout-button]')
    
    // Fill shipping information
    await page.fill('[name=firstName]', 'John')
    await page.fill('[name=lastName]', 'Doe')
    await page.fill('[name=email]', 'john@example.com')
    await page.fill('[name=address]', '123 Main St')
    await page.fill('[name=city]', 'New York')
    await page.fill('[name=zipCode]', '10001')
    
    // Submit order
    await page.click('[data-testid=place-order]')
    
    // Verify success page
    await expect(page.url()).toContain('/checkout/success')
    await expect(page.locator('h1')).toContainText('Order Confirmed')
  })
})
```

---

## 🚀 PARTE 7: Deployment y DevOps

### 7.1 Production Configuration

```typescript
// lib/config.ts
const config = {
  database: {
    url: process.env.DATABASE_URL!,
    maxConnections: process.env.NODE_ENV === 'production' ? 100 : 10,
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET!,
    providers: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }
    }
  },
  storage: {
    bucket: process.env.S3_BUCKET!,
    region: process.env.S3_REGION!,
    accessKey: process.env.S3_ACCESS_KEY!,
    secretKey: process.env.S3_SECRET_KEY!,
  },
  redis: {
    url: process.env.REDIS_URL!,
  },
  email: {
    host: process.env.EMAIL_HOST!,
    port: Number(process.env.EMAIL_PORT!),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    }
  },
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    mixpanelToken: process.env.MIXPANEL_TOKEN,
  },
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  }
}

export default config
```

### 7.2 Monitoring y Error Tracking

```tsx
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  beforeSend(event) {
    // Filter out known issues or sensitive data
    if (event.exception) {
      const error = event.exception.values?.[0]
      if (error?.value?.includes('Network request failed')) {
        return null // Don't track network errors
      }
    }
    return event
  },
})

// Custom error boundary
export function GlobalErrorBoundary({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <Sentry.ErrorBoundary 
      fallback={({ error, resetError }) => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We've been notified and are working on a fix.
            </p>
            <button 
              onClick={resetError}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
```

---

## 🎓 Conclusión: Dominio Arquitectónico

### Roadmap de Maestría 60-90-120 Días

#### Primeros 60 Días: Fundamentos Sólidos
```
Semana 1-2: App Router + Server Components básicos
Semana 3-4: Layouts, Loading, Error boundaries
Semana 5-6: Data fetching patterns + Server Actions
Semana 7-8: Client/Server composition patterns
```

#### 90 Días: Arquitectura Intermedia
```
Semana 9-12: Multi-tenant architecture
Semana 13-14: Advanced caching strategies
Semana 15-16: Performance optimization
Proyecto: SaaS dashboard completo
```

#### 120 Días: Enterprise Master
```
Semana 17-20: Production deployment + monitoring
Semana 21-24: Testing strategies + CI/CD
Proyecto Final: E-commerce platform completo
```

### Los 10 Principios de Arquitectura Next.js

1. **Server-First Thinking** - Ejecuta en server cuando sea posible
2. **Granular Loading States** - Streaming a nivel de componente
3. **Smart Caching** - Cache agresivo con revalidation inteligente
4. **Progressive Enhancement** - Funciona sin JS, mejor con JS
5. **Type Safety** - TypeScript en toda la aplicación
6. **Component Composition** - Server + Client components híbridos
7. **Data Co-location** - Fetch data cerca de donde se usa
8. **Error Boundaries** - Manejo granular de errores
9. **Performance Budgets** - Monitor bundle size y Core Web Vitals
10. **Testing Strategy** - Unit + Integration + E2E testing

### Anti-Patterns que Debes Evitar

❌ **Fetch data en Client Components** cuando puedes hacerlo en Server
❌ **Over-use de 'use client'** - Solo cuando necesites interactividad
❌ **Props drilling** excesivo - Usa Context o state management
❌ **No usar Suspense** para loading states
❌ **Ignorar caching** - Configura cache tags apropiadamente

### Tu Siguiente Paso

**Construye un proyecto real aplicando estos conceptos:**
1. Elige un dominio (e-commerce, SaaS, blog)
2. Aplica la arquitectura de features
3. Implementa Server + Client components
4. Agrega caching y optimizaciones
5. Deploy a producción con monitoring

---

*"La mejor arquitectura es la que crece contigo y no se rompe cuando escala."*

**¡Tu journey hacia la maestría en Next.js con Server Components comienza ahora! 🚀⚡**