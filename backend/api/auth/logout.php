<?php
// backend/api/auth/logout.php
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../config/cors.php";

// Hanya POST method yang diperbolehkan
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed. Use POST."
    ]);
    exit;
}

// Ambil token dari header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
$token = '';

if (preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
    $token = $matches[1];
} elseif (!empty($authHeader)) {
    $token = $authHeader;
}

// Jika ada token, invalidate di database
if (!empty($token)) {
    try {
        $stmt = $pdo->prepare("
            UPDATE users 
            SET api_token = NULL, token_expires_at = NULL 
            WHERE api_token = ?
        ");
        $stmt->execute([$token]);
    } catch (Exception $e) {
        // Tetap lanjut meski error
    }
}

echo json_encode([
    "success" => true,
    "message" => "Logout berhasil"
]);
?>