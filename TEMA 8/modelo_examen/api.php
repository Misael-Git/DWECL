<?php
// ============================================================
// TEMA 8 - MODELO EXAMEN (API CRUD de productos)
// Endpoints:
//   GET    api.php        → listar todos
//   GET    api.php?id=X  → obtener uno
//   POST   api.php        → crear
//   PUT    api.php?id=X  → actualizar
//   DELETE api.php?id=X  → eliminar
// ============================================================

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

// --- GET ---
if ($method === 'GET') {
    if ($id) {
        $s = $pdo->prepare('SELECT * FROM productos WHERE id = ?');
        $s->execute([$id]);
        $r = $s->fetch();
        ok($r ? 200 : 404, $r ?: ['error' => 'No encontrado']);
    }
    ok(200, $pdo->query('SELECT * FROM productos ORDER BY id')->fetchAll());
}

// --- POST ---
if ($method === 'POST') {
    $d = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    
    // Validación básica server-side
    if (strlen($d['codigo'] ?? '') !== 9) ok(422, ['error' => 'El código debe tener exactamente 9 caracteres.']);
    if (!filter_var($d['email_creador'] ?? '', FILTER_VALIDATE_EMAIL)) ok(422, ['error' => 'Email no válido.']);
    
    try {
        $s = $pdo->prepare('INSERT INTO productos (codigo,nombre,talla,precio,email_creador) VALUES (?,?,?,?,?)');
        $s->execute([trim($d['codigo']), trim($d['nombre']), trim($d['talla']), (float)$d['precio'], trim($d['email_creador'])]);
        
        $s2 = $pdo->prepare('SELECT * FROM productos WHERE id = ?');
        $s2->execute([$pdo->lastInsertId()]);
        ok(201, $s2->fetch());
    } catch (PDOException $e) {
        ok($e->getCode() === '23000' ? 409 : 500, ['error' => $e->getCode() === '23000' ? 'Código duplicado.' : $e->getMessage()]);
    }
}

// --- PUT ---
if ($method === 'PUT') {
    if (!$id) ok(400, ['error' => 'Se requiere id.']);
    $d = json_decode(file_get_contents('php://input'), true) ?? [];
    
    if (isset($d['codigo']) && strlen($d['codigo']) !== 9) ok(422, ['error' => 'El código debe tener exactamente 9 caracteres.']);
    if (isset($d['email_creador']) && !filter_var($d['email_creador'], FILTER_VALIDATE_EMAIL)) ok(422, ['error' => 'Email no válido.']);

    $allowed = ['codigo','nombre','talla','precio','email_creador'];
    $set = []; $vals = [];
    foreach ($allowed as $f) {
        if (isset($d[$f])) { 
            $set[] = "$f = ?"; 
            $vals[] = $f === 'precio' ? (float)$d[$f] : trim($d[$f]); 
        }
    }
    
    if (empty($set)) ok(400, ['error' => 'No hay campos para actualizar.']);
    
    $vals[] = $id;
    try {
        $pdo->prepare('UPDATE productos SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($vals);
        $s = $pdo->prepare('SELECT * FROM productos WHERE id = ?'); 
        $s->execute([$id]);
        ok(200, $s->fetch());
    } catch (PDOException $e) {
        ok($e->getCode() === '23000' ? 409 : 500, ['error' => $e->getCode() === '23000' ? 'Código duplicado.' : $e->getMessage()]);
    }
}

// --- DELETE ---
if ($method === 'DELETE') {
    if (!$id) ok(400, ['error' => 'Se requiere id.']);
    $pdo->prepare('DELETE FROM productos WHERE id = ?')->execute([$id]);
    ok(200, ['mensaje' => "Producto $id eliminado."]);
}

ok(405, ['error' => 'Método no permitido.']);
