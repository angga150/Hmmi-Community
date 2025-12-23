<?php
require_once __DIR__ . "/../../middleware/auth.php";

echo json_encode([
    "user" => [
        "id" => $user['id'],
        "username" => $user['username'],
        "email" => $user['email']
    ]
]);
