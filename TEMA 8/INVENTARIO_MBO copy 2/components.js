/**
 * Funciones para interactuar con el DOM.
 */
export const UI = {
    renderTabla(productos, onEdit, onDelete) {
        const tbody = document.getElementById('tabla');
        let fTalla = document.getElementById('filtroTalla');
        if (!productos || productos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999">No hay productos registrados</td></tr>';
            return;
        }

        if (fTalla != 'Talla') {
            productos = productos.filter(productos.talla = fTalla);
        }

        tbody.innerHTML = '';
        productos.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.id}</td>
                <td><code>${p.codigo}</code></td>
                <td>${p.nombre}</td>
                <td>${p.talla}</td>
                <td><b>${parseFloat(p.precio).toFixed(2)} €</b></td>
                <td>${p.email_creador}</td>
                <td>
                    <button class="btn-edit" data-id="${p.id}">Seleccionar</button>
                    <button class="btn-delete" data-id="${p.id}" data-nombre="${p.nombre}" style="background:#dc3545">Eliminar</button>
                </td>
            `;

            tr.querySelector('.btn-edit').onclick = () => onEdit(p.id);
            tr.querySelector('.btn-delete').onclick = () => onDelete(p.id, p.nombre);

            tbody.appendChild(tr);
        });
    },

    cleanScreen() {
        const tbody = document.getElementById('tabla');
        tbody.innerHTML = '';
    },

    setLoading(isLoading) {
        const btn = document.querySelector('#formCrear button[type="submit"]');
        if (btn) {
            btn.disabled = isLoading;
            btn.textContent = isLoading ? 'Procesando...' : 'Crear Producto';
        }
    },

    mostrarFormEditar() {
        document.getElementById('formEditar').style.display = 'flex';
    },

    ocultarFormEditar() {
        document.getElementById('formEditar').style.display = 'none';
        document.getElementById('formEditar').reset();
    },

    mostrarFormCrear() {
        document.getElementById('formCrear').style.display = 'flex';
    },

    ocultarFormCrear() {
        document.getElementById('formCrear').style.display = 'none';
        document.getElementById('formCrear').reset();
    }
};
