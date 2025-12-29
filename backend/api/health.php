<?php
require_once __DIR__ . "/../config/cors.php";

echo json_encode([
    "success" => true,
    "message" => "API is running",
    "timestamp" => date('Y-m-d H:i:s'),
    "status" => "healthy"
]);
?>