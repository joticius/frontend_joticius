# frontend_joticius

# Frontend LogiTrans

Aplicación frontend para la gestión logística y control de transporte de carga. Desarrollada con HTML5, CSS3 y JavaScript Vanilla.

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local o remoto (http-server, Python, etc.)
- Microservicios backend corriendo en los puertos 8000-8004

## Instalación

### 1. Estructura de carpetas

```
frontend/
├── index.html
├── css/
│   └── estilos.css
├── js/
│   ├── api.js          # Servicios de API
│   ├── auth.js         # Autenticación y sesión
│   └── app.js          # Lógica principal
└── README.md
```

### 2. Copiar los archivos

1. **index.html** → Raíz del proyecto
2. **css/estilos.css** → Carpeta css/
3. **js/api.js** → Carpeta js/
4. **js/auth.js** → Carpeta js/
5. **js/app.js** → Carpeta js/

### 3. Configurar los puertos de los microservicios

En **js/api.js**, modificar la sección `API_CONFIG` si es necesario:

```javascript
const API_CONFIG = {
    MS_AUTH: 'http://localhost:8000',
    MS_CONDUCTORES: 'http://localhost:8001',
    MS_VEHICULOS: 'http://localhost:8002',
    MS_RUTAS: 'http://localhost:8003',
    MS_VIAJES: 'http://localhost:8004'
};
```

### 4. Ejecutar servidor local

#### Opción A: Python 3
```bash
python -m http.server 3000
```

#### Opción B: Python 2
```bash
python -m SimpleHTTPServer 3000
```

#### Opción C: Node.js (http-server)
```bash
npm install -g http-server
http-server -p 3000
```

#### Opción D: PHP
```bash
php -S localhost:3000
```

### 5. Acceder a la aplicación

Abre tu navegador en:
```
http://localhost:3000
```

## Uso

### Login

1. Inicia sesión con las credenciales:
   - **Usuario:** admin
   - **Contraseña:** admin123

   O:
   - **Usuario:** logistica
   - **Contraseña:** logistica123

2. Se almacenará el token en localStorage automáticamente

### Navegación

La aplicación cuenta con 4 módulos principales en el sidebar:

- **Conductores** - Crear, editar y consultar conductores
- **Vehículos** - Crear, editar y consultar vehículos
- **Rutas** - Crear, editar y consultar rutas
- **Viajes** - Programar, editar y consultar viajes

### Operaciones CRUD

Cada módulo permite:

1. **Crear** - Registrar nuevos registros
2. **Editar** - Modificar registros existentes
3. **Consultar** - Buscar y visualizar registros

## Estructura de archivos

### index.html
- Contiene la estructura de todas las páginas
- Página de login con estilo split
- Dashboard con sidebar de navegación
- Secciones para cada módulo
- Formularios para CRUD

### css/estilos.css
- Variables CSS para colores
- Estilos del login
- Estilos del dashboard y sidebar
- Estilos de formularios
- Estilos de listados
- Estilos responsivos

### js/api.js
- Clase `ApiService` - Manejo general de peticiones HTTP
- Clase `AuthAPI` - Endpoints de autenticación
- Clase `ConductoresAPI` - Endpoints de conductores
- Clase `VehiculosAPI` - Endpoints de vehículos
- Clase `RutasAPI` - Endpoints de rutas
- Clase `ViajesAPI` - Endpoints de viajes

### js/auth.js
- Clase `Auth` - Gestión de sesión y token
- Funciones de login/logout
- Validación de autenticación
- Almacenamiento seguro de tokens

### js/app.js
- Funciones de navegación
- Lógica de formularios (CRUD)
- Funciones de búsqueda y filtrado
- Carga de opciones en selectores
- Validación básica de formularios

## Características

 **Autenticación con JWT**
- Login seguro con token
- Validación automática de sesión
- Logout con limpieza de datos

 **Gestión de Conductores**
- Crear conductores con todos los datos
- Editar información personal y licencia
- Consultar conductores con filtros
- Visualizar estado (activo, inactivo, suspendido)

 **Gestión de Vehículos**
- Registrar vehículos con capacidad
- Editar datos y estado
- Consultar por placa o tipo
- Estados visuales (disponible, en ruta, mantenimiento)

 **Gestión de Rutas**
- Crear rutas con distancia y tiempo
- Editar información de ruta
- Consultar rutas disponibles
- Información de origen y destino

 **Gestión de Viajes**
- Programar viajes con conductor, vehículo y ruta
- Editar datos del viaje
- Consultar viajes con múltiples filtros
- Estados visuales de viaje

 **Diseño Responsivo**
- Funciona en desktop, tablet y mobile
- Interfaz intuitiva y moderna
- Colores y diseño según mockup

## Validaciones

El frontend implementa validaciones básicas:

- Campos requeridos en formularios
- Validación de email
- Validación de números
- Verificación de sesión activa

## Mensajes de error

- Los errores se muestran en rojo en los formularios
- Los éxitos se muestran en verde
- Los errores de API se comunican al usuario

## LocalStorage

La aplicación almacena:
- `token` - JWT para autenticación
- `user` - Datos básicos del usuario autenticado

## Seguridad

- Token JWT validado con cada solicitud
- CORS habilitado para comunicación con APIs
- Sesión se limpia al cerrar

## Troubleshooting

### Error de CORS
Si ves errores de CORS, asegúrate de que:
- Los microservicios tienen CORS habilitado
- Los puertos están correctos en `API_CONFIG`
- Los servicios están corriendo

### Token expirado
- El token expira después de 1 hora
- Inicia sesión nuevamente cuando expire
- Se valida automáticamente cada 5 minutos

### No se cargan los datos
- Verifica que los microservicios estén activos
- Comprueba la consola del navegador (F12)
- Revisa que los puertos sean correctos

## Desarrollo

Para agregar nuevas funcionalidades:

1. **Agregar endpoint en `api.js`** en la clase correspondiente
2. **Crear función de manejo en `app.js`**
3. **Agregar HTML en `index.html`** si es necesario
4. **Agregar estilos en `css/estilos.css`**

## Performance

- Carga inicial: ~50KB (CSS + JS)
- Sin frameworks pesados
- Ejecución rápida de operaciones
- Lazy loading de datos

## Compatibilidad

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Notas importantes

**NO USAR EN PRODUCCIÓN**
- Ajustar CORS según necesidad
- Implementar validaciones más robustas
- Usar HTTPS obligatoriamente
- Implementar refresh token
- Añadir protección contra ataques

## Licencia

Proyecto privado de LogiTrans - Sistema de Transporte de Carga.

---

**Última actualización:** Junio 2024
**Versión:** 1.0