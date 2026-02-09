<?php
// --- MODO DEBUG: ACTIVAR PARA VER ERRORES ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS y JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Si es una petición OPTIONS (pre-flight del navegador), terminamos aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// --- CONEXIÓN BDD ---
$host = 'localhost';
$db = 'curso_ajax';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "error" => "Error BDD: " . $e->getMessage()]);
    exit;
}

// --- LÓGICA CRUD ---
$method = $_SERVER['REQUEST_METHOD'];

// Para recibir datos JSON (Fetch envia JSON a menudo) o Form-Data
// PHP nativo llena $_POST solo si es form-data. Si es JSON (raw), hay uqe leer php://input
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        // LISTAR USUARIOS
        try {
            $stmt = $pdo->query("SELECT * FROM usuarios ORDER BY id DESC");
            $usuarios = $stmt->fetchAll();
            echo json_encode(["status" => "ok", "datos" => $usuarios]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "error" => $e->getMessage()]);
        }
        break;

    case 'POST':
        // CREAR USUARIO
        // Si viene por $_POST (FormData) o por $input (JSON)
        $nombre = $_POST['nombre'] ?? $input['nombre'] ?? '';
        $correo = $_POST['correo'] ?? $input['correo'] ?? '';
        $telefono = $_POST['telefono'] ?? $input['telefono'] ?? '';
        $edad = $_POST['edad'] ?? $input['edad'] ?? '';
        $idioma = $_POST['idioma'] ?? $input['idioma'] ?? '';

        // Validaciones
        if (empty($nombre) || empty($correo)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "error" => "Nombre y Correo obligatorios"]);
            exit;
        }
        if ((int) $edad < 18) {
            http_response_code(400);
            echo json_encode(["status" => "error", "error" => "Debes ser mayor de 18 años"]);
            exit;
        }

        try {
            $sql = "INSERT INTO usuarios (nombre, correo, telefono, edad, idioma) VALUES (:nombre, :correo, :telefono, :edad, :idioma)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'nombre' => $nombre,
                'correo' => $correo,
                'telefono' => $telefono,
                'edad' => $edad,
                'idioma' => $idioma
            ]);
            echo json_encode(["status" => "ok", "mensaje" => "Usuario registrado", "id" => $pdo->lastInsertId()]);
        } catch (\PDOException $e) {
            if ($e->getCode() == 23000) {
                http_response_code(409);
                echo json_encode(["status" => "error", "error" => "El correo ya existe"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "error" => $e->getMessage()]);
            }
        }
        break;

    case 'PUT':
        // ACTUALIZAR USUARIO
        // PUT siempre viene por php://input normalmente
        $id = $input['id'] ?? null;
        $nombre = $input['nombre'] ?? '';
        $correo = $input['correo'] ?? '';
        $telefono = $input['telefono'] ?? '';
        $edad = $input['edad'] ?? '';
        $idioma = $input['idioma'] ?? '';

        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "error" => "Falta ID para actualizar"]);
            exit;
        }

        try {
            $sql = "UPDATE usuarios SET nombre=:nombre, correo=:correo, telefono=:telefono, edad=:edad, idioma=:idioma WHERE id=:id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $id,
                'nombre' => $nombre,
                'correo' => $correo,
                'telefono' => $telefono,
                'edad' => $edad,
                'idioma' => $idioma
            ]);
            echo json_encode(["status" => "ok", "mensaje" => "Usuario actualizado"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "error" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // BORRAR USUARIO
        // Podemos recibir el ID en el cuerpo JSON
        $id = $input['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "error" => "Falta ID para borrar"]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(["status" => "ok", "mensaje" => "Usuario eliminado"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "error" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "error" => "Método no permitido"]);
        break;
}
?>