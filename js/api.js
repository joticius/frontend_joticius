/**
 * API Service
 * Gestiona todas las llamadas a los microservicios
 */

const API_CONFIG = {
    MS_AUTH: 'http://localhost:8001',        // ← CAMBIAR
    MS_CONDUCTORES: 'http://localhost:8002',
    MS_VEHICULOS: 'http://localhost:8003',
    MS_RUTAS: 'http://localhost:8004',
    MS_VIAJES: 'http://localhost:8005'
};

class ApiService {
    /**
     * Realizar una solicitud HTTP
     */
    static async request(method, url, data = null, headers = {}) {
        try {
            const token = localStorage.getItem('token');
            const defaultHeaders = {
                'Content-Type': 'application/json',
                ...headers
            };

            if (token) {
                defaultHeaders['Authorization'] = `Bearer ${token}`;
            }

            const options = {
                method: method,
                headers: defaultHeaders
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Error en la solicitud');
            }

            return responseData;
        } catch (error) {
            console.error('Error en API:', error);
            throw error;
        }
    }

    /**
     * GET - Obtener datos
     */
    static async get(url) {
        return this.request('GET', url);
    }

    /**
     * POST - Crear datos
     */
    static async post(url, data) {
        return this.request('POST', url, data);
    }

    /**
     * PUT - Actualizar datos
     */
    static async put(url, data) {
        return this.request('PUT', url, data);
    }

    /**
     * DELETE - Eliminar datos
     */
    static async delete(url) {
        return this.request('DELETE', url);
    }
}

/**
 * AUTENTICACIÓN
 */
class AuthAPI {
    static login(usuario, contrasena) {
        const url = `${API_CONFIG.MS_AUTH}/api/auth/login`;
        return ApiService.post(url, { usuario, contrasena });
    }

    static logout() {
        const url = `${API_CONFIG.MS_AUTH}/api/auth/logout`;
        return ApiService.post(url, {});
    }

    static getProfile() {
        const url = `${API_CONFIG.MS_AUTH}/api/auth/profile`;
        return ApiService.get(url);
    }

    static verifyToken() {
        const url = `${API_CONFIG.MS_AUTH}/api/auth/verify-token`;
        return ApiService.get(url);
    }

    static register(nombre, correo, usuario, contrasena, rol = 'operador') {
        const url = `${API_CONFIG.MS_AUTH}/api/auth/register`;
        return ApiService.post(url, { nombre, correo, usuario, contrasena, rol });
    }
}

/**
 * CONDUCTORES
 */
class ConductoresAPI {
    /**
     * Obtener todos los conductores
     */
    static getAll(filters = {}) {
        let url = `${API_CONFIG.MS_CONDUCTORES}/api/conductores`;
        const params = new URLSearchParams();

        if (filters.estado) params.append('estado', filters.estado);
        if (filters.ciudad) params.append('ciudad', filters.ciudad);
        if (filters.tipo_licencia) params.append('tipo_licencia', filters.tipo_licencia);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        return ApiService.get(url);
    }

    /**
     * Obtener solo conductores activos
     */
    static getActivos() {
        const url = `${API_CONFIG.MS_CONDUCTORES}/api/conductores/activos`;
        return ApiService.get(url);
    }

    /**
     * Obtener conductor por ID
     */
    static getById(id) {
        const url = `${API_CONFIG.MS_CONDUCTORES}/api/conductores/${id}`;
        return ApiService.get(url);
    }

    /**
     * Crear nuevo conductor
     */
    static create(data) {
        const url = `${API_CONFIG.MS_CONDUCTORES}/api/conductores`;
        return ApiService.post(url, data);
    }

    /**
     * Actualizar conductor
     */
    static update(id, data) {
        const url = `${API_CONFIG.MS_CONDUCTORES}/api/conductores/${id}`;
        return ApiService.put(url, data);
    }

    /**
     * Eliminar conductor (soft delete)
     */
    static delete(id) {
        const url = `${API_CONFIG.MS_CONDUCTORES}/api/conductores/${id}`;
        return ApiService.delete(url);
    }

    /**
     * Agregar documento
     */
    static addDocumento(conductorId, tipoDocumento, urlDocumento, fechaVencimiento = null) {
        const url = `${API_CONFIG.MS_CONDUCTORES}/api/conductores/${conductorId}/documentos`;
        return ApiService.post(url, {
            tipo_documento: tipoDocumento,
            url_documento: urlDocumento,
            fecha_vencimiento: fechaVencimiento
        });
    }

    /**
     * Obtener calificaciones
     */
    static getCalificaciones(conductorId) {
        const url = `${API_CONFIG.MS_CONDUCTORES}/api/conductores/${conductorId}/calificaciones`;
        return ApiService.get(url);
    }

    /**
     * Agregar calificación
     */
    static addCalificacion(conductorId, usuarioId, calificacion, comentario = null) {
        const url = `${API_CONFIG.MS_CONDUCTORES}/api/conductores/${conductorId}/calificaciones`;
        return ApiService.post(url, {
            usuario_id: usuarioId,
            calificacion: calificacion,
            comentario: comentario
        });
    }
}

/**
 * VEHÍCULOS
 */
class VehiculosAPI {
    /**
     * Obtener todos los vehículos
     */
    static getAll(filters = {}) {
        let url = `${API_CONFIG.MS_VEHICULOS}/api/vehiculos`;
        const params = new URLSearchParams();

        if (filters.estado) params.append('estado', filters.estado);
        if (filters.tipo) params.append('tipo', filters.tipo);
        if (filters.placa) params.append('placa', filters.placa);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        return ApiService.get(url);
    }

    /**
     * Obtener vehículo por ID
     */
    static getById(id) {
        const url = `${API_CONFIG.MS_VEHICULOS}/api/vehiculos/${id}`;
        return ApiService.get(url);
    }

    /**
     * Crear nuevo vehículo
     */
    static create(data) {
        const url = `${API_CONFIG.MS_VEHICULOS}/api/vehiculos`;
        return ApiService.post(url, data);
    }

    /**
     * Actualizar vehículo
     */
    static update(id, data) {
        const url = `${API_CONFIG.MS_VEHICULOS}/api/vehiculos/${id}`;
        return ApiService.put(url, data);
    }

    /**
     * Eliminar vehículo (soft delete)
     */
    static delete(id) {
        const url = `${API_CONFIG.MS_VEHICULOS}/api/vehiculos/${id}`;
        return ApiService.delete(url);
    }
}

/**
 * RUTAS
 */
class RutasAPI {
    /**
     * Obtener todas las rutas
     */
    static getAll(filters = {}) {
        let url = `${API_CONFIG.MS_RUTAS}/api/rutas`;
        const params = new URLSearchParams();

        if (filters.origen) params.append('origen', filters.origen);
        if (filters.destino) params.append('destino', filters.destino);
        if (filters.ciudad) params.append('ciudad', filters.ciudad);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        return ApiService.get(url);
    }

    /**
     * Obtener ruta por ID
     */
    static getById(id) {
        const url = `${API_CONFIG.MS_RUTAS}/api/rutas/${id}`;
        return ApiService.get(url);
    }

    /**
     * Crear nueva ruta
     */
    static create(data) {
        const url = `${API_CONFIG.MS_RUTAS}/api/rutas`;
        return ApiService.post(url, data);
    }

    /**
     * Actualizar ruta
     */
    static update(id, data) {
        const url = `${API_CONFIG.MS_RUTAS}/api/rutas/${id}`;
        return ApiService.put(url, data);
    }

    /**
     * Eliminar ruta
     */
    static delete(id) {
        const url = `${API_CONFIG.MS_RUTAS}/api/rutas/${id}`;
        return ApiService.delete(url);
    }

    /**
     * Programar viaje
     */
    static programarViaje(data) {
        const url = `${API_CONFIG.MS_RUTAS}/api/rutas/viajes/programar`;
        return ApiService.post(url, data);
    }

    /**
     * Obtener viajes programados
     */
    static getViajes(filters = {}) {
        let url = `${API_CONFIG.MS_RUTAS}/api/rutas/viajes`;
        const params = new URLSearchParams();

        if (filters.estado) params.append('estado', filters.estado);
        if (filters.conductor) params.append('conductor', filters.conductor);
        if (filters.vehiculo) params.append('vehiculo', filters.vehiculo);
        if (filters.fecha) params.append('fecha', filters.fecha);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        return ApiService.get(url);
    }

    /**
     * Obtener viaje por ID
     */
    static getViajeById(id) {
        const url = `${API_CONFIG.MS_RUTAS}/api/rutas/viajes/${id}`;
        return ApiService.get(url);
    }

    /**
     * Actualizar viaje
     */
    static updateViaje(id, data) {
        const url = `${API_CONFIG.MS_RUTAS}/api/rutas/viajes/${id}`;
        return ApiService.put(url, data);
    }

    /**
     * Eliminar viaje
     */
    static deleteViaje(id) {
        const url = `${API_CONFIG.MS_RUTAS}/api/rutas/viajes/${id}`;
        return ApiService.delete(url);
    }
}

/**
 * VIAJES
 */
class ViajesAPI {
    /**
     * Obtener todos los viajes
     */
    static getAll(filters = {}) {
        let url = `${API_CONFIG.MS_VIAJES}/api/viajes`;
        const params = new URLSearchParams();

        if (filters.estado) params.append('estado', filters.estado);
        if (filters.conductor) params.append('conductor', filters.conductor);
        if (filters.vehiculo) params.append('vehiculo', filters.vehiculo);
        if (filters.fecha) params.append('fecha', filters.fecha);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        return ApiService.get(url);
    }

    /**
     * Obtener viaje por ID
     */
    static getById(id) {
        const url = `${API_CONFIG.MS_VIAJES}/api/viajes/${id}`;
        return ApiService.get(url);
    }

    /**
     * Iniciar viaje
     */
    static iniciar(id) {
        const url = `${API_CONFIG.MS_VIAJES}/api/viajes/${id}/iniciar`;
        return ApiService.post(url, {});
    }

    /**
     * Actualizar estado del viaje
     */
    static actualizarEstado(id, estado) {
        const url = `${API_CONFIG.MS_VIAJES}/api/viajes/${id}/estado`;
        return ApiService.put(url, { estado });
    }

    /**
     * Registrar novedad
     */
    static registrarNovedad(id, tipo, descripcion) {
        const url = `${API_CONFIG.MS_VIAJES}/api/viajes/${id}/novedades`;
        return ApiService.post(url, {
            tipo_novedad: tipo,
            descripcion: descripcion
        });
    }

    /**
     * Finalizar viaje
     */
    static finalizar(id) {
        const url = `${API_CONFIG.MS_VIAJES}/api/viajes/${id}/finalizar`;
        return ApiService.post(url, {});
    }

    /**
     * Obtener historial del viaje
     */
    static getHistorial(id) {
        const url = `${API_CONFIG.MS_VIAJES}/api/viajes/${id}/historial`;
        return ApiService.get(url);
    }
}