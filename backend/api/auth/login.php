<?php
require_once __DIR__ . "/../../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $pdo->prepare("SELECT * FROM users WHERE email=?");
$stmt->execute([$data['email'] ?? '']);
$user = $stmt->fetch();

if (!$user || !password_verify($data['password'], $user['password'])) {
    http_response_code(401);
    echo json_encode(["message"=>"Login failed"]);
    exit;
}

$token = bin2hex(random_bytes(32));

$pdo->prepare(
    "UPDATE users SET api_token=? WHERE id=?"
)->execute([$token, $user['id']]);

echo json_encode([
    "token" => $token,
    "user" => [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email']
    ]
]);
