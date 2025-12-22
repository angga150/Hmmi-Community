<?php
require_once __DIR__ . "/../../config/database.php";

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
            "message" => "Field $field wajib diisi"
        ]);
        exit;
    }
}

/**
 * HASH PASSWORD
 */
$password = password_hash($data['password'], PASSWORD_BCRYPT);

/**
 * INSERT
 */
$stmt = $pdo->prepare("
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?)
");
$stmt->execute([
    $data['username'],
    $data['email'],
    $password
]);

echo json_encode([
    "message" => "Register berhasil",
    "data" => [
        "id" => $pdo->lastInsertId(),
        "username" => $data['username'],
        "email" => $data['email']
    ]
]);
