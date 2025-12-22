<?php
require_once __DIR__ . "/../../middleware/auth.php";

echo json_encode([
    "user" => [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email']
    ]
]);
