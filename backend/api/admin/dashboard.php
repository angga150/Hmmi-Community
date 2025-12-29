<?php
require_once __DIR__ . '/../../middleware/auth.php';

// Hanya admin yang bisa akses
$admin = requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Contoh: Get stats untuk admin dashboard
    $stats = [
        "total_users" => getTotalUsers($pdo),
        "active_today" => getActiveUsersToday($pdo),
        "new_this_week" => getNewUsersThisWeek($pdo)
    ];
    
    echo json_encode([
        "success" => true,
        "message" => "Data dashboard admin",
        "data" => $stats,
        "admin" => [
            "name" => $admin['name'],
            "email" => $admin['email']
        ]
    ]);
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method tidak diizinkan"]);
}

// Helper functions
function getTotalUsers($pdo) {
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
    return $stmt->fetch()['total'];
}

function getActiveUsersToday($pdo) {
    $stmt = $pdo->prepare("
        SELECT COUNT(DISTINCT user_id) as active 
        FROM user_activity 
        WHERE DATE(created_at) = CURDATE()
    ");
    $stmt->execute();
    return $stmt->fetch()['active'];
}

function getNewUsersThisWeek($pdo) {
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as new_users 
        FROM users 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ");
    $stmt->execute();
    return $stmt->fetch()['new_users'];
}
?>