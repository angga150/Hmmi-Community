<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/cors.php";

/**
 * Middleware untuk validasi token
 * Mengembalikan user data jika valid, atau mati dengan error JSON
 */
function authMiddleware() {
    global $pdo;
    
    // Ambil token dari berbagai sumber
    $token = getTokenFromRequest();
    
    if (!$token) {
        sendUnauthorized("Token tidak ditemukan. Silakan login terlebih dahulu.");
    }
    
    // Cari user dengan token
    $user = findUserByToken($pdo, $token);
    
    if (!$user) {
        sendUnauthorized("Token tidak valid atau telah kedaluwarsa.");
    }
    
    // Cek token expiry jika ada
    if (!empty($user['token_expires_at']) && strtotime($user['token_expires_at']) < time()) {
        sendUnauthorized("Token telah kedaluwarsa.");
    }
    
    return $user;
}

/**
 * Mendapatkan token dari berbagai sumber
 */
function getTokenFromRequest() {
    // 1. Dari header Authorization (Bearer token)
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
        return $matches[1];
    }
    
    // 2. Token langsung (tanpa Bearer) - sesuai dengan login.php
    if (!empty($authHeader)) {
        return $authHeader;
    }
    
    // 3. Dari query parameter (untuk testing)
    if (isset($_GET['token'])) {
        return $_GET['token'];
    }
    
    return null;
}

/**
 * Cari user berdasarkan token di database
 * FIXED: Sesuai dengan struktur tabel users
 */
function findUserByToken($pdo, $token) {
    $stmt = $pdo->prepare("
        SELECT id, username, email, role, api_token, token_expires_at, created_at
        FROM users 
        WHERE api_token = ? 
        AND (token_expires_at IS NULL OR token_expires_at > NOW())
    ");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Hapus data sensitif
        unset($user['api_token']);
        if (isset($user['password'])) unset($user['password']);
    }
    
    return $user;
}

/**
 * Helper untuk mengirim response unauthorized
 */
function sendUnauthorized($message = "Unauthorized") {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => $message,
        "timestamp" => date('Y-m-d H:i:s')
    ]);
    exit;
}

/**
 * Middleware untuk role-based access
 */
function requireRole($requiredRole) {
    $user = authMiddleware();
    
    if ($user['role'] !== $requiredRole && $user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Akses ditolak. Role tidak mencukupi.",
            "required_role" => $requiredRole,
            "your_role" => $user['role']
        ]);
        exit;
    }
    
    return $user;
}

/**
 * Middleware untuk admin-only access
 */
function requireAdmin() {
    return requireRole('admin');
}

/**
 * Middleware untuk user-only access
 */
function requireRoleUser() {
    return requireRole('user');
}

/**
 * Middleware untuk public atau authenticated access
 * Return user jika ada, null jika tidak
 */
function optionalAuth() {
    try {
        return authMiddleware();
    } catch (Exception $e) {
        return null;
    }
}
?>