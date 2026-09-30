// Punto 4 del PDF: JavaScript del navegador
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-solicitud');
    const mensajeSolicitud = document.getElementById('mensaje-solicitud');

    // Desactivar validación nativa del navegador para gestionar los mensajes en la página
    if (formulario) {
        formulario.setAttribute('novalidate', '');
    }

    // Función auxiliar para mostrar mensajes de éxito o error en la página
    function mostrarMensaje(texto, tipo) {
        if (!mensajeSolicitud) return;

        mensajeSolicitud.textContent = texto;
        mensajeSolicitud.className = tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error';
    }

    // 1. Cargar servicios desde GET /api/servicios y llenar el select y contenedor
    async function cargarServicios() {
        const contenedorLista = document.getElementById('lista-servicios');
        const selectServicio = document.getElementById('servicio');

        try {
            const respuesta = await fetch('/api/servicios');
            if (!respuesta.ok) {
                throw new Error('Error al obtener los servicios');
            }
            const servicios = await respuesta.json();

            // Renderizar servicios en el contenedor HTML
            if (contenedorLista) {
                contenedorLista.innerHTML = '';
                servicios.forEach(servicio => {
                    const tarjeta = document.createElement('article');
                    tarjeta.className = 'tarjeta-servicio';
                    tarjeta.innerHTML = `
                        <h3>${servicio.nombre}</h3>
                        <p>${servicio.descripcion}</p>
                    `;
                    contenedorLista.appendChild(tarjeta);
                });
            }

            // Llenar las opciones del selector de servicios en el formulario
            if (selectServicio) {
                servicios.forEach(servicio => {
                    const opcion = document.createElement('option');
                    opcion.value = servicio.nombre;
                    opcion.textContent = servicio.nombre;
                    selectServicio.appendChild(opcion);
                });
            }
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            if (contenedorLista) {
                contenedorLista.innerHTML = '<p>No se pudieron cargar los servicios en este momento.</p>';
            }
        }
    }

    // Ejecutar carga inicial de servicios
    cargarServicios();

    // 2. Manejo del envío del formulario
    if (formulario) {
        formulario.addEventListener('submit', async (evento) => {
            // Requisito: Evitar que el formulario recargue la página al enviarse
            evento.preventDefault();

            // Obtener los valores de los campos
            const nombreInput = document.getElementById('nombre');
            const correoInput = document.getElementById('correo');
            const servicioSelect = document.getElementById('servicio');
            const comentarioTextarea = document.getElementById('comentario');

            const nombre = nombreInput ? nombreInput.value.trim() : '';
            const correo = correoInput ? correoInput.value.trim() : '';
            const servicio = servicioSelect ? servicioSelect.value.trim() : '';
            const comentario = comentarioTextarea ? comentarioTextarea.value.trim() : '';

            // Requisito: Validar que el nombre y el servicio no estén vacíos
            if (!nombre || !servicio) {
                // Requisito: Mostrar en la página un mensaje de error cuando falte un dato obligatorio
                mostrarMensaje('Error: El nombre y el servicio son campos obligatorios.', 'error');
                return;
            }

            try {
                // Enviar datos al backend mediante fetch POST /api/solicitudes
                const respuesta = await fetch('/api/solicitudes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre,
                        correo,
                        servicio,
                        comentario
                    })
                });

                const resultado = await respuesta.json();

                // Requisito: Mostrar mensaje de éxito cuando el servidor acepte la solicitud (201)
                if (respuesta.status === 201) {
                    mostrarMensaje(resultado.mensaje || '¡Solicitud enviada con éxito!', 'exito');
                    formulario.reset();
                } else {
                    // Si el servidor responde con 400 u otro error
                    mostrarMensaje(resultado.error || 'Hubo un error al procesar tu solicitud.', 'error');
                }
            } catch (error) {
                console.error('Error en el envío:', error);
                mostrarMensaje('No se pudo conectar con el servidor. Revisa tu conexión.', 'error');
            }
        });
    }
});
