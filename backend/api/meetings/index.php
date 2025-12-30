<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = authMiddleware();

switch ($method) {
    case 'GET':
        // GET /api/meetings - List meetings
        $params = [];
        $sql = "SELECT m.*, u.username as creator_name 
                FROM meetings m 
                JOIN users u ON m.created_by = u.id 
                WHERE 1=1";
        
        if (!empty($_GET['date'])) {
            $sql .= " AND m.meeting_date_only = ?";
            $params[] = $_GET['date'];
        }
        
        if (!empty($_GET['status'])) {
            $sql .= " AND m.status = ?";
            $params[] = $_GET['status'];
        }
        
        if (!empty($_GET['upcoming'])) {
            $sql .= " AND m.meeting_date >= NOW()";
        }
        
        $sql .= " ORDER BY m.meeting_date ASC";
        
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $meetings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($meetings as &$meeting) {
                $meeting['meeting_date_formatted'] = date('d/m/Y H:i', strtotime($meeting['meeting_date']));
            }
            
            echo json_encode([
                'success' => true,
                'data' => $meetings,
                'count' => count($meetings)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error']);
        }
        break;
        
    case 'POST':
        // POST /api/meetings - Create meeting (admin only)
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Hanya admin yang bisa membuat meeting']);
            exit;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) $input = $_POST;
        
        if (empty($input['title']) || empty($input['description']) || empty($input['meeting_date'])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Title, description, dan tanggal wajib diisi']);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare("
                INSERT INTO meetings (title, description, meeting_date, place, status, created_by) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $input['title'],
                $input['description'],
                $input['meeting_date'],
                $input['place'] ?? null,
                $input['status'] ?? 'upcoming',
                $user['id']
            ]);
            
            $meetingId = $pdo->lastInsertId();
            
            $stmt = $pdo->prepare("SELECT * FROM meetings WHERE id = ?");
            $stmt->execute([$meetingId]);
            $newMeeting = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'message' => 'Meeting berhasil dibuat',
                'data' => $newMeeting
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal membuat meeting']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}
?>