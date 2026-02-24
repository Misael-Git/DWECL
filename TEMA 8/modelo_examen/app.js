import { API } from './lib/api.js';
import { UI } from './lib/ui.js';

/* ==========================================================
 * EXAMEN - VARIABLES Y ESTADO BASE
 * ========================================================== */
let productosRaw = [];

/* ==========================================================
 * REQUISITO EXAMEN: ASINCRONÍA (async / await)
 * - Usamos async en funciones que deben esperar operaciones de red.
 * - Usamos await en llamadas a la API (fetch) que devuelven Promesas.
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
    UI.renderTabla(productos, abrirEditar, eliminar);
    UI.renderStats(productos);
}

/* ==========================================================
 * REQUISITO EXAMEN: EXPRESIONES REGULARES (REGEX)
 * - Validamos formato y contenido correcto de los campos.
 * ========================================================== */
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
 * REQUISITO EXAMEN: CRUD (Create, Read, Update, Delete)
 * EVENTO DEL FORMULARIO POST - CREATE
 * ========================================================== */

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

/* ==========================================================
 * CRUD: READ específico para edición y UPDATE posterior
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

/* ==========================================================
 * CRUD: DELETE - Borrado de recurso
 * ========================================================== */
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

/* ==========================================================
 * CARGA Y DESCARGA DE JSON
 * - Descarga: Array -> String -> Blob -> ObjectURL -> A tag
 * - Carga: InputFile -> FileReader -> content -> JSON.parse -> API.crear()
 * ========================================================== */

// --- DESCARGAR JSON ---
document.getElementById('btnDescargarJSON').addEventListener('click', () => {
    if (productosRaw.length === 0) {
        return alert('No hay productos para descargar.');
    }

    // 1. Convertir el array de productos a texto JSON
    const dataStr = JSON.stringify(productosRaw, null, 2);
    // 2. Crear un objeto Blob que representa los datos JSON a nivel de bits
    const blob = new Blob([dataStr], { type: 'application/json' });
    // 3. Crear una URL temporal apuntando a ese Blob
    const url = URL.createObjectURL(blob);

    // 4. Crear un enlace (a) invisible para disparar la descarga en el navegador
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos_exportados.json'; // Nombre del archivo que se guardará
    a.click(); // Forzamos el click

    // 5. Limpiamos la memoria
    URL.revokeObjectURL(url);
});

// --- CARGAR JSON ---
const btnCargar = document.getElementById('btnCargarJSON');
const inputFile = document.getElementById('fileJSON');

// Hacer que el botón bonito abra el input de archivos real oculto
btnCargar.addEventListener('click', () => inputFile.click());

// Cuando el usuario ha seleccionado un fichero, lo procesamos
inputFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
        return alert('Por favor, selecciona un fichero de tipo JSON válido.');
    }

    const reader = new FileReader();

    // Evento que se ejecuta al terminar de leer el fichero asíncronamente
    reader.onload = async (evento) => {
        try {
            // Pasamos de texto a Objeto JS validando que sea buen JSON
            const dataJSON = JSON.parse(evento.target.result);

            if (!Array.isArray(dataJSON)) {
                throw new Error("El JSON no tiene un formato válido (se esperaba un array de objetos).");
            }

            let importados = 0;
            // Enviamos cada producto a la API asincrónicamente
            for (const prod of dataJSON) {
                // Limpiamos la data por si trajimos campos que la DB no acepta directamente (ej. id)
                const { codigo, nombre, talla, precio, email_creador } = prod;
                // Podríamos usar await para esperar que pase, aunque ralentiza cargarlo uno tras otro
                // pero evita sobrecargar el servidor con cientos de peticiones a la vez (bombardeo POST)
                await API.crear({ codigo, nombre, talla, precio, email_creador });
                importados++;
            }

            alert(`Proceso de importación completado. Se insertaron ${importados} productos.`);
            // Refrescar para ver los nuevos
            cargarDatos();
        } catch (error) {
            console.error(error);
            alert("Error al leer/procesar el JSON: " + error.message);
        } finally {
            // Reseteamos el input file por si quieren volver a cargar el mismo fichero
            inputFile.value = '';
        }
    };

    // Instrucción para comenzar la lectura del archivo como texto plano
    reader.readAsText(file);
});

window.cerrarModal = UI.cerrarModal;
cargarDatos();
