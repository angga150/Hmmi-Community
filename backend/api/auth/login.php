<?php
require_once __DIR__ . "/../../config/database.php";

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
    echo json_encode(["message" => "Body kosong"]);
    exit;
}

/**
 * VALIDASI
 */
if (empty($data['email']) || empty($data['password'])) {
    http_response_code(422);
    echo json_encode(["message" => "Email & password wajib"]);
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
    echo json_encode(["message" => "Email tidak ditemukan"]);
    exit;
}

/**
 * CEK PASSWORD
 */
if (!password_verify($data['password'], $user['password'])) {
    http_response_code(401);
    echo json_encode(["message" => "Password salah"]);
    exit;
}

/**
 * GENERATE TOKEN SAAT LOGIN
 */
$token = bin2hex(random_bytes(32));

$stmt = $pdo->prepare("UPDATE users SET api_token = ? WHERE id = ?");
$stmt->execute([$token, $user['id']]);

echo json_encode([
    "message" => "Login berhasil",
    "token"   => $token,
    "user" => [
        "id" => $user['id'],
        "username" => $user['username'],
        "email" => $user['email']
    ]
]);
