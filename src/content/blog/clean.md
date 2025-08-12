---
title: 'Principios, Patrones y Ejemplos Reales para Escribir Código Profesional'
code: 'software'
description: 'UÍA MASTER DE CÓDIGO LIMPIO'
pubDate: 'Agos 12 2025'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# 🎯 GUÍA MASTER DE CÓDIGO LIMPIO
## Principios, Patrones y Ejemplos Reales para Escribir Código Profesional

---

## 📚 **INTRODUCCIÓN: ¿Por Qué Código Limpio?**

> *"Cualquier tonto puede escribir código que una computadora pueda entender. Los buenos programadores escriben código que los humanos pueden entender."* - Martin Fowler

### **El Costo del Código Sucio**
- 📊 El 80% del tiempo de desarrollo se invierte en **mantenimiento**
- 🐛 El código confuso es la fuente #1 de bugs
- 💰 El código mal escrito cuesta millones en refactorización
- 😤 Desarrolladores frustrados = alta rotación de personal

### **Beneficios del Código Limpio**
- ✅ Fácil de leer y entender
- ✅ Simple de modificar y extender
- ✅ Menos propenso a errores
- ✅ Ahorra tiempo y dinero a largo plazo
- ✅ Hace felices a los desarrolladores

---

## 🔤 **CAPÍTULO 1: NOMBRES SIGNIFICATIVOS**

### **Principio #1: Usa Nombres que Revelen la Intención**

#### ❌ **CÓDIGO SUCIO:**
```javascript
// ¿Qué diablos hace esto?
function calc(x, y) {
    const d = new Date();
    const t = d.getTime();
    return x * y * 0.1 + t;
}

// Variables misteriosas
const d = getUserData();
const yrs = calcAge(d.b);
if (yrs > 18) {
    p = true;
}
```

#### ✅ **CÓDIGO LIMPIO:**
```javascript
// Claro y autodocumentado
function calculateDiscountedPriceWithTimestamp(basePrice, quantity) {
    const currentTimestamp = new Date().getTime();
    const discountRate = 0.1;
    const discountedTotal = basePrice * quantity * discountRate;
    return discountedTotal + currentTimestamp;
}

// Variables descriptivas
const userData = getUserData();
const userAgeInYears = calculateAge(userData.birthDate);
const isAdult = userAgeInYears > LEGAL_ADULT_AGE;
if (isAdult) {
    canPurchaseAlcohol = true;
}
```

### **Principio #2: Evita la Desinformación**

#### ❌ **CÓDIGO SUCIO:**
```python
# Engañoso: no es realmente una lista
accountList = {"user1": data1, "user2": data2}  

# Abreviaciones confusas
def calc_hp_dmg_for_plyr(hp, dmg):
    return hp - dmg
```

#### ✅ **CÓDIGO LIMPIO:**
```python
# Nombre preciso para un diccionario
accounts_by_username = {"user1": data1, "user2": data2}

# Nombres completos y claros
def calculate_remaining_health_after_damage(current_health, damage_amount):
    return current_health - damage_amount
```

### **Principio #3: Nombres Pronunciables y Buscables**

#### ❌ **CÓDIGO SUCIO:**
```java
// Imposible de pronunciar en una reunión
Date genymdhms; // generation year month day hour minute second
int xprdtlmt = 7; // expired product limit

// Imposible de buscar
for(int j=0; j<34; j++) {
    s += (t[j]*4)/5;
}
```

#### ✅ **CÓDIGO LIMPIO:**
```java
// Fácil de discutir con el equipo
Date generationTimestamp;
int expiredProductLimit = 7;

// Constantes nombradas, fáciles de buscar
final int TASKS_PER_DEVELOPER = 34;
final double TASK_ESTIMATE_FACTOR = 0.8; // (4/5)

for(int taskIndex = 0; taskIndex < TASKS_PER_DEVELOPER; taskIndex++) {
    realHours += (taskEstimateHours[taskIndex] * TASK_ESTIMATE_FACTOR);
}
```

---

## 🏗️ **CAPÍTULO 2: FUNCIONES LIMPIAS**

### **Principio #4: Las Funciones Deben Ser PEQUEÑAS**

#### ❌ **CÓDIGO SUCIO:**
```javascript
// Función monstruosa que hace demasiado
function processUserData(users) {
    let result = [];
    for(let i = 0; i < users.length; i++) {
        // Validación
        if(users[i].email && users[i].email.includes('@')) {
            if(users[i].age >= 18) {
                // Cálculo de descuento
                let discount = 0;
                if(users[i].isPremium) {
                    if(users[i].yearsAsCustomer > 5) {
                        discount = 0.2;
                    } else {
                        discount = 0.1;
                    }
                }
                // Formateo
                let formattedUser = {
                    name: users[i].firstName + ' ' + users[i].lastName,
                    email: users[i].email.toLowerCase(),
                    discount: discount
                };
                // Logging
                console.log('Processed user: ' + formattedUser.name);
                // Guardado
                result.push(formattedUser);
                // Envío de email
                sendEmail(formattedUser.email, 'Welcome!');
            }
        }
    }
    return result;
}
```

#### ✅ **CÓDIGO LIMPIO:**
```javascript
// Funciones pequeñas con responsabilidad única
function processUserData(users) {
    return users
        .filter(isValidUser)
        .filter(isAdult)
        .map(enrichUserWithDiscount)
        .map(formatUser)
        .map(logAndNotifyUser);
}

function isValidUser(user) {
    return user.email && user.email.includes('@');
}

function isAdult(user) {
    const LEGAL_AGE = 18;
    return user.age >= LEGAL_AGE;
}

function enrichUserWithDiscount(user) {
    return {
        ...user,
        discount: calculateDiscount(user)
    };
}

function calculateDiscount(user) {
    if (!user.isPremium) return 0;
    return user.yearsAsCustomer > 5 ? 0.2 : 0.1;
}

function formatUser(user) {
    return {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email.toLowerCase(),
        discount: user.discount
    };
}

function logAndNotifyUser(user) {
    console.log(`Processed user: ${user.name}`);
    sendWelcomeEmail(user.email);
    return user;
}
```

### **Principio #5: Una Función, Una Responsabilidad (SRP)**

#### ❌ **CÓDIGO SUCIO:**
```python
def handle_user_request(request):
    # Esta función hace TODO
    # 1. Valida
    if not request.get('email'):
        return {'error': 'Email required'}
    
    # 2. Conecta a la base de datos
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # 3. Busca el usuario
    cursor.execute("SELECT * FROM users WHERE email=?", (request['email'],))
    user = cursor.fetchone()
    
    # 4. Calcula estadísticas
    login_count = user[5] + 1
    last_login = datetime.now()
    
    # 5. Actualiza la base de datos
    cursor.execute("UPDATE users SET login_count=?, last_login=? WHERE email=?",
                   (login_count, last_login, request['email']))
    
    # 6. Envía email
    smtp = smtplib.SMTP('smtp.gmail.com', 587)
    smtp.send_message(f"Login notification for {request['email']}")
    
    # 7. Genera respuesta
    return {'success': True, 'user': user, 'login_count': login_count}
```

#### ✅ **CÓDIGO LIMPIO:**
```python
# Cada función tiene UNA responsabilidad clara
def handle_user_request(request):
    """Orquesta el proceso de login del usuario"""
    email = validate_email(request)
    user = find_user_by_email(email)
    updated_user = update_login_statistics(user)
    send_login_notification(email)
    return create_success_response(updated_user)

def validate_email(request):
    """Valida que el email existe en el request"""
    email = request.get('email')
    if not email:
        raise ValidationError('Email required')
    return email

def find_user_by_email(email):
    """Busca un usuario en la base de datos"""
    with DatabaseConnection() as db:
        return db.query_one("SELECT * FROM users WHERE email=?", email)

def update_login_statistics(user):
    """Actualiza las estadísticas de login del usuario"""
    user.login_count += 1
    user.last_login = datetime.now()
    user.save()
    return user

def send_login_notification(email):
    """Envía notificación de login por email"""
    notification_service = NotificationService()
    notification_service.send_email(
        to=email,
        subject="Login Notification",
        template="login_notification"
    )

def create_success_response(user):
    """Crea la respuesta de éxito"""
    return {
        'success': True,
        'user': user.to_dict(),
        'login_count': user.login_count
    }
```

### **Principio #6: Nivel de Abstracción Consistente**

#### ❌ **CÓDIGO SUCIO:**
```java
// Mezcla diferentes niveles de abstracción
public void processPayment(Order order) {
    // Alto nivel
    validateOrder(order);
    
    // Bajo nivel - detalles de implementación
    String url = "https://api.stripe.com/v1/charges";
    HttpClient client = HttpClient.newHttpClient();
    String apiKey = System.getenv("STRIPE_KEY");
    String body = "{\"amount\":" + order.total + ",\"currency\":\"usd\"}";
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .header("Authorization", "Bearer " + apiKey)
        .POST(HttpRequest.BodyPublishers.ofString(body))
        .build();
    
    // Alto nivel otra vez
    sendConfirmationEmail(order);
}
```

#### ✅ **CÓDIGO LIMPIO:**
```java
// Mantiene un nivel de abstracción consistente
public void processPayment(Order order) {
    validateOrder(order);
    chargePayment(order);
    sendConfirmationEmail(order);
}

private void chargePayment(Order order) {
    PaymentGateway gateway = new StripePaymentGateway();
    gateway.charge(order.getTotal(), Currency.USD);
}

// Los detalles de implementación están encapsulados
class StripePaymentGateway implements PaymentGateway {
    private static final String API_URL = "https://api.stripe.com/v1/charges";
    
    public void charge(Money amount, Currency currency) {
        HttpRequest request = buildChargeRequest(amount, currency);
        HttpResponse response = sendRequest(request);
        handleResponse(response);
    }
    
    // Detalles de bajo nivel separados
    private HttpRequest buildChargeRequest(Money amount, Currency currency) {
        // Implementación específica de Stripe
    }
}
```

---

## 💬 **CAPÍTULO 3: COMENTARIOS EFECTIVOS**

### **Principio #7: El Mejor Comentario es el Que NO Necesitas Escribir**

#### ❌ **CÓDIGO SUCIO:**
```javascript
// Comentarios redundantes e inútiles
// Incrementa i en 1
i++; 

// Establece el valor de name a "John"
let name = "John";

// Verifica si el usuario es mayor de 18
if (user.age > 18) {
    // Si es mayor de 18, establece canVote a true
    canVote = true;
}

// Esta función calcula el total
// Toma precio y cantidad como parámetros
// Multiplica precio por cantidad
// Retorna el resultado
function calculateTotal(price, quantity) {
    // Multiplica precio por cantidad
    return price * quantity; // Retorna el resultado
}
```

#### ✅ **CÓDIGO LIMPIO:**
```javascript
// Código autodocumentado - no necesita comentarios
const VOTING_AGE = 18;
const canVote = user.age > VOTING_AGE;

function calculateTotal(price, quantity) {
    return price * quantity;
}

// Comentarios ÚTILES cuando son necesarios:

// TODO: Refactorizar cuando tengamos la nueva API de pagos (Ticket #4523)
function processLegacyPayment(order) {
    // Workaround: La API antigua requiere el monto en centavos
    const amountInCents = Math.round(order.total * 100);
    return legacyAPI.charge(amountInCents);
}

// Explicación de lógica de negocio compleja
function calculateShippingCost(order) {
    // Regla de negocio: Envío gratis para premium users O pedidos > $100
    // Excepción: Productos peligrosos siempre pagan envío (regulación federal)
    if (order.containsHazardousMaterials()) {
        return HAZMAT_SHIPPING_COST;
    }
    
    if (order.user.isPremium || order.total > FREE_SHIPPING_THRESHOLD) {
        return 0;
    }
    
    return standardShippingRate(order.weight, order.destination);
}
```

### **Principio #8: Tipos de Comentarios Buenos vs Malos**

#### ❌ **COMENTARIOS MALOS:**
```python
# Comentarios obsoletos y mentirosos
def calculate_tax(amount):
    # Aplica 15% de impuesto
    return amount * 0.21  # El código dice otra cosa!

# Comentarios de diario innecesarios
# Modificado por Juan - 01/03/2020
# Modificado por María - 15/03/2020
# Bug fix por Pedro - 20/03/2020
# Otro fix por Juan - 25/03/2020

# Comentarios redundantes
# Usuario class
class User:
    # Constructor
    def __init__(self, name, email):
        self.name = name    # El nombre del usuario
        self.email = email  # El email del usuario
```

#### ✅ **COMENTARIOS BUENOS:**
```python
import re

class PasswordValidator:
    # Regex pattern explicado:
    # ^(?=.*[a-z])     - debe contener al menos una minúscula
    # (?=.*[A-Z])      - debe contener al menos una mayúscula  
    # (?=.*\d)         - debe contener al menos un dígito
    # (?=.*[@$!%*?&])  - debe contener al menos un carácter especial
    # [A-Za-z\d@$!%*?&]{8,}$ - mínimo 8 caracteres
    PASSWORD_PATTERN = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
    
    @staticmethod
    def validate(password):
        """
        Valida que la contraseña cumpla con los requisitos de seguridad.
        
        IMPORTANTE: Esta validación debe coincidir con la política de
        seguridad definida en el documento ISO-27001-Anexo-A.12.3
        
        Raises:
            PasswordPolicyError: Si la contraseña no cumple los requisitos
        """
        if not re.match(PasswordValidator.PASSWORD_PATTERN, password):
            raise PasswordPolicyError("Password doesn't meet security requirements")
        
        # SECURITY: Verificación adicional contra diccionario de contraseñas comunes
        # Ver: https://github.com/danielmiessler/SecLists/tree/master/Passwords
        if password.lower() in COMMON_PASSWORDS_SET:
            raise PasswordPolicyError("Password is too common")
        
        return True

# WARNING: No modificar sin actualizar los tests de integración
# Este threshold afecta el sistema de alertas en producción
CRITICAL_CPU_THRESHOLD = 0.85  # 85% de uso de CPU
```

---

## 🏛️ **CAPÍTULO 4: PRINCIPIOS SOLID**

### **S - Single Responsibility Principle (SRP)**

#### ❌ **VIOLANDO SRP:**
```typescript
// Esta clase hace demasiadas cosas
class User {
    constructor(
        public name: string,
        public email: string,
        public password: string
    ) {}
    
    // Responsabilidad 1: Lógica de negocio
    changePassword(newPassword: string): void {
        this.password = newPassword;
    }
    
    // Responsabilidad 2: Validación
    validateEmail(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }
    
    // Responsabilidad 3: Persistencia
    save(): void {
        const db = new Database();
        db.query(`INSERT INTO users VALUES (?, ?, ?)`, 
                [this.name, this.email, this.password]);
    }
    
    // Responsabilidad 4: Serialización
    toJSON(): string {
        return JSON.stringify({
            name: this.name,
            email: this.email
        });
    }
    
    // Responsabilidad 5: Envío de emails
    sendWelcomeEmail(): void {
        const mailer = new EmailService();
        mailer.send(this.email, 'Welcome!', 'Thanks for joining...');
    }
}
```

#### ✅ **APLICANDO SRP:**
```typescript
// Cada clase tiene UNA responsabilidad
class User {
    constructor(
        public name: string,
        public email: string,
        private password: string
    ) {}
    
    changePassword(newPassword: string): void {
        this.password = newPassword;
    }
    
    getPassword(): string {
        return this.password;
    }
}

class UserValidator {
    validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validatePassword(password: string): boolean {
        return password.length >= 8 && /\d/.test(password);
    }
}

class UserRepository {
    constructor(private db: Database) {}
    
    save(user: User): void {
        this.db.query(
            `INSERT INTO users VALUES (?, ?, ?)`,
            [user.name, user.email, user.getPassword()]
        );
    }
    
    findByEmail(email: string): User | null {
        const result = this.db.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );
        return result ? this.mapToUser(result) : null;
    }
}

class UserSerializer {
    toJSON(user: User): string {
        return JSON.stringify({
            name: user.name,
            email: user.email
        });
    }
    
    fromJSON(json: string): User {
        const data = JSON.parse(json);
        return new User(data.name, data.email, data.password);
    }
}

class UserNotificationService {
    constructor(private emailService: EmailService) {}
    
    sendWelcomeEmail(user: User): void {
        this.emailService.send(
            user.email,
            'Welcome!',
            `Thanks for joining, ${user.name}!`
        );
    }
}
```

### **O - Open/Closed Principle**

#### ❌ **VIOLANDO OCP:**
```javascript
// Cada vez que agregamos un tipo, modificamos la función
function calculateDiscount(customer) {
    switch(customer.type) {
        case 'regular':
            return customer.purchaseAmount * 0.05;
        case 'premium':
            return customer.purchaseAmount * 0.10;
        case 'vip':
            return customer.purchaseAmount * 0.20;
        // Si agregamos 'platinum', tenemos que modificar esta función
        default:
            return 0;
    }
}
```

#### ✅ **APLICANDO OCP:**
```javascript
// Abierto para extensión, cerrado para modificación
class Customer {
    constructor(purchaseAmount) {
        this.purchaseAmount = purchaseAmount;
    }
}

class RegularCustomer extends Customer {
    calculateDiscount() {
        return this.purchaseAmount * 0.05;
    }
}

class PremiumCustomer extends Customer {
    calculateDiscount() {
        return this.purchaseAmount * 0.10;
    }
}

class VIPCustomer extends Customer {
    calculateDiscount() {
        return this.purchaseAmount * 0.20;
    }
}

// Podemos agregar nuevos tipos sin modificar código existente
class PlatinumCustomer extends Customer {
    calculateDiscount() {
        return this.purchaseAmount * 0.25;
    }
}

// La función no necesita cambiar nunca
function processDiscount(customer) {
    return customer.calculateDiscount();
}
```

### **L - Liskov Substitution Principle**

#### ❌ **VIOLANDO LSP:**
```python
class Bird:
    def fly(self):
        return "Flying high!"

class Duck(Bird):
    def fly(self):
        return "Flying over the lake"

class Penguin(Bird):
    def fly(self):
        # ¡Los pingüinos no vuelan! Violación de LSP
        raise Exception("Penguins can't fly!")

# Código cliente se rompe con Penguin
def make_bird_fly(bird: Bird):
    return bird.fly()  # Explota con Penguin!
```

#### ✅ **APLICANDO LSP:**
```python
from abc import ABC, abstractmethod

class Bird(ABC):
    @abstractmethod
    def move(self):
        pass

class FlyingBird(Bird):
    def move(self):
        return self.fly()
    
    @abstractmethod
    def fly(self):
        pass

class SwimmingBird(Bird):
    def move(self):
        return self.swim()
    
    @abstractmethod
    def swim(self):
        pass

class Duck(FlyingBird, SwimmingBird):
    def fly(self):
        return "Flying over the lake"
    
    def swim(self):
        return "Swimming in the lake"
    
    def move(self):
        # Duck puede elegir cómo moverse
        return self.fly() if self.is_in_air else self.swim()

class Penguin(SwimmingBird):
    def swim(self):
        return "Swimming like a torpedo!"

# Ahora el código cliente funciona con cualquier Bird
def make_bird_move(bird: Bird):
    return bird.move()  # Funciona para todos!
```

### **I - Interface Segregation Principle**

#### ❌ **VIOLANDO ISP:**
```typescript
// Interface demasiado grande
interface Worker {
    work(): void;
    eat(): void;
    sleep(): void;
    code(): void;
    attendMeeting(): void;
    getSalary(): number;
}

// Robot no necesita comer ni dormir
class RobotWorker implements Worker {
    work(): void { /* ... */ }
    eat(): void { 
        throw new Error("Robots don't eat!"); // Violación!
    }
    sleep(): void { 
        throw new Error("Robots don't sleep!"); // Violación!
    }
    code(): void { /* ... */ }
    attendMeeting(): void { /* ... */ }
    getSalary(): number { return 0; }
}
```

#### ✅ **APLICANDO ISP:**
```typescript
// Interfaces pequeñas y específicas
interface Workable {
    work(): void;
}

interface Eatable {
    eat(): void;
}

interface Sleepable {
    sleep(): void;
}

interface Codeable {
    code(): void;
}

interface Payable {
    getSalary(): number;
}

// Cada clase implementa solo lo que necesita
class HumanDeveloper implements Workable, Eatable, Sleepable, Codeable, Payable {
    work(): void { /* ... */ }
    eat(): void { /* ... */ }
    sleep(): void { /* ... */ }
    code(): void { /* ... */ }
    getSalary(): number { return 100000; }
}

class RobotWorker implements Workable, Codeable {
    work(): void { /* ... */ }
    code(): void { /* ... */ }
    // No necesita implementar eat() o sleep()!
}

class Intern implements Workable, Eatable, Sleepable {
    work(): void { /* ... */ }
    eat(): void { /* Lots of pizza */ }
    sleep(): void { /* Not much */ }
    // No cobra salario, solo experiencia!
}
```

### **D - Dependency Inversion Principle**

#### ❌ **VIOLANDO DIP:**
```java
// Alto nivel depende de bajo nivel
public class EmailService {
    private SmtpServer smtp;
    
    public EmailService() {
        // Acoplado a implementación específica
        this.smtp = new GmailSmtpServer("smtp.gmail.com", 587);
    }
    
    public void sendEmail(String to, String subject, String body) {
        smtp.connect();
        smtp.authenticate("user", "pass");
        smtp.send(to, subject, body);
        smtp.disconnect();
    }
}

// Si queremos cambiar a SendGrid, tenemos que modificar EmailService
```

#### ✅ **APLICANDO DIP:**
```java
// Definimos abstracción
public interface EmailProvider {
    void send(String to, String subject, String body);
}

// Alto nivel depende de abstracción
public class EmailService {
    private final EmailProvider emailProvider;
    
    // Inyección de dependencia
    public EmailService(EmailProvider emailProvider) {
        this.emailProvider = emailProvider;
    }
    
    public void sendEmail(String to, String subject, String body) {
        emailProvider.send(to, subject, body);
    }
}

// Implementaciones concretas
public class GmailProvider implements EmailProvider {
    private final String username;
    private final String password;
    
    public GmailProvider(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    @Override
    public void send(String to, String subject, String body) {
        // Implementación específica de Gmail
    }
}

public class SendGridProvider implements EmailProvider {
    private final String apiKey;
    
    public SendGridProvider(String apiKey) {
        this.apiKey = apiKey;
    }
    
    @Override
    public void send(String to, String subject, String body) {
        // Implementación específica de SendGrid
    }
}

// Uso - fácil cambiar de proveedor
EmailProvider provider = new SendGridProvider("api-key");
EmailService emailService = new EmailService(provider);
```

---

## 🎨 **CAPÍTULO 5: PATRONES DE DISEÑO ESENCIALES**

### **Factory Pattern**

#### ❌ **SIN PATRÓN:**
```javascript
// Lógica de creación mezclada con lógica de negocio
function processPayment(type, amount) {
    let processor;
    
    if (type === 'credit') {
        processor = new CreditCardProcessor();
        processor.validateCard();
        processor.checkLimit(amount);
    } else if (type === 'paypal') {
        processor = new PayPalProcessor();
        processor.authenticate();
    } else if (type === 'crypto') {
        processor = new CryptoProcessor();
        processor.validateWallet();
        processor.checkGasPrice();
    }
    
    return processor.process(amount);
}
```

#### ✅ **CON FACTORY PATTERN:**
```javascript
// Factory encapsula la lógica de creación
class PaymentProcessorFactory {
    static create(type) {
        switch(type) {
            case 'credit':
                return new CreditCardProcessor();
            case 'paypal':
                return new PayPalProcessor();
            case 'crypto':
                return new CryptoProcessor();
            default:
                throw new Error(`Unknown payment type: ${type}`);
        }
    }
}

// Lógica de negocio limpia
function processPayment(type, amount) {
    const processor = PaymentProcessorFactory.create(type);
    return processor.process(amount);
}
```

### **Repository Pattern**

#### ❌ **SIN PATRÓN:**
```python
# Lógica de base de datos mezclada en todas partes
def get_user_profile(user_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # SQL directo en la lógica de negocio
    cursor.execute("""
        SELECT u.*, COUNT(o.id) as order_count 
        FROM users u 
        LEFT JOIN orders o ON u.id = o.user_id 
        WHERE u.id = ?
        GROUP BY u.id
    """, (user_id,))
    
    result = cursor.fetchone()
    conn.close()
    
    return {
        'name': result[1],
        'email': result[2],
        'order_count': result[5]
    }
```

#### ✅ **CON REPOSITORY PATTERN:**
```python
from abc import ABC, abstractmethod

# Abstracción del repositorio
class UserRepository(ABC):
    @abstractmethod
    def find_by_id(self, user_id: int):
        pass
    
    @abstractmethod
    def get_user_with_order_count(self, user_id: int):
        pass

# Implementación concreta
class SQLiteUserRepository(UserRepository):
    def __init__(self, connection_string):
        self.connection_string = connection_string
    
    def find_by_id(self, user_id: int):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            return self._map_to_user(cursor.fetchone())
    
    def get_user_with_order_count(self, user_id: int):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT u.*, COUNT(o.id) as order_count 
                FROM users u 
                LEFT JOIN orders o ON u.id = o.user_id 
                WHERE u.id = ?
                GROUP BY u.id
            """, (user_id,))
            return self._map_to_user_profile(cursor.fetchone())
    
    def _get_connection(self):
        return sqlite3.connect(self.connection_string)
    
    def _map_to_user(self, row):
        return User(id=row[0], name=row[1], email=row[2]) if row else None

# Lógica de negocio limpia
class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    def get_user_profile(self, user_id: int):
        return self.user_repository.get_user_with_order_count(user_id)
```

### **Strategy Pattern**

#### ❌ **SIN PATRÓN:**
```typescript
class PriceCalculator {
    calculate(customerType: string, basePrice: number): number {
        if (customerType === 'regular') {
            return basePrice;
        } else if (customerType === 'student') {
            return basePrice * 0.8;
        } else if (customerType === 'senior') {
            return basePrice * 0.7;
        } else if (customerType === 'employee') {
            return basePrice * 0.5;
        }
        // Más if-else para cada nuevo tipo...
        return basePrice;
    }
}
```

#### ✅ **CON STRATEGY PATTERN:**
```typescript
// Definir la estrategia
interface PricingStrategy {
    calculatePrice(basePrice: number): number;
}

// Implementar estrategias concretas
class RegularPricing implements PricingStrategy {
    calculatePrice(basePrice: number): number {
        return basePrice;
    }
}

class StudentPricing implements PricingStrategy {
    calculatePrice(basePrice: number): number {
        return basePrice * 0.8;
    }
}

class SeniorPricing implements PricingStrategy {
    calculatePrice(basePrice: number): number {
        return basePrice * 0.7;
    }
}

class EmployeePricing implements PricingStrategy {
    calculatePrice(basePrice: number): number {
        return basePrice * 0.5;
    }
}

// Contexto que usa la estrategia
class PriceCalculator {
    private strategy: PricingStrategy;
    
    constructor(strategy: PricingStrategy) {
        this.strategy = strategy;
    }
    
    setStrategy(strategy: PricingStrategy): void {
        this.strategy = strategy;
    }
    
    calculate(basePrice: number): number {
        return this.strategy.calculatePrice(basePrice);
    }
}

// Uso flexible
const calculator = new PriceCalculator(new RegularPricing());
const regularPrice = calculator.calculate(100);

calculator.setStrategy(new StudentPricing());
const studentPrice = calculator.calculate(100);
```

---

## 🧪 **CAPÍTULO 6: TESTING Y CÓDIGO TESTEABLE**

### **Principio #9: Escribe Código Testeable**

#### ❌ **CÓDIGO DIFÍCIL DE TESTEAR:**
```javascript
// Dependencias hardcodeadas, efectos secundarios, no determinístico
class OrderService {
    placeOrder(items) {
        // Dependencia directa del tiempo actual
        const orderTime = new Date();
        
        // Dependencia directa de la base de datos
        const db = new Database();
        const inventory = db.query('SELECT * FROM inventory');
        
        // Lógica mezclada
        let total = 0;
        for (let item of items) {
            const product = inventory.find(p => p.id === item.id);
            if (product.stock < item.quantity) {
                // Efecto secundario directo
                console.error(`Not enough stock for ${product.name}`);
                return false;
            }
            total += product.price * item.quantity;
        }
        
        // Más efectos secundarios
        const orderId = Math.random().toString(36);
        db.query('INSERT INTO orders...', [orderId, total, orderTime]);
        
        // Dependencia externa no inyectada
        EmailService.send(userEmail, 'Order placed!');
        
        return orderId;
    }
}
```

#### ✅ **CÓDIGO TESTEABLE:**
```javascript
// Dependencias inyectadas, funciones puras, determinístico
class OrderService {
    constructor(
        database,
        emailService,
        idGenerator,
        dateProvider
    ) {
        this.database = database;
        this.emailService = emailService;
        this.idGenerator = idGenerator;
        this.dateProvider = dateProvider;
    }
    
    async placeOrder(items, userEmail) {
        const orderTime = this.dateProvider.getCurrentTime();
        const inventory = await this.database.getInventory();
        
        // Función pura extraída
        const validation = this.validateInventory(items, inventory);
        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }
        
        const total = this.calculateTotal(items, inventory);
        const orderId = this.idGenerator.generate();
        
        await this.database.createOrder({
            id: orderId,
            total: total,
            items: items,
            timestamp: orderTime
        });
        
        await this.emailService.sendOrderConfirmation(userEmail, orderId);
        
        return { success: true, orderId: orderId };
    }
    
    // Función pura - fácil de testear
    validateInventory(items, inventory) {
        const errors = [];
        
        for (const item of items) {
            const product = inventory.find(p => p.id === item.id);
            if (!product) {
                errors.push(`Product ${item.id} not found`);
            } else if (product.stock < item.quantity) {
                errors.push(`Insufficient stock for ${product.name}`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    // Otra función pura
    calculateTotal(items, inventory) {
        return items.reduce((total, item) => {
            const product = inventory.find(p => p.id === item.id);
            return total + (product.price * item.quantity);
        }, 0);
    }
}

// Tests fáciles con mocks
describe('OrderService', () => {
    it('should calculate total correctly', () => {
        const service = new OrderService();
        const items = [
            { id: 1, quantity: 2 },
            { id: 2, quantity: 1 }
        ];
        const inventory = [
            { id: 1, price: 10 },
            { id: 2, price: 20 }
        ];
        
        const total = service.calculateTotal(items, inventory);
        expect(total).toBe(40);
    });
});
```

---

## 🛠️ **CAPÍTULO 7: REFACTORING PATTERNS**

### **Extract Method**

#### ❌ **ANTES:**
```python
def print_invoice(invoice):
    print("*" * 30)
    print(f"Invoice #{invoice.number}")
    print(f"Date: {invoice.date}")
    print("*" * 30)
    
    # Calcular subtotal
    subtotal = 0
    for item in invoice.items:
        subtotal += item.price * item.quantity
        print(f"{item.name}: ${item.price} x {item.quantity} = ${item.price * item.quantity}")
    
    # Calcular impuestos
    tax_rate = 0.21
    tax = subtotal * tax_rate
    
    # Calcular total
    total = subtotal + tax
    
    print("-" * 30)
    print(f"Subtotal: ${subtotal}")
    print(f"Tax ({tax_rate*100}%): ${tax}")
    print(f"Total: ${total}")
```

#### ✅ **DESPUÉS:**
```python
def print_invoice(invoice):
    print_header(invoice)
    print_line_items(invoice.items)
    print_totals(invoice.items)

def print_header(invoice):
    print("*" * 30)
    print(f"Invoice #{invoice.number}")
    print(f"Date: {invoice.date}")
    print("*" * 30)

def print_line_items(items):
    for item in items:
        line_total = calculate_line_total(item)
        print(f"{item.name}: ${item.price} x {item.quantity} = ${line_total}")

def calculate_line_total(item):
    return item.price * item.quantity

def print_totals(items):
    subtotal = calculate_subtotal(items)
    tax = calculate_tax(subtotal)
    total = subtotal + tax
    
    print("-" * 30)
    print(f"Subtotal: ${subtotal}")
    print(f"Tax ({TAX_RATE*100}%): ${tax}")
    print(f"Total: ${total}")

def calculate_subtotal(items):
    return sum(calculate_line_total(item) for item in items)

def calculate_tax(amount):
    return amount * TAX_RATE

TAX_RATE = 0.21
```

### **Replace Magic Numbers with Constants**

#### ❌ **ANTES:**
```java
public class PasswordValidator {
    public boolean isValid(String password) {
        if (password.length() < 8) return false;
        if (password.length() > 128) return false;
        
        int score = 0;
        if (hasUpperCase(password)) score += 25;
        if (hasLowerCase(password)) score += 25;
        if (hasDigit(password)) score += 25;
        if (hasSpecialChar(password)) score += 25;
        
        return score >= 75;
    }
}
```

#### ✅ **DESPUÉS:**
```java
public class PasswordValidator {
    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int MAX_PASSWORD_LENGTH = 128;
    private static final int SCORE_PER_CRITERIA = 25;
    private static final int MIN_ACCEPTABLE_SCORE = 75;
    
    public boolean isValid(String password) {
        if (password.length() < MIN_PASSWORD_LENGTH) return false;
        if (password.length() > MAX_PASSWORD_LENGTH) return false;
        
        int score = calculatePasswordStrengthScore(password);
        return score >= MIN_ACCEPTABLE_SCORE;
    }
    
    private int calculatePasswordStrengthScore(String password) {
        int score = 0;
        if (hasUpperCase(password)) score += SCORE_PER_CRITERIA;
        if (hasLowerCase(password)) score += SCORE_PER_CRITERIA;
        if (hasDigit(password)) score += SCORE_PER_CRITERIA;
        if (hasSpecialChar(password)) score += SCORE_PER_CRITERIA;
        return score;
    }
}
```

---

## 📋 **CAPÍTULO 8: CHECKLIST DE CÓDIGO LIMPIO**

### **✅ Checklist de Revisión de Código**

#### **NOMBRES**
- [ ] ¿Los nombres revelan la intención?
- [ ] ¿Evitas abreviaciones confusas?
- [ ] ¿Los nombres son pronunciables y buscables?
- [ ] ¿Usas nombres consistentes en todo el proyecto?

#### **FUNCIONES**
- [ ] ¿Las funciones son pequeñas (< 20 líneas)?
- [ ] ¿Cada función hace UNA sola cosa?
- [ ] ¿El nivel de abstracción es consistente?
- [ ] ¿Los parámetros son mínimos (idealmente < 3)?
- [ ] ¿Evitas flags booleanos como parámetros?

#### **COMENTARIOS**
- [ ] ¿El código es autodocumentado?
- [ ] ¿Solo hay comentarios donde agregan valor?
- [ ] ¿Los comentarios explican el POR QUÉ, no el QUÉ?
- [ ] ¿No hay comentarios obsoletos o mentirosos?

#### **FORMATO**
- [ ] ¿La indentación es consistente?
- [ ] ¿Las líneas son cortas (< 80-120 caracteres)?
- [ ] ¿Hay espaciado vertical lógico?
- [ ] ¿El código relacionado está junto?

#### **MANEJO DE ERRORES**
- [ ] ¿Usas excepciones en lugar de códigos de error?
- [ ] ¿Las excepciones son específicas?
- [ ] ¿No hay catch vacíos?
- [ ] ¿Los recursos se liberan correctamente?

#### **TESTS**
- [ ] ¿Hay tests unitarios?
- [ ] ¿Los tests son rápidos, independientes y repetibles?
- [ ] ¿Cada test prueba UNA cosa?
- [ ] ¿Los nombres de tests son descriptivos?

---

## 🎯 **CONCLUSIÓN: PRINCIPIOS FUNDAMENTALES**

### **Las 10 Reglas de Oro del Código Limpio**

1. **El código se lee más de lo que se escribe** - Optimiza para lectura
2. **Los nombres importan** - Invierte tiempo en buenos nombres
3. **Pequeño es hermoso** - Funciones y clases pequeñas
4. **Una cosa a la vez** - Single Responsibility Principle
5. **DRY (Don't Repeat Yourself)** - Evita duplicación
6. **Fail Fast** - Detecta errores temprano
7. **Refactoriza sin miedo** - Con tests, mejora continuamente
8. **YAGNI (You Aren't Gonna Need It)** - No sobre-ingenierices
9. **La consistencia vence a la perfección** - Sigue las convenciones del equipo
10. **El mejor código es el que no escribes** - Menos código = menos bugs

### **Cita Final**

> *"La diferencia entre un programador ordinario y un gran programador no es que el gran programador escriba código más complejo. Es que el gran programador escribe código más simple."* - Rich Hickey

---

## 📚 **RECURSOS ADICIONALES**

### **Libros Esenciales**
- "Clean Code" - Robert C. Martin
- "Refactoring" - Martin Fowler
- "The Pragmatic Programmer" - Hunt & Thomas
- "Design Patterns" - Gang of Four

### **Herramientas de Análisis de Código**
- **JavaScript/TypeScript**: ESLint, Prettier, SonarJS
- **Python**: Pylint, Black, mypy
- **Java**: SpotBugs, Checkstyle, PMD
- **General**: SonarQube, CodeClimate

### **Práctica Continua**
1. Code Reviews regulares
2. Pair Programming
3. Refactoring Katas
4. Contribuir a Open Source
5. Leer código de proyectos exitosos

---

*"El código limpio no se escribe siguiendo un conjunto de reglas. No te conviertes en un artesano del software aprendiendo una lista de heurísticas. El profesionalismo y la artesanía provienen de valores que impulsan las disciplinas."* - Robert C. Martin