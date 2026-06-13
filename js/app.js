// ============================================================
// NAVEGACIÓN
// ============================================================

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(sectionId + 'Section');
    if (section) section.classList.add('active');

    // Cargar datos al entrar a secciones de consulta
    if (sectionId === 'conductoresConsultar') cargarListaConductores();
    if (sectionId === 'vehiculosConsultar') cargarListaVehiculos();
    if (sectionId === 'rutasConsultar') cargarListaRutas();
    if (sectionId === 'viajesConsultar') cargarListaViajes();
}

function logout() {
    if (confirm('¿Cerrar sesión?')) {
        Auth.clearSession();
        document.getElementById('loginSection').classList.add('active');
        document.getElementById('dashboardSection').classList.remove('active');
    }
}

// ============================================================
// INDICADORES DE ESTADO
// ============================================================

const ESTADOS = {
    // Conductores
    activo:        { color: '#22c55e', label: 'Activo' },
    inactivo:      { color: '#d1d5db', label: 'Inactivo' },
    suspendido:    { color: '#ef4444', label: 'Suspendido' },
    // Vehículos
    disponible:    { color: '#22c55e', label: 'Disponible' },
    en_ruta:       { color: '#eab308', label: 'En ruta' },
    mantenimiento: { color: '#ef4444', label: 'Mantenim.' },
    // Viajes
    programado:    { color: '#22c55e', label: 'Programado' },
    en_transito:   { color: '#eab308', label: 'En tránsito' },
    retrasado:     { color: '#ef4444', label: 'Retrasado' },
    finalizado:    { color: '#d1d5db', label: 'Finalizado' },
    cancelado:     { color: '#f97316', label: 'Cancelado' },
};

function badgeEstado(estado) {
    const e = ESTADOS[estado] || { color: '#9ca3af', label: estado };
    return `<span class="estado-badge">
        <span class="estado-dot" style="background:${e.color}"></span>
        <span class="estado-label">${e.label}</span>
    </span>`;
}

// ============================================================
// RENDERIZAR LISTADO
// ============================================================

function renderLista(containerId, items, renderFn, emptyMsg = 'Sin resultados') {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!items || items.length === 0) {
        container.innerHTML = `<p class="lista-vacia">${emptyMsg}</p>`;
        return;
    }
    container.innerHTML = items.map(renderFn).join('');
}

function itemLista(texto, estado) {
    return `<div class="lista-item">
        <span class="lista-texto">${texto}</span>
        ${estado ? badgeEstado(estado) : ''}
    </div>`;
}

// ============================================================
// CONDUCTORES - CREAR
// ============================================================

document.getElementById('formCrearConductor')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('mensajeConductor');
    const obj = Object.fromEntries(new FormData(e.target));
    try {
        await ConductoresAPI.create(obj);
        msg.className = 'form-message success';
        msg.textContent = '✓ Conductor registrado';
        e.target.reset();
        setTimeout(() => msg.textContent = '', 3000);
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
});

// ============================================================
// CONDUCTORES - EDITAR
// ============================================================

let conductorEditandoId = null;

async function buscarConductor() {
    const val = document.getElementById('buscarConductorId').value.trim();
    const msg = document.getElementById('mensajeConductorEditar');
    if (!val) return;
    try {
        const res = await ConductoresAPI.getAll({ documento: val });
        const conductor = res.data?.[0];
        if (!conductor) { msg.className = 'form-message error'; msg.textContent = '✗ No encontrado'; return; }
        conductorEditandoId = conductor.id;
        const form = document.getElementById('formEditarConductor');
        form.querySelector('[name="nombre"]').value = conductor.nombre || '';
        form.querySelector('[name="apellidos"]').value = conductor.apellidos || '';
        form.querySelector('[name="telefono"]').value = conductor.telefono || '';
        form.querySelector('[name="correo"]').value = conductor.correo || '';
        form.querySelector('[name="estado"]').value = conductor.estado || '';
        msg.textContent = '';
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
}

document.getElementById('formEditarConductor')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('mensajeConductorEditar');
    if (!conductorEditandoId) { msg.className = 'form-message error'; msg.textContent = '✗ Busca un conductor primero'; return; }
    const obj = Object.fromEntries(new FormData(e.target));
    try {
        await ConductoresAPI.update(conductorEditandoId, obj);
        msg.className = 'form-message success';
        msg.textContent = '✓ Conductor actualizado';
        setTimeout(() => msg.textContent = '', 3000);
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
});

// ============================================================
// CONDUCTORES - CONSULTAR
// ============================================================

let conductoresData = [];

async function cargarListaConductores() {
    const container = document.getElementById('listaConductores');
    if (container) container.innerHTML = '<p class="lista-cargando">Cargando...</p>';
    try {
        const res = await ConductoresAPI.getAll();
        conductoresData = res.data || [];
        filtrarConductores();
    } catch (err) {
        if (container) container.innerHTML = `<p class="lista-vacia">Error al cargar: ${err.message}</p>`;
    }
}

function filtrarConductores() {
    const doc = document.getElementById('filtroDocumento')?.value.toLowerCase() || '';
    const lic = document.getElementById('filtroLicencia')?.value.toLowerCase() || '';
    const est = document.getElementById('filtroEstado')?.value || '';

    const filtrados = conductoresData.filter(c =>
        (!doc || (c.documento || '').toLowerCase().includes(doc)) &&
        (!lic || (c.numero_licencia || '').toLowerCase().includes(lic)) &&
        (!est || c.estado === est)
    );

    renderLista('listaConductores', filtrados, c =>
        itemLista(`${c.nombre} ${c.apellidos} — Doc: ${c.documento}`, c.estado),
        'No hay conductores registrados'
    );
}

// ============================================================
// VEHÍCULOS - CREAR
// ============================================================

document.getElementById('formCrearVehiculo')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('mensajeVehiculo');
    const obj = Object.fromEntries(new FormData(e.target));
    try {
        await VehiculosAPI.create(obj);
        msg.className = 'form-message success';
        msg.textContent = '✓ Vehículo registrado';
        e.target.reset();
        setTimeout(() => msg.textContent = '', 3000);
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
});

// ============================================================
// VEHÍCULOS - EDITAR
// ============================================================

let vehiculoEditandoId = null;

async function buscarVehiculo() {
    const val = document.getElementById('buscarVehiculoPlaca').value.trim();
    const msg = document.getElementById('mensajeVehiculoEditar');
    if (!val) return;
    try {
        const res = await VehiculosAPI.getAll({ placa: val });
        const v = res.data?.[0];
        if (!v) { msg.className = 'form-message error'; msg.textContent = '✗ No encontrado'; return; }
        vehiculoEditandoId = v.id;
        const form = document.getElementById('formEditarVehiculo');
        form.querySelector('[name="tipo_vehiculo"]').value = v.tipo_vehiculo || '';
        form.querySelector('[name="capacidad_carga"]').value = v.capacidad_carga || '';
        form.querySelector('[name="modelo"]').value = v.modelo || '';
        form.querySelector('[name="marca"]').value = v.marca || '';
        form.querySelector('[name="estado"]').value = v.estado || '';
        msg.textContent = '';
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
}

document.getElementById('formEditarVehiculo')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('mensajeVehiculoEditar');
    if (!vehiculoEditandoId) { msg.className = 'form-message error'; msg.textContent = '✗ Busca un vehículo primero'; return; }
    const obj = Object.fromEntries(new FormData(e.target));
    try {
        await VehiculosAPI.update(vehiculoEditandoId, obj);
        msg.className = 'form-message success';
        msg.textContent = '✓ Vehículo actualizado';
        setTimeout(() => msg.textContent = '', 3000);
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
});

// ============================================================
// VEHÍCULOS - CONSULTAR
// ============================================================

let vehiculosData = [];

async function cargarListaVehiculos() {
    const container = document.getElementById('listaVehiculos');
    if (container) container.innerHTML = '<p class="lista-cargando">Cargando...</p>';
    try {
        const res = await VehiculosAPI.getAll();
        vehiculosData = res.data || [];
        filtrarVehiculos();
    } catch (err) {
        if (container) container.innerHTML = `<p class="lista-vacia">Error al cargar: ${err.message}</p>`;
    }
}

function filtrarVehiculos() {
    const placa = document.getElementById('filtroPlaca')?.value.toLowerCase() || '';
    const tipo  = document.getElementById('filtroTipo')?.value.toLowerCase() || '';
    const est   = document.getElementById('filtroEstadoVehiculo')?.value || '';

    const filtrados = vehiculosData.filter(v =>
        (!placa || (v.placa || '').toLowerCase().includes(placa)) &&
        (!tipo  || (v.tipo_vehiculo || '').toLowerCase().includes(tipo)) &&
        (!est   || v.estado === est)
    );

    renderLista('listaVehiculos', filtrados, v =>
        itemLista(`${v.placa} — ${v.marca} ${v.modelo}`, v.estado),
        'No hay vehículos registrados'
    );
}

// ============================================================
// RUTAS - CREAR
// ============================================================

document.getElementById('formCrearRuta')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('mensajeRuta');
    const obj = Object.fromEntries(new FormData(e.target));
    try {
        await RutasAPI.create(obj);
        msg.className = 'form-message success';
        msg.textContent = '✓ Ruta registrada';
        e.target.reset();
        setTimeout(() => msg.textContent = '', 3000);
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
});

// ============================================================
// RUTAS - EDITAR
// ============================================================

let rutaEditandoId = null;

async function buscarRuta() {
    const val = document.getElementById('buscarRutaId').value.trim();
    const msg = document.getElementById('mensajeRutaEditar');
    if (!val) return;
    try {
        const res = await RutasAPI.getAll();
        const ruta = res.data?.find(r => String(r.id) === val);
        if (!ruta) { msg.className = 'form-message error'; msg.textContent = '✗ No encontrada'; return; }
        rutaEditandoId = ruta.id;
        const form = document.getElementById('formEditarRuta');
        form.querySelector('[name="origen"]').value = ruta.origen || '';
        form.querySelector('[name="destino"]').value = ruta.destino || '';
        form.querySelector('[name="distancia"]').value = ruta.distancia || '';
        form.querySelector('[name="tiempo_estimado"]').value = ruta.tiempo_estimado || '';
        msg.textContent = '';
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
}

document.getElementById('formEditarRuta')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('mensajeRutaEditar');
    if (!rutaEditandoId) { msg.className = 'form-message error'; msg.textContent = '✗ Busca una ruta primero'; return; }
    const obj = Object.fromEntries(new FormData(e.target));
    try {
        await RutasAPI.update(rutaEditandoId, obj);
        msg.className = 'form-message success';
        msg.textContent = '✓ Ruta actualizada';
        setTimeout(() => msg.textContent = '', 3000);
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
});

// ============================================================
// RUTAS - CONSULTAR
// ============================================================

let rutasData = [];

async function cargarListaRutas() {
    const container = document.getElementById('listaRutas');
    if (container) container.innerHTML = '<p class="lista-cargando">Cargando...</p>';
    try {
        const res = await RutasAPI.getAll();
        rutasData = res.data || [];
        filtrarRutas();
    } catch (err) {
        if (container) container.innerHTML = `<p class="lista-vacia">Error al cargar: ${err.message}</p>`;
    }
}

function filtrarRutas() {
    const origen  = document.getElementById('filtroOrigen')?.value.toLowerCase() || '';
    const destino = document.getElementById('filtroDestino')?.value.toLowerCase() || '';

    const filtrados = rutasData.filter(r =>
        (!origen  || (r.origen || '').toLowerCase().includes(origen)) &&
        (!destino || (r.destino || '').toLowerCase().includes(destino))
    );

    renderLista('listaRutas', filtrados, r =>
        itemLista(`${r.origen} → ${r.destino} — ${r.distancia} km`, null),
        'No hay rutas registradas'
    );
}

// ============================================================
// VIAJES - PROGRAMAR
// ============================================================

document.getElementById('formProgramarViaje')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('mensajeViaje');
    const obj = Object.fromEntries(new FormData(e.target));
    try {
        await ViajesAPI.create(obj);
        msg.className = 'form-message success';
        msg.textContent = '✓ Viaje programado';
        e.target.reset();
        setTimeout(() => msg.textContent = '', 3000);
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
});

// ============================================================
// VIAJES - EDITAR
// ============================================================

let viajeEditandoId = null;

async function buscarViaje() {
    const val = document.getElementById('buscarViajeId').value.trim();
    const msg = document.getElementById('mensajeViajeEditar');
    if (!val) return;
    try {
        const res = await ViajesAPI.getAll();
        const viaje = res.data?.find(v => String(v.id) === val);
        if (!viaje) { msg.className = 'form-message error'; msg.textContent = '✗ No encontrado'; return; }
        viajeEditandoId = viaje.id;
        const form = document.getElementById('formEditarViaje');
        form.querySelector('[name="conductor_id"]').value = viaje.conductor_id || '';
        form.querySelector('[name="vehiculo_id"]').value = viaje.vehiculo_id || '';
        form.querySelector('[name="fecha_salida"]').value = viaje.fecha_salida || '';
        form.querySelector('[name="estado"]').value = viaje.estado || '';
        msg.textContent = '';
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
}

document.getElementById('formEditarViaje')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('mensajeViajeEditar');
    if (!viajeEditandoId) { msg.className = 'form-message error'; msg.textContent = '✗ Busca un viaje primero'; return; }
    const obj = Object.fromEntries(new FormData(e.target));
    try {
        await ViajesAPI.update(viajeEditandoId, obj);
        msg.className = 'form-message success';
        msg.textContent = '✓ Viaje actualizado';
        setTimeout(() => msg.textContent = '', 3000);
    } catch (err) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Error: ' + err.message;
    }
});

// ============================================================
// VIAJES - CONSULTAR
// ============================================================

let viajesData = [];

async function cargarListaViajes() {
    const container = document.getElementById('listaViajes');
    if (container) container.innerHTML = '<p class="lista-cargando">Cargando...</p>';
    try {
        const res = await ViajesAPI.getAll();
        viajesData = res.data || [];
        filtrarViajes();
    } catch (err) {
        if (container) container.innerHTML = `<p class="lista-vacia">Error al cargar: ${err.message}</p>`;
    }
}

function filtrarViajes() {
    const conductor = document.getElementById('filtroConductorViaje')?.value.toLowerCase() || '';
    const est       = document.getElementById('filtroEstadoViaje')?.value || '';

    const filtrados = viajesData.filter(v =>
        (!conductor || String(v.conductor_id || '').toLowerCase().includes(conductor)) &&
        (!est || v.estado === est)
    );

    renderLista('listaViajes', filtrados, v =>
        itemLista(`Viaje #${v.id} — Salida: ${v.fecha_salida || 'N/D'}`, v.estado),
        'No hay viajes registrados'
    );
}

// ============================================================
// CARGAR SELECTORES AL PROGRAMAR VIAJE
// ============================================================

async function cargarConductores(select) {
    if (select.options.length > 1) return;
    try {
        const res = await ConductoresAPI.getAll();
        res.data?.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.nombre} ${c.apellidos}`;
            select.appendChild(opt);
        });
    } catch (e) { console.error('Error cargando conductores:', e); }
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
    } catch (e) { console.error('Error cargando vehículos:', e); }
}

async function cargarRutas(select) {
    if (select.options.length > 1) return;
    try {
        const res = await RutasAPI.getAll();
        res.data?.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = `${r.origen} → ${r.destino}`;
            select.appendChild(opt);
        });
    } catch (e) { console.error('Error cargando rutas:', e); }
}

window.addEventListener('load', () => {
    const sc = document.querySelector('select[name="conductor_id"]');
    const sv = document.querySelector('select[name="vehiculo_id"]');
    const sr = document.querySelector('select[name="ruta_id"]');
    if (sc) cargarConductores(sc);
    if (sv) cargarVehiculos(sv);
    if (sr) cargarRutas(sr);
});


