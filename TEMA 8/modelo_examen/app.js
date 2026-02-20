import { API } from './lib/api.js';
import { UI } from './lib/ui.js';

let productosRaw = [];

async function cargarDatos() {
    try {
        productosRaw = await API.getProductos();
        actualizarVista(productosRaw);
    } catch (error) {
        alert('Error al cargar datos: ' + error.message);
    }
}

function actualizarVista(productos) {
    UI.renderTabla(productos, abrirEditar, eliminar);
    UI.renderStats(productos);
}

function validarProducto(data) {
    if (data.codigo.length !== 9) return 'El código debe tener 9 caracteres';
    if (!data.nombre.trim()) return 'Nombre obligatorio';
    if (!data.talla) return 'Selecciona talla';
    if (isNaN(data.precio) || data.precio <= 0) return 'Precio inválido';
    if (!data.email_creador.includes('@')) return 'Email inválido';
    return null;
}

document.getElementById('formCrear').onsubmit = async (e) => {
    e.preventDefault();
    document.getElementById('err-form').textContent = '';

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

async function abrirEditar(id) {
    try {
        const p = await API.getProducto(id);
        document.getElementById('editId').value = p.id;
        document.getElementById('editCodigo').value = p.codigo;
        document.getElementById('editNombre').value = p.nombre;
        document.getElementById('editTalla').value = p.talla;
        document.getElementById('editPrecio').value = p.precio;
        document.getElementById('editEmail').value = p.email_creador;
        UI.abrirModal();
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
        UI.cerrarModal();
        cargarDatos();
        alert('Producto actualizado');
    } catch (err) {
        alert('Error: ' + err.message);
    }
};

async function eliminar(id, nombre) {
    if (confirm('¿Seguro que quieres borrar ' + nombre + '?')) {
        try {
            await API.eliminar(id);
            cargarDatos();
        } catch (err) {
            alert('Error al borrar: ' + err.message);
        }
    }
}

document.getElementById('buscar').oninput = (e) => {
    const q = e.target.value.toLowerCase();
    actualizarVista(productosRaw.filter(p =>
        p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)
    ));
};

window.cerrarModal = UI.cerrarModal;
cargarDatos();
