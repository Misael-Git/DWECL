# Proyecto: Modelo de Examen DWEC

Aplicación para la gestión de productos, utilizando JavaScript Vanilla en el Frontend y PHP en el Backend.

**Para ejecutar la aplicación, lanza el servidor PHP integrado en la misma carpeta del proyecto:**
```bash
php -S localhost:8000
```
Luego visita `http://localhost:8000/index.html` en tu navegador.

---

## 🛠️ Requisitos de Examen Implementados

Este proyecto incluye explícitamente los siguientes requisitos para el examen:

1.  **CRUD Básico (Create, Read, Update, Delete):** Todo el ciclo de vida de los productos está implementado.
    *   *Frontend:* Archivos `app.js` y `lib/api.js`.
    *   *Backend:* `api.php` procesando los verbos HTTP (`POST`, `GET`, `PUT`, `DELETE`).
2.  **Asincronía (`async/await` / Promesas):** Obligatorio para las peticiones a la API.
    *   *Frontend:* Todo el archivo `app.js` maneja la respuesta del usuario combinándola con llamadas de red asíncronas hacia `lib/api.js`.
3.  **Expresiones Regulares (Regex):** Validaciones estrictas en el formulario de creación/edición.
    *   *Frontend:* Ver función `validarProducto` en `app.js`. Asegura el formato de código y del correo electrónico.
4.  **Carga y Descarga de JSON:** Permite hacer backups de la colección o cargar nuevos productos masivamente mediante ficheros `.json`.
    *   *Frontend:* Ver la lógica de `#btnDescargarJSON` y `#fileJSON` al final de `app.js`. Utiliza `Blob` y `FileReader`.

---

## 🔁 Flujo de Trabajo e Interconexión de Archivos

El sistema está dividido en dos partes principales: Cliente (Frontend JS) y Servidor (Backend PHP).

### 1. El Frontend (Navegador)

El punto de entrada cuando abres el navegador es **`index.html`**. Este archivo carga la estructura visual y, al final, carga el script principal: `<script type="module" src="app.js"></script>`.

*   **`app.js`** (El Controlador): Es el "cerebro" del frontal.
    *   Importa funciones de `api.js` y `ui.js`.
    *   Maneja todos los Eventos (cuando el usuario hace click en "Añadir", "Editar", o busca).
    *   **Valida los datos (Ej. Regex)** antes de enviarlos.
    *   Llama a la API asincrónicamente para obtener o enviar los datos al servidor.
    *   Gestiona la Carga/Descarga de JSON interactuando con la interfaz de usuario y sus archivos locales.
*   **`lib/api.js`** (La Capa de Red):
    *   Centraliza todas las peticiones (usando la función `fetch` que es asíncrona).
    *   Ofrece métodos limpios (`API.getProductos()`, `API.crear()`, etc.) para que `app.js` no tenga que ensuciarse con detalles de cómo se hace la petición HTTP.
    *   Maneja el parseo de la respuesta a JSON y la detección de errores del servidor.
*   **`lib/ui.js`** (La Capa de Vista):
    *   Solo se encarga de modificar el DOM.
    *   Pinta la tabla con productos (`renderTabla`), actualiza las estadísticas (`renderStats`) y muestra/oculta la ventana flotante de edición (`abrirModal`, `cerrarModal`).

### 2. El Backend (Servidor PHP)

Las peticiones HTTP hechas por `lib/api.js` (como `fetch('api.php')`) llegan directamente a **`api.php`**.

*   **`api.php`** (El Enrutador y Controlador del Servidor):
    *   Recibe la petición HTTP, verifica el Verbo (GET, POST, PUT, DELETE) y si hay un ID.
    *   Se conecta a la base de datos MySQL (por medio de `config.php`).
    *   Ejecuta las consultas (`SELECT`, `INSERT`, `UPDATE`, `DELETE`), realiza la validación también en el backend, y retorna siempre una respuesta en texto `JSON`.

---

## 🔤 Expresiones Regulares (Regex) en profundidad

Una expresión regular (Regex) es una secuencia de caracteres que conforma un patrón de búsqueda, usado para validación de texto. En JavaScript van encerradas entre barras invertidas `/patrón/`.

En este proyecto (ver **`app.js`**) usamos:

### 1. Regex de Código de Producto (`/^[a-zA-Z0-9]{9}$/`)
Sirve para verificar que un código es exactamente de 9 caracteres alfanuméricos.
*   `^` : Indica el **Inicio** de la cadena.
*   `[a-zA-Z0-9]` : Es un grupo de caracteres. Significa "cualquier letra (minúscula o mayúscula) o cualquier número (0 al 9)".
*   `{9}` : Es un cuantificador. Indica que el grupo anterior debe repetirse **exactamente 9 veces**.
*   `$` : Indica el **Fin** de la cadena. (Usando `^` y `$` juntos aseguramos que toda la palabra sea validada y no solo un trozo de ella).

### 2. Regex de Email (`/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/`)
Es un patrón estándar y robusto para validar direcciones de correo electrónico.
*   `^` : **Inicio**.
*   `[\w\.-]+` : Cualquier palabra `\w` (letras, números o guion bajo), puntos `\.` o guiones `-`. El `+` significa "una o más veces". Esta es la parte antes de la @.
*   `@` : Símbolo literal de la arroba.
*   `[a-zA-Z\d\.-]+` : El dominio (ej. "gmail", "outlook-empresa"). Permite letras, números `\d`, puntos o guiones, "una o más veces" `+`.
*   `\.` : El punto literal (que separa el dominio de la extensión, ej. en ".com"). La barra `\` escapa la función normal del punto en regex (que significa "cualquier carácter").
*   `[a-zA-Z]{2,6}` : La extensión (ej. "com", "es", "online"). Solo acepta letras y exige un rango de entre **2 a 6** letras `{2,6}`.
*   `$` : **Fin**.