---
title: 'Arquitecto Backend'
code: 'suprabase'
description: 'La Guía Definitiva para Dominar el "Firebase Killer"'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Masterclass: Supabase - De Principiante a Arquitecto Backend
## La Guía Definitiva para Dominar el "Firebase Killer"

---

## 🎯 **¿QUÉ ES SUPABASE Y POR QUÉ DOMINARÁ EL FUTURO?**

### **Supabase = PostgreSQL + APIs automáticas + Auth + Realtime + Storage**

**La promesa:** *"Construí un backend completo en minutos, no meses"*

**¿Por qué es revolucionario?**
- ✅ **Open Source** (no vendor lock-in como Firebase)
- ✅ **PostgreSQL real** (no NoSQL limitado)
- ✅ **APIs REST automáticas** generadas desde tu schema
- ✅ **Realtime** out-of-the-box
- ✅ **Auth completa** con social login
- ✅ **Row Level Security** (RLS) nativo
- ✅ **Self-hosted** o cloud

---

## 🏗️ **METODOLOGÍA DE APRENDIZAJE SUPABASE**

### **Los 4 Pilares de Dominio:**
1. **Database-First Thinking** - Todo empieza con PostgreSQL
2. **API-Driven Development** - Las APIs se generan automáticamente
3. **Security by Design** - RLS desde el primer día
4. **Real-time by Default** - Subscripciones como ciudadano de primera clase

### **Progresión de Maestría:**
```
🥇 ARQUITECTO SUPABASE
   ↑
🥈 EXPERTO BACKEND
   ↑ 
🥉 DEVELOPER SUPABASE
   ↑
🔰 FUNDAMENTOS
```

---

## 🚀 **MÓDULO 1: CONFIGURACIÓN Y PRIMEROS PASOS**

### **Setup Inicial - Tu Primer Proyecto**
```bash
# 1. Crear proyecto en Supabase Dashboard
# 2. Instalar CLI
npm install -g supabase

# 3. Login y setup local
supabase login
supabase init mi-proyecto
supabase start

# 4. Instalar cliente JavaScript
npm install @supabase/supabase-js
```

### **Configuración del Cliente**
```javascript
// supabase.js - Tu configuración base
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tu-proyecto.supabase.co'
const supabaseAnonKey = 'tu-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Para desarrollo local
const supabase = createClient(
  'http://localhost:54321',
  'tu-local-anon-key'
)
```

### **Tu Primera Tabla y API**
```sql
-- Crear tabla en SQL Editor
CREATE TABLE productos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  categoria_id BIGINT REFERENCES categorias(id),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Política básica: usuarios ven solo sus productos
CREATE POLICY "Users can view own products" ON productos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products" ON productos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### **Usar la API Automática**
```javascript
// ¡No necesitás escribir endpoints! La API ya existe
import { supabase } from './supabase.js'

// Obtener todos los productos (respeta RLS)
const { data: productos, error } = await supabase
  .from('productos')
  .select('*')

// Crear producto
const { data, error } = await supabase
  .from('productos')
  .insert([
    { 
      nombre: 'Laptop HP', 
      precio: 50000, 
      stock: 10 
    }
  ])

// Actualizar producto
const { data, error } = await supabase
  .from('productos')
  .update({ stock: 5 })
  .eq('id', 1)

// Eliminar producto
const { data, error } = await supabase
  .from('productos')
  .delete()
  .eq('id', 1)
```

**🎯 Ejercicio Día 1:**
1. Crear cuenta en Supabase
2. Crear tabla "tareas" con campos: id, titulo, completada, user_id
3. Hacer tu primer CRUD desde JavaScript

---

## 📊 **MÓDULO 2: POSTGRESQL AVANZADO EN SUPABASE**

### **Aprovechando PostgreSQL al Máximo**
```sql
-- 1. Tipos de datos avanzados
CREATE TABLE perfiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES auth.users(id),
  datos_personales JSONB,
  ubicacion POINT,
  habilidades TEXT[],
  configuracion JSONB DEFAULT '{}',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices para performance
CREATE INDEX idx_perfiles_ubicacion ON perfiles USING GIST(ubicacion);
CREATE INDEX idx_perfiles_habilidades ON perfiles USING GIN(habilidades);
CREATE INDEX idx_perfiles_datos ON perfiles USING GIN(datos_personales);

-- 3. Funciones PostgreSQL
CREATE OR REPLACE FUNCTION calcular_distancia(
  lat1 FLOAT, 
  lon1 FLOAT, 
  lat2 FLOAT, 
  lon2 FLOAT
) RETURNS FLOAT AS $$
BEGIN
  RETURN acos(
    sin(radians(lat1)) * sin(radians(lat2)) +
    cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2 - lon1))
  ) * 6371; -- Radio de la Tierra en km
END;
$$ LANGUAGE plpgsql;

-- 4. Triggers para auditoría
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_productos_updated
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

-- 5. Views para queries complejas
CREATE VIEW productos_con_categoria AS
SELECT 
  p.id,
  p.nombre,
  p.precio,
  p.stock,
  c.nombre as categoria,
  p.created_at
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id
WHERE p.stock > 0;
```

### **Consultas Avanzadas desde JavaScript**
```javascript
// Consultas con JOIN
const { data } = await supabase
  .from('productos')
  .select(`
    id,
    nombre,
    precio,
    categorias (
      id,
      nombre
    )
  `)

// Filtros complejos
const { data } = await supabase
  .from('productos')
  .select('*')
  .gte('precio', 1000)
  .lte('precio', 5000)
  .in('categoria_id', [1, 2, 3])
  .ilike('nombre', '%laptop%')
  .order('precio', { ascending: false })
  .limit(10)

// Consultas con agregaciones
const { data } = await supabase
  .from('productos')
  .select('categoria_id, count(*), avg(precio)')
  .group('categoria_id')

// Full-text search (PostgreSQL)
const { data } = await supabase
  .from('productos')
  .select('*')
  .textSearch('nombre', 'laptop & gaming', {
    type: 'websearch'
  })

// Geo queries
const { data } = await supabase
  .rpc('productos_cerca_de', {
    lat: -32.9442426,  // Rosario
    lng: -60.6505388,
    radio_km: 50
  })
```

### **Caso Real: E-commerce Argentino**
```sql
-- Schema completo para e-commerce
CREATE TABLE categorias (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  parent_id BIGINT REFERENCES categorias(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE productos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  precio_oferta DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  categoria_id BIGINT REFERENCES categorias(id),
  vendedor_id UUID REFERENCES auth.users(id),
  imagenes TEXT[],
  especificaciones JSONB,
  peso_kg DECIMAL(5,2),
  dimensiones JSONB, -- {largo, ancho, alto}
  envio_gratis BOOLEAN DEFAULT FALSE,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'pausado', 'agotado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE direcciones (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  calle TEXT NOT NULL,
  numero TEXT NOT NULL,
  piso TEXT,
  departamento TEXT,
  codigo_postal TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  provincia TEXT NOT NULL,
  pais TEXT DEFAULT 'Argentina',
  telefono TEXT,
  es_predeterminada BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pedidos (
  id BIGSERIAL PRIMARY KEY,
  numero_pedido TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  direccion_envio JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  descuentos DECIMAL(10,2) DEFAULT 0,
  impuestos DECIMAL(10,2) NOT NULL,
  costo_envio DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN (
    'pendiente', 'confirmado', 'preparando', 
    'enviado', 'entregado', 'cancelado'
  )),
  metodo_pago TEXT,
  tracking_number TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies para e-commerce
CREATE POLICY "Productos públicos visible" ON productos
  FOR SELECT USING (estado = 'activo');

CREATE POLICY "Vendedores ven sus productos" ON productos
  FOR ALL USING (auth.uid() = vendedor_id);

CREATE POLICY "Usuarios ven sus pedidos" ON pedidos
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 🔐 **MÓDULO 3: AUTENTICACIÓN MAESTRA**

### **Setup de Auth Completa**
```javascript
// 1. Registro de usuario
const { data, error } = await supabase.auth.signUp({
  email: 'juan@email.com',
  password: 'mi-password-seguro',
  options: {
    data: {
      nombre: 'Juan Pérez',
      ciudad: 'Rosario'
    }
  }
})

// 2. Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'juan@email.com',
  password: 'mi-password-seguro'
})

// 3. Social Login (Google, GitHub, etc.)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://mi-app.com/dashboard'
  }
})

// 4. Magic Link (sin password)
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'juan@email.com',
  options: {
    emailRedirectTo: 'https://mi-app.com/welcome'
  }
})

// 5. Logout
const { error } = await supabase.auth.signOut()
```

### **Gestión de Estado de Auth**
```javascript
// React Hook personalizado para auth
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    signUp: (email, password, metadata) => 
      supabase.auth.signUp({ email, password, options: { data: metadata } }),
    signIn: (email, password) => 
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    resetPassword: (email) => 
      supabase.auth.resetPasswordForEmail(email)
  }
}

// Componente protegido
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Cargando...</div>
  if (!user) return <Navigate to="/login" />
  
  return children
}
```

### **Perfiles de Usuario Avanzados**
```sql
-- Tabla de perfiles extendidos
CREATE TABLE perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT,
  avatar_url TEXT,
  telefono TEXT,
  fecha_nacimiento DATE,
  genero TEXT,
  biografia TEXT,
  sitio_web TEXT,
  redes_sociales JSONB,
  configuracion JSONB DEFAULT '{}',
  verificado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE FUNCTION crear_perfil_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO perfiles (id, nombre_completo)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nombre');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION crear_perfil_usuario();

-- RLS para perfiles
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfil público readable" ON perfiles
  FOR SELECT USING (true);

CREATE POLICY "Usuario puede actualizar su perfil" ON perfiles
  FOR UPDATE USING (auth.uid() = id);
```

### **Roles y Permisos Personalizados**
```sql
-- Sistema de roles flexible
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  permisos JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
  asignado_por UUID REFERENCES auth.users(id),
  asignado_en TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Función para verificar permisos
CREATE OR REPLACE FUNCTION user_has_permission(
  user_uuid UUID,
  permission TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  has_perm BOOLEAN := FALSE;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid
    AND r.permisos ? permission
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql;

-- Usar en RLS
CREATE POLICY "Solo admins pueden ver usuarios" ON perfiles
  FOR SELECT USING (
    user_has_permission(auth.uid(), 'view_users') 
    OR auth.uid() = id
  );
```

**🎯 Ejercicio Día 3:**
1. Implementar auth completa con email/password
2. Crear perfil de usuario automático
3. Sistema básico de roles (admin, usuario)

---

## ⚡ **MÓDULO 4: REALTIME - LA MAGIA DE SUPABASE**

### **Fundamentos de Realtime**
```javascript
// 1. Suscribirse a cambios en tabla
const subscription = supabase
  .channel('productos-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE, o *
      schema: 'public',
      table: 'productos'
    },
    (payload) => {
      console.log('Cambio en productos:', payload)
      // Actualizar UI automáticamente
      if (payload.eventType === 'INSERT') {
        setProductos(prev => [...prev, payload.new])
      } else if (payload.eventType === 'DELETE') {
        setProductos(prev => prev.filter(p => p.id !== payload.old.id))
      } else if (payload.eventType === 'UPDATE') {
        setProductos(prev => prev.map(p => 
          p.id === payload.new.id ? payload.new : p
        ))
      }
    }
  )
  .subscribe()

// Cleanup
return () => supabase.removeChannel(subscription)
```

### **Chat en Tiempo Real**
```javascript
// Hook para chat realtime
function useChat(chatId) {
  const [messages, setMessages] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    // Cargar mensajes existentes
    const loadMessages = async () => {
      const { data } = await supabase
        .from('mensajes')
        .select(`
          *,
          perfiles (
            nombre_completo,
            avatar_url
          )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })
      
      setMessages(data || [])
    }

    loadMessages()

    // Suscribirse a nuevos mensajes
    const subscription = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes',
          filter: `chat_id=eq.${chatId}`
        },
        async (payload) => {
          // Obtener datos del usuario
          const { data: userData } = await supabase
            .from('perfiles')
            .select('nombre_completo, avatar_url')
            .eq('id', payload.new.user_id)
            .single()

          const newMessage = {
            ...payload.new,
            perfiles: userData
          }

          setMessages(prev => [...prev, newMessage])
        }
      )
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [chatId])

  const sendMessage = async (content) => {
    const { error } = await supabase
      .from('mensajes')
      .insert([{
        chat_id: chatId,
        user_id: user.id,
        content,
        created_at: new Date().toISOString()
      }])

    if (error) console.error('Error sending message:', error)
  }

  return { messages, sendMessage }
}
```

### **Presencia Online**
```javascript
// Sistema de usuarios online
function usePresence(roomName) {
  const [onlineUsers, setOnlineUsers] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const channel = supabase.channel(roomName, {
      config: {
        presence: { key: user.id }
      }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        const users = Object.values(presenceState).flat()
        setOnlineUsers(users)
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('Usuario conectado:', newPresences)
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Usuario desconectado:', leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            name: user.user_metadata?.nombre || 'Usuario',
            online_at: new Date().toISOString()
          })
        }
      })

    return () => supabase.removeChannel(channel)
  }, [user, roomName])

  return onlineUsers
}
```

### **Caso Real: Dashboard en Tiempo Real**
```sql
-- Tabla para métricas en tiempo real
CREATE TABLE metricas_negocio (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL, -- 'ventas', 'usuarios', 'productos'
  valor DECIMAL(15,2) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hora TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Función para actualizar métricas
CREATE OR REPLACE FUNCTION actualizar_metricas()
RETURNS TRIGGER AS $$
BEGIN
  -- Cuando se crea un pedido, actualizar métrica de ventas
  IF TG_TABLE_NAME = 'pedidos' AND TG_OP = 'INSERT' THEN
    INSERT INTO metricas_negocio (tipo, valor, metadata)
    VALUES ('ventas', NEW.total, jsonb_build_object('pedido_id', NEW.id));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_metricas_pedidos
  AFTER INSERT ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_metricas();
```

```javascript
// Dashboard component
function DashboardRealtime() {
  const [metrics, setMetrics] = useState({
    ventasHoy: 0,
    pedidosHoy: 0,
    usuariosOnline: 0
  })

  useEffect(() => {
    // Cargar métricas iniciales
    const loadMetrics = async () => {
      const today = new Date().toISOString().split('T')[0]
      
      // Ventas del día
      const { data: ventas } = await supabase
        .from('metricas_negocio')
        .select('valor')
        .eq('tipo', 'ventas')
        .eq('fecha', today)
      
      const ventasHoy = ventas?.reduce((sum, v) => sum + Number(v.valor), 0) || 0
      
      // Pedidos del día
      const { count: pedidosHoy } = await supabase
        .from('pedidos')
        .select('id', { count: 'exact' })
        .gte('created_at', `${today}T00:00:00`)
      
      setMetrics(prev => ({
        ...prev,
        ventasHoy,
        pedidosHoy: pedidosHoy || 0
      }))
    }

    loadMetrics()

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('dashboard-metrics')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'metricas_negocio' },
        () => loadMetrics() // Recargar cuando cambien las métricas
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pedidos' },
        () => loadMetrics() // Recargar cuando haya nuevo pedido
      )
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  return (
    <div className="dashboard">
      <div className="metric-card">
        <h3>Ventas Hoy</h3>
        <p>${metrics.ventasHoy.toLocaleString()}</p>
      </div>
      <div className="metric-card">
        <h3>Pedidos Hoy</h3>
        <p>{metrics.pedidosHoy}</p>
      </div>
    </div>
  )
}
```

---

## 📁 **MÓDULO 5: STORAGE - GESTIÓN DE ARCHIVOS**

### **Setup y Configuración de Storage**
```javascript
// 1. Crear bucket desde dashboard o código
const { data, error } = await supabase.storage.createBucket('avatars', {
  public: false,
  fileSizeLimit: 5242880, // 5MB
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
})

// 2. Upload básico
const uploadAvatar = async (file, userId) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/avatar.${fileExt}`

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true // Sobrescribir si existe
    })

  if (error) throw error
  return data
}

// 3. Upload con resize automático
const uploadWithResize = async (file, path) => {
  // Crear diferentes tamaños
  const sizes = [
    { name: 'thumbnail', width: 150, height: 150 },
    { name: 'medium', width: 500, height: 500 },
    { name: 'large', width: 1200, height: 1200 }
  ]

  const uploads = sizes.map(async (size) => {
    const resizedFile = await resizeImage(file, size.width, size.height)
    const fileName = `${path}/${size.name}.jpg`
    
    return supabase.storage
      .from('productos')
      .upload(fileName, resizedFile, { upsert: true })
  })

  return Promise.all(uploads)
}

// 4. Obtener URL pública
const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// 5. Obtener URL firmada (privada)
const getSignedUrl = async (bucket, path, expiresIn = 3600) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)
  
  return data?.signedUrl
}
```

### **Componente de Upload Avanzado**
```javascript
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

function ImageUploader({ onUpload, bucket, path, maxFiles = 5 }) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true)
    
    try {
      const uploads = acceptedFiles.map(async (file) => {
        // Generar nombre único
        const fileExt = file.name.split('.').pop()
        const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        // Comprimir imagen antes de subir
        const compressedFile = await compressImage(file)
        
        // Upload
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, compressedFile)
        
        if (error) throw error
        
        // Obtener URL pública
        const publicUrl = getPublicUrl(bucket, fileName)
        
        return {
          name: file.name,
          path: fileName,
          url: publicUrl,
          size: file.size
        }
      })
      
      const results = await Promise.all(uploads)
      setUploadedFiles(prev => [...prev, ...results])
      onUpload(results)
      
    } catch (error) {
      console.error('Error uploading:', error)
    } finally {
      setUploading(false)
    }
  }, [bucket, path, onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles,
    maxSize: 5242880 // 5MB
  })

  const removeFile = async (fileIndex) => {
    const file = uploadedFiles[fileIndex]
    
    // Eliminar del storage
    await supabase.storage
      .from(bucket)
      .remove([file.path])
    
    // Eliminar del estado
    setUploadedFiles(prev => prev.filter((_, i) => i !== fileIndex))
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Subiendo archivos...</p>
        ) : (
          <p>
            {isDragActive 
              ? 'Suelta las imágenes aquí...' 
              : 'Arrastra imágenes o haz click para seleccionar'
            }
          </p>
        )}
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="file-preview">
              <img src={file.url} alt={file.name} />
              <button onClick={() => removeFile(index)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### **Políticas de Storage (RLS)**
```sql
-- Políticas para bucket de avatars
-- Usuarios pueden subir/actualizar su propio avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Avatars son públicos para lectura
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Políticas para productos (solo vendedores autorizados)
CREATE POLICY "Vendors can manage product images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'productos' 
    AND EXISTS (
      SELECT 1 FROM productos p 
      WHERE p.vendedor_id = auth.uid() 
      AND p.id::text = (storage.foldername(name))[1]
    )
  );
```

### **Optimización de Imágenes**
```javascript
// Función para comprimir imágenes antes del upload
async function compressImage(file, quality = 0.8, maxWidth = 1920) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      // Convertir a blob con compresión
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Hook para gestión de imágenes de producto
function useProductImages(productId) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const uploadImages = async (files) => {
    setLoading(true)
    try {
      const uploads = files.map(async (file, index) => {
        const compressedFile = await compressImage(file)
        const fileName = `${productId}/${index}-${Date.now()}.jpg`
        
        const { data, error } = await supabase.storage
          .from('productos')
          .upload(fileName, compressedFile)
        
        if (error) throw error
        
        // Guardar referencia en base de datos
        const { data: imageData, error: dbError } = await supabase
          .from('producto_imagenes')
          .insert({
            producto_id: productId,
            storage_path: fileName,
            url: getPublicUrl('productos', fileName),
            orden: index
          })
          .select()
          .single()
        
        if (dbError) throw dbError
        
        return imageData
      })
      
      const results = await Promise.all(uploads)
      setImages(prev => [...prev, ...results])
      
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteImage = async (imageId) => {
    try {
      // Obtener info de la imagen
      const { data: image } = await supabase
        .from('producto_imagenes')
        .select('storage_path')
        .eq('id', imageId)
        .single()
      
      // Eliminar del storage
      await supabase.storage
        .from('productos')
        .remove([image.storage_path])
      
      // Eliminar registro de BD
      await supabase
        .from('producto_imagenes')
        .delete()
        .eq('id', imageId)
      
      setImages(prev => prev.filter(img => img.id !== imageId))
      
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  return {
    images,
    loading,
    uploadImages,
    deleteImage
  }
}
```

---

## 🔒 **MÓDULO 6: ROW LEVEL SECURITY (RLS) MAESTRO**

### **Fundamentos de RLS**
```sql
-- RLS básico: usuarios ven solo sus datos
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

### **RLS Avanzado con Roles**
```sql
-- Función helper para verificar roles
CREATE OR REPLACE FUNCTION user_role() RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM user_profiles WHERE id = auth.uid()),
    'user'
  );
$$ LANGUAGE sql STABLE;

-- Políticas basadas en roles
CREATE POLICY "Admins can view all posts" ON posts
  FOR SELECT USING (user_role() = 'admin');

CREATE POLICY "Moderators can view published posts" ON posts
  FOR SELECT USING (
    user_role() IN ('admin', 'moderator') 
    OR (status = 'published' AND auth.uid() = user_id)
  );

-- Política compleja: visibilidad por categoría
CREATE POLICY "Category based visibility" ON posts
  FOR SELECT USING (
    -- Post público
    status = 'published'
    -- O es el autor
    OR auth.uid() = user_id
    -- O es admin
    OR user_role() = 'admin'
    -- O tiene acceso a la categoría
    OR EXISTS (
      SELECT 1 FROM user_category_access uca
      WHERE uca.user_id = auth.uid()
      AND uca.category_id = posts.category_id
    )
  );
```

### **RLS para Multi-tenancy**
```sql
-- Tabla de organizaciones
CREATE TABLE organizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usuarios pertenecen a organizaciones
CREATE TABLE org_members (
  org_id UUID REFERENCES organizaciones(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (org_id, user_id)
);

-- Función para obtener org del usuario
CREATE OR REPLACE FUNCTION user_org_id() RETURNS UUID AS $$
  SELECT org_id FROM org_members WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE;

-- RLS en tabla de datos
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see projects from their org" ON proyectos
  FOR ALL USING (org_id = user_org_id());

-- Política para super admin
CREATE POLICY "Super admin sees all projects" ON proyectos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'admin@miapp.com'
    )
  );
```

### **RLS con Condiciones Temporales**
```sql
-- Política con restricciones de tiempo
CREATE POLICY "Time restricted access" ON documentos
  FOR SELECT USING (
    auth.uid() = user_id
    AND (
      expires_at IS NULL 
      OR expires_at > NOW()
    )
    AND starts_at <= NOW()
  );

-- Política para contenido programado
CREATE POLICY "Scheduled content visibility" ON posts
  FOR SELECT USING (
    status = 'published'
    AND published_at <= NOW()
    AND (unpublished_at IS NULL OR unpublished_at > NOW())
  );
```

### **Caso Real: Sistema de Permisos Granular**
```sql
-- Sistema flexible de permisos
CREATE TABLE permisos (
  id BIGSERIAL PRIMARY KEY,
  recurso TEXT NOT NULL, -- 'posts', 'users', 'reports'
  accion TEXT NOT NULL,  -- 'read', 'write', 'delete'
  condiciones JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE role_permisos (
  role_id BIGINT REFERENCES roles(id),
  permiso_id BIGINT REFERENCES permisos(id),
  PRIMARY KEY (role_id, permiso_id)
);

-- Función para verificar permisos específicos
CREATE OR REPLACE FUNCTION check_permission(
  recurso TEXT,
  accion TEXT,
  record_data JSONB DEFAULT '{}'
) RETURNS BOOLEAN AS $$
DECLARE
  user_permissions JSONB;
  permission_record RECORD;
  condition_result BOOLEAN;
BEGIN
  -- Obtener permisos del usuario
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'recurso', p.recurso,
        'accion', p.accion,
        'condiciones', p.condiciones
      )
    ), 
    '[]'::jsonb
  ) INTO user_permissions
  FROM user_roles ur
  JOIN role_permisos rp ON ur.role_id = rp.role_id
  JOIN permisos p ON rp.permiso_id = p.id
  WHERE ur.user_id = auth.uid()
  AND p.recurso = check_permission.recurso
  AND p.accion = check_permission.accion;

  -- Verificar cada permiso
  FOR permission_record IN 
    SELECT * FROM jsonb_array_elements(user_permissions)
  LOOP
    -- Si no hay condiciones, permitir
    IF permission_record.value->>'condiciones' = '{}' THEN
      RETURN true;
    END IF;
    
    -- Evaluar condiciones (simplificado)
    -- En producción usarías un evaluador más robusto
    IF (permission_record.value->'condiciones'->>'owner_only')::boolean = true THEN
      IF record_data->>'user_id' = auth.uid()::text THEN
        RETURN true;
      END IF;
    END IF;
  END LOOP;

  RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Usar en RLS
CREATE POLICY "Permission based access" ON posts
  FOR SELECT USING (
    check_permission('posts', 'read', row_to_json(posts)::jsonb)
  );
```

---

## 🔧 **MÓDULO 7: EDGE FUNCTIONS - SERVERLESS EN EL EDGE**

### **Tu Primera Edge Function**
```bash
# Crear nueva function
supabase functions new mi-funcion

# Estructura generada:
# supabase/functions/mi-funcion/index.ts
```

```typescript
// supabase/functions/mi-funcion/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RequestData {
  name: string
  email: string
}

serve(async (req) => {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Obtener datos del request
    const { name, email }: RequestData = await req.json()
    
    // Validar datos
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Crear cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Procesar lógica de negocio
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, created_at: new Date().toISOString() }])

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### **Webhook Handler Avanzado**
```typescript
// supabase/functions/webhook-mercadopago/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts"

interface MercadoPagoWebhook {
  action: string
  api_version: string
  data: {
    id: string
  }
  date_created: string
  id: number
  live_mode: boolean
  type: string
  user_id: string
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const signature = req.headers.get('x-signature')
    const requestId = req.headers.get('x-request-id')
    
    if (!signature) {
      return new Response('Missing signature', { status: 401 })
    }

    // Verificar firma
    const body = await req.text()
    const expectedSignature = createHmac('sha256', Deno.env.get('MP_WEBHOOK_SECRET')!)
      .update(requestId + body)
      .digest('hex')

    if (signature !== `v1=${expectedSignature}`) {
      return new Response('Invalid signature', { status: 401 })
    }

    const webhook: MercadoPagoWebhook = JSON.parse(body)
    
    // Solo procesar pagos
    if (webhook.type !== 'payment') {
      return new Response('OK', { status: 200 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Obtener detalles del pago de MercadoPago API
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${webhook.data.id}`,
      {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}`
        }
      }
    )

    const payment = await mpResponse.json()

    // Actualizar estado del pedido en nuestra BD
    if (payment.status === 'approved') {
      await supabase
        .from('pedidos')
        .update({ 
          estado: 'pagado',
          mp_payment_id: payment.id,
          processed_at: new Date().toISOString()
        })
        .eq('mp_preference_id', payment.additional_info?.external_reference)

      // Enviar email de confirmación
      await supabase.functions.invoke('send-order-confirmation', {
        body: { orderId: payment.additional_info?.external_reference }
      })
    } else if (payment.status === 'rejected') {
      await supabase
        .from('pedidos')
        .update({ estado: 'rechazado' })
        .eq('mp_preference_id', payment.additional_info?.external_reference)
    }

    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
})
```

### **Procesamiento de Imágenes con Edge Function**
```typescript
// supabase/functions/process-image/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { imagePath, productId } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Descargar imagen original
    const { data: imageData } = await supabase.storage
      .from('productos')
      .download(imagePath)

    if (!imageData) {
      throw new Error('Image not found')
    }

    // Convertir a array buffer para procesamiento
    const arrayBuffer = await imageData.arrayBuffer()
    
    // Procesar imagen (redimensionar, optimizar, etc.)
    // Aquí usarías una librería como Sharp o ImageMagick
    // Para el ejemplo, simularemos el procesamiento
    
    const sizes = [
      { name: 'thumbnail', width: 150, height: 150 },
      { name: 'medium', width: 500, height: 500 },
      { name: 'large', width: 1200, height: 1200 }
    ]

    const processedImages = []

    for (const size of sizes) {
      // Simular procesamiento
      const processedImageData = new Uint8Array(arrayBuffer)
      
      // Generar path para imagen procesada
      const basePath = imagePath.replace(/\.[^/.]+$/, "")
      const processedPath = `${basePath}_${size.name}.jpg`
      
      // Subir imagen procesada
      const { data: uploadData, error } = await supabase.storage
        .from('productos')
        .upload(processedPath, processedImageData, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (error) {
        console.error('Upload error:', error)
        continue
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('productos')
        .getPublicUrl(processedPath)

      processedImages.push({
        size: size.name,
        path: processedPath,
        url: urlData.publicUrl
      })
    }

    // Actualizar producto con URLs de imágenes procesadas
    await supabase
      .from('productos')
      .update({
        imagenes_procesadas: processedImages,
        procesamiento_completado: true
      })
      .eq('id', productId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        processedImages: processedImages.length 
      }),
      { 
        headers: { 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

### **Cron Jobs con Edge Functions**
```typescript
// supabase/functions/daily-cleanup/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Verificar que viene del cron de Supabase
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${Deno.env.get('SUPABASE_FUNCTION_SECRET')}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // 1. Limpiar sesiones expiradas
    const { error: sessionsError } = await supabase
      .from('user_sessions')
      .delete()
      .lt('expires_at', today.toISOString())

    // 2. Archivar pedidos antiguos
    const { data: oldOrders } = await supabase
      .from('pedidos')
      .select('id')
      .eq('estado', 'entregado')
      .lt('created_at', thirtyDaysAgo.toISOString())

    if (oldOrders && oldOrders.length > 0) {
      // Mover a tabla de archivo
      const { error: archiveError } = await supabase
        .from('pedidos_archivo')
        .insert(
          oldOrders.map(order => ({
            ...order,
            archived_at: today.toISOString()
          }))
        )

      if (!archiveError) {
        // Eliminar de tabla principal
        await supabase
          .from('pedidos')
          .delete()
          .in('id', oldOrders.map(o => o.id))
      }
    }

    // 3. Limpiar archivos temporales del storage
    const { data: tempFiles } = await supabase.storage
      .from('temp')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'asc' }
      })

    if (tempFiles) {
      const filesToDelete = tempFiles
        .filter(file => {
          const fileDate = new Date(file.created_at)
          return fileDate < thirtyDaysAgo
        })
        .map(file => file.name)

      if (filesToDelete.length > 0) {
        await supabase.storage
          .from('temp')
          .remove(filesToDelete)
      }
    }

    // 4. Enviar reporte de limpieza
    const report = {
      cleaned_sessions: 'completed',
      archived_orders: oldOrders?.length || 0,
      deleted_temp_files: tempFiles?.length || 0,
      executed_at: today.toISOString()
    }

    // Guardar log de ejecución
    await supabase
      .from('cron_logs')
      .insert({
        job_name: 'daily-cleanup',
        status: 'success',
        report,
        executed_at: today.toISOString()
      })

    return new Response(
      JSON.stringify({ success: true, report }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    // Log error
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    await supabase
      .from('cron_logs')
      .insert({
        job_name: 'daily-cleanup',
        status: 'error',
        error_message: error.message,
        executed_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

### **Deploy Edge Functions**
```bash
# Deploy function específica
supabase functions deploy mi-funcion

# Deploy todas las functions
supabase functions deploy

# Invoke function para testing
supabase functions invoke mi-funcion --with-json '{"name": "Juan", "email": "juan@test.com"}'

# Ver logs
supabase functions logs mi-funcion
```

---

## 🚀 **MÓDULO 8: CASOS DE USO REALES ARGENTINOS**

### **1. E-commerce con MercadoPago**
```javascript
// Hook para integración con MercadoPago
function useMercadoPago() {
  const createPreference = async (orderData) => {
    try {
      // Llamar a Edge Function que maneja MercadoPago
      const { data, error } = await supabase.functions.invoke('create-mp-preference', {
        body: {
          items: orderData.items.map(item => ({
            title: item.nombre,
            quantity: item.cantidad,
            unit_price: item.precio,
            currency_id: 'ARS'
          })),
          payer: {
            email: orderData.buyer_email,
            name: orderData.buyer_name
          },
          back_urls: {
            success: `${window.location.origin}/payment/success`,
            failure: `${window.location.origin}/payment/failure`,
            pending: `${window.location.origin}/payment/pending`
          },
          external_reference: orderData.order_id,
          notification_url: `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/webhook-mercadopago`
        }
      })

      if (error) throw error
      return data.preference_id

    } catch (error) {
      console.error('Error creating MP preference:', error)
      throw error
    }
  }

  const redirectToPayment = (preferenceId) => {
    const script = document.createElement('script')
    script.src = 'https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js'
    script.setAttribute('data-preference-id', preferenceId)
    document.body.appendChild(script)
  }

  return { createPreference, redirectToPayment }
}
```

### **2. Sistema de Delivery con Geolocalización**
```sql
-- Tabla para zonas de delivery
CREATE TABLE zonas_delivery (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  poligono GEOMETRY(POLYGON, 4326) NOT NULL,
  costo_envio DECIMAL(8,2) NOT NULL,
  tiempo_estimado_min INTEGER NOT NULL,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice espacial para consultas rápidas
CREATE INDEX idx_zonas_delivery_poligono ON zonas_delivery USING GIST(poligono);

-- Función para calcular costo de envío
CREATE OR REPLACE FUNCTION calcular_costo_envio(
  lat DECIMAL,
  lng DECIMAL
) RETURNS JSONB AS $$
DECLARE
  zona RECORD;
  punto GEOMETRY;
BEGIN
  -- Crear punto desde coordenadas
  punto := ST_SetSRID(ST_MakePoint(lng, lat), 4326);
  
  -- Buscar zona que contenga el punto
  SELECT 
    id, nombre, costo_envio, tiempo_estimado_min
  INTO zona
  FROM zonas_delivery 
  WHERE ST_Contains(poligono, punto) 
  AND activa = true
  ORDER BY costo_envio ASC
  LIMIT 1;
  
  -- Si se encuentra zona, devolver info
  IF zona.id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'disponible', true,
      'zona_id', zona.id,
      'zona_nombre', zona.nombre,
      'costo', zona.costo_envio,
      'tiempo_estimado_min', zona.tiempo_estimado_min
    );
  ELSE
    RETURN jsonb_build_object(
      'disponible', false,
      'mensaje', 'No realizamos envíos a esta zona'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;
```

```javascript
// Hook para gestión de delivery
function useDelivery() {
  const [userLocation, setUserLocation] = useState(null)
  const [deliveryInfo, setDeliveryInfo] = useState(null)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      throw new Error('Geolocalización no soportada')
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          resolve(location)
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  const checkDeliveryAvailability = async (lat, lng) => {
    try {
      const { data, error } = await supabase
        .rpc('calcular_costo_envio', { lat, lng })

      if (error) throw error
      
      setDeliveryInfo(data)
      return data

    } catch (error) {
      console.error('Error checking delivery:', error)
      throw error
    }
  }

  const searchAddress = async (address) => {
    try {
      // Usar API de geocoding (ej: Google Maps, OpenStreetMap)
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address + ', Argentina')}&key=${process.env.REACT_APP_OPENCAGE_KEY}`
      )
      
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        const location = {
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          formatted_address: result.formatted
        }
        
        setUserLocation(location)
        await checkDeliveryAvailability(location.lat, location.lng)
        
        return location
      } else {
        throw new Error('Dirección no encontrada')
      }

    } catch (error) {
      console.error('Error searching address:', error)
      throw error
    }
  }

  return {
    userLocation,
    deliveryInfo,
    getCurrentLocation,
    checkDeliveryAvailability,
    searchAddress
  }
}
```

### **3. Sistema de Facturación AFIP**
```typescript
// Edge Function para generar facturas AFIP
// supabase/functions/generate-afip-invoice/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface AFIPInvoiceData {
  order_id: string
  customer: {
    name: string
    document_type: string // CUIT, CUIL, DNI
    document_number: string
    email: string
    address: string
  }
  items: Array<{
    description: string
    quantity: number
    unit_price: number
    vat_rate: number // 21%, 10.5%, 0%
  }>
}

serve(async (req) => {
  try {
    const invoiceData: AFIPInvoiceData = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. Generar número de factura
    const { data: lastInvoice } = await supabase
      .from('facturas')
      .select('numero')
      .order('numero', { ascending: false })
      .limit(1)
      .single()

    const nextNumber = lastInvoice ? lastInvoice.numero + 1 : 1

    // 2. Calcular totales
    const subtotal = invoiceData.items.reduce((sum, item) => 
      sum + (item.quantity * item.unit_price), 0
    )
    
    const vatAmount = invoiceData.items.reduce((sum, item) => 
      sum + (item.quantity * item.unit_price * item.vat_rate / 100), 0
    )
    
    const total = subtotal + vatAmount

    // 3. Conectar con AFIP (simulado)
    const afipResponse = await fetch('https://wswhomo.afip.gov.ar/wsfev1/service.asmx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'SOAPAction': 'http://ar.gov.afip.dif.FEV1/FECAESolicitar'
      },
      body: generateSOAPRequest(invoiceData, nextNumber, subtotal, vatAmount, total)
    })

    const afipResult = await parseAFIPResponse(afipResponse)

    if (afipResult.success) {
      // 4. Guardar factura en BD
      const { data: invoice, error } = await supabase
        .from('facturas')
        .insert({
          numero: nextNumber,
          order_id: invoiceData.order_id,
          customer_data: invoiceData.customer,
          items: invoiceData.items,
          subtotal,
          vat_amount: vatAmount,
          total,
          cae: afipResult.cae,
          cae_due_date: afipResult.cae_due_date,
          afip_response: afipResult.raw_response,
          status: 'approved'
        })
        .select()
        .single()

      if (error) throw error

      // 5. Generar PDF de la factura
      const pdfBuffer = await generateInvoicePDF(invoice)
      
      // 6. Subir PDF al storage
      const pdfPath = `facturas/${invoice.id}/factura-${nextNumber}.pdf`
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(pdfPath, pdfBuffer, {
          contentType: 'application/pdf'
        })

      if (!uploadError) {
        // Actualizar factura con URL del PDF
        await supabase
          .from('facturas')
          .update({ pdf_path: pdfPath })
          .eq('id', invoice.id)
      }

      // 7. Enviar por email
      await supabase.functions.invoke('send-invoice-email', {
        body: {
          invoice_id: invoice.id,
          customer_email: invoiceData.customer.email
        }
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          invoice_number: nextNumber,
          cae: afipResult.cae,
          invoice_id: invoice.id
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )

    } else {
      throw new Error(`AFIP Error: ${afipResult.error}`)
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

---

## 🏆 **PLAN DE MAESTRÍA: 60 DÍAS HACIA LA EXPERTICIA**

### **Semana 1-2: Fundamentos Sólidos**
- **Día 1-3:** Setup, primeras tablas, RLS básico
- **Día 4-7:** CRUD completo, relaciones, políticas
- **Día 8-10:** Auth completa con roles
- **Día 11-14:** Realtime y subscripciones

### **Semana 3-4: Features Avanzadas**
- **Día 15-17:** Storage y gestión de archivos
- **Día 18-21:** Edge Functions básicas
- **Día 22-25:** RLS avanzado y multi-tenancy
- **Día 26-28:** Testing y debugging

### **Semana 5-6: Integración Real**
- **Día 29-32:** MercadoPago y pagos
- **Día 33-35:** Geolocalización y delivery
- **Día 36-38:** Facturación AFIP
- **Día 39-42:** Performance y optimización

### **Semana 7-8: Proyecto Master**
- **Día 43-49:** E-commerce completo argentino
- **Día 50-56:** Deploy y monitoring
- **Día 57-60:** Documentación y presentación

---

## 📊 **PROYECTOS PRÁCTICOS PROGRESIVOS**

### **1. Todo App (Básico)**
```javascript
// Funcionalidades:
- CRUD de tareas
- Auth simple
- Realtime updates
- Storage para adjuntos

// Tecnologías aprendidas:
- Tables y RLS
- Auth con email
- Realtime subscriptions
- Storage básico
```

### **2. Blog Multiuser (Intermedio)**
```javascript
// Funcionalidades:
- Sistema de usuarios y roles
- Posts con categorías
- Comentarios en tiempo real
- Imágenes y media
- Dashboard analytics

// Tecnologías aprendidas:
- RLS complejo
- Relaciones múltiples
- Edge Functions
- Storage avanzado
- Roles granulares
```

### **3. E-commerce Argentino (Avanzado)**
```javascript
// Funcionalidades:
- Catálogo de productos
- Carrito y checkout
- MercadoPago integration
- Sistema de delivery
- Facturación AFIP
- Dashboard vendedor
- Analytics en tiempo real

// Tecnologías aprendidas:
- Multi-tenancy
- Geolocalización
- Webhooks
- Integraciones externas
- Performance optimization
- Monitoring y logs
```

---

## 🎯 **CHECKLIST DEL MAESTRO SUPABASE**

### **Fundamentos (Obligatorio al 100%)**
- [ ] Setup proyecto local y cloud
- [ ] Crear schemas complejos con relaciones
- [ ] RLS policies básicas y avanzadas
- [ ] Auth completa (email, social, magic link)
- [ ] CRUD operations con client
- [ ] Realtime subscriptions
- [ ] Storage con policies
- [ ] Edge Functions básicas

### **Avanzado (Para destacar)**
- [ ] Multi-tenancy con RLS
- [ ] Performance optimization
- [ ] Custom auth flows
- [ ] Webhooks y integraciones
- [ ] Geolocalización y geo-queries
- [ ] Full-text search
- [ ] Edge Functions complejas
- [ ] Monitoring y debugging

### **Experto (Para liderar)**
- [ ] Architecture patterns
- [ ] Security best practices
- [ ] Scale strategies
- [ ] Migration strategies
- [ ] Custom extensions
- [ ] Team collaboration
- [ ] DevOps y deploy
- [ ] Training y mentoring

---

## 🚀 **RECURSOS PARA CONTINUAR CRECIENDO**

### **Documentación Esencial**
- Supabase Docs: https://supabase.com/docs
- PostgreSQL Manual: https://www.postgresql.org/docs/
- Deno Docs (Edge Functions): https://deno.land/manual

### **Comunidad y Aprendizaje**
- Supabase Discord
- Supabase GitHub Discussions
- YouTube Supabase Channel
- Supabase Blog

### **Herramientas del Maestro**
```bash
# Development
- Supabase CLI
- VS Code + Supabase extension
- PostgreSQL clients (DBeaver, pgAdmin)
- Postman/Insomnia (API testing)

# Monitoring
- Supabase Dashboard
- Sentry (error tracking)
- LogRocket (user sessions)
- Google Analytics

# Deployment
- Vercel/Netlify
- Docker containers
- GitHub Actions
- Supabase CLI deploys
```

---

**¡Felicitaciones! Ahora tenés la roadmap completa para convertirte en un arquitecto de Supabase. Esta tecnología está revolucionando cómo construimos backends modernos.**

**Tu ventaja competitiva: dominar Supabase te posiciona en la vanguardia del desarrollo backend sin la complejidad tradicional de servidores y APIs.**

**¿Estás listo para construir el futuro del desarrollo backend?** 🔥