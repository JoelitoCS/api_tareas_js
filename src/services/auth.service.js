const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../db/supabase');

// ─────────────────────────────────────────────────────────────────────────────
// TAREAS MOCK — se asignan a cada estudiante al registrarse
// ─────────────────────────────────────────────────────────────────────────────
const TAREAS_MOCK = [
  // ── DAW · Desarrollo Web en Entorno Cliente ───────────────────────────────
  { modulo: 'Desarrollo Web en Entorno Cliente', ciclo: 'DAW', titulo: 'Maquetación responsive con CSS Grid', descripcion: 'Crear una página web que se adapte a diferentes tamaños de pantalla usando CSS Grid y Flexbox. Debe incluir header, main con 3 columnas y footer.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-04T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Cliente', ciclo: 'DAW', titulo: 'Aplicación de tareas con JavaScript puro', descripcion: 'Desarrollar una to-do list utilizando solo JavaScript vanilla. Debe permitir añadir, eliminar y marcar tareas como completadas, persistiendo los datos en localStorage.', estado: 'en-progreso', fecha_vencimiento: '2026-03-11T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Cliente', ciclo: 'DAW', titulo: 'Formularios accesibles con validación HTML5', descripcion: 'Crear un formulario de registro con validaciones nativas HTML5 y personalizadas con JavaScript. Aplicar atributos ARIA para accesibilidad y estilos de error inline.', estado: 'completada', nota: 9, fecha_vencimiento: '2026-03-05T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Cliente', ciclo: 'DAW', titulo: 'Consumo de API con Fetch y async/await', descripcion: 'Crear una SPA que consuma la API de GitHub para buscar usuarios y mostrar sus repositorios. Gestionar estados de carga, error y resultado vacío.', estado: 'en-progreso', fecha_vencimiento: '2026-03-13T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Cliente', ciclo: 'DAW', titulo: 'Testing con Jest y DOM Testing Library', descripcion: 'Escribir tests unitarios para las funciones JavaScript del proyecto de to-do list.', estado: 'pendiente', fecha_vencimiento: '2026-03-28T23:59:00.000Z' },

  // ── DAW · Desarrollo Web en Entorno Servidor ──────────────────────────────
  { modulo: 'Desarrollo Web en Entorno Servidor', ciclo: 'DAW', titulo: 'API REST con Node.js y Express', descripcion: 'Implementar una API RESTful para gestionar un catálogo de productos con endpoints GET, POST, PUT y DELETE.', estado: 'completada', nota: 9, fecha_vencimiento: '2026-03-06T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Servidor', ciclo: 'DAW', titulo: 'Autenticación con JWT', descripcion: 'Añadir sistema de registro e inicio de sesión a la API usando JSON Web Tokens. Proteger rutas privadas y gestionar la expiración del token.', estado: 'pendiente', fecha_vencimiento: '2026-03-18T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Servidor', ciclo: 'DAW', titulo: 'Middleware de logging y manejo de errores', descripcion: 'Implementar middleware global en Express para registrar peticiones con morgan y un manejador centralizado de errores.', estado: 'completada', nota: 8, fecha_vencimiento: '2026-03-07T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Servidor', ciclo: 'DAW', titulo: 'Integración con base de datos MongoDB', descripcion: 'Conectar la API REST a MongoDB Atlas usando Mongoose. Definir esquemas con validaciones e índices.', estado: 'pendiente', fecha_vencimiento: '2026-03-19T23:59:00.000Z' },

  // ── DAW · Despliegue de Aplicaciones Web ──────────────────────────────────
  { modulo: 'Despliegue de Aplicaciones Web', ciclo: 'DAW', titulo: 'Despliegue en servidor Linux con Nginx', descripcion: "Configurar un servidor VPS con Ubuntu, instalar Nginx y desplegar una aplicación web estática con HTTPS.", estado: 'completada', nota: 7.5, fecha_vencimiento: '2026-03-09T23:59:00.000Z' },
  { modulo: 'Despliegue de Aplicaciones Web', ciclo: 'DAW', titulo: 'Contenerización con Docker', descripcion: 'Crear un Dockerfile y docker-compose.yml para una aplicación web full-stack. Documentar el proceso.', estado: 'en-progreso', fecha_vencimiento: '2026-03-20T23:59:00.000Z' },
  { modulo: 'Despliegue de Aplicaciones Web', ciclo: 'DAW', titulo: 'Pipeline CI/CD con GitHub Actions', descripcion: 'Crear un workflow de GitHub Actions que ejecute tests, construya la imagen Docker y la despliegue automáticamente.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-10T23:59:00.000Z' },

  // ── DAW · Diseño de Interfaces Web ────────────────────────────────────────
  { modulo: 'Diseño de Interfaces Web', ciclo: 'DAW', titulo: 'Prototipo UI con Figma', descripcion: 'Diseñar el prototipo de alta fidelidad de una tienda online en Figma con 5 pantallas, sistema de colores y componentes.', estado: 'completada', nota: 9.5, fecha_vencimiento: '2026-03-05T23:59:00.000Z' },
  { modulo: 'Diseño de Interfaces Web', ciclo: 'DAW', titulo: 'Implementación de design system con CSS custom properties', descripcion: 'Trasladar el prototipo de Figma a código HTML/CSS usando variables CSS. Documentar cada componente.', estado: 'pendiente', fecha_vencimiento: '2026-03-13T23:59:00.000Z' },
  { modulo: 'Diseño de Interfaces Web', ciclo: 'DAW', titulo: 'Test de usabilidad con usuarios reales', descripcion: 'Realizar un test de usabilidad con 5 personas externas. Recopilar feedback y proponer mejoras.', estado: 'completada', nota: 10, fecha_vencimiento: '2026-03-06T23:59:00.000Z' },

  // ── DAW · Programación ───────────────────────────────────────────────────
  { modulo: 'Programación', ciclo: 'DAW', titulo: 'Algoritmos de ordenación en Java', descripcion: 'Implementar y comparar BubbleSort, SelectionSort y MergeSort. Medir tiempos con arrays de distinto tamaño.', estado: 'completada', nota: 7, fecha_vencimiento: '2026-03-07T23:59:00.000Z' },
  { modulo: 'Programación', ciclo: 'DAW', titulo: 'Proyecto gestión de biblioteca (POO)', descripcion: 'Desarrollar una aplicación de consola en Java con POO para gestionar préstamos de libros.', estado: 'en-progreso', fecha_vencimiento: '2026-03-25T23:59:00.000Z' },

  // ── DAW · Bases de Datos ─────────────────────────────────────────────────
  { modulo: 'Bases de Datos', ciclo: 'DAW', titulo: 'Diseño entidad-relación de una tienda online', descripcion: 'Crear el diagrama E-R completo para un e-commerce y normalizar hasta 3FN.', estado: 'completada', nota: 8, fecha_vencimiento: '2026-03-10T23:59:00.000Z' },
  { modulo: 'Bases de Datos', ciclo: 'DAW', titulo: 'Consultas avanzadas SQL con JOINs', descripcion: 'Escribir 15 consultas SQL con INNER JOIN, LEFT JOIN, subconsultas, GROUP BY y funciones de agregación.', estado: 'pendiente', fecha_vencimiento: '2026-03-22T23:59:00.000Z' },

  // ── DAW · Lenguajes de Marcas ────────────────────────────────────────────
  { modulo: 'Lenguajes de Marcas', ciclo: 'DAW', titulo: 'Transformación XML con XSLT', descripcion: 'Crear un fichero XML con catálogo de películas y una hoja XSLT que lo transforme en HTML filtrable.', estado: 'completada', nota: 6.5, fecha_vencimiento: '2026-03-08T23:59:00.000Z' },
  { modulo: 'Lenguajes de Marcas', ciclo: 'DAW', titulo: 'Integración y consumo de API JSON', descripcion: 'Crear una página web que consuma una API pública y muestre los datos procesados con HTML y CSS.', estado: 'en-progreso', fecha_vencimiento: '2026-03-16T23:59:00.000Z' },

  // ── DAM · Programación Multimedia y Dispositivos Móviles ─────────────────
  { modulo: 'Programación Multimedia y Dispositivos Móviles', ciclo: 'DAM', titulo: 'App Android: Reproductor de música', descripcion: 'Desarrollar una app Android en Kotlin para reproducir audio con controles de play/pause/siguiente.', estado: 'completada', nota: 8, fecha_vencimiento: '2026-03-11T23:59:00.000Z' },
  { modulo: 'Programación Multimedia y Dispositivos Móviles', ciclo: 'DAM', titulo: 'Captura y procesamiento de imágenes con la cámara', descripcion: 'Crear una app Android que acceda a la cámara, capture fotos y aplique filtros básicos.', estado: 'pendiente', fecha_vencimiento: '2026-03-27T23:59:00.000Z' },
  { modulo: 'Programación Multimedia y Dispositivos Móviles', ciclo: 'DAM', titulo: 'Notificaciones push en Android', descripcion: 'Integrar Firebase Cloud Messaging en la app Android para notificaciones push.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-08T23:59:00.000Z' },

  // ── DAM · Programación de Servicios y Procesos ───────────────────────────
  { modulo: 'Programación de Servicios y Procesos', ciclo: 'DAM', titulo: 'Comunicación entre procesos con sockets TCP', descripcion: 'Implementar un sistema cliente-servidor en Java con sockets TCP y múltiples clientes concurrentes.', estado: 'completada', nota: 9, fecha_vencimiento: '2026-03-12T23:59:00.000Z' },
  { modulo: 'Programación de Servicios y Procesos', ciclo: 'DAM', titulo: 'Procesamiento paralelo con ExecutorService', descripcion: 'Desarrollar una aplicación que procese datos usando ExecutorService, Future y Callable.', estado: 'en-progreso', fecha_vencimiento: '2026-03-19T23:59:00.000Z' },

  // ── DAM · Sistemas de Gestión Empresarial ────────────────────────────────
  { modulo: 'Sistemas de Gestión Empresarial', ciclo: 'DAM', titulo: 'Configuración de empresa en Odoo', descripcion: 'Instalar Odoo en VM y configurar módulos de ventas, compras, inventario y contabilidad.', estado: 'completada', nota: 7.5, fecha_vencimiento: '2026-03-06T23:59:00.000Z' },
  { modulo: 'Sistemas de Gestión Empresarial', ciclo: 'DAM', titulo: 'Módulo personalizado en Odoo con Python', descripcion: 'Desarrollar un módulo personalizado en Odoo usando el framework ORM y vistas XML.', estado: 'pendiente', fecha_vencimiento: '2026-03-28T23:59:00.000Z' },

  // ── DAM · Programación (1r curso) ────────────────────────────────────────
  { modulo: 'Programación', ciclo: 'DAM', titulo: 'Estructuras de datos: pilas, colas y listas enlazadas', descripcion: 'Implementar en Java Pila, Cola y Lista Enlazada con métodos de inserción, eliminación y búsqueda.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-09T23:59:00.000Z' },
  { modulo: 'Programación', ciclo: 'DAM', titulo: 'Proyecto: aplicación de gestión de contactos', descripcion: 'Desarrollar una agenda de contactos en Java con persistencia en fichero CSV.', estado: 'en-progreso', fecha_vencimiento: '2026-03-23T23:59:00.000Z' },

  // ── DAM · Bases de Datos ─────────────────────────────────────────────────
  { modulo: 'Bases de Datos', ciclo: 'DAM', titulo: 'Acceso a BBDD con JDBC', descripcion: 'Crear una app Java que se conecte a MySQL con JDBC e implemente CRUD sobre una tabla de empleados.', estado: 'completada', nota: 7, fecha_vencimiento: '2026-03-14T23:59:00.000Z' },
  { modulo: 'Bases de Datos', ciclo: 'DAM', titulo: 'ORM con Hibernate y JPA', descripcion: 'Migrar el proyecto JDBC a Hibernate/JPA con anotaciones y relaciones entre entidades.', estado: 'pendiente', fecha_vencimiento: '2026-03-30T23:59:00.000Z' },

  // ── ASIR · Administración de Sistemas Operativos ─────────────────────────
  { modulo: 'Administración de Sistemas Operativos', ciclo: 'ASIR', titulo: 'Administración avanzada de Active Directory', descripcion: 'Configurar dominio Windows Server con AD, UOs, GPOs y permisos de carpetas compartidas.', estado: 'completada', nota: 8, fecha_vencimiento: '2026-03-07T23:59:00.000Z' },
  { modulo: 'Administración de Sistemas Operativos', ciclo: 'ASIR', titulo: 'Scripting de administración con PowerShell y Bash', descripcion: 'Desarrollar 5 scripts de automatización: 3 en PowerShell y 2 en Bash.', estado: 'en-progreso', fecha_vencimiento: '2026-03-17T23:59:00.000Z' },
  { modulo: 'Administración de Sistemas Operativos', ciclo: 'ASIR', titulo: 'Configuración de RAID por software en Linux', descripcion: 'Configurar array RAID 5 con mdadm, simular fallo de disco y documentar la recuperación.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-09T23:59:00.000Z' },

  // ── ASIR · Seguridad y Alta Disponibilidad ────────────────────────────────
  { modulo: 'Seguridad y Alta Disponibilidad', ciclo: 'ASIR', titulo: 'Auditoría de seguridad con Nmap y Metasploit', descripcion: 'Realizar una auditoría en entorno de laboratorio, documentar hallazgos y proponer mitigaciones.', estado: 'completada', nota: 9.5, fecha_vencimiento: '2026-03-10T23:59:00.000Z' },
  { modulo: 'Seguridad y Alta Disponibilidad', ciclo: 'ASIR', titulo: 'Cluster de alta disponibilidad con HAProxy y Keepalived', descripcion: 'Montar cluster activo-pasivo con HAProxy y Keepalived. Probar failover y documentar.', estado: 'pendiente', fecha_vencimiento: '2026-03-26T23:59:00.000Z' },
  { modulo: 'Seguridad y Alta Disponibilidad', ciclo: 'ASIR', titulo: 'Hardening de servidor Linux con CIS Benchmark', descripcion: 'Aplicar medidas de hardening CIS para Ubuntu: deshabilitar servicios, configurar PAM y políticas.', estado: 'completada', nota: 9, fecha_vencimiento: '2026-03-08T23:59:00.000Z' },

  // ── ASIR · Implantación de Sistemas Operativos ────────────────────────────
  { modulo: 'Implantación de Sistemas Operativos', ciclo: 'ASIR', titulo: 'Instalación y configuración de servidor LAMP', descripcion: 'Instalar LAMP en Ubuntu Server, configurar virtual hosts y desplegar una app PHP de prueba.', estado: 'completada', nota: 7, fecha_vencimiento: '2026-03-08T23:59:00.000Z' },
  { modulo: 'Implantación de Sistemas Operativos', ciclo: 'ASIR', titulo: 'Virtualización con VirtualBox y gestión de snapshots', descripcion: 'Crear entorno virtualizado con 3 VMs, configurar redes NAT y practicar snapshots.', estado: 'en-progreso', fecha_vencimiento: '2026-03-21T23:59:00.000Z' },

  // ── SMR · Redes Locales ──────────────────────────────────────────────────
  { modulo: 'Redes Locales', ciclo: 'SMR', titulo: 'Diseño y cableado de red de área local', descripcion: 'Diseñar infraestructura de red para oficina de 20 puestos con subnetting y presupuesto.', estado: 'completada', nota: 8, fecha_vencimiento: '2026-03-05T23:59:00.000Z' },
  { modulo: 'Redes Locales', ciclo: 'SMR', titulo: 'Configuración de switch con VLANs y STP', descripcion: 'En Packet Tracer, configurar switch Cisco con 3 VLANs y verificar que STP evita bucles.', estado: 'en-progreso', fecha_vencimiento: '2026-03-16T23:59:00.000Z' },
  { modulo: 'Redes Locales', ciclo: 'SMR', titulo: 'Configuración de router con NAT y ACLs', descripcion: 'En Packet Tracer, configurar router Cisco con NAT overload y ACLs para seguridad entre VLANs.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-08T23:59:00.000Z' },

  // ── SMR · Sistemas Operativos en Red ─────────────────────────────────────
  { modulo: 'Sistemas Operativos en Red', ciclo: 'SMR', titulo: 'Instalación y administración de Windows Server', descripcion: 'Instalar Windows Server en VM, configurar servidor de ficheros con cuotas y DFS.', estado: 'completada', nota: 6.5, fecha_vencimiento: '2026-03-11T23:59:00.000Z' },
  { modulo: 'Sistemas Operativos en Red', ciclo: 'SMR', titulo: 'Configuración de servidor DHCP y DNS en Linux', descripcion: 'Instalar y configurar ISC DHCP Server y BIND9 para una red local de prueba.', estado: 'pendiente', fecha_vencimiento: '2026-03-25T23:59:00.000Z' },

  // ── SMR · Seguridad Informática ──────────────────────────────────────────
  { modulo: 'Seguridad Informática', ciclo: 'SMR', titulo: 'Configuración de firewall con iptables', descripcion: 'Configurar firewall Linux con iptables para red con DMZ. Documentar todas las reglas.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-13T23:59:00.000Z' },
  { modulo: 'Seguridad Informática', ciclo: 'SMR', titulo: 'Plan de backup y recuperación ante desastres', descripcion: 'Implementar política de copias de seguridad con rsync y cron. Backup incremental y rotación.', estado: 'en-progreso', fecha_vencimiento: '2026-03-28T23:59:00.000Z' },
  { modulo: 'Seguridad Informática', ciclo: 'SMR', titulo: 'Cifrado de datos con GPG y certificados SSL', descripcion: 'Generar claves GPG y crear una CA propia con OpenSSL para servicios internos.', estado: 'completada', nota: 9, fecha_vencimiento: '2026-03-09T23:59:00.000Z' },
];

// ─────────────────────────────────────────────────────────────────────────────

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' }
  );
}

async function inicializarModulosEstudiante(estudianteId, cicloFormativo) {
  const { data: modulos } = await supabase
    .from('modulos')
    .select('id')
    .eq('ciclo_formativo', cicloFormativo);

  if (!modulos || modulos.length === 0) return;

  const { data: existentes } = await supabase
    .from('modulos_estudiantes')
    .select('modulo_id')
    .eq('estudiante_id', estudianteId);

  const idsExistentes = new Set((existentes ?? []).map((e) => e.modulo_id));

  const nuevos = modulos
    .filter((m) => !idsExistentes.has(m.id))
    .map((m) => ({
      modulo_id: m.id,
      estudiante_id: estudianteId,
      estado: 'cursando',
    }));

  if (nuevos.length > 0) {
    await supabase.from('modulos_estudiantes').insert(nuevos);
  }
}

/**
 * Asigna las tareas mock del ciclo del estudiante.
 * Solo inserta las que no existan ya (evita duplicados si se llama varias veces).
 */
async function inicializarTareasMock(estudianteId, cicloFormativo) {
  const { data: modulos, error: errorModulos } = await supabase
    .from('modulos')
    .select('id, nombre')
    .eq('ciclo_formativo', cicloFormativo);

  if (errorModulos) {
    console.error('[tareasMock] Error:', errorModulos.message);
    return;
  }

  if (!modulos || modulos.length === 0) {
    console.warn(`[tareasMock] Sin módulos para ciclo: ${cicloFormativo}`);
    return;
  }

  // Esto te mostrará los nombres EXACTOS que tiene Supabase
  console.log(`[tareasMock] Módulos en Supabase para ${cicloFormativo}:`);
  modulos.forEach(m => console.log(`  → "${m.nombre}"`));

  const modulosPorNombre = new Map(modulos.map((m) => [m.nombre, m.id]));
  const tareasDeCiclo = TAREAS_MOCK.filter((t) => t.ciclo === cicloFormativo);

  const registros = [];
  for (const tarea of tareasDeCiclo) {
    const moduloId = modulosPorNombre.get(tarea.modulo);
    if (!moduloId) {
      // Esto te mostrará qué nombre no encuentra
      console.warn(`[tareasMock] ⚠️ NO encontrado: "${tarea.modulo}"`);
      continue;
    }
    registros.push({
      modulo_id:         moduloId,
      estudiante_id:     estudianteId,
      titulo:            tarea.titulo,
      descripcion:       tarea.descripcion,
      fecha_vencimiento: tarea.fecha_vencimiento,
      estado:            tarea.estado,
      nota:              tarea.nota ?? null,
    });
  }

  if (registros.length === 0) return;

  const { error } = await supabase.from('tareas').insert(registros);
  if (error) console.error('[tareasMock] Error insertando:', error.message);
  else console.log(`[tareasMock] ✅ ${registros.length} tareas insertadas`);
}

async function register(dto) {
  const { data: existe } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', dto.email)
    .maybeSingle();

  if (existe) throw new Error('El email ya está registrado');

  const password_hash = await bcrypt.hash(dto.password, 10);

  const { data, error } = await supabase
    .from('usuarios')
    .insert({
      nombre:          dto.nombre,
      email:           dto.email,
      password_hash,
      ciclo_formativo: dto.ciclo_formativo,
      rol:             dto.rol ?? 'estudiante',
    })
    .select('id, nombre, email, ciclo_formativo, rol, created_at')
    .single();

  if (error) throw new Error(error.message);

  // Si es estudiante, inicializar módulos Y tareas automáticamente
  if (data.rol === 'estudiante') {
    await inicializarModulosEstudiante(data.id, data.ciclo_formativo);
    await inicializarTareasMock(data.id, data.ciclo_formativo);
  }

  const token = generarToken(data);
  return { token, usuario: data };
}

async function login(dto) {
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', dto.email)
    .maybeSingle();

  if (error || !usuario) throw new Error('El usuario no existe');

  const coincide = await bcrypt.compare(dto.password, usuario.password_hash);
  if (!coincide) throw new Error('Contraseña incorrecta');

  const token = generarToken(usuario);
  const { password_hash, ...usuarioSinPassword } = usuario;
  return { token, usuario: usuarioSinPassword };
}

module.exports = { register, login, inicializarModulosEstudiante, inicializarTareasMock };
