<?php
require_once __DIR__ . "/../../middleware/auth.php";

// Panggil middleware untuk validasi token
// Jika token valid, $user akan terisi
// Jika tidak valid, middleware akan auto response error
$user = authMiddleware();

// Jika sampai sini, token valid
echo json_encode([
    "success" => true,
    "message" => "User data retrieved successfully",
    "data" => [
        "id" => $user['id'],
        "username" => $user['username'],
        "email" => $user['email'],
        "role" => $user['role'],
        "created_at" => $user['created_at']
    ]
]);
?>