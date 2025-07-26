---
title: 'NgRx Signal Component Store'
description: 'Guía Completa de NgRx Signal Component Store: Estado Moderno en Angular 19'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa de NgRx Signal Component Store: Estado Moderno en Angular 19

## 🏪 ¿Qué es NgRx Signal Component Store? - La Analogía del Almacén Inteligente

NgRx Signal Component Store es como **un almacén inteligente de última generación** que:

* **Guarda el inventario** (estado) de manera organizada
* **Tiene empleados especializados** (effects) que manejan tareas específicas
* **Cuenta con ventanillas de información** (selectors) que te dan datos procesados
* **Recibe órdenes de trabajo** (actions) que ejecuta automáticamente
* **Se sincroniza en tiempo real** con todas las sucursales (componentes)

### Comparación: NgRx Tradicional vs NgRx Signal Store


| Concepto              | NgRx Tradicional                   | NgRx Signal Store       |
| --------------------- | ---------------------------------- | ----------------------- |
| **Analogía**         | Oficina de gobierno (burocrático) | Amazon moderno (ágil)  |
| **Boilerplate**       | Mucho código repetitivo           | Mínimo código         |
| **Tipado**            | Manual y propenso a errores        | Automático e inferido  |
| **Rendimiento**       | Bueno pero complejo                | Excelente y automático |
| **Curva aprendizaje** | Empinada                           | Suave                   |
| **Testing**           | Complejo                           | Simple                  |

## 🔧 Instalación y Configuración

```bash
# Instalar NgRx Signal Store
npm install @ngrx/signals

# Si también quieres usar effects HTTP
npm install @ngrx/effects @angular/common/http
```

```typescript
// main.ts - Configuración inicial
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    // Otros providers...
  ]
});
```

## 🏗️ Anatomía de un Signal Store - El Almacén Completo

### 1. Store Básico - La Tienda de Barrio

**Analogía**: *Como una pequeña tienda donde el dueño maneja todo personalmente*

```typescript
import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';

// Estado inicial - como el inventario inicial de la tienda
interface CounterState {
  count: number;
  lastUpdated: Date;
  isLoading: boolean;
}

// Signal Store básico - la tienda completa
export const CounterStore = signalStore(
  { providedIn: 'root' }, // Como tener una sola tienda en todo el barrio
  
  // Estado inicial - inventario de apertura
  withState<CounterState>({
    count: 0,
    lastUpdated: new Date(),
    isLoading: false
  }),
  
  // Computed values - como cálculos automáticos de la caja registradora
  withComputed((store) => ({
    // Se recalcula automáticamente cuando count cambia
    doubleCount: computed(() => store.count() * 2),
  
    // Estado formateado para mostrar
    displayText: computed(() => {
      const count = store.count();
      if (count === 0) return '🏪 Tienda cerrada';
      if (count > 0) return `📈 Ganancia: +${count}`;
      return `📉 Pérdida: ${count}`;
    }),
  
    // Validaciones automáticas
    canIncrement: computed(() => store.count() < 100),
    canDecrement: computed(() => store.count() > -100),
  })),
  
  // Métodos - como las acciones que puede hacer el tendero
  withMethods((store) => ({
    // Incrementar - como hacer una venta
    increment(): void {
      if (store.canIncrement()) {
        store.patchState({
          count: store.count() + 1,
          lastUpdated: new Date()
        });
      }
    },
  
    // Decrementar - como un reembolso
    decrement(): void {
      if (store.canDecrement()) {
        store.patchState({
          count: store.count() - 1,
          lastUpdated: new Date()
        });
      }
    },
  
    // Reset - como cerrar caja al final del día
    reset(): void {
      store.patchState({
        count: 0,
        lastUpdated: new Date()
      });
    },
  
    // Establecer valor específico - como ajuste de inventario
    setCount(newCount: number): void {
      if (newCount >= -100 && newCount <= 100) {
        store.patchState({
          count: newCount,
          lastUpdated: new Date()
        });
      }
    },
  
    // Operación asíncrona - como pedir stock al proveedor
    async addAsync(amount: number): Promise<void> {
      store.patchState({ isLoading: true });
  
      // Simular delay de la operación
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      store.patchState({
        count: store.count() + amount,
        lastUpdated: new Date(),
        isLoading: false
      });
    }
  }))
);
```

### Componente que usa el Store Básico

```typescript
import { Component, inject } from '@angular/core';
import { CounterStore } from './counter.store';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div class="counter-app">
      <h2>🏪 Mi Tienda de Barrio</h2>
  
      <div class="status-panel">
        <div class="current-count">
          <span class="label">Estado actual:</span>
          <span class="value">{{ store.displayText() }}</span>
        </div>
    
        <div class="double-count">
          <span class="label">Doble valor:</span>
          <span class="value">{{ store.doubleCount() }}</span>
        </div>
    
        <div class="last-updated">
          <span class="label">Última actualización:</span>
          <span class="value">{{ store.lastUpdated() | date:'short' }}</span>
        </div>
      </div>
  
      <div class="controls">
        <button 
          (click)="store.decrement()"
          [disabled]="!store.canDecrement() || store.isLoading()">
          ➖ Restar
        </button>
    
        <div class="count-display" [class.loading]="store.isLoading()">
          {{ store.isLoading() ? '⏳ Procesando...' : store.count() }}
        </div>
    
        <button 
          (click)="store.increment()"
          [disabled]="!store.canIncrement() || store.isLoading()">
          ➕ Sumar
        </button>
      </div>
  
      <div class="advanced-controls">
        <button (click)="store.reset()">🔄 Reiniciar</button>
        <button (click)="store.addAsync(5)">⏰ +5 Lento</button>
    
        <div class="custom-input">
          <input 
            type="number" 
            #customValue 
            placeholder="Valor personalizado"
            min="-100" 
            max="100">
          <button (click)="store.setCount(+customValue.value)">
            📝 Establecer
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .counter-app {
      max-width: 500px;
      margin: 20px auto;
      padding: 30px;
      border: 2px solid #4caf50;
      border-radius: 12px;
      text-align: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .status-panel {
      margin: 20px 0;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .status-panel > div {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
    }
    .label {
      font-weight: bold;
      color: #666;
    }
    .value {
      color: #333;
    }
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin: 25px 0;
    }
    .count-display {
      font-size: 3em;
      font-weight: bold;
      color: #2196f3;
      min-width: 100px;
      padding: 10px;
      border: 2px solid #2196f3;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .count-display.loading {
      animation: pulse 1s infinite;
      color: #ff9800;
      border-color: #ff9800;
    }
    button {
      padding: 12px 20px;
      border: none;
      border-radius: 25px;
      font-size: 1.1em;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    button:not(:disabled) {
      background: #4caf50;
      color: white;
    }
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .advanced-controls {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }
    .custom-input {
      display: flex;
      gap: 5px;
    }
    .custom-input input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 150px;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `]
})
export class CounterComponent {
  // Inyectar el store - como contratar al tendero
  store = inject(CounterStore);
}
```

## 🌐 Store con Effects HTTP - El Almacén Conectado

**Analogía**: *Como un Amazon que se conecta con proveedores, bancos y servicios de envío*

```typescript
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, map, catchError, of, debounceTime } from 'rxjs';

// Tipos de datos - como el catálogo de productos
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  cart: { productId: number; quantity: number }[];
}

// Store del e-commerce - como el sistema completo de Amazon
export const ProductsStore = signalStore(
  { providedIn: 'root' },
  
  // Estado inicial - inventario vacío al abrir la tienda
  withState<ProductsState>({
    products: [],
    loading: false,
    error: null,
    searchTerm: '',
    selectedCategory: '',
    cart: []
  }),
  
  // Computed values - como reportes automáticos del negocio
  withComputed((store) => ({
    // Productos filtrados - como la vitrina personalizada
    filteredProducts: computed(() => {
      const products = store.products();
      const search = store.searchTerm().toLowerCase();
      const category = store.selectedCategory();
  
      return products.filter(product => {
        const matchesSearch = !search || 
          product.title.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search);
    
        const matchesCategory = !category || product.category === category;
    
        return matchesSearch && matchesCategory;
      });
    }),
  
    // Categorías disponibles - como las secciones de la tienda
    availableCategories: computed(() => {
      const products = store.products();
      const categories = [...new Set(products.map(p => p.category))];
      return categories.sort();
    }),
  
    // Estadísticas del carrito - como el resumen de compra
    cartStats: computed(() => {
      const cart = store.cart();
      const products = store.products();
  
      const items = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        return product ? {
          ...product,
          quantity: cartItem.quantity,
          subtotal: product.price * cartItem.quantity
        } : null;
      }).filter(Boolean);
  
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item?.subtotal || 0), 0);
  
      return { items, totalItems, totalPrice };
    }),
  
    // Estado de la UI - como indicadores del tablero de control
    isEmpty: computed(() => store.products().length === 0),
    hasResults: computed(() => store.filteredProducts().length > 0),
    isCartEmpty: computed(() => store.cart().length === 0)
  })),
  
  // Métodos y effects - como los empleados especializados
  withMethods((store, http = inject(HttpClient)) => ({
  
    // Effect para cargar productos - como el empleado de inventario
    loadProducts: rxMethod<void>(
      pipe(
        switchMap(() => {
          store.patchState({ loading: true, error: null });
      
          return http.get<Product[]>('https://fakestoreapi.com/products').pipe(
            map(products => {
              console.log('📦 Productos cargados del almacén:', products.length);
              store.patchState({
                products,
                loading: false,
                error: null
              });
            }),
            catchError(error => {
              console.error('❌ Error cargando productos:', error);
              store.patchState({
                loading: false,
                error: 'Error al cargar productos. Inténtalo de nuevo.'
              });
              return of(null);
            })
          );
        })
      )
    ),
  
    // Effect para búsqueda con debounce - como el empleado de atención al cliente
    searchProducts: rxMethod<string>(
      pipe(
        debounceTime(300), // Esperar 300ms antes de buscar
        map(searchTerm => {
          console.log('🔍 Buscando productos:', searchTerm);
          store.patchState({ searchTerm });
        })
      )
    ),
  
    // Cargar productos por categoría - como cambiar de sección en la tienda
    loadProductsByCategory: rxMethod<string>(
      pipe(
        switchMap(category => {
          store.patchState({ loading: true, error: null });
      
          const url = category 
            ? `https://fakestoreapi.com/products/category/${category}`
            : 'https://fakestoreapi.com/products';
      
          return http.get<Product[]>(url).pipe(
            map(products => {
              console.log(`🏷️ Productos de categoría "${category}":`, products.length);
              store.patchState({
                products,
                selectedCategory: category,
                loading: false,
                error: null
              });
            }),
            catchError(error => {
              console.error('❌ Error cargando categoría:', error);
              store.patchState({
                loading: false,
                error: `Error al cargar categoría ${category}`
              });
              return of(null);
            })
          );
        })
      )
    ),
  
    // Métodos síncronos para el carrito - como operaciones de caja
    addToCart(productId: number, quantity: number = 1): void {
      const currentCart = store.cart();
      const existingItem = currentCart.find(item => item.productId === productId);
  
      if (existingItem) {
        // Incrementar cantidad si ya existe
        const updatedCart = currentCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        store.patchState({ cart: updatedCart });
      } else {
        // Agregar nuevo item
        store.patchState({
          cart: [...currentCart, { productId, quantity }]
        });
      }
  
      console.log(`🛒 Producto ${productId} agregado al carrito`);
    },
  
    removeFromCart(productId: number): void {
      const updatedCart = store.cart().filter(item => item.productId !== productId);
      store.patchState({ cart: updatedCart });
      console.log(`🗑️ Producto ${productId} removido del carrito`);
    },
  
    updateCartQuantity(productId: number, quantity: number): void {
      if (quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
  
      const updatedCart = store.cart().map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );
      store.patchState({ cart: updatedCart });
    },
  
    clearCart(): void {
      store.patchState({ cart: [] });
      console.log('🧹 Carrito vaciado');
    },
  
    // Filtros de UI
    setCategory(category: string): void {
      store.patchState({ selectedCategory: category });
    },
  
    clearFilters(): void {
      store.patchState({
        searchTerm: '',
        selectedCategory: ''
      });
    }
  }))
);
```

### Componente del E-commerce

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsStore } from './products.store';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="ecommerce-app">
      <header class="app-header">
        <h1>🛍️ Mi Tienda Online</h1>
    
        <div class="cart-summary" (click)="showCart = !showCart">
          🛒 Carrito ({{ store.cartStats().totalItems }})
          - ${{ store.cartStats().totalPrice.toFixed(2) }}
        </div>
      </header>
  
      <!-- Filtros y búsqueda -->
      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text"
            placeholder="🔍 Buscar productos..."
            [value]="searchTerm"
            (input)="onSearchChange($event)">
        </div>
    
        <div class="category-filter">
          <select 
            [value]="store.selectedCategory()"
            (change)="onCategoryChange($event)">
            <option value="">📋 Todas las categorías</option>
            @for (category of store.availableCategories(); track category) {
              <option [value]="category">{{ formatCategory(category) }}</option>
            }
          </select>
        </div>
    
        <button (click)="store.clearFilters()">🧹 Limpiar filtros</button>
      </div>
  
      <!-- Estados de carga -->
      @if (store.loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>📦 Cargando productos desde el almacén...</p>
        </div>
      } @else if (store.error()) {
        <div class="error-state">
          <h3>❌ Oops! Algo salió mal</h3>
          <p>{{ store.error() }}</p>
          <button (click)="store.loadProducts()">🔄 Intentar de nuevo</button>
        </div>
      } @else if (store.isEmpty()) {
        <div class="empty-state">
          <h3>📦 Almacén vacío</h3>
          <p>No hay productos disponibles</p>
          <button (click)="store.loadProducts()">📥 Cargar productos</button>
        </div>
      } @else if (!store.hasResults()) {
        <div class="no-results">
          <h3>🔍 No se encontraron productos</h3>
          <p>Intenta cambiar los filtros de búsqueda</p>
        </div>
      } @else {
        <!-- Grid de productos -->
        <div class="products-grid">
          @for (product of store.filteredProducts(); track product.id) {
            <div class="product-card">
              <div class="product-image">
                <img [src]="product.image" [alt]="product.title">
                <div class="category-badge">{{ formatCategory(product.category) }}</div>
              </div>
          
              <div class="product-info">
                <h3 class="product-title">{{ product.title }}</h3>
                <p class="product-description">{{ truncateText(product.description, 100) }}</p>
            
                <div class="product-rating">
                  <span class="stars">{{ getStars(product.rating.rate) }}</span>
                  <span class="rating-text">{{ product.rating.rate }} ({{ product.rating.count }})</span>
                </div>
            
                <div class="product-footer">
                  <div class="price">\${{ product.price.toFixed(2) }}</div>
                  <button 
                    class="add-to-cart-btn"
                    (click)="store.addToCart(product.id)">
                    🛒 Agregar
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
  
      <!-- Panel del carrito -->
      @if (showCart) {
        <div class="cart-panel">
          <div class="cart-header">
            <h3>🛒 Tu Carrito</h3>
            <button (click)="showCart = false">✕</button>
          </div>
      
          <div class="cart-content">
            @if (store.isCartEmpty()) {
              <div class="empty-cart">
                <p>🛒 Tu carrito está vacío</p>
                <p>¡Agrega algunos productos!</p>
              </div>
            } @else {
              <div class="cart-items">
                @for (item of store.cartStats().items; track item.id) {
                  <div class="cart-item">
                    <img [src]="item.image" [alt]="item.title">
                    <div class="item-details">
                      <h4>{{ item.title }}</h4>
                      <p class="item-price">\${{ item.price }}</p>
                    </div>
                    <div class="quantity-controls">
                      <button (click)="updateQuantity(item.id, item.quantity - 1)">−</button>
                      <span>{{ item.quantity }}</span>
                      <button (click)="updateQuantity(item.id, item.quantity + 1)">+</button>
                    </div>
                    <div class="item-subtotal">\${{ item.subtotal.toFixed(2) }}</div>
                    <button 
                      class="remove-btn"
                      (click)="store.removeFromCart(item.id)">
                      🗑️
                    </button>
                  </div>
                }
              </div>
          
              <div class="cart-footer">
                <div class="cart-total">
                  <strong>Total: \${{ store.cartStats().totalPrice.toFixed(2) }}</strong>
                </div>
                <div class="cart-actions">
                  <button (click)="store.clearCart()">🧹 Vaciar</button>
                  <button class="checkout-btn">💳 Comprar</button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .ecommerce-app {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-bottom: 2px solid #eee;
      margin-bottom: 20px;
    }
    .cart-summary {
      background: #4caf50;
      color: white;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
    }
    .filters-section {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    .search-box input {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 25px;
      width: 300px;
      font-size: 1em;
    }
    .category-filter select {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1em;
    }
    .loading-state, .error-state, .empty-state, .no-results {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .product-card {
      border: 1px solid #ddd;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0,0,0,0.2);
    }
    .product-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .category-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8em;
    }
    .product-info {
      padding: 15px;
    }
    .product-title {
      font-size: 1.1em;
      margin: 0 0 10px 0;
      color: #333;
      height: 2.4em;
      overflow: hidden;
    }
    .product-description {
      color: #666;
      font-size: 0.9em;
      margin: 10px 0;
      height: 3em;
      overflow: hidden;
    }
    .product-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 0;
    }
    .stars {
      color: #ffc107;
    }
    .rating-text {
      font-size: 0.9em;
      color: #666;
    }
    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }
    .price {
      font-size: 1.3em;
      font-weight: bold;
      color: #4caf50;
    }
    .add-to-cart-btn {
      background: #2196f3;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
    }
    .add-to-cart-btn:hover {
      background: #1976d2;
    }
    .cart-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 450px;
      height: 100vh;
      background: white;
      box-shadow: -4px 0 12px rgba(0,0,0,0.15);
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }
    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    .cart-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
    .cart-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .cart-item img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
    }
    .item-details {
      flex: 1;
    }
    .item-details h4 {
      margin: 0 0 4px 0;
      font-size: 0.9em;
    }
    .item-price {
      color: #666;
      font-size: 0.8em;
    }
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .quantity-controls button {
      width: 28px;
      height: 28px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    .item-subtotal {
      font-weight: bold;
      color: #4caf50;
      min-width: 60px;
      text-align: right;
    }
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2em;
    }
    .cart-footer {
      border-top: 1px solid #eee;
      padding: 20px;
    }
    .cart-total {
      font-size: 1.2em;
      margin-bottom: 15px;
      text-align: center;
    }
    .cart-actions {
      display: flex;
      gap: 10px;
    }
    .cart-actions button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
    }
    .checkout-btn {
      background: #4caf50;
      color: white;
    }
  `]
})
export class EcommerceComponent implements OnInit {
  store = inject(ProductsStore);
  searchTerm = '';
  showCart = false;
  
  ngOnInit() {
    // Cargar productos al inicializar - como abrir la tienda
    this.store.loadProducts();
  }
  
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.store.searchProducts(value);
  }
  
  onCategoryChange(event: Event) {
    const category = (event.target as HTMLSelectElement).value;
    if (category) {
      this.store.loadProductsByCategory(category);
    } else {
      this.store.loadProducts();
    }
  }
  
  updateQuantity(productId: number, quantity: number) {
    this.store.updateCartQuantity(productId, quantity);
  }
  
  formatCategory(category: string): string {
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...'
      : text;
  }
  
  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }
}
```

## 🔄 Store Compositions - Combinando Múltiples Almacenes

**Analogía**: *Como un centro comercial con diferentes tiendas especializadas que se comunican*

```typescript
// Store de autenticación - como el servicio de seguridad del centro comercial
export const AuthStore = signalStore(
  { providedIn: 'root' },
  
  withState<{
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
  }>({
    user: null,
    isAuthenticated: false,
    loading: false
  }),
  
  withComputed((store) => ({
    userRole: computed(() => store.user()?.role || 'guest'),
    canAccessAdmin: computed(() => store.user()?.role === 'admin'),
    userName: computed(() => store.user()?.name || 'Usuario')
  })),
  
  withMethods((store, http = inject(HttpClient)) => ({
    login: rxMethod<{ email: string; password: string }>(
      pipe(
        switchMap(credentials => {
          store.patchState({ loading: true });
      
          return http.post<User>('/api/auth/login', credentials).pipe(
            map(user => {
              store.patchState({
                user,
                isAuthenticated: true,
                loading: false
              });
          
              // Notificar a otros stores
              inject(NotificationStore).addNotification({
                type: 'success',
                message: `¡Bienvenido, ${user.name}!`
              });
            }),
            catchError(error => {
              store.patchState({ loading: false });
              inject(NotificationStore).addNotification({
                type: 'error',
                message: 'Error al iniciar sesión'
              });
              return of(null);
            })
          );
        })
      )
    ),
  
    logout(): void {
      store.patchState({
        user: null,
        isAuthenticated: false
      });
  
      // Limpiar otros stores relacionados
      inject(ProductsStore).clearCart();
      inject(NotificationStore).addNotification({
        type: 'info',
        message: 'Sesión cerrada correctamente'
      });
    }
  }))
);

// Store de notificaciones - como el sistema de altavoces del centro comercial
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  autoHide?: boolean;
}

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  
  withState<{
    notifications: Notification[];
  }>({
    notifications: []
  }),
  
  withComputed((store) => ({
    activeNotifications: computed(() => 
      store.notifications().filter(n => 
        !n.autoHide || 
        (new Date().getTime() - n.timestamp.getTime()) < 5000
      )
    ),
    hasErrors: computed(() => 
      store.notifications().some(n => n.type === 'error')
    )
  })),
  
  withMethods((store) => ({
    addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        autoHide: notification.autoHide ?? true
      };
  
      store.patchState({
        notifications: [newNotification, ...store.notifications()]
      });
  
      // Auto-remove después de 5 segundos si está configurado
      if (newNotification.autoHide) {
        setTimeout(() => {
          this.removeNotification(newNotification.id);
        }, 5000);
      }
    },
  
    removeNotification(id: string): void {
      store.patchState({
        notifications: store.notifications().filter(n => n.id !== id)
      });
    },
  
    clearAll(): void {
      store.patchState({ notifications: [] });
    }
  }))
);

// Store principal que coordina todo - como la administración del centro comercial
export const AppStore = signalStore(
  { providedIn: 'root' },
  
  withState<{
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    currentPage: string;
  }>({
    theme: 'light',
    sidebarOpen: false,
    currentPage: 'home'
  }),
  
  withComputed((store) => {
    const authStore = inject(AuthStore);
    const notificationStore = inject(NotificationStore);
  
    return {
      appTheme: computed(() => ({
        isDark: store.theme() === 'dark',
        className: store.theme() === 'dark' ? 'dark-theme' : 'light-theme'
      })),
  
      navigationState: computed(() => ({
        isOpen: store.sidebarOpen(),
        canToggle: authStore.isAuthenticated(),
        currentPage: store.currentPage()
      })),
  
      appStatus: computed(() => ({
        user: authStore.user(),
        isAuthenticated: authStore.isAuthenticated(),
        hasNotifications: notificationStore.activeNotifications().length > 0,
        hasErrors: notificationStore.hasErrors()
      }))
    };
  }),
  
  withMethods((store) => ({
    toggleTheme(): void {
      const newTheme = store.theme() === 'light' ? 'dark' : 'light';
      store.patchState({ theme: newTheme });
  
      // Guardar preferencia en localStorage
      localStorage.setItem('app-theme', newTheme);
    },
  
    toggleSidebar(): void {
      store.patchState({ 
        sidebarOpen: !store.sidebarOpen() 
      });
    },
  
    navigateTo(page: string): void {
      store.patchState({ 
        currentPage: page,
        sidebarOpen: false // Cerrar sidebar en mobile
      });
    },
  
    initializeApp(): void {
      // Cargar tema guardado
      const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark';
      if (savedTheme) {
        store.patchState({ theme: savedTheme });
      }
  
      // Cargar usuario si hay token
      const token = localStorage.getItem('auth-token');
      if (token) {
        // Validar token y cargar usuario
        inject(AuthStore).validateToken(token);
      }
    }
  }))
);
```

## 🧪 Testing de Signal Stores

**Analogía**: *Como hacer inspecciones de calidad en cada departamento de la fábrica*

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductsStore } from './products.store';

describe('ProductsStore', () => {
  let store: InstanceType<typeof ProductsStore>;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsStore,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
  
    store = TestBed.inject(ProductsStore);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  describe('Estado inicial', () => {
    it('debería tener el estado inicial correcto', () => {
      // Como verificar que la tienda está vacía al abrir
      expect(store.products()).toEqual([]);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.cart()).toEqual([]);
      expect(store.isEmpty()).toBe(true);
    });
  });
  
  describe('Cargar productos', () => {
    it('debería cargar productos exitosamente', () => {
      const mockProducts = [
        { id: 1, title: 'Test Product', price: 10, category: 'test' }
      ];
  
      // Ejecutar la acción - como hacer un pedido al proveedor
      store.loadProducts();
  
      // Verificar que se inició la carga
      expect(store.loading()).toBe(true);
  
      // Simular respuesta del servidor
      const req = httpMock.expectOne('https://fakestoreapi.com/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
  
      // Verificar el estado final - como confirmar que llegó el pedido
      expect(store.loading()).toBe(false);
      expect(store.products()).toEqual(mockProducts);
      expect(store.error()).toBeNull();
      expect(store.isEmpty()).toBe(false);
    });
  
    it('debería manejar errores de carga', () => {
      // Ejecutar la acción
      store.loadProducts();
  
      // Simular error del servidor
      const req = httpMock.expectOne('https://fakestoreapi.com/products');
      req.error(new ErrorEvent('Network error'));
  
      // Verificar manejo del error
      expect(store.loading()).toBe(false);
      expect(store.error()).toContain('Error al cargar productos');
      expect(store.products()).toEqual([]);
    });
  });
  
  describe('Carrito de compras', () => {
    beforeEach(() => {
      // Setup inicial con productos
      store.patchState({
        products: [
          { id: 1, title: 'Product 1', price: 10 },
          { id: 2, title: 'Product 2', price: 20 }
        ]
      });
    });
  
    it('debería agregar productos al carrito', () => {
      // Como agregar productos a la canasta
      store.addToCart(1, 2);
  
      expect(store.cart()).toEqual([
        { productId: 1, quantity: 2 }
      ]);
      expect(store.isCartEmpty()).toBe(false);
    });
  
    it('debería incrementar cantidad si el producto ya existe', () => {
      // Agregar producto inicial
      store.addToCart(1, 1);
      // Agregar más del mismo producto
      store.addToCart(1, 2);
  
      expect(store.cart()).toEqual([
        { productId: 1, quantity: 3 }
      ]);
    });
  
    it('debería calcular estadísticas del carrito correctamente', () => {
      store.addToCart(1, 2); // 2 x $10 = $20
      store.addToCart(2, 1); // 1 x $20 = $20
  
      const stats = store.cartStats();
  
      expect(stats.totalItems).toBe(3);
      expect(stats.totalPrice).toBe(40);
      expect(stats.items).toHaveLength(2);
    });
  
    it('debería remover productos del carrito', () => {
      store.addToCart(1, 2);
      store.addToCart(2, 1);
  
      store.removeFromCart(1);
  
      expect(store.cart()).toEqual([
        { productId: 2, quantity: 1 }
      ]);
    });
  
    it('debería limpiar el carrito completamente', () => {
      store.addToCart(1, 2);
      store.addToCart(2, 1);
  
      store.clearCart();
  
      expect(store.cart()).toEqual([]);
      expect(store.isCartEmpty()).toBe(true);
    });
  });
  
  describe('Filtros y búsqueda', () => {
    beforeEach(() => {
      store.patchState({
        products: [
          { id: 1, title: 'iPhone 13', category: 'electronics', description: 'Apple smartphone' },
          { id: 2, title: 'Samsung TV', category: 'electronics', description: 'Smart TV 4K' },
          { id: 3, title: 'Nike Shoes', category: 'clothing', description: 'Running shoes' }
        ]
      });
    });
  
    it('debería filtrar productos por término de búsqueda', () => {
      store.searchProducts('iPhone');
  
      const filtered = store.filteredProducts();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('iPhone 13');
    });
  
    it('debería filtrar productos por categoría', () => {
      store.setCategory('electronics');
  
      const filtered = store.filteredProducts();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(p => p.category === 'electronics')).toBe(true);
    });
  
    it('debería combinar filtros de búsqueda y categoría', () => {
      store.searchProducts('TV');
      store.setCategory('electronics');
  
      const filtered = store.filteredProducts();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Samsung TV');
    });
  
    it('debería limpiar todos los filtros', () => {
      store.searchProducts('iPhone');
      store.setCategory('electronics');
  
      store.clearFilters();
  
      expect(store.searchTerm()).toBe('');
      expect(store.selectedCategory()).toBe('');
      expect(store.filteredProducts()).toHaveLength(3);
    });
  });
  
  describe('Computed values', () => {
    it('debería calcular categorías disponibles', () => {
      store.patchState({
        products: [
          { id: 1, category: 'electronics' },
          { id: 2, category: 'clothing' },
          { id: 3, category: 'electronics' }
        ]
      });
  
      const categories = store.availableCategories();
      expect(categories).toEqual(['clothing', 'electronics']);
    });
  
    it('debería detectar cuando no hay resultados', () => {
      store.patchState({
        products: [
          { id: 1, title: 'Product 1' }
        ]
      });
  
      store.searchProducts('nonexistent');
  
      expect(store.hasResults()).toBe(false);
    });
  });
});

// Test de integración - como probar toda la cadena de montaje
describe('ProductsStore Integration', () => {
  let store: InstanceType<typeof ProductsStore>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsStore,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
  
    store = TestBed.inject(ProductsStore);
  });
  
  it('debería manejar un flujo completo de e-commerce', async () => {
    // 1. Estado inicial
    expect(store.isEmpty()).toBe(true);
    expect(store.isCartEmpty()).toBe(true);
  
    // 2. Simular carga de productos
    store.patchState({
      products: [
        { id: 1, title: 'Product 1', price: 10, category: 'test' },
        { id: 2, title: 'Product 2', price: 20, category: 'test' }
      ]
    });
  
    // 3. Verificar productos cargados
    expect(store.isEmpty()).toBe(false);
    expect(store.hasResults()).toBe(true);
  
    // 4. Agregar productos al carrito
    store.addToCart(1, 2);
    store.addToCart(2, 1);
  
    // 5. Verificar carrito
    expect(store.isCartEmpty()).toBe(false);
    expect(store.cartStats().totalItems).toBe(3);
    expect(store.cartStats().totalPrice).toBe(40);
  
    // 6. Aplicar filtros
    store.searchProducts('Product 1');
    expect(store.filteredProducts()).toHaveLength(1);
  
    // 7. Limpiar filtros
    store.clearFilters();
    expect(store.filteredProducts()).toHaveLength(2);
  
    // 8. Simular checkout
    store.clearCart();
    expect(store.isCartEmpty()).toBe(true);
  });
});
```

## 🏆 Patrones Avanzados y Mejores Prácticas

### 1. Store con Persistencia Local

```typescript
// Store que se sincroniza con localStorage - como una caja registradora que guarda todo
export const PersistentCounterStore = signalStore(
  { providedIn: 'root' },
  
  withState(() => {
    // Cargar estado inicial desde localStorage
    const saved = localStorage.getItem('counter-state');
    const initialState = saved ? JSON.parse(saved) : { count: 0 };
  
    return {
      count: initialState.count,
      lastSaved: new Date()
    };
  }),
  
  withMethods((store) => ({
    increment(): void {
      const newCount = store.count() + 1;
      store.patchState({ 
        count: newCount,
        lastSaved: new Date()
      });
      this.saveToStorage();
    },
  
    decrement(): void {
      const newCount = store.count() - 1;
      store.patchState({ 
        count: newCount,
        lastSaved: new Date()
      });
      this.saveToStorage();
    },
  
    private saveToStorage(): void {
      const state = {
        count: store.count(),
        lastSaved: store.lastSaved().toISOString()
      };
      localStorage.setItem('counter-state', JSON.stringify(state));
    }
  }))
);
```

### 2. Store con WebSocket - Tiempo Real

```typescript
// Store con datos en tiempo real - como un tablero de aeropuerto
export const RealTimeStore = signalStore(
  { providedIn: 'root' },
  
  withState<{
    messages: Message[];
    connectionStatus: 'connected' | 'disconnected' | 'connecting';
    users: User[];
  }>({
    messages: [],
    connectionStatus: 'disconnected',
    users: []
  }),
  
  withMethods((store) => {
    let websocket: WebSocket | null = null;
  
    return {
      connect(): void {
        if (websocket?.readyState === WebSocket.OPEN) return;
    
        store.patchState({ connectionStatus: 'connecting' });
    
        websocket = new WebSocket('wss://api.example.com/chat');
    
        websocket.onopen = () => {
          store.patchState({ connectionStatus: 'connected' });
        };
    
        websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
      
          switch (data.type) {
            case 'message':
              store.patchState({
                messages: [...store.messages(), data.payload]
              });
              break;
          
            case 'user_joined':
              store.patchState({
                users: [...store.users(), data.payload]
              });
              break;
          
            case 'user_left':
              store.patchState({
                users: store.users().filter(u => u.id !== data.payload.id)
              });
              break;
          }
        };
    
        websocket.onclose = () => {
          store.patchState({ connectionStatus: 'disconnected' });
        };
      },
  
      sendMessage(text: string): void {
        if (websocket?.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({
            type: 'message',
            payload: { text, timestamp: new Date() }
          }));
        }
      },
  
      disconnect(): void {
        websocket?.close();
        websocket = null;
      }
    };
  })
);
```

Esta guía completa te proporciona todo lo necesario para dominar NgRx Signal Component Store en Angular 19. Las analogías del almacén inteligente, Amazon moderno y el centro comercial te ayudan a visualizar cómo funciona el manejo de estado reactivo.

Los ejemplos van desde casos simples hasta aplicaciones complejas de e-commerce con testing incluido. Cada patrón está explicado con analogías de la vida real que hacen que conceptos complejos sean fáciles de entender y recordar.

¿Te gustaría que profundice en algún aspecto específico como migración desde NgRx tradicional, optimización de rendimiento, o integración con otros servicios de Angular?
