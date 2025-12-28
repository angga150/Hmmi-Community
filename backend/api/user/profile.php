<?php
// backend/api/user/profile.php
require_once __DIR__ . "/../../middleware/auth.php";

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // GET /api/user/profile
        $user = authMiddleware();
        
        echo json_encode([
            "success" => true,
            "message" => "Profile retrieved successfully",
            "data" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "email" => $user['email'],
                "role" => $user['role'],
                "created_at" => $user['created_at']
            ]
        ]);
        break;
        
    case 'PUT':
        // PUT /api/user/profile - Update profile
        $user = authMiddleware();
        
        // Parse input
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }
        
        // Validasi
        if (empty($input['username'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Username harus diisi"
            ]);
            exit;
        }
        
        // Cek username sudah dipakai oleh user lain
        $stmt = $pdo->prepare("
            SELECT id FROM users 
            WHERE username = ? AND id != ?
        ");
        $stmt->execute([$input['username'], $user['id']]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode([
                "success" => false,
                "message" => "Username sudah digunakan"
            ]);
            exit;
        }
        
        // Update database
        $stmt = $pdo->prepare("
            UPDATE users 
            SET username = ?, updated_at = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$input['username'], $user['id']]);
        
        echo json_encode([
            "success" => true,
            "message" => "Profile updated successfully",
            "data" => ["username" => $input['username']]
        ]);
        break;
        
    default:
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed"
        ]);
}
?>