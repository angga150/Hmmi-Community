<?php
require_once __DIR__ . "/../config/cors.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// sesuaikan dengan nama folder project
$uri = str_replace("/Hmmi-Community/backend/public", "", $uri);

$routes = [
    "/api/auth/login"    => "../api/auth/login.php",
    "/api/auth/register" => "../api/auth/register.php",
    "/api/auth/me"       => "../api/auth/me.php",
];

if (!isset($routes[$uri])) {
    http_response_code(404);
    echo json_encode(["message"=>"Route not found"]);
    exit;
}

require_once __DIR__ . "/" . $routes[$uri];
