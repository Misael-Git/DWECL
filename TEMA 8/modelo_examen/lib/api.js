const BASE_URL = 'api.php';

/**
 * Petición genérica al API con manejo de errores centralizado.
 */
export async function peticion(url, opciones = {}) {
    try {
        const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
        const res = await fetch(fullUrl, {
            headers: { 'Content-Type': 'application/json' },
            ...opciones
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Error en el servidor');
        }
        return data;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

export const API = {
    getProductos: () => peticion(''),
    getProducto: (id) => peticion(`?id=${id}`),
    crear: (data) => peticion('', { method: 'POST', body: JSON.stringify(data) }),
    actualizar: (id, data) => peticion(`?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    eliminar: (id) => peticion(`?id=${id}`, { method: 'DELETE' })
};
