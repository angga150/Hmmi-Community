<?php
require_once __DIR__ . '/../config/cors.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path if exists
$basePath = '/Hmmi-Community/backend/public';
if (strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
}

// Route mapping untuk MVP
$routes = [
    // Auth (existing)
    '/api/auth/login' => '../api/auth/login.php',
    '/api/auth/register' => '../api/auth/register.php',
    '/api/auth/logout' => '../api/auth/logout.php',
    '/api/auth/me' => '../api/auth/me.php',
    
    // Events
    '/api/events' => '../api/events/index.php',
    
    // Meetings
    '/api/meetings' => '../api/meetings/index.php',
    
    // Attendance
    '/api/attendance/sessions' => '../api/attendance/sessions/index.php',
    '/api/attendance/checkin/manual' => '../api/attendance/checkin/manual.php',
    '/api/attendance/scan' => '../api/attendance/scan/index.php', 
    '/api/attendance/qrcode' => '../api/attendance/qrcode/index.php',
    '/api/attendance/reports/session' => '../api/attendance/reports/session.php',
    
    // Health
    '/api/health' => '../api/health.php',
];

// Check if route exists
if (isset($routes[$uri])) {
    $filePath = __DIR__ . '/' . $routes[$uri];
    
    if (file_exists($filePath)) {
        require_once $filePath;
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint file not found: ' . $filePath
        ]);
    }
    exit;
}

// 404 Not Found
http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'Endpoint not found: ' . $uri,
    'available_routes' => array_keys($routes)
]);
?>