---
title: 'React Native: De Caos a Orden'
description: 'Guía de Estado Interno en React Native: De Caos a Orden'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía de Estado Interno en React Native: De Caos a Orden

## Mejores Prácticas para Componentes con Estados Complejos

## 🎛️ El Problema: El Infierno de los useState

**Analogía**: *Imagine tu casa con 20 controles remotos diferentes esparcidos por toda la sala - uno para la TV, otro para el aire acondicionado, otro para las luces, otro para el sonido, etc. Cada vez que quieres hacer algo simple como "modo película", tienes que buscar y coordinar múltiples controles.*

### ❌ Código Problemático - El Caos de Estados

```typescript
// ❌ MALO - Demasiados useState, como tener 20 controles remotos dispersos
const BadFormComponent = () => {
  // Estados individuales - cada uno como un control remoto diferente
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // ... y muchos más estados

  // Efectos que intentan sincronizar todos estos estados
  useEffect(() => {
    // Complejo manejo de sincronización
    setIsFormValid(
      firstName.length > 0 && 
      lastName.length > 0 && 
      isEmailValid && 
      isPhoneValid && 
      !isSubmitting
    );
  }, [firstName, lastName, isEmailValid, isPhoneValid, isSubmitting]);

  // Más efectos para manejar las interdependencias...
  
  return (
    <View>
      {/* JSX complejo con muchos props individuales */}
    </View>
  );
};
```

### 🎯 Los Problemas de Múltiples useState

1. **Sincronización Compleja**: Como intentar que 20 músicos toquen en armonía sin director
2. **Re-renders Innecesarios**: Cada cambio de estado puede causar renders múltiples
3. **Lógica Dispersa**: La lógica de negocio está esparcida por todo el componente
4. **Difícil Testing**: Imposible testear estados individuales de forma aislada
5. **Mantenimiento Pesadillesco**: Agregar una nueva funcionalidad requiere tocar muchos lugares

---

## 🎛️ Solución 1: useReducer - La Centralita de Control

**Analogía**: *Como tener una centralita de control inteligente que maneja toda tu casa. En lugar de 20 controles remotos, tienes un panel central donde dices "modo película" y automáticamente se ajustan las luces, el sonido, la temperatura y la TV.*

### ✅ Patrón useReducer para Estados Complejos

```typescript
// ✅ BUENO - Estado consolidado con useReducer
import React, { useReducer, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// Tipos - como el manual de la centralita de control
interface UserFormState {
  // Datos del formulario - como los ajustes principales
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
  };
  
  // Estado de validación - como sensores de la casa
  validation: {
    isEmailValid: boolean;
    isPhoneValid: boolean;
    errors: Record<string, string>;
    isFormValid: boolean;
  };
  
  // Estado de UI - como el panel de estado de la centralita
  ui: {
    isSubmitting: boolean;
    isLoading: boolean;
    isEditMode: boolean;
    showSuccessMessage: boolean;
    submitError: string;
  };
  
  // Estado de navegación/flujo - como diferentes modos de la casa
  flow: {
    currentStep: number;
    hasChanges: boolean;
    originalData: any;
    canGoNext: boolean;
    canGoPrevious: boolean;
  };
}

// Estado inicial - como la configuración por defecto de la centralita
const initialState: UserFormState = {
  formData: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
  },
  validation: {
    isEmailValid: true,
    isPhoneValid: true,
    errors: {},
    isFormValid: false,
  },
  ui: {
    isSubmitting: false,
    isLoading: false,
    isEditMode: false,
    showSuccessMessage: false,
    submitError: '',
  },
  flow: {
    currentStep: 1,
    hasChanges: false,
    originalData: null,
    canGoNext: false,
    canGoPrevious: false,
  },
};

// Acciones - como los comandos que le das a la centralita
type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof UserFormState['formData']; value: string }
  | { type: 'SET_VALIDATION_ERROR'; field: string; error: string }
  | { type: 'CLEAR_VALIDATION_ERROR'; field: string }
  | { type: 'START_SUBMIT' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'LOAD_DATA'; data: any }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET_FORM' };

// Helpers para validación - como sensores inteligentes
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''));
};

// Reducer - como el cerebro de la centralita que procesa comandos
const formReducer = (state: UserFormState, action: FormAction): UserFormState => {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const newFormData = {
        ...state.formData,
        [action.field]: action.value,
      };
  
      // Validación automática - como sensores que reaccionan instantáneamente
      let newValidation = { ...state.validation };
  
      if (action.field === 'email') {
        newValidation.isEmailValid = validateEmail(action.value);
        if (newValidation.isEmailValid) {
          const { email, ...remainingErrors } = newValidation.errors;
          newValidation.errors = remainingErrors;
        } else {
          newValidation.errors = { ...newValidation.errors, email: 'Email inválido' };
        }
      }
  
      if (action.field === 'phone') {
        newValidation.isPhoneValid = validatePhone(action.value);
        if (newValidation.isPhoneValid) {
          const { phone, ...remainingErrors } = newValidation.errors;
          newValidation.errors = remainingErrors;
        } else {
          newValidation.errors = { ...newValidation.errors, phone: 'Teléfono inválido' };
        }
      }
  
      // Calcular si el formulario es válido - como el estado general de la casa
      const isFormValid = Object.values(newFormData).every(value => value.trim() !== '') &&
                         newValidation.isEmailValid &&
                         newValidation.isPhoneValid &&
                         Object.keys(newValidation.errors).length === 0;
  
      newValidation.isFormValid = isFormValid;
  
      // Detectar cambios - como saber si algo cambió respecto a la configuración original
      const hasChanges = state.flow.originalData ? 
        JSON.stringify(newFormData) !== JSON.stringify(state.flow.originalData) : 
        Object.values(newFormData).some(value => value.trim() !== '');
  
      return {
        ...state,
        formData: newFormData,
        validation: newValidation,
        flow: {
          ...state.flow,
          hasChanges,
          canGoNext: isFormValid && state.flow.currentStep < 3,
        },
      };
    }
  
    case 'START_SUBMIT':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSubmitting: true,
          submitError: '',
          showSuccessMessage: false,
        },
      };
  
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSubmitting: false,
          showSuccessMessage: true,
          submitError: '',
        },
        flow: {
          ...state.flow,
          hasChanges: false,
        },
      };
  
    case 'SUBMIT_ERROR':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSubmitting: false,
          submitError: action.error,
          showSuccessMessage: false,
        },
      };
  
    case 'TOGGLE_EDIT_MODE':
      return {
        ...state,
        ui: {
          ...state.ui,
          isEditMode: !state.ui.isEditMode,
        },
        flow: {
          ...state.flow,
          originalData: !state.ui.isEditMode ? { ...state.formData } : state.flow.originalData,
        },
      };
  
    case 'LOAD_DATA':
      return {
        ...state,
        formData: { ...action.data },
        flow: {
          ...state.flow,
          originalData: { ...action.data },
          hasChanges: false,
        },
        ui: {
          ...state.ui,
          isLoading: false,
        },
      };
  
    case 'NEXT_STEP':
      return {
        ...state,
        flow: {
          ...state.flow,
          currentStep: Math.min(state.flow.currentStep + 1, 3),
          canGoPrevious: true,
          canGoNext: state.flow.currentStep < 2 && state.validation.isFormValid,
        },
      };
  
    case 'PREVIOUS_STEP':
      return {
        ...state,
        flow: {
          ...state.flow,
          currentStep: Math.max(state.flow.currentStep - 1, 1),
          canGoPrevious: state.flow.currentStep > 2,
          canGoNext: true,
        },
      };
  
    case 'RESET_FORM':
      return initialState;
  
    default:
      return state;
  }
};

// Componente principal - como el panel de control de la centralita
const UserFormComponent: React.FC = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  // Efectos para operaciones asíncronas - como procesos automáticos de la centralita
  useEffect(() => {
    // Simular carga de datos inicial
    const loadUserData = async () => {
      dispatch({ type: 'LOAD_DATA', data: {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@ejemplo.com',
        phone: '1234567890',
        address: 'Calle Falsa 123',
        birthDate: '1990-01-01',
      }});
    };
  
    loadUserData();
  }, []);
  
  // Handlers - como botones específicos de la centralita
  const handleFieldChange = (field: keyof UserFormState['formData']) => (value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };
  
  const handleSubmit = async () => {
    dispatch({ type: 'START_SUBMIT' });
  
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      // Simular éxito o error
      if (Math.random() > 0.3) {
        dispatch({ type: 'SUBMIT_SUCCESS' });
        console.log('✅ Formulario enviado exitosamente');
      } else {
        dispatch({ type: 'SUBMIT_ERROR', error: 'Error del servidor' });
      }
    } catch (error) {
      dispatch({ type: 'SUBMIT_ERROR', error: 'Error de conexión' });
    }
  };
  
  const renderStep = () => {
    switch (state.flow.currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>📝 Información Personal</Text>
            <TextInput
              style={[styles.input, state.validation.errors.firstName && styles.inputError]}
              placeholder="Nombre"
              value={state.formData.firstName}
              onChangeText={handleFieldChange('firstName')}
            />
            <TextInput
              style={[styles.input, state.validation.errors.lastName && styles.inputError]}
              placeholder="Apellido"
              value={state.formData.lastName}
              onChangeText={handleFieldChange('lastName')}
            />
            <TextInput
              style={[styles.input, !state.validation.isEmailValid && styles.inputError]}
              placeholder="Email"
              value={state.formData.email}
              onChangeText={handleFieldChange('email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {state.validation.errors.email && (
              <Text style={styles.errorText}>{state.validation.errors.email}</Text>
            )}
          </View>
        );
  
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>📞 Información de Contacto</Text>
            <TextInput
              style={[styles.input, !state.validation.isPhoneValid && styles.inputError]}
              placeholder="Teléfono"
              value={state.formData.phone}
              onChangeText={handleFieldChange('phone')}
              keyboardType="phone-pad"
            />
            {state.validation.errors.phone && (
              <Text style={styles.errorText}>{state.validation.errors.phone}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              value={state.formData.address}
              onChangeText={handleFieldChange('address')}
              multiline
            />
          </View>
        );
  
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>✅ Confirmación</Text>
            <Text style={styles.confirmText}>Nombre: {state.formData.firstName} {state.formData.lastName}</Text>
            <Text style={styles.confirmText}>Email: {state.formData.email}</Text>
            <Text style={styles.confirmText}>Teléfono: {state.formData.phone}</Text>
            <Text style={styles.confirmText}>Dirección: {state.formData.address}</Text>
          </View>
        );
  
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Registro de Usuario</Text>
        <View style={styles.progressBar}>
          {[1, 2, 3].map(step => (
            <View
              key={step}
              style={[
                styles.progressStep,
                step <= state.flow.currentStep && styles.progressStepActive
              ]}
            />
          ))}
        </View>
      </View>
  
      {renderStep()}
  
      {/* Estado de UI - como indicadores luminosos de la centralita */}
      {state.ui.submitError && (
        <Text style={styles.errorText}>❌ {state.ui.submitError}</Text>
      )}
  
      {state.ui.showSuccessMessage && (
        <Text style={styles.successText}>✅ ¡Registro exitoso!</Text>
      )}
  
      {/* Controles de navegación - como botones principales de la centralita */}
      <View style={styles.buttonContainer}>
        {state.flow.canGoPrevious && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => dispatch({ type: 'PREVIOUS_STEP' })}
          >
            <Text style={styles.buttonText}>← Anterior</Text>
          </TouchableOpacity>
        )}
    
        {state.flow.currentStep < 3 ? (
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              !state.flow.canGoNext && styles.disabledButton
            ]}
            onPress={() => dispatch({ type: 'NEXT_STEP' })}
            disabled={!state.flow.canGoNext}
          >
            <Text style={styles.buttonText}>Siguiente →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              (!state.validation.isFormValid || state.ui.isSubmitting) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!state.validation.isFormValid || state.ui.isSubmitting}
          >
            <Text style={styles.buttonText}>
              {state.ui.isSubmitting ? '⏳ Enviando...' : '📤 Enviar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
  
      {/* Panel de debug - como monitor de estado de la centralita */}
      {__DEV__ && (
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>🔧 Estado de Debug</Text>
          <Text style={styles.debugText}>Paso: {state.flow.currentStep}/3</Text>
          <Text style={styles.debugText}>Válido: {state.validation.isFormValid ? '✅' : '❌'}</Text>
          <Text style={styles.debugText}>Cambios: {state.flow.hasChanges ? '✅' : '❌'}</Text>
          <Text style={styles.debugText}>Enviando: {state.ui.isSubmitting ? '⏳' : '❌'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  progressStep: {
    width: 30,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#007AFF',
  },
  stepContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 10,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugPanel: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057',
  },
  debugText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
});

export default UserFormComponent;
```

---

## 🧩 Solución 2: Custom Hooks - Los Asistentes Especializados

**Analogía**: *Como tener asistentes personales especializados - uno para manejar la música, otro para las luces, otro para la temperatura. Cada uno es experto en su área y trabajan en coordinación.*

### 🎵 Ejemplo: Hook para Reproductor de Música

```typescript
// Custom Hook - Como un asistente especializado en música
import { useState, useEffect, useCallback, useRef } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  album?: string;
  albumArt?: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  playlist: Track[];
  currentIndex: number;
}

// Hook especializado en manejo de reproductor de música
const useMusicPlayer = (initialPlaylist: Track[] = []) => {
  // Estado consolidado - como el panel de control del asistente de música
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    volume: 0.8,
    isShuffled: false,
    repeatMode: 'none',
    playlist: initialPlaylist,
    currentIndex: -1,
  });
  
  // Referencias para funcionalidad del reproductor
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<any>(null);
  
  // Función para actualizar estado de forma segura
  const updatePlayerState = useCallback((updates: Partial<PlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...updates }));
  }, []);
  
  // Funciones del reproductor - como comandos específicos al asistente
  const playTrack = useCallback(async (track: Track, index: number) => {
    try {
      updatePlayerState({ 
        isLoading: true,
        currentTrack: track,
        currentIndex: index 
      });
  
      // Simular carga de audio
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      updatePlayerState({ 
        isLoading: false,
        isPlaying: true,
        currentTime: 0 
      });
  
      console.log(`🎵 Reproduciendo: ${track.title} - ${track.artist}`);
  
      // Simular progreso de reproducción
      intervalRef.current = setInterval(() => {
        setPlayerState(prev => {
          if (prev.currentTime >= track.duration) {
            // Canción terminó, ir a la siguiente
            return prev;
          }
          return { ...prev, currentTime: prev.currentTime + 1 };
        });
      }, 1000);
  
    } catch (error) {
      updatePlayerState({ isLoading: false, isPlaying: false });
      console.error('Error al reproducir:', error);
    }
  }, [updatePlayerState]);
  
  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    updatePlayerState({ isPlaying: false });
    console.log('⏸️ Música pausada');
  }, [updatePlayerState]);
  
  const resume = useCallback(() => {
    if (playerState.currentTrack && !playerState.isPlaying) {
      updatePlayerState({ isPlaying: true });
      console.log('▶️ Música reanudada');
  
      // Reanudar simulación de progreso
      intervalRef.current = setInterval(() => {
        setPlayerState(prev => {
          if (prev.currentTime >= (prev.currentTrack?.duration || 0)) {
            return prev;
          }
          return { ...prev, currentTime: prev.currentTime + 1 };
        });
      }, 1000);
    }
  }, [playerState.currentTrack, playerState.isPlaying, updatePlayerState]);
  
  const togglePlayPause = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [playerState.isPlaying, pause, resume]);
  
  const nextTrack = useCallback(() => {
    const { playlist, currentIndex, isShuffled, repeatMode } = playerState;
  
    if (playlist.length === 0) return;
  
    let nextIndex: number;
  
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= playlist.length) {
        nextIndex = repeatMode === 'all' ? 0 : currentIndex;
      }
    }
  
    if (nextIndex !== currentIndex && nextIndex < playlist.length) {
      playTrack(playlist[nextIndex], nextIndex);
    }
  }, [playerState, playTrack]);
  
  const previousTrack = useCallback(() => {
    const { playlist, currentIndex } = playerState;
  
    if (playlist.length === 0 || currentIndex <= 0) return;
  
    const prevIndex = currentIndex - 1;
    playTrack(playlist[prevIndex], prevIndex);
  }, [playerState, playTrack]);
  
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    updatePlayerState({ volume: clampedVolume });
    console.log(`🔊 Volumen: ${Math.round(clampedVolume * 100)}%`);
  }, [updatePlayerState]);
  
  const toggleShuffle = useCallback(() => {
    updatePlayerState({ isShuffled: !playerState.isShuffled });
    console.log(`🔀 Shuffle: ${!playerState.isShuffled ? 'ON' : 'OFF'}`);
  }, [playerState.isShuffled, updatePlayerState]);
  
  const toggleRepeat = useCallback(() => {
    const modes: PlayerState['repeatMode'][] = ['none', 'one', 'all'];
    const currentModeIndex = modes.indexOf(playerState.repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
  
    updatePlayerState({ repeatMode: nextMode });
    console.log(`🔁 Repeat: ${nextMode.toUpperCase()}`);
  }, [playerState.repeatMode, updatePlayerState]);
  
  const seekTo = useCallback((time: number) => {
    if (playerState.currentTrack) {
      const clampedTime = Math.max(0, Math.min(playerState.currentTrack.duration, time));
      updatePlayerState({ currentTime: clampedTime });
    }
  }, [playerState.currentTrack, updatePlayerState]);
  
  const addToPlaylist = useCallback((tracks: Track[]) => {
    updatePlayerState({ 
      playlist: [...playerState.playlist, ...tracks] 
    });
    console.log(`➕ Agregadas ${tracks.length} canciones a la playlist`);
  }, [playerState.playlist, updatePlayerState]);
  
  const removeFromPlaylist = useCallback((trackId: string) => {
    const newPlaylist = playerState.playlist.filter(track => track.id !== trackId);
    const currentTrackIndex = newPlaylist.findIndex(track => 
      track.id === playerState.currentTrack?.id
    );
  
    updatePlayerState({ 
      playlist: newPlaylist,
      currentIndex: currentTrackIndex
    });
  }, [playerState, updatePlayerState]);
  
  // Efecto para manejar fin de canción
  useEffect(() => {
    if (playerState.currentTrack && 
        playerState.currentTime >= playerState.currentTrack.duration &&
        playerState.isPlaying) {
  
      console.log('🏁 Canción terminada');
  
      if (playerState.repeatMode === 'one') {
        // Repetir la misma canción
        seekTo(0);
      } else {
        // Ir a la siguiente
        nextTrack();
      }
    }
  }, [playerState.currentTime, playerState.currentTrack, playerState.repeatMode, nextTrack, seekTo]);
  
  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Funciones auxiliares para UI
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  const getProgress = useCallback(() => {
    if (!playerState.currentTrack) return 0;
    return (playerState.currentTime / playerState.currentTrack.duration) * 100;
  }, [playerState.currentTime, playerState.currentTrack]);
  
  // API pública del hook
  return {
    // Estado actual
    ...playerState,
  
    // Acciones principales
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    pause,
    resume,
  
    // Controles
    setVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
  
    // Gestión de playlist
    addToPlaylist,
    removeFromPlaylist,
  
    // Utilidades
    formatTime,
    getProgress,
  
    // Estados derivados
    canGoNext: playerState.currentIndex < playerState.playlist.length - 1,
    canGoPrevious: playerState.currentIndex > 0,
    hasPlaylist: playerState.playlist.length > 0,
    totalTracks: playerState.playlist.length,
  };
};

// Componente que usa el hook especializado
const MusicPlayerComponent: React.FC = () => {
  // Datos de ejemplo
  const sampleTracks: Track[] = [
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      duration: 355,
      url: 'track1.mp3',
      album: 'A Night at the Opera',
    },
    {
      id: '2',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      duration: 482,
      url: 'track2.mp3',
      album: 'Led Zeppelin IV',
    },
    {
      id: '3',
      title: 'Hotel California',
      artist: 'Eagles',
      duration: 391,
      url: 'track3.mp3',
      album: 'Hotel California',
    },
  ];
  
  // Usar el hook especializado - como contratar al asistente de música
  const player = useMusicPlayer(sampleTracks);
  
  return (
    <View style={playerStyles.container}>
      {/* Información de la canción actual */}
      {player.currentTrack ? (
        <View style={playerStyles.trackInfo}>
          <Text style={playerStyles.trackTitle}>{player.currentTrack.title}</Text>
          <Text style={playerStyles.trackArtist}>{player.currentTrack.artist}</Text>
          {player.currentTrack.album && (
            <Text style={playerStyles.trackAlbum}>{player.currentTrack.album}</Text>
          )}
        </View>
      ) : (
        <View style={playerStyles.trackInfo}>
          <Text style={playerStyles.noTrack}>🎵 Selecciona una canción</Text>
        </View>
      )}
  
      {/* Barra de progreso */}
      <View style={playerStyles.progressContainer}>
        <Text style={playerStyles.timeText}>{player.formatTime(player.currentTime)}</Text>
        <View style={playerStyles.progressBar}>
          <View 
            style={[
              playerStyles.progressFill, 
              { width: `${player.getProgress()}%` }
            ]} 
          />
        </View>
        <Text style={playerStyles.timeText}>
          {player.currentTrack ? player.formatTime(player.currentTrack.duration) : '0:00'}
        </Text>
      </View>
  
      {/* Controles principales */}
      <View style={playerStyles.controls}>
        <TouchableOpacity
          style={[playerStyles.controlButton, !player.canGoPrevious && playerStyles.disabledButton]}
          onPress={player.previousTrack}
          disabled={!player.canGoPrevious}
        >
          <Text style={playerStyles.controlText}>⏮️</Text>
        </TouchableOpacity>
    
        <TouchableOpacity
          style={[playerStyles.playButton, player.isLoading && playerStyles.loadingButton]}
          onPress={player.togglePlayPause}
          disabled={player.isLoading || !player.currentTrack}
        >
          <Text style={playerStyles.playText}>
            {player.isLoading ? '⏳' : player.isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>
    
        <TouchableOpacity
          style={[playerStyles.controlButton, !player.canGoNext && playerStyles.disabledButton]}
          onPress={player.nextTrack}
          disabled={!player.canGoNext}
        >
          <Text style={playerStyles.controlText}>⏭️</Text>
        </TouchableOpacity>
      </View>
  
      {/* Controles secundarios */}
      <View style={playerStyles.secondaryControls}>
        <TouchableOpacity
          style={[playerStyles.toggleButton, player.isShuffled && playerStyles.activeToggle]}
          onPress={player.toggleShuffle}
        >
          <Text style={playerStyles.toggleText}>🔀</Text>
        </TouchableOpacity>
    
        <View style={playerStyles.volumeContainer}>
          <Text style={playerStyles.volumeLabel}>🔊</Text>
          <Text style={playerStyles.volumeValue}>{Math.round(player.volume * 100)}%</Text>
        </View>
    
        <TouchableOpacity
          style={[playerStyles.toggleButton, player.repeatMode !== 'none' && playerStyles.activeToggle]}
          onPress={player.toggleRepeat}
        >
          <Text style={playerStyles.toggleText}>
            {player.repeatMode === 'one' ? '🔂' : '🔁'}
          </Text>
        </TouchableOpacity>
      </View>
  
      {/* Playlist */}
      <View style={playerStyles.playlist}>
        <Text style={playerStyles.playlistTitle}>📜 Playlist ({player.totalTracks} canciones)</Text>
        {player.playlist.map((track, index) => (
          <TouchableOpacity
            key={track.id}
            style={[
              playerStyles.playlistItem,
              index === player.currentIndex && playerStyles.currentTrack
            ]}
            onPress={() => player.playTrack(track, index)}
          >
            <Text style={playerStyles.playlistTrackTitle}>{track.title}</Text>
            <Text style={playerStyles.playlistTrackArtist}>{track.artist}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const playerStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 5,
  },
  trackAlbum: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  noTrack: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 2,
  },
  timeText: {
    color: '#ccc',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  controlButton: {
    padding: 15,
    marginHorizontal: 10,
  },
  playButton: {
    backgroundColor: '#1DB954',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  loadingButton: {
    backgroundColor: '#666',
  },
  disabledButton: {
    opacity: 0.3,
  },
  controlText: {
    fontSize: 24,
    color: '#fff',
  },
  playText: {
    fontSize: 30,
    color: '#fff',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  activeToggle: {
    backgroundColor: '#1DB954',
  },
  toggleText: {
    fontSize: 18,
    color: '#fff',
  },
  volumeContainer: {
    alignItems: 'center',
  },
  volumeLabel: {
    fontSize: 18,
    color: '#fff',
  },
  volumeValue: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 2,
  },
  playlist: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  playlistItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#333',
  },
  currentTrack: {
    backgroundColor: '#1DB954',
  },
  playlistTrackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  playlistTrackArtist: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 2,
  },
});

export default MusicPlayerComponent;
```

---

## 🏠 Solución 3: Estado Consolidado - El Organizador Maestro

**Analogía**: *Como tener un organizador personal que mantiene todo en carpetas bien etiquetadas, donde cada documento tiene su lugar específico y puedes encontrar cualquier cosa instantáneamente.*

### 🛒 Ejemplo: Carrito de Compras Complejo

```typescript
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Tipos - como las etiquetas del organizador
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
  addedAt: Date;
  modifiers?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  validUntil: Date;
  minAmount?: number;
}

// Estado consolidado - como el archivo maestro del organizador
interface ShoppingState {
  // Sección: Productos y Carrito
  cart: {
    items: CartItem[];
    appliedCoupons: Coupon[];
    lastModified: Date;
  };
  
  // Sección: Proceso de Compra
  checkout: {
    step: 'cart' | 'shipping' | 'payment' | 'confirmation';
    shippingAddress: {
      street: string;
      city: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: 'card' | 'paypal' | 'cash' | null;
    isProcessing: boolean;
    estimatedDelivery: Date | null;
  };
  
  // Sección: UI y UX
  ui: {
    isCartOpen: boolean;
    showCouponInput: boolean;
    selectedCategory: string;
    sortBy: 'name' | 'price' | 'category';
    sortOrder: 'asc' | 'desc';
    viewMode: 'grid' | 'list';
  };
  
  // Sección: Notificaciones y Errores
  feedback: {
    notifications: Array<{
      id: string;
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
      timestamp: Date;
    }>;
    errors: Record<string, string>;
    isLoading: boolean;
  };
}

// Hook consolidado - como el organizador maestro
const useShoppingCart = () => {
  // Estado inicial organizado - como el archivo inicial del organizador
  const [state, setState] = useState<ShoppingState>({
    cart: {
      items: [],
      appliedCoupons: [],
      lastModified: new Date(),
    },
    checkout: {
      step: 'cart',
      shippingAddress: {
        street: '',
        city: '',
        zipCode: '',
        country: '',
      },
      paymentMethod: null,
      isProcessing: false,
      estimatedDelivery: null,
    },
    ui: {
      isCartOpen: false,
      showCouponInput: false,
      selectedCategory: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      viewMode: 'grid',
    },
    feedback: {
      notifications: [],
      errors: {},
      isLoading: false,
    },
  });
  
  // Función de actualización segura - como reorganizar el archivo
  const updateState = useCallback((updater: (prev: ShoppingState) => ShoppingState) => {
    setState(updater);
  }, []);
  
  // Funciones específicas - como acciones específicas del organizador
  
  // Gestión de carrito
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    updateState(prev => {
      const existingItemIndex = prev.cart.items.findIndex(item => item.id === product.id);
      let newItems: CartItem[];
  
      if (existingItemIndex >= 0) {
        // Actualizar cantidad existente
        newItems = prev.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Agregar nuevo item
        const newItem: CartItem = {
          ...product,
          quantity,
          addedAt: new Date(),
        };
        newItems = [...prev.cart.items, newItem];
      }
  
      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: newItems,
          lastModified: new Date(),
        },
        feedback: {
          ...prev.feedback,
          notifications: [
            ...prev.feedback.notifications,
            {
              id: Date.now().toString(),
              type: 'success',
              message: `${product.name} agregado al carrito`,
              timestamp: new Date(),
            }
          ],
        },
      };
    });
  }, [updateState]);
  
  const removeFromCart = useCallback((productId: string) => {
    updateState(prev => {
      const itemToRemove = prev.cart.items.find(item => item.id === productId);
      const newItems = prev.cart.items.filter(item => item.id !== productId);
  
      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: newItems,
          lastModified: new Date(),
        },
        feedback: {
          ...prev.feedback,
          notifications: [
            ...prev.feedback.notifications,
            {
              id: Date.now().toString(),
              type: 'info',
              message: `${itemToRemove?.name || 'Producto'} removido del carrito`,
              timestamp: new Date(),
            }
          ],
        },
      };
    });
  }, [updateState]);
  
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
  
    updateState(prev => ({
      ...prev,
      cart: {
        ...prev.cart,
        items: prev.cart.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        ),
        lastModified: new Date(),
      },
    }));
  }, [updateState, removeFromCart]);
  
  // Gestión de cupones
  const applyCoupon = useCallback((coupon: Coupon) => {
    updateState(prev => {
      const isAlreadyApplied = prev.cart.appliedCoupons.some(c => c.code === coupon.code);
  
      if (isAlreadyApplied) {
        return {
          ...prev,
          feedback: {
            ...prev.feedback,
            errors: {
              ...prev.feedback.errors,
              coupon: 'Este cupón ya está aplicado',
            },
          },
        };
      }
  
      return {
        ...prev,
        cart: {
          ...prev.cart,
          appliedCoupons: [...prev.cart.appliedCoupons, coupon],
        },
        feedback: {
          ...prev.feedback,
          errors: {
            ...prev.feedback.errors,
            coupon: '',
          },
          notifications: [
            ...prev.feedback.notifications,
            {
              id: Date.now().toString(),
              type: 'success',
              message: `Cupón ${coupon.code} aplicado`,
              timestamp: new Date(),
            }
          ],
        },
      };
    });
  }, [updateState]);
  
  // Gestión de UI
  const toggleCart = useCallback(() => {
    updateState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        isCartOpen: !prev.ui.isCartOpen,
      },
    }));
  }, [updateState]);
  
  const setViewMode = useCallback((viewMode: 'grid' | 'list') => {
    updateState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        viewMode,
      },
    }));
  }, [updateState]);
  
  const setSorting = useCallback((sortBy: 'name' | 'price' | 'category', sortOrder: 'asc' | 'desc') => {
    updateState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        sortBy,
        sortOrder,
      },
    }));
  }, [updateState]);
  
  // Gestión de checkout
  const goToNextStep = useCallback(() => {
    updateState(prev => {
      const steps: ShoppingState['checkout']['step'][] = ['cart', 'shipping', 'payment', 'confirmation'];
      const currentIndex = steps.indexOf(prev.checkout.step);
      const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
  
      return {
        ...prev,
        checkout: {
          ...prev.checkout,
          step: steps[nextIndex],
        },
      };
    });
  }, [updateState]);
  
  // Valores computados - como reportes automáticos del organizador
  const computed = useMemo(() => {
    const { cart } = state;
  
    // Cálculos de carrito
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  
    // Aplicar descuentos
    const totalDiscount = cart.appliedCoupons.reduce((discount, coupon) => {
      if (coupon.type === 'percentage') {
        return discount + (subtotal * coupon.discount / 100);
      } else {
        return discount + coupon.discount;
      }
    }, 0);
  
    const total = Math.max(0, subtotal - totalDiscount);
  
    // Agrupar por categoría
    const itemsByCategory = cart.items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  
    // Estadísticas
    const isEmpty = cart.items.length === 0;
    const uniqueProducts = cart.items.length;
    const averagePrice = uniqueProducts > 0 ? subtotal / totalItems : 0;
  
    return {
      subtotal,
      totalDiscount,
      total,
      totalItems,
      itemsByCategory,
      isEmpty,
      uniqueProducts,
      averagePrice,
      canProceedToCheckout: !isEmpty && total > 0,
    };
  }, [state.cart]);
  
  // API pública del hook
  return {
    // Estado actual
    state,
  
    // Valores computados
    ...computed,
  
    // Acciones de carrito
    addToCart,
    removeFromCart,
    updateQuantity,
  
    // Acciones de cupones
    applyCoupon,
  
    // Acciones de UI
    toggleCart,
    setViewMode,
    setSorting,
  
    // Acciones de checkout
    goToNextStep,
  
    // Utilidades
    clearCart: () => updateState(prev => ({
      ...prev,
      cart: { ...prev.cart, items: [], appliedCoupons: [] }
    })),
  
    clearNotifications: () => updateState(prev => ({
      ...prev,
      feedback: { ...prev.feedback, notifications: [] }
    })),
  };
};

// Componente principal que usa el estado consolidado
const ShoppingCartComponent: React.FC = () => {
  const cart = useShoppingCart();
  
  // Datos de ejemplo
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      price: 999,
      category: 'electronics',
      image: '📱',
      stock: 10,
      description: 'Latest iPhone with amazing features',
    },
    {
      id: '2',
      name: 'Nike Air Max',
      price: 150,
      category: 'shoes',
      image: '👟',
      stock: 5,
      description: 'Comfortable running shoes',
    },
    {
      id: '3',
      name: 'MacBook Pro',
      price: 2499,
      category: 'electronics',
      image: '💻',
      stock: 3,
      description: 'Powerful laptop for professionals',
    },
  ];
  
  const renderCartSummary = () => (
    <View style={cartStyles.summary}>
      <Text style={cartStyles.summaryTitle}>📊 Resumen del Carrito</Text>
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>Productos únicos:</Text>
        <Text style={cartStyles.summaryValue}>{cart.uniqueProducts}</Text>
      </View>
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>Total de items:</Text>
        <Text style={cartStyles.summaryValue}>{cart.totalItems}</Text>
      </View>
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>Subtotal:</Text>
        <Text style={cartStyles.summaryValue}>${cart.subtotal.toFixed(2)}</Text>
      </View>
      {cart.totalDiscount > 0 && (
        <View style={cartStyles.summaryRow}>
          <Text style={[cartStyles.summaryLabel, cartStyles.discount]}>Descuento:</Text>
          <Text style={[cartStyles.summaryValue, cartStyles.discount]}>
            -${cart.totalDiscount.toFixed(2)}
          </Text>
        </View>
      )}
      <View style={[cartStyles.summaryRow, cartStyles.totalRow]}>
        <Text style={cartStyles.totalLabel}>Total:</Text>
        <Text style={cartStyles.totalValue}>${cart.total.toFixed(2)}</Text>
      </View>
    </View>
  );
  
  const renderCartItems = () => (
    <View style={cartStyles.itemsContainer}>
      <Text style={cartStyles.sectionTitle}>🛒 Items en el Carrito</Text>
      {cart.isEmpty ? (
        <Text style={cartStyles.emptyText}>Tu carrito está vacío</Text>
      ) : (
        cart.state.cart.items.map(item => (
          <View key={item.id} style={cartStyles.cartItem}>
            <Text style={cartStyles.itemEmoji}>{item.image}</Text>
            <View style={cartStyles.itemDetails}>
              <Text style={cartStyles.itemName}>{item.name}</Text>
              <Text style={cartStyles.itemPrice}>${item.price}</Text>
              <Text style={cartStyles.itemCategory}>{item.category}</Text>
            </View>
            <View style={cartStyles.quantityControls}>
              <TouchableOpacity
                style={cartStyles.quantityButton}
                onPress={() => cart.updateQuantity(item.id, item.quantity - 1)}
              >
                <Text style={cartStyles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={cartStyles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={cartStyles.quantityButton}
                onPress={() => cart.updateQuantity(item.id, item.quantity + 1)}
              >
                <Text style={cartStyles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={cartStyles.removeButton}
              onPress={() => cart.removeFromCart(item.id)}
            >
              <Text style={cartStyles.removeButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
  
  const renderProducts = () => (
    <View style={cartStyles.productsContainer}>
      <Text style={cartStyles.sectionTitle}>🏪 Productos Disponibles</Text>
      <View style={cartStyles.productsGrid}>
        {sampleProducts.map(product => (
          <View key={product.id} style={cartStyles.productCard}>
            <Text style={cartStyles.productEmoji}>{product.image}</Text>
            <Text style={cartStyles.productName}>{product.name}</Text>
            <Text style={cartStyles.productPrice}>${product.price}</Text>
            <Text style={cartStyles.productStock}>Stock: {product.stock}</Text>
            <TouchableOpacity
              style={cartStyles.addButton}
              onPress={() => cart.addToCart(product)}
            >
              <Text style={cartStyles.addButtonText}>Agregar al Carrito</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
  
  const renderNotifications = () => (
    cart.state.feedback.notifications.length > 0 && (
      <View style={cartStyles.notifications}>
        {cart.state.feedback.notifications.slice(-3).map(notification => (
          <View
            key={notification.id}
            style={[
              cartStyles.notification,
              cartStyles[`notification${notification.type.charAt(0).toUpperCase()}${notification.type.slice(1)}`]
            ]}
          >
            <Text style={cartStyles.notificationText}>{notification.message}</Text>
          </View>
        ))}
      </View>
    )
  );
  
  return (
    <ScrollView style={cartStyles.container}>
      <Text style={cartStyles.title}>🛍️ Tienda Virtual</Text>
  
      {renderNotifications()}
      {renderProducts()}
      {renderCartItems()}
      {renderCartSummary()}
  
      {cart.canProceedToCheckout && (
        <TouchableOpacity
          style={cartStyles.checkoutButton}
          onPress={cart.goToNextStep}
        >
          <Text style={cartStyles.checkoutButtonText}>
            Proceder al Checkout 💳
          </Text>
        </TouchableOpacity>
      )}
  
      {/* Panel de debug en desarrollo */}
      {__DEV__ && (
        <View style={cartStyles.debugPanel}>
          <Text style={cartStyles.debugTitle}>🔧 Estado Debug</Text>
          <Text style={cartStyles.debugText}>Items: {cart.totalItems}</Text>
          <Text style={cartStyles.debugText}>Total: ${cart.total.toFixed(2)}</Text>
          <Text style={cartStyles.debugText}>
            Última modificación: {cart.state.cart.lastModified.toLocaleTimeString()}
          </Text>
          <TouchableOpacity
            style={cartStyles.debugButton}
            onPress={cart.clearNotifications}
          >
            <Text style={cartStyles.debugButtonText}>Limpiar Notificaciones</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const cartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
    color: '#333',
  },
  
  // Productos
  productsContainer: {
    marginBottom: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  productStock: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Carrito
  itemsContainer: {
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityButton: {
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    padding: 5,
  },
  removeButtonText: {
    fontSize: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
  
  // Resumen
  summary: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  discount: {
    color: '#4CAF50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  
  // Botones
  checkoutButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Notificaciones
  notifications: {
    marginBottom: 20,
  },
  notification: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
  },
  notificationSuccess: {
    backgroundColor: '#d4edda',
  },
  notificationError: {
    backgroundColor: '#f8d7da',
  },
  notificationWarning: {
    backgroundColor: '#fff3cd',
  },
  notificationInfo: {
    backgroundColor: '#d1ecf1',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
  
  // Debug
  debugPanel: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  debugText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 5,
  },
  debugButton: {
    backgroundColor: '#6c757d',
    borderRadius: 4,
    padding: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  debugButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ShoppingCartComponent;
```

---

## 🎯 Cuándo Usar Cada Patrón

### 📋 Guía de Decisión Rápida

```
🎛️ useReducer:
✅ USAR cuando:
- Tienes 5+ estados relacionados
- Lógica de actualización compleja
- Múltiples acciones que afectan el mismo estado
- Necesitas debugging de acciones

❌ NO usar cuando:
- Estados simples independientes
- Solo 1-2 estados
- Lógica muy simple

🧩 Custom Hooks:
✅ USAR cuando:
- Lógica reutilizable entre componentes
- Estados con funcionalidad específica
- Quieres encapsular comportamiento
- Necesitas testing aislado

❌ NO usar cuando:
- Lógica específica de un solo componente
- Estados muy simples
- Overhead innecesario

🏠 Estado Consolidado:
✅ USAR cuando:
- Múltiples categorías de estado
- Estados interdependientes
- Componentes con mucha funcionalidad
- Necesitas organización clara

❌ NO usar cuando:
- Estados completamente independientes
- Componentes simples
- Performance crítica con updates frecuentes
```

---

## 🚀 Mejores Prácticas Generales

### 1. **Principio de Responsabilidad Única**

```typescript
// ❌ MALO - Hook que hace demasiado
const useEverything = () => {
  // Maneja autenticación, carrito, UI, notificaciones, etc.
};

// ✅ BUENO - Hooks especializados
const useAuth = () => { /* solo autenticación */ };
const useCart = () => { /* solo carrito */ };
const useNotifications = () => { /* solo notificaciones */ };
```

### 2. **Estado Derivado vs Estado Almacenado**

```typescript
// ❌ MALO - Almacenar valores computados
const [total, setTotal] = useState(0);
const [items, setItems] = useState([]);

// ✅ BUENO - Computar valores derivados
const [items, setItems] = useState([]);
const total = useMemo(() => 
  items.reduce((sum, item) => sum + item.price, 0)
, [items]);
```

### 3. **Evitar Re-renders Innecesarios**

```typescript
// ❌ MALO - Nuevo objeto en cada render
const value = {
  state,
  addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
  removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
};

// ✅ BUENO - Funciones memoizadas
const addItem = useCallback((item) => 
  dispatch({ type: 'ADD_ITEM', item })
, [dispatch]);

const value = useMemo(() => ({
  state,
  addItem,
  removeItem,
}), [state, addItem, removeItem]);
```

### 4. **Debugging y DevTools**

```typescript
// ✅ Siempre incluir logging para desarrollo
const reducer = (state, action) => {
  if (__DEV__) {
    console.log('Action:', action.type, action);
    console.log('Previous state:', state);
  }
  
  const newState = actualReducer(state, action);
  
  if (__DEV__) {
    console.log('New state:', newState);
  }
  
  return newState;
};
```

---

## 🏆 Reflexión Final

El manejo de estado interno en React Native es como organizar tu casa: puedes tener todo tirado por doquier (múltiples useState), o puedes tener un sistema organizado donde cada cosa tiene su lugar y funciona en armonía.

**Las claves del éxito:**

1. **🎛️ useReducer**: Tu centralita de control para estados complejos
2. **🧩 Custom Hooks**: Tus asistentes especializados para funcionalidades específicas
3. **🏠 Estado Consolidado**: Tu organizador maestro para mantener todo estructurado

**Recuerda:**

* **Empieza simple** con useState para casos básicos
* **Evoluciona a useReducer** cuando las interdependencias se vuelven complejas
* **Extrae a custom hooks** cuando la lógica sea reutilizable
* **Consolida en objetos** cuando tengas múltiples categorías de estado

La mejor arquitectura es la que tu equipo puede entender y mantener fácilmente. No hay una solución única, sino la herramienta correcta para cada situación específica.

¡El objetivo es código que funcione, sea mantenible y haga feliz a tu equipo! 🚀
