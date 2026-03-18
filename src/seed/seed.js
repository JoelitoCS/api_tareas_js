require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const isReset = process.argv.includes('--reset');

// ─────────────────────────────────────────────────────────────────────────────
// MÓDULOS — idénticos a los del AuthProvider del proyecto original
// ─────────────────────────────────────────────────────────────────────────────
const MODULOS = [
  // DAW
  { nombre: 'Desarrollo Web en Entorno Cliente',              curso: 2, ciclo_formativo: 'DAW' },
  { nombre: 'Desarrollo Web en Entorno Servidor',             curso: 2, ciclo_formativo: 'DAW' },
  { nombre: 'Despliegue de Aplicaciones Web',                 curso: 2, ciclo_formativo: 'DAW' },
  { nombre: 'Diseño de Interfaces Web',                       curso: 2, ciclo_formativo: 'DAW' },
  { nombre: 'Programación',                                   curso: 1, ciclo_formativo: 'DAW' },
  { nombre: 'Bases de Datos',                                 curso: 1, ciclo_formativo: 'DAW' },
  { nombre: 'Lenguajes de Marcas',                            curso: 1, ciclo_formativo: 'DAW' },
  // DAM
  { nombre: 'Programación Multimedia y Dispositivos Móviles', curso: 2, ciclo_formativo: 'DAM' },
  { nombre: 'Programación de Servicios y Procesos',           curso: 2, ciclo_formativo: 'DAM' },
  { nombre: 'Sistemas de Gestión Empresarial',                curso: 2, ciclo_formativo: 'DAM' },
  { nombre: 'Programación',                                   curso: 1, ciclo_formativo: 'DAM' },
  { nombre: 'Bases de Datos',                                 curso: 1, ciclo_formativo: 'DAM' },
  // ASIR
  { nombre: 'Administración de Sistemas Operativos',          curso: 2, ciclo_formativo: 'ASIR' },
  { nombre: 'Seguridad y Alta Disponibilidad',                curso: 2, ciclo_formativo: 'ASIR' },
  { nombre: 'Implantación de Sistemas Operativos',            curso: 1, ciclo_formativo: 'ASIR' },
  // SMR
  { nombre: 'Redes Locales',                                  curso: 1, ciclo_formativo: 'SMR' },
  { nombre: 'Sistemas Operativos en Red',                     curso: 2, ciclo_formativo: 'SMR' },
  { nombre: 'Seguridad Informática',                          curso: 2, ciclo_formativo: 'SMR' },
];

// ─────────────────────────────────────────────────────────────────────────────
// USUARIOS DE DEMO
// ─────────────────────────────────────────────────────────────────────────────
const USUARIOS_DEMO = [
  { nombre: 'Admin',          email: 'admin@admin.com',  password: 'admin123', ciclo_formativo: 'DAW',  rol: 'administrador' },
  { nombre: 'María García',   email: 'maria@demo.com',   password: '123456',   ciclo_formativo: 'DAW',  rol: 'estudiante' },
  { nombre: 'Carlos López',   email: 'carlos@demo.com',  password: '123456',   ciclo_formativo: 'DAM',  rol: 'estudiante' },
  { nombre: 'Ana Martínez',   email: 'ana@demo.com',     password: '123456',   ciclo_formativo: 'ASIR', rol: 'estudiante' },
  { nombre: 'Pedro Sánchez',  email: 'pedro@demo.com',   password: '123456',   ciclo_formativo: 'SMR',  rol: 'estudiante' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TAREAS MOCK — mismos datos que en mockData.ts del proyecto original
// formato: { modulo, ciclo, titulo, descripcion, estado, nota?, fecha_vencimiento }
// ─────────────────────────────────────────────────────────────────────────────
const TAREAS_MOCK = [
  // ── DAW · Desarrollo Web en Entorno Cliente ───────────────────────────────
  { modulo: 'Desarrollo Web en Entorno Cliente', ciclo: 'DAW', titulo: 'Maquetación responsive con CSS Grid', descripcion: 'Crear una página web que se adapte a diferentes tamaños de pantalla usando CSS Grid y Flexbox. Debe incluir header, main con 3 columnas y footer.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-04T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Cliente', ciclo: 'DAW', titulo: 'Aplicación de tareas con JavaScript puro', descripcion: 'Desarrollar una to-do list utilizando solo JavaScript vanilla. Debe permitir añadir, eliminar y marcar tareas como completadas, persistiendo los datos en localStorage.', estado: 'en-progreso', fecha_vencimiento: '2026-03-11T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Cliente', ciclo: 'DAW', titulo: 'Formularios accesibles con validación HTML5', descripcion: 'Crear un formulario de registro con validaciones nativas HTML5 y personalizadas con JavaScript. Aplicar atributos ARIA para accesibilidad y estilos de error inline.', estado: 'completada', nota: 9, fecha_vencimiento: '2026-03-05T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Cliente', ciclo: 'DAW', titulo: 'Consumo de API con Fetch y async/await', descripcion: 'Crear una SPA que consuma la API de GitHub para buscar usuarios y mostrar sus repositorios. Gestionar estados de carga, error y resultado vacío.', estado: 'en-progreso', fecha_vencimiento: '2026-03-13T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Cliente', ciclo: 'DAW', titulo: 'Testing con Jest y DOM Testing Library', descripcion: 'Escribir tests unitarios para las funciones JavaScript del proyecto de to-do list. Cubrir los casos de añadir, eliminar, filtrar y persistir tareas.', estado: 'pendiente', fecha_vencimiento: '2026-03-28T23:59:00.000Z' },

  // ── DAW · Desarrollo Web en Entorno Servidor ──────────────────────────────
  { modulo: 'Desarrollo Web en Entorno Servidor', ciclo: 'DAW', titulo: 'API REST con Node.js y Express', descripcion: 'Implementar una API RESTful para gestionar un catálogo de productos. Debe incluir endpoints GET, POST, PUT y DELETE con validación de datos.', estado: 'completada', nota: 9, fecha_vencimiento: '2026-03-06T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Servidor', ciclo: 'DAW', titulo: 'Autenticación con JWT', descripcion: 'Añadir sistema de registro e inicio de sesión a la API anterior usando JSON Web Tokens. Proteger rutas privadas y gestionar la expiración del token.', estado: 'pendiente', fecha_vencimiento: '2026-03-18T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Servidor', ciclo: 'DAW', titulo: 'Middleware de logging y manejo de errores', descripcion: 'Implementar middleware global en Express para registrar todas las peticiones con morgan y un manejador centralizado de errores que devuelva respuestas JSON consistentes.', estado: 'completada', nota: 8, fecha_vencimiento: '2026-03-07T23:59:00.000Z' },
  { modulo: 'Desarrollo Web en Entorno Servidor', ciclo: 'DAW', titulo: 'Integración con base de datos MongoDB', descripcion: 'Conectar la API REST a MongoDB Atlas usando Mongoose. Definir esquemas con validaciones, índices y relaciones entre colecciones de productos y categorías.', estado: 'pendiente', fecha_vencimiento: '2026-03-19T23:59:00.000Z' },

  // ── DAW · Despliegue de Aplicaciones Web ──────────────────────────────────
  { modulo: 'Despliegue de Aplicaciones Web', ciclo: 'DAW', titulo: 'Despliegue en servidor Linux con Nginx', descripcion: "Configurar un servidor VPS con Ubuntu, instalar Nginx y desplegar una aplicación web estática. Configurar el dominio y habilitar HTTPS con Let's Encrypt.", estado: 'completada', nota: 7.5, fecha_vencimiento: '2026-03-09T23:59:00.000Z' },
  { modulo: 'Despliegue de Aplicaciones Web', ciclo: 'DAW', titulo: 'Contenerización con Docker', descripcion: 'Crear un Dockerfile y un docker-compose.yml para una aplicación web full-stack (frontend + backend + base de datos). Documentar el proceso de build y ejecución.', estado: 'en-progreso', fecha_vencimiento: '2026-03-20T23:59:00.000Z' },
  { modulo: 'Despliegue de Aplicaciones Web', ciclo: 'DAW', titulo: 'Pipeline CI/CD con GitHub Actions', descripcion: 'Crear un workflow de GitHub Actions que ejecute los tests, construya la imagen Docker y la despliegue automáticamente al servidor al hacer push a main.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-10T23:59:00.000Z' },

  // ── DAW · Diseño de Interfaces Web ────────────────────────────────────────
  { modulo: 'Diseño de Interfaces Web', ciclo: 'DAW', titulo: 'Prototipo UI con Figma', descripcion: 'Diseñar el prototipo de alta fidelidad de una tienda online en Figma. Debe incluir al menos 5 pantallas, sistema de colores, tipografías y componentes reutilizables.', estado: 'completada', nota: 9.5, fecha_vencimiento: '2026-03-05T23:59:00.000Z' },
  { modulo: 'Diseño de Interfaces Web', ciclo: 'DAW', titulo: 'Implementación de design system con CSS custom properties', descripcion: 'Trasladar el prototipo de Figma a código HTML/CSS usando variables CSS para el sistema de diseño. Documentar cada componente creado.', estado: 'pendiente', fecha_vencimiento: '2026-03-13T23:59:00.000Z' },
  { modulo: 'Diseño de Interfaces Web', ciclo: 'DAW', titulo: 'Test de usabilidad con usuarios reales', descripcion: 'Diseñar y realizar un test de usabilidad con 5 personas externas sobre el prototipo de Figma. Recopilar feedback, identificar puntos de fricción y proponer mejoras.', estado: 'completada', nota: 10, fecha_vencimiento: '2026-03-06T23:59:00.000Z' },

  // ── DAW · Programación ───────────────────────────────────────────────────
  { modulo: 'Programación', ciclo: 'DAW', titulo: 'Algoritmos de ordenación en Java', descripcion: 'Implementar y comparar los algoritmos BubbleSort, SelectionSort y MergeSort. Medir el tiempo de ejecución con arrays de 100, 1000 y 10000 elementos y presentar conclusiones.', estado: 'completada', nota: 7, fecha_vencimiento: '2026-03-07T23:59:00.000Z' },
  { modulo: 'Programación', ciclo: 'DAW', titulo: 'Proyecto gestión de biblioteca (POO)', descripcion: 'Desarrollar una aplicación de consola en Java con Programación Orientada a Objetos para gestionar el préstamo de libros. Clases: Libro, Usuario, Préstamo y Biblioteca.', estado: 'en-progreso', fecha_vencimiento: '2026-03-25T23:59:00.000Z' },

  // ── DAW · Bases de Datos ─────────────────────────────────────────────────
  { modulo: 'Bases de Datos', ciclo: 'DAW', titulo: 'Diseño entidad-relación de una tienda online', descripcion: 'Crear el diagrama E-R completo para una base de datos de e-commerce. Incluir entidades, atributos, relaciones y cardinalidades. Pasar al modelo relacional y normalizar hasta 3FN.', estado: 'completada', nota: 8, fecha_vencimiento: '2026-03-10T23:59:00.000Z' },
  { modulo: 'Bases de Datos', ciclo: 'DAW', titulo: 'Consultas avanzadas SQL con JOINs', descripcion: 'A partir de la base de datos diseñada, escribir 15 consultas SQL que usen INNER JOIN, LEFT JOIN, subconsultas, GROUP BY y funciones de agregación. Entregar script SQL comentado.', estado: 'pendiente', fecha_vencimiento: '2026-03-22T23:59:00.000Z' },

  // ── DAW · Lenguajes de Marcas ────────────────────────────────────────────
  { modulo: 'Lenguajes de Marcas', ciclo: 'DAW', titulo: 'Transformación XML con XSLT', descripcion: 'Crear un fichero XML con un catálogo de películas y una hoja de estilos XSLT que lo transforme en una página HTML con tabla filtrable por género.', estado: 'completada', nota: 6.5, fecha_vencimiento: '2026-03-08T23:59:00.000Z' },
  { modulo: 'Lenguajes de Marcas', ciclo: 'DAW', titulo: 'Integración y consumo de API JSON', descripcion: 'Crear una página web que consuma una API pública (p.ej. OpenWeatherMap) y muestre los datos en formato JSON procesados y maquetados con HTML y CSS.', estado: 'en-progreso', fecha_vencimiento: '2026-03-16T23:59:00.000Z' },

  // ── DAM · Programación Multimedia y Dispositivos Móviles ─────────────────
  { modulo: 'Programación Multimedia y Dispositivos Móviles', ciclo: 'DAM', titulo: 'App Android: Reproductor de música', descripcion: 'Desarrollar una aplicación Android en Kotlin que permita reproducir archivos de audio del dispositivo. Implementar controles de play/pause/siguiente y una lista de reproducción.', estado: 'completada', nota: 8, fecha_vencimiento: '2026-03-11T23:59:00.000Z' },
  { modulo: 'Programación Multimedia y Dispositivos Móviles', ciclo: 'DAM', titulo: 'Captura y procesamiento de imágenes con la cámara', descripcion: 'Crear una app Android que acceda a la cámara del dispositivo, capture fotos y permita aplicar filtros de imagen básicos (escala de grises, brillo, contraste). Guardar en galería.', estado: 'pendiente', fecha_vencimiento: '2026-03-27T23:59:00.000Z' },
  { modulo: 'Programación Multimedia y Dispositivos Móviles', ciclo: 'DAM', titulo: 'Notificaciones push en Android', descripcion: 'Integrar Firebase Cloud Messaging (FCM) en la aplicación Android para recibir y mostrar notificaciones push. Implementar canales de notificación y gestionar el ciclo de vida.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-08T23:59:00.000Z' },

  // ── DAM · Programación de Servicios y Procesos ───────────────────────────
  { modulo: 'Programación de Servicios y Procesos', ciclo: 'DAM', titulo: 'Comunicación entre procesos con sockets TCP', descripcion: 'Implementar un sistema cliente-servidor en Java usando sockets TCP. El servidor debe atender múltiples clientes concurrentemente usando hilos y permitir el envío de mensajes.', estado: 'completada', nota: 9, fecha_vencimiento: '2026-03-12T23:59:00.000Z' },
  { modulo: 'Programación de Servicios y Procesos', ciclo: 'DAM', titulo: 'Procesamiento paralelo con ExecutorService', descripcion: 'Desarrollar una aplicación que procese grandes volúmenes de datos usando el framework de concurrencia de Java (ExecutorService, Future, Callable). Comparar rendimiento vs ejecución secuencial.', estado: 'en-progreso', fecha_vencimiento: '2026-03-19T23:59:00.000Z' },

  // ── DAM · Sistemas de Gestión Empresarial ────────────────────────────────
  { modulo: 'Sistemas de Gestión Empresarial', ciclo: 'DAM', titulo: 'Configuración de empresa en Odoo', descripcion: 'Instalar Odoo en una máquina virtual y configurar una empresa ficticia: módulos de ventas, compras, inventario y contabilidad. Crear al menos 10 productos y 5 clientes de prueba.', estado: 'completada', nota: 7.5, fecha_vencimiento: '2026-03-06T23:59:00.000Z' },
  { modulo: 'Sistemas de Gestión Empresarial', ciclo: 'DAM', titulo: 'Módulo personalizado en Odoo con Python', descripcion: 'Desarrollar un módulo personalizado en Odoo que añada una nueva funcionalidad al ERP. Usar el framework ORM de Odoo y crear vistas en XML.', estado: 'pendiente', fecha_vencimiento: '2026-03-28T23:59:00.000Z' },

  // ── DAM · Programación (1r curso) ────────────────────────────────────────
  { modulo: 'Programación', ciclo: 'DAM', titulo: 'Estructuras de datos: pilas, colas y listas enlazadas', descripcion: 'Implementar desde cero en Java las estructuras de datos Pila (Stack), Cola (Queue) y Lista Enlazada Simple. Incluir métodos de inserción, eliminación, búsqueda y visualización.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-09T23:59:00.000Z' },
  { modulo: 'Programación', ciclo: 'DAM', titulo: 'Proyecto: aplicación de gestión de contactos', descripcion: 'Desarrollar una agenda de contactos en Java con interfaz de consola. Permite añadir, editar, eliminar y buscar contactos. Los datos deben persistir en un fichero CSV.', estado: 'en-progreso', fecha_vencimiento: '2026-03-23T23:59:00.000Z' },

  // ── DAM · Bases de Datos ─────────────────────────────────────────────────
  { modulo: 'Bases de Datos', ciclo: 'DAM', titulo: 'Acceso a BBDD con JDBC', descripcion: 'Crear una aplicación Java que se conecte a una base de datos MySQL usando JDBC. Implementar operaciones CRUD completas sobre una tabla de empleados con manejo de excepciones.', estado: 'completada', nota: 7, fecha_vencimiento: '2026-03-14T23:59:00.000Z' },
  { modulo: 'Bases de Datos', ciclo: 'DAM', titulo: 'ORM con Hibernate y JPA', descripcion: 'Migrar el proyecto JDBC anterior a Hibernate/JPA. Configurar las entidades con anotaciones, definir las relaciones y usar HQL para las consultas más complejas.', estado: 'pendiente', fecha_vencimiento: '2026-03-30T23:59:00.000Z' },

  // ── ASIR · Administración de Sistemas Operativos ─────────────────────────
  { modulo: 'Administración de Sistemas Operativos', ciclo: 'ASIR', titulo: 'Administración avanzada de Active Directory', descripcion: 'Configurar un dominio Windows Server con Active Directory. Crear UOs, grupos, políticas GPO, y gestionar permisos de carpetas compartidas para diferentes departamentos de una empresa.', estado: 'completada', nota: 8, fecha_vencimiento: '2026-03-07T23:59:00.000Z' },
  { modulo: 'Administración de Sistemas Operativos', ciclo: 'ASIR', titulo: 'Scripting de administración con PowerShell y Bash', descripcion: 'Desarrollar 5 scripts de automatización: 3 en PowerShell (gestión de usuarios AD, backup de logs, monitorización de servicios) y 2 en Bash (gestión de procesos y cron jobs en Linux).', estado: 'en-progreso', fecha_vencimiento: '2026-03-17T23:59:00.000Z' },
  { modulo: 'Administración de Sistemas Operativos', ciclo: 'ASIR', titulo: 'Configuración de RAID por software en Linux', descripcion: 'Configurar un array RAID 5 con mdadm en Ubuntu Server usando discos virtuales. Simular el fallo de un disco, verificar la degradación y sustituirlo documentando el proceso.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-09T23:59:00.000Z' },

  // ── ASIR · Seguridad y Alta Disponibilidad ────────────────────────────────
  { modulo: 'Seguridad y Alta Disponibilidad', ciclo: 'ASIR', titulo: 'Auditoría de seguridad con Nmap y Metasploit', descripcion: 'Realizar una auditoría de seguridad en un entorno de laboratorio controlado. Usar Nmap para escanear la red, identificar vulnerabilidades y documentar un informe de hallazgos con propuestas de mitigación.', estado: 'completada', nota: 9.5, fecha_vencimiento: '2026-03-10T23:59:00.000Z' },
  { modulo: 'Seguridad y Alta Disponibilidad', ciclo: 'ASIR', titulo: 'Cluster de alta disponibilidad con HAProxy y Keepalived', descripcion: 'Montar en máquinas virtuales un cluster activo-pasivo con HAProxy como balanceador de carga y Keepalived para la conmutación por error. Probar el failover y documentar el proceso.', estado: 'pendiente', fecha_vencimiento: '2026-03-26T23:59:00.000Z' },
  { modulo: 'Seguridad y Alta Disponibilidad', ciclo: 'ASIR', titulo: 'Hardening de servidor Linux con CIS Benchmark', descripcion: 'Aplicar las medidas de hardening del CIS Benchmark para Ubuntu Server: deshabilitar servicios innecesarios, configurar PAM, límites de recursos y políticas de contraseñas.', estado: 'completada', nota: 9, fecha_vencimiento: '2026-03-08T23:59:00.000Z' },

  // ── ASIR · Implantación de Sistemas Operativos ────────────────────────────
  { modulo: 'Implantación de Sistemas Operativos', ciclo: 'ASIR', titulo: 'Instalación y configuración de servidor LAMP', descripcion: 'Instalar y configurar desde cero un servidor LAMP (Linux, Apache, MySQL, PHP) en Ubuntu Server. Configurar virtual hosts, PHP-FPM y permisos de seguridad. Desplegar una aplicación PHP de prueba.', estado: 'completada', nota: 7, fecha_vencimiento: '2026-03-08T23:59:00.000Z' },
  { modulo: 'Implantación de Sistemas Operativos', ciclo: 'ASIR', titulo: 'Virtualización con VirtualBox y gestión de snapshots', descripcion: 'Crear un entorno virtualizado con VirtualBox con 3 VMs (un servidor y dos clientes). Configurar redes NAT y host-only, practicar la gestión de snapshots y clonación de máquinas.', estado: 'en-progreso', fecha_vencimiento: '2026-03-21T23:59:00.000Z' },

  // ── SMR · Redes Locales ──────────────────────────────────────────────────
  { modulo: 'Redes Locales', ciclo: 'SMR', titulo: 'Diseño y cableado de red de área local', descripcion: 'Diseñar la infraestructura de red para una oficina de 20 puestos. Crear el esquema de direccionamiento IP (subnetting), elegir el equipamiento (switch, router, AP) y elaborar el presupuesto.', estado: 'completada', nota: 8, fecha_vencimiento: '2026-03-05T23:59:00.000Z' },
  { modulo: 'Redes Locales', ciclo: 'SMR', titulo: 'Configuración de switch con VLANs y STP', descripcion: 'En el simulador Packet Tracer, configurar un switch Cisco con 3 VLANs (administración, ventas y producción), routing inter-VLAN y verificar que el protocolo STP evita bucles de red.', estado: 'en-progreso', fecha_vencimiento: '2026-03-16T23:59:00.000Z' },
  { modulo: 'Redes Locales', ciclo: 'SMR', titulo: 'Configuración de router con NAT y ACLs', descripcion: 'En Packet Tracer, configurar un router Cisco con NAT overload para acceso a internet y ACLs para restringir el tráfico entre VLANs según la política de seguridad de la empresa.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-08T23:59:00.000Z' },

  // ── SMR · Sistemas Operativos en Red ─────────────────────────────────────
  { modulo: 'Sistemas Operativos en Red', ciclo: 'SMR', titulo: 'Instalación y administración de Windows Server', descripcion: 'Instalar Windows Server en una VM, configurar el rol de servidor de ficheros con cuotas de disco, implementar DFS para compartir carpetas de forma distribuida y hacer capturas de todo el proceso.', estado: 'completada', nota: 6.5, fecha_vencimiento: '2026-03-11T23:59:00.000Z' },
  { modulo: 'Sistemas Operativos en Red', ciclo: 'SMR', titulo: 'Configuración de servidor DHCP y DNS en Linux', descripcion: 'Instalar y configurar ISC DHCP Server y BIND9 en Ubuntu Server para proporcionar servicio de direccionamiento automático y resolución de nombres a una red local de prueba.', estado: 'pendiente', fecha_vencimiento: '2026-03-25T23:59:00.000Z' },

  // ── SMR · Seguridad Informática ──────────────────────────────────────────
  { modulo: 'Seguridad Informática', ciclo: 'SMR', titulo: 'Configuración de firewall con iptables', descripcion: 'Configurar un firewall en Linux usando iptables para una red con zona DMZ. Definir políticas para tráfico entrante, saliente y de reenvío. Documentar todas las reglas y su justificación.', estado: 'completada', nota: 8.5, fecha_vencimiento: '2026-03-13T23:59:00.000Z' },
  { modulo: 'Seguridad Informática', ciclo: 'SMR', titulo: 'Plan de backup y recuperación ante desastres', descripcion: 'Diseñar e implementar una política de copias de seguridad para una empresa usando rsync y cron. Incluir backup incremental, rotación de copias y procedimiento de restauración documentado.', estado: 'en-progreso', fecha_vencimiento: '2026-03-28T23:59:00.000Z' },
  { modulo: 'Seguridad Informática', ciclo: 'SMR', titulo: 'Cifrado de datos con GPG y certificados SSL', descripcion: 'Generar un par de claves GPG, cifrar y firmar documentos. Crear una CA propia con OpenSSL, emitir certificados para servicios internos e instalarlos en un servidor web.', estado: 'completada', nota: 9, fecha_vencimiento: '2026-03-09T23:59:00.000Z' },
];

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIONES
// ─────────────────────────────────────────────────────────────────────────────

async function resetBD() {
  console.log('\n🗑️  Reseteando base de datos...');
  const DUMMY = '00000000-0000-0000-0000-000000000000';
  await supabase.from('tareas').delete().neq('id', DUMMY);
  await supabase.from('modulos_estudiantes').delete().neq('id', DUMMY);
  await supabase.from('modulos').delete().neq('id', DUMMY);
  await supabase.from('usuarios').delete().neq('id', DUMMY);
  console.log('✅  Base de datos limpia');
}

async function seedModulos() {
  console.log('\n📚  Insertando módulos...');
  const { data, error } = await supabase
    .from('modulos')
    .insert(MODULOS)
    .select('id, nombre, ciclo_formativo');

  if (error) throw new Error(`Error insertando módulos: ${error.message}`);

  // Mapa: "NombreModulo|ciclo" → id
  const mapa = new Map();
  for (const m of data) {
    mapa.set(`${m.nombre}|${m.ciclo_formativo}`, m.id);
  }
  console.log(`✅  ${data.length} módulos insertados`);
  return mapa;
}

async function seedUsuarios() {
  console.log('\n👤  Insertando usuarios...');

  const rows = await Promise.all(
    USUARIOS_DEMO.map(async (u) => ({
      nombre: u.nombre,
      email: u.email,
      password_hash: await bcrypt.hash(u.password, 10),
      ciclo_formativo: u.ciclo_formativo,
      rol: u.rol,
    }))
  );

  const { data, error } = await supabase
    .from('usuarios')
    .insert(rows)
    .select('id, email, ciclo_formativo, rol');

  if (error) throw new Error(`Error insertando usuarios: ${error.message}`);

  // Mapa: email → { id, ciclo, rol }
  const mapa = new Map();
  for (const u of data) {
    mapa.set(u.email, { id: u.id, ciclo: u.ciclo_formativo, rol: u.rol });
  }
  console.log(`✅  ${data.length} usuarios insertados`);
  return mapa;
}

async function seedModulosEstudiantes(modulosMapa, usuariosMapa) {
  console.log('\n🔗  Asignando módulos a estudiantes...');
  const registros = [];

  for (const [, usuario] of usuariosMapa) {
    if (usuario.rol !== 'estudiante') continue;

    for (const [key, moduloId] of modulosMapa) {
      const ciclo = key.split('|')[1];
      if (ciclo === usuario.ciclo) {
        registros.push({
          modulo_id: moduloId,
          estudiante_id: usuario.id,
          estado: 'cursando',
        });
      }
    }
  }

  if (registros.length === 0) {
    console.log('⚠️  No hay asignaciones que crear');
    return;
  }

  const { data, error } = await supabase
    .from('modulos_estudiantes')
    .insert(registros)
    .select('id');

  if (error) throw new Error(`Error asignando módulos: ${error.message}`);
  console.log(`✅  ${data.length} asignaciones creadas`);
}

async function seedTareas(modulosMapa, usuariosMapa) {
  console.log('\n📝  Insertando tareas...');
  const registros = [];

  for (const tarea of TAREAS_MOCK) {
    const moduloId = modulosMapa.get(`${tarea.modulo}|${tarea.ciclo}`);
    if (!moduloId) {
      console.warn(`⚠️  Módulo no encontrado: "${tarea.modulo}" (${tarea.ciclo})`);
      continue;
    }

    // Buscar el estudiante demo del ciclo correspondiente
    for (const [, usuario] of usuariosMapa) {
      if (usuario.rol === 'estudiante' && usuario.ciclo === tarea.ciclo) {
        registros.push({
          modulo_id: moduloId,
          estudiante_id: usuario.id,
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          fecha_vencimiento: tarea.fecha_vencimiento,
          estado: tarea.estado,
          nota: tarea.nota ?? null,
        });
        break;
      }
    }
  }

  if (registros.length === 0) {
    console.log('⚠️  No hay tareas para insertar');
    return;
  }

  const { data, error } = await supabase
    .from('tareas')
    .insert(registros)
    .select('id');

  if (error) throw new Error(`Error insertando tareas: ${error.message}`);
  console.log(`✅  ${data.length} tareas insertadas`);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  SEED — API Tareas Módulos');
  console.log('═══════════════════════════════════════════════════');

  if (isReset) await resetBD();

  const modulosMapa  = await seedModulos();
  const usuariosMapa = await seedUsuarios();
  await seedModulosEstudiantes(modulosMapa, usuariosMapa);
  await seedTareas(modulosMapa, usuariosMapa);

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  ✅  Seed completado con éxito');
  console.log('═══════════════════════════════════════════════════');
  console.log('\nUsuarios creados:');
  console.log('  admin@admin.com   / admin123  → administrador');
  console.log('  maria@demo.com    / 123456    → estudiante DAW');
  console.log('  carlos@demo.com   / 123456    → estudiante DAM');
  console.log('  ana@demo.com      / 123456    → estudiante ASIR');
  console.log('  pedro@demo.com    / 123456    → estudiante SMR');
  console.log('');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌  Error en el seed:', err.message);
  process.exit(1);
});
