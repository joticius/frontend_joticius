/**
 * App Module
 * Lógica principal de la aplicación
 */

// Mostrar/ocultar secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const section = document.getElementById(sectionId + 'Section');
    if (section) {
        section.classList.add('active');
    }
}

// Logout
async function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        await Auth.logout();
        showLogin();
    }
}

// ============================================================
// CONDUCTORES
// ============================================================

// Crear conductor
document.addEventListener('DOMContentLoaded', function() {
    const formCrear = document.getElementById('formCrearConductor');
    if (formCrear) {
        formCrear.addEventListener('submit', async function(e) {
            e.preventDefault();

            const data = {
                usuario_id: Auth.getUser()?.id || 1,
                nombre: this.nombre.value,
                correo: this.correo.value,
                telefono: this.telefono.value,
                documento: this.documento.value,
                numero_licencia: this.numero_licencia.value,
                tipo_licencia: this.tipo_licencia.value,
                fecha_vencimiento_licencia: this.fecha_vencimiento_licencia.value,
                apellidos: this.apellidos.value
            };

            try {
                const response = await ConductoresAPI.create(data);
                const msgDiv = document.getElementById('mensajeConductor');
                msgDiv.textContent = '✓ Conductor registrado exitosamente';
                msgDiv.classList.add('success');
                msgDiv.classList.remove('error');
                this.reset();
            } catch (error) {
                const msgDiv = document.getElementById('mensajeConductor');
                msgDiv.textContent = '✗ ' + error.message;
                msgDiv.classList.add('error');
                msgDiv.classList.remove('success');
            }
        });
    }
});

// Buscar conductor para editar
async function buscarConductorEdit() {
    const id = document.getElementById('searchConductorId').value;
    if (!id) {
        alert('Ingresa el ID del conductor');
        return;
    }

    try {
        const response = await ConductoresAPI.getById(id);
        if (response.success) {
            const conductor = response.data;
            document.querySelector('#formEditarConductor input[name="nombre"]').value = conductor.nombre;
            document.querySelector('#formEditarConductor input[name="apellidos"]').value = conductor.apellidos || '';
            document.querySelector('#formEditarConductor input[name="documento"]').value = conductor.documento;
            document.querySelector('#formEditarConductor input[name="telefono"]').value = conductor.telefono;
            document.querySelector('#formEditarConductor input[name="correo"]').value = conductor.correo;
            document.querySelector('#formEditarConductor input[name="numero_licencia"]').value = conductor.numero_licencia;
            document.querySelector('#formEditarConductor select[name="tipo_licencia"]').value = conductor.tipo_licencia;
            document.querySelector('#formEditarConductor input[name="fecha_vencimiento_licencia"]').value = conductor.fecha_vencimiento_licencia;
            document.querySelector('#formEditarConductor select[name="estado"]').value = conductor.estado;
            
            // Guardar el ID para usar en la actualización
            document.querySelector('#formEditarConductor').dataset.conductorId = id;
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Editar conductor
document.addEventListener('DOMContentLoaded', function() {
    const formEditar = document.getElementById('formEditarConductor');
    if (formEditar) {
        formEditar.addEventListener('submit', async function(e) {
            e.preventDefault();

            const id = this.dataset.conductorId;
            if (!id) {
                alert('Primero busca un conductor');
                return;
            }

            const data = {};
            if (this.nombre.value) data.nombre = this.nombre.value;
            if (this.apellidos.value) data.apellidos = this.apellidos.value;
            if (this.documento.value) data.documento = this.documento.value;
            if (this.telefono.value) data.telefono = this.telefono.value;
            if (this.correo.value) data.correo = this.correo.value;
            if (this.numero_licencia.value) data.numero_licencia = this.numero_licencia.value;
            if (this.tipo_licencia.value) data.tipo_licencia = this.tipo_licencia.value;
            if (this.fecha_vencimiento_licencia.value) data.fecha_vencimiento_licencia = this.fecha_vencimiento_licencia.value;
            if (this.estado.value) data.estado = this.estado.value;

            try {
                const response = await ConductoresAPI.update(id, data);
                const msgDiv = document.getElementById('mensajeEditarConductor');
                msgDiv.textContent = '✓ Conductor actualizado exitosamente';
                msgDiv.classList.add('success');
                msgDiv.classList.remove('error');
            } catch (error) {
                const msgDiv = document.getElementById('mensajeEditarConductor');
                msgDiv.textContent = '✗ ' + error.message;
                msgDiv.classList.add('error');
                msgDiv.classList.remove('success');
            }
        });
    }
});

// Consultar conductores
async function consultarConductores() {
    try {
        const filters = {
            estado: document.getElementById('searchEstado').value,
            ciudad: document.getElementById('searchCiudad')?.value
        };

        const response = await ConductoresAPI.getAll(filters);
        const conductores = response.data || [];

        const listado = document.getElementById('listadoConductores');
        listado.innerHTML = '';

        if (conductores.length === 0) {
            listado.innerHTML = '<p style="color: #CCC; padding: 20px;">No hay conductores registrados</p>';
            return;
        }

        conductores.forEach(conductor => {
            const item = document.createElement('div');
            item.className = 'elem-consulta';
            item.innerHTML = `
                <div class="elem-consulta-info">
                    <div class="elem-consulta-title">${conductor.nombre} ${conductor.apellidos || ''}</div>
                    <div class="elem-consulta-details">
                        <div>Documento: ${conductor.documento}</div>
                        <div>Licencia: ${conductor.numero_licencia} (${conductor.tipo_licencia})</div>
                        <div>Correo: ${conductor.correo}</div>
                        <div>Teléfono: ${conductor.telefono}</div>
                    </div>
                </div>
                <div class="elem-consulta-status status-${conductor.estado}">${conductor.estado}</div>
            `;
            listado.appendChild(item);
        });
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================================
// VEHÍCULOS
// ============================================================

// Crear vehículo
document.addEventListener('DOMContentLoaded', function() {
    const formCrear = document.getElementById('formCrearVehiculo');
    if (formCrear) {
        formCrear.addEventListener('submit', async function(e) {
            e.preventDefault();

            const data = {
                placa: this.placa.value,
                tipo_vehiculo: this.tipo_vehiculo.value,
                capacidad_carga: parseInt(this.capacidad_carga.value),
                modelo: this.modelo.value,
                marca: this.marca.value,
                estado: this.estado.value
            };

            try {
                const response = await VehiculosAPI.create(data);
                const msgDiv = document.getElementById('mensajeVehiculo');
                msgDiv.textContent = '✓ Vehículo registrado exitosamente';
                msgDiv.classList.add('success');
                msgDiv.classList.remove('error');
                this.reset();
            } catch (error) {
                const msgDiv = document.getElementById('mensajeVehiculo');
                msgDiv.textContent = '✗ ' + error.message;
                msgDiv.classList.add('error');
                msgDiv.classList.remove('success');
            }
        });
    }
});

// Buscar vehículo para editar
async function buscarVehiculoEdit() {
    const id = document.getElementById('searchVehiculoId').value;
    if (!id) {
        alert('Ingresa el ID del vehículo');
        return;
    }

    try {
        const response = await VehiculosAPI.getById(id);
        if (response.success) {
            const vehiculo = response.data;
            document.querySelector('#formEditarVehiculo input[name="placa"]').value = vehiculo.placa;
            document.querySelector('#formEditarVehiculo input[name="tipo_vehiculo"]').value = vehiculo.tipo_vehiculo;
            document.querySelector('#formEditarVehiculo input[name="capacidad_carga"]').value = vehiculo.capacidad_carga;
            document.querySelector('#formEditarVehiculo input[name="modelo"]').value = vehiculo.modelo;
            document.querySelector('#formEditarVehiculo input[name="marca"]').value = vehiculo.marca;
            document.querySelector('#formEditarVehiculo select[name="estado"]').value = vehiculo.estado;
            
            document.querySelector('#formEditarVehiculo').dataset.vehiculoId = id;
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Editar vehículo
document.addEventListener('DOMContentLoaded', function() {
    const formEditar = document.getElementById('formEditarVehiculo');
    if (formEditar) {
        formEditar.addEventListener('submit', async function(e) {
            e.preventDefault();

            const id = this.dataset.vehiculoId;
            if (!id) {
                alert('Primero busca un vehículo');
                return;
            }

            const data = {};
            if (this.placa.value) data.placa = this.placa.value;
            if (this.tipo_vehiculo.value) data.tipo_vehiculo = this.tipo_vehiculo.value;
            if (this.capacidad_carga.value) data.capacidad_carga = parseInt(this.capacidad_carga.value);
            if (this.modelo.value) data.modelo = this.modelo.value;
            if (this.marca.value) data.marca = this.marca.value;
            if (this.estado.value) data.estado = this.estado.value;

            try {
                const response = await VehiculosAPI.update(id, data);
                const msgDiv = document.getElementById('mensajeEditarVehiculo');
                msgDiv.textContent = '✓ Vehículo actualizado exitosamente';
                msgDiv.classList.add('success');
                msgDiv.classList.remove('error');
            } catch (error) {
                const msgDiv = document.getElementById('mensajeEditarVehiculo');
                msgDiv.textContent = '✗ ' + error.message;
                msgDiv.classList.add('error');
                msgDiv.classList.remove('success');
            }
        });
    }
});

// Consultar vehículos
async function consultarVehiculos() {
    try {
        const filters = {
            estado: document.getElementById('searchEstadoVehiculo').value
        };

        const response = await VehiculosAPI.getAll(filters);
        const vehiculos = response.data || [];

        const listado = document.getElementById('listadoVehiculos');
        listado.innerHTML = '';

        if (vehiculos.length === 0) {
            listado.innerHTML = '<p style="color: #CCC; padding: 20px;">No hay vehículos registrados</p>';
            return;
        }

        vehiculos.forEach(vehiculo => {
            const item = document.createElement('div');
            item.className = 'elem-consulta';
            item.innerHTML = `
                <div class="elem-consulta-info">
                    <div class="elem-consulta-title">${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}</div>
                    <div class="elem-consulta-details">
                        <div>Tipo: ${vehiculo.tipo_vehiculo}</div>
                        <div>Capacidad: ${vehiculo.capacidad_carga} kg</div>
                    </div>
                </div>
                <div class="elem-consulta-status status-${vehiculo.estado}">${vehiculo.estado}</div>
            `;
            listado.appendChild(item);
        });
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================================
// RUTAS
// ============================================================

// Crear ruta
document.addEventListener('DOMContentLoaded', function() {
    const formCrear = document.getElementById('formCrearRuta');
    if (formCrear) {
        formCrear.addEventListener('submit', async function(e) {
            e.preventDefault();

            const data = {
                origen: this.origen.value,
                destino: this.destino.value,
                distancia: parseFloat(this.distancia.value),
                tiempo_estimado: this.tiempo_estimado.value,
                observaciones: this.observaciones.value
            };

            try {
                const response = await RutasAPI.create(data);
                const msgDiv = document.getElementById('mensajeRuta');
                msgDiv.textContent = '✓ Ruta registrada exitosamente';
                msgDiv.classList.add('success');
                msgDiv.classList.remove('error');
                this.reset();
            } catch (error) {
                const msgDiv = document.getElementById('mensajeRuta');
                msgDiv.textContent = '✗ ' + error.message;
                msgDiv.classList.add('error');
                msgDiv.classList.remove('success');
            }
        });
    }
});

// Buscar ruta para editar
async function buscarRutaEdit() {
    const id = document.getElementById('searchRutaId').value;
    if (!id) {
        alert('Ingresa el ID de la ruta');
        return;
    }

    try {
        const response = await RutasAPI.getById(id);
        if (response.success) {
            const ruta = response.data;
            document.querySelector('#formEditarRuta input[name="origen"]').value = ruta.origen;
            document.querySelector('#formEditarRuta input[name="destino"]').value = ruta.destino;
            document.querySelector('#formEditarRuta input[name="distancia"]').value = ruta.distancia;
            document.querySelector('#formEditarRuta input[name="tiempo_estimado"]').value = ruta.tiempo_estimado;
            document.querySelector('#formEditarRuta textarea[name="observaciones"]').value = ruta.observaciones;
            
            document.querySelector('#formEditarRuta').dataset.rutaId = id;
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Editar ruta
document.addEventListener('DOMContentLoaded', function() {
    const formEditar = document.getElementById('formEditarRuta');
    if (formEditar) {
        formEditar.addEventListener('submit', async function(e) {
            e.preventDefault();

            const id = this.dataset.rutaId;
            if (!id) {
                alert('Primero busca una ruta');
                return;
            }

            const data = {};
            if (this.origen.value) data.origen = this.origen.value;
            if (this.destino.value) data.destino = this.destino.value;
            if (this.distancia.value) data.distancia = parseFloat(this.distancia.value);
            if (this.tiempo_estimado.value) data.tiempo_estimado = this.tiempo_estimado.value;
            if (this.observaciones.value) data.observaciones = this.observaciones.value;

            try {
                const response = await RutasAPI.update(id, data);
                const msgDiv = document.getElementById('mensajeEditarRuta');
                msgDiv.textContent = '✓ Ruta actualizada exitosamente';
                msgDiv.classList.add('success');
                msgDiv.classList.remove('error');
            } catch (error) {
                const msgDiv = document.getElementById('mensajeEditarRuta');
                msgDiv.textContent = '✗ ' + error.message;
                msgDiv.classList.add('error');
                msgDiv.classList.remove('success');
            }
        });
    }
});

// Consultar rutas
async function consultarRutas() {
    try {
        const filters = {
            ciudad: document.getElementById('searchCiudad').value
        };

        const response = await RutasAPI.getAll(filters);
        const rutas = response.data || [];

        const listado = document.getElementById('listadoRutas');
        listado.innerHTML = '';

        if (rutas.length === 0) {
            listado.innerHTML = '<p style="color: #CCC; padding: 20px;">No hay rutas registradas</p>';
            return;
        }

        rutas.forEach(ruta => {
            const item = document.createElement('div');
            item.className = 'elem-consulta';
            item.innerHTML = `
                <div class="elem-consulta-info">
                    <div class="elem-consulta-title">${ruta.origen} → ${ruta.destino}</div>
                    <div class="elem-consulta-details">
                        <div>Distancia: ${ruta.distancia} km</div>
                        <div>Tiempo estimado: ${ruta.tiempo_estimado}</div>
                        <div>Observaciones: ${ruta.observaciones || 'N/A'}</div>
                    </div>
                </div>
            `;
            listado.appendChild(item);
        });
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================================
// CARGAR OPCIONES EN SELECTORES
// ============================================================

async function cargarConductores(select) {
    if (select.options.length > 1) return; // Ya cargado

    try {
        const response = await ConductoresAPI.getActivos();
        const conductores = response.data || [];

        conductores.forEach(conductor => {
            const option = document.createElement('option');
            option.value = conductor.id;
            option.textContent = conductor.nombre + ' ' + (conductor.apellidos || '');
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando conductores:', error);
    }
}

async function cargarVehiculos(select) {
    if (select.options.length > 1) return; // Ya cargado

    try {
        const response = await VehiculosAPI.getAll({ estado: 'disponible' });
        const vehiculos = response.data || [];

        vehiculos.forEach(vehiculo => {
            const option = document.createElement('option');
            option.value = vehiculo.id;
            option.textContent = vehiculo.placa + ' - ' + vehiculo.marca + ' ' + vehiculo.modelo;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando vehículos:', error);
    }
}

async function cargarRutas(select) {
    if (select.options.length > 1) return; // Ya cargado

    try {
        const response = await RutasAPI.getAll();
        const rutas = response.data || [];

        rutas.forEach(ruta => {
            const option = document.createElement('option');
            option.value = ruta.id;
            option.textContent = ruta.origen + ' → ' + ruta.destino;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando rutas:', error);
    }
}

async function cargarConductoresSearch(select) {
    if (select.options.length > 1) return;

    try {
        const response = await ConductoresAPI.getAll();
        const conductores = response.data || [];

        const option1 = document.createElement('option');
        option1.value = '';
        option1.textContent = 'Todos';
        select.appendChild(option1);

        conductores.forEach(conductor => {
            const option = document.createElement('option');
            option.value = conductor.id;
            option.textContent = conductor.nombre + ' ' + (conductor.apellidos || '');
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando conductores:', error);
    }
}

async function cargarVehiculosSearch(select) {
    if (select.options.length > 1) return;

    try {
        const response = await VehiculosAPI.getAll();
        const vehiculos = response.data || [];

        const option1 = document.createElement('option');
        option1.value = '';
        option1.textContent = 'Todos';
        select.appendChild(option1);

        vehiculos.forEach(vehiculo => {
            const option = document.createElement('option');
            option.value = vehiculo.id;
            option.textContent = vehiculo.placa + ' - ' + vehiculo.marca;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando vehículos:', error);
    }
}

// ============================================================
// VIAJES
// ============================================================

// Programar viaje
document.addEventListener('DOMContentLoaded', function() {
    const formProgramar = document.getElementById('formProgramarViaje');
    if (formProgramar) {
        formProgramar.addEventListener('submit', async function(e) {
            e.preventDefault();

            const data = {
                conductor_id: parseInt(this.conductor_id.value),
                vehiculo_id: parseInt(this.vehiculo_id.value),
                ruta_id: parseInt(this.ruta_id.value),
                fecha_salida: this.fecha_salida.value,
                hora_salida: this.hora_salida.value,
                fecha_estimada_llegada: this.fecha_estimada_llegada.value,
                observaciones: this.observaciones.value
            };

            try {
                const response = await RutasAPI.programarViaje(data);
                const msgDiv = document.getElementById('mensajeViaje');
                msgDiv.textContent = '✓ Viaje programado exitosamente';
                msgDiv.classList.add('success');
                msgDiv.classList.remove('error');
                this.reset();
            } catch (error) {
                const msgDiv = document.getElementById('mensajeViaje');
                msgDiv.textContent = '✗ ' + error.message;
                msgDiv.classList.add('error');
                msgDiv.classList.remove('success');
            }
        });
    }
});

// Buscar viaje para editar
async function buscarViajeEdit() {
    const id = document.getElementById('searchViajeId').value;
    if (!id) {
        alert('Ingresa el ID del viaje');
        return;
    }

    try {
        const response = await RutasAPI.getViajeById(id);
        if (response.success) {
            const viaje = response.data;
            document.querySelector('#formEditarViaje select[name="conductor_id"]').value = viaje.conductor_id;
            document.querySelector('#formEditarViaje select[name="vehiculo_id"]').value = viaje.vehiculo_id;
            document.querySelector('#formEditarViaje input[name="fecha_salida"]').value = viaje.fecha_salida;
            document.querySelector('#formEditarViaje input[name="fecha_estimada_llegada"]').value = viaje.fecha_estimada_llegada;
            document.querySelector('#formEditarViaje textarea[name="observaciones"]').value = viaje.observaciones;
            
            document.querySelector('#formEditarViaje').dataset.viajeId = id;
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Editar viaje
document.addEventListener('DOMContentLoaded', function() {
    const formEditar = document.getElementById('formEditarViaje');
    if (formEditar) {
        formEditar.addEventListener('submit', async function(e) {
            e.preventDefault();

            const id = this.dataset.viajeId;
            if (!id) {
                alert('Primero busca un viaje');
                return;
            }

            const data = {};
            if (this.conductor_id.value) data.conductor_id = parseInt(this.conductor_id.value);
            if (this.vehiculo_id.value) data.vehiculo_id = parseInt(this.vehiculo_id.value);
            if (this.fecha_salida.value) data.fecha_salida = this.fecha_salida.value;
            if (this.fecha_estimada_llegada.value) data.fecha_estimada_llegada = this.fecha_estimada_llegada.value;
            if (this.observaciones.value) data.observaciones = this.observaciones.value;

            try {
                const response = await RutasAPI.updateViaje(id, data);
                const msgDiv = document.getElementById('mensajeEditarViaje');
                msgDiv.textContent = '✓ Viaje modificado exitosamente';
                msgDiv.classList.add('success');
                msgDiv.classList.remove('error');
            } catch (error) {
                const msgDiv = document.getElementById('mensajeEditarViaje');
                msgDiv.textContent = '✗ ' + error.message;
                msgDiv.classList.add('error');
                msgDiv.classList.remove('success');
            }
        });
    }
});

// Consultar viajes
async function consultarViajes() {
    try {
        const filters = {
            estado: document.getElementById('searchEstadoViaje').value,
            conductor: document.getElementById('searchConductorViaje').value,
            vehiculo: document.getElementById('searchVehiculoViaje').value,
            fecha: document.getElementById('searchFechaSalida').value
        };

        const response = await RutasAPI.getViajes(filters);
        const viajes = response.data || [];

        const listado = document.getElementById('listadoViajes');
        listado.innerHTML = '';

        if (viajes.length === 0) {
            listado.innerHTML = '<p style="color: #CCC; padding: 20px;">No hay viajes registrados</p>';
            return;
        }

        viajes.forEach(viaje => {
            const item = document.createElement('div');
            item.className = 'elem-consulta';
            item.innerHTML = `
                <div class="elem-consulta-info">
                    <div class="elem-consulta-title">Viaje #${viaje.id}</div>
                    <div class="elem-consulta-details">
                        <div>Conductor: ${viaje.conductor_nombre || 'N/A'}</div>
                        <div>Vehículo: ${viaje.vehiculo_placa || 'N/A'}</div>
                        <div>Salida: ${viaje.fecha_salida} ${viaje.hora_salida || ''}</div>
                        <div>Llegada estimada: ${viaje.fecha_estimada_llegada}</div>
                    </div>
                </div>
                <div class="elem-consulta-status status-${viaje.estado}">${viaje.estado}</div>
            `;
            listado.appendChild(item);
        });
    } catch (error) {
        alert('Error: ' + error.message);
    }
}