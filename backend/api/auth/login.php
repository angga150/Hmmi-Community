<?php
// backend/api/auth/login.php
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../config/cors.php";

/**
 * AMBIL BODY (JSON / FORM)
 */
$raw = file_get_contents("php://input");

$data = [];

if (!empty($raw)) {
    $data = json_decode($raw, true);
}

if (empty($data)) {
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
if (empty($data['email']) || empty($data['password'])) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "message" => "Email & password wajib"
    ]);
    exit;
}

/**
 * CARI USER
 */
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$data['email']]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Email atau password salah"
    ]);
    exit;
}

/**
 * CEK PASSWORD
 */
if (!password_verify($data['password'], $user['password'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Email atau password salah"
    ]);
    exit;
}

/**
 * GENERATE TOKEN SAAT LOGIN
 */
$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+7 days')); // Token berlaku 7 hari

// Update token dan expiry time
$stmt = $pdo->prepare("
    UPDATE users 
    SET api_token = ?, token_expires_at = ? 
    WHERE id = ?
");
$stmt->execute([$token, $expiresAt, $user['id']]);

echo json_encode([
    "success" => true,
    "message" => "Login berhasil",
    "token"   => $token,
    "expires_at" => $expiresAt,
    "data" => [
        "id" => $user['id'],
        "username" => $user['username'],
        "email" => $user['email'],
        "role" => $user['role']
    ]
]);
?>