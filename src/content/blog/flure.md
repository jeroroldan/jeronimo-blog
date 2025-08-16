---
title: 'Sistema de Cumpleaños Automático'
code: "n8n"
description: 'Flujo Completo: n8n → NestJS → WhatsApp/Email'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---




# 🎉 Sistema de Cumpleaños Automático

## 🎯 Flujo Completo: n8n → NestJS → WhatsApp/Email

```
⏰ Cron Diario     🌐 HTTP POST         🏗️ NestJS API        🗄️ PostgreSQL      📱 WhatsApp/Email
(9:00 AM)    ────► (Fecha actual) ────► (Validar BD)  ────► (Cumpleaños) ────► (Felicitaciones)
     │                   │                    │                  │                    │
     │                   │                    │             ✅ Hay match         📨 Enviar
     │                   │                    │             ❌ No match          mensaje
     │                   │                    │                  │                    │
     │                   │                    │◄─────────────────┘              ✅ Enviado
     │                   │◄───────────────────┤                                      │
     │◄──────────────────┤              JSON Response                               │
     │                   │                                                          │
     └───────────────────┴──────────────────────────────────────────────────────────┘
                                    📝 Log resultado en PostgreSQL
```

---

## 🏗️ PARTE 1: Backend NestJS

### 📋 Estructura del Proyecto

```bash
birthday-api/
├── src/
│   ├── birthday/
│   │   ├── birthday.controller.ts
│   │   ├── birthday.service.ts
│   │   ├── birthday.module.ts
│   │   └── dto/
│   │       └── check-birthday.dto.ts
│   ├── database/
│   │   └── entities/
│   │       └── person.entity.ts
│   └── app.module.ts
```

### 🗄️ Entidad de Persona (TypeORM)

```typescript
// src/database/entities/person.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('people')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ type: 'boolean', default: true })
  notifications_enabled: boolean;

  @CreateDateColumn()
  created_at: Date;
}
```

### 📝 DTO para Validación

```typescript
// src/birthday/dto/check-birthday.dto.ts
import { IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CheckBirthdayDto {
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString().split('T')[0])
  date: string; // Formato: YYYY-MM-DD
}
```

### 🎂 Servicio de Cumpleaños

```typescript
// src/birthday/birthday.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../database/entities/person.entity';

@Injectable()
export class BirthdayService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  async checkBirthdays(date: string) {
    try {
      // Extraer día y mes de la fecha (MM-DD)
      const checkDate = new Date(date);
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      
      // Query para buscar cumpleaños de hoy
      const birthdays = await this.personRepository
        .createQueryBuilder('person')
        .where('EXTRACT(MONTH FROM person.birth_date) = :month', { month: parseInt(month) })
        .andWhere('EXTRACT(DAY FROM person.birth_date) = :day', { day: parseInt(day) })
        .andWhere('person.notifications_enabled = :enabled', { enabled: true })
        .getMany();

      if (birthdays.length > 0) {
        // Calcular edad para cada persona
        const birthdayData = birthdays.map(person => {
          const birthYear = new Date(person.birth_date).getFullYear();
          const currentYear = checkDate.getFullYear();
          const age = currentYear - birthYear;
          
          return {
            id: person.id,
            name: person.name,
            email: person.email,
            phone: person.phone,
            birth_date: person.birth_date,
            age: age,
            age_ordinal: this.getOrdinal(age)
          };
        });

        return {
          ok: true,
          has_birthdays: true,
          count: birthdays.length,
          date: date,
          birthdays: birthdayData,
          message: `¡Hoy ${birthdays.length} persona(s) están de cumpleaños!`
        };
      }

      return {
        ok: true,
        has_birthdays: false,
        count: 0,
        date: date,
        birthdays: [],
        message: 'No hay cumpleaños hoy'
      };

    } catch (error) {
      return {
        ok: false,
        error: error.message,
        date: date,
        message: 'Error al verificar cumpleaños'
      };
    }
  }

  private getOrdinal(number: number): string {
    // Función para obtener "1ro", "2do", "3ro", etc.
    const ordinals = {
      1: 'primer', 2: 'segundo', 3: 'tercer', 4: 'cuarto', 5: 'quinto',
      6: 'sexto', 7: 'séptimo', 8: 'octavo', 9: 'noveno', 10: 'décimo'
    };
    
    if (number <= 10) {
      return ordinals[number] || `${number}º`;
    }
    
    return `${number}º`;
  }

  // Método adicional para obtener próximos cumpleaños
  async getUpcomingBirthdays(days: number = 7) {
    const today = new Date();
    const upcoming = [];

    for (let i = 1; i <= days; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      
      const result = await this.checkBirthdays(futureDate.toISOString().split('T')[0]);
      
      if (result.has_birthdays) {
        upcoming.push({
          date: futureDate.toISOString().split('T')[0],
          days_from_now: i,
          ...result
        });
      }
    }

    return {
      ok: true,
      upcoming_birthdays: upcoming,
      total_upcoming: upcoming.reduce((sum, day) => sum + day.count, 0)
    };
  }
}
```

### 🎮 Controlador

```typescript
// src/birthday/birthday.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { BirthdayService } from './birthday.service';
import { CheckBirthdayDto } from './dto/check-birthday.dto';

@Controller('birthday')
export class BirthdayController {
  constructor(private readonly birthdayService: BirthdayService) {}

  @Post('check')
  async checkBirthdays(@Body() checkBirthdayDto: CheckBirthdayDto) {
    return await this.birthdayService.checkBirthdays(checkBirthdayDto.date);
  }

  @Get('today')
  async checkToday() {
    const today = new Date().toISOString().split('T')[0];
    return await this.birthdayService.checkBirthdays(today);
  }

  @Get('upcoming')
  async getUpcoming(@Query('days') days?: string) {
    const daysCount = days ? parseInt(days) : 7;
    return await this.birthdayService.getUpcomingBirthdays(daysCount);
  }
}
```

### 📦 Módulo

```typescript
// src/birthday/birthday.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BirthdayController } from './birthday.controller';
import { BirthdayService } from './birthday.service';
import { Person } from '../database/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [BirthdayController],
  providers: [BirthdayService],
})
export class BirthdayModule {}
```

---

## 🤖 PARTE 2: Flujo n8n Completo

### 🔄 Workflow JSON para n8n

```json
{
  "name": "Birthday Notification System",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "value": "0 9 * * *"
            }
          ]
        }
      },
      "name": "Daily Trigger",
      "type": "n8n-nodes-base.cron",
      "position": [200, 300]
    },
    {
      "parameters": {
        "jsCode": "// Preparar datos para enviar al backend\nconst today = new Date();\nconst formattedDate = today.toISOString().split('T')[0];\n\nreturn {\n  json: {\n    date: formattedDate,\n    day_name: today.toLocaleDateString('es-ES', { weekday: 'long' }),\n    formatted_date: today.toLocaleDateString('es-ES', {\n      year: 'numeric',\n      month: 'long', \n      day: 'numeric'\n    })\n  }\n};"
      },
      "name": "Prepare Date",
      "type": "n8n-nodes-base.code",
      "position": [400, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "http://localhost:3000/birthday/check",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "date",
              "value": "={{$json.date}}"
            }
          ]
        },
        "options": {
          "response": {
            "response": {
              "neverError": true,
              "fullResponse": true
            }
          },
          "timeout": 10000
        }
      },
      "name": "Check Birthdays API",
      "type": "n8n-nodes-base.httpRequest",
      "position": [600, 300]
    },
    {
      "parameters": {
        "jsCode": "// Procesar respuesta del backend\nconst response = items[0].json;\nconst httpData = response.body || response;\n\nif (!httpData.ok) {\n  // Error en el backend\n  return {\n    json: {\n      error: true,\n      message: httpData.message || 'Error desconocido',\n      should_notify: false\n    }\n  };\n}\n\nif (!httpData.has_birthdays) {\n  // No hay cumpleaños hoy\n  return {\n    json: {\n      error: false,\n      has_birthdays: false,\n      should_notify: false,\n      message: 'No hay cumpleaños hoy'\n    }\n  };\n}\n\n// ¡HAY CUMPLEAÑOS!\nconst birthdays = httpData.birthdays;\nlet message = `🎉 ¡CUMPLEAÑOS HOY! 🎂\\n\\n`;\n\nbirthdays.forEach(person => {\n  message += `🎈 ${person.name} cumple ${person.age} años\\n`;\n  message += `📧 ${person.email}\\n`;\n  if (person.phone) {\n    message += `📱 ${person.phone}\\n`;\n  }\n  message += `\\n`;\n});\n\nmessage += `Total: ${httpData.count} persona(s) de cumpleaños 🎊`;\n\nreturn {\n  json: {\n    error: false,\n    has_birthdays: true,\n    should_notify: true,\n    message: message,\n    birthdays: birthdays,\n    count: httpData.count,\n    formatted_date: items[0].json.formatted_date\n  }\n};"
      },
      "name": "Process Response",
      "type": "n8n-nodes-base.code",
      "position": [800, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.should_notify}}",
              "value2": "true"
            }
          ]
        }
      },
      "name": "Should Send Notification?",
      "type": "n8n-nodes-base.if",
      "position": [1000, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.whatsapp.com/send",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{$credentials.whatsapp.token}}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "to",
              "value": "+5493415551234"
            },
            {
              "name": "text",
              "value": "={{$json.message}}"
            }
          ]
        }
      },
      "name": "Send WhatsApp",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1200, 200]
    },
    {
      "parameters": {
        "fromEmail": "sistema@empresa.com",
        "toEmail": "equipo@empresa.com",
        "subject": "🎉 Cumpleaños del día - {{$json.formatted_date}}",
        "emailFormat": "html",
        "message": "=<h2>🎂 Cumpleaños de Hoy</h2>\\n<p>{{$json.message}}</p>\\n<hr>\\n<small>Enviado automáticamente por el sistema de n8n</small>"
      },
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "position": [1200, 400]
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "birthday_notifications",
        "columns": "notification_date, birthday_count, message_sent, notification_type, created_at",
        "values": "={{$json.formatted_date}}, {{$json.count}}, true, 'whatsapp_email', {{new Date().toISOString()}}"
      },
      "name": "Log to PostgreSQL",
      "type": "n8n-nodes-base.postgres",
      "position": [1400, 300]
    }
  ],
  "connections": {
    "Daily Trigger": {
      "main": [
        [
          {
            "node": "Prepare Date",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Prepare Date": {
      "main": [
        [
          {
            "node": "Check Birthdays API",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Birthdays API": {
      "main": [
        [
          {
            "node": "Process Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Response": {
      "main": [
        [
          {
            "node": "Should Send Notification?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Should Send Notification?": {
      "main": [
        [
          {
            "node": "Send WhatsApp",
            "type": "main",
            "index": 0
          },
          {
            "node": "Send Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send WhatsApp": {
      "main": [
        [
          {
            "node": "Log to PostgreSQL",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Email": {
      "main": [
        [
          {
            "node": "Log to PostgreSQL",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## 🗄️ PARTE 3: Estructura de Base de Datos

### 👥 Tabla de Personas

```sql
-- Tabla principal de personas
CREATE TABLE people (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    birth_date DATE NOT NULL,
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Índices para búsquedas rápidas
    INDEX idx_birth_month_day ON people(EXTRACT(MONTH FROM birth_date), EXTRACT(DAY FROM birth_date)),
    INDEX idx_notifications_enabled ON people(notifications_enabled)
);
```

### 📝 Tabla de Logs de Notificaciones

```sql
-- Para trackear las notificaciones enviadas
CREATE TABLE birthday_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    notification_date DATE NOT NULL,
    birthday_count INTEGER NOT NULL,
    message_sent BOOLEAN DEFAULT false,
    notification_type VARCHAR(50), -- 'whatsapp', 'email', 'whatsapp_email'
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_notification_date ON birthday_notifications(notification_date)
);
```

### 📊 Datos de Ejemplo

```sql
-- Insertar datos de prueba
INSERT INTO people (name, email, phone, birth_date) VALUES
('Juan Pérez', 'juan@empresa.com', '+5493415551234', '1990-01-15'),
('María González', 'maria@empresa.com', '+5493415555678', '1985-03-22'),
('Carlos López', 'carlos@empresa.com', '+5493415559012', '1992-08-16'), -- ¡HOY si es 16 de agosto!
('Ana Rodríguez', 'ana@empresa.com', '+5493415553456', '1988-12-05'),
('Luis Martínez', 'luis@empresa.com', '+5493415557890', '1995-08-16'); -- ¡También HOY!
```

---

## 🚀 PARTE 4: Configuración y Despliegue

### 🔧 Variables de Entorno (.env)

```bash
# NestJS Backend
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_password
DATABASE_NAME=birthday_system
PORT=3000

# n8n Configuration
N8N_ENCRYPTION_KEY=tu_encryption_key
WEBHOOK_URL=http://localhost:5678
POSTGRES_CONNECTION_STRING=postgresql://postgres:password@localhost:5432/birthday_system

# WhatsApp API (ejemplo con Twilio)
WHATSAPP_API_TOKEN=tu_whatsapp_token
WHATSAPP_FROM_NUMBER=+14155552345

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
```

### 📦 Dependencias del Backend

```json
// package.json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1"
  }
}
```

### 🚀 Comandos de Inicio

```bash
# Backend NestJS
npm install
npm run start:dev

# n8n (en otra terminal)
npx n8n start --tunnel
```

---

## 🧪 PARTE 5: Testing y Debugging

### 🔍 Test Manual del Backend

```bash
# Probar endpoint directamente
curl -X POST http://localhost:3000/birthday/check \
  -H "Content-Type: application/json" \
  -d '{"date": "2024-08-16"}'

# Respuesta esperada si hay cumpleaños:
{
  "ok": true,
  "has_birthdays": true,
  "count": 2,
  "date": "2024-08-16",
  "birthdays": [
    {
      "id": "uuid-1",
      "name": "Carlos López",
      "email": "carlos@empresa.com",
      "phone": "+5493415559012",
      "age": 32,
      "age_ordinal": "32º"
    },
    {
      "id": "uuid-2", 
      "name": "Luis Martínez",
      "email": "luis@empresa.com",
      "phone": "+5493415557890",
      "age": 29,
      "age_ordinal": "29º"
    }
  ],
  "message": "¡Hoy 2 persona(s) están de cumpleaños!"
}
```

### 🐛 Debugging en n8n

```javascript
// En un Code Node para debug
console.log('=== DEBUG INFO ===');
console.log('Input items:', JSON.stringify(items, null, 2));
console.log('Current date:', new Date().toISOString());
console.log('Formatted date:', new Date().toISOString().split('T')[0]);

// Return debug info
return [{
  json: {
    debug: true,
    input_data: items[0].json,
    processed_at: new Date().toISOString()
  }
}];
```

---

## 📊 PARTE 6: Monitoreo y Métricas

### 📈 Query de Métricas

```sql
-- Estadísticas de cumpleaños por mes
SELECT 
  EXTRACT(MONTH FROM birth_date) as month,
  TO_CHAR(DATE_TRUNC('month', birth_date), 'Month') as month_name,
  COUNT(*) as birthday_count
FROM people 
WHERE notifications_enabled = true
GROUP BY EXTRACT(MONTH FROM birth_date), TO_CHAR(DATE_TRUNC('month', birth_date), 'Month')
ORDER BY month;

-- Próximos cumpleaños (siguientes 30 días)
WITH next_30_days AS (
  SELECT 
    name,
    email,
    birth_date,
    EXTRACT(MONTH FROM birth_date) as birth_month,
    EXTRACT(DAY FROM birth_date) as birth_day,
    CASE 
      WHEN EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM CURRENT_DATE) 
           AND EXTRACT(DAY FROM birth_date) >= EXTRACT(DAY FROM CURRENT_DATE)
      THEN EXTRACT(DAY FROM birth_date) - EXTRACT(DAY FROM CURRENT_DATE)
      WHEN EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '1 month')
      THEN (DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + 
            INTERVAL '1 day' * (EXTRACT(DAY FROM birth_date) - 1) - CURRENT_DATE)::INTEGER
      ELSE NULL
    END as days_until_birthday
  FROM people
  WHERE notifications_enabled = true
)
SELECT *
FROM next_30_days
WHERE days_until_birthday IS NOT NULL 
  AND days_until_birthday <= 30
ORDER BY days_until_birthday;
```

### 🎯 Dashboard Simple

```sql
-- Vista para dashboard
CREATE VIEW birthday_dashboard AS
SELECT 
  'today' as period,
  COUNT(*) as count,
  CURRENT_DATE as date
FROM people 
WHERE EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(DAY FROM birth_date) = EXTRACT(DAY FROM CURRENT_DATE)
  AND notifications_enabled = true

UNION ALL

SELECT 
  'this_week' as period,
  COUNT(*) as count,
  CURRENT_DATE as date
FROM people 
WHERE notifications_enabled = true
  AND birth_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days';
```

---

## 🎉 ¡Tu Sistema Está Listo!

### ✅ **Lo que acabas de construir:**

1. **🏗️ Backend NestJS robusto** que valida cumpleaños eficientemente
2. **🤖 Flujo n8n automatizado** que corre todos los días
3. **📱 Notificaciones multi-canal** (WhatsApp + Email)
4. **🗄️ Base de datos optimizada** con índices y queries inteligentes
5. **📊 Sistema de logging** para trackear todas las notificaciones

### 🚀 **Próximos pasos para mejorar:**

- **🎨 Personalizar mensajes** según la edad y relación
- **⏰ Recordatorios previos** (1 día antes, 1 semana antes)
- **📊 Dashboard web** para visualizar estadísticas
- **🔄 Sync con RRHH** para importar empleados automáticamente
- **🎁 Integración con tienda** para sugerir regalos

¿Te gustaría que profundice en alguna parte específica o que agregue alguna funcionalidad adicional?