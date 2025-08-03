---
title: 'Formularios Expertos en React & React Native'
code: 'react'
description: 'Masterclass: Formularios Expertos en React & React Native'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Masterclass: Formularios Expertos en React & React Native

## Guía Completa del Especialista

### ÍNDICE

1. [Fundamentos de Formularios](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#fundamentos)
2. [Arquitectura de Formularios](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#arquitectura)
3. [Manejo de Estado Avanzado](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#estado)
4. [Validación Inteligente](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#validacion)
5. [React Hook Form - El Estándar](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#react-hook-form)
6. [Formik y Yup - Alternativas Robustas](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#formik-yup)
7. [Formularios en React Native](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#react-native)
8. [Performance y Optimización](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#performance)
9. [UX/UI de Formularios](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#ux-ui)
10. [Casos de Uso Reales](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#casos-reales)
11. [Testing de Formularios](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#testing)
12. [Accesibilidad y Mejores Prácticas](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#accesibilidad)
13. [Plan de Desarrollo del Experto](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#desarrollo)
14. [Reflexión Final](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#reflexion)

---

## 1. FUNDAMENTOS DE FORMULARIOS {#fundamentos}

### La Anatomía de un Formulario Perfecto

*Analogía: Un formulario es como una conversación estructurada*

```
┌─ Conversación Humana ──────┐  ┌─ Formulario Digital ────────┐
│ "¿Cuál es tu nombre?"      │  │ <input name="name" />       │
│ "¿Dónde vives?"            │  │ <input name="address" />    │
│ "¿Entendiste?"             │  │ Validación en tiempo real   │
│ "¿Algo más que agregar?"   │  │ Campo de comentarios        │
│ "Perfecto, procedamos"     │  │ Botón de envío              │
└────────────────────────────┘  └─────────────────────────────┘
```

### Problemas Comunes en Formularios

**❌ Anti-patrones que debes evitar:**

```javascript
// NUNCA hagas esto - Anti-patrón común
const BadForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  // Validación en cada cambio (ineficiente)
  const validateName = (value) => {
    if (!value) return "Name is required";
    if (value.length < 2) return "Name too short";
    return null;
  };
  
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
  
    // Validación sincrónica pesada en cada keystroke
    const error = validateName(value);
    setErrors(prev => ({ ...prev, name: error }));
  
    // API call en cada cambio (horrible!)
    fetch('/api/validate-name', { 
      method: 'POST', 
      body: JSON.stringify({ name: value }) 
    });
  };
  
  return (
    <form>
      <input 
        value={name} 
        onChange={handleNameChange} 
        style={{ border: errors.name ? '1px solid red' : '1px solid gray' }}
      />
      {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      {/* Repetir para cada campo... */}
    </form>
  );
};
```

### Principios de Formularios Excelentes

**1. Progressive Enhancement**

```javascript
// Formulario que funciona sin JavaScript
const ProgressiveForm = () => {
  return (
    <form 
      action="/api/submit" 
      method="POST"
      noValidate // React manejará la validación
    >
      <input 
        name="email"
        type="email"
        required
        aria-describedby="email-error"
        // HTML validation como fallback
      />
      <div id="email-error" aria-live="polite">
        {/* Error messages aquí */}
      </div>
  
      <button type="submit">Submit</button>
    </form>
  );
};
```

**2. Uncontrolled vs Controlled - Cuándo usar cada uno**

```javascript
// Controlled - Para validación en tiempo real
const ControlledExample = () => {
  const [value, setValue] = useState('');
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    // Formato automático mientras escribe
    if (newValue.length <= 10) {
      setValue(newValue.toUpperCase());
    }
  };
  
  return <input value={value} onChange={handleChange} />;
};

// Uncontrolled - Para performance y simplicidad
const UncontrolledExample = () => {
  const inputRef = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Solo lee el valor cuando necesita
    const value = inputRef.current.value;
    console.log(value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="Initial value" />
      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## 2. ARQUITECTURA DE FORMULARIOS {#arquitectura}

### Patrón de Composición de Formularios

*Analogía: LEGO para formularios*

```javascript
// Componentes atómicos reutilizables
const FormField = ({ 
  label, 
  error, 
  children, 
  required = false,
  description 
}) => {
  const fieldId = useId();
  
  return (
    <div className="form-field">
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && <span className="required" aria-label="required">*</span>}
      </label>
  
      {description && (
        <div className="form-description" id={`${fieldId}-desc`}>
          {description}
        </div>
      )}
  
      <div className="form-input-wrapper">
        {React.cloneElement(children, {
          id: fieldId,
          'aria-describedby': [
            description && `${fieldId}-desc`,
            error && `${fieldId}-error`
          ].filter(Boolean).join(' '),
          'aria-invalid': !!error
        })}
      </div>
  
      {error && (
        <div 
          id={`${fieldId}-error`} 
          className="form-error" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};

// Input con validación integrada
const ValidatedInput = forwardRef(({ 
  type = "text",
  validation,
  onValidationChange,
  debounceMs = 300,
  ...props 
}, ref) => {
  const [localValue, setLocalValue] = useState(props.value || '');
  const [isValidating, setIsValidating] = useState(false);
  
  // Debounce para validación asíncrona
  const debouncedValidate = useMemo(
    () => debounce(async (value) => {
      if (!validation) return;
  
      setIsValidating(true);
      try {
        const error = await validation(value);
        onValidationChange?.(error);
      } catch (err) {
        onValidationChange?.('Validation failed');
      } finally {
        setIsValidating(false);
      }
    }, debounceMs),
    [validation, onValidationChange, debounceMs]
  );
  
  const handleChange = (e) => {
    const value = e.target.value;
    setLocalValue(value);
    props.onChange?.(e);
    debouncedValidate(value);
  };
  
  return (
    <div className="validated-input">
      <input
        ref={ref}
        type={type}
        value={localValue}
        onChange={handleChange}
        {...props}
      />
      {isValidating && <Spinner size="sm" />}
    </div>
  );
});

// Uso del sistema de composición
const RegistrationForm = () => {
  const [errors, setErrors] = useState({});
  
  const validateEmail = async (email) => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
  
    // Validación asíncrona con servidor
    try {
      const response = await fetch('/api/validate-email', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      return result.exists ? "Email already exists" : null;
    } catch {
      return "Unable to validate email";
    }
  };
  
  return (
    <form className="registration-form">
      <FormField 
        label="Full Name"
        required
        error={errors.name}
        description="Enter your first and last name"
      >
        <ValidatedInput 
          name="name"
          validation={(value) => {
            if (!value) return "Name is required";
            if (value.length < 2) return "Name too short";
            return null;
          }}
          onValidationChange={(error) => 
            setErrors(prev => ({ ...prev, name: error }))
          }
        />
      </FormField>
  
      <FormField 
        label="Email Address"
        required
        error={errors.email}
      >
        <ValidatedInput 
          name="email"
          type="email"
          validation={validateEmail}
          onValidationChange={(error) => 
            setErrors(prev => ({ ...prev, email: error }))
          }
          debounceMs={500}
        />
      </FormField>
    </form>
  );
};
```

### Formularios Multi-paso con Estado Compartido

```javascript
// Context para formulario multi-paso
const MultiStepFormContext = createContext();

const MultiStepFormProvider = ({ children, initialData = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const updateFormData = useCallback((stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, []);
  
  const validateStep = useCallback(async (stepIndex, data) => {
    const stepValidators = {
      0: validatePersonalInfo,
      1: validateContactInfo,
      2: validatePaymentInfo
    };
  
    const validator = stepValidators[stepIndex];
    if (!validator) return true;
  
    const stepErrors = await validator(data);
    setErrors(prev => ({ ...prev, [stepIndex]: stepErrors }));
  
    const isValid = Object.keys(stepErrors).length === 0;
    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, stepIndex]));
    }
  
    return isValid;
  }, []);
  
  const nextStep = useCallback(async () => {
    const isValid = await validateStep(currentStep, formData);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, formData, validateStep]);
  
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);
  
  const goToStep = useCallback((stepIndex) => {
    if (completedSteps.has(stepIndex - 1) || stepIndex === 0) {
      setCurrentStep(stepIndex);
    }
  }, [completedSteps]);
  
  const value = {
    currentStep,
    formData,
    errors: errors[currentStep] || {},
    completedSteps,
    updateFormData,
    validateStep,
    nextStep,
    prevStep,
    goToStep,
    isLastStep: currentStep === 2 // Hardcoded para ejemplo
  };
  
  return (
    <MultiStepFormContext.Provider value={value}>
      {children}
    </MultiStepFormContext.Provider>
  );
};

// Hook para usar el contexto
const useMultiStepForm = () => {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within MultiStepFormProvider');
  }
  return context;
};

// Componente de paso individual
const PersonalInfoStep = () => {
  const { formData, updateFormData, errors } = useMultiStepForm();
  const [localData, setLocalData] = useState({
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    birthDate: formData.birthDate || ''
  });
  
  useEffect(() => {
    updateFormData(localData);
  }, [localData, updateFormData]);
  
  return (
    <div className="form-step">
      <h2>Personal Information</h2>
  
      <FormField label="First Name" error={errors.firstName} required>
        <input
          value={localData.firstName}
          onChange={(e) => setLocalData(prev => ({ 
            ...prev, 
            firstName: e.target.value 
          }))}
        />
      </FormField>
  
      <FormField label="Last Name" error={errors.lastName} required>
        <input
          value={localData.lastName}
          onChange={(e) => setLocalData(prev => ({ 
            ...prev, 
            lastName: e.target.value 
          }))}
        />
      </FormField>
  
      <FormField label="Birth Date" error={errors.birthDate} required>
        <input
          type="date"
          value={localData.birthDate}
          onChange={(e) => setLocalData(prev => ({ 
            ...prev, 
            birthDate: e.target.value 
          }))}
        />
      </FormField>
    </div>
  );
};

// Formulario principal multi-paso
const MultiStepRegistration = () => {
  const { currentStep, nextStep, prevStep, isLastStep } = useMultiStepForm();
  
  const steps = [
    { component: PersonalInfoStep, title: "Personal Info" },
    { component: ContactInfoStep, title: "Contact" },
    { component: PaymentInfoStep, title: "Payment" }
  ];
  
  const CurrentStepComponent = steps[currentStep].component;
  
  return (
    <div className="multi-step-form">
      <ProgressIndicator steps={steps} currentStep={currentStep} />
  
      <div className="step-content">
        <CurrentStepComponent />
      </div>
  
      <div className="step-navigation">
        {currentStep > 0 && (
          <button type="button" onClick={prevStep}>
            Previous
          </button>
        )}
    
        <button 
          type="button" 
          onClick={nextStep}
          className="primary"
        >
          {isLastStep ? 'Complete Registration' : 'Next'}
        </button>
      </div>
    </div>
  );
};
```

---

## 3. MANEJO DE ESTADO AVANZADO {#estado}

### Patrón Reducer para Formularios Complejos

```javascript
// Actions para el reducer
const FORM_ACTIONS = {
  SET_FIELD: 'SET_FIELD',
  SET_ERRORS: 'SET_ERRORS',
  SET_TOUCHED: 'SET_TOUCHED',
  SET_SUBMITTING: 'SET_SUBMITTING',
  RESET_FORM: 'RESET_FORM',
  SET_FIELD_ERROR: 'SET_FIELD_ERROR',
  CLEAR_FIELD_ERROR: 'CLEAR_FIELD_ERROR'
};

// Reducer para estado de formulario
const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_ACTIONS.SET_FIELD:
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value
        },
        // Limpiar error cuando el usuario comienza a escribir
        errors: {
          ...state.errors,
          [action.field]: undefined
        }
      };
  
    case FORM_ACTIONS.SET_ERRORS:
      return {
        ...state,
        errors: action.errors,
        isValid: Object.keys(action.errors).length === 0
      };
  
    case FORM_ACTIONS.SET_TOUCHED:
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true
        }
      };
  
    case FORM_ACTIONS.SET_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.isSubmitting
      };
  
    case FORM_ACTIONS.RESET_FORM:
      return {
        ...action.initialState,
        values: { ...action.initialState.values }
      };
  
    case FORM_ACTIONS.SET_FIELD_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error
        }
      };
  
    default:
      return state;
  }
};

// Hook personalizado para manejar formularios
const useAdvancedForm = ({ 
  initialValues = {}, 
  validationSchema,
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true 
}) => {
  const initialState = {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
    isDirty: false
  };
  
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  // Validación con schema (Yup, Zod, etc.)
  const validateForm = useCallback(async (values = state.values) => {
    if (!validationSchema) return {};
  
    try {
      await validationSchema.validate(values, { abortEarly: false });
      return {};
    } catch (error) {
      const errors = {};
      error.inner.forEach(err => {
        errors[err.path] = err.message;
      });
      return errors;
    }
  }, [validationSchema, state.values]);
  
  // Validar campo individual
  const validateField = useCallback(async (fieldName, value) => {
    if (!validationSchema) return null;
  
    try {
      await validationSchema.validateAt(fieldName, { [fieldName]: value });
      dispatch({ type: FORM_ACTIONS.CLEAR_FIELD_ERROR, field: fieldName });
      return null;
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ 
        type: FORM_ACTIONS.SET_FIELD_ERROR, 
        field: fieldName, 
        error: errorMessage 
      });
      return errorMessage;
    }
  }, [validationSchema]);
  
  // Manejar cambio de campo
  const setFieldValue = useCallback(async (fieldName, value) => {
    dispatch({ type: FORM_ACTIONS.SET_FIELD, field: fieldName, value });
  
    if (validateOnChange) {
      await validateField(fieldName, value);
    }
  }, [validateOnChange, validateField]);
  
  // Manejar blur de campo
  const setFieldTouched = useCallback(async (fieldName) => {
    dispatch({ type: FORM_ACTIONS.SET_TOUCHED, field: fieldName });
  
    if (validateOnBlur) {
      await validateField(fieldName, state.values[fieldName]);
    }
  }, [validateOnBlur, validateField, state.values]);
  
  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
  
    dispatch({ type: FORM_ACTIONS.SET_SUBMITTING, isSubmitting: true });
  
    try {
      const errors = await validateForm();
      dispatch({ type: FORM_ACTIONS.SET_ERRORS, errors });
  
      if (Object.keys(errors).length === 0) {
        await onSubmit(state.values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      dispatch({ type: FORM_ACTIONS.SET_SUBMITTING, isSubmitting: false });
    }
  }, [validateForm, onSubmit, state.values]);
  
  // Reset del formulario
  const resetForm = useCallback(() => {
    dispatch({ type: FORM_ACTIONS.RESET_FORM, initialState });
  }, []);
  
  // Helpers para campos
  const getFieldProps = useCallback((fieldName) => ({
    name: fieldName,
    value: state.values[fieldName] || '',
    onChange: (e) => setFieldValue(fieldName, e.target.value),
    onBlur: () => setFieldTouched(fieldName)
  }), [state.values, setFieldValue, setFieldTouched]);
  
  const getFieldMeta = useCallback((fieldName) => ({
    error: state.errors[fieldName],
    touched: state.touched[fieldName],
    hasError: !!(state.errors[fieldName] && state.touched[fieldName])
  }), [state.errors, state.touched]);
  
  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    isDirty: JSON.stringify(state.values) !== JSON.stringify(initialValues),
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    resetForm,
    validateForm,
    validateField,
    getFieldProps,
    getFieldMeta
  };
};

// Ejemplo de uso del hook avanzado
const AdvancedContactForm = () => {
  const validationSchema = yup.object({
    name: yup.string().required('Name is required').min(2, 'Too short'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().matches(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number'),
    message: yup.string().required('Message is required').max(500, 'Too long')
  });
  
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleSubmit,
    resetForm,
    getFieldProps,
    getFieldMeta
  } = useAdvancedForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API
      console.log('Form submitted:', values);
    },
    validateOnChange: true,
    validateOnBlur: true
  });
  
  return (
    <form onSubmit={handleSubmit} className="advanced-form">
      <FormField 
        label="Name" 
        error={getFieldMeta('name').hasError ? errors.name : null}
        required
      >
        <input {...getFieldProps('name')} />
      </FormField>
  
      <FormField 
        label="Email" 
        error={getFieldMeta('email').hasError ? errors.email : null}
        required
      >
        <input type="email" {...getFieldProps('email')} />
      </FormField>
  
      <FormField 
        label="Phone" 
        error={getFieldMeta('phone').hasError ? errors.phone : null}
      >
        <input type="tel" {...getFieldProps('phone')} />
      </FormField>
  
      <FormField 
        label="Message" 
        error={getFieldMeta('message').hasError ? errors.message : null}
        required
      >
        <textarea {...getFieldProps('message')} rows={4} />
      </FormField>
  
      <div className="form-actions">
        <button 
          type="button" 
          onClick={resetForm}
          disabled={!isDirty}
        >
          Reset
        </button>
    
        <button 
          type="submit" 
          disabled={!isValid || isSubmitting}
          className="primary"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
};
```

---

## 4. VALIDACIÓN INTELIGENTE {#validacion}

### Sistema de Validación Multinivel

```javascript
// Tipos de validadores
const VALIDATOR_TYPES = {
  SYNC: 'sync',
  ASYNC: 'async',
  DEBOUNCED: 'debounced'
};

// Clase base para validadores
class BaseValidator {
  constructor(message, options = {}) {
    this.message = message;
    this.options = options;
  }
  
  async validate(value, context) {
    throw new Error('validate method must be implemented');
  }
}

// Validadores síncronos
class RequiredValidator extends BaseValidator {
  async validate(value) {
    const isEmpty = value === null || value === undefined || 
                   (typeof value === 'string' && value.trim() === '') ||
                   (Array.isArray(value) && value.length === 0);
  
    return isEmpty ? this.message : null;
  }
}

class LengthValidator extends BaseValidator {
  constructor(min, max, message) {
    super(message);
    this.min = min;
    this.max = max;
  }
  
  async validate(value) {
    if (!value) return null; // Skip si está vacío (required se encarga)
  
    const length = value.length;
    if (length < this.min) {
      return `Minimum ${this.min} characters required`;
    }
    if (length > this.max) {
      return `Maximum ${this.max} characters allowed`;
    }
    return null;
  }
}

class PatternValidator extends BaseValidator {
  constructor(pattern, message) {
    super(message);
    this.pattern = new RegExp(pattern);
  }
  
  async validate(value) {
    if (!value) return null;
    return this.pattern.test(value) ? null : this.message;
  }
}

// Validadores asíncronos
class UniqueEmailValidator extends BaseValidator {
  constructor(message = 'Email already exists') {
    super(message);
    this.cache = new Map();
    this.pendingRequests = new Map();
  }
  
  async validate(email) {
    if (!email) return null;
  
    // Check cache first
    if (this.cache.has(email)) {
      return this.cache.get(email);
    }
  
    // Check if request is already pending
    if (this.pendingRequests.has(email)) {
      return this.pendingRequests.get(email);
    }
  
    // Make API request
    const promise = this.checkEmailUniqueness(email);
    this.pendingRequests.set(email, promise);
  
    try {
      const result = await promise;
      this.cache.set(email, result);
      return result;
    } finally {
      this.pendingRequests.delete(email);
    }
  }
  
  async checkEmailUniqueness(email) {
    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
  
      const { exists } = await response.json();
      return exists ? this.message : null;
    } catch (error) {
      console.error('Email validation error:', error);
      return 'Unable to verify email';
    }
  }
}

// Validador de contraseña complejo
class PasswordStrengthValidator extends BaseValidator {
  constructor() {
    super('Password does not meet requirements');
    this.requirements = [
      { test: (pwd) => pwd.length >= 8, message: 'At least 8 characters' },
      { test: (pwd) => /[A-Z]/.test(pwd), message: 'One uppercase letter' },
      { test: (pwd) => /[a-z]/.test(pwd), message: 'One lowercase letter' },
      { test: (pwd) => /\d/.test(pwd), message: 'One number' },
      { test: (pwd) => /[!@#$%^&*]/.test(pwd), message: 'One special character' }
    ];
  }
  
  async validate(password) {
    if (!password) return null;
  
    const failedRequirements = this.requirements.filter(req => !req.test(password));
  
    if (failedRequirements.length === 0) return null;
  
    return {
      message: 'Password requirements not met',
      details: failedRequirements.map(req => req.message),
      strength: this.calculateStrength(password)
    };
  }
  
  calculateStrength(password) {
    const passed = this.requirements.filter(req => req.test(password)).length;
    return Math.round((passed / this.requirements.length) * 100);
  }
}

// Sistema de validación compuesto
class ValidationEngine {
  constructor() {
    this.validators = new Map();
    this.schemas = new Map();
  }
  
  // Registrar validador
  addValidator(name, validator) {
    this.validators.set(name, validator);
  }
  
  // Crear schema de validación
  createSchema(name, fieldValidations) {
    this.schemas.set(name, fieldValidations);
  }
  
  // Validar un campo
  async validateField(fieldName, value, schemaName, context = {}) {
    const schema = this.schemas.get(schemaName);
    if (!schema || !schema[fieldName]) return null;
  
    const fieldValidators = schema[fieldName];
  
    for (const validator of fieldValidators) {
      const error = await validator.validate(value, context);
      if (error) return error;
    }
  
    return null;
  }
  
  // Validar formulario completo
  async validateForm(values, schemaName, context = {}) {
    const schema = this.schemas.get(schemaName);
    if (!schema) return {};
  
    const errors = {};
    const validationPromises = [];
  
    for (const [fieldName, validators] of Object.entries(schema)) {
      const fieldValue = values[fieldName];
  
      validationPromises.push(
        this.validateField(fieldName, fieldValue, schemaName, context)
          .then(error => {
            if (error) errors[fieldName] = error;
          })
      );
    }
  
    await Promise.all(validationPromises);
    return errors;
  }
}

// Configuración del motor de validación
const validationEngine = new ValidationEngine();

// Crear schema para registro de usuario
validationEngine.createSchema('userRegistration', {
  firstName: [
    new RequiredValidator('First name is required'),
    new LengthValidator(2, 50, 'Name must be 2-50 characters')
  ],
  lastName: [
    new RequiredValidator('Last name is required'),
    new LengthValidator(2, 50, 'Name must be 2-50 characters')
  ],
  email: [
    new RequiredValidator('Email is required'),
    new PatternValidator(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      'Invalid email format'
    ),
    new UniqueEmailValidator()
  ],
  password: [
    new RequiredValidator('Password is required'),
    new PasswordStrengthValidator()
  ]
});

// Hook para usar el sistema de validación
const useValidation = (schemaName) => {
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState({});
  
  const validateField = useCallback(async (fieldName, value, context) => {
    setIsValidating(prev => ({ ...prev, [fieldName]: true }));
  
    try {
      const error = await validationEngine.validateField(
        fieldName, 
        value, 
        schemaName, 
        context
      );
  
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      return error;
    } finally {
      setIsValidating(prev => ({ ...prev, [fieldName]: false }));
    }
  }, [schemaName]);
  
  const validateForm = useCallback(async (values, context) => {
    const formErrors = await validationEngine.validateForm(
      values, 
      schemaName, 
      context
    );
    setErrors(formErrors);
    return formErrors;
  }, [schemaName]);
  
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => ({ ...prev, [fieldName]: null }));
  }, []);
  
  return {
    errors,
    isValidating,
    validateField,
    validateForm,
    clearFieldError
  };
};

// Componente de campo con validación inteligente
const SmartField = ({ 
  name, 
  label, 
  type = 'text',
  schemaName,
  required = false,
  ...props 
}) => {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const { errors, isValidating, validateField, clearFieldError } = useValidation(schemaName);
  
  const debouncedValidate = useMemo(
    () => debounce((fieldName, fieldValue) => {
      if (touched) {
        validateField(fieldName, fieldValue);
      }
    }, 300),
    [validateField, touched]
  );
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  
    // Limpiar error inmediatamente si el usuario está escribiendo
    if (errors[name]) {
      clearFieldError(name);
    }
  
    // Validar con debounce
    debouncedValidate(name, newValue);
  };
  
  const handleBlur = () => {
    setTouched(true);
    validateField(name, value);
  };
  
  const error = errors[name];
  const showError = touched && error;
  
  return (
    <FormField 
      label={label} 
      required={required}
      error={showError ? (
        typeof error === 'object' ? error.message : error
      ) : null}
    >
      <div className="smart-field">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={showError ? 'error' : ''}
          {...props}
        />
    
        {isValidating[name] && <Spinner size="sm" />}
    
        {/* Para contraseñas, mostrar indicador de fortaleza */}
        {type === 'password' && value && error?.strength !== undefined && (
          <div className="password-strength">
            <div className="strength-bar">
              <div 
                className="strength-fill" 
                style={{ width: `${error.strength}%` }}
              />
            </div>
            <div className="strength-requirements">
              {error.details?.map((detail, index) => (
                <div key={index} className="requirement">
                  {detail}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FormField>
  );
};
```

---

## 5. REACT HOOK FORM - EL ESTÁNDAR {#react-hook-form}

### Dominando React Hook Form

```javascript
import { useForm, useController, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema de validación con Zod
const userSchema = z.object({
  profile: z.object({
    firstName: z.string().min(2, 'First name too short').max(50),
    lastName: z.string().min(2, 'Last name too short').max(50),
    email: z.string().email('Invalid email format'),
    avatar: z.instanceof(File).optional(),
  }),
  preferences: z.object({
    newsletter: z.boolean(),
    notifications: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
  }),
  addresses: z.array(z.object({
    type: z.enum(['home', 'work', 'other']),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    isDefault: z.boolean(),
  })).min(1, 'At least one address is required'),
  skills: z.array(z.object({
    name: z.string().min(1, 'Skill name is required'),
    level: z.number().min(1).max(5),
    yearsExperience: z.number().min(0).max(50),
  })),
});

// Tipo TypeScript inferido del schema
type UserFormData = z.infer<typeof userSchema>;

// Componente principal del formulario
const UserProfileForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
    setValue,
    getValues,
    watch,
    trigger
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      profile: {
        firstName: '',
        lastName: '',
        email: '',
      },
      preferences: {
        newsletter: false,
        notifications: true,
        theme: 'light',
      },
      addresses: [{
        type: 'home',
        street: '',
        city: '',
        zipCode: '',
        isDefault: true,
      }],
      skills: [],
    },
    mode: 'onChange', // Validar en tiempo real
  });
  
  // Watch specific fields
  const watchedEmail = watch('profile.email');
  const watchedAddresses = watch('addresses');
  
  // Field array para direcciones
  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
  } = useFieldArray({
    control,
    name: 'addresses',
  });
  
  // Field array para skills
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: 'skills',
  });
  
  const onSubmit = async (data: UserFormData) => {
    try {
      console.log('Submitting:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Submission error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="user-profile-form">
      {/* Profile Section */}
      <section className="form-section">
        <h2>Profile Information</h2>
    
        <div className="form-row">
          <ControlledInput
            name="profile.firstName"
            control={control}
            label="First Name"
            error={errors.profile?.firstName?.message}
            required
          />
      
          <ControlledInput
            name="profile.lastName"
            control={control}
            label="Last Name"
            error={errors.profile?.lastName?.message}
            required
          />
        </div>
    
        <ControlledInput
          name="profile.email"
          control={control}
          label="Email"
          type="email"
          error={errors.profile?.email?.message}
          required
        />
    
        <FileUploadField
          name="profile.avatar"
          control={control}
          label="Profile Picture"
          accept="image/*"
          error={errors.profile?.avatar?.message}
        />
      </section>
  
      {/* Preferences Section */}
      <section className="form-section">
        <h2>Preferences</h2>
    
        <ControlledCheckbox
          name="preferences.newsletter"
          control={control}
          label="Subscribe to newsletter"
        />
    
        <ControlledCheckbox
          name="preferences.notifications"
          control={control}
          label="Enable notifications"
        />
    
        <ControlledSelect
          name="preferences.theme"
          control={control}
          label="Theme"
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' },
          ]}
        />
      </section>
  
      {/* Addresses Section */}
      <section className="form-section">
        <div className="section-header">
          <h2>Addresses</h2>
          <button
            type="button"
            onClick={() => appendAddress({
              type: 'home',
              street: '',
              city: '',
              zipCode: '',
              isDefault: false,
            })}
          >
            Add Address
          </button>
        </div>
    
        {addressFields.map((field, index) => (
          <AddressCard
            key={field.id}
            control={control}
            index={index}
            onRemove={() => removeAddress(index)}
            canRemove={addressFields.length > 1}
            errors={errors.addresses?.[index]}
          />
        ))}
    
        {errors.addresses?.root && (
          <div className="error">{errors.addresses.root.message}</div>
        )}
      </section>
  
      {/* Skills Section */}
      <section className="form-section">
        <div className="section-header">
          <h2>Skills</h2>
          <button
            type="button"
            onClick={() => appendSkill({
              name: '',
              level: 1,
              yearsExperience: 0,
            })}
          >
            Add Skill
          </button>
        </div>
    
        {skillFields.map((field, index) => (
          <SkillRow
            key={field.id}
            control={control}
            index={index}
            onRemove={() => removeSkill(index)}
            errors={errors.skills?.[index]}
          />
        ))}
      </section>
  
      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="button"
          onClick={() => reset()}
          disabled={!isDirty}
        >
          Reset
        </button>
    
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="primary"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
  
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <details className="debug-info">
          <summary>Debug Info</summary>
          <pre>{JSON.stringify({ watchedEmail, errors, isDirty, isValid }, null, 2)}</pre>
        </details>
      )}
    </form>
  );
};

// Componente de input controlado reutilizable
const ControlledInput = ({ 
  name, 
  control, 
  label, 
  error, 
  required = false,
  ...inputProps 
}) => {
  const {
    field,
    fieldState: { isTouched, error: fieldError }
  } = useController({
    name,
    control,
  });
  
  return (
    <FormField 
      label={label} 
      required={required}
      error={isTouched && (error || fieldError?.message)}
    >
      <input
        {...field}
        {...inputProps}
        className={error ? 'error' : ''}
      />
    </FormField>
  );
};

// Componente de checkbox controlado
const ControlledCheckbox = ({ name, control, label }) => {
  const { field } = useController({
    name,
    control,
  });
  
  return (
    <label className="checkbox-field">
      <input
        type="checkbox"
        checked={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        ref={field.ref}
      />
      <span>{label}</span>
    </label>
  );
};

// Componente de select controlado
const ControlledSelect = ({ name, control, label, options }) => {
  const { field } = useController({
    name,
    control,
  });
  
  return (
    <FormField label={label}>
      <select {...field}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

// Componente para upload de archivos
const FileUploadField = ({ name, control, label, accept, error }) => {
  const { field: { onChange, onBlur, ref } } = useController({
    name,
    control,
  });
  
  const [preview, setPreview] = useState(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onChange(file);
  
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };
  
  return (
    <FormField label={label} error={error}>
      <div className="file-upload">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          onBlur={onBlur}
          ref={ref}
        />
        {preview && (
          <div className="file-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
      </div>
    </FormField>
  );
};

// Componente de tarjeta de dirección
const AddressCard = ({ control, index, onRemove, canRemove, errors }) => {
  return (
    <div className="address-card">
      <div className="card-header">
        <h3>Address {index + 1}</h3>
        {canRemove && (
          <button type="button" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
  
      <div className="form-row">
        <ControlledSelect
          name={`addresses.${index}.type`}
          control={control}
          label="Type"
          options={[
            { value: 'home', label: 'Home' },
            { value: 'work', label: 'Work' },
            { value: 'other', label: 'Other' },
          ]}
        />
    
        <ControlledCheckbox
          name={`addresses.${index}.isDefault`}
          control={control}
          label="Default address"
        />
      </div>
  
      <ControlledInput
        name={`addresses.${index}.street`}
        control={control}
        label="Street"
        error={errors?.street?.message}
        required
      />
  
      <div className="form-row">
        <ControlledInput
          name={`addresses.${index}.city`}
          control={control}
          label="City"
          error={errors?.city?.message}
          required
        />
    
        <ControlledInput
          name={`addresses.${index}.zipCode`}
          control={control}
          label="ZIP Code"
          error={errors?.zipCode?.message}
          required
        />
      </div>
    </div>
  );
};

// Componente de fila de skill
const SkillRow = ({ control, index, onRemove, errors }) => {
  return (
    <div className="skill-row">
      <ControlledInput
        name={`skills.${index}.name`}
        control={control}
        label="Skill"
        placeholder="e.g., React, TypeScript"
        error={errors?.name?.message}
        required
      />
  
      <ControlledSelect
        name={`skills.${index}.level`}
        control={control}
        label="Level"
        options={[
          { value: 1, label: 'Beginner' },
          { value: 2, label: 'Basic' },
          { value: 3, label: 'Intermediate' },
          { value: 4, label: 'Advanced' },
          { value: 5, label: 'Expert' },
        ]}
      />
  
      <ControlledInput
        name={`skills.${index}.yearsExperience`}
        control={control}
        label="Years"
        type="number"
        min="0"
        max="50"
        error={errors?.yearsExperience?.message}
      />
  
      <button type="button" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
};
```

### Optimización Avanzada con React Hook Form

```javascript
// Custom hook para formularios con auto-save
const useAutoSaveForm = (options) => {
  const methods = useForm(options);
  const { watch, getValues } = methods;
  
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Debounced auto-save
  const debouncedSave = useMemo(
    () => debounce(async (data) => {
      setIsSaving(true);
      try {
        await options.onAutoSave?.(data);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000),
    [options.onAutoSave]
  );
  
  // Watch all fields for auto-save
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change') {
        debouncedSave(getValues());
      }
    });
  
    return () => subscription.unsubscribe();
  }, [watch, getValues, debouncedSave]);
  
  return {
    ...methods,
    isSaving,
    lastSaved,
  };
};

// Hook para validación asíncrona optimizada
const useAsyncValidation = () => {
  const [validationCache] = useState(new Map());
  const [pendingValidations] = useState(new Set());
  
  const validateAsync = useCallback(async (fieldName, value, validator) => {
    const cacheKey = `${fieldName}-${value}`;
  
    // Return cached result if available
    if (validationCache.has(cacheKey)) {
      return validationCache.get(cacheKey);
    }
  
    // Avoid duplicate validations
    if (pendingValidations.has(cacheKey)) {
      return new Promise((resolve) => {
        const checkCache = () => {
          if (validationCache.has(cacheKey)) {
            resolve(validationCache.get(cacheKey));
          } else {
            setTimeout(checkCache, 100);
          }
        };
        checkCache();
      });
    }
  
    pendingValidations.add(cacheKey);
  
    try {
      const result = await validator(value);
      validationCache.set(cacheKey, result);
      return result;
    } finally {
      pendingValidations.delete(cacheKey);
    }
  }, [validationCache, pendingValidations]);
  
  return { validateAsync };
};
```

---

## 6. FORMIK Y YUP - ALTERNATIVAS ROBUSTAS {#formik-yup}

### Dominio Completo de Formik

```javascript
import { Formik, Form, Field, FieldArray, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';

// Schema de validación avanzado con Yup
const registrationSchema = Yup.object({
  personalInfo: Yup.object({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required')
      .test('unique-email', 'Email already exists', async function(value) {
        if (!value) return true;
        try {
          const response = await fetch('/api/check-email', {
            method: 'POST',
            body: JSON.stringify({ email: value })
          });
          const { exists } = await response.json();
          return !exists;
        } catch {
          return this.createError({ message: 'Unable to verify email' });
        }
      }),
    dateOfBirth: Yup.date()
      .max(new Date(), 'Birth date cannot be in the future')
      .test('age', 'Must be at least 18 years old', function(value) {
        const today = new Date();
        const age = today.getFullYear() - value.getFullYear();
        return age >= 18;
      })
      .required('Required'),
  }),
  
  credentials: Yup.object({
    username: Yup.string()
      .min(3, 'At least 3 characters')
      .max(20, 'Maximum 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')
      .required('Required'),
    password: Yup.string()
      .min(8, 'At least 8 characters')
      .matches(/[a-z]/, 'Must contain lowercase letter')
      .matches(/[A-Z]/, 'Must contain uppercase letter')
      .matches(/\d/, 'Must contain number')
      .matches(/[!@#$%^&*]/, 'Must contain special character')
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
  }),
  
  preferences: Yup.object({
    interests: Yup.array()
      .of(Yup.string())
      .min(1, 'Select at least one interest')
      .required('Required'),
    marketingEmails: Yup.boolean(),
    newsletter: Yup.boolean(),
  }),
  
  addresses: Yup.array()
    .of(
      Yup.object({
        type: Yup.string().oneOf(['home', 'work', 'other']).required(),
        street: Yup.string().required('Street is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        zipCode: Yup.string()
          .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
          .required('ZIP code is required'),
        isDefault: Yup.boolean(),
      })
    )
    .min(1, 'At least one address is required')
    .test('default-address', 'One address must be marked as default', function(addresses) {
      return addresses.some(addr => addr.isDefault);
    }),
});

// Componente principal con Formik
const AdvancedRegistrationForm = () => {
  const initialValues = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
    },
    credentials: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    preferences: {
      interests: [],
      marketingEmails: false,
      newsletter: true,
    },
    addresses: [{
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: true,
    }],
  };
  
  const handleSubmit = async (values, { setSubmitting, setFieldError, setStatus }) => {
    try {
      setStatus(null);
  
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
    
        if (errorData.fieldErrors) {
          // Set field-specific errors
          Object.entries(errorData.fieldErrors).forEach(([field, error]) => {
            setFieldError(field, error);
          });
        } else {
          setStatus({ type: 'error', message: errorData.message || 'Registration failed' });
        }
        return;
      }
  
      const result = await response.json();
      setStatus({ type: 'success', message: 'Registration successful!' });
  
      // Redirect to login or dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
  
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="registration-container">
      <Formik
        initialValues={initialValues}
        validationSchema={registrationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isSubmitting, status, values, errors, touched }) => (
          <Form className="registration-form">
        
            {/* Status Messages */}
            <FormStatus status={status} />
        
            {/* Personal Information */}
            <FormSection title="Personal Information">
              <div className="form-row">
                <FormikField
                  name="personalInfo.firstName"
                  label="First Name"
                  required
                />
                <FormikField
                  name="personalInfo.lastName"
                  label="Last Name"
                  required
                />
              </div>
          
              <FormikField
                name="personalInfo.email"
                label="Email"
                type="email"
                required
              />
          
              <FormikField
                name="personalInfo.dateOfBirth"
                label="Date of Birth"
                type="date"
                required
              />
            </FormSection>
        
            {/* Credentials */}
            <FormSection title="Account Credentials">
              <FormikField
                name="credentials.username"
                label="Username"
                required
              />
          
              <PasswordField
                name="credentials.password"
                label="Password"
                required
              />
          
              <FormikField
                name="credentials.confirmPassword"
                label="Confirm Password"
                type="password"
                required
              />
            </FormSection>
        
            {/* Preferences */}
            <FormSection title="Preferences">
              <InterestsField name="preferences.interests" />
          
              <div className="checkbox-group">
                <FormikCheckbox
                  name="preferences.marketingEmails"
                  label="Receive marketing emails"
                />
                <FormikCheckbox
                  name="preferences.newsletter"
                  label="Subscribe to newsletter"
                />
              </div>
            </FormSection>
        
            {/* Addresses */}
            <FormSection title="Addresses">
              <AddressFieldArray name="addresses" />
            </FormSection>
        
            {/* Submit */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
        
            {/* Debug (Development only) */}
            {process.env.NODE_ENV === 'development' && (
              <FormDebugger />
            )}
        
          </Form>
        )}
      </Formik>
    </div>
  );
};

// Componente de campo reutilizable
const FormikField = ({ name, label, required = false, ...props }) => {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
  
      <Field
        id={name}
        name={name}
        {...props}
      />
  
      <ErrorMessage name={name} component="div" className="error-message" />
    </div>
  );
};

// Campo de contraseña con indicador de fortaleza
const PasswordField = ({ name, label, required }) => {
  const { values } = useFormikContext();
  const password = values.credentials?.password || '';
  
  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    return strength;
  };
  
  const strength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ff4444', '#ff8800', '#ffaa00', '#88cc00', '#00cc44'];
  
  return (
    <div className="password-field">
      <FormikField
        name={name}
        label={label}
        type="password"
        required={required}
      />
  
      {password && (
        <div className="password-strength">
          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{
                width: `${(strength / 5) * 100}%`,
                backgroundColor: strengthColors[strength - 1] || '#ddd'
              }}
            />
          </div>
          <span className="strength-label">
            {strengthLabels[strength - 1] || 'Very Weak'}
          </span>
        </div>
      )}
    </div>
  );
};

// Campo de checkbox con Formik
const FormikCheckbox = ({ name, label }) => {
  return (
    <label className="checkbox-field">
      <Field type="checkbox" name={name} />
      <span>{label}</span>
    </label>
  );
};

// Campo de intereses con selección múltiple
const InterestsField = ({ name }) => {
  const { values, setFieldValue } = useFormikContext();
  const selectedInterests = values.preferences?.interests || [];
  
  const availableInterests = [
    'Technology', 'Sports', 'Music', 'Travel', 'Reading',
    'Gaming', 'Cooking', 'Art', 'Movies', 'Fitness'
  ];
  
  const toggleInterest = (interest) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
  
    setFieldValue(name, newInterests);
  };
  
  return (
    <div className="interests-field">
      <label>Interests (select at least one)</label>
      <div className="interests-grid">
        {availableInterests.map(interest => (
          <button
            key={interest}
            type="button"
            className={`interest-tag ${selectedInterests.includes(interest) ? 'selected' : ''}`}
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
      <ErrorMessage name={name} component="div" className="error-message" />
    </div>
  );
};

// FieldArray para direcciones
const AddressFieldArray = ({ name }) => {
  return (
    <FieldArray name={name}>
      {({ push, remove, form }) => {
        const addresses = form.values.addresses;
    
        return (
          <div className="address-array">
            {addresses.map((address, index) => (
              <AddressCard
                key={index}
                index={index}
                onRemove={() => remove(index)}
                canRemove={addresses.length > 1}
              />
            ))}
        
            <button
              type="button"
              onClick={() => push({
                type: 'home',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                isDefault: false,
              })}
              className="add-address-button"
            >
              Add Another Address
            </button>
          </div>
        );
      }}
    </FieldArray>
  );
};

// Tarjeta de dirección individual
const AddressCard = ({ index, onRemove, canRemove }) => {
  const { values, setFieldValue } = useFormikContext();
  const address = values.addresses[index];
  
  const handleDefaultChange = (e) => {
    if (e.target.checked) {
      // Unset other defaults
      values.addresses.forEach((addr, i) => {
        if (i !== index) {
          setFieldValue(`addresses.${i}.isDefault`, false);
        }
      });
    }
    setFieldValue(`addresses.${index}.isDefault`, e.target.checked);
  };
  
  return (
    <div className="address-card">
      <div className="card-header">
        <h3>Address {index + 1}</h3>
        {canRemove && (
          <button type="button" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
  
      <div className="form-row">
        <div className="form-field">
          <label>Type</label>
          <Field as="select" name={`addresses.${index}.type`}>
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </Field>
        </div>
    
        <label className="checkbox-field">
          <Field
            type="checkbox"
            name={`addresses.${index}.isDefault`}
            checked={address.isDefault}
            onChange={handleDefaultChange}
          />
          <span>Default Address</span>
        </label>
      </div>
  
      <FormikField
        name={`addresses.${index}.street`}
        label="Street Address"
        required
      />
  
      <div className="form-row">
        <FormikField
          name={`addresses.${index}.city`}
          label="City"
          required
        />
        <FormikField
          name={`addresses.${index}.state`}
          label="State"
          required
        />
        <FormikField
          name={`addresses.${index}.zipCode`}
          label="ZIP Code"
          required
        />
      </div>
    </div>
  );
};

// Componente de sección del formulario
const FormSection = ({ title, children }) => {
  return (
    <section className="form-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
};

// Componente de estado del formulario
const FormStatus = ({ status }) => {
  if (!status) return null;
  
  return (
    <div className={`form-status ${status.type}`}>
      {status.message}
    </div>
  );
};

// Debugger para desarrollo
const FormDebugger = () => {
  const { values, errors, touched } = useFormikContext();
  
  return (
    <details className="form-debugger">
      <summary>Form Debug Info</summary>
      <div className="debug-section">
        <h4>Values:</h4>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
      <div className="debug-section">
        <h4>Errors:</h4>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>
      <div className="debug-section">
        <h4>Touched:</h4>
        <pre>{JSON.stringify(touched, null, 2)}</pre>
      </div>
    </details>
  );
};
```

---

## 7. FORMULARIOS EN REACT NATIVE {#react-native}

### Formularios Nativos Optimizados

```javascript
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Schema de validación para móvil
const mobileRegistrationSchema = Yup.object({
  personalInfo: Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
      .required('Phone number is required'),
  }),
  address: Yup.object({
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('ZIP code is required'),
  }),
});

// Componente principal del formulario móvil
const MobileRegistrationForm = () => {
  const scrollViewRef = useRef(null);
  const inputRefs = useRef({});
  
  const initialValues = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    address: {
      street: '',
      city: '',
      zipCode: '',
    },
  };
  
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      Keyboard.dismiss();
  
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      Alert.alert(
        'Success',
        'Registration completed successfully!',
        [{ text: 'OK', onPress: () => console.log('Registration completed') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const focusNextField = (nextFieldName) => {
    const nextInput = inputRefs.current[nextFieldName];
    if (nextInput) {
      nextInput.focus();
    }
  };
  
  const scrollToField = (fieldName) => {
    // Scroll to show the field that has an error
    const fieldPosition = getFieldPosition(fieldName);
    if (scrollViewRef.current && fieldPosition) {
      scrollViewRef.current.scrollTo({ y: fieldPosition, animated: true });
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={mobileRegistrationSchema}
        onSubmit={handleSubmit}
        validateOnMount={false}
        validateOnChange={false}
        validateOnBlur={true}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldTouched,
          isSubmitting,
          isValid,
        }) => (
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
        
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Please fill in your information</Text>
            </View>
        
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
          
              <MobileFormField
                ref={ref => inputRefs.current['firstName'] = ref}
                label="First Name"
                value={values.personalInfo.firstName}
                onChangeText={handleChange('personalInfo.firstName')}
                onBlur={() => {
                  handleBlur('personalInfo.firstName');
                  setFieldTouched('personalInfo.firstName');
                }}
                error={touched.personalInfo?.firstName && errors.personalInfo?.firstName}
                placeholder="Enter your first name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => focusNextField('lastName')}
                required
              />
          
              <MobileFormField
                ref={ref => inputRefs.current['lastName'] = ref}
                label="Last Name"
                value={values.personalInfo.lastName}
                onChangeText={handleChange('personalInfo.lastName')}
                onBlur={() => {
                  handleBlur('personalInfo.lastName');
                  setFieldTouched('personalInfo.lastName');
                }}
                error={touched.personalInfo?.lastName && errors.personalInfo?.lastName}
                placeholder="Enter your last name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => focusNextField('email')}
                required
              />
          
              <MobileFormField
                ref={ref => inputRefs.current['email'] = ref}
                label="Email"
                value={values.personalInfo.email}
                onChangeText={handleChange('personalInfo.email')}
                onBlur={() => {
                  handleBlur('personalInfo.email');
                  setFieldTouched('personalInfo.email');
                }}
                error={touched.personalInfo?.email && errors.personalInfo?.email}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => focusNextField('phone')}
                required
              />
          
              <MobileFormField
                ref={ref => inputRefs.current['phone'] = ref}
                label="Phone Number"
                value={values.personalInfo.phone}
                onChangeText={handleChange('personalInfo.phone')}
                onBlur={() => {
                  handleBlur('personalInfo.phone');
                  setFieldTouched('personalInfo.phone');
                }}
                error={touched.personalInfo?.phone && errors.personalInfo?.phone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                autoComplete="tel"
                returnKeyType="next"
                onSubmitEditing={() => focusNextField('street')}
                required
              />
            </View>
        
            {/* Address Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address</Text>
          
              <MobileFormField
                ref={ref => inputRefs.current['street'] = ref}
                label="Street Address"
                value={values.address.street}
                onChangeText={handleChange('address.street')}
                onBlur={() => {
                  handleBlur('address.street');
                  setFieldTouched('address.street');
                }}
                error={touched.address?.street && errors.address?.street}
                placeholder="Enter your street address"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => focusNextField('city')}
                required
              />
          
              <MobileFormField
                ref={ref => inputRefs.current['city'] = ref}
                label="City"
                value={values.address.city}
                onChangeText={handleChange('address.city')}
                onBlur={() => {
                  handleBlur('address.city');
                  setFieldTouched('address.city');
                }}
                error={touched.address?.city && errors.address?.city}
                placeholder="Enter your city"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => focusNextField('zipCode')}
                required
              />
          
              <MobileFormField
                ref={ref => inputRefs.current['zipCode'] = ref}
                label="ZIP Code"
                value={values.address.zipCode}
                onChangeText={handleChange('address.zipCode')}
                onBlur={() => {
                  handleBlur('address.zipCode');
                  setFieldTouched('address.zipCode');
                }}
                error={touched.address?.zipCode && errors.address?.zipCode}
                placeholder="Enter your ZIP code"
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                required
              />
            </View>
        
            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!isValid || isSubmitting) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>
        
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

// Componente de campo de formulario móvil reutilizable
const MobileFormField = React.forwardRef(({
  label,
  error,
  required = false,
  style,
  ...inputProps
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = (e) => {
    setIsFocused(true);
    inputProps.onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    inputProps.onBlur?.(e);
  };
  
  return (
    <View style={[styles.fieldContainer, style]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
  
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError
      ]}>
        <TextInput
          ref={ref}
          style={styles.textInput}
          placeholderTextColor="#999"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...inputProps}
        />
      </View>
  
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
});

// Formulario con selección de imágenes
const ImageUploadForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const pickImage = async () => {
    const { launchImageLibrary } = require('react-native-image-picker');
  
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };
  
    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
      }
    });
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePickerText}>Tap to select image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Hook para manejo de teclado en formularios
const useKeyboardHandling = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );
  
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );
  
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  return {
    keyboardHeight,
    isKeyboardVisible,
    dismissKeyboard: Keyboard.dismiss,
  };
};

// Estilos para React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
  },
  inputContainerFocused: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: '#e74c3c',
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  imagePickerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selectedImage: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },
});

export default MobileRegistrationForm;
```

---

## 8. PERFORMANCE Y OPTIMIZACIÓN {#performance}

### Técnicas Avanzadas de Optimización

```javascript
// 1. Debouncing inteligente para validación
const useDebouncedValidation = (validationFn, delay = 300) => {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);
  const validationRef = useRef(null);
  
  const debouncedValidate = useCallback((value) => {
    // Cancelar validación anterior
    if (validationRef.current) {
      clearTimeout(validationRef.current);
    }
  
    setIsValidating(true);
  
    validationRef.current = setTimeout(async () => {
      try {
        const result = await validationFn(value);
        setError(result);
      } catch (err) {
        setError('Validation failed');
      } finally {
        setIsValidating(false);
      }
    }, delay);
  }, [validationFn, delay]);
  
  useEffect(() => {
    return () => {
      if (validationRef.current) {
        clearTimeout(validationRef.current);
      }
    };
  }, []);
  
  return { debouncedValidate, isValidating, error };
};

// 2. Virtual scrolling para listas grandes de campos
const VirtualizedFormList = ({ items, renderItem, itemHeight = 60 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 2,
      items.length
    );
  
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      offsetY: startIndex * itemHeight
    };
  }, [scrollTop, containerHeight, items, itemHeight]);
  
  return (
    <div
      className="virtualized-form-list"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${visibleItems.offsetY}px)` }}>
          {visibleItems.items.map((item, index) => (
            <div key={visibleItems.startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleItems.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Optimización de re-renders con React.memo
const OptimizedFormField = React.memo(({
  name,
  value,
  onChange,
  onBlur,
  error,
  label,
  ...props
}) => {
  console.log(`Rendering field: ${name}`);
  
  return (
    <div className="form-field">
      <label>{label}</label>
      <input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? 'error' : ''}
        {...props}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparación personalizada para evitar re-renders innecesarios
  return (
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.label === nextProps.label
  );
});

// 4. Hook para formularios grandes con lazy validation
const useLargeForm = ({ initialValues, validationSchema, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cache de validaciones para evitar recálculos
  const validationCache = useRef(new Map());
  
  const validateField = useCallback(async (fieldName, value) => {
    const cacheKey = `${fieldName}-${value}`;
  
    if (validationCache.current.has(cacheKey)) {
      return validationCache.current.get(cacheKey);
    }
  
    try {
      await validationSchema.validateAt(fieldName, { [fieldName]: value });
      validationCache.current.set(cacheKey, null);
      return null;
    } catch (error) {
      const errorMessage = error.message;
      validationCache.current.set(cacheKey, errorMessage);
      return errorMessage;
    }
  }, [validationSchema]);
  
  const setFieldValue = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
  
    // Limpiar error si existe
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  }, [errors]);
  
  const setFieldTouched = useCallback(async (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  
    // Validar solo si está tocado
    const fieldValue = values[fieldName];
    const error = await validateField(fieldName, fieldValue);
  
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [values, validationSchema, onSubmit]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    validateField
  };
};

// 5. Componente de formulario optimizado para grandes datasets
const LargeDatasetForm = ({ data = [] }) => {
  const [filter, setFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  
  // Filtrado optimizado con useMemo
  const filteredData = useMemo(() => {
    if (!filter) return data;
  
    const lowercaseFilter = filter.toLowerCase();
    return data.filter(item => 
      item.name.toLowerCase().includes(lowercaseFilter) ||
      item.email.toLowerCase().includes(lowercaseFilter)
    );
  }, [data, filter]);
  
  // Callbacks memoizados para evitar re-renders
  const handleToggleItem = useCallback((itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);
  
  const handleSelectAll = useCallback(() => {
    setSelectedItems(new Set(filteredData.map(item => item.id)));
  }, [filteredData]);
  
  const handleDeselectAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);
  
  return (
    <div className="large-dataset-form">
      <div className="form-controls">
        <input
          type="text"
          placeholder="Filter items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
    
        <div className="bulk-actions">
          <button onClick={handleSelectAll}>Select All</button>
          <button onClick={handleDeselectAll}>Deselect All</button>
          <span>Selected: {selectedItems.size}</span>
        </div>
      </div>
  
      <VirtualizedFormList
        items={filteredData}
        itemHeight={60}
        renderItem={(item, index) => (
          <OptimizedFormField
            key={item.id}
            name={`item-${item.id}`}
            value={selectedItems.has(item.id)}
            onChange={() => handleToggleItem(item.id)}
            label={`${item.name} (${item.email})`}
            type="checkbox"
          />
        )}
      />
    </div>
  );
};

---

## 9. UX/UI DE FORMULARIOS {#ux-ui}

### Principios de UX para Formularios

```javascript
// 1. Formulario con UX progresivo
const ProgressiveFormUX = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [formData, setFormData] = useState({});
  
  const steps = [
    { id: 'basic', title: 'Basic Info', fields: ['name', 'email'] },
    { id: 'details', title: 'Details', fields: ['phone', 'address'] },
    { id: 'preferences', title: 'Preferences', fields: ['newsletter', 'notifications'] }
  ];
  
  return (
    <div className="progressive-form">
      {/* Progress Indicator */}
      <div className="progress-indicator">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`progress-step ${
              index === currentStep ? 'active' : 
              completedSteps.has(index) ? 'completed' : 'pending'
            }`}
          >
            <div className="step-circle">
              {completedSteps.has(index) ? '✓' : index + 1}
            </div>
            <span className="step-title">{step.title}</span>
          </div>
        ))}
      </div>
  
      {/* Step Content */}
      <div className="step-content">
        <StepContent 
          step={steps[currentStep]} 
          data={formData}
          onDataChange={setFormData}
        />
      </div>
  
      {/* Navigation */}
      <div className="step-navigation">
        {currentStep > 0 && (
          <button 
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="nav-button secondary"
          >
            Previous
          </button>
        )}
    
        <button 
          onClick={() => {
            if (currentStep < steps.length - 1) {
              setCompletedSteps(prev => new Set([...prev, currentStep]));
              setCurrentStep(prev => prev + 1);
            }
          }}
          className="nav-button primary"
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

// 2. Smart Form Field con auto-mejoras UX
const SmartFormField = ({ 
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const inputRef = useRef();
  
  // Auto-format para diferentes tipos de campos
  const formatValue = useCallback((value, type) => {
    switch (type) {
      case 'phone':
        return value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      case 'credit-card':
        return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      case 'ssn':
        return value.replace(/\D/g, '').replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
      default:
        return value;
    }
  }, []);
  
  const handleChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatValue(rawValue, type);
    onChange({ ...e, target: { ...e.target, value: formattedValue } });
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    if (!hasBeenFocused) {
      setHasBeenFocused(true);
    }
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  // Auto-suggest para campos comunes
  const getSuggestions = () => {
    if (type === 'email' && value && value.includes('@') && !value.includes('.')) {
      return ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
        .map(domain => value.split('@')[0] + '@' + domain);
    }
    return [];
  };
  
  const suggestions = getSuggestions();
  
  return (
    <div className={`smart-form-field ${type}`}>
      <div className="field-wrapper">
        {/* Floating Label */}
        <input
          ref={inputRef}
          type={type === 'phone' || type === 'credit-card' ? 'text' : type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused || value ? '' : placeholder}
          autoComplete={autoComplete}
          className={`form-input ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}
          {...props}
        />
    
        <label 
          className={`floating-label ${isFocused || value ? 'active' : ''}`}
          onClick={() => inputRef.current?.focus()}
        >
          {label}
        </label>
    
        {/* Field Icons */}
        <div className="field-icons">
          {type === 'password' && <PasswordToggle />}
          {error && <ErrorIcon />}
          {!error && hasBeenFocused && value && <SuccessIcon />}
        </div>
      </div>
  
      {/* Auto-suggestions */}
      {suggestions.length > 0 && isFocused && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="suggestion-item"
              onClick={() => onChange({ target: { value: suggestion } })}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
  
      {/* Error Message */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
  
      {/* Helper Text */}
      {!error && type === 'password' && value && (
        <PasswordStrengthIndicator password={value} />
      )}
    </div>
  );
};

// 3. Formulario con micro-interacciones
const MicroInteractionForm = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touchedFields, setTouchedFields] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const updateField = (fieldName, value) => {
    setFormState(prev => ({ ...prev, [fieldName]: value }));
  };
  
  const markFieldTouched = (fieldName) => {
    setTouchedFields(prev => new Set([...prev, fieldName]));
  };
  
  const getFieldError = (fieldName) => {
    if (!touchedFields.has(fieldName)) return null;
  
    const value = formState[fieldName];
    switch (fieldName) {
      case 'email':
        return !value ? 'Email is required' : 
               !/\S+@\S+\.\S+/.test(value) ? 'Invalid email' : null;
      case 'password':
        return !value ? 'Password is required' :
               value.length < 8 ? 'Password too short' : null;
      case 'confirmPassword':
        return !value ? 'Please confirm password' :
               value !== formState.password ? 'Passwords do not match' : null;
      default:
        return null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
  
    setIsSubmitting(false);
    setSubmitSuccess(true);
  
    // Reset form after success animation
    setTimeout(() => {
      setFormState({ email: '', password: '', confirmPassword: '' });
      setTouchedFields(new Set());
      setSubmitSuccess(false);
    }, 3000);
  };
  
  return (
    <div className="micro-interaction-form">
      <form onSubmit={handleSubmit}>
    
        {/* Animated Form Fields */}
        <div className="form-fields">
          <SmartFormField
            type="email"
            name="email"
            label="Email Address"
            value={formState.email}
            onChange={(e) => updateField('email', e.target.value)}
            onBlur={() => markFieldTouched('email')}
            error={getFieldError('email')}
            autoComplete="email"
          />
      
          <SmartFormField
            type="password"
            name="password"
            label="Password"
            value={formState.password}
            onChange={(e) => updateField('password', e.target.value)}
            onBlur={() => markFieldTouched('password')}
            error={getFieldError('password')}
            autoComplete="new-password"
          />
      
          <SmartFormField
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={formState.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            onBlur={() => markFieldTouched('confirmPassword')}
            error={getFieldError('confirmPassword')}
            autoComplete="new-password"
          />
        </div>
    
        {/* Animated Submit Button */}
        <button
          type="submit"
          className={`submit-button ${isSubmitting ? 'submitting' : ''} ${submitSuccess ? 'success' : ''}`}
          disabled={isSubmitting || submitSuccess}
        >
          <span className="button-text">
            {isSubmitting ? 'Creating Account...' : 
             submitSuccess ? 'Account Created!' : 'Create Account'}
          </span>
      
          <div className="button-animation">
            {isSubmitting && <LoadingSpinner />}
            {submitSuccess && <SuccessCheckmark />}
          </div>
        </button>
    
      </form>
  
      {/* Success Overlay */}
      {submitSuccess && (
        <div className="success-overlay">
          <div className="success-content">
            <SuccessIcon size="large" />
            <h2>Welcome aboard!</h2>
            <p>Your account has been created successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Componentes de UI especializados
const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };
  
  const strength = getStrength();
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#2ecc71'];
  
  return (
    <div className="password-strength">
      <div className="strength-bar">
        {[1, 2, 3, 4, 5].map(level => (
          <div
            key={level}
            className={`strength-segment ${level <= strength ? 'active' : ''}`}
            style={{ 
              backgroundColor: level <= strength ? strengthColors[strength - 1] : '#ddd' 
            }}
          />
        ))}
      </div>
      <span className="strength-label">
        {password ? strengthLabels[strength - 1] || 'Very Weak' : ''}
      </span>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

const SuccessCheckmark = () => (
  <div className="success-checkmark">
    <svg viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="25" fill="none" />
      <path fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8" />
    </svg>
  </div>
);
```

### CSS para Micro-interacciones

```css
/* Floating Labels */
.smart-form-field {
  position: relative;
  margin-bottom: 1.5rem;
}

.field-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 0.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #007AFF;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.floating-label {
  position: absolute;
  left: 1rem;
  top: 1rem;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s ease;
  pointer-events: none;
  background: #fff;
  padding: 0 0.25rem;
}

.floating-label.active {
  top: -0.5rem;
  font-size: 0.75rem;
  color: #007AFF;
  font-weight: 500;
}

/* Password Strength */
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  display: flex;
  gap: 2px;
  margin-bottom: 0.25rem;
}

.strength-segment {
  height: 4px;
  flex: 1;
  background: #ddd;
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

/* Submit Button Animations */
.submit-button {
  position: relative;
  width: 100%;
  padding: 1rem 2rem;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.submit-button:hover:not(:disabled) {
  background: #0056CC;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.submit-button.submitting {
  background: #666;
  cursor: not-allowed;
}

.submit-button.success {
  background: #28a745;
  animation: successPulse 0.6s ease;
}

@keyframes successPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Loading Spinner */
.loading-spinner {
  display: inline-block;
  margin-left: 0.5rem;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Success Checkmark */
.success-checkmark {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.5rem;
}

.success-checkmark svg {
  width: 100%;
  height: 100%;
}

.success-checkmark circle {
  stroke: currentColor;
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.success-checkmark path {
  stroke: currentColor;
  stroke-width: 3;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

/* Form Progress */
.progress-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.progress-indicator::before {
  content: '';
  position: absolute;
  top: 1.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background: #ddd;
  z-index: 1;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-circle {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.progress-step.active .step-circle {
  background: #007AFF;
  color: white;
  transform: scale(1.1);
}

.progress-step.completed .step-circle {
  background: #28a745;
  color: white;
}

/* Suggestions Dropdown */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestion-item {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background: #f5f5f5;
}
```

---

## 10. CASOS DE USO REALES {#casos-reales}

### E-commerce Checkout Form

```javascript
// Formulario de checkout completo
const CheckoutForm = () => {
  const { cartItems, cartTotal, applyCoupon, removeCoupon } = useCart();
  const { user, addresses, paymentMethods } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const checkoutSchema = yup.object({
    shipping: yup.object({
      addressId: yup.string().required('Shipping address required'),
      method: yup.string().required('Shipping method required'),
    }),
    payment: yup.object({
      methodId: yup.string().required('Payment method required'),
      billingAddressId: yup.string().required('Billing address required'),
    }),
    couponCode: yup.string(),
    giftMessage: yup.string().max(500, 'Message too long'),
    newsletter: yup.boolean(),
    terms: yup.boolean().oneOf([true], 'You must accept the terms'),
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    control
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      shipping: {
        addressId: addresses[0]?.id || '',
        method: 'standard',
      },
      payment: {
        methodId: paymentMethods[0]?.id || '',
        billingAddressId: addresses[0]?.id || '',
      },
      couponCode: '',
      giftMessage: '',
      newsletter: false,
      terms: false,
    },
    mode: 'onChange'
  });
  
  const watchedValues = watch();
  const [orderSummary, setOrderSummary] = useState(null);
  
  // Calculate order total in real-time
  useEffect(() => {
    const calculateTotal = async () => {
      const summary = await calculateOrderSummary({
        items: cartItems,
        shippingMethod: watchedValues.shipping.method,
        shippingAddress: addresses.find(a => a.id === watchedValues.shipping.addressId),
        couponCode: watchedValues.couponCode,
      });
      setOrderSummary(summary);
    };
  
    calculateTotal();
  }, [cartItems, watchedValues.shipping, watchedValues.couponCode, addresses]);
  
  const onSubmit = async (data) => {
    setIsProcessing(true);
  
    try {
      const order = await processOrder({
        items: cartItems,
        shipping: data.shipping,
        payment: data.payment,
        couponCode: data.couponCode,
        giftMessage: data.giftMessage,
        newsletter: data.newsletter,
      });
  
      // Redirect to confirmation
      window.location.href = `/order-confirmation/${order.id}`;
    } catch (error) {
      // Handle payment errors
      if (error.type === 'card_error') {
        setError('payment.methodId', { message: error.message });
      } else {
        alert('Order processing failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="checkout-form">
      <form onSubmit={handleSubmit(onSubmit)}>
    
        {/* Order Summary */}
        <OrderSummaryCard 
          items={cartItems}
          summary={orderSummary}
          couponCode={watchedValues.couponCode}
          onApplyCoupon={(code) => setValue('couponCode', code)}
          onRemoveCoupon={() => setValue('couponCode', '')}
        />
    
        {/* Shipping Section */}
        <CheckoutSection title="Shipping Information">
          <ShippingAddressSelector
            addresses={addresses}
            selectedId={watchedValues.shipping.addressId}
            onChange={(addressId) => setValue('shipping.addressId', addressId)}
            error={errors.shipping?.addressId?.message}
          />
      
          <ShippingMethodSelector
            methods={shippingMethods}
            selectedMethod={watchedValues.shipping.method}
            onChange={(method) => setValue('shipping.method', method)}
            error={errors.shipping?.method?.message}
          />
        </CheckoutSection>
    
        {/* Payment Section */}
        <CheckoutSection title="Payment Information">
          <PaymentMethodSelector
            methods={paymentMethods}
            selectedId={watchedValues.payment.methodId}
            onChange={(methodId) => setValue('payment.methodId', methodId)}
            error={errors.payment?.methodId?.message}
          />
      
          <BillingAddressSelector
            addresses={addresses}
            selectedId={watchedValues.payment.billingAddressId}
            onChange={(addressId) => setValue('payment.billingAddressId', addressId)}
            sameAsShipping={watchedValues.payment.billingAddressId === watchedValues.shipping.addressId}
            onSameAsShippingChange={(same) => {
              if (same) {
                setValue('payment.billingAddressId', watchedValues.shipping.addressId);
              }
            }}
            error={errors.payment?.billingAddressId?.message}
          />
        </CheckoutSection>
    
        {/* Additional Options */}
        <CheckoutSection title="Additional Options">
          <div className="form-field">
            <label>Gift Message (Optional)</label>
            <textarea
              {...register('giftMessage')}
              placeholder="Add a gift message..."
              maxLength={500}
            />
            {errors.giftMessage && (
              <span className="error">{errors.giftMessage.message}</span>
            )}
          </div>
      
          <div className="checkbox-group">
            <label className="checkbox-field">
              <input type="checkbox" {...register('newsletter')} />
              <span>Subscribe to our newsletter for exclusive offers</span>
            </label>
        
            <label className="checkbox-field">
              <input type="checkbox" {...register('terms')} />
              <span>
                I agree to the <a href="/terms" target="_blank">Terms of Service</a> and{' '}
                <a href="/privacy" target="_blank">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && (
              <span className="error">{errors.terms.message}</span>
            )}
          </div>
        </CheckoutSection>
    
        {/* Place Order */}
        <div className="checkout-actions">
          <button
            type="submit"
            className="place-order-button"
            disabled={!isValid || isProcessing}
          >
            {isProcessing ? (
              <>
                <LoadingSpinner />
                Processing Order...
              </>
            ) : (
              <>
                Place Order - ${orderSummary?.total?.toFixed(2) || '0.00'}
              </>
            )}
          </button>
      
          <div className="security-badges">
            <img src="/secure-checkout.svg" alt="Secure Checkout" />
            <span>Your information is secure and encrypted</span>
          </div>
        </div>
    
      </form>
    </div>
  );
};

// Componente de selección de dirección de envío
const ShippingAddressSelector = ({ addresses, selectedId, onChange, error }) => {
  const [showAddNew, setShowAddNew] = useState(false);
  
  return (
    <div className="address-selector">
      <h3>Shipping Address</h3>
  
      <div className="address-options">
        {addresses.map(address => (
          <AddressCard
            key={address.id}
            address={address}
            selected={selectedId === address.id}
            onSelect={() => onChange(address.id)}
          />
        ))}
    
        <button
          type="button"
          className="add-address-card"
          onClick={() => setShowAddNew(true)}
        >
          <PlusIcon />
          Add New Address
        </button>
      </div>
  
      {error && <span className="error">{error}</span>}
  
      {showAddNew && (
        <AddNewAddressModal
          onClose={() => setShowAddNew(false)}
          onSave={(newAddress) => {
            addresses.push(newAddress);
            onChange(newAddress.id);
            setShowAddNew(false);
          }}
        />
      )}
    </div>
  );
};
```

### CRM Lead Capture Form

```javascript
// Formulario de captura de leads para CRM
const LeadCaptureForm = ({ source, campaign, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [leadData, setLeadData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const leadSchema = yup.object({
    // Step 1: Basic Info
    firstName: yup.string().required('First name required'),
    lastName: yup.string().required('Last name required'),
    email: yup.string().email('Invalid email').required('Email required'),
    phone: yup.string().required('Phone required'),
  
    // Step 2: Company Info
    company: yup.string().required('Company name required'),
    jobTitle: yup.string().required('Job title required'),
    companySize: yup.string().required('Company size required'),
    industry: yup.string().required('Industry required'),
  
    // Step 3: Requirements
    budget: yup.string().required('Budget range required'),
    timeline: yup.string().required('Timeline required'),
    challenges: yup.array().min(1, 'Select at least one challenge'),
    description: yup.string().max(1000, 'Description too long'),
  
    // Consent
    emailConsent: yup.boolean().oneOf([true], 'Email consent required'),
    dataProcessingConsent: yup.boolean().oneOf([true], 'Data processing consent required'),
  });
  
  const form = useForm({
    resolver: yupResolver(leadSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      companySize: '',
      industry: '',
      budget: '',
      timeline: '',
      challenges: [],
      description: '',
      emailConsent: false,
      dataProcessingConsent: false,
    }
  });
  
  const { handleSubmit, formState: { errors, isValid }, watch, trigger } = form;
  
  const handleStepSubmit = async () => {
    const fieldsToValidate = getStepFields(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
  
    if (isStepValid) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        await submitLead();
      }
    }
  };
  
  const submitLead = async () => {
    setIsSubmitting(true);
  
    try {
      const formData = form.getValues();
      const leadPayload = {
        ...formData,
        source,
        campaign,
        capturedAt: new Date().toISOString(),
        utm: getUTMParameters(),
        browserInfo: getBrowserInfo(),
      };
  
      await onSubmit(leadPayload);
  
      // Track conversion
      gtag('event', 'conversion', {
        send_to: 'AW-XXXXXXXXX/XXXXXXXXX',
        value: 1.0,
        currency: 'USD'
      });
  
      // Show success message
      setCurrentStep(4);
    } catch (error) {
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStepFields = (step) => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone'];
      case 2:
        return ['company', 'jobTitle', 'companySize', 'industry'];
      case 3:
        return ['budget', 'timeline', 'challenges', 'emailConsent', 'dataProcessingConsent'];
      default:
        return [];
    }
  };
  
  return (
    <div className="lead-capture-form">
      <div className="form-header">
        <h2>Get Your Free Consultation</h2>
        <div className="step-indicator">
          <span className={currentStep >= 1 ? 'active' : ''}>1</span>
          <span className={currentStep >= 2 ? 'active' : ''}>2</span>
          <span className={currentStep >= 3 ? 'active' : ''}>3</span>
        </div>
      </div>
  
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleStepSubmit)}>
      
          {currentStep === 1 && (
            <LeadCaptureStep1 errors={errors} />
          )}
      
          {currentStep === 2 && (
            <LeadCaptureStep2 errors={errors} />
          )}
      
          {currentStep === 3 && (
            <LeadCaptureStep3 errors={errors} />
          )}
      
          {currentStep === 4 && (
            <LeadCaptureSuccess />
          )}
      
          {currentStep < 4 && (
            <div className="form-actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="back-button"
                >
                  Back
                </button>
              )}
          
              <button
                type="submit"
                className="next-button"
                disabled={isSubmitting}
              >
                {currentStep === 3 ? (
                  isSubmitting ? 'Submitting...' : 'Get My Free Consultation'
                ) : (
                  'Next Step'
                )}
              </button>
            </div>
          )}
      
        </form>
      </FormProvider>
  
      {/* Social Proof */}
      <div className="social-proof">
        <p>Join 10,000+ companies that trust us with their digital transformation</p>
        <div className="company-logos">
          {/* Company logos */}
        </div>
      </div>
    </div>
  );
};

// Step components
const LeadCaptureStep1 = ({ errors }) => {
  const { register } = useFormContext();
  
  return (
    <div className="form-step">
      <h3>Let's start with your contact information</h3>
  
      <div className="form-row">
        <FormField label="First Name" error={errors.firstName?.message} required>
          <input
            {...register('firstName')}
            placeholder="Enter your first name"
            autoComplete="given-name"
          />
        </FormField>
    
        <FormField label="Last Name" error={errors.lastName?.message} required>
          <input
            {...register('lastName')}
            placeholder="Enter your last name"
            autoComplete="family-name"
          />
        </FormField>
      </div>
  
      <FormField label="Business Email" error={errors.email?.message} required>
        <input
          {...register('email')}
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />
      </FormField>
  
      <FormField label="Phone Number" error={errors.phone?.message} required>
        <input
          {...register('phone')}
          type="tel"
          placeholder="+1 (555) 123-4567"
          autoComplete="tel"
        />
      </FormField>
    </div>
  );
};

const LeadCaptureStep2 = ({ errors }) => {
  const { register, control } = useFormContext();
  
  const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1,000 employees' },
    { value: '1000+', label: '1,000+ employees' },
  ];
  
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing',
    'Retail', 'Education', 'Government', 'Other'
  ];
  
  return (
    <div className="form-step">
      <h3>Tell us about your company</h3>
  
      <FormField label="Company Name" error={errors.company?.message} required>
        <input
          {...register('company')}
          placeholder="Your company name"
          autoComplete="organization"
        />
      </FormField>
  
      <FormField label="Job Title" error={errors.jobTitle?.message} required>
        <input
          {...register('jobTitle')}
          placeholder="Your job title"
          autoComplete="organization-title"
        />
      </FormField>
  
      <div className="form-row">
        <FormField label="Company Size" error={errors.companySize?.message} required>
          <Controller
            name="companySize"
            control={control}
            render={({ field }) => (
              <select {...field}>
                <option value="">Select company size</option>
                {companySizes.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            )}
          />
        </FormField>
    
        <FormField label="Industry" error={errors.industry?.message} required>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <select {...field}>
                <option value="">Select industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            )}
          />
        </FormField>
      </div>
    </div>
  );
};

const LeadCaptureStep3 = ({ errors }) => {
  const { register, control, watch } = useFormContext();
  
  const budgetRanges = [
    { value: 'under-10k', label: 'Under $10,000' },
    { value: '10k-50k', label: '$10,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k-500k', label: '$100,000 - $500,000' },
    { value: '500k+', label: '$500,000+' },
  ];
  
  const timelineOptions = [
    { value: 'asap', label: 'ASAP' },
    { value: '1-3months', label: '1-3 months' },
    { value: '3-6months', label: '3-6 months' },
    { value: '6-12months', label: '6-12 months' },
    { value: 'exploring', label: 'Just exploring' },
  ];
  
  const challengeOptions = [
    'Increase sales',
    'Improve efficiency',
    'Reduce costs',
    'Digital transformation',
    'Competitive advantage',
    'Compliance requirements',
    'Scalability issues',
    'Integration challenges'
  ];
  
  return (
    <div className="form-step">
      <h3>Help us understand your needs</h3>
  
      <div className="form-row">
        <FormField label="Budget Range" error={errors.budget?.message} required>
          <Controller
            name="budget"
            control={control}
            render={({ field }) => (
              <select {...field}>
                <option value="">Select budget range</option>
                {budgetRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            )}
          />
        </FormField>
    
        <FormField label="Timeline" error={errors.timeline?.message} required>
          <Controller
            name="timeline"
            control={control}
            render={({ field }) => (
              <select {...field}>
                <option value="">Select timeline</option>
                {timelineOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
        </FormField>
      </div>
  
      <FormField label="What are your main challenges?" error={errors.challenges?.message} required>
        <div className="checkbox-group">
          {challengeOptions.map(challenge => (
            <label key={challenge} className="checkbox-field">
              <input
                type="checkbox"
                value={challenge}
                {...register('challenges')}
              />
              <span>{challenge}</span>
            </label>
          ))}
        </div>
      </FormField>
  
      <FormField label="Additional Details" error={errors.description?.message}>
        <textarea
          {...register('description')}
          placeholder="Tell us more about your specific needs and goals..."
          rows={4}
          maxLength={1000}
        />
      </FormField>
  
      <div className="consent-section">
        <label className="checkbox-field">
          <input
            type="checkbox"
            {...register('emailConsent')}
          />
          <span>
            I agree to receive marketing communications from your company
          </span>
        </label>
        {errors.emailConsent && (
          <span className="error">{errors.emailConsent.message}</span>
        )}
    
        <label className="checkbox-field">
          <input
            type="checkbox"
            {...register('dataProcessingConsent')}
          />
          <span>
            I agree to the processing of my personal data as described in the{' '}
            <a href="/privacy" target="_blank">Privacy Policy</a>
          </span>
        </label>
        {errors.dataProcessingConsent && (
          <span className="error">{errors.dataProcessingConsent.message}</span>
        )}
      </div>
    </div>
  );
};

const LeadCaptureSuccess = () => {
  return (
    <div className="success-step">
      <div className="success-icon">✓</div>
      <h3>Thank you for your interest!</h3>
      <p>
        We've received your information and will be in touch within 24 hours 
        to schedule your free consultation.
      </p>
  
      <div className="next-steps">
        <h4>What happens next?</h4>
        <ul>
          <li>Our team will review your requirements</li>
          <li>We'll prepare a customized proposal</li>
          <li>Schedule a detailed discussion</li>
          <li>Present our recommendations</li>
        </ul>
      </div>
  
      <div className="additional-resources">
        <h4>While you wait, check out these resources:</h4>
        <a href="/case-studies" className="resource-link">
          View Case Studies
        </a>
        <a href="/whitepaper" className="resource-link">
          Download Free Guide
        </a>
      </div>
    </div>
  );
};
```

---

## 11. TESTING DE FORMULARIOS {#testing}

### Testing Estratégico de Formularios

```javascript
// 1. Unit tests para validación
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserRegistrationForm } from './UserRegistrationForm';

describe('UserRegistrationForm', () => {
  beforeEach(() => {
    // Mock API calls
    global.fetch = jest.fn();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('Validation', () => {
    test('shows required field errors when submitted empty', async () => {
      const user = userEvent.setup();
      render(<UserRegistrationForm />);
  
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);
  
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });
  
    test('validates email format in real-time', async () => {
      const user = userEvent.setup();
      render(<UserRegistrationForm />);
  
      const emailInput = screen.getByLabelText(/email/i);
  
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur
  
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
  
      await user.clear(emailInput);
      await user.type(emailInput, 'user@example.com');
  
      await waitFor(() => {
        expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
      });
    });
  
    test('validates password strength', async () => {
      const user = userEvent.setup();
      render(<UserRegistrationForm />);
  
      const passwordInput = screen.getByLabelText(/^password$/i);
  
      await user.type(passwordInput, 'weak');
      expect(screen.getByText(/password too short/i)).toBeInTheDocument();
  
      await user.clear(passwordInput);
      await user.type(passwordInput, 'StrongP@ssw0rd');
  
      await waitFor(() => {
        expect(screen.queryByText(/password too short/i)).not.toBeInTheDocument();
      });
    });
  
    test('validates password confirmation', async () => {
      const user = userEvent.setup();
      render(<UserRegistrationForm />);
  
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
  
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmInput, 'DifferentPassword');
      await user.tab();
  
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });
  });
  
  describe('Async Validation', () => {
    test('checks email uniqueness', async () => {
      const user = userEvent.setup();
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exists: true })
      });
  
      render(<UserRegistrationForm />);
  
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'existing@example.com');
      await user.tab();
  
      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });
  
      expect(fetch).toHaveBeenCalledWith('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'existing@example.com' })
      });
    });
  
    test('handles API validation errors gracefully', async () => {
      const user = userEvent.setup();
  
      fetch.mockRejectedValueOnce(new Error('Network error'));
  
      render(<UserRegistrationForm />);
  
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      await user.tab();
  
      await waitFor(() => {
        expect(screen.getByText('Unable to verify email')).toBeInTheDocument();
      });
    });
  });
  
  describe('Form Submission', () => {
    test('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
  
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ exists: false })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', email: 'test@example.com' })
        });
  
      render(<UserRegistrationForm onSubmit={mockOnSubmit} />);
  
      // Fill out form
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'SecureP@ssw0rd');
      await user.type(screen.getByLabelText(/confirm password/i), 'SecureP@ssw0rd');
      await user.click(screen.getByLabelText(/agree to terms/i));
  
      await user.click(screen.getByRole('button', { name: /create account/i }));
  
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'SecureP@ssw0rd',
          confirmPassword: 'SecureP@ssw0rd',
          terms: true
        });
      });
    });
  
    test('prevents submission with invalid data', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
  
      render(<UserRegistrationForm onSubmit={mockOnSubmit} />);
  
      await user.click(screen.getByRole('button', { name: /create account/i }));
  
      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  
    test('shows loading state during submission', async () => {
      const user = userEvent.setup();
  
      // Mock slow API response
      fetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ id: '123' })
          }), 1000)
        )
      );
  
      render(<UserRegistrationForm />);
  
      // Fill valid form
      await fillValidForm(user);
  
      await user.click(screen.getByRole('button', { name: /create account/i }));
  
      expect(screen.getByText('Creating Account...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
    });
  });
  
  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', () => {
      render(<UserRegistrationForm />);
  
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('aria-required', 'true');
      expect(emailInput).toHaveAttribute('aria-describedby');
  
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });
  
    test('announces validation errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<UserRegistrationForm />);
  
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid');
      await user.tab();
  
      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toHaveTextContent('Invalid email format');
      });
    });
  
    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<UserRegistrationForm />);
  
      // Tab through form fields
      await user.tab();
      expect(screen.getByLabelText(/first name/i)).toHaveFocus();
  
      await user.tab();
      expect(screen.getByLabelText(/last name/i)).toHaveFocus();
  
      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();
    });
  });
});

// 2. Integration tests
describe('UserRegistrationForm Integration', () => {
  test('complete user journey', async () => {
    const user = userEvent.setup();
  
    // Mock successful API responses
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exists: false })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          id: '123', 
          email: 'john@example.com',
          token: 'abc123'
        })
      });
  
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate
    }));
  
    render(
      <AuthProvider>
        <UserRegistrationForm />
      </AuthProvider>
    );
  
    // Complete form
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /create account/i }));
  
    // Verify success state
    await waitFor(() => {
      expect(screen.getByText('Account created successfully!')).toBeInTheDocument();
    });
  
    // Verify redirect after delay
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 3000 });
  });
});

// 3. E2E tests con Playwright
// tests/e2e/registration.spec.js
import { test, expect } from '@playwright/test';

test.describe('User Registration E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });
  
  test('successful registration flow', async ({ page }) => {
    // Fill form
    await page.fill('[data-testid=first-name]', 'John');
    await page.fill('[data-testid=last-name]', 'Doe');
    await page.fill('[data-testid=email]', 'john.doe@example.com');
    await page.fill('[data-testid=password]', 'SecurePassword123!');
    await page.fill('[data-testid=confirm-password]', 'SecurePassword123!');
    await page.check('[data-testid=terms-checkbox]');
  
    // Submit form
    await page.click('[data-testid=submit-button]');
  
    // Verify success
    await expect(page.locator('[data-testid=success-message]')).toBeVisible();
  
    // Verify navigation
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome, John!');
  });
  
  test('validation error handling', async ({ page }) => {
    // Try to submit empty form
    await page.click('[data-testid=submit-button]');
  
    // Check validation errors
    await expect(page.locator('[data-testid=email-error]')).toContainText('Email is required');
    await expect(page.locator('[data-testid=password-error]')).toContainText('Password is required');
  
    // Fill invalid email
    await page.fill('[data-testid=email]', 'invalid-email');
    await page.blur('[data-testid=email]');
  
    await expect(page.locator('[data-testid=email-error]')).toContainText('Invalid email format');
  });
  
  test('responsive behavior', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
  
    // Check form layout
    const form = page.locator('[data-testid=registration-form]');
    await expect(form).toHaveCSS('display', 'block');
  
    // Check field stacking
    const firstNameField = page.locator('[data-testid=first-name]');
    const lastNameField = page.locator('[data-testid=last-name]');
  
    const firstNameBox = await firstNameField.boundingBox();
    const lastNameBox = await lastNameField.boundingBox();
  
    // Fields should stack vertically on mobile
    expect(lastNameBox.y).toBeGreaterThan(firstNameBox.y + firstNameBox.height);
  });
  
  test('performance metrics', async ({ page }) => {
    const startTime = Date.now();
  
    await page.goto('/register');
  
    // Measure time to interactive
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
  
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
  
    // Test form interaction performance
    const interactionStart = Date.now();
    await page.fill('[data-testid=email]', 'test@example.com');
    const interactionTime = Date.now() - interactionStart;
  
    expect(interactionTime).toBeLessThan(100); // Should respond in under 100ms
  });
});

// Helper functions
const fillValidForm = async (user) => {
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/^password$/i), 'SecureP@ssw0rd');
  await user.type(screen.getByLabelText(/confirm password/i), 'SecureP@ssw0rd');
  await user.click(screen.getByLabelText(/agree to terms/i));
};

// 4. Visual regression tests
// tests/visual/forms.spec.js
test('form visual consistency', async ({ page }) => {
  await page.goto('/register');
  
  // Wait for form to be fully loaded
  await page.waitForSelector('[data-testid=registration-form]');
  
  // Take screenshot of initial state
  await expect(page).toHaveScreenshot('registration-form-initial.png');
  
  // Fill form partially
  await page.fill('[data-testid=first-name]', 'John');
  await page.fill('[data-testid=email]', 'invalid-email');
  await page.blur('[data-testid=email]');
  
  // Take screenshot with validation errors
  await expect(page).toHaveScreenshot('registration-form-with-errors.png');
  
  // Test dark mode
  await page.click('[data-testid=theme-toggle]');
  await expect(page).toHaveScreenshot('registration-form-dark-mode.png');
});

// 5. Performance testing
const measureFormPerformance = async () => {
  const { performance } = window;
  
  performance.mark('form-start');
  
  // Simulate form interaction
  const input = document.querySelector('#email');
  const event = new Event('input', { bubbles: true });
  input.value = 'test@example.com';
  input.dispatchEvent(event);
  
  performance.mark('form-end');
  performance.measure('form-interaction', 'form-start', 'form-end');
  
  const measure = performance.getEntriesByName('form-interaction')[0];
  console.log(`Form interaction took ${measure.duration}ms`);
  
  return measure.duration;
};

// Load testing para formularios
const loadTestForm = async (concurrentUsers = 100) => {
  const promises = [];
  
  for (let i = 0; i < concurrentUsers; i++) {
    promises.push(
      fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `user${i}@example.com`,
          password: 'TestPassword123!',
          firstName: `User${i}`,
          lastName: 'Test'
        })
      })
    );
  }
  
  const startTime = Date.now();
  const results = await Promise.allSettled(promises);
  const endTime = Date.now();
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log({
    totalTime: endTime - startTime,
    successful,
    failed,
    successRate: (successful / concurrentUsers) * 100
  });
};
```

---

## 12. ACCESIBILIDAD Y MEJORES PRÁCTICAS {#accesibilidad}

### Formularios Accesibles Completos

```javascript
// 1. Componente de formulario con accesibilidad completa
const AccessibleRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    newsletter: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  
  // Ref para live region
  const liveRegionRef = useRef();
  
  // IDs únicos para asociaciones ARIA
  const formId = useId();
  const emailDescId = `${formId}-email-desc`;
  const passwordDescId = `${formId}-password-desc`;
  
  const validateField = (name, value) => {
    let error = '';
  
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) error = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        break;
      case 'dateOfBirth':
        if (!value) error = 'Date of birth is required';
        else {
          const age = new Date().getFullYear() - new Date(value).getFullYear();
          if (age < 13) error = 'You must be at least 13 years old';
        }
        break;
    }
  
    return error;
  };
  
  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleFieldBlur = (name, value) => {
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
  
      // Announce error to screen readers
      announce(`${name} field: ${error}`);
    }
  };
  
  const announce = (message) => {
    setAnnouncements(prev => [...prev, message]);
  
    // Clear announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 1000);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'newsletter') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      // Focus first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(`${formId}-${firstErrorField}`);
      if (errorElement) {
        errorElement.focus();
        announce(`Form submission failed. ${Object.keys(newErrors).length} errors found. Please review and correct the highlighted fields.`);
      }
      return;
    }
  
    setIsSubmitting(true);
    announce('Form is being submitted, please wait.');
  
    try {
      await submitRegistration(formData);
      announce('Registration successful! Redirecting to dashboard.');
  
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
  
    } catch (error) {
      announce('Registration failed. Please try again or contact support.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="accessible-form-container">
  
      {/* Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
  
      {/* Live Region for Announcements */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>
  
      <main id="main-content">
        <div className="form-header">
          <h1>Create Your Account</h1>
          <p>
            All fields marked with an asterisk (*) are required.
            If you need assistance, please call our support line at 
            <a href="tel:+15551234567">+1 (555) 123-4567</a>.
          </p>
        </div>
    
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby="form-title"
          aria-describedby="form-description"
        >
      
          <fieldset>
            <legend>Personal Information</legend>
        
            <div className="form-row">
              <AccessibleFormField
                id={`${formId}-firstName`}
                name="firstName"
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(value) => handleFieldChange('firstName', value)}
                onBlur={(value) => handleFieldBlur('firstName', value)}
                error={errors.firstName}
                required
                autoComplete="given-name"
              />
          
              <AccessibleFormField
                id={`${formId}-lastName`}
                name="lastName"
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(value) => handleFieldChange('lastName', value)}
                onBlur={(value) => handleFieldBlur('lastName', value)}
                error={errors.lastName}
                required
                autoComplete="family-name"
              />
            </div>
        
            <AccessibleFormField
              id={`${formId}-email`}
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => handleFieldChange('email', value)}
              onBlur={(value) => handleFieldBlur('email', value)}
              error={errors.email}
              required
              autoComplete="email"
              describedBy={emailDescId}
              description="We'll use this email to send you account notifications and updates."
            />
        
            <AccessibleFormField
              id={`${formId}-dateOfBirth`}
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(value) => handleFieldChange('dateOfBirth', value)}
              onBlur={(value) => handleFieldBlur('dateOfBirth', value)}
              error={errors.dateOfBirth}
              required
              autoComplete="bday"
              max={new Date().toISOString().split('T')[0]}
            />
          </fieldset>
      
          <fieldset>
            <legend>Account Security</legend>
        
            <AccessibleFormField
              id={`${formId}-password`}
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => handleFieldChange('password', value)}
              onBlur={(value) => handleFieldBlur('password', value)}
              error={errors.password}
              required
              autoComplete="new-password"
              describedBy={passwordDescId}
              description="Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
            />
        
            {formData.password && (
              <PasswordStrengthMeter 
                password={formData.password}
                id={`${formId}-password-strength`}
              />
            )}
          </fieldset>
      
          <fieldset>
            <legend>Preferences</legend>
        
            <div className="checkbox-field">
              <input
                type="checkbox"
                id={`${formId}-newsletter`}
                checked={formData.newsletter}
                onChange={(e) => handleFieldChange('newsletter', e.target.checked)}
                aria-describedby={`${formId}-newsletter-desc`}
              />
              <label htmlFor={`${formId}-newsletter`}>
                Subscribe to our newsletter
              </label>
              <div id={`${formId}-newsletter-desc`} className="field-description">
                Get weekly updates about new features and special offers. 
                You can unsubscribe at any time.
              </div>
            </div>
          </fieldset>
      
          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-describedby={isSubmitting ? `${formId}-submit-status` : undefined}
              className="submit-button"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
        
            {isSubmitting && (
              <div id={`${formId}-submit-status`} aria-live="polite">
                Please wait while we create your account.
              </div>
            )}
          </div>
        </form>
    
        <div className="form-footer">
          <p>
            Already have an account? <a href="/login">Sign in here</a>.
          </p>
          <p>
            By creating an account, you agree to our{' '}
            <a href="/terms">Terms of Service</a> and{' '}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
};

// 2. Componente de campo accesible reutilizable
const AccessibleFormField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  autoComplete,
  describedBy,
  description,
  placeholder,
  ...props
}) => {
  const errorId = `${id}-error`;
  const descId = `${id}-desc`;
  
  const ariaDescribedBy = [
    description && descId,
    error && errorId,
    describedBy
  ].filter(Boolean).join(' ') || undefined;
  
  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span className="required-indicator" aria-label="required">
            *
          </span>
        )}
      </label>
  
      {description && (
        <div id={descId} className="field-description">
          {description}
        </div>
      )}
  
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        aria-describedby={ariaDescribedBy}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="field-input"
        {...props}
      />
  
      {error && (
        <div id={errorId} className="field-error" role="alert">
          <span className="error-icon" aria-hidden="true">⚠</span>
          {error}
        </div>
      )}
    </div>
  );
};

// 3. Medidor de fortaleza de contraseña accesible
const PasswordStrengthMeter = ({ password, id }) => {
  const getStrength = () => {
    let score = 0;
    const checks = [
      { test: /.{8,}/, label: 'At least 8 characters' },
      { test: /[a-z]/, label: 'Contains lowercase letter' },
      { test: /[A-Z]/, label: 'Contains uppercase letter' },
      { test: /\d/, label: 'Contains number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/, label: 'Contains special character' }
    ];
  
    const passedChecks = checks.filter(check => check.test.test(password));
    score = passedChecks.length;
  
    return {
      score,
      checks,
      passedChecks,
      strength: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong'
    };
  };
  
  const { score, checks, passedChecks, strength } = getStrength();
  const strengthPercentage = (score / checks.length) * 100;
  
  return (
    <div className="password-strength-meter" aria-labelledby={`${id}-label`}>
      <div id={`${id}-label`} className="strength-label">
        Password strength: <span className={`strength-${strength}`}>{strength}</span>
      </div>
  
      <div
        className="strength-bar"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={checks.length}
        aria-valuetext={`${score} of ${checks.length} requirements met`}
      >
        <div
          className={`strength-fill strength-${strength}`}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>
  
      <ul className="strength-requirements" aria-label="Password requirements">
        {checks.map((check, index) => {
          const passed = passedChecks.includes(check);
          return (
            <li
              key={index}
              className={`requirement ${passed ? 'passed' : 'failed'}`}
              aria-label={`${check.label}: ${passed ? 'satisfied' : 'not satisfied'}`}
            >
              <span className="requirement-icon" aria-hidden="true">
                {passed ? '✓' : '○'}
              </span>
              {check.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// 4. Hook para navegación por teclado
const useKeyboardNavigation = (formRef) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!formRef.current) return;
  
      const focusableElements = formRef.current.querySelectorAll(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      );
  
      const focusedIndex = Array.from(focusableElements).indexOf(document.activeElement);
  
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = Math.min(focusedIndex + 1, focusableElements.length - 1);
          focusableElements[nextIndex]?.focus();
          break;
      
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = Math.max(focusedIndex - 1, 0);
          focusableElements[prevIndex]?.focus();
          break;
      
        case 'Home':
          if (e.ctrlKey) {
            e.preventDefault();
            focusableElements[0]?.focus();
          }
          break;
      
        case 'End':
          if (e.ctrlKey) {
            e.preventDefault();
            focusableElements[focusableElements.length - 1]?.focus();
          }
          break;
      }
    };
  
    const form = formRef.current;
    form?.addEventListener('keydown', handleKeyDown);
  
    return () => {
      form?.removeEventListener('keydown', handleKeyDown);
    };
  }, [formRef]);
};

// 5. Hook para anuncios a lectores de pantalla
const useScreenReaderAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const liveRegionRef = useRef();
  
  const announce = useCallback((message, priority = 'polite') => {
    const announcement = {
      id: Date.now(),
      message,
      priority
    };
  
    setAnnouncements(prev => [...prev, announcement]);
  
    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
    }, 1000);
  }, []);
  
  const announceFormError = useCallback((fieldName, error) => {
    announce(`${fieldName} field has an error: ${error}`, 'assertive');
  }, [announce]);
  
  const announceFormSuccess = useCallback((message) => {
    announce(message, 'assertive');
  }, [announce]);
  
  return {
    announcements,
    announce,
    announceFormError,
    announceFormSuccess,
    liveRegionRef
  };
};
```

### CSS para Accesibilidad

```css
/* Utilidades de accesibilidad */
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}

/* Estados de foco visibles */
.field-input:focus,
.submit-button:focus,
a:focus {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

/* Indicadores de error accesibles */
.has-error .field-input {
  border-color: #dc3545;
  background-color: #fff5f5;
}

.field-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

/* Indicador de campo requerido */
.required-indicator {
  color: #dc3545;
  margin-left: 0.25rem;
  font-weight: bold;
}

/* Fieldsets accesibles */
fieldset {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

legend {
  font-weight: 600;
  padding: 0 0.5rem;
  font-size: 1.125rem;
}

/* Password strength meter accesible */
.password-strength-meter {
  margin-top: 0.5rem;
}

.strength-bar {
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-weak { background-color: #dc3545; }
.strength-medium { background-color: #ffc107; }
.strength-strong { background-color: #28a745; }

.strength-requirements {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.requirement.passed {
  color: #28a745;
}

.requirement.failed {
  color: #6c757d;
}

/* Estados de carga accesibles */
.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-button[aria-describedby] {
  position: relative;
}

/* Modo de alto contraste */
@media (prefers-contrast: high) {
  .field-input {
    border-width: 2px;
  }
  
  .field-input:focus {
    outline-width: 3px;
  }
  
  .has-error .field-input {
    border-width: 3px;
  }
}

/* Reducir movimiento para usuarios sensibles */
@media (prefers-reduced-motion: reduce) {
  .strength-fill,
  .submit-button,
  .field-input {
    transition: none;
  }
}

/* Modo oscuro accesible */
@media (prefers-color-scheme: dark) {
  .field-input {
    background: #1a1a1a;
    border-color: #444;
    color: #fff;
  }
  
  .field-input:focus {
    border-color: #4da6ff;
    box-shadow: 0 0 0 4px rgba(77, 166, 255, 0.1);
  }
  
  .field-error {
    color: #ff6b6b;
  }
  
  fieldset {
    border-color: #444;
  }
  
  legend {
    color: #fff;
  }
}
```

---

## 13. PLAN DE DESARROLLO DEL EXPERTO {#desarrollo}

### Roadmap de 6 Meses para Dominio Completo

#### Mes 1-2: Fundamentos Sólidos

**Semana 1-2: Bases de Formularios**

* Dominar controlled vs uncontrolled components
* Implementar validación básica con useState
* Crear 5 formularios simples (login, registro, contacto, newsletter, feedback)
* Practicar manejo de eventos y estado

**Proyectos Prácticos:**

```javascript
// Proyecto 1: Formulario de Login Completo
- Validación en tiempo real
- Manejo de errores de API
- Estados de carga
- Recordar credenciales
- Recuperación de contraseña

// Proyecto 2: Formulario de Contacto Avanzado
- Validación multi-nivel
- Upload de archivos
- Vista previa de datos
- Envío con confirmación
```

**Semana 3-4: Estado y Validación**

* Implementar useReducer para formularios complejos
* Crear sistema de validación personalizado
* Dominar patrones de composición de componentes
* Optimizar re-renders con React.memo

**Evaluación Mes 1-2:**

* [ ]  Formularios funcionales sin bibliotecas externas
* [ ]  Validación sincrónica y asincrónica
* [ ]  Manejo correcto de estado y eventos
* [ ]  Componentes reutilizables
* [ ]  UX básica implementada

#### Mes 3: Herramientas Profesionales

**Semana 1-2: React Hook Form**

* Migrar proyectos anteriores a RHF
* Dominar useController y useFieldArray
* Implementar validación con Zod/Yup
* Performance optimization con RHF

**Semana 3-4: Formik y Alternativas**

* Comparar Formik vs RHF
* Implementar mismo formulario en ambas bibliotecas
* Decidir cuándo usar cada herramienta
* Crear formularios multi-paso complejos

**Proyecto Principal Mes 3:**

```javascript
// E-commerce Checkout Form
- Multi-step (5 pasos)
- Validación condicional
- Integración con APIs de pago
- Cálculo de precios en tiempo real
- Manejo de cupones y descuentos
- Selección de direcciones múltiples
```

#### Mes 4: React Native y Mobile

**Semana 1-2: Fundamentos Mobile**

* Adaptar formularios web a React Native
* Manejo de teclado virtual
* Navegación entre campos
* Validación táctil

**Semana 3-4: UX Mobile Avanzada**

* Formularios adaptativos
* Gestos y micro-interacciones
* Optimización de performance
* Testing en dispositivos reales

**Proyecto Principal Mes 4:**

```javascript
// App de Onboarding Completa
- 7 pantallas de registro
- Verificación de teléfono/email
- Upload de documentos con cámara
- Biometría opcional
- Sincronización offline
```

#### Mes 5: Casos Reales y Optimización

**Semana 1-2: Formularios Empresariales**

* CRM lead capture
* Formularios de HR
* Surveys y feedback
* Configuración de productos

**Semana 3-4: Performance y Escalabilidad**

* Virtual scrolling para forms largos
* Lazy loading de campos
* Optimización de bundle size
* Caching inteligente

**Proyecto Principal Mes 5:**

```javascript
// Sistema CRM Completo
- Lead capture multi-canal
- Pipeline de ventas
- Formularios dinámicos
- Reportes y analytics
- Integración con múltiples APIs
```

#### Mes 6: Maestría y Contribución

**Semana 1-2: Accesibilidad y Testing**

* WCAG 2.1 AA compliance
* Screen reader optimization
* Testing automatizado completo
* Cross-browser compatibility

**Semana 3-4: Innovación y Liderazgo**

* Crear biblioteca de formularios propia
* Contribuir a proyectos open source
* Mentorear otros desarrolladores
* Documentar mejores prácticas

**Proyecto Final:**

```javascript
// Framework de Formularios Personalizado
- Builder visual de formularios
- Temas y personalización
- Plugins y extensiones
- Documentación completa
- Casos de uso reales
```

### Evaluación por Competencias

#### Nivel Básico (Mes 1-2)

**Competencias Técnicas:**

* [ ]  Manejo fluido de controlled/uncontrolled
* [ ]  Validación sincrónica efectiva
* [ ]  Estado de formularios organizado
* [ ]  Componentes básicos reutilizables
* [ ]  Eventos y lifecycle correctos

**Competencias UX:**

* [ ]  Feedback visual apropiado
* [ ]  Estados de carga implementados
* [ ]  Mensajes de error claros
* [ ]  Navegación por teclado básica

#### Nivel Intermedio (Mes 3-4)

**Competencias Técnicas:**

* [ ]  Dominio de React Hook Form o Formik
* [ ]  Validación asincrónica robusta
* [ ]  Formularios multi-paso complejos
* [ ]  Optimización de performance
* [ ]  Integración con APIs reales

**Competencias UX:**

* [ ]  Micro-interacciones implementadas
* [ ]  Responsive design completo
* [ ]  Accesibilidad básica
* [ ]  Mobile-first approach

#### Nivel Avanzado (Mes 5-6)

**Competencias Técnicas:**

* [ ]  Arquitectura escalable de formularios
* [ ]  Testing automatizado completo
* [ ]  Performance optimization avanzada
* [ ]  Contribución a bibliotecas

**Competencias UX:**

* [ ]  WCAG 2.1 AA compliance
* [ ]  Usabilidad avanzada
* [ ]  Analytics e insights
* [ ]  A/B testing implementation

### Recursos de Aprendizaje Continuo

**Documentación Oficial:**

* React Hook Form docs
* Formik documentation
* React Native forms guide
* Web Accessibility Guidelines

**Cursos Recomendados:**

* "Complete React Developer" - Zero to Mastery
* "React Native - The Practical Guide" - Maximilian Schwarzmüller
* "Web Accessibility" - Google/Udacity
* "Advanced React Patterns" - Kent C. Dodds

**Comunidades y Recursos:**

* React Hook Form Discord
* Stack Overflow (react-forms tag)
* GitHub issues de bibliotecas populares
* Dev.to articles sobre formularios

**Práctica Continua:**

* Codeandbox experiments
* Personal projects portfolio
* Open source contributions
* Code reviews y feedback

### Certificaciones y Validación

**Portfolio Requerido:**

1. **Formulario Básico** - Login/Registro
2. **Formulario Complejo** - E-commerce checkout
3. **Formulario Mobile** - React Native app
4. **Formulario Accesible** - WCAG compliant
5. **Formulario Innovador** - Característica única

**Métricas de Éxito:**

* Conversion rate > 15% improvement
* Performance score > 90 Lighthouse
* Accessibility score > 95 axe-core
* User satisfaction > 4.5/5 stars
* Code review approval rating > 90%

---

## 14. REFLEXIÓN FINAL {#reflexion}

Al completar esta masterclass, has transitado de ser un desarrollador que simplemente implementa formularios a convertirte en un arquitecto de experiencias de usuario que entiende profundamente la psicología, tecnología y arte detrás de la captura efectiva de información.

### La Transformación Invisible

Esta maestría en formularios representa mucho más que dominio técnico. Has desarrollado una sensibilidad única hacia uno de los puntos de contacto más críticos entre humanos y tecnología. Cada formulario que diseñes ahora será un puente cuidadosamente construido entre la intención del usuario y la funcionalidad del sistema.

**Antes de esta masterclass**, probablemente veías los formularios como elementos funcionales necesarios. **Ahora** los ves como ecosistemas complejos donde convergen psicología cognitiva, arquitectura de información, diseño de interacción, ingeniería de software y accesibilidad universal.

### El Poder de la Empatía Técnica

Has aprendido que el código más elegante es inútil si frustra al usuario. Tu nueva perspectiva te permite:

* **Anticipar comportamientos** antes de que sucedan
* **Diseñar para casos extremos** que otros desarrolladores ignoran
* **Crear experiencias inclusivas** que funcionan para todos los usuarios
* **Optimizar conversiones** mediante pequeños ajustes científicamente informados

Esta empatía técnica te convierte en un profesional más valioso porque puedes traducir necesidades de negocio en experiencias de usuario excepcionales.

### La Maestría en Contexto

Dominar formularios te ha enseñado principios que trascienden esta disciplina específica:

**Gestión de Estado Complejo**: Los patrones que has aprendido para manejar estado de formularios se aplican a cualquier aplicación React compleja.

**Arquitectura de Componentes**: La composición y reutilización de componentes de formulario te ha enseñado a pensar en sistemas, no en piezas aisladas.

**Performance Optimization**: Las técnicas de optimización que has dominado (debouncing, memoización, virtual scrolling) son fundamentales para cualquier aplicación web moderna.

**Testing Estratégico**: El testing de formularios te ha enseñado a pensar en flujos de usuario completos, no solo en funciones aisladas.

### La Responsabilidad del Experto

Con esta expertise viene una responsabilidad significativa. Los formularios son a menudo el momento más vulnerable en la interacción de un usuario con una aplicación: cuando comparten información personal, realizan transacciones financieras, o toman decisiones importantes.

Tu código ahora tiene el poder de:

* **Proteger la privacidad** mediante implementaciones seguras
* **Reducir la fricción** en momentos críticos del usuario
* **Incluir a personas con discapacidades** en experiencias digitales
* **Incrementar conversiones** que impactan directamente el éxito del negocio

### La Evolución Continua

El ecosistema de formularios web está en constante evolución:

**Nuevas APIs del navegador** como Web Components y Progressive Web Apps están cambiando las posibilidades.

**Inteligencia Artificial** comenzará a influir en auto-completado inteligente, validación predictiva y personalización dinámica.

**Interfaces conversacionales** están difuminando la línea entre formularios tradicionales y chat bots.

**Realidad aumentada y virtual** creará nuevos paradigmas de captura de información.

Tu expertise actual te posiciona para liderar estas transformaciones en lugar de simplemente reaccionar a ellas.

### El Impacto Multiplicador

Como experto en formularios, tu impacto se multiplica a través de:

**Código que educas**: Cada formulario bien implementado que creas se convierte en un ejemplo para otros desarrolladores.

**Estándares que estableces**: Tus implementaciones influyen en las expectativas de diseñadores, product managers y otros stakeholders.

**Usuarios que empoderas**: Cada experiencia de formulario excepcional que creates aumenta la confianza del usuario en la tecnología digital.

**Desarrolladores que mentoras**: Tu conocimiento se multiplica a través de cada persona que educas en estas prácticas.

### La Filosofía del Formulario Perfecto

A través de esta masterclass, has desarrollado una filosofía implícita sobre lo que constituye un formulario perfecto:

* **Invisible cuando funciona bien**: Los mejores formularios se sienten naturales e intuitivos
* **Forgiving cuando algo sale mal**: Errores manejados con gracia y opciones de recuperación claras
* **Accessible por diseño**: Funciona para todos los usuarios, no como una consideración posterior
* **Performance-conscious**: Responde instantáneamente sin sacrificar funcionalidad
* **Privacy-respecting**: Protege la información del usuario como si fuera propia

### El Futuro de tu Expertise

Esta masterclass es un punto de partida, no una culminación. Tu expertise en formularios te abre puertas hacia:

**Especialización en UX Engineering**: Puente entre diseño y desarrollo **Arquitectura de Frontend**: Diseñar sistemas escalables para equipos grandes **Accesibilidad Digital**: Líderar iniciativas de inclusión tecnológica **Performance Engineering**: Optimizar experiencias para millones de usuarios **Product Leadership**: Influir en decisiones de producto desde una perspectiva técnica profunda

### La Satisfacción del Craftsperson

Hay una satisfacción profunda en dominar algo tan fundamental como los formularios web. Cada vez que un usuario completa exitosamente un formulario que has creado - ya sea registrándose para un servicio, realizando una compra, o simplemente contactando con una empresa - has facilitado un momento de conexión humana a través de la tecnología.

### El Llamado a la Excelencia

Tu journey hacia la maestría en formularios refleja un commitment más profundo hacia la excelencia en el desarrollo de software. Has demostrado que estás dispuesto a profundizar en los detalles, dominar las complejidades, y nunca conformarte con "suficientemente bueno".

Esta mentalidad te llevará lejos más allá de los formularios. Es la diferencia entre desarrolladores que simplemente implementan features y aquellos que crean experiencias que realmente importan.

### La Invitación Final

Ahora tienes las herramientas, el conocimiento y la perspectiva para crear formularios que no solo funcionan, sino que deleitan. Cada proyecto es una oportunidad para aplicar y refinar tu expertise.

Pero más importante aún, tienes la responsabilidad de elevar el estándar de la industria. En un mundo donde la mayoría de los formularios web son frustrantes, lentos, inaccesibles o inseguros, tu expertise te convierte en parte de la solución.

**No te conformes con formularios que simplemente funcionan. Crea formularios que inspiren.**

**Tu próximo formulario podría ser la experiencia que convierte a un usuario escéptico en un cliente leal, que permite a una persona con discapacidad acceder a un servicio esencial, o que hace posible una transacción que cambia una vida.**

**El dominio de los formularios es el dominio de los momentos que importan. Úsalo sabiamente.**

---

*"La excelencia en los formularios no está en lo que añades, sino en lo que eliminas. No en lo complejo que puedes hacer, sino en lo simple que puedes mantener. No en impresionar con tu código, sino en desaparecer para que brille la experiencia del usuario."*

\*\*¡Felicitaciones por completar tu journey hacia la maestría en formularios React y React Native!\*\*dateField]);

const handleSubmit = useCallback(async (e) => { e?.preventDefault(); setIsSubmitting(true);

```
try {
  // Validar todo el formulario
  await validationSchema.validate(values, { abortEarly: false });
  await onSubmit(values);
} catch (error) {
  if (error.inner) {
    const fieldErrors = {};
    error.inner.forEach(err => {
      fieldErrors[err.path] = err.message;
    });
    setErrors(fieldErrors);
  }
} finally {
  setIsSubmitting(false);
}
```

}, [values, vali
