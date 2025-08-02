---
title: 'Clases en Laravel con Analogías de la Vida Real'
code: "laravarel"
description: 'Guía Definitiva: Tipos de Clases en Laravel con Analogías de la Vida Real'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# 🏗️ Guía Definitiva: Tipos de Clases en Laravel con Analogías de la Vida Real

## 🏠 **Introducción: Laravel como una Ciudad Bien Organizada**

Imagina que Laravel es como una ciudad moderna y bien planificada. Cada tipo de clase tiene un rol específico, como los diferentes profesionales y servicios que hacen que la ciudad funcione perfectamente.

**¿Por qué usar analogías?**

* Hace que conceptos abstractos sean concretos
* Facilita recordar cuándo usar cada clase
* Ayuda a entender las responsabilidades de cada componente

---

## 🏛️ **1. MODELS - Los Ciudadanos de la Ciudad**

### **Analogía: Personas con Profesiones Específicas**

Los Models son como los ciudadanos de tu aplicación. Cada uno representa un tipo de "persona" o "entidad" con características y comportamientos específicos.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Como un "Ciudadano Doctor"
class Doctor extends Model
{
    protected $fillable = ['nombre', 'especialidad', 'telefono'];
  
    // Relaciones = "¿Con quién interactúa este ciudadano?"
    public function pacientes()
    {
        return $this->hasMany(Paciente::class); // Un doctor tiene muchos pacientes
    }
  
    public function hospital()
    {
        return $this->belongsTo(Hospital::class); // Trabaja en UN hospital
    }
  
    // Mutators = "¿Cómo se comporta este ciudadano?"
    public function setNombreAttribute($value)
    {
        $this->attributes['nombre'] = ucwords(strtolower($value)); // Siempre titulo
    }
  
    // Accessors = "¿Cómo se presenta este ciudadano?"
    public function getNombreCompletoAttribute()
    {
        return "Dr. " . $this->nombre; // Se presenta como doctor
    }
  
    // Scopes = "¿Cómo encontrar ciudadanos específicos?"
    public function scopeEspecialistas($query, $especialidad)
    {
        return $query->where('especialidad', $especialidad);
    }
}

// Uso en la vida real:
$cardiologos = Doctor::especialistas('cardiología')->get(); // Encuentra cardiólogos
$doctor = new Doctor(['nombre' => 'juan pérez']); // Se convierte en "Juan Pérez"
echo $doctor->nombre_completo; // Muestra "Dr. Juan Pérez"
```

**Otros ejemplos de Models como ciudadanos:**

* **User** = Residente con cuenta en la ciudad
* **Product** = Artículo en las tiendas
* **Order** = Comprobante de transacción
* **Category** = Clasificación de cosas

---

## 🎮 **2. CONTROLLERS - Los Directores de Orquesta**

### **Analogía: Directores de Departamentos Municipales**

Los Controllers son como los directores de diferentes departamentos en el ayuntamiento. Cada uno maneja un área específica y coordina las acciones.

```php
<?php

namespace App\Http\Controllers;

// Como el "Director del Departamento de Salud"
class DoctorController extends Controller
{
    // Como "recibir una solicitud ciudadana"
    public function index()
    {
        // El director consulta los registros
        $doctores = Doctor::with('hospital')->get();
  
        // Y presenta un informe organizado
        return view('doctores.index', compact('doctores'));
    }
  
    // Como "procesar una nueva licencia médica"
    public function store(Request $request)
    {
        // El director valida la documentación
        $request->validate([
            'nombre' => 'required|string|max:255',
            'especialidad' => 'required|string',
            'hospital_id' => 'required|exists:hospitals,id'
        ]);
  
        // Aprueba y registra al nuevo doctor
        $doctor = Doctor::create($request->only(['nombre', 'especialidad', 'hospital_id']));
  
        // Notifica el resultado
        return redirect()->route('doctores.index')
                        ->with('success', 'Doctor registrado exitosamente');
    }
  
    // Como "investigar un caso específico"
    public function show(Doctor $doctor)
    {
        // El director busca el expediente completo
        $doctor->load(['pacientes', 'hospital']);
  
        // Y presenta el informe detallado
        return view('doctores.show', compact('doctor'));
    }
  
    // Como "actualizar información de licencia"
    public function update(Request $request, Doctor $doctor)
    {
        $doctor->update($request->validated());
        return redirect()->route('doctores.show', $doctor);
    }
}
```

**Tipos especializados de Controllers:**

#### **API Controllers - Directores de Comunicación Externa**

```php
class ApiDoctorController extends Controller
{
    // Como un "Vocero de Prensa" que da información a otros países
    public function index()
    {
        $doctores = Doctor::all();
        return response()->json([
            'data' => $doctores,
            'message' => 'Lista de doctores obtenida exitosamente'
        ]);
    }
}
```

#### **Resource Controllers - Directores con Protocolo Estándar**

```php
// Director que sigue el protocolo municipal estándar (CRUD)
class HospitalController extends Controller
{
    public function index() { } // Ver todos los hospitales
    public function create() { } // Formulario para nuevo hospital
    public function store() { } // Guardar nuevo hospital
    public function show() { } // Ver hospital específico
    public function edit() { } // Formulario para editar
    public function update() { } // Actualizar hospital
    public function destroy() { } // Cerrar hospital
}
```

---

## 🛡️ **3. MIDDLEWARE - Los Guardias de Seguridad**

### **Analogía: Personal de Seguridad en Edificios**

Los Middleware son como los guardias de seguridad que verifican credenciales antes de permitir el acceso a diferentes áreas.

```php
<?php

namespace App\Http\Middleware;

// Como un "Guardia de Hospital" 
class VerificarAccesoMedico
{
    public function handle($request, Closure $next, $tipoAcceso = null)
    {
        // Como un guardia que verifica credenciales
        $usuario = $request->user();
  
        // "¿Tienes pase de empleado?"
        if (!$usuario) {
            return redirect('login')->with('error', 'Necesitas identificarte');
        }
  
        // "¿Tu pase te permite entrar a esta área?"
        if ($tipoAcceso === 'cirujano' && $usuario->tipo !== 'cirujano') {
            abort(403, 'Solo cirujanos pueden acceder al quirófano');
        }
  
        // "Todo en orden, puedes pasar"
        return $next($request);
    }
}

// Como un "Guardia de Horario"
class VerificarHorarioLaboral
{
    public function handle($request, Closure $next)
    {
        $horaActual = now()->hour;
  
        // "¿Estás intentando entrar fuera del horario?"
        if ($horaActual < 8 || $horaActual > 18) {
            return response()->json([
                'message' => 'El hospital solo atiende de 8 AM a 6 PM'
            ], 423);
        }
  
        return $next($request);
    }
}

// Como un "Detective que registra actividad"
class RegistrarActividad
{
    public function handle($request, Closure $next)
    {
        // Antes de entrar: "Anoto quién llega y cuándo"
        Log::info('Usuario accediendo', [
            'usuario' => $request->user()?->id,
            'ruta' => $request->path(),
            'hora' => now()
        ]);
  
        $response = $next($request);
  
        // Después de salir: "Anoto qué hizo y cuándo se fue"
        Log::info('Usuario completó acción', [
            'status' => $response->getStatusCode()
        ]);
  
        return $response;
    }
}
```

**Uso en rutas como controles de acceso:**

```php
// Solo doctores pueden acceder
Route::group(['middleware' => 'verificar.medico:doctor'], function () {
    Route::get('/pacientes', [PacienteController::class, 'index']);
});

// Solo en horario laboral
Route::group(['middleware' => 'horario.laboral'], function () {
    Route::resource('cirugias', CirugiaController::class);
});
```

---

## 📝 **4. REQUESTS - Los Formularios Inteligentes**

### **Analogía: Formularios de Gobierno con Validación Automática**

Los Form Requests son como formularios gubernamentales que se validan automáticamente antes de ser procesados.

```php
<?php

namespace App\Http\Requests;

// Como un "Formulario de Solicitud de Licencia Médica"
class SolicitudLicenciaMedicaRequest extends FormRequest
{
    // ¿Quién puede llenar este formulario?
    public function authorize()
    {
        // Solo personal administrativo autorizado
        return $this->user() && $this->user()->hasRole('administrador');
    }
  
    // ¿Qué campos son obligatorios y cómo deben estar llenos?
    public function rules()
    {
        return [
            'nombre' => [
                'required', 
                'string', 
                'max:255',
                'regex:/^[a-zA-ZÀ-ÿ\s]+$/' // Solo letras y espacios
            ],
            'cedula' => [
                'required',
                'string',
                'size:10', // Exactamente 10 dígitos
                'unique:doctors,cedula,' . $this->route('doctor')?->id
            ],
            'especialidad' => 'required|in:cardiología,neurología,pediatría',
            'universidad' => 'required|string|max:200',
            'año_graduacion' => 'required|integer|between:1950,' . date('Y'),
            'foto_titulo' => 'required|image|max:2048' // Máximo 2MB
        ];
    }
  
    // Mensajes personalizados como "ayuda del formulario"
    public function messages()
    {
        return [
            'cedula.size' => 'La cédula debe tener exactamente 10 dígitos',
            'cedula.unique' => 'Ya existe un doctor registrado con esta cédula',
            'especialidad.in' => 'Debe seleccionar una especialidad válida',
            'foto_titulo.image' => 'Debe subir una imagen del título',
            'foto_titulo.max' => 'La imagen no debe pesar más de 2MB'
        ];
    }
  
    // Preparar datos antes de validar (como autocompletar)
    protected function prepareForValidation()
    {
        $this->merge([
            'nombre' => ucwords(strtolower($this->nombre)), // Formato título
            'cedula' => preg_replace('/\D/', '', $this->cedula) // Solo números
        ]);
    }
  
    // Datos adicionales después de validar
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validación personalizada como "verificación cruzada"
            if ($this->año_graduacion && $this->año_graduacion > (date('Y') - 5)) {
                if (!$this->hasFile('certificado_especialidad')) {
                    $validator->errors()->add(
                        'certificado_especialidad', 
                        'Graduados recientes deben adjuntar certificado de especialidad'
                    );
                }
            }
        });
    }
}

// Uso en el controller como "Recibir formulario pre-validado"
class DoctorController extends Controller
{
    public function store(SolicitudLicenciaMedicaRequest $request)
    {
        // Aquí ya sabemos que todos los datos están correctos
        $doctor = Doctor::create($request->validated());
  
        // Guardar foto del título
        if ($request->hasFile('foto_titulo')) {
            $path = $request->file('foto_titulo')->store('titulos', 'public');
            $doctor->update(['foto_titulo' => $path]);
        }
  
        return redirect()->route('doctores.index')
                        ->with('success', 'Licencia médica aprobada');
    }
}
```

---

## 🏭 **5. JOBS - Los Trabajadores de Fondo**

### **Analogía: Personal de Mantenimiento y Servicios**

Los Jobs son como el personal que trabaja en segundo plano para mantener la ciudad funcionando mientras tú haces otras cosas.

```php
<?php

namespace App\Jobs;

// Como "Personal de Limpieza Nocturno"
class LimpiezaBaseDatos implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
  
    public $timeout = 3600; // 1 hora máximo
    public $tries = 3; // 3 intentos si falla
  
    public function handle()
    {
        // Como limpiar archivos viejos del sótano
        Storage::disk('temp')->delete(
            Storage::disk('temp')->files('older-than-30-days')
        );
  
        // Como organizar archivos de archivo
        $expedientesViejos = Expediente::where('created_at', '<', now()->subYears(5))->get();
        foreach ($expedientesViejos as $expediente) {
            $expediente->archivar(); // Mover a archivo histórico
        }
  
        Log::info('Limpieza nocturna completada: ' . now());
    }
  
    // Si algo sale mal en la limpieza
    public function failed(Throwable $exception)
    {
        Log::error('Falló la limpieza nocturna: ' . $exception->getMessage());
  
        // Notificar al supervisor de mantenimiento
        Mail::to('mantenimiento@hospital.com')->send(
            new NotificacionFalloLimpieza($exception)
        );
    }
}

// Como "Mensajero del Hospital"
class EnviarResultadosLaboratorio implements ShouldQueue
{
    protected $paciente;
    protected $resultados;
  
    public function __construct(Paciente $paciente, array $resultados)
    {
        $this->paciente = $paciente;
        $this->resultados = $resultados;
    }
  
    public function handle()
    {
        // Como un mensajero que entrega resultados
        Mail::to($this->paciente->email)->send(
            new ResultadosLaboratorio($this->paciente, $this->resultados)
        );
  
        // También actualiza el expediente
        $this->paciente->expedientes()->create([
            'tipo' => 'laboratorio',
            'resultados' => $this->resultados,
            'fecha' => now()
        ]);
  
        // Y notifica al doctor
        $this->paciente->doctor->notify(
            new NuevosResultadosDisponibles($this->paciente)
        );
    }
}

// Como "Contador Nocturno"
class CalcularEstadisticasDiarias implements ShouldQueue
{
    protected $fecha;
  
    public function __construct($fecha = null)
    {
        $this->fecha = $fecha ?? now()->toDateString();
    }
  
    public function handle()
    {
        // Como hacer el conteo diario
        $estadisticas = [
            'pacientes_atendidos' => Consulta::whereDate('created_at', $this->fecha)->count(),
            'cirugias_realizadas' => Cirugia::whereDate('fecha', $this->fecha)->count(),
            'ingresos_total' => Factura::whereDate('created_at', $this->fecha)->sum('total'),
            'ocupacion_camas' => Cama::where('ocupada', true)->count()
        ];
  
        // Guardar el reporte diario
        EstadisticaDiaria::create([
            'fecha' => $this->fecha,
            'datos' => $estadisticas
        ]);
  
        // Si es fin de mes, calcular estadísticas mensuales
        if (now()->isLastOfMonth()) {
            CalcularEstadisticasMensuales::dispatch(now()->format('Y-m'));
        }
    }
}

// Cómo usarlos en la vida real:
class ConsultaController extends Controller
{
    public function store(Request $request)
    {
        $consulta = Consulta::create($request->validated());
  
        // Después de crear la consulta, programar trabajos de fondo
  
        // Enviar confirmación por email (inmediato)
        EnviarConfirmacionConsulta::dispatch($consulta);
  
        // Recordatorio 24 horas antes (programado)
        EnviarRecordatorioConsulta::dispatch($consulta)
                                 ->delay(now()->addDay());
  
        // Actualizar estadísticas (en cola normal)
        ActualizarEstadisticasConsultas::dispatch();
  
        return redirect()->route('consultas.index');
    }
}
```

---

## 🌐 **6. RESOURCES - Los Traductores y Presentadores**

### **Analogía: Traductores de Idiomas y Presentadores de TV**

Los Resources transforman datos crudos en formatos presentables, como traductores que adaptan información para diferentes audiencias.

```php
<?php

namespace App\Http\Resources;

// Como un "Traductor de Expedientes Médicos para Pacientes"
class PacienteResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
      
            // Como "traducir jerga médica a lenguaje común"
            'nombre_completo' => $this->nombre . ' ' . $this->apellido,
            'edad' => $this->fecha_nacimiento->age . ' años',
            'sexo' => $this->sexo === 'M' ? 'Masculino' : 'Femenino',
      
            // Solo mostrar información según el contexto
            'telefono' => $this->when(
                $request->user()->can('ver-contacto-paciente'), 
                $this->telefono
            ),
      
            // Como "resumen ejecutivo" en lugar de datos técnicos
            'estado_salud' => [
                'condicion_general' => $this->getEstadoGeneral(), // Método personalizado
                'ultima_consulta' => $this->consultas->last()?->created_at?->diffForHumans(),
                'proximo_control' => $this->proxima_cita?->format('d/m/Y H:i'),
            ],
      
            // Relaciones "traducidas" también
            'doctor_asignado' => new DoctorResource($this->whenLoaded('doctor')),
            'consultas_recientes' => ConsultaResource::collection(
                $this->whenLoaded('consultas', function() {
                    return $this->consultas->take(5); // Solo las 5 más recientes
                })
            ),
      
            // Campos calculados como "interpretación"
            'nivel_riesgo' => $this->calcularNivelRiesgo(),
            'recomendaciones' => $this->getRecomendacionesPersonalizadas(),
      
            // Metadata útil
            'enlaces' => [
                'perfil' => route('pacientes.show', $this->id),
                'historico' => route('pacientes.historial', $this->id),
                'agendar_cita' => route('citas.create', ['paciente' => $this->id])
            ]
        ];
    }
  
    // Como personalizar la presentación según el contexto
    public function with($request)
    {
        return [
            'version_api' => '1.0',
            'generado_en' => now()->toISOString(),
            'generado_por' => $request->user()->nombre ?? 'Sistema'
        ];
    }
}

// Como "Presentador de Noticias" que da un resumen
class DoctorResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nombre_profesional' => 'Dr. ' . $this->nombre,
            'especialidad' => ucfirst($this->especialidad),
      
            // Como "estadísticas de rendimiento"
            'experiencia' => now()->diffInYears($this->fecha_graduacion) . ' años',
            'pacientes_atendidos' => $this->pacientes_count ?? $this->pacientes()->count(),
            'calificacion_promedio' => round($this->calificaciones_avg_puntuacion ?? 0, 1),
      
            // Solo para administradores
            'informacion_interna' => $this->when(
                $request->user()->hasRole('administrador'),
                [
                    'salario' => $this->salario,
                    'fecha_contrato' => $this->fecha_contrato,
                    'evaluaciones' => $this->evaluaciones
                ]
            ),
      
            // Horarios en formato legible
            'disponibilidad' => $this->formatearHorarios(),
            'proxima_disponibilidad' => $this->getProximaDisponibilidad()
        ];
    }
}

// Como "Traductor Especializado para APIs Externas"
class PacienteApiExternaResource extends JsonResource
{
    public function toArray($request)
    {
        // Formato específico para sistema de seguros
        return [
            'numero_afiliado' => $this->numero_seguro,
            'datos_personales' => [
                'nombres' => $this->nombre,
                'apellidos' => $this->apellido,
                'documento_identidad' => $this->cedula,
                'fecha_nacimiento' => $this->fecha_nacimiento->format('Y-m-d')
            ],
            'cobertura_medica' => [
                'plan' => $this->plan_seguro,
                'estado' => $this->estado_afiliacion,
                'vigente_hasta' => $this->vigencia_seguro
            ],
            'historial_autorizaciones' => $this->autorizaciones()
                                               ->recent()
                                               ->get()
                                               ->map(function($auth) {
                                                   return [
                                                       'codigo' => $auth->codigo,
                                                       'procedimiento' => $auth->procedimiento,
                                                       'estado' => $auth->estado
                                                   ];
                                               })
        ];
    }
}

// Uso como "Departamento de Relaciones Públicas"
class PacienteController extends Controller
{
    public function index()
    {
        $pacientes = Paciente::with(['doctor', 'consultas' => function($query) {
            $query->recent(); // Solo consultas recientes para optimizar
        }])->paginate(20);
  
        // Como un "boletín de prensa" - información formateada para el público
        return PacienteResource::collection($pacientes);
    }
  
    public function show(Paciente $paciente)
    {
        $paciente->load(['doctor', 'consultas', 'tratamientos']);
  
        // Como un "informe detallado" para una persona específica
        return new PacienteResource($paciente);
    }
  
    // API especial para sistema de seguros
    public function paraSeguro(Paciente $paciente)
    {
        return new PacienteApiExternaResource($paciente);
    }
}
```

---

## 📬 **7. NOTIFICATIONS - Los Mensajeros de la Ciudad**

### **Analogía: Sistema de Mensajería Municipal**

Las Notifications son como el sistema de mensajería de la ciudad que puede enviarte información por diferentes medios según tus preferencias.

```php
<?php

namespace App\Notifications;

// Como "Mensajero de Recordatorios Médicos"
class RecordatorioCita extends Notification implements ShouldQueue
{
    protected $cita;
    protected $tipoRecordatorio;
  
    public function __construct(Cita $cita, $tipoRecordatorio = '24h')
    {
        $this->cita = $cita;
        $this->tipoRecordatorio = $tipoRecordatorio;
    }
  
    // ¿Por qué canales puede enviarse este mensaje?
    public function via($notifiable)
    {
        $canales = ['database']; // Siempre guardar en "archivo municipal"
  
        // Como preguntar "¿Cómo prefieres que te contactemos?"
        if ($notifiable->prefiere_email) {
            $canales[] = 'mail';
        }
  
        if ($notifiable->telefono && $this->tipoRecordatorio === '2h') {
            $canales[] = 'sms'; // SMS solo para recordatorios urgentes
        }
  
        if ($notifiable->permite_push) {
            $canales[] = 'broadcast'; // Notificación push
        }
  
        return $canales;
    }
  
    // Como "Carta oficial del municipio"
    public function toMail($notifiable)
    {
        $mensaje = $this->tipoRecordatorio === '24h' 
            ? 'Le recordamos que mañana tiene cita médica'
            : 'Su cita médica es en 2 horas';
      
        return (new MailMessage)
            ->subject('Recordatorio: Cita Médica - Hospital Municipal')
            ->greeting('Estimado/a ' . $notifiable->nombre)
            ->line($mensaje)
            ->line('Fecha: ' . $this->cita->fecha_hora->format('d/m/Y'))
            ->line('Hora: ' . $this->cita->fecha_hora->format('H:i'))
            ->line('Doctor: Dr. ' . $this->cita->doctor->nombre)
            ->line('Consultorio: ' . $this->cita->consultorio->numero)
            ->action('Ver Detalles de la Cita', route('citas.show', $this->cita))
            ->line('Si necesita cancelar o reprogramar, contáctenos con al menos 2 horas de anticipación.')
            ->line('Gracias por confiar en nosotros.')
            ->salutation('Atentamente, Hospital Municipal');
    }
  
    // Como "Mensaje de texto urgente"
    public function toSms($notifiable)
    {
        return "RECORDATORIO: Cita médica HOY {$this->cita->fecha_hora->format('H:i')} con Dr. {$this->cita->doctor->nombre}. Consultorio {$this->cita->consultorio->numero}. Hospital Municipal.";
    }
  
    // Como "Nota en el archivo personal"
    public function toArray($notifiable)
    {
        return [
            'tipo' => 'recordatorio_cita',
            'cita_id' => $this->cita->id,
            'mensaje' => "Recordatorio de cita con Dr. {$this->cita->doctor->nombre}",
            'fecha_cita' => $this->cita->fecha_hora,
            'tiempo_anticipacion' => $this->tipoRecordatorio,
            'consultorio' => $this->cita->consultorio->numero,
            'acciones' => [
                'ver_cita' => route('citas.show', $this->cita),
                'cancelar' => route('citas.cancel', $this->cita)
            ]
        ];
    }
  
    // Como "Notificación en tiempo real"
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'titulo' => 'Recordatorio de Cita',
            'mensaje' => "Su cita es {$this->tipoRecordatorio === '24h' ? 'mañana' : 'en 2 horas'}",
            'icono' => 'medical-appointment',
            'sonido' => 'notification.mp3',
            'acciones' => [
                'ver' => 'Ver Cita',
                'posponer' => 'Recordar en 1 hora'
            ]
        ]);
    }
}

// Como "Mensajero de Emergencias"
class AlertaEmergenciaMedica extends Notification
{
    protected $emergencia;
  
    public function __construct(EmergenciaMedica $emergencia)
    {
        $this->emergencia = $emergencia;
    }
  
    // Emergencias van por TODOS los canales disponibles
    public function via($notifiable)
    {
        return ['mail', 'sms', 'database', 'broadcast', 'slack'];
    }
  
    public function toSlack($notifiable)
    {
        return (new SlackMessage)
            ->error() // Color rojo de emergencia
            ->to('#emergencias-medicas')
            ->content('🚨 ALERTA MÉDICA 🚨')
            ->attachment(function ($attachment) {
                $attachment->title('Código ' . $this->emergencia->codigo_emergencia)
                          ->fields([
                              'Paciente' => $this->emergencia->paciente->nombre,
                              'Ubicación' => $this->emergencia->ubicacion,
                              'Tipo' => $this->emergencia->tipo,
                              'Prioridad' => $this->emergencia->nivel_prioridad
                          ])
                          ->action('Ver Detalles', route('emergencias.show', $this->emergencia));
            });
    }
}

// Como "Boletín Informativo Municipal"
class ResumenSemanalHospital extends Notification
{
    protected $estadisticas;
  
    public function __construct(array $estadisticas)
    {
        $this->estadisticas = $estadisticas;
    }
  
    public function via($notifiable)
    {
        // Solo por email para reportes semanales
        return ['mail'];
    }
  
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Resumen Semanal - Hospital Municipal')
            ->markdown('emails.resumen-semanal', [
                'usuario' => $notifiable,
                'estadisticas' => $this->estadisticas,
                'periodo' => 'Semana del ' . now()->startOfWeek()->format('d/m') . 
                           ' al ' . now()->endOfWeek()->format('d/m/Y')
            ]);
    }
}

// Uso en la vida real como "Departamento de Comunicaciones"
class CitaController extends Controller
{
    public function store(Request $request)
    {
        $cita = Cita::create($request->validated());
  
        // Como "programar mensajeros"
  
        // Confirmación inmediata
        $cita->paciente->notify(new ConfirmacionCita($cita));
  
        // Recordatorio 24 horas antes
        $cita->paciente->notify((new RecordatorioCita($cita, '24h'))
                               ->delay(now()->until($cita->fecha_hora->subDay())));
  
        // Recordatorio 2 horas antes
        $cita->paciente->notify((new RecordatorioCita($cita, '2h'))
                               ->delay(now()->until($cita->fecha_hora->subHours(2))));
  
        return redirect()->route('citas.index');
    }
  
    public function cancelar(Cita $cita)
    {
        $cita->update(['estado' => 'cancelada']);
  
        // Notificar a todos los involucrados
        $cita->paciente->notify(new CitaCancelada($cita));
        $cita->doctor->notify(new CitaCancelada($cita));
  
        // Liberar el slot para otros pacientes
        LiberarSlotCita::dispatch($cita);
  
        return back()->with('success', 'Cita cancelada correctamente');
    }
}
```

---

## 🎧 **8. EVENTS & LISTENERS - El Sistema de Altavoces de la Ciudad**

### **Analogía: Sistema de Altavoces y Personal que Responde**

Los Events son como anuncios por altavoces de la ciudad, y los Listeners son el personal que escucha y responde automáticamente.

```php
<?php

namespace App\Events;

// Como "Anuncio por altavoces: Nueva admisión hospitalaria"
class PacienteAdmitido
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
  
    public $paciente;
    public $admision;
    public $tipoAdmision;
  
    public function __construct(Paciente $paciente, Admision $admision, $tipoAdmision = 'regular')
    {
        $this->paciente = $paciente;
        $this->admision = $admision;
        $this->tipoAdmision = $tipoAdmision;
    }
  
    // Como "metadatos del anuncio"
    public function broadcastOn()
    {
        return [
            new PrivateChannel('hospital.admisiones'),
            new PrivateChannel('doctor.' . $this->admision->doctor_id)
        ];
    }
  
    public function broadcastWith()
    {
        return [
            'paciente_nombre' => $this->paciente->nombre,
            'habitacion' => $this->admision->habitacion->numero,
            'tipo' => $this->tipoAdmision,
            'timestamp' => now()->toISOString()
        ];
    }
}

// Como "Anuncio: Emergencia médica"
class EmergenciaMedicaDeclarada
{
    public $emergencia;
    public $nivelUrgencia;
  
    public function __construct(EmergenciaMedica $emergencia, $nivelUrgencia = 'media')
    {
        $this->emergencia = $emergencia;
        $this->nivelUrgencia = $nivelUrgencia;
    }
}

// Como "Anuncio: Cirugía completada"
class CirugiaCompletada
{
    public $cirugia;
    public $resultado;
    public $duracion;
  
    public function __construct(Cirugia $cirugia, $resultado, $duracion)
    {
        $this->cirugia = $cirugia;
        $this->resultado = $resultado;
        $this->duracion = $duracion;
    }
}

namespace App\Listeners;

// Como "Personal de Admisiones que escucha anuncios"
class PrepararHabitacionPaciente
{
    public function handle(PacienteAdmitido $event)
    {
        $paciente = $event->paciente;
        $admision = $event->admision;
  
        // Como "preparar la habitación"
        $habitacion = $admision->habitacion;
        $habitacion->update([
            'estado' => 'ocupada',
            'paciente_id' => $paciente->id,
            'fecha_ocupacion' => now()
        ]);
  
        // Como "preparar el expediente"
        ExpedienteHospitalario::create([
            'paciente_id' => $paciente->id,
            'admision_id' => $admision->id,
            'fecha_apertura' => now(),
            'estado' => 'activo'
        ]);
  
        // Como "avisar al personal de limpieza"
        if ($event->tipoAdmision === 'emergencia') {
            LimpiezaUrgente::dispatch($habitacion);
        }
    }
}

// Como "Departamento de Comunicaciones que escucha"
class NotificarFamiliaresPaciente
{
    public function handle(PacienteAdmitido $event)
    {
        $paciente = $event->paciente;
  
        // Como "llamar a los contactos de emergencia"
        foreach ($paciente->contactosEmergencia as $contacto) {
            $contacto->notify(new FamiliarAdmitidoHospital($paciente, $event->admision));
        }
  
        // Como "actualizar redes sociales del hospital" (si es permitido)
        if ($paciente->permite_publicidad && $event->tipoAdmision !== 'emergencia') {
            ActualizarEstadisticasPublicas::dispatch();
        }
    }
}

// Como "Personal de Seguridad que escucha emergencias"
class ActivarProtocoloEmergencia
{
    public function handle(EmergenciaMedicaDeclarada $event)
    {
        $emergencia = $event->emergencia;
  
        // Como "activar protocolos según nivel"
        switch ($event->nivelUrgencia) {
            case 'critica':
                // Alertar a TODO el personal médico
                User::medicos()->get()->each(function($doctor) use ($emergencia) {
                    $doctor->notify(new AlertaEmergenciaCritica($emergencia));
                });
          
                // Preparar quirófano de emergencia
                QuirofanoEmergencia::activar();
          
                // Contactar ambulancias adicionales
                ServicioAmbulancia::solicitarRefuerzos();
                break;
          
            case 'alta':
                // Alertar personal de turno
                User::enTurno()->each(function($personal) use ($emergencia) {
                    $personal->notify(new AlertaEmergencia($emergencia));
                });
                break;
          
            case 'media':
                // Solo notificar al doctor de emergencias
                $emergencia->doctorAsignado->notify(new NuevaEmergencia($emergencia));
                break;
        }
  
        // Como "registrar en bitácora de seguridad"
        BitacoraSeguridad::create([
            'evento' => 'emergencia_declarada',
            'nivel' => $event->nivelUrgencia,
            'detalles' => $emergencia->toArray(),
            'timestamp' => now()
        ]);
    }
}

// Como "Departamento de Facturación que escucha"
class GenerarFacturaCirugia
{
    public function handle(CirugiaCompletada $event)
    {
        $cirugia = $event->cirugia;
  
        // Como "calcular costos automáticamente"
        $costoBase = $cirugia->procedimiento->costo_base;
        $costoTiempo = ($event->duracion / 60) * $cirugia->procedimiento->costo_por_hora;
        $costoMateriales = $cirugia->materialesUsados()->sum('costo');
  
        $total = $costoBase + $costoTiempo + $costoMateriales;
  
        // Como "generar factura automática"
        Factura::create([
            'paciente_id' => $cirugia->paciente_id,
            'cirugia_id' => $cirugia->id,
            'concepto' => 'Cirugía: ' . $cirugia->procedimiento->nombre,
            'subtotal' => $total,
            'impuestos' => $total * 0.19,
            'total' => $total * 1.19,
            'fecha_vencimiento' => now()->addDays(30)
        ]);
  
        // Como "avisar al paciente sobre la factura"
        $cirugia->paciente->notify(new FacturaGenerada($cirugia));
    }
}

// Como "Personal de Estadísticas que escucha TODO"
class ActualizarEstadisticasHospital
{
    public function handle($event)
    {
        // Como "contador universal" que registra toda actividad
        $tipoEvento = class_basename($event);
  
        EstadisticaHospital::increment('eventos_' . snake_case($tipoEvento));
  
        // Estadísticas específicas según el tipo de evento
        match($tipoEvento) {
            'PacienteAdmitido' => EstadisticaHospital::increment('admisiones_totales'),
            'CirugiaCompletada' => EstadisticaHospital::increment('cirugias_exitosas'),
            'EmergenciaMedicaDeclarada' => EstadisticaHospital::increment('emergencias_atendidas'),
            default => null
        };
  
        // Como "reporte en tiempo real"
        broadcast(new EstadisticasActualizadas(EstadisticaHospital::getResumenDiario()));
    }
}

// Registro de listeners como "Personal que escucha los altavoces"
class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        // Cuando suena "Paciente admitido", estos responden:
        PacienteAdmitido::class => [
            PrepararHabitacionPaciente::class,
            NotificarFamiliaresPaciente::class,
            ActualizarEstadisticasHospital::class,
        ],
  
        // Cuando suena "Emergencia", estos responden:
        EmergenciaMedicaDeclarada::class => [
            ActivarProtocoloEmergencia::class,
            ActualizarEstadisticasHospital::class,
        ],
  
        // Cuando suena "Cirugía completada", estos responden:
        CirugiaCompletada::class => [
            GenerarFacturaCirugia::class,
            NotificarResultadosFamilia::class,
            ActualizarExpedientePaciente::class,
            ActualizarEstadisticasHospital::class,
        ],
    ];
}

// Uso en la vida real como "Sistema de Comunicación Hospitalaria"
class AdmisionController extends Controller
{
    public function store(Request $request)
    {
        $admision = Admision::create($request->validated());
  
        // Como "hacer anuncio por altavoces"
        event(new PacienteAdmitido(
            $admision->paciente, 
            $admision, 
            $request->tipo_admision
        ));
  
        return redirect()->route('admisiones.index')
                        ->with('success', 'Paciente admitido. Personal notificado automáticamente.');
    }
}
```

---

## 🎨 **9. SERVICE PROVIDERS - Los Arquitectos de la Ciudad**

### **Analogía: Departamento de Planificación Urbana**

Los Service Providers son como el departamento que planifica y organiza cómo funciona toda la ciudad antes de que abra al público.

```php
<?php

namespace App\Providers;

// Como "Departamento de Servicios Médicos"
class ServicioMedicoProvider extends ServiceProvider
{
    // Como "planificar qué servicios médicos necesita la ciudad"
    public function register()
    {
        // Como "contratar personal especializado"
        $this->app->singleton('servicio.diagnostico', function ($app) {
            return new ServicioDiagnostico(
                $app->make('laboratorio.analisis'),
                $app->make('radiologia.imagenes'),
                $app->make('cardiologia.electrocardiograma')
            );
        });
  
        // Como "establecer servicio de ambulancias"
        $this->app->singleton('servicio.ambulancia', function ($app) {
            $config = config('hospital.ambulancias');
            return new ServicioAmbulancia(
                $config['flota_disponible'],
                $config['tiempo_respuesta_maximo'],
                $app->make('gps.tracking')
            );
        });
  
        // Como "configurar sistema de turnos médicos"
        $this->app->bind('servicio.turnos', function ($app) {
            return new ServicioTurnos(
                $app->make('calendario.medico'),
                $app->make('notificacion.personal')
            );
        });
    }
  
    // Como "inaugurar los servicios y conectar todo"
    public function boot()
    {
        // Como "establecer protocolos de emergencia"
        EmergenciaMedica::observe(EmergenciaObserver::class);
  
        // Como "configurar horarios de atención"
        $this->configurarHorariosAtencion();
  
        // Como "establecer políticas del hospital"
        Gate::define('acceder-quirofano', function ($user) {
            return $user->hasRole(['cirujano', 'anestesiologo', 'enfermero-quirofano']);
        });
  
        Gate::define('ver-expediente-completo', function ($user, $paciente) {
            return $user->doctor_id === $paciente->doctor_id || 
                   $user->hasRole('administrador');
        });
  
        // Como "configurar sistema de pagos"
        $this->configurarSistemaPagos();
  
        // Como "establecer macros médicos"
        Blade::directive('expedienteMedico', function ($expression) {
            return "<?php echo app('servicio.expediente')->generar($expression); ?>";
        });
  
        // Como "configurar validaciones médicas personalizadas"
        Validator::extend('cedula_valida', function ($attribute, $value, $parameters, $validator) {
            return app('validador.cedula')->validar($value);
        });
  
        Validator::extend('edad_minima_cirugia', function ($attribute, $value, $parameters, $validator) {
            $edadMinima = $parameters[0] ?? 18;
            return Carbon::parse($value)->age >= $edadMinima;
        });
    }
  
    private function configurarHorariosAtencion()
    {
        // Como "establecer horarios de cada departamento"
        config([
            'hospital.horarios.urgencias' => '24/7',
            'hospital.horarios.consulta_externa' => '08:00-18:00',
            'hospital.horarios.laboratorio' => '06:00-20:00',
            'hospital.horarios.farmacia' => '08:00-22:00'
        ]);
    }
  
    private function configurarSistemaPagos()
    {
        // Como "establecer métodos de pago aceptados"
        $this->app->singleton('pago.procesador', function ($app) {
            return new ProcesadorPagos([
                'efectivo' => EfectivoProcessor::class,
                'tarjeta' => TarjetaProcessor::class,
                'seguro' => SeguroMedicoProcessor::class,
                'credito_hospital' => CreditoHospitalProcessor::class
            ]);
        });
    }
}

// Como "Departamento de Tecnología Hospitalaria"
class TecnologiaHospitalProvider extends ServiceProvider
{
    public function register()
    {
        // Como "instalar sistema de historia clínica electrónica"
        $this->app->singleton('historia.clinica', function ($app) {
            return new HistoriaClinicaElectronica(
                $app->make('database.manager'),
                $app->make('encriptacion.medica'),
                $app->make('backup.automatico')
            );
        });
  
        // Como "configurar sistema de imaging médico"
        $this->app->singleton('imaging.medico', function ($app) {
            return new SistemaImagingMedico([
                'almacenamiento' => storage_path('imagenes_medicas'),
                'formatos_soportados' => ['DICOM', 'JPEG', 'PNG'],
                'compresion' => true,
                'backup_automatico' => true
            ]);
        });
    }
  
    public function boot()
    {
        // Como "configurar rutas del sistema hospitalario"
        $this->configurarRutasMedicas();
  
        // Como "establecer middleware médico"
        $router = $this->app['router'];
        $router->aliasMiddleware('hipaa.compliance', HipaaComplianceMiddleware::class);
        $router->aliasMiddleware('auditoria.medica', AuditoriaMedicaMiddleware::class);
  
        // Como "configurar comandos de mantenimiento"
        if ($this->app->runningInConsole()) {
            $this->commands([
                BackupHistoriaClinica::class,
                LimpiezaArchivosTemporales::class,
                GenerarReporteMensual::class,
                SincronizarConSeguro::class
            ]);
        }
    }
  
    private function configurarRutasMedicas()
    {
        Route::prefix('api/hospital')
             ->middleware(['api', 'hipaa.compliance', 'auditoria.medica'])
             ->group(function () {
                 Route::apiResource('pacientes', PacienteController::class);
                 Route::apiResource('doctores', DoctorController::class);
                 Route::apiResource('citas', CitaController::class);
           
                 // Rutas especializadas
                 Route::post('emergencia', [EmergenciaController::class, 'declararEmergencia']);
                 Route::get('turnos/disponibles', [TurnoController::class, 'disponibles']);
                 Route::post('prescripcion/validar', [PrescripcionController::class, 'validar']);
             });
    }
}

// Como "Departamento de Seguridad y Cumplimiento"
class SeguridadHospitalProvider extends ServiceProvider
{
    public function boot()
    {
        // Como "establecer políticas de seguridad médica"
        $this->establecerPoliticasSeguridad();
  
        // Como "configurar auditoría automática"
        $this->configurarAuditoria();
  
        // Como "establecer encriptación de datos médicos"
        $this->configurarEncriptacion();
    }
  
    private function establecerPoliticasSeguridad()
    {
        // Políticas según HIPAA y regulaciones médicas
        Gate::define('acceder-datos-sensibles', function ($user, $paciente) {
            // Solo el doctor asignado, enfermeros del turno, o admin
            return $user->id === $paciente->doctor_id ||
                   ($user->hasRole('enfermero') && $user->turno_actual) ||
                   $user->hasRole('administrador');
        });
  
        Gate::define('modificar-historia-clinica', function ($user, $paciente) {
            // Solo profesionales médicos autorizados
            return $user->hasAnyRole(['doctor', 'enfermero']) &&
                   $user->verificado_colegio_medico &&
                   $user->licencia_vigente;
        });
    }
  
    private function configurarAuditoria()
    {
        // Como "sistema de cámaras de seguridad" para datos
        Model::observe(AuditoriaUniversal::class);
  
        // Eventos específicos que requieren auditoría especial
        Event::listen('*', function ($eventName, array $data) {
            if (str_contains($eventName, 'medico') || str_contains($eventName, 'paciente')) {
                AuditoriaEspecializada::registrar($eventName, $data);
            }
        });
    }
}

// Registro de todos los providers como "Consejo Municipal"
// config/app.php
'providers' => [
    // Providers del sistema base...
  
    // Providers del hospital
    App\Providers\ServicioMedicoProvider::class,
    App\Providers\TecnologiaHospitalProvider::class,
    App\Providers\SeguridadHospitalProvider::class,
    App\Providers\FacturacionProvider::class,
    App\Providers\ReportesProvider::class,
],

// Uso en la vida real como "Sistema Municipal Integrado"
class HospitalServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Como "crear el hospital completo de una vez"
        $this->app->singleton('hospital', function ($app) {
            return new Hospital([
                'servicios_medicos' => $app->make('servicio.diagnostico'),
                'sistema_turnos' => $app->make('servicio.turnos'),
                'ambulancias' => $app->make('servicio.ambulancia'),
                'historia_clinica' => $app->make('historia.clinica'),
                'sistema_pagos' => $app->make('pago.procesador'),
                'imaging_medico' => $app->make('imaging.medico')
            ]);
        });
    }
  
    public function boot()
    {
        // Como "inauguración oficial del hospital"
        $this->publishes([
            __DIR__.'/../config/hospital.php' => config_path('hospital.php'),
        ], 'hospital-config');
  
        $this->publishes([
            __DIR__.'/../database/migrations/hospital' => database_path('migrations'),
        ], 'hospital-migrations');
  
        $this->loadViewsFrom(__DIR__.'/../resources/views/hospital', 'hospital');
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang/hospital', 'hospital');
  
        // Como "establecer el hospital como disponible en toda la aplicación"
        View::composer('*', function ($view) {
            $view->with('hospital', app('hospital'));
        });
    }
}
```

---

## 🎨 **10. FACADES - Los Departamentos de Atención al Cliente**

### **Analogía: Ventanillas de Atención Unificada**

Los Facades son como las ventanillas de atención al cliente donde puedes hacer cualquier trámite sin saber cuál departamento lo maneja internamente.

```php
<?php

namespace App\Facades;

// Como "Ventanilla de Servicios Médicos"
class ServicioMedico extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'servicio.medico'; // Se conecta al servicio real registrado en el provider
    }
}

// Como "Ventanilla de Historia Clínica"
class HistoriaClinica extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'historia.clinica';
    }
}

// Como "Ventanilla de Pagos Hospitalarios"
class PagoHospital extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'pago.hospital';
    }
}

namespace App\Services;

// El servicio real que maneja todo internamente
class ServicioMedicoManager
{
    protected $laboratorio;
    protected $radiologia;
    protected $farmacia;
  
    public function __construct($laboratorio, $radiologia, $farmacia)
    {
        $this->laboratorio = $laboratorio;
        $this->radiologia = $radiologia;
        $this->farmacia = $farmacia;
    }
  
    // Como "coordinar examen completo"
    public function examinarPaciente(Paciente $paciente, array $tiposExamen)
    {
        $resultados = collect();
  
        foreach ($tiposExamen as $tipo) {
            $resultado = match($tipo) {
                'sangre' => $this->laboratorio->analizarSangre($paciente),
                'rayos_x' => $this->radiologia->tomarRayosX($paciente),
                'ecografia' => $this->radiologia->realizarEcografia($paciente),
                'cardiograma' => $this->laboratorio->electrocardiograma($paciente),
                default => throw new Exception("Tipo de examen no disponible: $tipo")
            };
      
            $resultados->put($tipo, $resultado);
        }
  
        return $resultados;
    }
  
    // Como "prescribir tratamiento completo"
    public function prescribirTratamiento(Paciente $paciente, array $medicamentos, array $procedimientos = [])
    {
        $prescripcion = new Prescripcion([
            'paciente_id' => $paciente->id,
            'fecha' => now(),
            'medicamentos' => [],
            'procedimientos' => []
        ]);
  
        // Verificar disponibilidad de medicamentos
        foreach ($medicamentos as $medicamento) {
            $disponibilidad = $this->farmacia->verificarStock($medicamento['nombre']);
      
            if (!$disponibilidad) {
                $this->farmacia->solicitarMedicamento($medicamento['nombre']);
            }
      
            $prescripcion->medicamentos[] = [
                'nombre' => $medicamento['nombre'],
                'dosis' => $medicamento['dosis'],
                'frecuencia' => $medicamento['frecuencia'],
                'disponible' => $disponibilidad
            ];
        }
  
        // Programar procedimientos
        foreach ($procedimientos as $procedimiento) {
            $this->programarProcedimiento($paciente, $procedimiento);
        }
  
        $prescripcion->save();
        return $prescripcion;
    }
  
    // Como "agendar cita automáticamente"
    public function agendarConsulta(Paciente $paciente, $especialidad, $urgencia = 'normal')
    {
        $doctoresDisponibles = Doctor::especialistas($especialidad)
                                   ->disponibles()
                                   ->get();
  
        if ($doctoresDisponibles->isEmpty()) {
            throw new Exception("No hay doctores disponibles para $especialidad");
        }
  
        $proximaFecha = match($urgencia) {
            'urgente' => now()->addHours(2),
            'alta' => now()->addDays(1),
            'normal' => now()->addDays(7),
            'control' => now()->addDays(30)
        };
  
        $doctor = $doctoresDisponibles->first();
        $horaDisponible = $doctor->proximaHoraDisponible($proximaFecha);
  
        return Cita::create([
            'paciente_id' => $paciente->id,
            'doctor_id' => $doctor->id,
            'fecha_hora' => $horaDisponible,
            'tipo' => $especialidad,
            'urgencia' => $urgencia
        ]);
    }
}

// Uso super simple con Facades como "ir a una sola ventanilla"
class ConsultaController extends Controller
{
    public function realizarConsultaCompleta(Request $request, Paciente $paciente)
    {
        // Como "ir a la ventanilla y pedir todo lo que necesitas"
  
        // 1. Examinar al paciente
        $resultadosExamenes = ServicioMedico::examinarPaciente($paciente, [
            'sangre', 'rayos_x', 'cardiograma'
        ]);
  
        // 2. Prescribir tratamiento basado en resultados
        $tratamiento = ServicioMedico::prescribirTratamiento($paciente, [
            ['nombre' => 'Paracetamol', 'dosis' => '500mg', 'frecuencia' => 'cada 8 horas'],
            ['nombre' => 'Ibuprofeno', 'dosis' => '400mg', 'frecuencia' => 'cada 12 horas']
        ]);
  
        // 3. Programar cita de control
        $citaControl = ServicioMedico::agendarConsulta($paciente, 'medicina_general', 'control');
  
        // 4. Generar factura automáticamente
        $factura = PagoHospital::generarFactura($paciente, [
            'consulta' => 50000,
            'examenes' => $resultadosExamenes->count() * 25000,
            'medicamentos' => $tratamiento->costoMedicamentos()
        ]);
  
        // 5. Actualizar historia clínica
        HistoriaClinica::agregarEntrada($paciente, [
            'tipo' => 'consulta',
            'examenes' => $resultadosExamenes,
            'tratamiento' => $tratamiento,
            'proxima_cita' => $citaControl,
            'doctor' => auth()->user()
        ]);
  
        return view('consultas.resultado', compact(
            'paciente', 'resultadosExamenes', 'tratamiento', 'citaControl', 'factura'
        ));
    }
  
    // Sin Facades tendrías que hacer esto (mucho más complicado):
    public function realizarConsultaCompletaSinFacades(Request $request, Paciente $paciente)
    {
        // Inyectar manualmente todos los servicios
        $servicioMedico = app('servicio.medico');
        $servicioHistoria = app('historia.clinica');
        $servicioPago = app('pago.hospital');
  
        // Y usarlos uno por uno
        $resultados = $servicioMedico->examinarPaciente($paciente, ['sangre']);
        $historia = $servicioHistoria->agregarEntrada($paciente, $resultados);
        $pago = $servicioPago->generarFactura($paciente, ['consulta' => 50000]);
  
        // Mucho más código y más difícil de leer
    }
}

// Como "Ventanilla de Emergencias"
class EmergenciaHospital extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'emergencia.hospital';
    }
}

class EmergenciaManager
{
    public function declararCodigo($tipo, $ubicacion, $detalles = [])
    {
        $codigosEmergencia = [
            'azul' => 'Paro cardíaco adulto',
            'rosa' => 'Emergencia pediátrica',
            'rojo' => 'Incendio',
            'gris' => 'Violencia en el hospital',
            'amarillo' => 'Paciente desaparecido'
        ];
  
        $emergencia = EmergenciaMedica::create([
            'codigo' => $tipo,
            'descripcion' => $codigosEmergencia[$tipo] ?? 'Emergencia general',
            'ubicacion' => $ubicacion,
            'detalles' => $detalles,
            'estado' => 'activa',
            'hora_inicio' => now()
        ]);
  
        // Activar protocolos automáticamente
        $this->activarProtocolo($tipo, $emergencia);
  
        return $emergencia;
    }
  
    private function activarProtocolo($codigo, $emergencia)
    {
        match($codigo) {
            'azul' => $this->protocoloParoCardiaco($emergencia),
            'rosa' => $this->protocoloEmergenciaPediatrica($emergencia),
            'rojo' => $this->protocoloIncendio($emergencia),
            'gris' => $this->protocoloSeguridad($emergencia),
            'amarillo' => $this->protocoloBusquedaPaciente($emergencia)
        };
    }
}

// Uso simple de emergencias
class EmergenciaController extends Controller
{
    public function declararEmergencia(Request $request)
    {
        // Una sola línea para manejar emergencia completa
        $emergencia = EmergenciaHospital::declararCodigo(
            $request->codigo,
            $request->ubicacion,
            $request->detalles
        );
  
        return response()->json([
            'mensaje' => 'Código ' . $request->codigo . ' activado',
            'emergencia_id' => $emergencia->id,
            'personal_notificado' => true,
            'protocolos_activados' => true
        ]);
    }
}

// Registrar facades en config/app.php
'aliases' => [
    // Facades de Laravel...
  
    // Facades del hospital
    'ServicioMedico' => App\Facades\ServicioMedico::class,
    'HistoriaClinica' => App\Facades\HistoriaClinica::class,
    'PagoHospital' => App\Facades\PagoHospital::class,
    'EmergenciaHospital' => App\Facades\EmergenciaHospital::class,
],
```

---

## 📦 **11. COLLECTIONS - Los Organizadores Profesionales**

### **Analogía: Especialistas en Organización y Clasificación**

Las Collections son como organizadores profesionales que toman un montón de cosas desordenadas y las organizan, filtran, agrupan y transforman de manera eficiente.

```php
<?php

// Como "Organizador de Expedientes Médicos"
class PacienteCollection extends Collection
{
    // Como "agrupar pacientes por especialidad médica"
    public function porEspecialidad()
    {
        return $this->groupBy(function ($paciente) {
            return $paciente->doctor->especialidad;
        })->map(function ($grupo, $especialidad) {
            return [
                'especialidad' => $especialidad,
                'total_pacientes' => $grupo->count(),
                'pacientes' => $grupo,
                'promedio_edad' => $grupo->avg('edad'),
                'casos_urgentes' => $grupo->where('urgencia', 'alta')->count()
            ];
        });
    }
  
    // Como "encontrar pacientes de alto riesgo"
    public function altoRiesgo()
    {
        return $this->filter(function ($paciente) {
            return $paciente->edad > 65 || 
                   $paciente->tiene_diabetes || 
                   $paciente->tiene_hipertension ||
                   $paciente->historial_familiar_cardiaco;
        })->sortByDesc('nivel_riesgo');
    }
  
    // Como "programar citas automáticamente"
    public function programarCitasAutomaticas()
    {
        return $this->map(function ($paciente) {
            $ultimaConsulta = $paciente->consultas->last();
            $diasSinConsulta = $ultimaConsulta ? 
                              $ultimaConsulta->created_at->diffInDays(now()) : 365;
      
            $necesitaConsulta = match(true) {
                $paciente->tiene_diabetes && $diasSinConsulta > 90 => 'control_diabetes',
                $paciente->edad > 65 && $diasSinConsulta > 180 => 'control_geriatrico',
                $paciente->embarazada => 'control_prenatal',
                $diasSinConsulta > 365 => 'chequeo_anual',
                default => null
            };
      
            if ($necesitaConsulta) {
                return [
                    'paciente' => $paciente,
                    'tipo_cita' => $necesitaConsulta,
                    'urgencia' => $this->calcularUrgencia($paciente, $diasSinConsulta),
                    'especialidad_requerida' => $this->determinarEspecialidad($necesitaConsulta)
                ];
            }
      
            return null;
        })->filter(); // Remover nulls
    }
  
    // Como "generar reporte de salud poblacional"
    public function reporteSaludPoblacional()
    {
        $totalPacientes = $this->count();
  
        return [
            'demografia' => [
                'total' => $totalPacientes,
                'por_genero' => $this->countBy('genero'),
                'por_grupo_edad' => $this->groupBy(function($p) {
                    return match(true) {
                        $p->edad < 18 => 'pediatrico',
                        $p->edad < 65 => 'adulto',
                        default => 'geriatrico'
                    };
                })->map->count(),
                'edad_promedio' => round($this->avg('edad'), 1)
            ],
            'prevalencias' => [
                'diabetes' => $this->where('tiene_diabetes', true)->count(),
                'hipertension' => $this->where('tiene_hipertension', true)->count(),
                'obesidad' => $this->where('imc', '>', 30)->count(),
                'fumadores' => $this->where('fuma', true)->count()
            ],
            'indicadores_riesgo' => [
                'alto_riesgo_cardiovascular' => $this->altoRiesgo()->count(),
                'pacientes_sin_control_anual' => $this->filter(function($p) {
                    return $p->consultas->last()?->created_at?->diffInDays(now()) > 365;
                })->count()
            ]
        ];
    }
}

// Como "Organizador de Inventario Hospitalario"
class InventarioCollection extends Collection
{
    // Como "revisar qué necesita reabastecimiento"
    public function requiereReabastecimiento()
    {
        return $this->filter(function ($item) {
            $stockMinimo = $item->stock_minimo ?? 10;
            return $item->cantidad_actual <= $stockMinimo;
        })->sortBy('cantidad_actual')
          ->map(function ($item) {
              return [
                  'producto' => $item->nombre,
                  'cantidad_actual' => $item->cantidad_actual,
                  'cantidad_minima' => $item->stock_minimo,
                  'urgencia' => $this->calcularUrgenciaReabastecimiento($item),
                  'proveedor_sugerido' => $item->proveedor_principal,
                  'costo_estimado' => $item->precio_unitario * $item->cantidad_pedido_sugerida
              ];
          });
    }
  
    // Como "organizar por categorías médicas"
    public function porCategoriasMedicas()
    {
        return $this->groupBy('categoria')
                   ->map(function ($items, $categoria) {
                       $valorTotal = $items->sum(function($item) {
                           return $item->cantidad_actual * $item->precio_unitario;
                       });
                 
                       return [
                           'categoria' => $categoria,
                           'total_items' => $items->count(),
                           'valor_inventario' => $valorTotal,
                           'items_criticos' => $items->where('cantidad_actual', '<=', 'stock_minimo')->count(),
                           'proximos_vencer' => $items->filter(function($item) {
                               return $item->fecha_vencimiento && 
                                      $item->fecha_vencimiento->diffInDays(now()) <= 30;
                           })->count()
                       ];
                   });
    }
  
    // Como "detectar medicamentos próximos a vencer"
    public function proximosVencer($diasAnticipacion = 30)
    {
        return $this->filter(function ($medicamento) use ($diasAnticipacion) {
            return $medicamento->fecha_vencimiento && 
                   $medicamento->fecha_vencimiento->diffInDays(now()) <= $diasAnticipacion;
        })->sortBy('fecha_vencimiento')
          ->map(function ($medicamento) {
              $diasRestantes = $medicamento->fecha_vencimiento->diffInDays(now());
        
              return [
                  'medicamento' => $medicamento->nombre,
                  'lote' => $medicamento->numero_lote,
                  'cantidad' => $medicamento->cantidad_actual,
                  'fecha_vencimiento' => $medicamento->fecha_vencimiento->format('d/m/Y'),
                  'dias_restantes' => $diasRestantes,
                  'accion_recomendada' => match(true) {
                      $diasRestantes <= 7 => 'Retirar inmediatamente',
                      $diasRestantes <= 15 => 'Usar prioritariamente',
                      $diasRestantes <= 30 => 'Monitorear uso',
                      default => 'Normal'
                  },
                  'valor_perdida' => $medicamento->cantidad_actual * $medicamento->precio_unitario
              ];
          });
    }
}

// Como "Organizador de Horarios y Turnos"
class TurnoCollection extends Collection
{
    // Como "optimizar distribución de turnos"
    public function optimizarDistribucion()
    {
        $totalHoras = $this->sum('horas_asignadas');
        $doctoresDisponibles = $this->pluck('doctor')->unique();
  
        return $this->groupBy('especialidad')
                   ->map(function ($turnos, $especialidad) use ($totalHoras) {
                       $horasEspecialidad = $turnos->sum('horas_asignadas');
                       $porcentajeCobertura = ($horasEspecialidad / $totalHoras) * 100;
                 
                       return [
                           'especialidad' => $especialidad,
                           'turnos_asignados' => $turnos->count(),
                           'horas_totales' => $horasEspecialidad,
                           'porcentaje_cobertura' => round($porcentajeCobertura, 1),
                           'doctores_involucrados' => $turnos->pluck('doctor_id')->unique()->count(),
                           'distribucion_semanal' => $this->distribucionSemanal($turnos),
                           'recomendaciones' => $this->generarRecomendaciones($turnos, $porcentajeCobertura)
                       ];
                   });
    }
  
    // Como "detectar conflictos de horarios"
    public function detectarConflictos()
    {
        $conflictos = collect();
  
        $this->groupBy('doctor_id')->each(function ($turnosDoctor, $doctorId) use ($conflictos) {
            $turnosOrdenados = $turnosDoctor->sortBy('hora_inicio');
      
            for ($i = 0; $i < $turnosOrdenados->count() - 1; $i++) {
                $turnoActual = $turnosOrdenados->values()[$i];
                $turnoSiguiente = $turnosOrdenados->values()[$i + 1];
          
                if ($turnoActual->hora_fin > $turnoSiguiente->hora_inicio) {
                    $conflictos->push([
                        'doctor' => $turnoActual->doctor->nombre,
                        'turno1' => $turnoActual,
                        'turno2' => $turnoSiguiente,
                        'tiempo_conflicto' => $turnoActual->hora_fin->diffInMinutes($turnoSiguiente->hora_inicio),
                        'solucion_sugerida' => $this->sugerirSolucion($turnoActual, $turnoSiguiente)
                    ]);
                }
            }
        });
  
        return $conflictos;
    }
}

// Uso en controllers como "Jefe de Organización"
class ReporteController extends Controller
{
    public function dashboardMedico()
    {
        // Como "pedirle al organizador que prepare todo"
        $pacientes = Paciente::with(['doctor', 'consultas'])->get();
        $inventario = Inventario::all();
        $turnos = Turno::with('doctor')->whereDate('fecha', today())->get();
  
        // Usar las collections como organizadores especializados
        $reportePacientes = $pacientes->reporteSaludPoblacional();
        $citasPendientes = $pacientes->programarCitasAutomaticas();
        $inventarioCritico = $inventario->requiereReabastecimiento();
        $medicamentosVencimiento = $inventario->proximosVencer(30);
        $optimizacionTurnos = $turnos->optimizarDistribucion();
  
        return view('dashboard.medico', compact(
            'reportePacientes',
            'citasPendientes', 
            'inventarioCritico',
            'medicamentosVencimiento',
            'optimizacionTurnos'
        ));
    }
  
    public function alertasAutomaticas()
    {
        // Como "sistema de alertas automático"
        $alertas = collect();
  
        // Alertas de pacientes
        $pacientesAltoRiesgo = Paciente::all()->altoRiesgo();
        if ($pacientesAltoRiesgo->count() > 0) {
            $alertas->push([
                'tipo' => 'pacientes_alto_riesgo',
                'cantidad' => $pacientesAltoRiesgo->count(),
                'urgencia' => 'alta',
                'accion' => 'Programar controles inmediatos'
            ]);
        }
  
        // Alertas de inventario
        $stockCritico = Inventario::all()->requiereReabastecimiento();
        if ($stockCritico->count() > 0) {
            $alertas->push([
                'tipo' => 'stock_critico',
                'cantidad' => $stockCritico->count(),
                'urgencia' => 'media',
                'accion' => 'Realizar pedidos de reabastecimiento'
            ]);
        }
  
        // Alertas de turnos
        $conflictosTurnos = Turno::whereDate('fecha', today())->get()->detectarConflictos();
        if ($conflictosTurnos->count() > 0) {
            $alertas->push([
                'tipo' => 'conflictos_turnos',
                'cantidad' => $conflictosTurnos->count(),
                'urgencia' => 'alta',
                'accion' => 'Resolver conflictos de horarios'
            ]);
        }
  
        return response()->json($alertas);
    }
}

// Como extender Collection para uso general
Collection::macro('porcentajeDe', function ($callback) {
    $total = $this->count();
    $coincidencias = $this->filter($callback)->count();
  
    return $total > 0 ? round(($coincidencias / $total) * 100, 2) : 0;
});

Collection::macro('promedioSeguro', function ($key) {
    $valores = $this->pluck($key)->filter(function ($valor) {
        return is_numeric($valor) && $valor > 0;
    });
  
    return $valores->count() > 0 ? $valores->avg() : 0;
});

// Uso de macros personalizados
$pacientes = Paciente::all();

$porcentajeDiabeticos = $pacientes->porcentajeDe(fn($p) => $p->tiene_diabetes);
$edadPromedio = $pacientes->promedioSeguro('edad');
```

---

## 🗂️ **12. COMMANDS - Los Asistentes Automatizados**

### **Analogía: Personal de Mantenimiento y Asistentes Especializados**

Los Artisan Commands son como asistentes especializados que realizan tareas específicas cuando se lo pides, especialmente trabajos de mantenimiento y administración.

```php
<?php

namespace App\Console\Commands;

// Como "Asistente de Mantenimiento Nocturno"
class LimpiezaNocturnaHospital extends Command
{
    protected $signature = 'hospital:limpieza-nocturna 
                          {--dias-antiguos=30 : Días para considerar archivos antiguos}
                          {--forzar : Ejecutar sin confirmación}';
  
    protected $description = 'Realiza limpieza automática de archivos temporales y datos obsoletos del hospital';
  
    public function handle()
    {
        $diasAntiguos = $this->option('dias-antiguos');
        $forzar = $this->option('forzar');
  
        $this->info('🧹 Iniciando limpieza nocturna del hospital...');
  
        // Como "limpieza de archivos temporales"
        $this->limpiarArchivosTemporales($diasAntiguos);
  
        // Como "organizar archivos de imágenes médicas"
        $this->organizarImagenesMedicas();
  
        // Como "limpiar logs antiguos"
        $this->limpiarLogsAntiguos($diasAntiguos);
  
        // Como "optimizar base de datos"
        if ($forzar || $this->confirm('¿Optimizar tablas de la base de datos?')) {
            $this->optimizarBaseDatos();
        }
  
        // Como "generar reporte de limpieza"
        $this->generarReporteLimpieza();
  
        $this->info('✅ Limpieza nocturna completada exitosamente');
    }
  
    private function limpiarArchivosTemporales($dias)
    {
        $this->task('Limpiando archivos temporales', function () use ($dias) {
            $fechaLimite = now()->subDays($dias);
    
            // Limpiar uploads temporales
            $archivosTemporales = Storage::disk('temp')->allFiles();
            $eliminados = 0;
    
            foreach ($archivosTemporales as $archivo) {
                $fechaArchivo = Storage::disk('temp')->lastModified($archivo);
                if ($fechaArchivo < $fechaLimite->timestamp) {
                    Storage::disk('temp')->delete($archivo);
                    $eliminados++;
                }
            }
    
            $this->line("   - Eliminados $eliminados archivos temporales");
            return true;
        });
    }
  
    private function organizarImagenesMedicas()
    {
        $this->task('Organizando imágenes médicas', function () {
            // Mover imágenes a carpetas por año/mes
            $imagenes = ImagenMedica::whereNull('archivada')->get();
            $organizadas = 0;
    
            $bar = $this->output->createProgressBar($imagenes->count());
            $bar->start();
    
            foreach ($imagenes as $imagen) {
                $rutaOrganizada = $imagen->created_at->format('Y/m');
                $nuevaRuta = "imagenes_medicas/{$rutaOrganizada}/{$imagen->archivo}";
        
                if (Storage::move($imagen->ruta_actual, $nuevaRuta)) {
                    $imagen->update([
                        'ruta_actual' => $nuevaRuta,
                        'archivada' => true
                    ]);
                    $organizadas++;
                }
        
                $bar->advance();
            }
    
            $bar->finish();
            $this->newLine();
            $this->line("   - Organizadas $organizadas imágenes médicas");
            return true;
        });
    }
}

// Como "Asistente de Reportes Automáticos"
class GenerarReporteMensual extends Command
{
    protected $signature = 'hospital:reporte-mensual 
                          {mes? : Mes a reportar (formato: YYYY-MM)}
                          {--enviar-email : Enviar reporte por email}
                          {--formato=pdf : Formato del reporte (pdf, excel, csv)}';
  
    protected $description = 'Genera reporte mensual completo del hospital';
  
    public function handle()
    {
        $mes = $this->argument('mes') ?? now()->subMonth()->format('Y-m');
        $formato = $this->option('formato');
  
        $this->info("📊 Generando reporte mensual para: $mes");
  
        // Como "recopilar datos de todos los departamentos"
        $datos = $this->recopilarDatos($mes);
  
        // Como "crear el reporte"
        $reporte = $this->crearReporte($datos, $formato);
  
        // Como "guardar y distribuir"
        $this->guardarReporte($reporte, $mes, $formato);
  
        if ($this->option('enviar-email')) {
            $this->enviarPorEmail($reporte, $mes);
        }
  
        $this->info('✅ Reporte generado exitosamente');
    }
  
    private function recopilarDatos($mes)
    {
        return $this->withProgressBar([
            'pacientes' => 'Recopilando datos de pacientes',
            'consultas' => 'Analizando consultas médicas', 
            'cirugias' => 'Procesando información de cirugías',
            'farmacia' => 'Revisando movimientos de farmacia',
            'financiero' => 'Calculando indicadores financieros'
        ], function ($item, $descripcion) use ($mes) {
            return match($item) {
                'pacientes' => $this->datospacientes($mes),
                'consultas' => $this->datosConsultas($mes),
                'cirugias' => $this->datosCirugias($mes),
                'farmacia' => $this->datosFarmacia($mes),
                'financiero' => $this->datosFinancieros($mes)
            };
        });
    }
}

// Como "Asistente de Respaldos"
class BackupHospital extends Command
{
    protected $signature = 'hospital:backup 
                          {--tipo=completo : Tipo de backup (completo, incremental, solo-db)}
                          {--destino=local : Destino (local, s3, ftp)}
                          {--comprimir : Comprimir el backup}';
  
    protected $description = 'Realiza backup completo del sistema hospitalario';
  
    public function handle()
    {
        $tipo = $this->option('tipo');
        $destino = $this->option('destino');
        $comprimir = $this->option('comprimir');
  
        $this->info('💾 Iniciando backup del hospital...');
  
        $timestamp = now()->format('Y-m-d_H-i-s');
        $nombreBackup = "hospital_backup_{$tipo}_{$timestamp}";
  
        match($tipo) {
            'completo' => $this->backupCompleto($nombreBackup, $destino, $comprimir),
            'incremental' => $this->backupIncremental($nombreBackup, $destino, $comprimir),
            'solo-db' => $this->backupBaseDatos($nombreBackup, $destino, $comprimir)
        };
  
        $this->info('✅ Backup completado exitosamente');
    }
  
    private function backupCompleto($nombre, $destino, $comprimir)
    {
        $componentes = [
            'Base de datos' => fn() => $this->backupDB(),
            'Imágenes médicas' => fn() => $this->backupImagenes(),
            'Documentos pacientes' => fn() => $this->backupDocumentos(),
            'Configuraciones' => fn() => $this->backupConfiguraciones(),
            'Logs del sistema' => fn() => $this->backupLogs()
        ];
  
        $this->withProgressBar($componentes, function ($backup, $descripcion) {
            return $backup();
        });
    }
}

// Como "Asistente de Notificaciones Programadas"
class EnviarRecordatoriosCitas extends Command
{
    protected $signature = 'hospital:recordatorios-citas 
                          {--anticipacion=24 : Horas de anticipación}
                          {--tipo=todos : Tipo de recordatorios (todos, email, sms)}';
  
    protected $description = 'Envía recordatorios automáticos de citas médicas';
  
    public function handle()
    {
        $anticipacion = $this->option('anticipacion');
        $tipo = $this->option('tipo');
  
        $fechaLimite = now()->addHours($anticipacion);
  
        $citas = Cita::with(['paciente', 'doctor'])
                    ->where('fecha_hora', '<=', $fechaLimite)
                    ->where('fecha_hora', '>', now())
                    ->where('recordatorio_enviado', false)
                    ->get();
  
        if ($citas->isEmpty()) {
            $this->info('📅 No hay citas para recordar');
            return;
        }
  
        $this->info("📱 Enviando {$citas->count()} recordatorios...");
  
        $enviados = $this->withProgressBar($citas, function ($cita) use ($tipo) {
            try {
                match($tipo) {
                    'todos' => $this->enviarTodosLosRecordatorios($cita),
                    'email' => $this->enviarRecordatorioEmail($cita),
                    'sms' => $this->enviarRecordatorioSMS($cita)
                };
        
                $cita->update(['recordatorio_enviado' => true]);
                return true;
            } catch (Exception $e) {
                $this->error("Error enviando recordatorio para cita {$cita->id}: {$e->getMessage()}");
                return false;
            }
        });
  
        $exitosos = collect($enviados)->filter()->count();
        $this->info("✅ $exitosos recordatorios enviados exitosamente");
    }
}

// Como "Asistente de Mantenimiento de Inventario"
class ActualizarInventario extends Command
{
    protected $signature = 'hospital:inventario 
                          {accion : Acción a realizar (actualizar, alertas, vencimientos)}
                          {--categoria= : Categoría específica a procesar}';
  
    protected $description = 'Gestiona el inventario hospitalario automáticamente';
  
    public function handle()
    {
        $accion = $this->argument('accion');
        $categoria = $this->option('categoria');
  
        match($accion) {
            'actualizar' => $this->actualizarStock($categoria),
            'alertas' => $this->procesarAlertas($categoria),
            'vencimientos' => $this->verificarVencimientos($categoria)
        };
    }
  
    private function procesarAlertas($categoria = null)
    {
        $query = Inventario::where('cantidad_actual', '<=', DB::raw('stock_minimo'));
  
        if ($categoria) {
            $query->where('categoria', $categoria);
        }
  
        $itemsCriticos = $query->get();
  
        if ($itemsCriticos->isEmpty()) {
            $this->info('✅ No hay alertas de inventario');
            return;
        }
  
        $this->warn("⚠️  {$itemsCriticos->count()} items requieren atención:");
  
        $table = $this->table(
            ['Producto', 'Stock Actual', 'Stock Mínimo', 'Estado'],
            $itemsCriticos->map(function ($item) {
                $estado = $item->cantidad_actual == 0 ? 'AGOTADO' : 'CRÍTICO';
                return [
                    $item->nombre,
                    $item->cantidad_actual,
                    $item->stock_minimo,
                    $estado
                ];
            })
        );
  
        // Generar órdenes de compra automáticas
        if ($this->confirm('¿Generar órdenes de compra automáticas?')) {
            $this->generarOrdenesCompra($itemsCriticos);
        }
    }
}

// Programar comandos como "Horarios de Asistentes"
// app/Console/Kernel.php
class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        // Como "programar asistente de limpieza nocturna"
        $schedule->command('hospital:limpieza-nocturna --forzar')
                 ->dailyAt('02:00')
                 ->name('limpieza-nocturna')
                 ->withoutOverlapping()
                 ->onFailure(function () {
                     Mail::to('admin@hospital.com')->send(new FalloLimpiezaNocturna());
                 });
  
        // Como "recordatorios automáticos de citas"
        $schedule->command('hospital:recordatorios-citas --anticipacion=24')
                 ->hourly()
                 ->between('08:00', '20:00')
                 ->name('recordatorios-24h');
         
        $schedule->command('hospital:recordatorios-citas --anticipacion=2 --tipo=sms')
                 ->everyFifteenMinutes()
                 ->name('recordatorios-urgentes');
  
        // Como "reporte mensual automático"
        $schedule->command('hospital:reporte-mensual --enviar-email')
                 ->monthlyOn(1, '09:00')
                 ->name('reporte-mensual');
  
        // Como "backup diario"
        $schedule->command('hospital:backup --tipo=incremental')
                 ->dailyAt('01:00')
                 ->name('backup-diario');
  
        // Como "backup completo semanal"  
        $schedule->command('hospital:backup --tipo=completo --destino=s3 --comprimir')
                 ->weeklyOn(1, '00:00')
                 ->name('backup-semanal');
    }
}

---

## 🎭 **13. OBSERVERS - Los Vigilantes Automatizados**

### **Analogía: Personal de Seguridad que Observa y Reacciona**
Los Observers son como guardias de seguridad que observan constantemente lo que sucede con ciertos "ciudadanos" (models) y reaccionan automáticamente cuando algo importante ocurre.

```php
<?php

namespace App\Observers;

// Como "Guardia de Expedientes Médicos"
class PacienteObserver
{
    // Como "registrar cuando alguien entra al hospital"
    public function creating(Paciente $paciente)
    {
        // Asignar número de historia clínica automáticamente
        $paciente->numero_historia = 'HC-' . str_pad(
            Paciente::max('id') + 1, 
            6, 
            '0', 
            STR_PAD_LEFT
        );
  
        // Calcular edad automáticamente
        $paciente->edad = Carbon::parse($paciente->fecha_nacimiento)->age;
  
        // Asignar doctor por defecto según disponibilidad
        if (!$paciente->doctor_id) {
            $paciente->doctor_id = Doctor::disponibles()->inRandomOrder()->first()?->id;
        }
    }
  
    // Como "abrir expediente cuando se registra oficialmente"
    public function created(Paciente $paciente)
    {
        // Crear expediente médico automáticamente
        ExpedienteMedico::create([
            'paciente_id' => $paciente->id,
            'fecha_apertura' => now(),
            'estado' => 'activo'
        ]);
  
        // Enviar kit de bienvenida
        Mail::to($paciente->email)->send(new BienvenidaHospital($paciente));
  
        // Programar chequeo inicial
        Cita::create([
            'paciente_id' => $paciente->id,
            'doctor_id' => $paciente->doctor_id,
            'tipo' => 'chequeo_inicial',
            'fecha_hora' => now()->addDays(7),
            'estado' => 'programada'
        ]);
  
        // Registrar en auditoría
        Log::info('Nuevo paciente registrado', [
            'paciente_id' => $paciente->id,
            'numero_historia' => $paciente->numero_historia,
            'doctor_asignado' => $paciente->doctor_id
        ]);
    }
  
    // Como "vigilar cambios importantes"
    public function updating(Paciente $paciente)
    {
        // Si cambia el estado de salud, alertar al doctor
        if ($paciente->isDirty('estado_salud')) {
            $estadoAnterior = $paciente->getOriginal('estado_salud');
            $estadoNuevo = $paciente->estado_salud;
    
            if ($this->esCambioSignificativo($estadoAnterior, $estadoNuevo)) {
                event(new CambioEstadoSaludSignificativo($paciente, $estadoAnterior, $estadoNuevo));
            }
        }
  
        // Si cambia de doctor, transferir expediente
        if ($paciente->isDirty('doctor_id')) {
            $this->transferirExpediente($paciente);
        }
    }
  
    // Como "registrar todas las modificaciones"
    public function updated(Paciente $paciente)
    {
        $cambios = $paciente->getChanges();
  
        foreach ($cambios as $campo => $valorNuevo) {
            AuditoriaPaciente::create([
                'paciente_id' => $paciente->id,
                'campo_modificado' => $campo,
                'valor_anterior' => $paciente->getOriginal($campo),
                'valor_nuevo' => $valorNuevo,
                'usuario_modificacion' => auth()->id(),
                'fecha_modificacion' => now()
            ]);
        }
    }
  
    // Como "protocolo cuando alguien se va del hospital"
    public function deleting(Paciente $paciente)
    {
        // Verificar que no tenga citas pendientes
        $citasPendientes = $paciente->citas()->pendientes()->count();
        if ($citasPendientes > 0) {
            throw new Exception("No se puede eliminar paciente con {$citasPendientes} citas pendientes");
        }
  
        // Verificar que no tenga tratamientos activos
        $tratamientosActivos = $paciente->tratamientos()->activos()->count();
        if ($tratamientosActivos > 0) {
            throw new Exception("No se puede eliminar paciente con tratamientos activos");
        }
    }
  
    // Como "archivar expediente cuando se va"
    public function deleted(Paciente $paciente)
    {
        // Archivar expediente médico
        $paciente->expediente()->update([
            'estado' => 'archivado',
            'fecha_archivo' => now(),
            'motivo_archivo' =>
```
