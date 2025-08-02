---
title: 'Angular 19 con Signals'
code: 'angular'
description: 'Guía Completa de Angular 19 con Signals: Reactividad Moderna'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa de Angular 19 con Signals: Reactividad Moderna

## 🚦 ¿Qué son las Signals? - La Analogía del Semáforo Inteligente

Las **Signals** en Angular 19 son como **semáforos inteligentes en una ciudad moderna**. Imagina que cada signal es un semáforo que:

* **Anuncia su estado actual** (verde, amarillo, rojo)
* **Notifica automáticamente** cuando cambia
* **Otros semáforos pueden reaccionar** a sus cambios
* **Es eficiente** - solo actualiza lo que realmente necesita cambiar

### Comparación: Signals vs Observables


| Concepto         | Observable (RxJS)             | Signal (Angular 19)                        |
| ---------------- | ----------------------------- | ------------------------------------------ |
| **Analogía**    | Radio FM (stream continuo)    | Termostato (valor actual + notificaciones) |
| **Naturaleza**   | Stream de eventos             | Valor reactivo                             |
| **Suscripción** | Manual (.subscribe())         | Automática                                |
| **Memory Leaks** | Posibles (unsubscribe manual) | No (cleanup automático)                   |
| **Rendimiento**  | Bueno pero complejo           | Excelente y simple                         |

## 🔧 Tipos de Signals en Angular 19

### 1. Signal Básico - El Termostato de Casa

**Analogía**: *Como el termostato que muestra la temperatura actual y la puedes cambiar*

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-temperature',
  standalone: true,
  template: `
    <div class="thermostat">
      <h2>🌡️ Termostato Digital</h2>
      <p>Temperatura actual: {{ temperature() }}°C</p>
  
      <div class="controls">
        <button (click)="decreaseTemp()">❄️ Enfriar</button>
        <button (click)="increaseTemp()">🔥 Calentar</button>
      </div>
  
      <!-- El estado del aire acondicionado cambia automáticamente -->
      <div class="status" [class]="getStatusClass()">
        {{ getStatusMessage() }}
      </div>
    </div>
  `,
  styles: [`
    .thermostat {
      padding: 20px;
      border: 2px solid #ddd;
      border-radius: 10px;
      text-align: center;
    }
    .controls button {
      margin: 0 10px;
      padding: 10px 15px;
    }
    .status {
      margin-top: 15px;
      padding: 10px;
      border-radius: 5px;
    }
    .cold { background-color: #e3f2fd; color: #1976d2; }
    .warm { background-color: #fff3e0; color: #f57c00; }
    .hot { background-color: #ffebee; color: #d32f2f; }
  `]
})
export class TemperatureComponent {
  // Signal básico - como el display del termostato
  temperature = signal(22);
  
  increaseTemp() {
    // Actualizar el signal - como girar la perilla del termostato
    this.temperature.update(temp => temp + 1);
  }
  
  decreaseTemp() {
    this.temperature.update(temp => temp - 1);
  }
  
  getStatusClass(): string {
    const temp = this.temperature();
    if (temp < 18) return 'cold';
    if (temp > 25) return 'hot';
    return 'warm';
  }
  
  getStatusMessage(): string {
    const temp = this.temperature();
    if (temp < 18) return '❄️ Aire acondicionado: FRÍO';
    if (temp > 25) return '🔥 Calefacción: CALIENTE';
    return '😊 Temperatura: PERFECTA';
  }
}
```

### 2. Computed Signals - El Calculador Automático

**Analogía**: *Como una calculadora de propinas que automáticamente recalcula cuando cambias el monto de la cuenta*

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-restaurant-bill',
  standalone: true,
  template: `
    <div class="bill-calculator">
      <h2>🍽️ Calculadora de Restaurante</h2>
  
      <div class="input-group">
        <label>💰 Total de la cuenta:</label>
        <input 
          type="number" 
          [value]="billAmount()" 
          (input)="updateBill($event)"
          placeholder="0.00">
      </div>
  
      <div class="input-group">
        <label>👥 Número de personas:</label>
        <input 
          type="number" 
          [value]="peopleCount()" 
          (input)="updatePeople($event)"
          min="1">
      </div>
  
      <div class="input-group">
        <label>✨ Porcentaje de propina:</label>
        <select [value]="tipPercentage()" (change)="updateTip($event)">
          <option value="10">10% - Servicio básico</option>
          <option value="15">15% - Servicio bueno</option>
          <option value="20">20% - Servicio excelente</option>
          <option value="25">25% - Servicio excepcional</option>
        </select>
      </div>
  
      <!-- Todos estos valores se calculan automáticamente -->
      <div class="results">
        <div class="result-item">
          <span>💸 Propina total:</span>
          <strong>\${{ tipAmount().toFixed(2) }}</strong>
        </div>
        <div class="result-item">
          <span>🧾 Total a pagar:</span>
          <strong>\${{ totalAmount().toFixed(2) }}</strong>
        </div>
        <div class="result-item">
          <span>👤 Por persona:</span>
          <strong>\${{ amountPerPerson().toFixed(2) }}</strong>
        </div>
        <div class="result-item">
          <span>🎯 Propina por persona:</span>
          <strong>\${{ tipPerPerson().toFixed(2) }}</strong>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bill-calculator {
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .input-group {
      margin-bottom: 15px;
    }
    .input-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .input-group input, .input-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .results {
      margin-top: 20px;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    .result-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
  `]
})
export class RestaurantBillComponent {
  // Signals básicos - los valores que el usuario puede cambiar
  billAmount = signal(0);
  peopleCount = signal(1);
  tipPercentage = signal(15);
  
  // Computed signals - se recalculan automáticamente como una hoja de Excel
  tipAmount = computed(() => {
    return (this.billAmount() * this.tipPercentage()) / 100;
  });
  
  totalAmount = computed(() => {
    return this.billAmount() + this.tipAmount();
  });
  
  amountPerPerson = computed(() => {
    return this.totalAmount() / this.peopleCount();
  });
  
  tipPerPerson = computed(() => {
    return this.tipAmount() / this.peopleCount();
  });
  
  updateBill(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.billAmount.set(parseFloat(value) || 0);
  }
  
  updatePeople(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.peopleCount.set(Math.max(1, parseInt(value) || 1));
  }
  
  updateTip(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.tipPercentage.set(parseInt(value));
  }
}
```

### 3. Effect - El Vigilante Automático

**Analogía**: *Como un sistema de seguridad que reacciona automáticamente cuando detecta movimiento*

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-security-system',
  standalone: true,
  template: `
    <div class="security-panel">
      <h2>🏠 Sistema de Seguridad Inteligente</h2>
  
      <div class="sensors">
        <h3>📡 Sensores</h3>
        <div class="sensor-group">
          <label>
            <input 
              type="checkbox" 
              [checked]="motionDetected()"
              (change)="toggleMotion()">
            🚶 Movimiento detectado
          </label>
        </div>
  
        <div class="sensor-group">
          <label>
            <input 
              type="checkbox" 
              [checked]="doorOpen()"
              (change)="toggleDoor()">
            🚪 Puerta abierta
          </label>
        </div>
  
        <div class="sensor-group">
          <label>
            🕐 Hora actual: 
            <select [value]="currentHour()" (change)="updateHour($event)">
              @for (hour of hours; track hour) {
                <option [value]="hour">{{ hour }}:00</option>
              }
            </select>
          </label>
        </div>
      </div>
  
      <div class="status-panel">
        <h3>⚡ Estado del Sistema</h3>
        <div class="alert-level" [class]="alertLevel()">
          {{ getAlertMessage() }}
        </div>
  
        <div class="actions-taken">
          <h4>🎬 Acciones Automatizadas:</h4>
          <ul>
            @for (action of actionLog(); track $index) {
              <li>{{ action }}</li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .security-panel {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 2px solid #333;
      border-radius: 10px;
    }
    .sensors, .status-panel {
      margin-bottom: 20px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .sensor-group {
      margin-bottom: 10px;
    }
    .alert-level {
      padding: 15px;
      border-radius: 5px;
      font-weight: bold;
      text-align: center;
    }
    .safe { background-color: #e8f5e8; color: #2e7d32; }
    .warning { background-color: #fff3e0; color: #f57c00; }
    .danger { background-color: #ffebee; color: #d32f2f; }
    .actions-taken {
      margin-top: 15px;
    }
    .actions-taken ul {
      max-height: 200px;
      overflow-y: auto;
    }
  `]
})
export class SecuritySystemComponent {
  // Signals de estado de sensores
  motionDetected = signal(false);
  doorOpen = signal(false);
  currentHour = signal(14); // 2 PM por defecto
  
  // Log de acciones automatizadas
  actionLog = signal<string[]>([]);
  
  hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Computed signal para determinar el nivel de alerta
  alertLevel = computed(() => {
    const motion = this.motionDetected();
    const door = this.doorOpen();
    const hour = this.currentHour();
    const isNightTime = hour < 6 || hour > 22;
  
    if ((motion || door) && isNightTime) {
      return 'danger';
    } else if (motion || door) {
      return 'warning';
    }
    return 'safe';
  });
  
  constructor() {
    // Effect - como un vigilante de seguridad que siempre está atento
    effect(() => {
      const motion = this.motionDetected();
      const door = this.doorOpen();
      const hour = this.currentHour();
      const isNightTime = hour < 6 || hour > 22;
  
      // Crear timestamp para el log
      const timestamp = new Date().toLocaleTimeString();
  
      // Acciones automáticas basadas en las condiciones
      if (motion && isNightTime) {
        this.addAction(`🚨 ${timestamp} - ALERTA: Movimiento nocturno detectado. Activando luces exteriores.`);
        this.addAction(`📧 ${timestamp} - Enviando notificación push al propietario.`);
        this.addAction(`📹 ${timestamp} - Iniciando grabación de cámaras de seguridad.`);
      } else if (motion) {
        this.addAction(`💡 ${timestamp} - Movimiento detectado. Encendiendo luces de entrada.`);
      }
  
      if (door && isNightTime) {
        this.addAction(`🔔 ${timestamp} - ALERTA: Puerta abierta de noche. Activando alarma.`);
        this.addAction(`📱 ${timestamp} - Llamando automáticamente al propietario.`);
      } else if (door) {
        this.addAction(`🎵 ${timestamp} - Puerta abierta. Reproduciendo melodía de bienvenida.`);
      }
  
      // Limpiar logs antiguos (mantener solo los últimos 10)
      const currentLog = this.actionLog();
      if (currentLog.length > 10) {
        this.actionLog.set(currentLog.slice(-10));
      }
    });
  }
  
  private addAction(action: string) {
    this.actionLog.update(log => [...log, action]);
  }
  
  toggleMotion() {
    this.motionDetected.update(detected => !detected);
  }
  
  toggleDoor() {
    this.doorOpen.update(open => !open);
  }
  
  updateHour(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.currentHour.set(parseInt(value));
  }
  
  getAlertMessage(): string {
    const level = this.alertLevel();
    switch (level) {
      case 'safe':
        return '✅ TODO SEGURO - Sistema en modo normal';
      case 'warning':
        return '⚠️ ATENCIÓN - Actividad detectada durante el día';
      case 'danger':
        return '🚨 ALERTA MÁXIMA - Actividad sospechosa nocturna';
      default:
        return 'Estado desconocido';
    }
  }
}
```

## 🔄 Signal Inputs y Outputs - La Nueva Comunicación Entre Componentes

**Analogía**: *Como walkie-talkies modernos entre departamentos de una empresa*

### Componente Hijo (Departamento de Ventas)

```typescript
import { Component, input, output } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-sales-department',
  standalone: true,
  template: `
    <div class="sales-department">
      <h3>🏪 Departamento de Ventas</h3>
      <p>Empleado: {{ employeeName() }}</p>
      <p>Presupuesto disponible: ${{ budget() }}</p>
  
      <div class="products">
        @for (product of products(); track product.id) {
          <div class="product-card">
            <h4>{{ product.name }}</h4>
            <p>Precio: ${{ product.price }}</p>
            <p>Stock: {{ product.stock }}</p>
            <button 
              (click)="sellProduct(product)"
              [disabled]="product.stock === 0">
              {{ product.stock > 0 ? 'Vender' : 'Agotado' }}
            </button>
          </div>
        }
      </div>
  
      <div class="daily-stats">
        <h4>📊 Estadísticas del Día</h4>
        <p>Ventas realizadas: {{ salesCount() }}</p>
        <p>Ingresos generados: ${{ totalRevenue() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .sales-department {
      padding: 20px;
      border: 2px solid #4caf50;
      border-radius: 8px;
      margin: 10px 0;
    }
    .products {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin: 15px 0;
    }
    .product-card {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: center;
    }
    .product-card button {
      margin-top: 8px;
      padding: 5px 10px;
    }
    .daily-stats {
      margin-top: 15px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
  `]
})
export class SalesDepartmentComponent {
  // Signal Inputs - como recibir información por walkie-talkie
  employeeName = input.required<string>();
  budget = input.required<number>();
  products = input.required<Product[]>();
  
  // Signal Outputs - como enviar reportes por walkie-talkie
  saleCompleted = output<{ productId: number; employeeName: string; revenue: number }>();
  stockAlert = output<{ productId: number; productName: string }>();
  budgetRequest = output<{ amount: number; reason: string }>();
  
  // Estado interno del departamento
  salesCount = signal(0);
  totalRevenue = signal(0);
  
  sellProduct(product: Product) {
    if (product.stock > 0) {
      // Registrar la venta internamente
      this.salesCount.update(count => count + 1);
      this.totalRevenue.update(revenue => revenue + product.price);
  
      // Reportar la venta al departamento principal (Output)
      this.saleCompleted.emit({
        productId: product.id,
        employeeName: this.employeeName(),
        revenue: product.price
      });
  
      // Si el stock es bajo, enviar alerta
      if (product.stock <= 2) {
        this.stockAlert.emit({
          productId: product.id,
          productName: product.name
        });
      }
  
      // Si necesitamos más presupuesto para promociones
      if (this.budget() < 1000) {
        this.budgetRequest.emit({
          amount: 500,
          reason: 'Presupuesto bajo para promociones del mes'
        });
      }
    }
  }
}
```

### Componente Padre (Dirección General)

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-company-headquarters',
  standalone: true,
  imports: [SalesDepartmentComponent],
  template: `
    <div class="headquarters">
      <h2>🏢 Dirección General de la Empresa</h2>
  
      <div class="company-stats">
        <div class="stat-card">
          <h3>💰 Ingresos Totales</h3>
          <p>\${{ companyRevenue() }}</p>
        </div>
        <div class="stat-card">
          <h3>📦 Productos Vendidos</h3>
          <p>{{ totalProductsSold() }}</p>
        </div>
        <div class="stat-card">
          <h3>⚠️ Alertas Activas</h3>
          <p>{{ alerts().length }}</p>
        </div>
      </div>
  
      <!-- Departamento de Ventas recibe información (Inputs) -->
      <app-sales-department
        [employeeName]="salesEmployee()"
        [budget]="salesBudget()"
        [products]="productCatalog()"
        (saleCompleted)="onSaleCompleted($event)"
        (stockAlert)="onStockAlert($event)"
        (budgetRequest)="onBudgetRequest($event)"
      />
  
      <div class="alerts-panel">
        <h3>🚨 Panel de Alertas</h3>
        @if (alerts().length === 0) {
          <p>✅ No hay alertas activas</p>
        } @else {
          <ul>
            @for (alert of alerts(); track $index) {
              <li [class]="alert.type">
                <strong>{{ alert.type.toUpperCase() }}:</strong> {{ alert.message }}
                <small>({{ alert.timestamp }})</small>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `,
  styles: [`
    .headquarters {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      border: 3px solid #2196f3;
      border-radius: 10px;
    }
    .company-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-card {
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
      text-align: center;
    }
    .alerts-panel {
      margin-top: 20px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .alerts-panel ul {
      list-style: none;
      padding: 0;
    }
    .alerts-panel li {
      padding: 8px;
      margin-bottom: 5px;
      border-radius: 4px;
    }
    .alerts-panel li.stock { background-color: #fff3cd; color: #856404; }
    .alerts-panel li.budget { background-color: #d1ecf1; color: #0c5460; }
    .alerts-panel li.sale { background-color: #d4edda; color: #155724; }
  `]
})
export class CompanyHeadquartersComponent {
  // Estado de la empresa
  salesEmployee = signal('María González');
  salesBudget = signal(2500);
  companyRevenue = signal(0);
  totalProductsSold = signal(0);
  alerts = signal<Array<{ type: string; message: string; timestamp: string }>>([]);
  
  productCatalog = signal<Product[]>([
    { id: 1, name: 'Laptop Pro', price: 1200, stock: 5 },
    { id: 2, name: 'Mouse Wireless', price: 25, stock: 15 },
    { id: 3, name: 'Teclado Mecánico', price: 80, stock: 8 },
    { id: 4, name: 'Monitor 4K', price: 300, stock: 3 }
  ]);
  
  // Manejadores de eventos (Outputs del componente hijo)
  onSaleCompleted(event: { productId: number; employeeName: string; revenue: number }) {
    console.log('🎉 Venta completada:', event);
  
    // Actualizar estadísticas de la empresa
    this.companyRevenue.update(revenue => revenue + event.revenue);
    this.totalProductsSold.update(count => count + 1);
  
    // Reducir stock del producto vendido
    this.productCatalog.update(products => 
      products.map(p => 
        p.id === event.productId 
          ? { ...p, stock: p.stock - 1 }
          : p
      )
    );
  
    // Agregar alerta de venta exitosa
    this.addAlert('sale', `Venta de $${event.revenue} realizada por ${event.employeeName}`);
  }
  
  onStockAlert(event: { productId: number; productName: string }) {
    console.log('⚠️ Alerta de stock bajo:', event);
    this.addAlert('stock', `Stock bajo para ${event.productName}. Considerar reabastecimiento.`);
  }
  
  onBudgetRequest(event: { amount: number; reason: string }) {
    console.log('💰 Solicitud de presupuesto:', event);
  
    // Aprobar automáticamente si el monto es razonable
    if (event.amount <= 1000) {
      this.salesBudget.update(budget => budget + event.amount);
      this.addAlert('budget', `Presupuesto de $${event.amount} aprobado. Razón: ${event.reason}`);
    } else {
      this.addAlert('budget', `Solicitud de $${event.amount} requiere aprobación manual. Razón: ${event.reason}`);
    }
  }
  
  private addAlert(type: string, message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.alerts.update(alerts => [...alerts, { type, message, timestamp }]);
  
    // Limpiar alertas antiguas (mantener solo las últimas 5)
    setTimeout(() => {
      this.alerts.update(alerts => alerts.slice(-5));
    }, 10000); // Limpiar después de 10 segundos
  }
}
```

## 🌐 Resource API - Manejo de Datos Asíncronos

**Analogía**: *Como un asistente personal que gestiona todas tus citas y te mantiene informado*

```typescript
import { Component, signal, resource } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  department: string;
  status: 'online' | 'offline' | 'busy';
}

@Component({
  selector: 'app-employee-directory',
  standalone: true,
  template: `
    <div class="employee-directory">
      <h2>👥 Directorio de Empleados</h2>
  
      <div class="search-controls">
        <input 
          type="text"
          placeholder="Buscar empleados..."
          [value]="searchTerm()"
          (input)="updateSearch($event)">
  
        <select [value]="selectedDepartment()" (change)="updateDepartment($event)">
          <option value="">Todos los departamentos</option>
          <option value="engineering">Ingeniería</option>
          <option value="marketing">Marketing</option>
          <option value="sales">Ventas</option>
          <option value="hr">Recursos Humanos</option>
        </select>
  
        <button (click)="refreshData()">🔄 Actualizar</button>
      </div>
  
      <!-- Resource nos da el estado automáticamente -->
      <div class="content">
        @switch (employeesResource.status()) {
          @case ('pending') {
            <div class="loading">
              <div class="spinner"></div>
              <p>🔍 Buscando empleados...</p>
            </div>
          }
    
          @case ('success') {
            <div class="employees-grid">
              @for (employee of employeesResource.value(); track employee.id) {
                <div class="employee-card" [attr.data-status]="employee.status">
                  <div class="avatar">
                    <img [src]="employee.avatar" [alt]="employee.name">
                    <div class="status-indicator" [class]="employee.status"></div>
                  </div>
                  <div class="info">
                    <h3>{{ employee.name }}</h3>
                    <p class="email">{{ employee.email }}</p>
                    <p class="department">{{ employee.department }}</p>
                    <span class="status-text">{{ getStatusText(employee.status) }}</span>
                  </div>
                </div>
              } @empty {
                <div class="empty-state">
                  <p>😔 No se encontraron empleados con esos criterios</p>
                </div>
              }
            </div>
          }
    
          @case ('error') {
            <div class="error-state">
              <h3>❌ Error al cargar empleados</h3>
              <p>{{ employeesResource.error()?.message }}</p>
              <button (click)="refreshData()">Reintentar</button>
            </div>
          }
        }
      </div>
  
      <!-- Estadísticas en tiempo real -->
      @if (employeesResource.status() === 'success') {
        <div class="statistics">
          <h3>📊 Estadísticas</h3>
          <div class="stats-grid">
            <div class="stat">
              <span class="number">{{ employeesResource.value()?.length || 0 }}</span>
              <span class="label">Total empleados</span>
            </div>
            <div class="stat">
              <span class="number">{{ getOnlineCount() }}</span>
              <span class="label">En línea</span>
            </div>
            <div class="stat">
              <span class="number">{{ getBusyCount() }}</span>
              <span class="label">Ocupados</span>
            </div>
            <div class="stat">
              <span class="number">{{ getOfflineCount() }}</span>
              <span class="label">Desconectados</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .employee-directory {
      max-width: 1000px;
      margin: 20px auto;
      padding: 20px;
    }
    .search-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .search-controls input, .search-controls select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .search-controls input {
      flex: 1;
      min-width: 200px;
    }
    .loading {
      text-align: center;
      padding: 40px;
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
    .employees-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
    }
    .employee-card {
      display: flex;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .avatar {
      position: relative;
      margin-right: 15px;
    }
    .avatar img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
    }
    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
    }
    .status-indicator.online { background-color: #4caf50; }
    .status-indicator.busy { background-color: #ff9800; }
    .status-indicator.offline { background-color: #757575; }
    .info h3 {
      margin: 0 0 5px 0;
      color: #333;
    }
    .info p {
      margin: 2px 0;
      color: #666;
      font-size: 0.9em;
    }
    .status-text {
      font-size: 0.8em;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: #f0f0f0;
    }
    .error-state, .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .statistics {
      margin-top: 30px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 15px;
    }
    .stat {
      text-align: center;
    }
    .stat .number {
      display: block;
      font-size: 2em;
      font-weight: bold;
      color: #2196f3;
    }
    .stat .label {
      font-size: 0.9em;
      color: #666;
    }
  `]
})
export class EmployeeDirectoryComponent {
  // Signals para los filtros de búsqueda
  searchTerm = signal('');
  selectedDepartment = signal('');
  
  // Resource - como un asistente que maneja automáticamente las solicitudes
  employeesResource = resource({
    request: () => ({
      search: this.searchTerm(),
      department: this.selectedDepartment()
    }),
    loader: async ({ request }) => {
      // Simular llamada a API - como el asistente haciendo llamadas
      console.log('🔄 Cargando empleados con filtros:', request);
  
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Simular datos de API
      const allEmployees: User[] = [
        {
          id: 1,
          name: 'Ana García',
          email: 'ana.garcia@empresa.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
          department: 'engineering',
          status: 'online'
        },
        {
          id: 2,
          name: 'Carlos López',
          email: 'carlos.lopez@empresa.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
          department: 'marketing',
          status: 'busy'
        },
        {
          id: 3,
          name: 'María Fernández',
          email: 'maria.fernandez@empresa.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
          department: 'sales',
          status: 'offline'
        },
        {
          id: 4,
          name: 'Roberto Silva',
          email: 'roberto.silva@empresa.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
          department: 'hr',
          status: 'online'
        },
        {
          id: 5,
          name: 'Laura Martín',
          email: 'laura.martin@empresa.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
          department: 'engineering',
          status: 'online'
        }
      ];
  
      // Aplicar filtros como el asistente filtraría tus contactos
      let filteredEmployees = allEmployees;
  
      if (request.search) {
        filteredEmployees = filteredEmployees.filter(emp =>
          emp.name.toLowerCase().includes(request.search.toLowerCase()) ||
          emp.email.toLowerCase().includes(request.search.toLowerCase())
        );
      }
  
      if (request.department) {
        filteredEmployees = filteredEmployees.filter(emp =>
          emp.department === request.department
        );
      }
  
      // Simular error ocasional (10% de probabilidad)
      if (Math.random() < 0.1) {
        throw new Error('Error de conexión con el servidor de empleados');
      }
  
      return filteredEmployees;
    }
  });
  
  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
  
  updateDepartment(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedDepartment.set(value);
  }
  
  refreshData() {
    // Resource automáticamente vuelve a cargar cuando lo necesitamos
    this.employeesResource.reload();
  }
  
  getStatusText(status: string): string {
    switch (status) {
      case 'online': return '🟢 En línea';
      case 'busy': return '🟡 Ocupado';
      case 'offline': return '⚫ Desconectado';
      default: return '❓ Desconocido';
    }
  }
  
  getOnlineCount(): number {
    return this.employeesResource.value()?.filter(emp => emp.status === 'online').length || 0;
  }
  
  getBusyCount(): number {
    return this.employeesResource.value()?.filter(emp => emp.status === 'busy').length || 0;
  }
  
  getOfflineCount(): number {
    return this.employeesResource.value()?.filter(emp => emp.status === 'offline').length || 0;
  }
}
```

## 🔄 Migración de Observables a Signals

**Analogía**: *Como cambiar de cartas por correo postal a WhatsApp*

### Antes (RxJS Observables) - Cartas por Correo

```typescript
// ❌ Forma antigua - como cartas por correo postal
@Component({
  selector: 'app-old-way',
  template: `
    <div *ngIf="loading">Cargando...</div>
    <div *ngIf="error">Error: {{ error }}</div>
    <div *ngFor="let item of items">{{ item.name }}</div>
  `
})
export class OldWayComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  
  constructor(private apiService: ApiService) {}
  
  ngOnInit() {
    this.loading = true;
  
    // Complejo manejo de observables - como esperar cartas
    this.apiService.getItems()
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          this.error = err.message;
          this.loading = false;
          return of([]);
        })
      )
      .subscribe(items => {
        this.items = items;
        this.loading = false;
      });
  }
  
  ngOnDestroy() {
    // Manual cleanup - como cancelar suscripción de correo
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Después (Signals + Resource) - WhatsApp Instantáneo

```typescript
// ✅ Forma nueva - como WhatsApp instantáneo
@Component({
  selector: 'app-new-way',
  standalone: true,
  template: `
    @switch (itemsResource.status()) {
      @case ('pending') {
        <div class="loading">📱 Conectando...</div>
      }
      @case ('success') {
        @for (item of itemsResource.value(); track item.id) {
          <div class="item">{{ item.name }}</div>
        }
      }
      @case ('error') {
        <div class="error">❌ {{ itemsResource.error()?.message }}</div>
      }
    }
  `
})
export class NewWayComponent {
  // Simple y automático - como WhatsApp
  itemsResource = resource({
    loader: () => this.apiService.getItems()
  });
  
  constructor(private apiService: ApiService) {}
  
  // No más ngOnDestroy - cleanup automático 🎉
}
```

## 🎯 Patrones Comunes y Mejores Prácticas

### 1. Estado Global con Signals (Service)

**Analogía**: *Como la centralita telefónica de una empresa*

```typescript
import { Injectable, signal, computed } from '@angular/core';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  // Estado privado - como la memoria interna de la centralita
  private _items = signal<CartItem[]>([]);
  private _isOpen = signal(false);
  
  // Señales públicas de solo lectura - como extensiones telefónicas
  items = this._items.asReadonly();
  isOpen = this._isOpen.asReadonly();
  
  // Computed signals - como reportes automáticos de la centralita
  totalItems = computed(() => 
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  totalPrice = computed(() => 
    this._items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  
  isEmpty = computed(() => this._items().length === 0);
  
  // Acciones - como funciones de la centralita
  addItem(product: Omit<CartItem, 'quantity'>) {
    this._items.update(items => {
      const existingItem = items.find(item => item.id === product.id);
  
      if (existingItem) {
        // Incrementar cantidad si ya existe
        return items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Agregar nuevo item
        return [...items, { ...product, quantity: 1 }];
      }
    });
  
    console.log(`📱 Producto "${product.name}" agregado al carrito`);
  }
  
  removeItem(productId: number) {
    this._items.update(items => items.filter(item => item.id !== productId));
    console.log(`🗑️ Producto removido del carrito`);
  }
  
  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
  
    this._items.update(items =>
      items.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }
  
  clearCart() {
    this._items.set([]);
    console.log('🧹 Carrito vaciado');
  }
  
  toggleCart() {
    this._isOpen.update(open => !open);
  }
  
  // Método para checkout
  checkout() {
    const items = this._items();
    const total = this.totalPrice();
  
    console.log('💳 Procesando checkout:', { items, total });
  
    // Simular proceso de checkout
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        this.clearCart();
        resolve(true);
      }, 2000);
    });
  }
}
```

### 2. Componente de Carrito que Usa el Servicio

```typescript
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  template: `
    <div class="cart-container">
      <!-- Botón del carrito -->
      <button 
        class="cart-toggle"
        (click)="cartService.toggleCart()"
        [class.has-items]="!cartService.isEmpty()">
        🛒 Carrito ({{ cartService.totalItems() }})
        @if (!cartService.isEmpty()) {
          <span class="total">\${{ cartService.totalPrice().toFixed(2) }}</span>
        }
      </button>
  
      <!-- Panel del carrito -->
      @if (cartService.isOpen()) {
        <div class="cart-panel">
          <div class="cart-header">
            <h3>🛍️ Tu Carrito</h3>
            <button (click)="cartService.toggleCart()">✕</button>
          </div>
    
          <div class="cart-content">
            @if (cartService.isEmpty()) {
              <div class="empty-cart">
                <p>🛒 Tu carrito está vacío</p>
                <p>¡Agrega algunos productos!</p>
              </div>
            } @else {
              <div class="cart-items">
                @for (item of cartService.items(); track item.id) {
                  <div class="cart-item">
                    <img [src]="item.image" [alt]="item.name">
                    <div class="item-details">
                      <h4>{{ item.name }}</h4>
                      <p class="price">\${{ item.price }}</p>
                    </div>
                    <div class="quantity-controls">
                      <button (click)="decreaseQuantity(item)">−</button>
                      <span>{{ item.quantity }}</span>
                      <button (click)="increaseQuantity(item)">+</button>
                    </div>
                    <button 
                      class="remove-btn"
                      (click)="cartService.removeItem(item.id)">
                      🗑️
                    </button>
                  </div>
                }
              </div>
        
              <div class="cart-footer">
                <div class="total-section">
                  <strong>Total: \${{ cartService.totalPrice().toFixed(2) }}</strong>
                </div>
                <div class="cart-actions">
                  <button 
                    class="clear-btn"
                    (click)="cartService.clearCart()">
                    Vaciar Carrito
                  </button>
                  <button 
                    class="checkout-btn"
                    (click)="checkout()"
                    [disabled]="isCheckingOut()">
                    {{ isCheckingOut() ? 'Procesando...' : 'Comprar' }}
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-container {
      position: relative;
    }
    .cart-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 15px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      z-index: 1000;
    }
    .cart-toggle.has-items {
      background: #4caf50;
      animation: pulse 2s infinite;
    }
    .cart-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100vh;
      background: white;
      box-shadow: -4px 0 8px rgba(0,0,0,0.1);
      z-index: 999;
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
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .cart-item img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }
    .item-details {
      flex: 1;
    }
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .quantity-controls button {
      width: 24px;
      height: 24px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
    }
    .cart-footer {
      border-top: 1px solid #eee;
      padding: 20px;
    }
    .cart-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    .checkout-btn {
      flex: 1;
      padding: 12px;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .clear-btn {
      padding: 12px;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `]
})
export class ShoppingCartComponent {
  isCheckingOut = signal(false);
  
  constructor(public cartService: ShoppingCartService) {}
  
  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }
  
  decreaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity - 1);
  }
  
  async checkout() {
    this.isCheckingOut.set(true);
  
    try {
      const success = await this.cartService.checkout();
      if (success) {
        console.log('✅ Compra realizada exitosamente');
        // Aquí podrías mostrar una notificación de éxito
      }
    } catch (error) {
      console.error('❌ Error en el checkout:', error);
    } finally {
      this.isCheckingOut.set(false);
    }
  }
}
```

## 🏆 Consejos de Rendimiento y Mejores Prácticas

### 1. Optimización de Computed Signals

```typescript
// ✅ BUENO - Computed signals eficientes
export class OptimizedComponent {
  items = signal<Item[]>([]);
  filter = signal('');
  
  // Se recalcula solo cuando items o filter cambian
  filteredItems = computed(() => {
    const items = this.items();
    const filter = this.filter().toLowerCase();
  
    if (!filter) return items;
  
    return items.filter(item => 
      item.name.toLowerCase().includes(filter)
    );
  });
  
  // Computed anidado - se optimiza automáticamente
  expensiveItems = computed(() => 
    this.filteredItems().filter(item => item.price > 100)
  );
}

// ❌ MALO - Calculaciones en el template
@Component({
  template: `
    <!-- Esto se calcula en cada change detection -->
    @for (item of getFilteredItems(); track item.id) {
      <div>{{ item.name }}</div>
    }
  `
})
export class BadComponent {
  getFilteredItems() {
    // Esta función se ejecuta constantemente
    return this.items().filter(item => 
      item.name.includes(this.filter())
    );
  }
}
```

### 2. Evitar Memory Leaks

```typescript
// ✅ BUENO - Effects con cleanup automático
export class CleanComponent {
  constructor() {
    // Effect se limpia automáticamente cuando el componente se destruye
    effect(() => {
      const data = this.someSignal();
  
      // Configurar listeners externos
      const handleResize = () => console.log('Resize:', data);
      window.addEventListener('resize', handleResize);
  
      // Cleanup automático
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });
  }
}

// ❌ MALO - Observables sin cleanup
export class LeakyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    // Requiere cleanup manual
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Manejo de datos
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

Esta guía te proporciona todo lo que necesitas para dominar Angular 19 con Signals. Las analogías te ayudarán a entender los conceptos, mientras que los ejemplos de código te muestran implementaciones reales que puedes usar en tus proyectos.

¿Te gustaría que profundice en algún aspecto específico como la migración desde versiones anteriores, integración con APIs, o patrones avanzados de manejo de estado?
