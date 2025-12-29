<?php
// backend/public/index.php - Updated Router

require_once __DIR__ . "/../config/cors.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = "/Hmmi-Community/backend/public";
$uri = str_replace($basePath, "", $uri);

// Main routes mapping
$routes = [
    // Authentication
    '/api/auth/login' => '../api/auth/login.php',
    '/api/auth/register' => '../api/auth/register.php',
    '/api/auth/logout' => '../api/auth/logout.php',
    '/api/auth/me' => '../api/auth/me.php',
    '/api/auth/refresh' => '../api/auth/refresh.php',
    
    // Admin
    '/api/admin/users' => '../api/admin/users.php',
    '/api/admin/dashboard' => '../api/admin/dashboard.php',
    
    // Events
    '/api/events' => '../api/events/index.php',
    '/api/events/upcoming' => '../api/events/upcoming.php',
    '/api/events/past' => '../api/events/past.php',
    '/api/events/attendance' => '../api/events/attendance.php',
    '/api/events/register' => '../api/events/register.php',
    
    // Meetings
    '/api/meetings' => '../api/meetings/index.php',
    '/api/meetings/schedule' => '../api/meetings/schedule.php',
    '/api/meetings/attendance' => '../api/meetings/attendance.php',
    '/api/meetings/agenda' => '../api/meetings/agenda.php',
    
    // Attendance
    '/api/attendance/sessions' => '../api/attendance/sessions/index.php',
    '/api/attendance/sessions/generate' => '../api/attendance/sessions/generate.php',
    '/api/attendance/sessions/validate' => '../api/attendance/sessions/validate.php',
    '/api/attendance/sessions/close' => '../api/attendance/sessions/close.php',
    
    '/api/attendance/checkin/scan' => '../api/attendance/checkin/scan.php',
    '/api/attendance/checkin/manual' => '../api/attendance/checkin/manual.php',
    '/api/attendance/checkin/history' => '../api/attendance/checkin/history.php',
    '/api/attendance/checkin/verify' => '../api/attendance/checkin/verify.php',
    
    '/api/attendance/reports/export' => '../api/attendance/reports/export.php',
    '/api/attendance/reports/stats' => '../api/attendance/reports/stats.php',
    '/api/attendance/reports/summary' => '../api/attendance/reports/summary.php',
    '/api/attendance/reports/user' => '../api/attendance/reports/user.php',
    
    // User
    '/api/user/profile' => '../api/user/profile.php',
    '/api/user/attendance' => '../api/user/attendance.php',
    '/api/user/events' => '../api/user/events.php',
    '/api/user/settings' => '../api/user/settings.php',
    
    // Dashboard
    '/api/dashboard/overview' => '../api/dashboard/overview.php',
    '/api/dashboard/calendar' => '../api/dashboard/calendar.php',
    '/api/dashboard/notifications' => '../api/dashboard/notifications.php',
    
    // System
    '/api/health' => '../api/health.php',
    '/api/status' => '../api/system/status.php',
];

// Dynamic ID-based routes
if (preg_match('#^/api/events/(\d+)$#', $uri, $matches)) {
    $_GET['id'] = $matches[1];
    require_once __DIR__ . "/../api/events/[id].php";
    exit;
}

if (preg_match('#^/api/meetings/(\d+)$#', $uri, $matches)) {
    $_GET['id'] = $matches[1];
    require_once __DIR__ . "/../api/meetings/[id].php";
    exit;
}

if (preg_match('#^/api/attendance/sessions/(\d+)$#', $uri, $matches)) {
    $_GET['id'] = $matches[1];
    require_once __DIR__ . "/../api/attendance/sessions/[id].php";
    exit;
}

if (preg_match('#^/api/user/attendance/(\d+)$#', $uri, $matches)) {
    $_GET['user_id'] = $matches[1];
    require_once __DIR__ . "/../api/attendance/reports/user.php";
    exit;
}

// Static routes
if (isset($routes[$uri])) {
    require_once __DIR__ . "/" . $routes[$uri];
    exit;
}

// 404 Not Found
http_response_code(404);
echo json_encode([
    "success" => false,
    "message" => "Endpoint not found",
    "requested" => $uri,
    "timestamp" => date('Y-m-d H:i:s')
]);
?>