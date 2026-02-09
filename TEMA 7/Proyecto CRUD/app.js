const formulario = document.getElementById('miFormulario');
const mensajeDiv = document.getElementById('mensajeRespuesta');
const btnEnviar = document.getElementById('btnEnviar');
const btnCancelar = document.getElementById('btnCancelar');
const tablaUsuarios = document.getElementById('tablaUsuarios');
const inputId = document.getElementById('userId');

// Cargar usuarios al iniciar
document.addEventListener('DOMContentLoaded', cargarUsuarios);

// Manejar envío (Crear o Editar)
formulario.addEventListener('submit', async function (e) {
    e.preventDefault();

    // 1. Validaciones extra
    const edad = parseInt(document.getElementById('edad').value);
    if (edad < 18) {
        mostrarMensaje("error", "Debes ser mayor de 18 años.");
        return;
    }

    // 2. Preparar datos
    const datos = new FormData(formulario);
    const datosObj = Object.fromEntries(datos.entries()); // Convertir a Objeto JSON

    const id = inputId.value; // ¿Estamos editando?
    const metodo = id ? 'PUT' : 'POST'; // Si hay ID es PUT, si no POST

    // UX
    btnEnviar.disabled = true;
    btnEnviar.innerText = "Procesando...";

    try {
        const respuesta = await fetch('servidor.php', {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosObj)
        });

        const data = await respuesta.json();

        if (data.status === "ok") {
            mostrarMensaje("exito", data.mensaje);
            limpiarFormulario();
            cargarUsuarios(); // Recargar la tabla
        } else {
            throw new Error(data.error || "Error desconocido");
        }

    } catch (error) {
        mostrarMensaje("error", error.message);
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.innerText = id ? "Actualizar" : "Registrar";
    }
});

// Función para cargar tabla
async function cargarUsuarios() {
    try {
        const respuesta = await fetch('servidor.php'); // GET por defecto
        const data = await respuesta.json();

        tablaUsuarios.innerHTML = ""; // Limpiar tabla

        if (data.status === "ok") {
            data.datos.forEach(usuario => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.telefono || '-'}</td>
                    <td>${usuario.edad || '-'}</td>
                    <td>${usuario.idioma || '-'}</td>
                    <td>
                        <button class="btn-editar" data-user='${JSON.stringify(usuario)}'>Editar</button>
                        <button class="btn-borrar" data-id="${usuario.id}">Borrar</button>
                    </td>
                `;
                tablaUsuarios.appendChild(fila);
            });
        }
    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
}

// Delegación de eventos para botones de tabla
tablaUsuarios.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-editar')) {
        const usuario = JSON.parse(e.target.getAttribute('data-user'));
        cargarParaEditar(usuario);
    }
    if (e.target.classList.contains('btn-borrar')) {
        const id = e.target.getAttribute('data-id');
        borrarUsuario(id);
    }
});

function cargarParaEditar(usuario) {
    inputId.value = usuario.id;
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('correo').value = usuario.correo;
    document.getElementById('telefono').value = usuario.telefono;
    document.getElementById('edad').value = usuario.edad;
    document.getElementById('idioma').value = usuario.idioma;

    btnEnviar.innerText = "Actualizar";
    btnCancelar.style.display = "inline-block";
    window.scrollTo(0, 0); // Subir para ver el form
}

async function borrarUsuario(id) {
    if (!confirm("¿Seguro que quieres borrar este usuario?")) return;

    try {
        const respuesta = await fetch('servidor.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });

        const data = await respuesta.json();
        if (data.status === "ok") {
            mostrarMensaje("exito", "Usuario eliminado");
            cargarUsuarios();
        } else {
            mostrarMensaje("error", data.error);
        }
    } catch (error) {
        console.error(error);
        mostrarMensaje("error", "Error al borrar");
    }
}

btnCancelar.addEventListener('click', limpiarFormulario);

function limpiarFormulario() {
    formulario.reset();
    inputId.value = "";
    btnEnviar.innerText = "Registrar";
    btnCancelar.style.display = "none";
}

function mostrarMensaje(tipo, texto) {
    mensajeDiv.innerText = texto;
    mensajeDiv.style.color = tipo === "exito" ? "green" : "red";
    setTimeout(() => mensajeDiv.innerText = "", 3000);
}
