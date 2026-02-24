import { API } from './api.js';
import { UI as COMPONENTS } from './components.js';

let productosRaw = [];

/* ==========================================================
 * CARGA DE DATOS
 * ========================================================== */
async function cargarDatos() {
    try {
        productosRaw = await API.getProductos();
        actualizarVista(productosRaw);
    } catch (error) {
        alert('Error al cargar datos: ' + error.message);
    }
}

function actualizarVista(productos) {
    COMPONENTS.renderTabla(productos, abrirEditar, eliminar);
}

// Regex para el código
function validarProducto(data) {
    // Regex Código: ^(inicio) [alfa-numéricos] {exactamente 9} $(fin)
    const regexCodigo = /^[a-zA-Z0-9]{9}$/;
    if (!regexCodigo.test(data.codigo)) return 'El código debe tener exactamente 9 caracteres alfanuméricos.';

    // Regex Email: Estructura de correo (nombre@dominio.extensión_de_2_a_6_letras)
    const regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexEmail.test(data.email_creador)) return 'Email introducido no es válido.';

    if (!data.nombre.trim()) return 'Nombre obligatorio';
    if (!data.talla) return 'Selecciona talla';
    if (isNaN(data.precio) || data.precio <= 0) return 'Precio inválido';
    return null;
}

/* ==========================================================
 * CRUD: CREAR
 * ========================================================== */

document.getElementById('formCrear').onsubmit = async (e) => {
    e.preventDefault();
    document.getElementById('err-form').textContent = '';
    COMPONENTS.mostrarFormCrear();

    const data = {
        codigo: document.getElementById('codigo').value,
        nombre: document.getElementById('nombre').value,
        talla: document.getElementById('talla').value,
        precio: parseFloat(document.getElementById('precio').value),
        email_creador: document.getElementById('email_creador').value
    };

    const error = validarProducto(data);
    if (error) {
        document.getElementById('err-form').textContent = error;
        return;
    }

    try {
        await API.crear(data);
        e.target.reset();
        cargarDatos();
        alert('Producto creado');
    } catch (err) {
        alert('Error: ' + err.message);
    }
};

/* ==========================================================
 * CRUD: EDITAR Y UPDATE
 * ========================================================== */
async function abrirEditar(id) {
    try {
        const p = await API.getProducto(id);
        document.getElementById('editId').value = p.id;
        document.getElementById('editCodigo').value = p.codigo;
        document.getElementById('editNombre').value = p.nombre;
        document.getElementById('editTalla').value = p.talla;
        document.getElementById('editPrecio').value = p.precio;
        document.getElementById('editEmail').value = p.email_creador;
        COMPONENTS.mostrarFormEditar();
    } catch (err) {
        alert('Error al obtener producto');
    }
}

document.getElementById('formEditar').onsubmit = async (e) => {
    e.preventDefault();
    document.getElementById('err-edit').textContent = '';

    const id = document.getElementById('editId').value;
    const data = {
        codigo: document.getElementById('editCodigo').value,
        nombre: document.getElementById('editNombre').value,
        talla: document.getElementById('editTalla').value,
        precio: parseFloat(document.getElementById('editPrecio').value),
        email_creador: document.getElementById('editEmail').value
    };

    const error = validarProducto(data);
    if (error) {
        document.getElementById('err-edit').textContent = error;
        return;
    }

    try {
        await API.actualizar(id, data);
        COMPONENTS.ocultarFormEditar();
        cargarDatos();
        alert('Producto actualizado');
    } catch (err) {
        alert('Error: ' + err.message);
    }
};

/* ==========================================================
 * CRUD: DELETE
 * ========================================================== */
async function eliminar(id, nombre) {
    if (confirm('¿Seguro que quieres borrar el producto ' + nombre + '?')) {
        try {
            await API.eliminar(id);
            cargarDatos();
        } catch (err) {
            alert('Error al borrar: ' + err.message);
        }
    }
}

document.getElementById('filtroTalla').oninput = (e) => {
    const talla = e.target.value.toLowerCase();
    actualizarVista(productosRaw.filter(p =>
        p.talla.toLowerCase().includes(talla) || p.codigo.toLowerCase().includes(q)
    ));
};

// Botones del HTML

window.ocultarFormCrear = COMPONENTS.ocultarFormCrear;
window.limpiarPantalla = COMPONENTS.cleanScreen;
window.cargarInventario = cargarDatos;
window.mostrarFormCrear = COMPONENTS.mostrarFormCrear;
window.mostrarFormCrear = COMPONENTS.mostrarFormEditar;
window.ocultarFormEditar = COMPONENTS.ocultarFormCrear;
window.ocultarFormEditar = COMPONENTS.ocultarFormEditar;
window.renderTabla = COMPONENTS.renderTabla;