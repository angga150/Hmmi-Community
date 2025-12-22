<?php
require_once __DIR__ . "/../config/database.php";

$headers = getallheaders();
$token = $headers['Authorization'] ?? null;

if (!$token) {
    http_response_code(401);
    echo json_encode(["message"=>"Unauthorized"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE api_token=?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(["message"=>"Invalid token"]);
    exit;
}
