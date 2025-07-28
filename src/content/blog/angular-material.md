---
title: 'Negocio Digital'
description: 'Guía Definitiva: Cómo Construir un Negocio Digital de Millones de Dólares'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Guía Maestra de Angular Material - Theming y Customización Avanzada

## Introducción: La Arquitectura del Design System

Angular Material no es solo una librería de componentes; es un **sistema de diseño completo** basado en Material Design 3. Imagina que es como tener un arquitecto que ya diseñó los planos de tu casa, pero tú puedes personalizar colores, materiales y detalles sin comprometer la estructura sólida.

Esta guía te convertirá en un maestro de la customización, desde ajustes básicos hasta transformaciones completamente personalizadas que parecen sistemas de diseño únicos.

---

## CAPÍTULO 1: Fundamentos del Sistema de Theming

### La Anatomía del Theme System

Angular Material v16+ utiliza el **Material Design 3 (M3)** que introduce un sistema de theming mucho más flexible basado en **Design Tokens**.

#### Estructura Básica del Theme

```scss
// styles.scss
@use '@angular/material' as mat;

// 1. Incluir la configuración base
@include mat.core();

// 2. Definir paletas de colores
$my-primary: mat.define-palette(mat.$indigo-palette);
$my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$my-warn: mat.define-palette(mat.$red-palette);

// 3. Crear el theme
$my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: mat.define-typography-config(),
  density: 0
));

// 4. Aplicar el theme
@include mat.all-component-themes($my-theme);
```

### Sistema de Design Tokens M3

Material Design 3 introduce un sistema de tokens más granular:

```scss
// tokens-config.scss
@use '@angular/material' as mat;

// Definir tokens personalizados
$custom-tokens: (
  // Tokens de color del sistema
  (mat.sys-color, (
    primary: #1976d2,
    on-primary: #ffffff,
    primary-container: #bbdefb,
    on-primary-container: #0d47a1,
  
    secondary: #0288d1,
    on-secondary: #ffffff,
    secondary-container: #b3e5fc,
    on-secondary-container: #01579b,
  
    // Superficie y fondos
    surface: #fafafa,
    on-surface: #212121,
    surface-variant: #f5f5f5,
    on-surface-variant: #424242,
  
    // Estados de interacción
    outline: #757575,
    outline-variant: #bdbdbd,
  )),
  
  // Tokens de tipografía
  (mat.sys-typescale, (
    headline-large-font-size: 32px,
    headline-large-line-height: 40px,
    headline-large-font-weight: 400,
  
    body-large-font-size: 16px,
    body-large-line-height: 24px,
    body-large-font-weight: 400,
  )),
  
  // Tokens de forma
  (mat.sys-shape, (
    corner-small: 8px,
    corner-medium: 12px,
    corner-large: 16px,
    corner-extra-large: 28px,
  ))
);

// Aplicar tokens personalizados
$custom-theme: mat.define-theme((
  color: $custom-tokens
));
```

---

## CAPÍTULO 2: Customización de Paletas de Colores Profesional

### Creando Paletas Corporativas

En el mundo real, necesitas adaptar Material Design a la identidad visual de tu empresa:

```scss
// corporate-theme.scss
@use '@angular/material' as mat;
@use 'sass:map';

// Paleta corporativa personalizada basada en brand guidelines
$corporate-primary-palette: (
  50: #e3f2fd,
  100: #bbdefb,
  200: #90caf9,
  300: #64b5f6,
  400: #42a5f5,
  500: #2196f3,  // Color principal del brand
  600: #1e88e5,
  700: #1976d2,
  800: #1565c0,
  900: #0d47a1,
  A100: #82b1ff,
  A200: #448aff,
  A400: #2979ff,
  A700: #2962ff,
  contrast: (
    50: rgba(black, 0.87),
    100: rgba(black, 0.87),
    200: rgba(black, 0.87),
    300: rgba(black, 0.87),
    400: rgba(black, 0.87),
    500: white,
    600: white,
    700: white,
    800: white,
    900: white,
    A100: rgba(black, 0.87),
    A200: white,
    A400: white,
    A700: white,
  )
);

// Función helper para generar paletas desde un color base
@function generate-palette($base-color) {
  @return (
    50: lighten($base-color, 45%),
    100: lighten($base-color, 35%),
    200: lighten($base-color, 25%),
    300: lighten($base-color, 15%),
    400: lighten($base-color, 8%),
    500: $base-color,
    600: darken($base-color, 8%),
    700: darken($base-color, 15%),
    800: darken($base-color, 25%),
    900: darken($base-color, 35%),
    A100: lighten($base-color, 30%),
    A200: lighten($base-color, 10%),
    A400: $base-color,
    A700: darken($base-color, 10%),
    contrast: (
      50: rgba(black, 0.87),
      100: rgba(black, 0.87),
      200: rgba(black, 0.87),
      300: rgba(black, 0.87),
      400: rgba(black, 0.87),
      500: if(lightness($base-color) > 50%, rgba(black, 0.87), white),
      600: white,
      700: white,
      800: white,
      900: white,
      A100: rgba(black, 0.87),
      A200: if(lightness($base-color) > 50%, rgba(black, 0.87), white),
      A400: if(lightness($base-color) > 50%, rgba(black, 0.87), white),
      A700: white,
    )
  );
}

// Aplicación práctica para un banco
$bank-blue: #003d7a;
$bank-gold: #ffd700;
$bank-gray: #6c757d;

$bank-primary: mat.define-palette(generate-palette($bank-blue));
$bank-accent: mat.define-palette(generate-palette($bank-gold));
$bank-warn: mat.define-palette(mat.$red-palette);

$bank-theme: mat.define-light-theme((
  color: (
    primary: $bank-primary,
    accent: $bank-accent,
    warn: $bank-warn,
  )
));
```

### Multi-Theme Support para Aplicaciones Enterprise

```scss
// multi-theme-system.scss

// Theme corporativo principal
$corporate-theme: mat.define-light-theme((
  color: (
    primary: mat.define-palette($corporate-primary-palette),
    accent: mat.define-palette($corporate-gold-palette),
    warn: mat.define-palette(mat.$red-palette),
  )
));

// Theme oscuro corporativo
$corporate-dark-theme: mat.define-dark-theme((
  color: (
    primary: mat.define-palette($corporate-primary-palette, 200),
    accent: mat.define-palette($corporate-gold-palette, 200),
    warn: mat.define-palette(mat.$red-palette, 300),
  )
));

// Theme de alto contraste para accesibilidad
$high-contrast-theme: mat.define-light-theme((
  color: (
    primary: mat.define-palette((
      500: #000000,
      contrast: (500: #ffffff)
    )),
    accent: mat.define-palette((
      500: #ffffff,
      contrast: (500: #000000)
    )),
    warn: mat.define-palette((
      500: #ff0000,
      contrast: (500: #ffffff)
    )),
  )
));

// Aplicación condicional de themes
.corporate-theme {
  @include mat.all-component-themes($corporate-theme);
}

.corporate-dark-theme {
  @include mat.all-component-themes($corporate-dark-theme);
}

.high-contrast-theme {
  @include mat.all-component-themes($high-contrast-theme);
}
```

---

## CAPÍTULO 3: Customización de Tipografía Avanzada

### Sistema Tipográfico Corporativo

```scss
// typography-system.scss
@use '@angular/material' as mat;

// Importar fuentes corporativas
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

// Configuración tipográfica personalizada
$custom-typography: mat.define-typography-config(
  $font-family: '"Inter", "Helvetica Neue", sans-serif',
  
  // Headlines
  $headline-1: mat.define-typography-level(112px, 112px, 300, $letter-spacing: -0.05em),
  $headline-2: mat.define-typography-level(56px, 56px, 400, $letter-spacing: -0.02em),
  $headline-3: mat.define-typography-level(45px, 48px, 400, $letter-spacing: -0.005em),
  $headline-4: mat.define-typography-level(34px, 40px, 400),
  $headline-5: mat.define-typography-level(24px, 32px, 500),
  $headline-6: mat.define-typography-level(20px, 32px, 600),
  
  // Body text
  $body-1: mat.define-typography-level(16px, 24px, 400, $letter-spacing: 0.03em),
  $body-2: mat.define-typography-level(14px, 20px, 400, $letter-spacing: 0.03em),
  
  // UI Elements
  $subtitle-1: mat.define-typography-level(16px, 28px, 500),
  $subtitle-2: mat.define-typography-level(14px, 22px, 600),
  $button: mat.define-typography-level(14px, 36px, 600, $letter-spacing: 0.05em),
  $caption: mat.define-typography-level(12px, 20px, 400, $letter-spacing: 0.03em),
  $overline: mat.define-typography-level(10px, 32px, 500, $letter-spacing: 0.15em),
  
  // Código (para aplicaciones técnicas)
  $input: mat.define-typography-level(inherit, 1.125, 400, '"JetBrains Mono", monospace')
);

// Aplicar tipografía personalizada al theme
$themed-typography: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: $custom-typography,
  density: 0
));

// Classes utility para tipografía custom
.mat-headline-1 { @include mat.typography-level($custom-typography, headline-1); }
.mat-headline-2 { @include mat.typography-level($custom-typography, headline-2); }
.mat-body-strong { 
  @include mat.typography-level($custom-typography, body-1);
  font-weight: 600;
}
.mat-code {
  font-family: 'JetBrains Mono', monospace;
  background-color: rgba(0, 0, 0, 0.04);
  padding: 2px 4px;
  border-radius: 4px;
}
```

---

## CAPÍTULO 4: Density System - Adaptación a Diferentes Contextos

### Configuración de Densidad Contextual

```scss
// density-system.scss

// Densidad para aplicaciones de escritorio (más compacta)
$desktop-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: $custom-typography,
  density: -2  // Máxima compactación
));

// Densidad para tablets
$tablet-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: $custom-typography,
  density: -1
));

// Densidad para móviles (más espaciosa)
$mobile-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: $custom-typography,
  density: 0  // Densidad estándar
));

// Aplicación responsive de densidad
@media (max-width: 599px) {
  @include mat.all-component-themes($mobile-theme);
}

@media (min-width: 600px) and (max-width: 1279px) {
  @include mat.all-component-themes($tablet-theme);
}

@media (min-width: 1280px) {
  @include mat.all-component-themes($desktop-theme);
}
```

---

## CAPÍTULO 5: Customización Profunda de Componentes

### Button Component - Desde Básico hasta Avanzado

```scss
// custom-button.scss
@use '@angular/material' as mat;
@use 'sass:map';

// Customización básica de botones
.custom-button {
  &.mat-mdc-button {
    // Botón primario corporativo
    &.mat-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      font-weight: 600;
      text-transform: none;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }
    
      &:disabled {
        background: #e0e0e0;
        color: #9e9e9e;
        transform: none;
        box-shadow: none;
      }
    }
  
    // Botón con icono personalizado
    &.icon-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    
      .mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
  
    // Botón de loading
    &.loading-button {
      position: relative;
      color: transparent !important;
    
      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
      }
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// Componente Angular para botón personalizado
```

```typescript
// custom-button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  template: `
    <button 
      mat-button
      [class]="getButtonClasses()"
      [disabled]="disabled || loading"
      (click)="handleClick()"
      [attr.aria-label]="ariaLabel">
    
      <mat-icon *ngIf="icon && !loading" [svgIcon]="icon">{{ icon }}</mat-icon>
    
      <span *ngIf="!loading">
        <ng-content></ng-content>
      </span>
    
      <mat-spinner 
        *ngIf="loading" 
        diameter="16" 
        color="primary">
      </mat-spinner>
    </button>
  `,
  styleUrls: ['./custom-button.component.scss']
})
export class CustomButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'text' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() icon?: string;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() ariaLabel?: string;
  
  @Output() clicked = new EventEmitter<Event>();
  
  getButtonClasses(): string {
    const classes = ['custom-button'];
  
    switch (this.variant) {
      case 'primary':
        classes.push('mat-primary');
        break;
      case 'secondary':
        classes.push('mat-accent');
        break;
      case 'outline':
        classes.push('mat-stroked-button');
        break;
    }
  
    classes.push(`size-${this.size}`);
  
    if (this.icon) classes.push('icon-button');
    if (this.loading) classes.push('loading-button');
  
    return classes.join(' ');
  }
  
  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
```

### Card Component Personalizado

```scss
// custom-card.scss
.custom-card {
  &.mat-mdc-card {
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    overflow: hidden;
  
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
    }
  
    .mat-mdc-card-header {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 24px;
    
      .mat-mdc-card-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 4px;
      }
    
      .mat-mdc-card-subtitle {
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;
      }
    }
  
    .mat-mdc-card-content {
      padding: 24px;
    
      &.with-image {
        padding-top: 0;
      }
    }
  
    .mat-mdc-card-actions {
      padding: 16px 24px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  
    // Variantes del card
    &.variant-outline {
      background: transparent;
      border: 2px solid #e0e0e0;
      box-shadow: none;
    
      &:hover {
        border-color: #2196f3;
        transform: none;
        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
      }
    }
  
    &.variant-elevated {
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
    
      &:hover {
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
      }
    }
  }
}
```

---

## CAPÍTULO 6: Date Picker - Customización Completa

### Configuración Básica del Date Picker

```typescript
// date-picker-config.service.ts
import { Injectable } from '@angular/core';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

// Formatos personalizados para diferentes locales
export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['DD/MM/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY'],
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// Formatos para diferentes regiones
export const US_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['MM/DD/YYYY', 'MM-DD-YYYY'],
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM/DD/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Injectable()
export class CustomDateAdapter extends MomentDateAdapter {
  
  // Personalizar días de la semana
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'short') {
      return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    }
    if (style === 'narrow') {
      return ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    }
    return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  }
  
  // Personalizar nombres de meses
  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'short') {
      return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
              'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
    return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  }
  
  // Validaciones personalizadas
  isValid(date: moment.Moment): boolean {
    if (!date) return false;
  
    // Validar que no sea weekend (ejemplo para aplicaciones business)
    const dayOfWeek = date.day();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
    // Validar rango de fechas permitidas
    const minDate = moment().subtract(1, 'year');
    const maxDate = moment().add(2, 'years');
  
    return date.isValid() && 
           !isWeekend && 
           date.isBetween(minDate, maxDate, 'day', '[]');
  }
}
```

### Componente Date Picker Personalizado

```typescript
// custom-date-picker.component.ts
import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import * as moment from 'moment';

interface DatePickerConfig {
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  businessDaysOnly?: boolean;
  allowWeekends?: boolean;
  customValidation?: (date: Date) => boolean;
}

@Component({
  selector: 'app-custom-date-picker',
  template: `
    <mat-form-field class="custom-date-picker" [appearance]="appearance">
      <mat-label>{{ config.placeholder || 'Seleccionar fecha' }}</mat-label>
    
      <input 
        matInput 
        [matDatepicker]="picker"
        [formControl]="dateControl"
        [min]="config.minDate"
        [max]="config.maxDate"
        [matDatepickerFilter]="dateFilter"
        readonly>
    
      <mat-hint *ngIf="showHint">{{ getHintText() }}</mat-hint>
    
      <mat-error *ngIf="dateControl.hasError('required')">
        La fecha es requerida
      </mat-error>
      <mat-error *ngIf="dateControl.hasError('matDatepickerMin')">
        La fecha debe ser posterior a {{ config.minDate | date }}
      </mat-error>
      <mat-error *ngIf="dateControl.hasError('matDatepickerMax')">
        La fecha debe ser anterior a {{ config.maxDate | date }}
      </mat-error>
      <mat-error *ngIf="dateControl.hasError('matDatepickerFilter')">
        Fecha no válida
      </mat-error>
    
      <mat-datepicker-toggle matSuffix [for]="picker">
        <mat-icon matDatepickerToggleIcon>calendar_today</mat-icon>
      </mat-datepicker-toggle>
    
      <mat-datepicker 
        #picker
        [dateClass]="dateClass"
        [startAt]="startDate"
        (opened)="onPickerOpened()"
        (closed)="onPickerClosed()">
      </mat-datepicker>
    </mat-form-field>
  `,
  styleUrls: ['./custom-date-picker.component.scss']
})
export class CustomDatePickerComponent implements OnInit {
  @Input() config: DatePickerConfig = {};
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() showHint = true;
  @Input() startDate?: Date;
  @Input() required = false;
  
  @Output() dateChanged = new EventEmitter<Date | null>();
  @Output() pickerOpened = new EventEmitter<void>();
  @Output() pickerClosed = new EventEmitter<void>();
  
  @ViewChild('picker') picker!: MatDatepicker<Date>;
  
  dateControl = new FormControl();
  
  ngOnInit(): void {
    if (this.required) {
      this.dateControl.setValidators([this.dateControl.validator]);
    }
  
    this.dateControl.valueChanges.subscribe(date => {
      this.dateChanged.emit(date);
    });
  }
  
  // Filtro personalizado para fechas
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
  
    const momentDate = moment(date);
  
    // Validar días de negocio
    if (this.config.businessDaysOnly) {
      const dayOfWeek = momentDate.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) return false;
    }
  
    // Validar fechas deshabilitadas
    if (this.config.disabledDates) {
      const isDisabled = this.config.disabledDates.some(disabledDate => 
        moment(disabledDate).isSame(momentDate, 'day')
      );
      if (isDisabled) return false;
    }
  
    // Validación personalizada
    if (this.config.customValidation) {
      return this.config.customValidation(date);
    }
  
    return true;
  };
  
  // Clases CSS personalizadas para fechas
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const momentDate = moment(cellDate);
  
    // Fechas destacadas
    if (this.config.highlightedDates) {
      const isHighlighted = this.config.highlightedDates.some(highlightedDate =>
        moment(highlightedDate).isSame(momentDate, 'day')
      );
      if (isHighlighted) return 'highlighted-date';
    }
  
    // Fines de semana
    const dayOfWeek = momentDate.day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'weekend-date';
    }
  
    // Fechas especiales (ej: feriados)
    if (this.isHoliday(cellDate)) {
      return 'holiday-date';
    }
  
    return '';
  };
  
  private isHoliday(date: Date): boolean {
    // Lógica para determinar feriados
    // Esto podría venir de un servicio externo
    const holidays = [
      '2024-01-01', // Año Nuevo
      '2024-05-01', // Día del Trabajador
      '2024-12-25', // Navidad
    ];
  
    const dateStr = moment(date).format('YYYY-MM-DD');
    return holidays.includes(dateStr);
  }
  
  getHintText(): string {
    if (this.config.businessDaysOnly) {
      return 'Solo días laborables';
    }
    return 'Seleccione una fecha';
  }
  
  onPickerOpened(): void {
    this.pickerOpened.emit();
  }
  
  onPickerClosed(): void {
    this.pickerClosed.emit();
  }
  
  // Métodos públicos para control programático
  openPicker(): void {
    this.picker.open();
  }
  
  closePicker(): void {
    this.picker.close();
  }
  
  setDate(date: Date | null): void {
    this.dateControl.setValue(date);
  }
  
  getDate(): Date | null {
    return this.dateControl.value;
  }
  
  clearDate(): void {
    this.dateControl.setValue(null);
  }
}
```

### Estilos Avanzados para Date Picker

```scss
// custom-date-picker.component.scss
.custom-date-picker {
  width: 100%;
  
  .mat-mdc-form-field {
    width: 100%;
  }
  
  // Customizar el input
  .mat-mdc-input-element {
    cursor: pointer;
    caret-color: transparent;
  }
  
  // Personalizar el ícono del toggle
  .mat-datepicker-toggle {
    .mat-icon {
      color: #666;
      transition: color 0.3s ease;
    }
  
    &:hover .mat-icon {
      color: #2196f3;
    }
  }
}

// Estilos globales para el calendario
:global {
  .mat-datepicker-popup {
    .mat-calendar {
      width: 320px;
    
      // Header del calendario
      .mat-calendar-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px;
      
        .mat-calendar-period-button {
          color: white;
          font-weight: 600;
        
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        }
      
        .mat-calendar-previous-button,
        .mat-calendar-next-button {
          color: white;
        
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        }
      }
    
      // Body del calendario
      .mat-calendar-content {
        padding: 16px;
      
        // Días de la semana
        .mat-calendar-table-header {
          th {
            color: #666;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
        }
      
        // Días del mes
        .mat-calendar-body-cell {
          position: relative;
        
          .mat-calendar-body-cell-content {
            border-radius: 50%;
            transition: all 0.3s ease;
          
            &:hover {
              background: rgba(102, 126, 234, 0.1);
              transform: scale(1.1);
            }
          }
        
          // Día seleccionado
          &.mat-calendar-body-selected .mat-calendar-body-cell-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
          }
        
          // Día de hoy
          &.mat-calendar-body-today:not(.mat-calendar-body-selected) {
            .mat-calendar-body-cell-content {
              border: 2px solid #667eea;
              font-weight: 600;
            }
          }
        
          // Fechas destacadas (custom class)
          &.highlighted-date .mat-calendar-body-cell-content {
            background: #fff3cd;
            color: #856404;
            font-weight: 600;
          
            &::after {
              content: '';
              position: absolute;
              bottom: 2px;
              left: 50%;
              transform: translateX(-50%);
              width: 4px;
              height: 4px;
              background: #ffc107;
              border-radius: 50%;
            }
          }
        
          // Fines de semana
          &.weekend-date .mat-calendar-body-cell-content {
            color: #757575;
          }
        
          // Feriados
          &.holiday-date .mat-calendar-body-cell-content {
            background: #ffebee;
            color: #c62828;
            font-weight: 600;
          
            &::before {
              content: '🎉';
              position: absolute;
              top: -2px;
              right: -2px;
              font-size: 8px;
            }
          }
        
          // Fechas deshabilitadas
          &.mat-calendar-body-disabled .mat-calendar-body-cell-content {
            background: transparent;
            color: #bdbdbd;
            text-decoration: line-through;
          }
        }
      }
    }
  }
}
```

### Date Range Picker Personalizado

```typescript
// date-range-picker.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';

interface DateRangeConfig {
  placeholder?: {
    start: string;
    end: string;
  };
  minDate?: Date;
  maxDate?: Date;
  maxRangeDays?: number;
  presetsEnabled?: boolean;
  customPresets?: DateRangePreset[];
}

interface DateRangePreset {
  label: string;
  range: DateRange<Date>;
  icon?: string;
}

@Component({
  selector: 'app-date-range-picker',
  template: `
    <div class="date-range-container">
      <!-- Presets -->
      <div class="date-presets" *ngIf="config.presetsEnabled">
        <h4>Rangos rápidos</h4>
        <div class="preset-buttons">
          <button 
            *ngFor="let preset of allPresets"
            mat-button
            class="preset-button"
            [class.active]="isPresetActive(preset)"
            (click)="selectPreset(preset)">
            <mat-icon *ngIf="preset.icon">{{ preset.icon }}</mat-icon>
            {{ preset.label }}
          </button>
        </div>
      </div>
    
      <!-- Date Range Picker -->
      <mat-form-field appearance="outline" class="date-range-field">
        <mat-label>Rango de fechas</mat-label>
        <mat-date-range-input [formGroup]="rangeForm" [rangePicker]="picker">
          <input 
            matStartDate 
            formControlName="start" 
            [placeholder]="config.placeholder?.start || 'Fecha inicio'">
          <input 
            matEndDate 
            formControlName="end" 
            [placeholder]="config.placeholder?.end || 'Fecha fin'">
        </mat-date-range-input>
        <mat-hint>DD/MM/YYYY – DD/MM/YYYY</mat-hint>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-date-range-picker #picker></mat-date-range-picker>
      
        <mat-error *ngIf="rangeForm.controls.start.hasError('matStartDateInvalid')">
          Fecha de inicio inválida
        </mat-error>
        <mat-error *ngIf="rangeForm.controls.end.hasError('matEndDateInvalid')">
          Fecha de fin inválida
        </mat-error>
        <mat-error *ngIf="rangeForm.hasError('matDateRangeInvalid')">
          El rango de fechas es inválido
        </mat-error>
      </mat-form-field>
    
      <!-- Actions -->
      <div class="range-actions">
        <button mat-button (click)="clearRange()">
          <mat-icon>clear</mat-icon>
          Limpiar
        </button>
        <button mat-raised-button color="primary" (click)="applyRange()">
          <mat-icon>check</mat-icon>
          Aplicar
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  @Input() config: DateRangeConfig = {};
  @Output() rangeChanged = new EventEmitter<DateRange<Date>>();
  
  rangeForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  
  defaultPresets: DateRangePreset[] = [
    {
      label: 'Hoy',
      range: new DateRange(new Date(), new Date()),
      icon: 'today'
    },
    {
      label: 'Ayer',
      range: new DateRange(
        new Date(Date.now() - 24 * 60 * 60 * 1000),
        new Date(Date.now() - 24 * 60 * 60 * 1000)
      ),
      icon: 'yesterday'
    },
    {
      label: 'Últimos 7 días',
      range: new DateRange(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        new Date()
      ),
      icon: 'date_range'
    },
    {
      label: 'Últimos 30 días',
      range: new DateRange(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
      ),
      icon: 'calendar_month'
    },
    {
      label: 'Este mes',
      range: new DateRange(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date()
      ),
      icon: 'calendar_today'
    },
    {
      label: 'Mes anterior',
      range: new DateRange(
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      ),
      icon: 'navigate_before'
    }
  ];
  
  get allPresets(): DateRangePreset[] {
    return [...this.defaultPresets, ...(this.config.customPresets || [])];
  }
  
  ngOnInit(): void {
    this.rangeForm.valueChanges.subscribe(range => {
      if (range.start && range.end) {
        this.validateRange(range.start, range.end);
      }
    });
  }
  
  private validateRange(start: Date, end: Date): void {
    // Validar rango máximo de días
    if (this.config.maxRangeDays) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
      if (diffDays > this.config.maxRangeDays) {
        this.rangeForm.setErrors({
          maxRangeExceeded: {
            actual: diffDays,
            max: this.config.maxRangeDays
          }
        });
        return;
      }
    }
  
    this.rangeForm.setErrors(null);
  }
  
  selectPreset(preset: DateRangePreset): void {
    this.rangeForm.patchValue({
      start: preset.range.start,
      end: preset.range.end
    });
  }
  
  isPresetActive(preset: DateRangePreset): boolean {
    const current = this.rangeForm.value;
    return current.start?.getTime() === preset.range.start?.getTime() &&
           current.end?.getTime() === preset.range.end?.getTime();
  }
  
  clearRange(): void {
    this.rangeForm.reset();
  }
  
  applyRange(): void {
    const range = this.rangeForm.value;
    if (range.start && range.end) {
      this.rangeChanged.emit(new DateRange(range.start, range.end));
    }
  }
}
```

---

## CAPÍTULO 7: Tabla (Table) - Customización Empresarial

### Data Table Avanzada con Theming

```typescript
// advanced-data-table.component.ts
import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'currency' | 'status' | 'actions';
  format?: string;
  sticky?: boolean;
}

interface TableConfig {
  columns: TableColumn[];
  pageSize?: number;
  pageSizeOptions?: number[];
  multiSelect?: boolean;
  stickyHeader?: boolean;
  rowActions?: boolean;
  exportable?: boolean;
}

@Component({
  selector: 'app-advanced-data-table',
  template: `
    <div class="table-container">
      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <h3>{{ title }}</h3>
          <span class="record-count">{{ dataSource.data.length }} registros</span>
        </div>
      
        <div class="toolbar-right">
          <!-- Filtro global -->
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar</mat-label>
            <input matInput (keyup)="applyFilter($event)" #input>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        
          <!-- Acciones masivas -->
          <div class="bulk-actions" *ngIf="selection.hasValue()">
            <span>{{ selection.selected.length }} seleccionados</span>
            <button mat-button color="warn" (click)="deleteBulk()">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </div>
        
          <!-- Export -->
          <button mat-icon-button [matMenuTriggerFor]="exportMenu" *ngIf="config.exportable">
            <mat-icon>download</mat-icon>
          </button>
          <mat-menu #exportMenu="matMenu">
            <button mat-menu-item (click)="exportToCSV()">
              <mat-icon>description</mat-icon>
              CSV
            </button>
            <button mat-menu-item (click)="exportToExcel()">
              <mat-icon>table_chart</mat-icon>
              Excel
            </button>
          </mat-menu>
        </div>
      </div>
    
      <!-- Tabla -->
      <div class="table-wrapper">
        <table mat-table [dataSource]="dataSource" matSort class="custom-table">
        
          <!-- Columna de selección -->
          <ng-container matColumnDef="select" *ngIf="config.multiSelect">
            <th mat-header-cell *matHeaderCellDef [style.width]="'60px'">
              <mat-checkbox 
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection.hasValue() && isAllSelected()"
                [indeterminate]="selection.hasValue() && !isAllSelected()">
              </mat-checkbox>
            </th>
            <td mat-cell *matCellDef="let row">
              <mat-checkbox 
                (click)="$event.stopPropagation()"
                (change)="$event ? selection.toggle(row) : null"
                [checked]="selection.isSelected(row)">
              </mat-checkbox>
            </td>
          </ng-container>
        
          <!-- Columnas dinámicas -->
          <ng-container *ngFor="let column of config.columns" [matColumnDef]="column.key">
            <th mat-header-cell *matHeaderCellDef 
                [mat-sort-header]="column.sortable ? column.key : undefined"
                [style.width]="column.width"
                [class.sticky-column]="column.sticky">
              {{ column.label }}
            </th>
            <td mat-cell *matCellDef="let element" 
                [class.sticky-column]="column.sticky">
              <ng-container [ngSwitch]="column.type">
              
                <!-- Texto normal -->
                <span *ngSwitchCase="'text'">
                  {{ getColumnValue(element, column.key) }}
                </span>
              
                <!-- Número -->
                <span *ngSwitchCase="'number'" class="number-cell">
                  {{ getColumnValue(element, column.key) | number }}
                </span>
              
                <!-- Fecha -->
                <span *ngSwitchCase="'date'" class="date-cell">
                  {{ getColumnValue(element, column.key) | date:'dd/MM/yyyy' }}
                </span>
              
                <!-- Moneda -->
                <span *ngSwitchCase="'currency'" class="currency-cell">
                  {{ getColumnValue(element, column.key) | currency:'USD':'symbol':'1.2-2' }}
                </span>
              
                <!-- Status -->
                <span *ngSwitchCase="'status'" 
                      class="status-chip"
                      [class]="'status-' + getColumnValue(element, column.key)?.toLowerCase()">
                  {{ getColumnValue(element, column.key) }}
                </span>
              
                <!-- Acciones -->
                <div *ngSwitchCase="'actions'" class="action-buttons">
                  <button mat-icon-button (click)="editRow(element)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteRow(element)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              
                <!-- Default -->
                <span *ngSwitchDefault>
                  {{ getColumnValue(element, column.key) }}
                </span>
              
              </ng-container>
            </td>
          </ng-container>
        
          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: config.stickyHeader"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"
              (click)="rowClicked(row)"
              [class.selected-row]="selection.isSelected(row)"></tr>
        
          <!-- Fila de "no data" -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length">
              <div class="no-data">
                <mat-icon>inbox</mat-icon>
                <p>No hay datos para mostrar</p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    
      <!-- Paginador -->
      <mat-paginator 
        [pageSizeOptions]="config.pageSizeOptions || [5, 10, 20, 50]"
        [pageSize]="config.pageSize || 10"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styleUrls: ['./advanced-data-table.component.scss']
})
export class AdvancedDataTableComponent implements OnInit {
  @Input() title = '';
  @Input() data: any[] = [];
  @Input() config!: TableConfig;
  @Input() loading = false;
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() rowEdit = new EventEmitter<any>();
  @Output() rowDelete = new EventEmitter<any>();
  @Output() bulkDelete = new EventEmitter<any[]>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  
  get displayedColumns(): string[] {
    const columns = this.config.columns.map(col => col.key);
    if (this.config.multiSelect) {
      columns.unshift('select');
    }
    return columns;
  }
  
  ngOnInit(): void {
    this.dataSource.data = this.data;
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  getColumnValue(element: any, key: string): any {
    return key.split('.').reduce((obj, prop) => obj?.[prop], element);
  }
  
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  
  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
  
  rowClicked(row: any): void {
    this.rowClick.emit(row);
  }
  
  editRow(row: any): void {
    this.rowEdit.emit(row);
  }
  
  deleteRow(row: any): void {
    this.rowDelete.emit(row);
  }
  
  deleteBulk(): void {
    this.bulkDelete.emit(this.selection.selected);
    this.selection.clear();
  }
  
  exportToCSV(): void {
    // Implementación de export CSV
    const csvData = this.convertToCSV(this.dataSource.data);
    this.downloadFile(csvData, 'data.csv', 'text/csv');
  }
  
  exportToExcel(): void {
    // Implementación de export Excel (requiere librería como xlsx)
  }
  
  private convertToCSV(data: any[]): string {
    const headers = this.config.columns.map(col => col.label).join(',');
    const rows = data.map(row => 
      this.config.columns.map(col => this.getColumnValue(row, col.key)).join(',')
    );
    return [headers, ...rows].join('\n');
  }
  
  private downloadFile(data: string, filename: string, type: string): void {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
```

### Estilos para Data Table Personalizada

```scss
// advanced-data-table.component.scss
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    background: #fafafa;
    border-bottom: 1px solid #e0e0e0;
  
    .toolbar-left {
      display: flex;
      align-items: baseline;
      gap: 16px;
    
      h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
      }
    
      .record-count {
        font-size: 14px;
        color: #666;
        background: #e3f2fd;
        padding: 4px 12px;
        border-radius: 16px;
      }
    }
  
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    
      .search-field {
        width: 300px;
      
        .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }
      }
    
      .bulk-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: #fff3cd;
        border-radius: 8px;
        border: 1px solid #ffeaa7;
      
        span {
          font-size: 14px;
          color: #856404;
          font-weight: 500;
        }
      }
    }
  }
  
  .table-wrapper {
    overflow-x: auto;
    max-height: 600px;
  
    .custom-table {
      width: 100%;
    
      // Header personalizado
      .mat-mdc-header-row {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      
        .mat-mdc-header-cell {
          color: white;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.5px;
          border-bottom: none;
        
          &.sticky-column {
            position: sticky;
            left: 0;
            z-index: 2;
            background: inherit;
          }
        }
      }
    
      // Filas de datos
      .mat-mdc-row {
        transition: all 0.3s ease;
      
        &:hover {
          background: #f5f5f5;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      
        &.selected-row {
          background: #e3f2fd;
        
          &:hover {
            background: #bbdefb;
          }
        }
      
        .mat-mdc-cell {
          border-bottom: 1px solid #f0f0f0;
        
          &.sticky-column {
            position: sticky;
            left: 0;
            background: inherit;
            z-index: 1;
          }
        
          // Tipos de celda específicos
          &.number-cell {
            text-align: right;
            font-family: 'Roboto Mono', monospace;
            font-weight: 500;
          }
        
          &.date-cell {
            font-family: 'Roboto Mono', monospace;
            font-size: 13px;
          }
        
          &.currency-cell {
            text-align: right;
            font-weight: 600;
            color: #2e7d32;
          }
        
          .status-chip {
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          
            &.status-active {
              background: #c8e6c9;
              color: #2e7d32;
            }
          
            &.status-inactive {
              background: #ffcdd2;
              color: #c62828;
            }
          
            &.status-pending {
              background: #fff3cd;
              color: #856404;
            }
          }
        
          .action-buttons {
            display: flex;
            gap: 4px;
          
            button {
              width: 32px;
              height: 32px;
            
              .mat-icon {
                font-size: 18px;
                width: 18px;
                height: 18px;
              }
            }
          }
        }
      }
    
      // No data row
      .no-data {
        text-align: center;
        padding: 48px 24px;
        color: #666;
      
        .mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: #ccc;
          margin-bottom: 16px;
        }
      
        p {
          margin: 0;
          font-size: 16px;
        }
      }
    }
  }
  
  // Paginador personalizado
  .mat-mdc-paginator {
    border-top: 1px solid #e0e0e0;
    background: #fafafa;
  
    .mat-mdc-paginator-page-size-select {
      .mat-mdc-select-trigger {
        font-size: 14px;
      }
    }
  
    .mat-mdc-paginator-range-label {
      font-size: 14px;
      color: #666;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .table-container {
    .table-toolbar {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    
      .toolbar-right {
        justify-content: space-between;
      
        .search-field {
          width: 100%;
        }
      }
    }
  
    .table-wrapper {
      .custom-table {
        .mat-mdc-header-cell,
        .mat-mdc-cell {
          padding: 8px 4px;
          font-size: 12px;
        
          &:first-child {
            padding-left: 16px;
          }
        
          &:last-child {
            padding-right: 16px;
          }
        }
      }
    }
  }
}
```

---

## CAPÍTULO 8: Form Controls Avanzados

### Select Personalizado con Búsqueda

```typescript
// custom-select.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface Select
```
