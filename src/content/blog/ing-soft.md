---
title: 'Análisis e Ingeniería de Software'
code: 'software'
description: 'De Desarrollador a Ingeniero: Guía Completa para Construir Software de Clase Mundial'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Masterclass de Análisis e Ingeniería de Software

## De Desarrollador a Ingeniero: Guía Completa para Construir Software de Clase Mundial

---

## 🎯 Introducción: La Diferencia Entre Programar y Hacer Ingeniería

Programar es como escribir oraciones. Hacer ingeniería de software es como escribir novelas épicas que perduran en el tiempo. La diferencia no está en el lenguaje que usas, sino en cómo piensas, planificas y construyes sistemas que escalan, evolucionan y resuelven problemas reales.

Esta masterclass te transformará de alguien que escribe código a alguien que diseña soluciones.

---

## 1. 🧭 Fundamentos de la Ingeniería de Software

### La Ingeniería como Disciplina

**Analogía**: Si el desarrollo de software fuera como construir edificios, la ingeniería de software es la diferencia entre ser un albañil (que pone ladrillos) y ser un arquitecto (que diseña ciudades enteras).

### Los Pilares Fundamentales:

```
1. CORRECCIÓN → ¿Hace lo que debe hacer?
2. CONFIABILIDAD → ¿Funciona cuando debe funcionar?
3. EFICIENCIA → ¿Usa los recursos apropiadamente?
4. USABILIDAD → ¿Es fácil de usar?
5. MANTENIBILIDAD → ¿Es fácil de cambiar?
6. ESCALABILIDAD → ¿Crece con las necesidades?
```

### El Ciclo de Vida del Software - Visión Práctica:

```python
# Ejemplo: Evolución de un sistema de autenticación
# Versión 1.0 - MVP
def login(username, password):
    return username == "admin" and password == "123"

# Versión 2.0 - Base de datos
def login(username, password):
    user = database.find_user(username)
    return user and user.password == hash(password)

# Versión 3.0 - Seguridad mejorada
def login(username, password):
    user = database.find_user(username)
    if not user:
        return False
  
    # Rate limiting
    if security.is_rate_limited(username):
        raise TooManyAttemptsError()
  
    # Secure password verification
    if not security.verify_password(password, user.password_hash):
        security.log_failed_attempt(username)
        return False
  
    # Two-factor authentication
    if user.has_2fa_enabled():
        return {"status": "2fa_required", "user_id": user.id}
  
    return {"status": "success", "token": jwt.create_token(user)}

# Versión 4.0 - Microservicios
class AuthenticationService:
    def __init__(self, user_service, security_service, notification_service):
        self.user_service = user_service
        self.security_service = security_service
        self.notification_service = notification_service
  
    async def authenticate(self, credentials):
        # Implementación distribuida con manejo de errores,
        # logging, métricas, circuit breakers, etc.
        pass
```

---

## 2. 📋 Análisis de Requerimientos: El Arte de Entender Problemas

### Tipos de Requerimientos

**Analogía**: Los requerimientos son como los planos de una casa. Los funcionales dicen "necesito una cocina", los no funcionales dicen "que sea moderna, eficiente y para 50 personas".

### Requerimientos Funcionales vs No Funcionales:

```yaml
# Ejemplo: Sistema de E-commerce
requerimientos_funcionales:
  - usuario_puede_registrarse
  - usuario_puede_buscar_productos
  - usuario_puede_agregar_al_carrito
  - usuario_puede_realizar_pago
  - admin_puede_gestionar_inventario

requerimientos_no_funcionales:
  - rendimiento:
      tiempo_respuesta_max: "2 segundos"
      usuarios_concurrentes: 10000
  - seguridad:
      encriptacion: "AES-256"
      autenticacion: "OAuth 2.0"
  - disponibilidad: "99.9% uptime"
  - escalabilidad: "horizontal scaling"
  - usabilidad: "responsive design"
```

### Técnicas de Captura de Requerimientos:

#### 1. Historias de Usuario (User Stories)

```gherkin
# Formato: Como [rol], quiero [funcionalidad] para [beneficio]

Feature: Búsqueda de productos
  Como un comprador online
  Quiero buscar productos por categoría y precio
  Para encontrar exactamente lo que necesito

  Scenario: Búsqueda exitosa
    Given que estoy en la página principal
    When busco "laptop" con precio máximo de $1000
    Then veo una lista de laptops bajo $1000
    And puedo ordenar por precio o popularidad

  Scenario: Sin resultados
    Given que estoy en la página de búsqueda
    When busco "producto_inexistente"
    Then veo un mensaje "No se encontraron resultados"
    And veo productos relacionados como alternativa
```

#### 2. Casos de Uso Detallados

```
CASO DE USO: Procesar Pago
Actor Principal: Cliente
Precondiciones: 
  - Cliente autenticado
  - Carrito no vacío
  - Método de pago configurado

Flujo Principal:
1. Cliente selecciona "Proceder al pago"
2. Sistema muestra resumen del pedido
3. Cliente confirma información de envío
4. Cliente selecciona método de pago
5. Sistema procesa el pago
6. Sistema confirma la transacción
7. Sistema envía email de confirmación

Flujos Alternativos:
5a. Pago rechazado
  5a.1 Sistema muestra mensaje de error
  5a.2 Sistema sugiere método alternativo
  5a.3 Retorna al paso 4

Postcondiciones:
- Pedido creado en el sistema
- Inventario actualizado
- Email de confirmación enviado
```

### Herramientas para Análisis de Requerimientos:

```python
# requirements_analyzer.py
class RequirementAnalyzer:
    def __init__(self):
        self.functional_reqs = []
        self.non_functional_reqs = {}
        self.stakeholders = []
  
    def capture_user_story(self, role, action, benefit):
        story = {
            "role": role,
            "action": action,
            "benefit": benefit,
            "acceptance_criteria": [],
            "priority": None,
            "estimate": None
        }
        return story
  
    def analyze_complexity(self, requirement):
        """Estima complejidad usando criterios objetivos"""
        factors = {
            "integration_points": len(requirement.get("integrations", [])),
            "business_rules": len(requirement.get("rules", [])),
            "ui_complexity": requirement.get("ui_complexity", 1),
            "data_complexity": requirement.get("data_complexity", 1)
        }
      
        complexity_score = sum(factors.values())
      
        if complexity_score <= 5:
            return "Simple"
        elif complexity_score <= 10:
            return "Moderado"
        else:
            return "Complejo"
  
    def generate_test_scenarios(self, user_story):
        """Genera automáticamente escenarios de prueba"""
        scenarios = [
            f"Happy path: {user_story['action']} completes successfully",
            f"Error case: {user_story['action']} fails due to validation",
            f"Edge case: {user_story['action']} with boundary values"
        ]
        return scenarios
```

---

## 3. 🏗️ Arquitectura de Software: Diseñando para el Futuro

### Principios Arquitectónicos Fundamentales

**Analogía**: La arquitectura de software es como el diseño de una ciudad. Necesitas barrios (módulos), calles (interfaces), servicios públicos (infraestructura) y un plan maestro que permita crecimiento futuro.

### 1. Separación de Responsabilidades (SoC)

```python
# MAL: Todo mezclado
class UserController:
    def register_user(self, user_data):
        # Validación
        if not user_data.get("email"):
            return {"error": "Email required"}
      
        # Lógica de negocio
        password_hash = bcrypt.hashpw(user_data["password"])
      
        # Acceso a datos
        connection = mysql.connect("localhost", "user", "pass", "db")
        cursor = connection.cursor()
        cursor.execute("INSERT INTO users...", user_data)
      
        # Notificación
        smtp_server = smtplib.SMTP('smtp.gmail.com', 587)
        smtp_server.send_email(user_data["email"], "Welcome!")
      
        return {"status": "success"}

# BIEN: Responsabilidades separadas
class UserController:
    def __init__(self, user_service, notification_service):
        self.user_service = user_service
        self.notification_service = notification_service
  
    def register_user(self, user_data):
        try:
            # Solo orquestación
            user = self.user_service.create_user(user_data)
            self.notification_service.send_welcome_email(user)
            return {"status": "success", "user_id": user.id}
        except ValidationError as e:
            return {"error": str(e)}

class UserService:
    def __init__(self, user_repository, password_service):
        self.user_repository = user_repository
        self.password_service = password_service
  
    def create_user(self, user_data):
        # Solo lógica de negocio
        self._validate_user_data(user_data)
        user_data["password"] = self.password_service.hash(user_data["password"])
        return self.user_repository.save(user_data)
```

### 2. Inversión de Dependencias (DI)

```python
# Interfaces (Contratos)
from abc import ABC, abstractmethod

class EmailService(ABC):
    @abstractmethod
    def send_email(self, to: str, subject: str, body: str) -> bool:
        pass

class UserRepository(ABC):
    @abstractmethod
    def save(self, user: dict) -> User:
        pass
  
    @abstractmethod
    def find_by_email(self, email: str) -> User:
        pass

# Implementaciones concretas
class GmailService(EmailService):
    def send_email(self, to: str, subject: str, body: str) -> bool:
        # Implementación específica de Gmail
        pass

class SendGridService(EmailService):
    def send_email(self, to: str, subject: str, body: str) -> bool:
        # Implementación específica de SendGrid
        pass

class MySQLUserRepository(UserRepository):
    def save(self, user: dict) -> User:
        # Implementación específica de MySQL
        pass

# Configuración de dependencias
class DIContainer:
    def __init__(self):
        self._services = {}
  
    def register(self, interface, implementation):
        self._services[interface] = implementation
  
    def get(self, interface):
        return self._services[interface]

# Uso
container = DIContainer()
container.register(EmailService, GmailService())
container.register(UserRepository, MySQLUserRepository())

user_service = UserService(
    container.get(UserRepository),
    container.get(PasswordService)
)
```

### 3. Patrones Arquitectónicos Esenciales

#### A. Arquitectura en Capas (Layered Architecture)

```
┌─────────────────────┐
│   Presentation      │ ← Controllers, APIs, UI
├─────────────────────┤
│   Application       │ ← Use Cases, Orchestration
├─────────────────────┤
│   Domain/Business   │ ← Business Logic, Entities
├─────────────────────┤
│   Infrastructure    │ ← Database, External APIs
└─────────────────────┘
```

#### B. Arquitectura Hexagonal (Ports & Adapters)

```python
# Puerto (Interfaz)
class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount: float, card_info: dict) -> PaymentResult:
        pass

# Adaptadores (Implementaciones)
class StripeAdapter(PaymentProcessor):
    def process_payment(self, amount: float, card_info: dict) -> PaymentResult:
        # Lógica específica de Stripe
        pass

class PayPalAdapter(PaymentProcessor):
    def process_payment(self, amount: float, card_info: dict) -> PaymentResult:
        # Lógica específica de PayPal
        pass

# Núcleo del dominio (independiente de adaptadores)
class OrderService:
    def __init__(self, payment_processor: PaymentProcessor):
        self.payment_processor = payment_processor
  
    def process_order(self, order: Order):
        # Lógica de negocio pura
        if self.payment_processor.process_payment(order.total, order.payment_info):
            order.mark_as_paid()
            return order
        else:
            raise PaymentFailedException()
```

#### C. Event-Driven Architecture

```python
# Sistema de eventos
class EventBus:
    def __init__(self):
        self._handlers = {}
  
    def subscribe(self, event_type, handler):
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
  
    def publish(self, event):
        event_type = type(event).__name__
        if event_type in self._handlers:
            for handler in self._handlers[event_type]:
                handler(event)

# Eventos
class UserRegistered:
    def __init__(self, user_id, email):
        self.user_id = user_id
        self.email = email
        self.timestamp = datetime.now()

class OrderCompleted:
    def __init__(self, order_id, user_id, total):
        self.order_id = order_id
        self.user_id = user_id
        self.total = total
        self.timestamp = datetime.now()

# Handlers
class EmailNotificationHandler:
    def __init__(self, email_service):
        self.email_service = email_service
  
    def handle_user_registered(self, event: UserRegistered):
        self.email_service.send_welcome_email(event.email)
  
    def handle_order_completed(self, event: OrderCompleted):
        self.email_service.send_order_confirmation(event.user_id, event.order_id)

# Configuración
event_bus = EventBus()
email_handler = EmailNotificationHandler(email_service)

event_bus.subscribe("UserRegistered", email_handler.handle_user_registered)
event_bus.subscribe("OrderCompleted", email_handler.handle_order_completed)

# Uso
user_service.register_user(user_data)
event_bus.publish(UserRegistered(user.id, user.email))
```

---

## 4. 🎨 Patrones de Diseño: Soluciones Elegantes a Problemas Comunes

### Patrones Creacionales

#### 1. Factory Pattern - Creando objetos sin especificar clases exactas

```python
class DatabaseConnectionFactory:
    @staticmethod
    def create_connection(db_type: str, config: dict):
        if db_type == "mysql":
            return MySQLConnection(config)
        elif db_type == "postgresql":
            return PostgreSQLConnection(config)
        elif db_type == "mongodb":
            return MongoDBConnection(config)
        else:
            raise ValueError(f"Unsupported database type: {db_type}")

# Uso
config = {"host": "localhost", "port": 5432, "database": "myapp"}
db = DatabaseConnectionFactory.create_connection("postgresql", config)
```

#### 2. Builder Pattern - Construyendo objetos complejos paso a paso

```python
class QueryBuilder:
    def __init__(self):
        self._query = {
            "select": [],
            "from": None,
            "where": [],
            "order_by": [],
            "limit": None
        }
  
    def select(self, *fields):
        self._query["select"].extend(fields)
        return self
  
    def from_table(self, table):
        self._query["from"] = table
        return self
  
    def where(self, condition):
        self._query["where"].append(condition)
        return self
  
    def order_by(self, field, direction="ASC"):
        self._query["order_by"].append(f"{field} {direction}")
        return self
  
    def limit(self, count):
        self._query["limit"] = count
        return self
  
    def build(self):
        query = f"SELECT {', '.join(self._query['select'])}"
        query += f" FROM {self._query['from']}"
      
        if self._query["where"]:
            query += f" WHERE {' AND '.join(self._query['where'])}"
      
        if self._query["order_by"]:
            query += f" ORDER BY {', '.join(self._query['order_by'])}"
      
        if self._query["limit"]:
            query += f" LIMIT {self._query['limit']}"
      
        return query

# Uso fluido
query = (QueryBuilder()
         .select("name", "email", "created_at")
         .from_table("users")
         .where("status = 'active'")
         .where("created_at > '2024-01-01'")
         .order_by("created_at", "DESC")
         .limit(10)
         .build())
```

### Patrones Estructurales

#### 3. Adapter Pattern - Conectando interfaces incompatibles

```python
# Sistema legado que no podemos cambiar
class LegacyPaymentSystem:
    def make_payment(self, account_number, amount_cents):
        # Lógica del sistema viejo
        return {"transaction_id": "12345", "status": "SUCCESS"}

# Interfaz moderna que queremos usar
class ModernPaymentInterface(ABC):
    @abstractmethod
    def process_payment(self, amount_dollars: float, payment_method: dict) -> PaymentResult:
        pass

# Adapter que conecta ambos mundos
class LegacyPaymentAdapter(ModernPaymentInterface):
    def __init__(self, legacy_system: LegacyPaymentSystem):
        self.legacy_system = legacy_system
  
    def process_payment(self, amount_dollars: float, payment_method: dict) -> PaymentResult:
        # Convertir formato moderno a formato legado
        amount_cents = int(amount_dollars * 100)
        account_number = payment_method["account_number"]
      
        # Llamar al sistema legado
        result = self.legacy_system.make_payment(account_number, amount_cents)
      
        # Convertir respuesta legada a formato moderno
        return PaymentResult(
            success=result["status"] == "SUCCESS",
            transaction_id=result["transaction_id"],
            amount=amount_dollars
        )
```

#### 4. Decorator Pattern - Añadiendo funcionalidad dinámicamente

```python
# Decorador para logging
def log_execution(func):
    def wrapper(*args, **kwargs):
        print(f"Executing {func.__name__} with args: {args}, kwargs: {kwargs}")
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} completed in {end_time - start_time:.2f} seconds")
        return result
    return wrapper

# Decorador para cache
def cache_result(func):
    cache = {}
    def wrapper(*args, **kwargs):
        key = str(args) + str(kwargs)
        if key in cache:
            print(f"Cache hit for {func.__name__}")
            return cache[key]
      
        result = func(*args, **kwargs)
        cache[key] = result
        return result
    return wrapper

# Decorador para rate limiting
def rate_limit(max_calls_per_minute=60):
    def decorator(func):
        calls = []
        def wrapper(*args, **kwargs):
            now = time.time()
            # Limpiar llamadas antiguas
            calls[:] = [call_time for call_time in calls if now - call_time < 60]
          
            if len(calls) >= max_calls_per_minute:
                raise Exception("Rate limit exceeded")
          
            calls.append(now)
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Uso combinado de decoradores
@log_execution
@cache_result
@rate_limit(max_calls_per_minute=100)
def expensive_calculation(n):
    time.sleep(1)  # Simular operación costosa
    return n ** 2
```

### Patrones Comportamentales

#### 5. Strategy Pattern - Algoritmos intercambiables

```python
class SortingStrategy(ABC):
    @abstractmethod
    def sort(self, data: list) -> list:
        pass

class QuickSort(SortingStrategy):
    def sort(self, data: list) -> list:
        if len(data) <= 1:
            return data
        pivot = data[len(data) // 2]
        left = [x for x in data if x < pivot]
        middle = [x for x in data if x == pivot]
        right = [x for x in data if x > pivot]
        return self.sort(left) + middle + self.sort(right)

class MergeSort(SortingStrategy):
    def sort(self, data: list) -> list:
        # Implementación de merge sort
        pass

class DataProcessor:
    def __init__(self, sorting_strategy: SortingStrategy):
        self.sorting_strategy = sorting_strategy
  
    def process_data(self, data: list) -> list:
        # Preprocesamiento
        cleaned_data = [x for x in data if x is not None]
      
        # Aplicar estrategia de ordenamiento
        sorted_data = self.sorting_strategy.sort(cleaned_data)
      
        # Postprocesamiento
        return sorted_data

# Uso
processor = DataProcessor(QuickSort())
result = processor.process_data([3, 1, 4, 1, 5, 9, 2, 6])

# Cambiar estrategia dinámicamente
processor.sorting_strategy = MergeSort()
result = processor.process_data([3, 1, 4, 1, 5, 9, 2, 6])
```

#### 6. Observer Pattern - Notificaciones automáticas

```python
class Observable:
    def __init__(self):
        self._observers = []
  
    def attach(self, observer):
        self._observers.append(observer)
  
    def detach(self, observer):
        self._observers.remove(observer)
  
    def notify(self, event):
        for observer in self._observers:
            observer.update(event)

class PriceMonitor(Observable):
    def __init__(self, symbol):
        super().__init__()
        self.symbol = symbol
        self._price = 0
  
    @property
    def price(self):
        return self._price
  
    @price.setter
    def price(self, value):
        old_price = self._price
        self._price = value
        self.notify({
            "symbol": self.symbol,
            "old_price": old_price,
            "new_price": value,
            "change": value - old_price
        })

class EmailAlertObserver:
    def __init__(self, email, threshold):
        self.email = email
        self.threshold = threshold
  
    def update(self, event):
        if abs(event["change"]) > self.threshold:
            print(f"Alert to {self.email}: {event['symbol']} price changed by {event['change']}")

class LoggingObserver:
    def update(self, event):
        print(f"LOG: {event['symbol']} price updated from {event['old_price']} to {event['new_price']}")

# Uso
btc_monitor = PriceMonitor("BTC")
btc_monitor.attach(EmailAlertObserver("trader@example.com", 1000))
btc_monitor.attach(LoggingObserver())

btc_monitor.price = 50000  # Dispara notificaciones
btc_monitor.price = 51500  # Dispara alerta por cambio > 1000
```

---

## 5. 🧪 Testing: La Ciencia de la Confianza

### Pirámide de Testing

**Analogía**: El testing es como el sistema de seguridad de un banco. Tienes muchas alarmas pequeñas (unit tests), algunas cámaras de seguridad (integration tests), y pocos guardias humanos (e2e tests).

```
        /\
       /  \
      / E2E \     ← Pocos, costosos, lentos, pero alta confianza
     /______\
    /        \
   /Integration\ ← Moderados, testan componentes juntos
  /__________\
 /            \
/  Unit Tests  \  ← Muchos, rápidos, baratos, enfoque específico
/______________\
```

### 1. Unit Testing - La Base de la Confianza

```python
import unittest
from unittest.mock import Mock, patch
import pytest

# Código a testear
class UserService:
    def __init__(self, user_repository, email_service):
        self.user_repository = user_repository
        self.email_service = email_service
  
    def register_user(self, user_data):
        # Validación
        if not user_data.get("email"):
            raise ValueError("Email is required")
      
        if self.user_repository.find_by_email(user_data["email"]):
            raise ValueError("User already exists")
      
        # Crear usuario
        user = self.user_repository.create(user_data)
      
        # Enviar email de bienvenida
        self.email_service.send_welcome_email(user.email)
      
        return user

# Tests unitarios
class TestUserService(unittest.TestCase):
    def setUp(self):
        self.user_repository = Mock()
        self.email_service = Mock()
        self.user_service = UserService(self.user_repository, self.email_service)
  
    def test_register_user_success(self):
        # Arrange
        user_data = {"email": "test@example.com", "name": "Test User"}
        expected_user = Mock()
        expected_user.email = "test@example.com"
      
        self.user_repository.find_by_email.return_value = None
        self.user_repository.create.return_value = expected_user
      
        # Act
        result = self.user_service.register_user(user_data)
      
        # Assert
        self.assertEqual(result, expected_user)
        self.user_repository.find_by_email.assert_called_once_with("test@example.com")
        self.user_repository.create.assert_called_once_with(user_data)
        self.email_service.send_welcome_email.assert_called_once_with("test@example.com")
  
    def test_register_user_missing_email(self):
        # Arrange
        user_data = {"name": "Test User"}
      
        # Act & Assert
        with self.assertRaises(ValueError) as context:
            self.user_service.register_user(user_data)
      
        self.assertEqual(str(context.exception), "Email is required")
        self.user_repository.find_by_email.assert_not_called()
  
    def test_register_user_already_exists(self):
        # Arrange
        user_data = {"email": "test@example.com", "name": "Test User"}
        existing_user = Mock()
        self.user_repository.find_by_email.return_value = existing_user
      
        # Act & Assert
        with self.assertRaises(ValueError) as context:
            self.user_service.register_user(user_data)
      
        self.assertEqual(str(context.exception), "User already exists")
        self.user_repository.create.assert_not_called()

# Tests con pytest (más moderno y flexible)
@pytest.fixture
def user_service():
    user_repository = Mock()
    email_service = Mock()
    return UserService(user_repository, email_service), user_repository, email_service

def test_register_user_with_pytest(user_service):
    service, repo, email = user_service
  
    # Given
    user_data = {"email": "test@example.com", "name": "Test"}
    repo.find_by_email.return_value = None
    repo.create.return_value = Mock(email="test@example.com")
  
    # When
    result = service.register_user(user_data)
  
    # Then
    assert result is not None
    repo.create.assert_called_once_with(user_data)
    email.send_welcome_email.assert_called_once()

# Parametrized tests
@pytest.mark.parametrize("invalid_data,expected_error", [
    ({}, "Email is required"),
    ({"name": "Test"}, "Email is required"),
    ({"email": ""}, "Email is required"),
])
def test_register_user_validation(user_service, invalid_data, expected_error):
    service, _, _ = user_service
  
    with pytest.raises(ValueError, match=expected_error):
        service.register_user(invalid_data)
```

### 2. Integration Testing - Verificando Conexiones

```python
import pytest
import requests
from testcontainers import compose
import tempfile
import os

# Docker Compose para testing
docker_compose_content = """
version: '3.8'
services:
  test_db:
    image: postgres:13
    environment:
      POSTGRES_DB: testdb
      POSTGRES_USER: testuser
      POSTGRES_PASSWORD: testpass
    ports:
      - "5433:5432"
  
  redis:
    image: redis:6
    ports:
      - "6380:6379"
"""

class TestUserAPIIntegration:
    @pytest.fixture(scope="class")
    def docker_services(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            compose_file = os.path.join(temp_dir, "docker-compose.yml")
            with open(compose_file, "w") as f:
                f.write(docker_compose_content)
          
            with compose.DockerCompose(temp_dir) as compose_stack:
                # Esperar que los servicios estén listos
                compose_stack.wait_for("http://localhost:5433")
                yield compose_stack
  
    def test_user_registration_flow(self, docker_services):
        # Test completo de integración
        base_url = "http://localhost:8000"
      
        # 1. Registrar usuario
        user_data = {
            "email": "integration@test.com",
            "password": "securepass123",
            "name": "Integration Test"
        }
      
        response = requests.post(f"{base_url}/users/register", json=user_data)
        assert response.status_code == 201
        user_id = response.json()["user_id"]
      
        # 2. Verificar que el usuario existe en la base de datos
        response = requests.get(f"{base_url}/users/{user_id}")
        assert response.status_code == 200
        assert response.json()["email"] == "integration@test.com"
      
        # 3. Login
        login_data = {
            "email": "integration@test.com",
            "password": "securepass123"
        }
      
        response = requests.post(f"{base_url}/auth/login", json=login_data)
        assert response.status_code == 200
        token = response.json()["token"]
      
        # 4. Acceder a recurso protegido
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{base_url}/users/profile", headers=headers)
        assert response.status_code == 200
        assert response.json()["email"] == "integration@test.com"

# Test de base de datos
class TestDatabaseIntegration:
    @pytest.fixture
    def db_connection(self):
        # Configurar conexión de test
        conn = psycopg2.connect(
            host="localhost",
            port=5433,
            database="testdb",
            user="testuser",
            password="testpass"
        )
      
        # Setup: crear tablas
        with conn.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
      
        yield conn
      
        # Teardown: limpiar datos
        with conn.cursor() as cursor:
            cursor.execute("TRUNCATE TABLE users CASCADE")
            conn.commit()
      
        conn.close()
  
    def test_user_repository_operations(self, db_connection):
        repo = PostgreSQLUserRepository(db_connection)
      
        # Create
        user_data = {"email": "test@db.com", "name": "DB Test"}
        user = repo.create(user_data)
        assert user.id is not None
        assert user.email == "test@db.com"
      
        # Read
        found_user = repo.find_by_id(user.id)
        assert found_user.email == "test@db.com"
      
        # Update
        repo.update(user.id, {"name": "Updated Name"})
        updated_user = repo.find_by_id(user.id)
        assert updated_user.name == "Updated Name"
      
        # Delete
        repo.delete(user.id)
        deleted_user = repo.find_by_id(user.id)
        assert deleted_user is None
```

### 3. End-to-End Testing - La Experiencia Completa

```python
# tests/e2e/test_user_journey.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pytest

class TestUserJourney:
    @pytest.fixture
    def browser(self):
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")  # Para CI/CD
        driver = webdriver.Chrome(options=options)
        driver.implicitly_wait(10)
        yield driver
        driver.quit()
  
    def test_complete_user_registration_and_purchase(self, browser):
        """Test completo: registro → login → compra → logout"""
      
        # 1. Ir a la página de registro
        browser.get("http://localhost:3000/register")
      
        # 2. Llenar formulario de registro
        email_input = browser.find_element(By.ID, "email")
        password_input = browser.find_element(By.ID, "password")
        name_input = browser.find_element(By.ID, "name")
      
        email_input.send_keys("e2e@test.com")
        password_input.send_keys("password123")
        name_input.send_keys("E2E Test User")
      
        # 3. Enviar formulario
        submit_button = browser.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
      
        # 4. Verificar redirección a dashboard
        WebDriverWait(browser, 10).until(
            EC.url_contains("/dashboard")
        )
        assert "dashboard" in browser.current_url
      
        # 5. Navegar a tienda
        shop_link = browser.find_element(By.LINK_TEXT, "Shop")
        shop_link.click()
      
        # 6. Agregar producto al carrito
        add_to_cart_btn = browser.find_element(By.CSS_SELECTOR, ".product:first-child .add-to-cart")
        add_to_cart_btn.click()
      
        # 7. Verificar que el carrito se actualiza
        cart_count = browser.find_element(By.ID, "cart-count")
        WebDriverWait(browser, 5).until(
            lambda driver: cart_count.text == "1"
        )
      
        # 8. Ir al checkout
        cart_icon = browser.find_element(By.ID, "cart-icon")
        cart_icon.click()
      
        checkout_btn = browser.find_element(By.ID, "checkout-btn")
        checkout_btn.click()
      
        # 9. Completar compra
        card_number = browser.find_element(By.ID, "card-number")
        card_number.send_keys("4111111111111111")
      
        expiry = browser.find_element(By.ID, "card-expiry")
        expiry.send_keys("12/25")
      
        cvv = browser.find_element(By.ID, "card-cvv")
        cvv.send_keys("123")
      
        pay_button = browser.find_element(By.ID, "pay-now")
        pay_button.click()
      
        # 10. Verificar confirmación
        WebDriverWait(browser, 15).until(
            EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
        )
      
        success_msg = browser.find_element(By.CLASS_NAME, "success-message")
        assert "Order confirmed" in success_msg.text
      
        # 11. Logout
        user_menu = browser.find_element(By.ID, "user-menu")
        user_menu.click()
      
        logout_link = browser.find_element(By.LINK_TEXT, "Logout")
        logout_link.click()
      
        # 12. Verificar logout exitoso
        WebDriverWait(browser, 10).until(
            EC.url_contains("/login")
        )
        assert "login" in browser.current_url

# Page Object Model para mejor mantenibilidad
class RegisterPage:
    def __init__(self, driver):
        self.driver = driver
  
    def navigate(self):
        self.driver.get("http://localhost:3000/register")
  
    def fill_form(self, email, password, name):
        self.driver.find_element(By.ID, "email").send_keys(email)
        self.driver.find_element(By.ID, "password").send_keys(password)
        self.driver.find_element(By.ID, "name").send_keys(name)
  
    def submit(self):
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
  
    def register_user(self, email, password, name):
        self.navigate()
        self.fill_form(email, password, name)
        self.submit()

# Uso del Page Object
def test_user_registration_with_page_object(browser):
    register_page = RegisterPage(browser)
    register_page.register_user("test@example.com", "password123", "Test User")
  
    WebDriverWait(browser, 10).until(
        EC.url_contains("/dashboard")
    )
    assert "dashboard" in browser.current_url
```

### 4. Performance Testing - Midiendo la Velocidad

```python
# tests/performance/test_load.py
import asyncio
import aiohttp
import time
import statistics
from concurrent.futures import ThreadPoolExecutor
import pytest

class PerformanceTestSuite:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = []
  
    async def single_request(self, session, endpoint, method="GET", data=None):
        start_time = time.time()
      
        try:
            if method == "GET":
                async with session.get(f"{self.base_url}{endpoint}") as response:
                    await response.text()
                    status = response.status
            elif method == "POST":
                async with session.post(f"{self.base_url}{endpoint}", json=data) as response:
                    await response.text()
                    status = response.status
          
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # ms
          
            return {
                "endpoint": endpoint,
                "response_time": response_time,
                "status": status,
                "success": 200 <= status < 300
            }
      
        except Exception as e:
            end_time = time.time()
            return {
                "endpoint": endpoint,
                "response_time": (end_time - start_time) * 1000,
                "status": 0,
                "success": False,
                "error": str(e)
            }
  
    async def load_test(self, endpoint, concurrent_users=10, requests_per_user=10):
        """Simula carga con usuarios concurrentes"""
        async with aiohttp.ClientSession() as session:
            tasks = []
          
            for user in range(concurrent_users):
                for request in range(requests_per_user):
                    task = self.single_request(session, endpoint)
                    tasks.append(task)
          
            results = await asyncio.gather(*tasks)
            return results
  
    def analyze_results(self, results):
        """Analiza resultados de performance"""
        successful_results = [r for r in results if r["success"]]
        response_times = [r["response_time"] for r in successful_results]
      
        if not response_times:
            return {"error": "No successful requests"}
      
        analysis = {
            "total_requests": len(results),
            "successful_requests": len(successful_results),
            "success_rate": len(successful_results) / len(results) * 100,
            "average_response_time": statistics.mean(response_times),
            "median_response_time": statistics.median(response_times),
            "min_response_time": min(response_times),
            "max_response_time": max(response_times),
            "p95_response_time": self.percentile(response_times, 95),
            "p99_response_time": self.percentile(response_times, 99),
        }
      
        return analysis
  
    def percentile(self, data, percentile):
        """Calcula percentil"""
        data.sort()
        index = int((percentile / 100) * len(data))
        return data[index]

@pytest.mark.asyncio
async def test_api_performance():
    """Test de carga para endpoints críticos"""
    perf_test = PerformanceTestSuite()
  
    # Test endpoint de usuarios
    results = await perf_test.load_test("/api/users", concurrent_users=50, requests_per_user=20)
    analysis = perf_test.analyze_results(results)
  
    # Assertions de performance
    assert analysis["success_rate"] >= 99.0, f"Success rate too low: {analysis['success_rate']}%"
    assert analysis["average_response_time"] <= 500, f"Average response time too high: {analysis['average_response_time']}ms"
    assert analysis["p95_response_time"] <= 1000, f"P95 response time too high: {analysis['p95_response_time']}ms"
  
    print(f"Performance Results: {analysis}")

# Stress testing
@pytest.mark.asyncio
async def test_breaking_point():
    """Encuentra el punto de quiebre del sistema"""
    perf_test = PerformanceTestSuite()
  
    concurrent_users = [10, 25, 50, 100, 200, 500]
  
    for users in concurrent_users:
        print(f"Testing with {users} concurrent users...")
      
        results = await perf_test.load_test("/api/users", concurrent_users=users, requests_per_user=10)
        analysis = perf_test.analyze_results(results)
      
        print(f"Users: {users}, Success Rate: {analysis['success_rate']}%, Avg Response: {analysis['average_response_time']}ms")
      
        # Si la tasa de éxito cae por debajo del 95% o el tiempo de respuesta supera los 2 segundos
        if analysis["success_rate"] < 95 or analysis["average_response_time"] > 2000:
            print(f"Breaking point found at {users} concurrent users")
            break
```

---

## 6. 📊 Metodologías de Desarrollo

### Agile vs Waterfall: Eligiendo el Enfoque Correcto

**Analogía**: Waterfall es como construir una casa siguiendo planos detallados sin poder cambiar nada. Agile es como cocinar con un chef experto que va probando y ajustando la receta sobre la marcha.

### Scrum Framework - Implementación Práctica

```python
# scrum_tools.py - Herramientas para gestión Scrum
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass
from typing import List, Optional

class StoryPoints(Enum):
    VERY_SMALL = 1
    SMALL = 2
    MEDIUM = 3
    LARGE = 5
    VERY_LARGE = 8
    COMPLEX = 13

class TaskStatus(Enum):
    BACKLOG = "backlog"
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    CODE_REVIEW = "code_review"
    TESTING = "testing"
    DONE = "done"

@dataclass
class UserStory:
    id: str
    title: str
    description: str
    acceptance_criteria: List[str]
    story_points: StoryPoints
    priority: int
    assignee: Optional[str] = None
    status: TaskStatus = TaskStatus.BACKLOG
    created_at: datetime = datetime.now()
  
    def estimate_hours(self) -> int:
        """Convierte story points a horas estimadas"""
        point_to_hours = {
            StoryPoints.VERY_SMALL: 2,
            StoryPoints.SMALL: 4,
            StoryPoints.MEDIUM: 8,
            StoryPoints.LARGE: 16,
            StoryPoints.VERY_LARGE: 32,
            StoryPoints.COMPLEX: 40
        }
        return point_to_hours[self.story_points]

class Sprint:
    def __init__(self, name: str, duration_weeks: int = 2):
        self.name = name
        self.start_date = datetime.now()
        self.end_date = self.start_date + timedelta(weeks=duration_weeks)
        self.stories: List[UserStory] = []
        self.capacity_hours = 0
        self.team_members: List[str] = []
  
    def add_story(self, story: UserStory) -> bool:
        """Agrega historia si hay capacidad"""
        estimated_hours = story.estimate_hours()
      
        if self.get_remaining_capacity() >= estimated_hours:
            self.stories.append(story)
            return True
        return False
  
    def get_total_story_points(self) -> int:
        return sum(story.story_points.value for story in self.stories)
  
    def get_remaining_capacity(self) -> int:
        used_hours = sum(story.estimate_hours() for story in self.stories)
        return self.capacity_hours - used_hours
  
    def get_burndown_data(self):
        """Genera datos para gráfico burndown"""
        days = (self.end_date - self.start_date).days
        total_points = self.get_total_story_points()
      
        # Línea ideal (perfecta)
        ideal_line = []
        for day in range(days + 1):
            remaining = total_points - (total_points * day / days)
            ideal_line.append(remaining)
      
        # Línea actual (basada en stories completadas)
        actual_line = []
        completed_points = sum(
            story.story_points.value 
            for story in self.stories 
            if story.status == TaskStatus.DONE
        )
        # En una implementación real, esto se calcularía día a día
      
        return {
            "ideal": ideal_line,
            "actual": actual_line,
            "days": list(range(days + 1))
        }

class ScrumBoard:
    def __init__(self):
        self.backlog: List[UserStory] = []
        self.current_sprint: Optional[Sprint] = None
        self.completed_sprints: List[Sprint] = []
  
    def plan_sprint(self, sprint_name: str, team_capacity_hours: int) -> Sprint:
        """Planifica nuevo sprint"""
        sprint = Sprint(sprint_name)
        sprint.capacity_hours = team_capacity_hours
      
        # Auto-seleccionar historias por prioridad
        sorted_backlog = sorted(self.backlog, key=lambda s: s.priority)
      
        for story in sorted_backlog:
            if sprint.add_story(story):
                self.backlog.remove(story)
                story.status = TaskStatus.TODO
            else:
                break  # No hay más capacidad
      
        self.current_sprint = sprint
        return sprint
  
    def complete_sprint(self):
        """Completa sprint actual"""
        if self.current_sprint:
            # Mover historias no completadas de vuelta al backlog
            incomplete_stories = [
                story for story in self.current_sprint.stories
                if story.status != TaskStatus.DONE
            ]
          
            for story in incomplete_stories:
                story.status = TaskStatus.BACKLOG
                self.backlog.append(story)
          
            self.completed_sprints.append(self.current_sprint)
            self.current_sprint = None
  
    def calculate_velocity(self, last_n_sprints: int = 3) -> float:
        """Calcula velocidad del equipo"""
        if not self.completed_sprints:
            return 0
      
        recent_sprints = self.completed_sprints[-last_n_sprints:]
        total_points = sum(
            sum(story.story_points.value for story in sprint.stories 
                if story.status == TaskStatus.DONE)
            for sprint in recent_sprints
        )
      
        return total_points / len(recent_sprints)

# Ejemplo de uso
def demo_scrum_process():
    # Crear board
    board = ScrumBoard()
  
    # Agregar historias al backlog
    stories = [
        UserStory("US-001", "Login de usuario", "Como usuario quiero...", 
                 ["Formulario funcional", "Validación de errores"], StoryPoints.MEDIUM, priority=1),
        UserStory("US-002", "Dashboard principal", "Como usuario quiero...", 
                 ["Mostrar datos relevantes", "Navegación clara"], StoryPoints.LARGE, priority=2),
        UserStory("US-003", "Perfil de usuario", "Como usuario quiero...", 
                 ["Editar información", "Cambiar contraseña"], StoryPoints.SMALL, priority=3),
    ]
  
    board.backlog.extend(stories)
  
    # Planificar sprint
    sprint = board.plan_sprint("Sprint 1", team_capacity_hours=80)
    print(f"Sprint planificado: {sprint.name}")
    print(f"Historias incluidas: {len(sprint.stories)}")
    print(f"Puntos totales: {sprint.get_total_story_points()}")
  
    # Simular progreso
    sprint.stories[0].status = TaskStatus.DONE
    sprint.stories[1].status = TaskStatus.IN_PROGRESS
  
    # Ver burndown
    burndown = sprint.get_burndown_data()
    print(f"Datos burndown: {burndown}")
  
    return board
```

### Kanban - Flujo Continuo

```python
# kanban_system.py
from collections import defaultdict
from datetime import datetime
import statistics

class KanbanBoard:
    def __init__(self):
        self.columns = {
            "backlog": [],
            "analysis": [],
            "development": [],
            "code_review": [],
            "testing": [],
            "done": []
        }
        self.wip_limits = {
            "analysis": 3,
            "development": 5,
            "code_review": 3,
            "testing": 4
        }
        self.history = []  # Para métricas
  
    def add_item(self, item, column="backlog"):
        """Agrega item al board"""
        if self.can_add_to_column(column):
            item.moved_to_column_at = datetime.now()
            self.columns[column].append(item)
            self.log_movement(item, None, column)
            return True
        return False
  
    def move_item(self, item_id, from_column, to_column):
        """Mueve item entre columnas"""
        if not self.can_add_to_column(to_column):
            raise Exception(f"WIP limit exceeded for {to_column}")
      
        # Encontrar y mover item
        item = None
        for i, candidate in enumerate(self.columns[from_column]):
            if candidate.id == item_id:
                item = self.columns[from_column].pop(i)
                break
      
        if item:
            item.moved_to_column_at = datetime.now()
            self.columns[to_column].append(item)
            self.log_movement(item, from_column, to_column)
            return True
      
        return False
  
    def can_add_to_column(self, column):
        """Verifica límites WIP"""
        if column not in self.wip_limits:
            return True
        return len(self.columns[column]) < self.wip_limits[column]
  
    def log_movement(self, item, from_col, to_col):
        """Registra movimiento para métricas"""
        self.history.append({
            "item_id": item.id,
            "from_column": from_col,
            "to_column": to_col,
            "timestamp": datetime.now(),
            "item": item
        })
  
    def calculate_cycle_time(self, item_id):
        """Calcula tiempo de ciclo para un item"""
        item_history = [h for h in self.history if h["item_id"] == item_id]
      
        if not item_history:
            return None
      
        start_development = None
        completed = None
      
        for event in item_history:
            if event["to_column"] == "development" and not start_development:
                start_development = event["timestamp"]
            elif event["to_column"] == "done":
                completed = event["timestamp"]
      
        if start_development and completed:
            return (completed - start_development).days
      
        return None
  
    def calculate_lead_time(self, item_id):
        """Calcula tiempo de entrega total"""
        item_history = [h for h in self.history if h["item_id"] == item_id]
      
        if not item_history:
            return None
      
        first_event = min(item_history, key=lambda x: x["timestamp"])
        last_event = max(item_history, key=lambda x: x["timestamp"])
      
        if last_event["to_column"] == "done":
            return (last_event["timestamp"] - first_event["timestamp"]).days
      
        return None
  
    def get_wip_violations(self):
        """Detecta violaciones de límites WIP"""
        violations = []
        for column, limit in self.wip_limits.items():
            current_count = len(self.columns[column])
            if current_count > limit:
                violations.append({
                    "column": column,
                    "current": current_count,
                    "limit": limit,
                    "excess": current_count - limit
                })
        return violations
  
    def generate_metrics_report(self):
        """Genera reporte de métricas"""
        completed_items = [
            h["item_id"] for h in self.history 
            if h["to_column"] == "done"
        ]
      
        cycle_times = [
            self.calculate_cycle_time(item_id) 
            for item_id in completed_items
        ]
        cycle_times = [ct for ct in cycle_times if ct is not None]
      
        lead_times = [
            self.calculate_lead_time(item_id) 
            for item_id in completed_items
        ]
        lead_times = [lt for lt in lead_times if lt is not None]
      
        return {
            "throughput": len(completed_items),
            "average_cycle_time": statistics.mean(cycle_times) if cycle_times else 0,
            "average_lead_time": statistics.mean(lead_times) if lead_times else 0,
            "wip_violations": self.get_wip_violations(),
            "column_loads": {col: len(items) for col, items in self.columns.items()}
        }

@dataclass
class WorkItem:
    id: str
    title: str
    description: str
    priority: str
    assignee: str
    moved_to_column_at: datetime = None
```

---

## 7. 🏛️ Arquitecturas Avanzadas

### Microservicios: Dividir para Conquistar

**Analogía**: Los microservicios son como organizar una ciudad en barrios especializados. Cada barrio (servicio) tiene su propósito específico, pero todos trabajan juntos para hacer funcionar la ciudad completa.

```python
# microservices_patterns.py
import asyncio
import aiohttp
import json
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass

# 1. API Gateway Pattern
class APIGateway:
    def __init__(self):
        self.services = {
            "user": "http://user-service:8001",
            "order": "http://order-service:8002",
            "inventory": "http://inventory-service:8003",
            "notification": "http://notification-service:8004"
        }
        self.rate_limits = {}
        self.circuit_breakers = {}
  
    async def route_request(self, service_name: str, endpoint: str, method: str = "GET", **kwargs):
        """Enruta request al microservicio apropiado"""
      
        # 1. Rate limiting
        if not self.check_rate_limit(service_name):
            return {"error": "Rate limit exceeded"}, 429
      
        # 2. Circuit breaker
        if self.is_circuit_open(service_name):
            return {"error": "Service temporarily unavailable"}, 503
      
        # 3. Autenticación y autorización
        if not self.validate_auth(kwargs.get("headers", {})):
            return {"error": "Unauthorized"}, 401
      
        # 4. Enrutar al servicio
        try:
            service_url = self.services[service_name]
            url = f"{service_url}{endpoint}"
          
            async with aiohttp.ClientSession() as session:
                if method == "GET":
                    async with session.get(url, headers=kwargs.get("headers")) as response:
                        data = await response.json()
                        return data, response.status
                elif method == "POST":
                    async with session.post(url, json=kwargs.get("data"), headers=kwargs.get("headers")) as response:
                        data = await response.json()
                        return data, response.status
      
        except Exception as e:
            self.record_failure(service_name)
            return {"error": "Service error"}, 500
  
    def check_rate_limit(self, service_name: str) -> bool:
        """Implementa rate limiting por servicio"""
        # Implementación simplificada
        return True
  
    def is_circuit_open(self, service_name: str) -> bool:
        """Verifica estado del circuit breaker"""
        # Implementación simplificada
        return False
  
    def validate_auth(self, headers: Dict) -> bool:
        """Valida autenticación JWT"""
        token = headers.get("Authorization", "").replace("Bearer ", "")
        # Implementación de validación JWT
        return True

# 2. Service Discovery Pattern
class ServiceRegistry:
    def __init__(self):
        self.services = {}
        self.health_checks = {}
  
    def register_service(self, name: str, host: str, port: int, health_endpoint: str = "/health"):
        """Registra un servicio"""
        service_id = f"{name}-{host}-{port}"
        self.services[service_id] = {
            "name": name,
            "host": host,
            "port": port,
            "url": f"http://{host}:{port}",
            "health_endpoint": health_endpoint,
            "registered_at": datetime.now(),
            "last_heartbeat": datetime.now(),
            "status": "healthy"
        }
        return service_id
  
    def deregister_service(self, service_id: str):
        """Desregistra un servicio"""
        if service_id in self.services:
            del self.services[service_id]
  
    def discover_service(self, service_name: str) -> Optional[Dict]:
        """Encuentra servicios disponibles por nombre"""
        available_services = [
            service for service in self.services.values()
            if service["name"] == service_name and service["status"] == "healthy"
        ]
      
        if available_services:
            # Load balancing simple - round robin
            return available_services[0]  # En producción, usar algoritmo más sofisticado
      
        return None
  
    async def health_check_all(self):
        """Verifica salud de todos los servicios"""
        for service_id, service in self.services.items():
            try:
                health_url = f"{service['url']}{service['health_endpoint']}"
                async with aiohttp.ClientSession() as session:
                    async with session.get(health_url, timeout=5) as response:
                        if response.status == 200:
                            service["status"] = "healthy"
                            service["last_heartbeat"] = datetime.now()
                        else:
                            service["status"] = "unhealthy"
            except:
                service["status"] = "unhealthy"

# 3. Event-Driven Communication
class EventBus:
    def __init__(self):
        self.subscribers = {}
        self.event_store = []
  
    def subscribe(self, event_type: str, service_endpoint: str):
        """Suscribe un servicio a un tipo de evento"""
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(service_endpoint)
  
    async def publish(self, event: Dict):
        """Publica evento a todos los suscriptores"""
        event_type = event.get("type")
        event["id"] = len(self.event_store) + 1
        event["timestamp"] = datetime.now().isoformat()
      
        # Almacenar evento (Event Sourcing)
        self.event_store.append(event)
      
        # Notificar suscriptores
        if event_type in self.subscribers:
            tasks = []
            for endpoint in self.subscribers[event_type]:
                task = self.notify_subscriber(endpoint, event)
                tasks.append(task)
          
            await asyncio.gather(*tasks, return_exceptions=True)
  
    async def notify_subscriber(self, endpoint: str, event: Dict):
        """Notifica a un suscriptor específico"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(endpoint, json=event, timeout=10) as response:
                    if response.status != 200:
                        # En producción: implementar retry logic y dead letter queue
                        print(f"Failed to notify {endpoint}: {response.status}")
        except Exception as e:
            print(f"Error notifying {endpoint}: {e}")

# 4. Ejemplo de Microservicio con Patterns
class UserService:
    def __init__(self, service_registry: ServiceRegistry, event_bus: EventBus):
        self.service_registry = service_registry
        self.event_bus = event_bus
        self.service_id = None
  
    async def start(self, host: str = "localhost", port: int = 8001):
        """Inicia el servicio y se registra"""
        self.service_id = self.service_registry.register_service("user", host, port)
      
        # Suscribirse a eventos relevantes
        self.event_bus.subscribe("order.created", f"http://{host}:{port}/events/order-created")
      
        print(f"User service started on {host}:{port}")
  
    async def create_user(self, user_data: Dict) -> Dict:
        """Crea un nuevo usuario"""
        # Lógica de creación de usuario
        user = {
            "id": "user-123",
            "email": user_data["email"],
            "name": user_data["name"],
            "created_at": datetime.now().isoformat()
        }
      
        # Publicar evento
        await self.event_bus.publish({
            "type": "user.created",
            "user_id": user["id"],
            "email": user["email"]
        })
      
        return user
  
    async def handle_order_created(self, event: Dict):
        """Maneja evento de orden creada"""
        user_id = event.get("user_id")
        # Actualizar métricas del usuario, enviar notificación, etc.
        print(f"User {user_id} created an order: {event.get('order_id')}")

# 5. Orchestration vs Choreography
class OrderOrchestrator:
    """Patrón Orchestration - control centralizado"""
  
    def __init__(self, api_gateway: APIGateway):
        self.api_gateway = api_gateway
  
    async def process_order(self, order_data: Dict) -> Dict:
        """Procesa orden siguiendo flujo definido"""
      
        # 1. Validar usuario
        user_response, status = await self.api_gateway.route_request(
            "user", f"/users/{order_data['user_id']}", "GET"
        )
        if status != 200:
            return {"error": "Invalid user"}
      
        # 2. Verificar inventario
        inventory_response, status = await self.api_gateway.route_request(
            "inventory", "/inventory/check", "POST", data=order_data["items"]
        )
        if status != 200 or not inventory_response.get("available"):
            return {"error": "Items not available"}
      
        # 3. Procesar pago
        payment_response, status = await self.api_gateway.route_request(
            "payment", "/payment/process", "POST", data=order_data["payment"]
        )
        if status != 200:
            return {"error": "Payment failed"}
      
        # 4. Crear orden
        order_response, status = await self.api_gateway.route_request(
            "order", "/orders", "POST", data=order_data
        )
        if status != 201:
            # Compensar transacciones anteriores
            await self.compensate_payment(payment_response["payment_id"])
            return {"error": "Order creation failed"}
      
        # 5. Actualizar inventario
        await self.api_gateway.route_request(
            "inventory", "/inventory/reserve", "POST", data={
                "order_id": order_response["order_id"],
                "items": order_data["items"]
            }
        )
      
        return {"order_id": order_response["order_id"], "status": "completed"}
  
    async def compensate_payment(self, payment_id: str):
        """Compensa pago en caso de error"""
        await self.api_gateway.route_request(
            "payment", f"/payment/{payment_id}/refund", "POST"
        )

# Patrón Choreography - cada servicio sabe qué hacer
class OrderChoreography:
    """Servicios reaccionan a eventos de forma distribuida"""
  
    def __init__(self, event_bus: EventBus):
        self.event_bus = event_bus
        self.setup_event_handlers()
  
    def setup_event_handlers(self):
        """Configura manejadores de eventos"""
        self.event_bus.subscribe("order.submitted", "http://inventory-service:8003/events/order-submitted")
        self.event_bus.subscribe("inventory.reserved", "http://payment-service:8004/events/inventory-reserved")
        self.event_bus.subscribe("payment.processed", "http://order-service:8002/events/payment-processed")
        self.event_bus.subscribe("order.confirmed", "http://notification-service:8005/events/order-confirmed")
```

### Domain-Driven Design (DDD) - Modelando la Realidad

```python
# ddd_example.py - E-commerce domain
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime
from enum import Enum

# Value Objects - Objetos inmutables que representan conceptos
@dataclass(frozen=True)
class Money:
    amount: float
    currency: str = "USD"
  
    def add(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise ValueError("Cannot add different currencies")
        return Money(self.amount + other.amount, self.currency)
  
    def multiply(self, factor: float) -> 'Money':
        return Money(self.amount * factor, self.currency)

@dataclass(frozen=True)
class Email:
    value: str
  
    def __post_init__(self):
        if "@" not in self.value:
            raise ValueError("Invalid email format")

@dataclass(frozen=True)
class ProductId:
    value: str

# Entities - Objetos con identidad
class Product:
    def __init__(self, product_id: ProductId, name: str, price: Money):
        self.id = product_id
        self.name = name
        self.price = price
        self.inventory_count = 0
  
    def update_price(self, new_price: Money):
        """Domain logic for price updates"""
        if new_price.amount <= 0:
            raise ValueError("Price must be positive")
        self.price = new_price
  
    def is_available(self, quantity: int) -> bool:
        return self.inventory_count >= quantity

class Customer:
    def __init__(self, customer_id: str, email: Email, name: str):
        self.id = customer_id
        self.email = email
        self.name = name
        self.orders: List['Order'] = []
  
    def place_order(self, order: 'Order'):
        """Domain logic for placing orders"""
        if order.customer_id != self.id:
            raise ValueError("Order customer mismatch")
        self.orders.append(order)

# Aggregates - Conjunto de entidades que se modifican juntas
class OrderStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderItem:
    def __init__(self, product: Product, quantity: int):
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        if not product.is_available(quantity):
            raise ValueError("Product not available in requested quantity")
      
        self.product = product
        self.quantity = quantity
        self.unit_price = product.price
  
    def total_price(self) -> Money:
        return self.unit_price.multiply(self.quantity)

class Order:
    """Aggregate Root"""
    def __init__(self, order_id: str, customer_id: str):
        self.id = order_id
        self.customer_id = customer_id
        self.items: List[OrderItem] = []
        self.status = OrderStatus.PENDING
        self.created_at = datetime.now()
        self.total_amount = Money(0)
  
    def add_item(self, product: Product, quantity: int):
        """Domain logic for adding items"""
        if self.status != OrderStatus.PENDING:
            raise ValueError("Cannot modify confirmed order")
      
        # Check if product already in order
        for item in self.items:
            if item.product.id == product.id:
                item.quantity += quantity
                self._recalculate_total()
                return
      
        # Add new item
        new_item = OrderItem(product, quantity)
        self.items.append(new_item)
        self._recalculate_total()
  
    def confirm(self):
        """Domain logic for order confirmation"""
        if not self.items:
            raise ValueError("Cannot confirm empty order")
      
        if self.status != OrderStatus.PENDING:
            raise ValueError("Order already processed")
      
        # Verify all items are still available
        for item in self.items:
            if not item.product.is_available(item.quantity):
                raise ValueError(f"Product {item.product.name} no longer available")
      
        self.status = OrderStatus.CONFIRMED
      
        # Domain event
        return OrderConfirmedEvent(self.id, self.customer_id, self.total_amount)
  
    def _recalculate_total(self):
        self.total_amount = Money(0)
        for item in self.items:
            self.total_amount = self.total_amount.add(item.total_price())

# Domain Events
@dataclass
class DomainEvent:
    occurred_at: datetime = datetime.now()

@dataclass
class OrderConfirmedEvent(DomainEvent):
    order_id: str
    customer_id: str
    total_amount: Money

# Domain Services - Lógica que no pertenece a una entidad específica
class PricingService:
    def __init__(self, discount_repository):
        self.discount_repository = discount_repository
  
    def calculate_order_total(self, order: Order, customer: Customer) -> Money:
        """Calcula total con descuentos complejos"""
        base_total = order.total_amount
      
        # Aplicar descuentos basados en cliente
        discount = self.discount_repository.find_applicable_discount(customer)
        if discount:
            return base_total.multiply(1 - discount.percentage)
      
        return base_total

# Repositories - Abstracción para persistencia
class OrderRepository(ABC):
    @abstractmethod
    def save(self, order: Order) -> None:
        pass
  
    @abstractmethod
    def find_by_id(self, order_id: str) -> Optional[Order]:
        pass
  
    @abstractmethod
    def find_by_customer(self, customer_id: str) -> List[Order]:
        pass

class ProductRepository(ABC):
    @abstractmethod
    def find_by_id(self, product_id: ProductId) -> Optional[Product]:
        pass
  
    @abstractmethod
    def save(self, product: Product) -> None:
        pass

# Application Services - Casos de uso
class OrderApplicationService:
    def __init__(self, order_repo: OrderRepository, product_repo: ProductRepository, event_publisher):
        self.order_repo = order_repo
        self.product_repo = product_repo
        self.event_publisher = event_publisher
  
    def place_order(self, customer_id: str, order_items: List[dict]) -> str:
        """Caso de uso: crear orden"""
        order = Order(f"order-{datetime.now().timestamp()}", customer_id)
      
        for item_data in order_items:
            product = self.product_repo.find_by_id(ProductId(item_data["product_id"]))
            if not product:
                raise ValueError(f"Product {item_data['product_id']} not found")
          
            order.add_item(product, item_data["quantity"])
      
        # Guardar orden
        self.order_repo.save(order)
      
        return order.id
  
    def confirm_order(self, order_id: str) -> None:
        """Caso de uso: confirmar orden"""
        order = self.order_repo.find_by_id(order_id)
        if not order:
            raise ValueError("Order not found")
      
        # Aplicar reglas de dominio
        event = order.confirm()
      
        # Persistir cambios
        self.order_repo.save(order)
      
        # Publicar evento
        self.event_publisher.publish(event)
```

---

## 8. 🔄 DevOps e Integración Continua

### CI/CD Pipeline: Automatizando la Excelencia

**Analogía**: Un pipeline CI/CD es como una línea de ensamblaje de automóviles moderna. Cada estación verifica una parte específica, y solo los productos perfectos llegan al final.

```yaml
# .github/workflows/ci-cd.yml - GitHub Actions Pipeline
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Job 1: Tests y Quality Checks
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11]
  
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
      redis:
        image: redis:6
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v3
  
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v4
      with:
        python-version: ${{ matrix.python-version }}
  
    - name: Cache dependencies
      uses: actions/cache@v3
      with:
        path: ~/.cache/pip
        key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
        restore-keys: |
          ${{ runner.os }}-pip-
  
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install -r requirements-dev.txt
  
    - name: Lint with flake8
      run: |
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
        flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
  
    - name: Type checking with mypy
      run: mypy src/
  
    - name: Security scan with bandit
      run: bandit -r src/
  
    - name: Run unit tests
      run: |
        pytest tests/unit/ -v --cov=src --cov-report=xml --cov-report=html
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
        REDIS_URL: redis://localhost:6379/0
  
    - name: Run integration tests
      run: |
        pytest tests/integration/ -v
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
        REDIS_URL: redis://localhost:6379/0
  
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        fail_ci_if_error: true

  # Job 2: Security Scanning
  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
  
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        format: 'sarif'
        output: 'trivy-results.sarif'
  
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  # Job 3: Build and Push Docker Image
  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}

    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  # Job 4: Deploy to Staging
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
  
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment..."
        # Aquí iría la lógica de deployment específica
        # Por ejemplo: kubectl, Terraform, etc.

  # Job 5: Deploy to Production
  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
  
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production environment..."
        # Lógica de deployment a producción con extra validaciones
```

### Infrastructure as Code (IaC)

```yaml
# docker-compose.yml - Entorno de desarrollo completo
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379/0
      - ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
      - redis
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

  monitoring:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  grafana_data:
```

```terraform
# infrastructure/main.tf - Terraform para AWS
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC y Networking
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_subnet" "public" {
  count = 2

  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet-${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count = 2

  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.project_name}-private-subnet-${count.index + 1}"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false
}

# ECS Service
resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_count

  launch_type = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.private[*].id
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 8000
  }

  depends_on = [aws_lb_listener.app]
}

# RDS Database
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-db"

  engine         = "postgres"
  engine_version = "13.7"
  instance_class = "db.t3.micro"

  allocated_storage     = 20
  max_allocated_storage = 100

  db_name  = var.database_name
  username = var.database_username
  password = var.database_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = true
}

# Variables
variable "aws_region" {
  description = "AWS region"
  default     = "us-west-2"
}

variable "project_name" {
  description = "Name of the project"
  default     = "myapp"
}

variable "app_count" {
  description = "Number of app instances"
  default     = 2
}

variable "database_name" {
  description = "Database name"
  default     = "myapp"
}

variable "database_username" {
  description = "Database username"
  default     = "postgres"
}

variable "database_password" {
  description = "Database password"
  sensitive   = true
}
```

### Monitoring y Observabilidad

```python
# monitoring/metrics.py - Sistema de métricas personalizado
import time
import logging
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import structlog

# Configuración de logging estructurado
structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.add_logger_name,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    logger_factory=structlog.PrintLoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Métricas de Prometheus
http_requests_total = Counter(
    'http_requests_total', 
    'Total HTTP requests', 
    ['method', 'endpoint', 'status']
)

http_request_duration = Histogram(
    'http_request_duration_seconds', 
    'HTTP request duration', 
    ['method', 'endpoint']
)

active_users = Gauge('active_users_total', 'Number of active users')
database_connections = Gauge('database_connections_active', 'Active database connections')

@dataclass
class MetricEvent:
    name: str
    value: float
    tags: Dict[str, str]
    timestamp: datetime = datetime.now()

class ApplicationMonitoring:
    def __init__(self):
        self.custom_metrics: List[MetricEvent] = []
      
    def track_request(self, method: str, endpoint: str, status_code: int, duration: float):
        """Rastrea métricas de requests HTTP"""
        http_requests_total.labels(method=method, endpoint=endpoint, status=status_code).inc()
        http_request_duration.labels(method=method, endpoint=endpoint).observe(duration)
      
        logger.info(
            "HTTP request completed",
            method=method,
            endpoint=endpoint,
            status_code=status_code,
            duration=duration
        )
  
    def track_business_metric(self, name: str, value: float, **tags):
        """Rastrea métricas de negocio personalizadas"""
        metric = MetricEvent(name, value, tags)
        self.custom_metrics.append(metric)
      
        logger.info(
            "Business metric recorded",
            metric_name=name,
            value=value,
            tags=tags
        )
  
    def track_error(self, error: Exception, context: Dict):
        """Rastrea errores con contexto completo"""
        logger.error(
            "Application error occurred",
            error_type=type(error).__name__,
            error_message=str(error),
            context=context,
            exc_info=True
        )
  
    def health_check(self) -> Dict[str, str]:
        """Endpoint de health check"""
        try:
            # Verificar componentes críticos
            db_status = self._check_database()
            cache_status = self._check_cache()
            external_api_status = self._check_external_apis()
          
            overall_status = "healthy" if all([
                db_status == "healthy",
                cache_status == "healthy",
                external_api_status == "healthy"
            ]) else "unhealthy"
          
            return {
                "status": overall_status,
                "timestamp": datetime.now().isoformat(),
                "components": {
                    "database": db_status,
                    "cache": cache_status,
                    "external_apis": external_api_status
                }
            }
        except Exception as e:
            logger.error("Health check failed", error=str(e))
            return {"status": "unhealthy", "error": str(e)}
  
    def _check_database(self) -> str:
        # Implementación específica de verificación de DB
        return "healthy"
  
    def _check_cache(self) -> str:
        # Implementación específica de verificación de cache
        return "healthy"
  
    def _check_external_apis(self) -> str:
        # Implementación específica de verificación de APIs externas
        return "healthy"

# Decorador para monitoreo automático
def monitor_performance(func):
    """Decorador que añade monitoreo automático a funciones"""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        function_name = f"{func.__module__}.{func.__name__}"
      
        try:
            result = func(*args, **kwargs)
            duration = time.time() - start_time
          
            logger.info(
                "Function executed successfully",
                function=function_name,
                duration=duration,
                args_count=len(args),
                kwargs_count=len(kwargs)
            )
          
            return result
          
        except Exception as e:
            duration = time.time() - start_time
            logger.error(
                "Function execution failed",
                function=function_name,
                duration=duration,
                error=str(e),
                exc_info=True
            )
            raise
  
    return wrapper

# Context manager para tracking de operaciones
class OperationTracker:
    def __init__(self, operation_name: str, **context):
        self.operation_name = operation_name
        self.context = context
        self.start_time = None
  
    def __enter__(self):
        self.start_time = time.time()
        logger.info(
            "Operation started",
            operation=self.operation_name,
            context=self.context
        )
        return self
  
    def __exit__(self, exc_type, exc_val, exc_tb):
        duration = time.time() - self.start_time
      
        if exc_type is None:
            logger.info(
                "Operation completed successfully",
                operation=self.operation_name,
                duration=duration,
                context=self.context
            )
        else:
            logger.error(
                "Operation failed",
                operation=self.operation_name,
                duration=duration,
                error=str(exc_val),
                context=self.context,
                exc_info=True
            )

# Ejemplo de uso
@monitor_performance
def process_user_order(user_id: str, order_data: dict):
    with OperationTracker("process_order", user_id=user_id, order_value=order_data.get("total")):
        # Lógica de procesamiento de orden
        time.sleep(0.1)  # Simular procesamiento
        return {"order_id": "12345", "status": "processed"}

# Alerting system
class AlertManager:
    def __init__(self):
        self.alert_rules = []
        self.notification_channels = []
  
    def add_alert_rule(self, name: str, condition_func, severity: str = "warning"):
        """Añade regla de alerta"""
        self.alert_rules.append({
            "name": name,
            "condition": condition_func,
            "severity": severity,
            "last_triggered": None
        })
  
    def check_alerts(self, metrics: Dict):
        """Verifica todas las reglas de alerta"""
        for rule in self.alert_rules:
            if rule["condition"](metrics):
                self._trigger_alert(rule, metrics)
  
    def _trigger_alert(self, rule: Dict, metrics: Dict):
        """Dispara alerta"""
        alert = {
            "rule_name": rule["name"],
            "severity": rule["severity"],
            "timestamp": datetime.now().isoformat(),
            "metrics": metrics
        }
      
        logger.warning(
            "Alert triggered",
            alert_name=rule["name"],
            severity=rule["severity"],
            metrics=metrics
        )
      
        # En producción: enviar a Slack, PagerDuty, etc.
        self._send_notifications(alert)
  
    def _send_notifications(self, alert: Dict):
        """Envía notificaciones (implementación específica)"""
        pass

# Configurar alertas de ejemplo
def setup_monitoring():
    monitor = ApplicationMonitoring()
    alert_manager = AlertManager()
  
    # Alertas de rendimiento
    alert_manager.add_alert_rule(
        "high_response_time",
        lambda m: m.get("avg_response_time", 0) > 2.0,
        "critical"
    )
  
    # Alertas de errores
    alert_manager.add_alert_rule(
        "high_error_rate",
        lambda m: m.get("error_rate", 0) > 0.05,
        "warning"
    )
  
    # Iniciar servidor de métricas de Prometheus
    start_http_server(8001)
  
    return monitor, alert_manager
```

---

## 9. 🛡️ Seguridad en el Desarrollo de Software

### Security by Design: Construyendo Fortalezas Digitales

**Analogía**: La seguridad en software es como el sistema de seguridad de un banco. No basta con tener una caja fuerte; necesitas guardias, cámaras, alarmas, protocolos de acceso, y un plan para cada posible amenaza.

### OWASP Top 10 - Implementación Práctica

```python
# security/secure_coding.py - Patrones de seguridad implementados
import hashlib
import secrets
import jwt
import re
from datetime import datetime, timedelta
from typing import Optional, Dict, List
import bcrypt
from cryptography.fernet import Fernet
import bleach
import sqlalchemy as sa
from sqlalchemy.orm import Session

class AuthenticationManager:
    """Gestión segura de autenticación"""
  
    def __init__(self, secret_key: str, token_expiry_hours: int = 24):
        self.secret_key = secret_key
        self.token_expiry_hours = token_expiry_hours
        self.failed_attempts = {}  # Rate limiting
        self.max_attempts = 5
        self.lockout_duration = 900  # 15 minutos
  
    def hash_password(self, password: str) -> str:
        """Hash seguro de contraseñas con salt"""
        # Validar fortaleza de contraseña
        if not self._validate_password_strength(password):
            raise ValueError("Password does not meet security requirements")
      
        # Generar hash con bcrypt (incluye salt automáticamente)
        salt = bcrypt.gensalt(rounds=12)  # Factor de costo alto
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
        return password_hash.decode('utf-8')
  
    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verifica contraseña de forma segura"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
        except Exception:
            return False
  
    def _validate_password_strength(self, password: str) -> bool:
        """Valida fortaleza de contraseña"""
        if len(password) < 12:
            return False
      
        # Al menos una mayúscula, minúscula, número y símbolo especial
        patterns = [
            r'[A-Z]',  # Mayúscula
            r'[a-z]',  # Minúscula
            r'\d',     # Número
            r'[!@#$%^&*(),.?":{}|<>]'  # Símbolo especial
        ]
      
        return all(re.search(pattern, password) for pattern in patterns)
  
    def create_session_token(self, user_id: str, permissions: List[str] = None) -> str:
        """Crea token JWT seguro"""
        payload = {
            'user_id': user_id,
            'permissions': permissions or [],
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=self.token_expiry_hours),
            'jti': secrets.token_urlsafe(32)  # Unique token ID
        }
      
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
  
    def validate_token(self, token: str) -> Optional[Dict]:
        """Valida token JWT"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
          
            # Verificar que no esté en blacklist (implementar Redis/DB)
            if self._is_token_blacklisted(payload.get('jti')):
                return None
          
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
  
    def check_rate_limit(self, identifier: str) -> bool:
        """Implementa rate limiting para prevenir ataques de fuerza bruta"""
        now = datetime.now()
      
        if identifier not in self.failed_attempts:
            return True
      
        attempts = self.failed_attempts[identifier]
      
        # Limpiar intentos antiguos
        attempts = [attempt for attempt in attempts 
                   if (now - attempt).seconds < self.lockout_duration]
      
        self.failed_attempts[identifier] = attempts
      
        return len(attempts) < self.max_attempts
  
    def record_failed_attempt(self, identifier: str):
        """Registra intento fallido"""
        if identifier not in self.failed_attempts:
            self.failed_attempts[identifier] = []
      
        self.failed_attempts[identifier].append(datetime.now())
  
    def _is_token_blacklisted(self, jti: str) -> bool:
        """Verifica si token está en blacklist"""
        # En producción: verificar en Redis o base de datos
        return False

class InputSanitizer:
    """Sanitización y validación de entrada"""
  
    @staticmethod
    def sanitize_html(content: str, allowed_tags: List[str] = None) -> str:
        """Sanitiza HTML para prevenir XSS"""
        if allowed_tags is None:
            allowed_tags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li']
      
        allowed_attributes = {
            'a': ['href', 'title'],
            'img': ['src', 'alt', 'width', 'height']
        }
      
        return bleach.clean(
            content, 
            tags=allowed_tags,
            attributes=allowed_attributes,
            strip=True
        )
  
    @staticmethod
    def validate_email(email: str) -> bool:
        """Valida formato de email"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
        return re.match(pattern, email) is not None
  
    @staticmethod
    def sanitize_sql_input(value: str) -> str:
        """Escapa caracteres peligrosos para SQL"""
        # Nota: Usar siempre parámetros preparados, esto es backup
        dangerous_chars = ["'", '"', ';', '--', '/*', '*/', 'xp_', 'sp_']
        for char in dangerous_chars:
            value = value.replace(char, '')
        return value
  
    @staticmethod
    def validate_file_upload(filename: str, content: bytes, max_size: int = 5242880) -> Dict:
        """Valida archivos subidos"""
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'}
      
        # Verificar extensión
        file_ext = '.' + filename.split('.')[-1].lower()
        if file_ext not in allowed_extensions:
            return {"valid": False, "error": "File type not allowed"}
      
        # Verificar tamaño
        if len(content) > max_size:
            return {"valid": False, "error": "File too large"}
      
        # Verificar magic bytes (MIME type real)
        mime_types = {
            b'\xff\xd8\xff': 'image/jpeg',
            b'\x89\x50\x4e\x47': 'image/png',
            b'\x47\x49\x46\x38': 'image/gif',
            b'\x25\x50\x44\x46': 'application/pdf'
        }
      
        file_signature = content[:4]
        detected_type = None
        for signature, mime_type in mime_types.items():
            if content.startswith(signature):
                detected_type = mime_type
                break
      
        if not detected_type:
            return {"valid": False, "error": "Invalid file format"}
      
        return {"valid": True, "mime_type": detected_type}

class SecureDatabase:
    """Operaciones seguras de base de datos"""
  
    def __init__(self, session: Session):
        self.session = session
  
    def secure_query(self, query: str, params: Dict = None) -> List[Dict]:
        """Ejecuta query con parámetros seguros"""
        if params is None:
            params = {}
      
        # Usar text() con parámetros vinculados para prevenir SQL injection
        result = self.session.execute(sa.text(query), params)
        return [dict(row) for row in result]
  
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Ejemplo de query segura"""
        query = """
        SELECT id, email, name, password_hash, created_at 
        FROM users 
        WHERE email = :email AND active = true
        """
      
        result = self.secure_query(query, {"email": email})
        return result[0] if result else None
  
    def audit_log(self, user_id: str, action: str, resource: str, details: Dict = None):
        """Registra acciones para auditoría"""
        log_entry = {
            "user_id": user_id,
            "action": action,
            "resource": resource,
            "details": details or {},
            "ip_address": self._get_client_ip(),  # Implementar según framework
            "timestamp": datetime.utcnow(),
            "session_id": self._get_session_id()  # Implementar según contexto
        }
      
        query = """
        INSERT INTO audit_logs (user_id, action, resource, details, ip_address, timestamp, session_id)
        VALUES (:user_id, :action, :resource, :details, :ip_address, :timestamp, :session_id)
        """
      
        self.session.execute(sa.text(query), log_entry)
        self.session.commit()
  
    def _get_client_ip(self) -> str:
        """Obtiene IP del cliente (implementar según framework)"""
        return "0.0.0.0"  # Placeholder
  
    def _get_session_id(self) -> str:
        """Obtiene ID de sesión actual"""
        return "session_placeholder"  # Placeholder

class EncryptionManager:
    """Gestión de encriptación para datos sensibles"""
  
    def __init__(self):
        self.key = self._generate_key()
        self.cipher_suite = Fernet(self.key)
  
    def _generate_key(self) -> bytes:
        """Genera clave de encriptación"""
        # En producción: obtener de variables de entorno o servicio de claves
        return Fernet.generate_key()
  
    def encrypt_sensitive_data(self, data: str) -> str:
        """Encripta datos sensibles"""
        encrypted_data = self.cipher_suite.encrypt(data.encode())
        return encrypted_data.decode()
  
    def decrypt_sensitive_data(self, encrypted_data: str) -> str:
        """Desencripta datos sensibles"""
        decrypted_data = self.cipher_suite.decrypt(encrypted_data.encode())
        return decrypted_data.decode()
  
    def encrypt_pii(self, pii_data: Dict) -> Dict:
        """Encripta información personal identificable"""
        sensitive_fields = ['ssn', 'credit_card', 'phone', 'address']
        encrypted_data = pii_data.copy()
      
        for field in sensitive_fields:
            if field in encrypted_data:
                encrypted_data[field] = self.encrypt_sensitive_data(str(encrypted_data[field]))
      
        return encrypted_data

# Sistema de autorización basado en roles
class RoleBasedAccessControl:
    """Control de acceso basado en roles (RBAC)"""
  
    def __init__(self):
        self.roles = {
            'admin': {
                'permissions': ['read', 'write', 'delete', 'manage_users'],
                'resources': ['*']
            },
            'editor': {
                'permissions': ['read', 'write'],
                'resources': ['articles', 'media', 'comments']
            },
            'viewer': {
                'permissions': ['read'],
                'resources': ['articles', 'public_media']
            }
        }
  
    def has_permission(self, user_roles: List[str], required_permission: str, resource: str) -> bool:
        """Verifica si usuario tiene permiso para acción en recurso"""
        for role in user_roles:
            if role not in self.roles:
                continue
          
            role_config = self.roles[role]
          
            # Verificar permiso
            if required_permission not in role_config['permissions']:
                continue
          
            # Verificar recurso
            if '*' in role_config['resources'] or resource in role_config['resources']:
                return True
      
        return False
  
    def get_accessible_resources(self, user_roles: List[str]) -> List[str]:
        """Obtiene lista de recursos accesibles para usuario"""
        accessible_resources = set()
      
        for role in user_roles:
            if role in self.roles:
                role_resources = self.roles[role]['resources']
                if '*' in role_resources:
                    return ['*']  # Acceso total
                accessible_resources.update(role_resources)
      
        return list(accessible_resources)

# Decorador para verificación de permisos
def require_permission(permission: str, resource: str):
    """Decorador que requiere permiso específico"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Obtener contexto de usuario (implementar según framework)
            user_context = get_current_user_context()  # Placeholder
          
            if not user_context:
                raise PermissionDenied("Authentication required")
          
            rbac = RoleBasedAccessControl()
            if not rbac.has_permission(user_context['roles'], permission, resource):
                raise PermissionDenied(f"Permission '{permission}' required for resource '{resource}'")
          
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Excepciones personalizadas
class SecurityException(Exception):
    """Excepción base para errores de seguridad"""
    pass

class PermissionDenied(SecurityException):
    """Excepción para acceso denegado"""
    pass

class InvalidTokenException(SecurityException):
    """Excepción para tokens inválidos"""
    pass

# Middleware de seguridad
class SecurityMiddleware:
    """Middleware que aplica medidas de seguridad a requests"""
  
    def __init__(self):
        self.csrf_tokens = {}
        self.rate_limiter = {}
  
    def process_request(self, request):
        """Procesa request aplicando validaciones de seguridad"""
      
        # 1. Validar CSRF token para métodos de modificación
        if request.method in ['POST', 'PUT', 'DELETE']:
            self._validate_csrf_token(request)
      
        # 2. Aplicar rate limiting
        if not self._check_rate_limit(request.remote_addr):
            raise SecurityException("Rate limit exceeded")
      
        # 3. Validar headers de seguridad
        self._validate_security_headers(request)
      
        # 4. Detectar ataques comunes
        self._detect_common_attacks(request)
  
    def _validate_csrf_token(self, request):
        """Valida token CSRF"""
        token = request.headers.get('X-CSRF-Token') or request.form.get('csrf_token')
        session_token = request.session.get('csrf_token')
      
        if not token or not session_token or token != session_token:
            raise SecurityException("Invalid CSRF token")
  
    def _check_rate_limit(self, ip_address: str) -> bool:
        """Implementa rate limiting por IP"""
        now = datetime.now()
        if ip_address not in self.rate_limiter:
            self.rate_limiter[ip_address] = []
      
        # Limpiar requests antiguos (ventana de 1 minuto)
        self.rate_limiter[ip_address] = [
            req_time for req_time in self.rate_limiter[ip_address]
            if (now - req_time).seconds < 60
        ]
      
        # Verificar límite (100 requests por minuto)
        if len(self.rate_limiter[ip_address]) >= 100:
            return False
      
        self.rate_limiter[ip_address].append(now)
        return True
  
    def _validate_security_headers(self, request):
        """Valida headers de seguridad"""
        required_headers = ['User-Agent']
      
        for header in required_headers:
            if header not in request.headers:
                raise SecurityException(f"Missing required header: {header}")
  
    def _detect_common_attacks(self, request):
        """Detecta patrones de ataques comunes"""
      
        # Detectar SQL injection en parámetros
        suspicious_patterns = [
            r"union\s+select", r"drop\s+table", r"insert\s+into",
            r"<script", r"javascript:", r"on\w+\s*="
        ]
      
        # Verificar en query string y form data
        test_string = str(request.args) + str(request.form)
      
        for pattern in suspicious_patterns:
            if re.search(pattern, test_string, re.IGNORECASE):
                raise SecurityException(f"Suspicious pattern detected: {pattern}")

# Función helper para obtener contexto de usuario
def get_current_user_context():
    """Obtiene contexto del usuario actual"""
    # Implementar según framework (Flask, Django, FastAPI, etc.)
    return {
        'user_id': 'user123',
        'roles': ['editor'],
        'permissions': ['read', 'write']
    }

# Ejemplo de uso integral
def demo_security_implementation():
    """Demuestra implementación integral de seguridad"""
  
    # 1. Configurar autenticación
    auth_manager = AuthenticationManager("super-secret-key-change-in-production")
  
    # 2. Registrar usuario con contraseña segura
    try:
        password_hash = auth_manager.hash_password("MySecureP@ssw0rd123!")
        print("Password hashed successfully")
    except ValueError as e:
        print(f"Password validation failed: {e}")
  
    # 3. Crear token de sesión
    token = auth_manager.create_session_token("user123", ["read", "write"])
    print(f"Session token created: {token[:20]}...")
  
    # 4. Validar token
    payload = auth_manager.validate_token(token)
    if payload:
        print(f"Token validated for user: {payload['user_id']}")
  
    # 5. Sanitizar entrada de usuario
    sanitizer = InputSanitizer()
    unsafe_html = "<script>alert('XSS')</script><p>Safe content</p>"
    safe_html = sanitizer.sanitize_html(unsafe_html)
    print(f"Sanitized HTML: {safe_html}")
  
    # 6. Encriptar datos sensibles
    encryption_manager = EncryptionManager()
    sensitive_data = "123-45-6789"  # SSN
    encrypted = encryption_manager.encrypt_sensitive_data(sensitive_data)
    decrypted = encryption_manager.decrypt_sensitive_data(encrypted)
    print(f"Encryption test: {sensitive_data} -> [encrypted] -> {decrypted}")
  
    # 7. Verificar permisos
    rbac = RoleBasedAccessControl()
    has_permission = rbac.has_permission(['editor'], 'write', 'articles')
    print(f"Editor can write articles: {has_permission}")
  
    return {
        "auth_manager": auth_manager,
        "sanitizer": sanitizer,
        "encryption_manager": encryption_manager,
        "rbac": rbac
    }
```

---

## 10. 📚 Documentación y Comunicación Técnica

### El Arte de Hacer lo Complejo Comprensible

**Analogía**: La documentación es como un mapa para exploradores. No importa cuán bello sea el territorio (tu código), sin un buen mapa, los demás se perderán tratando de navegarlo.

```python
# documentation_examples.py - Ejemplos de documentación técnica excelente

from typing import List, Optional, Dict, Any, Callable
from dataclasses import dataclass
from enum import Enum
import asyncio

class PaymentStatus(Enum):
    """Estados posibles de un pago.
  
    Attributes:
        PENDING: Pago iniciado pero no procesado
        PROCESSING: Pago en proceso de verificación
        COMPLETED: Pago exitosamente procesado
        FAILED: Pago falló por razones técnicas o de negocio
        REFUNDED: Pago revertido al usuario
    """
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

@dataclass
class PaymentRequest:
    """Representa una solicitud de pago.
  
    Esta clase encapsula toda la información necesaria para procesar
    un pago, incluyendo detalles del usuario, método de pago y monto.
  
    Attributes:
        amount: Monto a cobrar en centavos (ej: 1000 = $10.00)
        currency: Código de moneda ISO 4217 (ej: "USD", "EUR")
        payment_method_id: ID del método de pago previamente registrado
        customer_id: ID único del cliente
        description: Descripción del cargo (máximo 255 caracteres)
        metadata: Información adicional como key-value pairs
  
    Example:
        >>> payment = PaymentRequest(
        ...     amount=1000,
        ...     currency="USD", 
        ...     payment_method_id="pm_123",
        ...     customer_id="cust_456",
        ...     description="Monthly subscription"
        ... )
        >>> print(payment.amount_in_dollars())
        10.0
    """
    amount: int
    currency: str
    payment_method_id: str
    customer_id: str
    description: str
    metadata: Optional[Dict[str, str]] = None
  
    def amount_in_dollars(self) -> float:
        """Convierte el monto de centavos a dólares.
      
        Returns:
            El monto en dólares como float.
          
        Example:
            >>> payment = PaymentRequest(amount=1500, currency="USD", ...)
            >>> payment.amount_in_dollars()
            15.0
        """
        return self.amount / 100.0
  
    def validate(self) -> List[str]:
        """Valida los datos de la solicitud de pago.
      
        Returns:
            Lista de errores de validación. Lista vacía si es válido.
          
        Example:
            >>> payment = PaymentRequest(amount=-100, currency="USD", ...)
            >>> errors = payment.validate()
            >>> print(errors)
            ['Amount must be positive']
        """
        errors = []
      
        if self.amount <= 0:
            errors.append("Amount must be positive")
      
        if len(self.currency) != 3:
            errors.append("Currency must be 3-letter ISO code")
      
        if not self.payment_method_id:
            errors.append("Payment method ID is required")
      
        if len(self.description) > 255:
            errors.append("Description cannot exceed 255 characters")
      
        return errors

class PaymentProcessor:
    """Procesador principal de pagos del sistema.
  
    Esta clase maneja todo el ciclo de vida de los pagos, desde la
    validación inicial hasta el procesamiento final con el proveedor
    de pagos externo.
  
    El procesador implementa el patrón Strategy para soportar múltiples
    proveedores de pago (Stripe, PayPal, etc.) de forma transparente.
  
    Thread Safety:
        Esta clase es thread-safe. Múltiples hilos pueden usar la misma
        instancia sin problemas de concurrencia.
  
    Example:
        >>> processor = PaymentProcessor()
        >>> await processor.initialize()
        >>> 
        >>> payment_request = PaymentRequest(
        ...     amount=1000,
        ...     currency="USD",
        ...     payment_method_id="pm_123",
        ...     customer_id="cust_456",
        ...     description="Order #1234"
        ... )
        >>> 
        >>> result = await processor.process_payment(payment_request)
        >>> if result.status == PaymentStatus.COMPLETED:
        ...     print("Payment successful!")
    """
  
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Inicializa el procesador de pagos.
      
        Args:
            config: Configuración opcional del procesador. Si no se
                   proporciona, se usará la configuración por defecto.
                 
                   Claves soportadas:
                   - timeout: Timeout en segundos para requests (default: 30)
                   - retry_attempts: Número de reintentos (default: 3)
                   - provider: Proveedor de pagos ("stripe", "paypal")
      
        Example:
            >>> config = {"timeout": 60, "retry_attempts": 5}
            >>> processor = PaymentProcessor(config)
        """
        self.config = config or {}
        self.timeout = self.config.get("timeout", 30)
        self.retry_attempts = self.config.get("retry_attempts", 3)
        self.provider = self.config.get("provider", "stripe")
      
        self._payment_provider = None
        self._initialized = False
  
    async def initialize(self) -> None:
        """Inicializa el procesador y establece conexiones.
      
        Este método debe ser llamado antes de procesar cualquier pago.
        Establece conexiones con el proveedor de pagos y valida la
        configuración.
      
        Raises:
            ConnectionError: Si no se puede conectar al proveedor
            ConfigurationError: Si la configuración es inválida
          
        Example:
            >>> processor = PaymentProcessor()
            >>> await processor.initialize()
        """
        if self._initialized:
            return
      
        # Inicializar proveedor de pagos
        await self._setup_payment_provider()
      
        # Validar conexión
        await self._validate_connection()
      
        self._initialized = True
  
    async def process_payment(self, payment_request: PaymentRequest) -> 'PaymentResult':
        """Procesa una solicitud de pago de forma asíncrona.
      
        Este método maneja todo el flujo de procesamiento de pagos:
        1. Valida la solicitud
        2. Procesa el pago con el proveedor
        3. Maneja errores y reintentos
        4. Retorna el resultado
      
        Args:
            payment_request: Solicitud de pago a procesar
          
        Returns:
            PaymentResult: Resultado del procesamiento con detalles
            del estado, ID de transacción, y cualquier error.
          
        Raises:
            ValidationError: Si la solicitud es inválida
            PaymentProviderError: Si hay error con el proveedor
            TimeoutError: Si la operación tarda demasiado
          
        Example:
            >>> request = PaymentRequest(amount=1000, currency="USD", ...)
            >>> result = await processor.process_payment(request)
            >>> 
            >>> if result.status == PaymentStatus.COMPLETED:
            ...     print(f"Payment {result.transaction_id} successful")
            ... elif result.status == PaymentStatus.FAILED:
            ...     print(f"Payment failed: {result.error_message}")
      
        Note:
            El método implementa reintentos automáticos para errores
            transitorios. Los errores permanentes (tarjeta inválida)
            no se reintentan.
        """
        if not self._initialized:
            raise RuntimeError("Processor not initialized. Call initialize() first.")
      
        # 1. Validar solicitud
        errors = payment_request.validate()
        if errors:
            raise ValidationError(f"Invalid payment request: {', '.join(errors)}")
      
        # 2. Procesar con reintentos
        last_error = None
        for attempt in range(self.retry_attempts):
            try:
                result = await self._attempt_payment(payment_request)
              
                # Log del resultado
                await self._log_payment_result(payment_request, result, attempt + 1)
              
                return result
              
            except TransientError as e:
                last_error = e
                if attempt < self.retry_attempts - 1:
                    wait_time = 2 ** attempt  # Exponential backoff
                    await asyncio.sleep(wait_time)
                    continue
              
            except PermanentError as e:
                # No reintentar errores permanentes
                return PaymentResult(
                    status=PaymentStatus.FAILED,
                    transaction_id=None,
                    error_message=str(e)
                )
      
        # Si llegamos aquí, todos los reintentos fallaron
        return PaymentResult(
            status=PaymentStatus.FAILED,
            transaction_id=None,
            error_message=f"Payment failed after {self.retry_attempts} attempts: {last_error}"
        )
  
    async def get_payment_status(self, transaction_id: str) -> PaymentStatus:
        """Obtiene el estado actual de un pago por su ID de transacción.
      
        Args:
            transaction_id: ID único de la transacción
          
        Returns:
            PaymentStatus: Estado actual del pago
          
        Raises:
            NotFoundError: Si no se encuentra la transacción
            PaymentProviderError: Si hay error consultando el proveedor
          
        Example:
            >>> status = await processor.get_payment_status("txn_123")
            >>> if status == PaymentStatus.COMPLETED:
            ...     print("Payment was successful")
        """
        if not self._initialized:
            raise RuntimeError("Processor not initialized")
      
        return await self._payment_provider.get_status(transaction_id)
  
    async def refund_payment(self, transaction_id: str, amount: Optional[int] = None) -> 'RefundResult':
        """Reembolsa un pago completa o parcialmente.
      
        Args:
            transaction_id: ID de la transacción original
            amount: Monto a reembolsar en centavos. Si es None,
                   se reembolsa el monto completo.
                 
        Returns:
            RefundResult: Resultado del reembolso con detalles
          
        Raises:
            NotFoundError: Si no se encuentra la transacción
            InvalidOperationError: Si el pago no se puede reembolsar
          
        Example:
            >>> # Reembolso completo
            >>> result = await processor.refund_payment("txn_123")
            >>> 
            >>> # Reembolso parcial de $5.00
            >>> result = await processor.refund_payment("txn_123", amount=500)
        """
        # Implementación detallada...
        pass
  
    async def _setup_payment_provider(self):
        """Configura el proveedor de pagos según la configuración."""
        # Implementación interna...
        pass
  
    async def _validate_connection(self):
        """Valida la conexión con el proveedor de pagos."""
        # Implementación interna...
        pass
  
    async def _attempt_payment(self, payment_request: PaymentRequest) -> 'PaymentResult':
        """Intenta procesar un pago una vez."""
        # Implementación interna...
        pass
  
    async def _log_payment_result(self, request: PaymentRequest, result: 'PaymentResult', attempt: int):
        """Registra el resultado del pago para auditoría."""
        # Implementación interna...
        pass

@dataclass
class PaymentResult:
    """Resultado de un procesamiento de pago.
  
    Attributes:
        status: Estado final del pago
        transaction_id: ID único de la transacción (None si falló)
        error_message: Mensaje de error detallado (None si exitoso)
        processing_time_ms: Tiempo de procesamiento en milisegundos
        provider_response: Respuesta completa del proveedor de pagos
    """
    status: PaymentStatus
    transaction_id: Optional[str] = None
    error_message: Optional[str] = None
    processing_time_ms: Optional[int] = None
    provider_response: Optional[Dict[str, Any]] = None

# Excepciones personalizadas con documentación clara
class PaymentError(Exception):
    """Excepción base para errores relacionados con pagos."""
    pass

class ValidationError(PaymentError):
    """Error de validación en datos de entrada.
  
    Se lanza cuando los datos proporcionados no cumplen con los
    requisitos de validación del sistema.
    """
    pass

class TransientError(PaymentError):
    """Error transitorio que puede resolverse con reintentos.
  
    Ejemplos: timeouts de red, errores 5xx del proveedor,
    límites de rate temporales.
    """
    pass

class PermanentError(PaymentError):
    """Error permanente que no se resolverá con reintentos.
  
    Ejemplos: tarjeta inválida, fondos insuficientes,
    método de pago bloqueado.
    """
    pass

# Documentación de API usando docstrings estructurados
def calculate_processing_fee(amount: int, currency: str, payment_method: str) -> int:
    """Calcula la comisión de procesamiento para un pago.
  
    Esta función calcula la comisión que cobra el sistema por procesar
    un pago, basándose en el monto, moneda y método de pago.
  
    La fórmula de cálculo varía según el método:
    - Tarjeta de crédito: 2.9% + 30¢
    - Tarjeta de débito: 1.4% + 30¢
    - Transferencia bancaria: Tarifa fija de $5.00
  
    Args:
        amount: Monto del pago en centavos (ej: 1000 = $10.00)
        currency: Código ISO de moneda de 3 letras (ej: "USD")
        payment_method: Tipo de método ("credit_card", "debit_card", "bank_transfer")
      
    Returns:
        Comisión en centavos. Para montos muy pequeños, la comisión
        mínima es de 1 centavo.
      
    Raises:
        ValueError: Si la moneda no está soportada
        ValueError: Si el método de pago no es válido
        ValueError: Si el monto es negativo o cero
      
    Examples:
        >>> # Tarjeta de crédito: $10.00
        >>> fee = calculate_processing_fee(1000, "USD", "credit_card")
        >>> print(fee)  # 59 centavos (2.9% + 30¢)
        59
      
        >>> # Transferencia bancaria: $100.00  
        >>> fee = calculate_processing_fee(10000, "USD", "bank_transfer")
        >>> print(fee)  # $5.00 tarifa fija
        500
      
        >>> # Monto muy pequeño
        >>> fee = calculate_processing_fee(10, "USD", "credit_card")
        >>> print(fee)  # Comisión mínima
        1
      
    Note:
        Las comisiones se redondean hacia arriba al centavo más cercano.
        Para montos internacionales, se aplican conversiones de moneda
        usando las tasas actuales del mercado.
      
    Warning:
        Las tarifas pueden cambiar sin previo aviso. Esta función
        refleja las tarifas actuales pero debe consultarse la
        documentación oficial para información actualizada.
    """
    import math
  
    # Validaciones
    if amount <= 0:
        raise ValueError("Amount must be positive")
  
    if currency not in ["USD", "EUR", "GBP"]:
        raise ValueError(f"Unsupported currency: {currency}")
  
    if payment_method not in ["credit_card", "debit_card", "bank_transfer"]:
        raise ValueError(f"Invalid payment method: {payment_method}")
  
    # Cálculo de comisión
    if payment_method == "credit_card":
        fee = math.ceil(amount * 0.029) + 30
    elif payment_method == "debit_card":
        fee = math.ceil(amount * 0.014) + 30
    else:  # bank_transfer
        fee = 500  # $5.00 flat fee
  
    # Comisión mínima
    return max(fee, 1)
```

### README.md Ejemplar

```markdown
# PaymentProcessor - Sistema de Pagos Empresarial

[![Build Status](https://github.com/empresa/payment-processor/workflows/CI/badge.svg)](https://github.com/empresa/payment-processor/actions)
[![Coverage](https://codecov.io/gh/empresa/payment-processor/branch/main/graph/badge.svg)](https://codecov.io/gh/empresa/payment-processor)
[![Version](https://img.shields.io/pypi/v/payment-processor.svg)](https://pypi.org/project/payment-processor/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Un sistema robusto y escalable para procesar pagos con múltiples proveedores, diseñado para aplicaciones de misión crítica.

## 🚀 Características Principales

- **Multi-proveedor**: Soporte para Stripe, PayPal, y procesadores personalizados
- **Altamente escalable**: Maneja miles de transacciones por segundo
- **Tolerante a fallos**: Reintentos automáticos y manejo elegante de errores
- **Seguro por diseño**: Cumple con PCI DSS y mejores prácticas de seguridad
- **Completamente asíncrono**: Construido con asyncio para máximo rendimiento
- **Observabilidad**: Métricas detalladas, logging estructurado y trazabilidad

## 📦 Instalación

```bash
# Instalación básica
pip install payment-processor

# Con dependencias opcionales para desarrollo
pip install payment-processor[dev]

# Desde el código fuente
git clone https://github.com/empresa/payment-processor.git
cd payment-processor
pip install -e .
```

## 🏃‍♂️ Inicio Rápido

```python
import asyncio
from payment_processor import PaymentProcessor, PaymentRequest

async def main():
    # Configurar procesador
    processor = PaymentProcessor({
        "provider": "stripe",
        "api_key": "sk_test_...",
        "timeout": 30
    })
  
    # Inicializar
    await processor.initialize()
  
    # Crear solicitud de pago
    payment = PaymentRequest(
        amount=1000,  # $10.00 en centavos
        currency="USD",
        payment_method_id="pm_123",
        customer_id="cust_456",
        description="Compra en tienda online"
    )
  
    # Procesar pago
    result = await processor.process_payment(payment)
  
    if result.status == PaymentStatus.COMPLETED:
        print(f"¡Pago exitoso! ID: {result.transaction_id}")
    else:
        print(f"Error en pago: {result.error_message}")

# Ejecutar
asyncio.run(main())
```

## 📖 Documentación

### Configuración

El procesador acepta las siguientes opciones de configuración:


| Opción          | Tipo | Default  | Descripción                                    |
| ---------------- | ---- | -------- | ----------------------------------------------- |
| `provider`       | str  | "stripe" | Proveedor de pagos ("stripe", "paypal")         |
| `api_key`        | str  | None     | Clave API del proveedor                         |
| `timeout`        | int  | 30       | Timeout en segundos para requests               |
| `retry_attempts` | int  | 3        | Número de reintentos para errores transitorios |
| `webhook_secret` | str  | None     | Secreto para validar webhooks                   |

### Manejo de Errores

El sistema maneja automáticamente diferentes tipos de errores:

* **Errores transitorios**: Se reintentan automáticamente (timeouts, 5xx)
* **Errores permanentes**: No se reintentan (tarjeta inválida, fondos insuficientes)
* **Errores de validación**: Se reportan inmediatamente

### Estados de Pago


| Estado       | Descripción                     |
| ------------ | -------------------------------- |
| `PENDING`    | Pago creado pero no procesado    |
| `PROCESSING` | Pago en proceso de verificación |
| `COMPLETED`  | Pago exitosamente completado     |
| `FAILED`     | Pago falló                      |
| `REFUNDED`   | Pago reembolsado                 |

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# Configuración de producción
export PAYMENT_PROVIDER=stripe
export STRIPE_API_KEY=sk_live_...
export STRIPE_WEBHOOK_SECRET=whsec_...

# Configuración de desarrollo
export PAYMENT_PROVIDER=stripe
export STRIPE_API_KEY=sk_test_...
export LOG_LEVEL=DEBUG
```

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-processor
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payment-processor
  template:
    metadata:
      labels:
        app: payment-processor
    spec:
      containers:
      - name: payment-processor
        image: payment-processor:latest
        ports:
        - containerPort: 8000
        env:
        - name: STRIPE_API_KEY
          valueFrom:
            secretKeyRef:
              name: payment-secrets
              key: stripe-api-key
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
pytest

# Tests con coverage
pytest --cov=payment_processor --cov-report=html

# Tests de integración (requiere Docker)
pytest tests/integration/ --docker

# Tests de carga
pytest tests/load/ --load-test
```

## 📊 Métricas y Monitoreo

El sistema expone métricas en formato Prometheus:

```
# HELP payment_requests_total Total number of payment requests
# TYPE payment_requests_total counter
payment_requests_total{status="completed",provider="stripe"} 1543

# HELP payment_processing_duration_seconds Payment processing duration
# TYPE payment_processing_duration_seconds histogram
payment_processing_duration_seconds_bucket{provider="stripe",le="0.5"} 1234
```

### Dashboard de Grafana

Incluimos dashboards pre-configurados para Grafana en el directorio `/monitoring/`.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee nuestro [CONTRIBUTING.md](https://claude.ai/chat/CONTRIBUTING.md) para detalles sobre el proceso.

### Proceso de Desarrollo

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📋 Roadmap

* [ ]  Soporte para Apple Pay y Google Pay
* [ ]  Pagos recurrentes y suscripciones
* [ ]  Soporte para criptomonedas
* [ ]  Dashboard web para administración
* [ ]  SDK para móviles (iOS/Android)

## 🔒 Seguridad

Para reportar vulnerabilidades de seguridad, por favor envía un email a security@empresa.com. No reportes vulnerabilidades en issues públicos.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](https://claude.ai/chat/LICENSE) para detalles.

## 🆘 Soporte

* **Documentación**: [https://docs.empresa.com/payment-processor](https://docs.empresa.com/payment-processor)
* **Issues**: [GitHub Issues](https://github.com/empresa/payment-processor/issues)
* **Slack**: #payment-processor en el workspace de la empresa
* **Email**: support@empresa.com

## 📈 Performance

### Benchmarks


| Scenario            | Throughput | Latency P95 | Error Rate |
| ------------------- | ---------- | ----------- | ---------- |
| Credit Card Payment | 1,000 TPS  | 250ms       | 0.01%      |
| Bank Transfer       | 500 TPS    | 500ms       | 0.005%     |
| Refund Processing   | 200 TPS    | 1s          | 0.02%      |

*Benchmarks realizados en AWS m5.large con 2 vCPUs y 8GB RAM*

---

⭐ Si este proyecto te resulta útil, ¡considera darle una estrella en GitHub!

```

---

## 11. 👥 Liderazgo Técnico y Gestión de Equipos

### De Individual Contributor a Tech Lead

**Analogía**: Ser tech lead es como ser el director de una orquesta. No necesitas tocar todos los instrumentos perfectamente, pero debes entender cómo cada uno contribuye a la sinfonía final y asegurarte de que todos toquen en armonía.

```python
# technical_leadership.py - Herramientas para liderazgo técnico
from dataclasses import dataclass
from typing import List, Dict, Optional, Callable
from datetime import datetime, timedelta
from enum import Enum

class SkillLevel(Enum):
    JUNIOR = "junior"
    MID = "mid" 
    SENIOR = "senior"
    STAFF = "staff"
    PRINCIPAL = "principal"

class TaskComplexity(Enum):
    SIMPLE = "simple"
    MODERATE = "moderate"
    COMPLEX = "complex"
    RESEARCH = "research"

@dataclass
class TeamMember:
    """Representa un miembro del equipo técnico"""
    name: str
    skill_level: SkillLevel
    technologies: List[str]
    current_capacity: float  # 0.0 a 1.0
    learning_goals: List[str]
    mentoring_others: List[str] = None
  
    def can_handle_task(self, task_complexity: TaskComplexity, required_tech: str) -> bool:
        """Determina si el miembro puede manejar una tarea específica"""
        # Verificar tecnología
        if required_tech not in self.technologies:
            return False
      
        # Verificar complejidad vs nivel
        complexity_requirements = {
            TaskComplexity.SIMPLE: [SkillLevel.JUNIOR, SkillLevel.MID, SkillLevel.SENIOR, SkillLevel.STAFF, SkillLevel.PRINCIPAL],
            TaskComplexity.MODERATE: [SkillLevel.MID, SkillLevel.SENIOR, SkillLevel.STAFF, SkillLevel.PRINCIPAL],
            TaskComplexity.COMPLEX: [SkillLevel.SENIOR, SkillLevel.STAFF, SkillLevel.PRINCIPAL],
            TaskComplexity.RESEARCH: [SkillLevel.STAFF, SkillLevel.PRINCIPAL]
        }
      
        return self.skill_level in complexity_requirements[task_complexity]

@dataclass
class TechnicalTask:
    """Representa una tarea técnica"""
    id: str
    title: str
    description: str
    complexity: TaskComplexity
    required_technologies: List[str]
    estimated_days: float
    deadline: Optional[datetime] = None
    learning_opportunity: bool = False
    mentoring_required: bool = False

class TechnicalLeadership:
    """Sistema para gestión de liderazgo técnico"""
  
    def __init__(self):
        self.team: List[TeamMember] = []
        self.tasks: List[TechnicalTask] = []
        self.assignments: Dict[str, str] = {}  # task_id -> member_name
  
    def assign_tasks_optimally(self) -> Dict[str, str]:
        """Asigna tareas de forma óptima considerando crecimiento del equipo"""
        assignments = {}
      
        # Priorizar tareas por deadline y complejidad
        sorted_tasks = sorted(
            self.tasks, 
            key=lambda t: (t.deadline or datetime.max, t.complexity.value)
        )
      
        for task in sorted_tasks:
            best_member = self._find_best_member_for_task(task)
            if best_member:
                assignments[task.id] = best_member.name
                # Reducir capacidad disponible
                best_member.current_capacity -= (task.estimated_days / 10)  # Asumiendo sprints de 10 días
      
        return assignments
  
    def _find_best_member_for_task(self, task: TechnicalTask) -> Optional[TeamMember]:
        """Encuentra el mejor miembro para una tarea específica"""
        candidates = []
      
        for member in self.team:
            if not member.can_handle_task(task.complexity, task.required_technologies[0]):
                continue
          
            if member.current_capacity < (task.estimated_days / 10):
                continue
          
            # Calcular score considerando múltiples factores
            score = self._calculate_assignment_score(member, task)
            candidates.append((member, score))
      
        if not candidates:
            return None
      
        # Retornar el candidato con mejor score
        return max(candidates, key=lambda x: x[1])[0]
  
    def _calculate_assignment_score(self, member: TeamMember, task: TechnicalTask) -> float:
        """Calcula score para asignación considerando crecimiento y eficiencia"""
        score = 0.0
      
        # Eficiencia: miembros senior son más eficientes
        efficiency_bonus = {
            SkillLevel.JUNIOR: 0.7,
            SkillLevel.MID: 0.85,
            SkillLevel.SENIOR: 1.0,
            SkillLevel.STAFF: 1.2,
            SkillLevel.PRINCIPAL: 1.4
        }
        score += efficiency_bonus[member.skill_level] * 10
      
        # Oportunidad de aprendizaje
        if task.learning_opportunity:
            if any(tech in member.learning_goals for tech in task.required_technologies):
                score += 15  # Boost para crecimiento
      
        # Evitar sobrecarga
        if member.current_capacity > 0.8:
            score -= 10  # Penalizar sobrecarga
      
        # Balancear desarrollo: dar tareas complejas a juniors ocasionalmente
        if task.complexity == TaskComplexity.MODERATE and member.skill_level == SkillLevel.JUNIOR:
            score += 5  # Pequeño boost para desarrollo
      
        return score
  
    def plan_career_development(self, member_name: str) -> Dict[str, List[str]]:
        """Crea plan de desarrollo de carrera para un miembro"""
        member = next((m for m in self.team if m.name == member_name), None)
        if not member:
            return {}
      
        development_plan = {
            "immediate_goals": [],
            "technical_skills": [],
            "leadership_skills": [],
            "recommended_tasks": [],
            "mentoring_opportunities": []
        }
      
        # Objetivos basados en nivel actual
        if member.skill_level == SkillLevel.JUNIOR:
            development_plan["immediate_goals"] = [
                "Dominar patrones de diseño fundamentales",
                "Aprender testing automatizado",
                "Participar en code reviews"
            ]
            development_plan["technical_skills"] = [
                "Arquitectura de software básica",
                "Debugging avanzado",
                "Optimización de performance"
            ]
      
        elif member.skill_level == SkillLevel.MID:
            development_plan["immediate_goals"] = [
                "Liderar features pequeñas",
                "Mentor a developers junior",
                "Contribuir a decisiones arquitectónicas"
            ]
            development_plan["leadership_skills"] = [
                "Comunicación técnica",
                "Estimación de proyectos",
                "Facilitación de meetings técnicos"
            ]
      
        elif member.skill_level == SkillLevel.SENIOR:
            development_plan["immediate_goals"] = [
                "Diseñar sistemas complejos",
                "Liderar iniciativas técnicas",
                "Desarrollar otros seniors"
            ]
            development_plan["leadership_skills"] = [
                "Pensamiento estratégico",
                "Comunicación con stakeholders",
                "Gestión de proyectos técnicos"
            ]
      
        # Agregar tareas recomendadas
        for task in self.tasks:
            if task.learning_opportunity and any(tech in member.learning_goals for tech in task.required_technologies):
                development_plan["recommended_tasks"].append(task.title)
      
        return development_plan

class TechnicalDecisionFramework:
    """Framework para tomar decisiones técnicas estructuradas"""
  
    @dataclass
    class TechnicalDecision:
        title: str
        context: str
        options: List[Dict[str, str]]  # [{"name": "Option A", "description": "..."}]
        criteria: List[str]  # Criterios de evaluación
        decision: Optional[str] = None
        rationale: Optional[str] = None
        date_decided: Optional[datetime] = None
        stakeholders: List[str] = None
  
    def __init__(self):
        self.decisions: List[self.TechnicalDecision] = []
  
    def evaluate_options(self, decision: TechnicalDecision, weights: Dict[str, float]) -> Dict[str, float]:
        """Evalúa opciones usando matriz de decisión ponderada"""
      
        # En un sistema real, esto vendría de input del equipo
        mock_scores = {
            "Option A": {"Performance": 8, "Maintainability": 6, "Cost": 4, "Team Knowledge": 9},
            "Option B": {"Performance": 6, "Maintainability": 9, "Cost": 8, "Team Knowledge": 5},
            "Option C": {"Performance": 9, "Maintainability": 7, "Cost": 3, "Team Knowledge": 7}
        }
      
        final_scores = {}
      
        for option in decision.options:
            option_name = option["name"]
            weighted_score = 0
          
            for criterion in decision.criteria:
                score = mock_scores.get(option_name, {}).get(criterion, 5)
                weight = weights.get(criterion, 1.0)
                weighted_score += score * weight
          
            final_scores[option_name] = weighted_score
      
        return final_scores
  
    def document_decision(self, decision: TechnicalDecision, chosen_option: str, rationale: str):
        """Documenta decisión técnica para referencia futura"""
        decision.decision = chosen_option
        decision.rationale = rationale
        decision.date_decided = datetime.now()
      
        # Generar ADR (Architecture Decision Record)
        adr = self._generate_adr(decision)
      
        return adr
  
    def _generate_adr(self, decision: TechnicalDecision) -> str:
        """Genera Architecture Decision Record"""
        adr = f"""
# ADR-{len(self.decisions):03d}: {decision.title}

**Status**: Accepted
**Date**: {decision.date_decided.strftime('%Y-%m-%d')}
**Stakeholders**: {', '.join(decision.stakeholders or [])}

## Context

{decision.context}

## Decision

We will {decision.decision}.

## Rationale

{decision.rationale}

## Consequences

### Positive
- [To be filled based on chosen option]

### Negative  
- [To be filled based on chosen option]

## Options Considered

"""
      
        for i, option in enumerate(decision.options, 1):
            adr += f"\n### Option {i}: {option['name']}\n{option['description']}\n"
      
        return adr

class CodeReviewFramework:
    """Framework para code reviews efectivos"""
  
    @dataclass
    class ReviewCriteria:
        correctness: bool = False
        performance: bool = False
        security: bool = False
        maintainability: bool = False
        testing: bool = False
        documentation: bool = False
  
    def __init__(self):
        self.review_templates = {
            "backend": [
                "¿La lógica de negocio es correcta?",
                "¿Están cubiertos todos los casos edge?",
                "¿Hay validación de entrada adecuada?",
                "¿Se manejan errores apropiadamente?",
                "¿El código es eficiente y escalable?",
                "¿Hay tests unitarios e integración?",
                "¿La documentación es clara?",
                "¿Se siguen las convenciones del equipo?"
            ],
            "frontend": [
                "¿La UI/UX sigue el diseño aprobado?",
                "¿Es accesible (a11y)?",
                "¿Es responsive?",
                "¿Se manejan estados de carga y error?",
                "¿El performance es adecuado?",
                "¿Hay tests de componentes?",
                "¿Se evitan anti-patrones de React/Vue/etc?",
                "¿El código es reutilizable?"
            ],
            "database": [
                "¿Las queries están optimizadas?",
                "¿Los índices son apropiados?",
                "¿Se evitan N+1 queries?",
                "¿Las migraciones son seguras?",
                "¿Se preserva integridad de datos?",
                "¿Hay rollback plan?",
                "¿Se consideró el impacto en performance?",
                "¿La documentación de schema es clara?"
            ]
        }
  
    def generate_review_checklist(self, pr_type: str, complexity: TaskComplexity) -> List[str]:
        """Genera checklist personalizado para review"""
        base_checklist = self.review_templates.get(pr_type, self.review_templates["backend"])
      
        # Agregar items basados en complejidad
        if complexity in [TaskComplexity.COMPLEX, TaskComplexity.RESEARCH]:
            base_checklist.extend([
                "¿Se documentaron decisiones arquitectónicas?",
                "¿Se consideraron alternativas?",
                "¿Hay plan de rollback?",
                "¿Se validó con stakeholders?"
            ])
      
        return base_checklist
  
    def analyze_review_metrics(self, reviews_data: List[Dict]) -> Dict[str, float]:
        """Analiza métricas de code reviews del equipo"""
        if not reviews_data:
            return {}
      
        # Calcular métricas
        total_reviews = len(reviews_data)
        avg_review_time = sum(r.get("review_time_hours", 0) for r in reviews_data) / total_reviews
        avg_comments = sum(r.get("comment_count", 0) for r in reviews_data) / total_reviews
        approval_rate = sum(1 for r in reviews_data if r.get("approved", False)) / total_reviews
      
        # Detectar patrones problemáticos
        long_reviews = sum(1 for r in reviews_data if r.get("review_time_hours", 0) > 48)
        rubber_stamp_reviews = sum(1 for r in reviews_data if r.get("comment_count", 0) == 0 and r.get("approved", False))
      
        return {
            "avg_review_time_hours": avg_review_time,
            "avg_comments_per_review": avg_comments,
            "approval_rate": approval_rate,
            "long_review_percentage": long_reviews / total_reviews,
            "rubber_stamp_percentage": rubber_stamp_reviews / total_reviews
        }

class OnboardingProgram:
    """Programa estructurado de onboarding técnico"""
  
    def __init__(self):
        self.milestones = {
            "week_1": [
                "Setup del entorno de desarrollo",
                "Familiarización con codebase",
                "Primer commit (fix menor)",
                "Asistir a daily standups",
                "Conocer al equipo"
            ],
            "week_2": [
                "Completar primer feature pequeño",
                "Participar en code review",
                "Entender arquitectura del sistema",
                "Setup de herramientas de monitoreo",
                "Sesión con mentor asignado"
            ],
            "month_1": [
                "Completar feature de complejidad media",
                "Liderar investigación técnica pequeña",
                "Presentar learning a otros",
                "Contribuir a documentación",
                "Feedback session con manager"
            ],
            "month_3": [
                "Ownership de componente/módulo",
                "Mentor a nuevo team member",
                "Proponer mejora técnica",
                "Participar en planificación",
                "Review de onboarding program"
            ]
        }
  
    def create_personalized_plan(self, new_member: TeamMember) -> Dict[str, List[str]]:
        """Crea plan personalizado de onboarding"""
        plan = {}
      
        for period, base_milestones in self.milestones.items():
            personalized_milestones = base_milestones.copy()
          
            # Personalizar basado en nivel
            if new_member.skill_level == SkillLevel.SENIOR:
                if period == "week_1":
                    personalized_milestones.append("Review arquitectura y proponer mejoras")
                elif period == "month_1":
                    personalized_milestones.append("Liderar diseño de feature compleja")
          
            # Personalizar basado en tecnologías
            for tech in new_member.technologies:
                if tech not in ["Python", "JavaScript", "Java"]:  # Tecnologías no estándar del equipo
                    personalized_milestones.append(f"Compartir conocimiento de {tech} con equipo")
          
            plan[period] = personalized_milestones
      
        return plan
  
    def track_progress(self, member_name: str, completed_milestones: List[str]) -> Dict[str, float]:
        """Rastrea progreso de onboarding"""
        total_milestones = sum(len(milestones) for milestones in self.milestones.values())
        completed_count = len(completed_milestones)
      
        progress_by_period = {}
        for period, milestones in self.milestones.items():
            period_completed = sum(1 for m in milestones if m in completed_milestones)
            progress_by_period[period] = period_completed / len(milestones)
      
        return {
            "overall_progress": completed_count / total_milestones,
            "period_progress": progress_by_period,
            "completed_milestones": completed_count,
            "total_milestones": total_milestones
        }

# Ejemplo de uso integral
def demo_technical_leadership():
    """Demuestra uso del framework de liderazgo técnico"""
  
    # 1. Configurar equipo
    leadership = TechnicalLeadership()
  
    team_members = [
        TeamMember("Alice", SkillLevel.SENIOR, ["Python", "React", "PostgreSQL"], 0.7, ["Architecture", "GraphQL"]),
        TeamMember("Bob", SkillLevel.MID, ["Java", "Spring", "MySQL"], 0.5, ["Microservices", "Docker"]),
        TeamMember("Carol", SkillLevel.JUNIOR, ["JavaScript", "Node.js"], 0.8, ["React", "Testing"])
    ]
  
    leadership.team = team_members
  
    # 2. Definir tareas
    tasks = [
        TechnicalTask("T001", "API Authentication", "Implementar OAuth2", TaskComplexity.COMPLEX, ["Python"], 5),
        TechnicalTask("T002", "Frontend Dashboard", "Dashboard para métricas", TaskComplexity.MODERATE, ["React"], 3, learning_opportunity=True),
        TechnicalTask("T003", "Database Optimization", "Optimizar queries lentas", TaskComplexity.COMPLEX, ["PostgreSQL"], 4),
        TechnicalTask("T004", "Unit Tests", "Aumentar coverage a 90%", TaskComplexity.SIMPLE, ["Python"], 2, learning_opportunity=True)
    ]
  
    leadership.tasks = tasks
  
    # 3. Asignar tareas
    assignments = leadership.assign_tasks_optimally()
    print("Asignaciones de tareas:")
    for task_id, member_name in assignments.items():
        task = next(t for t in tasks if t.id == task_id)
        print(f"  {task.title} -> {member_name}")
  
    # 4. Plan de desarrollo de carrera
    for member in team_members:
        plan = leadership.plan_career_development(member.name)
        print(f"\nPlan de desarrollo para {member.name}:")
        print(f"  Objetivos inmediatos: {plan['immediate_goals']}")
  
    # 5. Framework de decisiones técnicas
    decision_framework = TechnicalDecisionFramework()
  
    # 6. Code review framework
    review_framework = CodeReviewFramework()
    checklist = review_framework.generate_review_checklist("backend", TaskComplexity.COMPLEX)
    print(f"\nChecklist de review para backend complejo: {checklist[:3]}...")
  
    return leadership, decision_framework, review_framework
```

---

## 12. 🎯 Casos de Estudio y Aplicación Práctica

### Caso de Estudio 1: E-commerce de Alto Tráfico

**Situación**: Startup de e-commerce que creció de 1,000 a 1,000,000 usuarios en 6 meses. Sistema original no puede manejar la carga.

**Análisis del Problema**:

```python
# problemas_identificados.py
class ScalabilityAnalysis:
    def __init__(self):
        self.current_metrics = {
            "daily_active_users": 50000,
            "peak_concurrent_users": 8000,
            "average_response_time": 3.2,  # segundos
            "error_rate": 0.15,  # 15%
            "database_cpu_usage": 0.95,  # 95%
            "server_count": 3,
            "downtime_per_month": 8  # horas
        }
      
        self.target_metrics = {
            "daily_active_users": 200000,
            "peak_concurrent_users": 30000,
            "average_response_time": 0.5,  # segundos
            "error_rate": 0.001,  # 0.1%
            "database_cpu_usage": 0.70,  # 70%
            "downtime_per_month": 0.5  # 30 minutos
        }
  
    def identify_bottlenecks(self):
        """Identifica cuellos de botella del sistema actual"""
        bottlenecks = []
      
        if self.current_metrics["database_cpu_usage"] > 0.80:
            bottlenecks.append({
                "component": "Database",
                "issue": "CPU utilization too high",
                "impact": "High latency, potential timeouts",
                "priority": "Critical"
            })
      
        if self.current_metrics["average_response_time"] > 2.0:
            bottlenecks.append({
                "component": "Application Layer",
                "issue": "Slow response times",
                "impact": "Poor user experience",
                "priority": "High"
            })
      
        if self.current_metrics["error_rate"] > 0.05:
            bottlenecks.append({
                "component": "Overall System",
                "issue": "High error rate",
                "impact": "Lost revenue, user churn",
                "priority": "Critical"
            })
      
        return bottlenecks
  
    def calculate_scaling_requirements(self):
        """Calcula requisitos de escalamiento"""
        user_growth_factor = self.target_metrics["daily_active_users"] / self.current_metrics["daily_active_users"]
        concurrent_growth_factor = self.target_metrics["peak_concurrent_users"] / self.current_metrics["peak_concurrent_users"]
      
        return {
            "user_growth_factor": user_growth_factor,
            "concurrent_growth_factor": concurrent_growth_factor,
            "recommended_server_count": self.current_metrics["server_count"] * concurrent_growth_factor,
            "estimated_database_needs": "Read replicas + connection pooling",
            "caching_strategy": "Redis cluster for session + page caching",
            "cdn_requirement": "Global CDN for static assets"
        }
```

**Solución Arquitectónica**:

```python
# solucion_ecommerce.py
class EcommerceArchitectureSolution:
    def __init__(self):
        self.migration_phases = {
            "phase_1_immediate": {
                "duration": "2-4 weeks",
                "goals": ["Stabilize current system", "Implement monitoring"],
                "actions": [
                    "Add database connection pooling",
                    "Implement Redis caching for hot data",
                    "Add load balancer",
                    "Setup comprehensive monitoring",
                    "Database query optimization"
                ],
                "expected_improvement": "50% reduction in response time"
            },
            "phase_2_scale": {
                "duration": "6-8 weeks", 
                "goals": ["Handle 4x current load", "Improve reliability"],
                "actions": [
                    "Implement read replicas for database",
                    "Microservices for user management and inventory",
                    "CDN implementation",
                    "Async processing for heavy operations",
                    "Circuit breakers and bulkheads"
                ],
                "expected_improvement": "Support 30k concurrent users"
            },
            "phase_3_optimize": {
                "duration": "8-12 weeks",
                "goals": ["Long-term scalability", "Cost optimization"],
                "actions": [
                    "Full microservices architecture",
                    "Event-driven architecture",
                    "Auto-scaling infrastructure",
                    "Advanced caching strategies",
                    "Performance optimization"
                ],
                "expected_improvement": "Linear scalability + cost efficiency"
            }
        }
  
    def design_new_architecture(self):
        """Diseña nueva arquitectura escalable"""
        return {
            "frontend": {
                "technology": "React with Next.js",
                "deployment": "CDN + edge computing",
                "caching": "Browser + CDN + service worker"
            },
            "api_gateway": {
                "technology": "Kong or AWS API Gateway",
                "features": ["Rate limiting", "Authentication", "Monitoring"]
            },
            "microservices": {
                "user_service": {
                    "responsibility": "Authentication, user profiles",
                    "database": "PostgreSQL with read replicas",
                    "caching": "Redis for sessions"
                },
                "catalog_service": {
                    "responsibility": "Product catalog, search",
                    "database": "Elasticsearch for search, PostgreSQL for data",
                    "caching": "Redis for hot products"
                },
                "inventory_service": {
                    "responsibility": "Stock management",
                    "database": "PostgreSQL with strong consistency",
                    "patterns": ["Event sourcing for audit trail"]
                },
                "order_service": {
                    "responsibility": "Order processing, payment",
                    "database": "PostgreSQL",
                    "patterns": ["Saga pattern for distributed transactions"]
                }
            },
            "data_layer": {
                "primary_db": "PostgreSQL cluster",
                "cache": "Redis cluster",
                "search": "Elasticsearch cluster",
                "analytics": "Data warehouse for reporting"
            },
            "infrastructure": {
                "containers": "Docker + Kubernetes",
                "monitoring": "Prometheus + Grafana + ELK stack",
                "deployment": "GitOps with ArgoCD",
                "scaling": "Horizontal Pod Autoscaler"
            }
        }
  
    def create_migration_timeline(self):
        """Crea timeline detallado de migración"""
        timeline = []
        start_week = 1
      
        for phase_name, phase_details in self.migration_phases.items():
            duration_weeks = int(phase_details["duration"].split("-")[1].split()[0])
          
            timeline.append({
                "phase": phase_name,
                "start_week": start_week,
                "end_week": start_week + duration_weeks - 1,
                "milestones": self._create_weekly_milestones(phase_details["actions"], duration_weeks),
                "risks": self._identify_phase_risks(phase_name),
                "success_criteria": phase_details["expected_improvement"]
            })
          
            start_week += duration_weeks
      
        return timeline
  
    def _create_weekly_milestones(self, actions: List[str], duration_weeks: int) -> Dict[int, List[str]]:
        """Crea milestones semanales para una fase"""
        milestones = {}
        actions_per_week = len(actions) // duration_weeks
      
        for week in range(1, duration_weeks + 1):
            start_idx = (week - 1) * actions_per_week
            end_idx = week * actions_per_week if week < duration_weeks else len(actions)
            milestones[week] = actions[start_idx:end_idx]
      
        return milestones
  
    def _identify_phase_risks(self, phase_name: str) -> List[str]:
        """Identifica riesgos específicos de cada fase"""
        phase_risks = {
            "phase_1_immediate": [
                "Database migration could cause downtime",
                "Cache warming might take longer than expected",
                "Load balancer configuration complexity"
            ],
            "phase_2_scale": [
                "Microservices communication complexity",
                "Data consistency challenges",
                "Team learning curve for new technologies"
            ],
            "phase_3_optimize": [
                "Over-engineering risk",
                "Cost overrun from complex infrastructure",
                "Team bandwidth for maintenance"
            ]
        }
      
        return phase_risks.get(phase_name, [])
```

### Caso de Estudio 2: Sistema Legacy Banking

**Situación**: Banco tradicional necesita modernizar sistema COBOL de 30 años para cumplir nuevas regulaciones y competir con fintech.

```python
# legacy_modernization.py
class LegacyModernizationStrategy:
    def __init__(self):
        self.legacy_system = {
            "technology": "COBOL on Mainframe",
            "database": "IMS Database",
            "age": "30 years",
            "transaction_volume": "1M transactions/day",
            "uptime_requirement": "99.99%",
            "regulatory_requirements": ["PCI DSS", "SOX", "Basel III"],
            "integration_points": 15,
            "business_critical": True
        }
  
    def assess_modernization_options(self):
        """Evalúa diferentes estrategias de modernización"""
        strategies = {
            "replatform": {
                "description": "Lift and shift to cloud with minimal changes",
                "pros": ["Quick implementation", "Low risk", "Minimal business disruption"],
                "cons": ["Limited modernization benefits", "Technical debt remains"],
                "timeline": "6-12 months",
                "cost": "Low",
                "risk": "Low"
            },
            "refactor": {
                "description": "Rewrite critical components while keeping core intact",
                "pros": ["Balanced approach", "Gradual modernization", "Controlled risk"],
                "cons": ["Complex integration", "Longer timeline"],
                "timeline": "18-24 months",
                "cost": "Medium",
                "risk": "Medium"
            },
            "rebuild": {
                "description": "Complete rewrite with modern architecture",
                "pros": ["Full modernization", "Best long-term solution", "Competitive advantage"],
                "cons": ["High risk", "Expensive", "Long timeline"],
                "timeline": "3-5 years",
                "cost": "High",
                "risk": "High"
            },
            "strangler_fig": {
                "description": "Gradually replace components while running parallel",
                "pros": ["Continuous delivery", "Risk mitigation", "Business continuity"],
                "cons": ["Complex architecture", "Dual maintenance"],
                "timeline": "2-4 years",
                "cost": "Medium-High",
                "risk": "Medium"
            }
        }
      
        return strategies
  
    def design_strangler_fig_pattern(self):
        """Diseña implementación del patrón Strangler Fig"""
        return {
            "phases": {
                "phase_1_foundation": {
                    "duration": "6 months",
                    "components": [
                        "API Gateway implementation",
                        "Event bus for integration",
                        "Modern authentication system",
                        "Monitoring and observability"
                    ],
                    "legacy_interaction": "All traffic still goes through legacy",
                    "new_capabilities": ["Modern API endpoints", "Real-time monitoring"]
                },
                "phase_2_customer_facing": {
                    "duration": "12 months", 
                    "components": [
                        "Customer portal (React/Angular)",
                        "Mobile banking app",
                        "Customer service APIs",
                        "Notification service"
                    ],
                    "legacy_interaction": "Read from legacy, write through new APIs",
                    "new_capabilities": ["Modern UX", "Real-time notifications", "Mobile-first"]
                },
                "phase_3_core_services": {
                    "duration": "18 months",
                    "components": [
                        "Account management service",
                        "Transaction processing service", 
                        "Payment processing service",
                        "Fraud detection service"
                    ],
                    "legacy_interaction": "Gradual migration of core functions",
                    "new_capabilities": ["Real-time fraud detection", "Modern payment methods"]
                },
                "phase_4_data_modernization": {
                    "duration": "12 months",
                    "components": [
                        "Modern data warehouse",
                        "Real-time analytics",
                        "Machine learning platform",
                        "Regulatory reporting automation"
                    ],
                    "legacy_interaction": "Legacy becomes secondary system",
                    "new_capabilities": ["Predictive analytics", "Automated compliance"]
                }
            },
            "architecture_patterns": {
                "api_gateway": "Single entry point with routing logic",
                "event_sourcing": "Audit trail for regulatory compliance",
                "cqrs": "Separate read/write models for optimization",
                "circuit_breaker": "Resilience patterns for legacy integration",
                "data_sync": "Bidirectional sync during transition"
            }
        }
  
    def create_risk_mitigation_plan(self):
        """Crea plan de mitigación de riesgos"""
        risks = {
            "data_consistency": {
                "probability": "High",
                "impact": "Critical", 
                "mitigation": [
                    "Implement event sourcing for audit trail",
                    "Real-time data validation between systems",
                    "Automated reconciliation processes",
                    "Rollback procedures for failed transactions"
                ]
            },
            "performance_degradation": {
                "probability": "Medium",
                "impact": "High",
                "mitigation": [
                    "Extensive load testing in staging",
                    "Performance monitoring and alerting",
                    "Gradual traffic migration with feature flags",
                    "Caching strategies for frequent operations"
                ]
            },
            "regulatory_compliance": {
                "probability": "Medium", 
                "impact": "Critical",
                "mitigation": [
                    "Continuous compliance testing",
                    "Regular audits during migration",
                    "Maintain audit trails in both systems",
                    "Legal review of all changes"
                ]
            },
            "team_knowledge_gap": {
                "probability": "High",
                "impact": "Medium",
                "mitigation": [
                    "Comprehensive training program",
                    "External consultants for knowledge transfer",
                    "Documentation of legacy system logic",
                    "Pair programming between legacy and modern teams"
                ]
            }
        }
      
        return risks
```

### Caso de Estudio 3: Startup de Healthcare SaaS

**Situación**: Startup desarrollando plataforma SaaS para hospitales. Necesita cumplir HIPAA, escalar globalmente y mantener 99.99% uptime.

```python
# healthcare_saas.py
class HealthcareSaaSArchitecture:
    def __init__(self):
        self.compliance_requirements = {
            "HIPAA": ["Data encryption", "Access controls", "Audit logging", "Data retention"],
            "GDPR": ["Data portability", "Right to erasure", "Consent management"],
            "SOC2": ["Security controls", "Availability monitoring", "Data integrity"],
            "FDA": ["Medical device software compliance", "Change control", "Risk management"]
        }
    
        self.global_requirements = {
            "regions": ["US", "EU", "APAC"],
            "data_residency": "Data must stay in region",
            "latency_targets": "< 100ms response time",
            "availability": "99.99% uptime (4.38 minutes downtime/month)"
        }
  
    def design_compliance_first_architecture(self):
        """Diseña arquitectura con compliance como prioridad principal"""
        return {
            "security_layer": {
                "encryption": {
                    "at_rest": "AES-256 with customer-managed keys",
                    "in_transit": "TLS 1.3 for all communications",
                    "application_level": "Field-level encryption for PHI"
                },
                "access_control": {
                    "authentication": "Multi-factor authentication required",
                    "authorization": "RBAC with principle of least privilege",
                    "api_security": "OAuth 2.0 with JWT tokens",
                    "network": "Zero-trust network architecture"
                },
                "audit_logging": {
                    "scope": "All data access and modifications",
                    "retention": "7 years minimum",
                    "integrity": "Cryptographic signatures",
                    "monitoring": "Real-time anomaly detection"
                }
            },
            "data_architecture": {
                "data_classification": {
                    "phi": "Protected Health Information - highest security",
                    "pii": "Personal Identifiable Information - high security", 
                    "operational": "System data - standard security",
                    "public": "Public data - basic security"
                },
                "data_isolation": {
                    "tenant_isolation": "Database per tenant for enterprise customers",
                    "shared_tenancy": "Row-level security for smaller customers",
                    "cross_region": "No data crossing regional boundaries"
                },
                "backup_strategy": {
                    "frequency": "Continuous backup with point-in-time recovery",
                    "encryption": "Encrypted backups with separate key management",
                    "testing": "Monthly restore testing",
                    "geographic": "Cross-AZ replication within region"
                }
            },
            "application_layer": {
                "microservices": {
                    "patient_service": "Patient data management with PHI encryption",
                    "provider_service": "Healthcare provider management", 
                    "appointment_service": "Scheduling and calendar management",
                    "billing_service": "Healthcare billing and insurance processing",
                    "analytics_service": "De-identified data analytics",
                    "integration_service": "HL7 FHIR standard integrations"
                },
                "api_design": {
                    "versioning": "Semantic versioning with backward compatibility",
                    "rate_limiting": "Per-tenant rate limits based on subscription",
                    "documentation": "OpenAPI 3.0 with compliance annotations",
                    "testing": "Contract testing for all integrations"
                }
            },
            "infrastructure": {
                "multi_region": {
                    "primary_regions": ["us-east-1", "eu-west-1", "ap-southeast-1"],
                    "dr_strategy": "Active-passive with 15-minute RPO",
                    "data_sync": "No cross-region data replication for compliance"
                },
                "container_platform": {
                    "orchestration": "Kubernetes with security hardening",
                    "service_mesh": "Istio for secure service communication",
                    "secrets_management": "HashiCorp Vault integration",
                    "image_scanning": "Trivy for vulnerability scanning"
                }
            }
        }
  
    def implement_hipaa_controls(self):
        """Implementa controles específicos de HIPAA"""
        return {
            "administrative_safeguards": {
                "security_officer": "Designated security officer role",
                "workforce_training": "Regular HIPAA training for all staff",
                "access_management": "Formal access request and review process",
                "contingency_plan": "Documented disaster recovery procedures",
                "audit_controls": "Regular security audits and assessments"
            },
            "physical_safeguards": {
                "facility_access": "Cloud provider physical security (SOC 2 certified)",
                "workstation_use": "Secure workstation configuration policies",
                "device_controls": "Mobile device management and encryption",
                "media_controls": "Secure disposal of storage media"
            },
            "technical_safeguards": {
                "access_control": {
                    "unique_user_identification": "Individual user accounts required",
                    "emergency_access": "Break-glass access with full logging",
                    "automatic_logoff": "Session timeout after 15 minutes inactivity",
                    "encryption_decryption": "AES-256 encryption for all PHI"
                },
                "audit_controls": {
                    "logging_scope": "All PHI access, creation, modification, deletion",
                    "log_retention": "6 years minimum retention",
                    "log_integrity": "Tamper-proof audit logs",
                    "real_time_monitoring": "Automated anomaly detection"
                },
                "integrity": {
                    "data_validation": "Checksums and digital signatures",
                    "transmission_security": "End-to-end encryption",
                    "version_control": "Complete change tracking"
                },
                "transmission_security": {
                    "network_controls": "VPN required for remote access",
                    "encryption": "TLS 1.3 minimum for all transmissions",
                    "message_authentication": "Digital signatures for critical data"
                }
            }
        }
  
    def design_global_deployment_strategy(self):
        """Diseña estrategia de deployment global"""
        return {
            "deployment_model": {
                "architecture": "Regional isolation with global management plane",
                "data_strategy": "Data residency compliance per region",
                "service_discovery": "Global DNS with regional routing",
                "load_balancing": "Geographic load balancing with health checks"
            },
            "regional_setup": {
                "us_region": {
                    "primary_az": "us-east-1a",
                    "secondary_az": "us-east-1b", 
                    "compliance": "HIPAA, SOC 2",
                    "data_center": "AWS with dedicated tenancy",
                    "backup_region": "us-west-2"
                },
                "eu_region": {
                    "primary_az": "eu-west-1a",
                    "secondary_az": "eu-west-1b",
                    "compliance": "GDPR, ISO 27001",
                    "data_center": "AWS Frankfurt",
                    "backup_region": "eu-central-1"
                },
                "apac_region": {
                    "primary_az": "ap-southeast-1a", 
                    "secondary_az": "ap-southeast-1b",
                    "compliance": "Local data protection laws",
                    "data_center": "AWS Singapore",
                    "backup_region": "ap-northeast-1"
                }
            },
            "deployment_pipeline": {
                "stages": ["dev", "staging", "prod-canary", "prod-full"],
                "approval_gates": "Manual approval for production deployments",
                "rollback_strategy": "Blue-green deployments with instant rollback",
                "compliance_checks": "Automated compliance validation in pipeline"
            }
        }
  
    def create_sla_monitoring_framework(self):
        """Crea framework de monitoreo para cumplir SLAs"""
        return {
            "sla_definitions": {
                "availability": {
                    "target": "99.99% uptime",
                    "measurement": "HTTP 200 responses / total requests",
                    "exclusions": "Planned maintenance windows",
                    "penalty": "Service credits for SLA violations"
                },
                "performance": {
                    "api_response_time": "< 200ms for 95th percentile",
                    "page_load_time": "< 2 seconds for critical workflows",
                    "data_processing": "< 1 minute for real-time analytics"
                },
                "security": {
                    "incident_response": "< 1 hour for critical security issues",
                    "vulnerability_patching": "< 72 hours for high severity",
                    "access_review": "Quarterly access certification"
                }
            },
            "monitoring_implementation": {
                "synthetic_monitoring": {
                    "tools": "Datadog Synthetics, AWS CloudWatch",
                    "frequency": "Every 60 seconds from multiple regions",
                    "scenarios": "Critical user journeys end-to-end"
                },
                "real_user_monitoring": {
                    "tools": "New Relic, LogRocket",
                    "metrics": "Page load times, error rates, user satisfaction",
                    "privacy": "HIPAA-compliant user session recording"
                },
                "infrastructure_monitoring": {
                    "metrics": "CPU, memory, disk, network across all services",
                    "logs": "Centralized logging with ELK stack",
                    "alerting": "PagerDuty integration with escalation policies"
                },
                "business_monitoring": {
                    "kpis": "Patient portal usage, provider efficiency metrics",
                    "compliance_metrics": "Audit trail completeness, access violations",
                    "financial_metrics": "Revenue per customer, churn rate"
                }
            },
            "incident_response": {
                "severity_levels": {
                    "p1_critical": "Complete service outage - 15 min response",
                    "p2_high": "Major feature unavailable - 1 hour response", 
                    "p3_medium": "Minor issues - 4 hour response",
                    "p4_low": "Cosmetic issues - next business day"
                },
                "escalation_procedures": {
                    "on_call_rotation": "24/7 engineer
```
