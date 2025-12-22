<?php
require_once __DIR__ . "/../../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name'], $data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["message"=>"Invalid input"]);
    exit;
}

$password = password_hash($data['password'], PASSWORD_BCRYPT);

$stmt = $pdo->prepare(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)"
);
$stmt->execute([
    $data['name'],
    $data['email'],
    $password
]);

echo json_encode(["message"=>"Register success"]);
