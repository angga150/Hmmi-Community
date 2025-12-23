<?php
require_once __DIR__ . "/../config/database.php";

$headers = getallheaders();
$token = $headers['authorization'] ?? null;

if (!$token) {
    http_response_code(401);
    echo json_encode(["message"=>"lu belum login woi"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE api_token=?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(["message"=>"akun lu belum terdaftar woi"]);
    exit;
}
