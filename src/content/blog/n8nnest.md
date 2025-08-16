---
title: 'Agendamiento de Turnos con n8n y NestJS'
code: "n8n"
description: 'Guía: Sistema de Agendamiento de Turnos con n8n y NestJS'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# Guía: Sistema de Agendamiento de Turnos con n8n y NestJS
## Implementación Práctica Paso a Paso

---

## **Arquitectura del Sistema**

```
Cliente Web/App
     ↓
   NestJS API
     ↓
   Base de Datos
     ↓
   n8n Workflows
     ↓
Email/SMS/Calendar
```

**Flujo básico:**
1. Cliente solicita turno via API
2. NestJS valida y guarda en DB
3. n8n detecta nuevo turno
4. n8n envía confirmaciones y recordatorios

---

## **PARTE 1: SETUP INICIAL**

### **Instalación NestJS**

```bash
# Instalar CLI
npm i -g @nestjs/cli

# Crear proyecto
nest new appointment-system
cd appointment-system

# Instalar dependencias necesarias
npm install @nestjs/typeorm typeorm mysql2
npm install @nestjs/config
npm install class-validator class-transformer
npm install @nestjs/schedule
```

### **Instalación n8n**

```bash
# Opción 1: Docker (recomendado)
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n

# Opción 2: NPM
npm install n8n -g
n8n start
```

### **Base de Datos MySQL**

```sql
CREATE DATABASE appointment_system;

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    service_type VARCHAR(100) NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE available_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## **PARTE 2: IMPLEMENTACIÓN NESTJS**

### **1. Configuración Database (app.module.ts)**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'appointment_system',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo en desarrollo
    }),
    AppointmentModule,
  ],
})
export class AppModule {}
```

### **2. Entity Appointment (appointment.entity.ts)**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientName: string;

  @Column()
  clientEmail: string;

  @Column({ nullable: true })
  clientPhone: string;

  @Column()
  serviceType: string;

  @Column()
  appointmentDate: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### **3. DTO para Validación (create-appointment.dto.ts)**

```typescript
import { IsNotEmpty, IsEmail, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsEmail()
  clientEmail: string;

  @IsOptional()
  @IsString()
  clientPhone?: string;

  @IsNotEmpty()
  @IsString()
  serviceType: string;

  @IsDateString()
  appointmentDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
```

### **4. Service (appointment.service.ts)**

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Validar que la fecha no esté en el pasado
    const appointmentDate = new Date(createAppointmentDto.appointmentDate);
    if (appointmentDate < new Date()) {
      throw new BadRequestException('No se puede agendar en el pasado');
    }

    // Verificar disponibilidad
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        appointmentDate,
        status: 'confirmed'
      }
    });

    if (existingAppointment) {
      throw new BadRequestException('Horario no disponible');
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      appointmentDate
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);
    
    // Trigger para n8n (webhook o polling)
    await this.triggerN8nWorkflow(savedAppointment);
    
    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      order: { appointmentDate: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Appointment> {
    return this.appointmentRepository.findOne({ where: { id } });
  }

  async updateStatus(id: number, status: string): Promise<Appointment> {
    await this.appointmentRepository.update(id, { status });
    return this.findOne(id);
  }

  async getAvailableSlots(date: string): Promise<string[]> {
    const requestedDate = new Date(date);
    
    // Horarios disponibles (9 AM a 5 PM, cada hora)
    const availableHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    
    // Obtener turnos ocupados para esa fecha
    const occupiedSlots = await this.appointmentRepository.find({
      where: {
        appointmentDate: requestedDate,
        status: 'confirmed'
      }
    });

    const occupiedHours = occupiedSlots.map(slot => 
      slot.appointmentDate.getHours()
    );

    // Filtrar horarios disponibles
    const available = availableHours
      .filter(hour => !occupiedHours.includes(hour))
      .map(hour => `${hour.toString().padStart(2, '0')}:00`);

    return available;
  }

  private async triggerN8nWorkflow(appointment: Appointment) {
    // Webhook a n8n o actualizar flag en DB para polling
    try {
      const response = await fetch('http://localhost:5678/webhook/new-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });
    } catch (error) {
      console.log('Error triggering n8n:', error);
      // Log pero no fallar la creación del turno
    }
  }
}
```

### **5. Controller (appointment.controller.ts)**

```typescript
import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('available-slots')
  getAvailableSlots(@Query('date') date: string) {
    return this.appointmentService.getAvailableSlots(date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.appointmentService.updateStatus(+id, status);
  }
}
```

---

## **PARTE 3: WORKFLOWS EN N8N**

### **Workflow 1: Confirmación de Turno**

**Configuración en n8n UI:**

```json
{
  "meta": {
    "instanceId": "workflow-confirmation"
  },
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "new-appointment",
        "responseMode": "responseNode"
      },
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.status}}",
              "operation": "equal",
              "value2": "pending"
            }
          ]
        }
      },
      "id": "if-pending",
      "name": "Si está pendiente",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "sendTo": "={{$json.clientEmail}}",
        "subject": "Confirmación de turno - {{$json.serviceType}}",
        "message": "Hola {{$json.clientName}},\n\nTu turno ha sido registrado:\n\nServicio: {{$json.serviceType}}\nFecha: {{$json.appointmentDate}}\n\nPor favor confirma respondiendo a este email.\n\nSaludos"
      },
      "id": "send-email",
      "name": "Enviar Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [680, 200]
    },
    {
      "parameters": {
        "message": "Turno: {{$json.clientName}} - {{$json.serviceType}} - {{$json.appointmentDate}}",
        "chatId": "YOUR_TELEGRAM_CHAT_ID"
      },
      "id": "telegram-notification",
      "name": "Notificación Telegram",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1,
      "position": [680, 400]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "Si está pendiente",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Si está pendiente": {
      "main": [
        [
          {
            "node": "Enviar Email",
            "type": "main",
            "index": 0
          },
          {
            "node": "Notificación Telegram",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### **Workflow 2: Recordatorios Automáticos**

**Trigger por Schedule:**

```json
{
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * *"
            }
          ]
        }
      },
      "name": "Trigger diario 9 AM",
      "type": "n8n-nodes-base.cron",
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM appointments WHERE DATE(appointment_date) = DATE(NOW() + INTERVAL 1 DAY) AND status = 'confirmed'",
        "options": {}
      },
      "name": "Buscar turnos mañana",
      "type": "n8n-nodes-base.mysql",
      "position": [460, 300]
    },
    {
      "parameters": {
        "batchSize": 1,
        "options": {}
      },
      "name": "Split In Batches",
      "type": "n8n-nodes-base.splitInBatches",
      "position": [680, 300]
    },
    {
      "parameters": {
        "sendTo": "={{$json.client_email}}",
        "subject": "Recordatorio: Turno mañana",
        "message": "Hola {{$json.client_name}},\n\nTe recordamos tu turno para mañana:\n\nServicio: {{$json.service_type}}\nFecha: {{$json.appointment_date}}\n\nNos vemos mañana!\n\nSaludos"
      },
      "name": "Enviar recordatorio",
      "type": "n8n-nodes-base.emailSend",
      "position": [900, 300]
    }
  ]
}
```

---

## **PARTE 4: FRONTEND SIMPLE (OPCIONAL)**

### **HTML + JavaScript básico**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Agendar Turno</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input, select, textarea { width: 100%; padding: 8px; margin-bottom: 10px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; }
        .available-slots { display: flex; flex-wrap: wrap; gap: 10px; }
        .slot { padding: 10px; border: 1px solid #ccc; cursor: pointer; }
        .slot.selected { background: #007bff; color: white; }
    </style>
</head>
<body>
    <h1>Agendar Turno</h1>
    
    <form id="appointmentForm">
        <div class="form-group">
            <label>Nombre:</label>
            <input type="text" id="clientName" required>
        </div>
        
        <div class="form-group">
            <label>Email:</label>
            <input type="email" id="clientEmail" required>
        </div>
        
        <div class="form-group">
            <label>Teléfono:</label>
            <input type="tel" id="clientPhone">
        </div>
        
        <div class="form-group">
            <label>Servicio:</label>
            <select id="serviceType" required>
                <option value="">Seleccionar...</option>
                <option value="consulta">Consulta</option>
                <option value="tratamiento">Tratamiento</option>
                <option value="control">Control</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Fecha:</label>
            <input type="date" id="appointmentDate" required>
        </div>
        
        <div class="form-group">
            <label>Horarios disponibles:</label>
            <div id="availableSlots" class="available-slots"></div>
        </div>
        
        <div class="form-group">
            <label>Notas:</label>
            <textarea id="notes"></textarea>
        </div>
        
        <button type="submit">Agendar Turno</button>
    </form>

    <script>
        const API_BASE = 'http://localhost:3000';
        let selectedTime = null;

        document.getElementById('appointmentDate').addEventListener('change', loadAvailableSlots);

        async function loadAvailableSlots() {
            const date = document.getElementById('appointmentDate').value;
            if (!date) return;

            try {
                const response = await fetch(`${API_BASE}/appointments/available-slots?date=${date}`);
                const slots = await response.json();
                
                const container = document.getElementById('availableSlots');
                container.innerHTML = '';
                
                slots.forEach(time => {
                    const slot = document.createElement('div');
                    slot.className = 'slot';
                    slot.textContent = time;
                    slot.onclick = () => selectSlot(slot, time);
                    container.appendChild(slot);
                });
            } catch (error) {
                console.error('Error loading slots:', error);
            }
        }

        function selectSlot(element, time) {
            document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('selected'));
            element.classList.add('selected');
            selectedTime = time;
        }

        document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!selectedTime) {
                alert('Por favor selecciona un horario');
                return;
            }

            const formData = {
                clientName: document.getElementById('clientName').value,
                clientEmail: document.getElementById('clientEmail').value,
                clientPhone: document.getElementById('clientPhone').value,
                serviceType: document.getElementById('serviceType').value,
                appointmentDate: `${document.getElementById('appointmentDate').value}T${selectedTime}:00`,
                notes: document.getElementById('notes').value
            };

            try {
                const response = await fetch(`${API_BASE}/appointments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('¡Turno agendado exitosamente! Recibirás un email de confirmación.');
                    document.getElementById('appointmentForm').reset();
                    document.getElementById('availableSlots').innerHTML = '';
                    selectedTime = null;
                } else {
                    const error = await response.json();
                    alert('Error: ' + error.message);
                }
            } catch (error) {
                alert('Error al agendar turno');
                console.error(error);
            }
        });
    </script>
</body>
</html>
```

---

## **PARTE 5: CONFIGURACIÓN Y DEPLOY**

### **Variables de Entorno (.env)**

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=appointment_system

# Email (para n8n)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password

# N8N
N8N_WEBHOOK_URL=http://localhost:5678/webhook

# Telegram (opcional)
TELEGRAM_BOT_TOKEN=tu-bot-token
TELEGRAM_CHAT_ID=tu-chat-id
```

### **Docker Compose (docker-compose.yml)**

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: appointment_system
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=admin123
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - mysql

  app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USERNAME=root
      - DB_PASSWORD=password
      - DB_DATABASE=appointment_system
    depends_on:
      - mysql
      - n8n

volumes:
  mysql_data:
  n8n_data:
```

### **Comandos para Ejecutar**

```bash
# Desarrollo local
npm run start:dev

# Con Docker
docker-compose up -d

# Verificar que todo funciona
curl http://localhost:3000/appointments
curl http://localhost:5678  # n8n interface
```

---

## **TESTING Y VALIDACIÓN**

### **1. Testear API**

```bash
# Crear turno
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Juan Pérez",
    "clientEmail": "juan@email.com",
    "clientPhone": "+54123456789",
    "serviceType": "consulta",
    "appointmentDate": "2024-03-15T10:00:00"
  }'

# Ver turnos
curl http://localhost:3000/appointments

# Ver slots disponibles
curl "http://localhost:3000/appointments/available-slots?date=2024-03-15"
```

### **2. Testear n8n Workflows**

1. Crear turno desde frontend/API
2. Verificar que llegue email de confirmación
3. Verificar notificación Telegram (si configurado)
4. Esperar al día siguiente para probar recordatorios

---

## **MEJORAS POSIBLES**

### **Corto Plazo:**
- Validación de horarios de trabajo
- Cancelación de turnos
- Reprogramación
- SMS notifications via Twilio

### **Mediano Plazo:**
- Múltiples profesionales
- Diferentes duraciones de servicio
- Integración con Google Calendar
- Payment integration

### **Largo Plazo:**
- Mobile app
- AI para optimizar horarios
- Analytics y reportes
- Multi-tenant system

---

**Esta implementación te da un sistema funcional de agendamiento que puedes extender según tus necesidades específicas.**