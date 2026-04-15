---
title: "Curso de React Native: Construye MacroZone - Tu App de Nutrición"
description: "Aprende a construir una app funcional de seguimiento nutricional con React Native y Expo. Desde configuración hasta deployment."
pubDate: "2026-04-15"
code: "react-native-macrozona"
category: "informatica"
tags: ["react-native", "expo", "mobile", "javascript", "nutricion", "app"]
difficulty: "principiante"
readingTime: 15
---

# Curso de React Native: Construye MacroZone - Tu App de Nutrición

> 💡 **En esta guía aprenderás**: A construir una app completa de seguimiento nutricional con React Native y Expo. Fundamentos mobile antes de usar IA.

---

## Introducción

### Qué Es React Native

Facebook desarrolló React Native para crear apps móviles natives usando JavaScript y React.

```
React Native:
// ✅ Apps para iOS y Android
// ✅ Código compartido
// ✅ Componentes nativos
// ✅ Actualizaciones over-the-air
```

### Por Qué Expo

```
Expo:
// Herramientas adicionales
// APIs de dispositivo simplified
// Build simplificado
// Sin configuración nativa compleja
```

---

## Fundamentos y Configuración

### Inicializar Proyecto

```bash
npx create-expo-app@latest MacroZone
cd MacroZone
npm start
```

### Configurar Desarrollo

```
Para iOS:
npm run ios

Para Android:
npm run android

Para Web:
npm run web
```

### Resetear Proyecto

```
Si hay problemas:
npm run reset-project
```

---

## Conceptos Básicos y Estilos

### Componentes Core

```jsx
// View = div
// Text = p/span
// Pressable = button/ink

import { View, Text, Pressable } from 'react-native';

<View style={styles.container}>
  <Text>Hola Mundo</Text>
  <Pressable onPress={handlePress}>
    <Text>Presiona aquí</Text>
  </Pressable>
</View>
```

### Estilos Globales

```jsx
const globalStyles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
};
```

### Plataforma Específica

```jsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: { paddingTop: 40 },
      android: { paddingTop: 20 },
    }),
  },
});
```

---

## Navegación

### Expo Router

```bash
npx expo install expo-router
```

### Estructura de Archivos

```
app/
├── _layout.js      # Layout principal
├── index.js       # Home
├── (tabs)/        # Navegación por tabs
│   ├── _layout.js
│   ├── index.js  # Tab 1
│   └── profile.js # Tab 2
└── [id].js       # Dynamic route
```

### Stack Navigation

```jsx
// app/_layout.js
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="details" />
    </Stack>
  );
}
```

### Tab Navigation

```jsx
// app/(tabs)/_layout.js
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
```

---

## Arquitectura de Componentes

### MacroCard

```jsx
export function MacroCard({ title, protein, carbs, fat }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.macros}>
        <Text>Protein: {protein}g</Text>
        <Text>Carbs: {carbs}g</Text>
        <Text>Fat: {fat}g</Text>
      </View>
    </View>
  );
}
```

### MacroGrid

```jsx
export function MacroGrid({ meals }) {
  return (
    <View style={styles.grid}>
      {meals.map((meal) => (
        <MacroCard key={meal.id} {...meal} />
      ))}
    </View>
  );
}
```

### MealItem

```jsx
export function MealItem({ meal, onDelete }) {
  return (
    <View style={styles.item}>
      <Text>{meal.name}</Text>
      <Pressable onPress={() => onDelete(meal.id)}>
        <Text>Eliminar</Text>
      </Pressable>
    </View>
  );
}
```

### RecentMeals

```jsx
export function RecentMeals({ meals, onDelete }) {
  return (
    <FlatList
      data={meals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MealItem meal={item} onDelete={onDelete} />
      )}
    />
  );
}
```

---

## Persistencia de Datos

### AsyncStorage

```bash
npm install @react-native-async-storage/async-storage
```

### Guardar Datos

```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveMeals = async (meals) => {
  try {
    const jsonValue = JSON.stringify(meals);
    await AsyncStorage.setItem('@meals', jsonValue);
  } catch (e) {
    console.error(e);
  }
};
```

### Cargar Datos

```jsx
const loadMeals = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@meals');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};
```

### Eliminar Datos

```jsx
const deleteMeal = async (id, meals) => {
  const updated = meals.filter((meal) => meal.id !== id);
  await saveMeals(updated);
  return updated;
};
```

### CRUD Completo

```jsx
// Create
const addMeal = async (meal) => {
  const newMeals = [...meals, { ...meal, id: Date.now() }];
  await saveMeals(newMeals);
  return newMeals;
};

// Read
const getMeals = async () => {
  return await loadMeals();
};

// Update
const updateMeal = async (id, data, meals) => {
  const updated = meals.map((m) => (m.id === id ? { ...m, ...data } : m));
  await saveMeals(updated);
  return updated;
};

// Delete
const removeMeal = async (id, meals) => {
  return await deleteMeal(id, meals);
};
```

---

## APIs de Dispositivo

### Haptics (Vibración)

```bash
npx expo install expo-haptics
```

```jsx
import * as Haptics from 'expo-haptics';

Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

### Share API

```bash
npx expo install expo-sharing
```

```jsx
import { Share } from 'react-native';

const shareResults = async (results) => {
  await Share.share({
    message: 'Mis macronutientes de hoy',
  });
};
```

### Clipboard API

```bash
npx expo install expo-clipboard
```

```jsx
import * as Clipboard from 'expo-clipboard';

const copyToClipboard = async () => {
  await Clipboard.setStringAsync('Hola!');
};
```

### Local Push Notifications

```bash
npx expo install expo-notifications
```

```jsx
import * as Notifications from 'expo-notifications';

Notifications.requestPermissionsAsync();

Notifications.scheduleNotificationAsync({
  content: {
    title: 'Recordatorio',
    body: 'Registra tu comida',
  },
  trigger: {
    hour: 10,
    minute: 0,
  },
});
```

---

## Deployment

### EAS (Expo Application Services)

```bash
npm install -g eas-cli
eas configure
```

### Build para App Store

```bash
eas build --platform ios
```

### Build para Play Store

```bash
eas build --platform android
```

### Submit a Tiendas

```bash
eas submit --platform ios
eas submit --platform android
```

---

## Resumen: Sistema Completo

| Fase | Componente | Descripción |
|------|------------|-------------|
| **1. Setup** | Expo | Inicializar proyecto |
| **2. UI** | Componentes | View, Text, Pressable |
| **3. Navegación** | Stack + Tabs | Rutas y navegación |
| **4. Datos** | AsyncStorage | Persistencia local |
| **5. APIs** | Device | Haptics, Share, Clipboard, Notifications |
| **6. Deploy** | EAS | Build y deployment |

---

## Código del App

```jsx
// App.js
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { MacroCard, RecentMeals } from './components';

export default function App() {
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const addMeal = () => {
    const newMeal = {
      id: Date.now(),
      name,
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fat: parseInt(fat),
    };
    setMeals([...meals, newMeal]);
    // Guardar en AsyncStorage
  };

  const deleteMeal = (id) => {
    setMeals(meals.filter((m) => m.id !== id));
    // Actualizar AsyncStorage
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>MacroZone</Text>
      <TextInput
        placeholder="Nombre de comida"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Proteína"
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />
      <TextInput
        placeholder="Carbohidratos"
        keyboardType="numeric"
        value={carbs}
        onChangeText={setCarbs}
      />
      <TextInput
        placeholder="Grasas"
        keyboardType="numeric"
        value={fat}
        onChangeText={setFat}
      />
      <Pressable onPress={addMeal}>
        <Text>Agregar Comida</Text>
      </Pressable>
      <RecentMeals meals={meals} onDelete={deleteMeal} />
    </View>
  );
}
```

---

## Próximos Pasos

**Esta semana**:

1. [ ] Crea tu proyecto con Expo
2. [ ] Configura estructura de navegación
3. [ ] Construye componentes UI
4. [ ] Implementa AsyncStorage
5. [ ] Agrega APIs de dispositivo
6. [ ] Prepara para deployment con EAS

> 🚀 **Recordatorio**: Los fundamentos de React Native son esenciales antes de integrar tooling de IA. Entiende lo básico primero.

---

*¿Ya conocías React Native? Comparte tu experiencia en los comentarios.*