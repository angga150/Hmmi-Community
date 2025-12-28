<?php
require_once __DIR__ . "/../config/cors.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Sesuaikan dengan base path project
$basePath = "/Hmmi-Community/backend/public";
$uri = str_replace($basePath, "", $uri);

$routes = [
    // Auth routes
    "/api/auth/login"    => "../api/auth/login.php",
    "/api/auth/register" => "../api/auth/register.php",
    "/api/auth/me"       => "../api/auth/me.php",
    "/api/auth/logout"   => "../api/auth/logout.php",
    
    // User routes (protected)
    "/api/user/profile"  => "../api/user/profile.php",
    
    // Admin routes (protected)
    "/api/admin/users"   => "../api/admin/users.php",
    
    // Public routes
    "/api/health"        => "../api/health.php",
];

if (!isset($routes[$uri])) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Route not found: $uri"
    ]);
    exit;
}

require_once __DIR__ . "/" . $routes[$uri];
?>