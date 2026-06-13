// ============================================================
// NAVEGACIÓN
// ============================================================

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    const section = document.getElementById(sectionId + 'Section');
    if (section) {
        section.classList.add('active');
    }
}

function logout() {
    if (confirm('¿Cerrar sesión?')) {
        Auth.clearSession();
        document.getElementById('loginSection').classList.add('active');
        document.getElementById('dashboardSection').classList.remove('active');
    }
}

// ============================================================
// CONDUCTORES
// ============================================================

document.getElementById('formCrearConductor')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);

    try {
        await ConductoresAPI.create(obj);
        document.getElementById('mensajeConductor').className = 'form-message success';
        document.getElementById('mensajeConductor').textContent = '✓ Registrado';
        e.target.reset();
        setTimeout(() => document.getElementById('mensajeConductor').textContent = '', 3000);
    } catch (error) {
        document.getElementById('mensajeConductor').className = 'form-message error';
        document.getElementById('mensajeConductor').textContent = '✗ Error: ' + error.message;
    }
});

// ============================================================
// VEHÍCULOS
// ============================================================

document.getElementById('formCrearVehiculo')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);

    try {
        await VehiculosAPI.create(obj);
        document.getElementById('mensajeVehiculo').className = 'form-message success';
        document.getElementById('mensajeVehiculo').textContent = '✓ Registrado';
        e.target.reset();
        setTimeout(() => document.getElementById('mensajeVehiculo').textContent = '', 3000);
    } catch (error) {
        document.getElementById('mensajeVehiculo').className = 'form-message error';
        document.getElementById('mensajeVehiculo').textContent = '✗ Error: ' + error.message;
    }
});

// ============================================================
// RUTAS
// ============================================================

document.getElementById('formCrearRuta')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);

    try {
        await RutasAPI.create(obj);
        document.getElementById('mensajeRuta').className = 'form-message success';
        document.getElementById('mensajeRuta').textContent = '✓ Registrado';
        e.target.reset();
        setTimeout(() => document.getElementById('mensajeRuta').textContent = '', 3000);
    } catch (error) {
        document.getElementById('mensajeRuta').className = 'form-message error';
        document.getElementById('mensajeRuta').textContent = '✗ Error: ' + error.message;
    }
});

// ============================================================
// VIAJES
// ============================================================

document.getElementById('formProgramarViaje')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);

    try {
        await ViajesAPI.create(obj);
        document.getElementById('mensajeViaje').className = 'form-message success';
        document.getElementById('mensajeViaje').textContent = '✓ Programado';
        e.target.reset();
        setTimeout(() => document.getElementById('mensajeViaje').textContent = '', 3000);
    } catch (error) {
        document.getElementById('mensajeViaje').className = 'form-message error';
        document.getElementById('mensajeViaje').textContent = '✗ Error: ' + error.message;
    }
});

// ============================================================
// CARGAR SELECTORES
// ============================================================

async function cargarConductores(select) {
    if (select.options.length > 1) return;
    try {
        const res = await ConductoresAPI.getAll();
        res.data?.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.nombre;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error('Error cargando conductores:', e);
    }
}

async function cargarVehiculos(select) {
    if (select.options.length > 1) return;
    try {
        const res = await VehiculosAPI.getAll();
        res.data?.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.textContent = v.placa;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error('Error cargando vehículos:', e);
    }
}

async function cargarRutas(select) {
    if (select.options.length > 1) return;
    try {
        const res = await RutasAPI.getAll();
        res.data?.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = r.origen + ' → ' + r.destino;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error('Error cargando rutas:', e);
    }
}

window.addEventListener('load', () => {
    const sc = document.querySelector('select[name="conductor_id"]');
    const sv = document.querySelector('select[name="vehiculo_id"]');
    const sr = document.querySelector('select[name="ruta_id"]');
    if (sc) cargarConductores(sc);
    if (sv) cargarVehiculos(sv);
    if (sr) cargarRutas(sr);
});