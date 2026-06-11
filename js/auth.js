/**
 * Auth Module
 * Maneja autenticación, tokens y sesión
 */

class Auth {
    /**
     * Guardar token en localStorage
     */
    static setToken(token) {
        localStorage.setItem('token', token);
    }

    /**
     * Obtener token del localStorage
     */
    static getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Verificar si hay sesión activa
     */
    static isAuthenticated() {
        return this.getToken() !== null;
    }

    /**
     * Guardar datos del usuario
     */
    static setUser(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
    }

    /**
     * Obtener datos del usuario
     */
    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Limpiar sesión
     */
    static clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    /**
     * Login
     */
    static async login(usuario, contrasena) {
        try {
            const response = await AuthAPI.login(usuario, contrasena);

            if (response.success) {
                this.setToken(response.data.token);
                this.setUser(response.data);
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Logout
     */
    static async logout() {
        try {
            await AuthAPI.logout();
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            this.clearSession();
        }
    }

    /**
     * Verificar token actual
     */
    static async verifyToken() {
        try {
            if (!this.isAuthenticated()) {
                return false;
            }

            const response = await AuthAPI.verifyToken();
            return response.success;
        } catch (error) {
            this.clearSession();
            return false;
        }
    }
}

/**
 * Redirigir a login si no está autenticado
 */
function checkAuth() {
    if (!Auth.isAuthenticated()) {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('dashboardPage').style.display = 'none';
    } else {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboardPage').style.display = 'flex';
    }
}

/**
 * Inicializar autenticación al cargar la página
 */
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();

    // Verificar token cada 5 minutos
    setInterval(async function() {
        if (Auth.isAuthenticated()) {
            const isValid = await Auth.verifyToken();
            if (!isValid) {
                alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
                showLogin();
            }
        }
    }, 300000); // 5 minutos
});

/**
 * Mostrar página de login
 */
function showLogin() {
    Auth.clearSession();
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboardPage').style.display = 'none';
}

/**
 * Manejar envío del formulario de login
 */
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const usuario = document.getElementById('loginUser').value.trim();
            const contrasena = document.getElementById('loginPassword').value.trim();
            const errorDiv = document.getElementById('loginError');

            // Limpiar mensaje de error
            errorDiv.textContent = '';
            errorDiv.classList.remove('show');

            if (!usuario || !contrasena) {
                errorDiv.textContent = 'Por favor completa todos los campos';
                errorDiv.classList.add('show');
                return;
            }

            try {
                const result = await Auth.login(usuario, contrasena);

                if (result.success) {
                    // Login exitoso, mostrar dashboard
                    document.getElementById('loginPage').style.display = 'none';
                    document.getElementById('dashboardPage').style.display = 'flex';
                    document.getElementById('loginForm').reset();
                } else {
                    errorDiv.textContent = result.message || 'Usuario o contraseña incorrectos';
                    errorDiv.classList.add('show');
                }
            } catch (error) {
                errorDiv.textContent = 'Error al iniciar sesión. Verifica que los servicios estén activos.';
                errorDiv.classList.add('show');
                console.error('Error de login:', error);
            }
        });
    }
});