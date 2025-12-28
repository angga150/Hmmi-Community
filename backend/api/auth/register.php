<?php
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../config/cors.php";

/**
 * Ambil body dari JSON ATAU Form
 */
$raw = file_get_contents("php://input");

$data = [];

if (!empty($raw)) {
    // JSON (React / Postman raw JSON)
    $data = json_decode($raw, true);
}

if (empty($data)) {
    // Form (HTML form / axios form / x-www-form-urlencoded)
    $data = $_POST;
}

if (empty($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Request body kosong"
    ]);
    exit;
}

/**
 * VALIDASI
 */
$required = ['username', 'email', 'password'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(422);
        echo json_encode([
            "success" => false,
            "message" => "Field $field wajib diisi"
        ]);
        exit;
    }
}

// Validasi email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "message" => "Format email tidak valid"
    ]);
    exit;
}

// Cek email sudah terdaftar
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$data['email']]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode([
        "success" => false,
        "message" => "Email sudah terdaftar"
    ]);
    exit;
}

// Cek username sudah digunakan
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
$stmt->execute([$data['username']]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode([
        "success" => false,
        "message" => "Username sudah digunakan"
    ]);
    exit;
}

/**
 * HASH PASSWORD
 */
$password = password_hash($data['password'], PASSWORD_BCRYPT);

/**
 * INSERT dengan role default 'user'
 */
$stmt = $pdo->prepare("
    INSERT INTO users (username, email, password, role, created_at)
    VALUES (?, ?, ?, ?, NOW())
");
$stmt->execute([
    $data['username'],
    $data['email'],
    $password,
    $data['role'] ?? 'user'
]);

$userId = $pdo->lastInsertId();

// Ambil data user yang baru dibuat
$stmt = $pdo->prepare("
    SELECT id, username, email, role, created_at 
    FROM users WHERE id = ?
");
$stmt->execute([$userId]);
$newUser = $stmt->fetch();

echo json_encode([
    "success" => true,
    "message" => "Register berhasil",
    "data" => $newUser
]);
?>