/**
 * Funciones para interactuar con el DOM.
 */
export const UI = {
    renderTabla(productos, onEdit, onDelete) {
        const tbody = document.getElementById('tabla');
        if (!productos || productos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999">No hay productos registrados</td></tr>';
            return;
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
                    <button class="btn-edit" data-id="${p.id}">Editar</button>
                    <button class="btn-delete" data-id="${p.id}" data-nombre="${p.nombre}" style="background:#dc3545">Eliminar</button>
                </td>
            `;

            tr.querySelector('.btn-edit').onclick = () => onEdit(p.id);
            tr.querySelector('.btn-delete').onclick = () => onDelete(p.id, p.nombre);

            tbody.appendChild(tr);
        });
    },

    renderStats(productos) {
        const prices = productos.map(p => parseFloat(p.precio));
        const total = productos.length;
        const avg = total ? prices.reduce((a, b) => a + b, 0) / total : 0;

        document.getElementById('statTotal').textContent = total;
        document.getElementById('statAvg').textContent = avg.toFixed(2) + ' €';
    },

    setLoading(isLoading) {
        const btn = document.querySelector('#formCrear button[type="submit"]');
        if (btn) {
            btn.disabled = isLoading;
            btn.textContent = isLoading ? 'Procesando...' : 'Crear Producto';
        }
    },

    abrirModal() {
        document.getElementById('modal').style.display = 'flex';
    },

    cerrarModal() {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('formEditar').reset();
    }
};
