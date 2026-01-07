<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    // Hanya admin yang bisa akses
    $currentUser = requireRole('admin');
    
    // Get all users except the current admin
    $stmt = $pdo->prepare("SELECT id, username, email, role, created_at FROM users WHERE id != ?");
    $stmt->execute([$currentUser['id']]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        'success' => true,
        'data' => $users,
        'count' => count($users),
        'message' => 'Daftar pengguna berhasil diambil'
    ]);

    
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>