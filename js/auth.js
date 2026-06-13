// ============================================================
// AUTENTICACIÓN SIMPLE Y DIRECTA
// ============================================================

class Auth {
    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    static async login(usuario, contrasena) {
        console.log('Intentando login con:', usuario);
        
        const response = await fetch('http://localhost:8001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ usuario, contrasena })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!data.success) {
            throw new Error(data.message || 'Error en la autenticación');
        }

        this.setToken(data.data.token);
        return data.data;
    }
}

// ============================================================
// FUNCIÓN DE LOGIN
// ============================================================

async function loginDirect() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const msg = document.getElementById('loginMessage');

    console.log('Login directo llamado');

    if (!usuario || !contrasena) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Completa usuario y contraseña';
        return;
    }

    try {
        msg.className = 'form-message';
        msg.textContent = 'Verificando credenciales...';

        const result = await Auth.login(usuario, contrasena);

        msg.className = 'form-message success';
        msg.textContent = '✓ ¡Bienvenido!';

        console.log('Login exitoso:', result);

        setTimeout(() => {
            document.getElementById('loginSection').classList.remove('active');
            document.getElementById('dashboardSection').classList.add('active');
            document.getElementById('usuario').value = '';
            document.getElementById('contrasena').value = '';
            msg.textContent = '';
        }, 500);

    } catch (error) {
        console.error('Error de login:', error);
        msg.className = 'form-message error';
        msg.textContent = '✗ ' + error.message;
    }
}

// ============================================================
// MICROSERVICIOS - VERSIÓN SIMPLE
// ============================================================

const API_URLS = {
    MS_AUTH: 'http://localhost:8001',
    MS_CONDUCTORES: 'http://localhost:8002',
    MS_VEHICULOS: 'http://localhost:8003',
    MS_RUTAS: 'http://localhost:8004',
    MS_VIAJES: 'http://localhost:8005'
};

class ConductoresAPI {
    static async getAll(filters = {}) {
        const url = new URL(API_URLS.MS_CONDUCTORES + '/api/conductores');
        if (filters.documento) url.searchParams.append('documento', filters.documento);
        if (filters.estado) url.searchParams.append('estado', filters.estado);

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        return response.json();
    }

    static async create(data) {
        const response = await fetch(API_URLS.MS_CONDUCTORES + '/api/conductores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async update(id, data) {
        const response = await fetch(API_URLS.MS_CONDUCTORES + '/api/conductores/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async delete(id) {
        const response = await fetch(API_URLS.MS_CONDUCTORES + '/api/conductores/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        return response.json();
    }
}

class VehiculosAPI {
    static async getAll(filters = {}) {
        const url = new URL(API_URLS.MS_VEHICULOS + '/api/vehiculos');
        if (filters.placa) url.searchParams.append('placa', filters.placa);
        if (filters.estado) url.searchParams.append('estado', filters.estado);

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        return response.json();
    }

    static async create(data) {
        const response = await fetch(API_URLS.MS_VEHICULOS + '/api/vehiculos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async update(id, data) {
        const response = await fetch(API_URLS.MS_VEHICULOS + '/api/vehiculos/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async delete(id) {
        const response = await fetch(API_URLS.MS_VEHICULOS + '/api/vehiculos/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        return response.json();
    }
}

class RutasAPI {
    static async getAll(filters = {}) {
        const url = new URL(API_URLS.MS_RUTAS + '/api/rutas');
        if (filters.origen) url.searchParams.append('origen', filters.origen);
        if (filters.destino) url.searchParams.append('destino', filters.destino);

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        return response.json();
    }

    static async create(data) {
        const response = await fetch(API_URLS.MS_RUTAS + '/api/rutas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async update(id, data) {
        const response = await fetch(API_URLS.MS_RUTAS + '/api/rutas/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async delete(id) {
        const response = await fetch(API_URLS.MS_RUTAS + '/api/rutas/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        return response.json();
    }
}

class ViajesAPI {
    static async getAll(filters = {}) {
        const url = new URL(API_URLS.MS_VIAJES + '/api/viajes');
        if (filters.conductor_id) url.searchParams.append('conductor_id', filters.conductor_id);
        if (filters.estado) url.searchParams.append('estado', filters.estado);

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        return response.json();
    }

    static async create(data) {
        const response = await fetch(API_URLS.MS_VIAJES + '/api/viajes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async update(id, data) {
        const response = await fetch(API_URLS.MS_VIAJES + '/api/viajes/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async delete(id) {
        const response = await fetch(API_URLS.MS_VIAJES + '/api/viajes/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        return response.json();
    }
}