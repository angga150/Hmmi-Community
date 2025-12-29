<?php
require_once __DIR__ . '/../../../../config/database.php';
require_once __DIR__ . '/../../../../config/cors.php';
require_once __DIR__ . '/../../../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = authMiddleware();

switch ($method) {
    case 'GET':
        // GET /api/attendance/sessions - List sessions
        $queryParams = $_GET;
        
        $sql = "SELECT s.*, 
                       e.title as event_title, 
                       m.title as meeting_title,
                       u.username as creator_name,
                       COUNT(r.id) as attendee_count
                FROM attendance_sessions s
                LEFT JOIN events e ON s.event_id = e.id
                LEFT JOIN meetings m ON s.meeting_id = m.id
                LEFT JOIN users u ON s.created_by = u.id
                LEFT JOIN attendance_records r ON s.id = r.session_id
                WHERE 1=1";
        $params = [];
        
        // Filter by event/meeting
        if (!empty($queryParams['event_id'])) {
            $sql .= " AND s.event_id = ?";
            $params[] = $queryParams['event_id'];
        }
        if (!empty($queryParams['meeting_id'])) {
            $sql .= " AND s.meeting_id = ?";
            $params[] = $queryParams['meeting_id'];
        }
        
        // Filter by date
        if (!empty($queryParams['date'])) {
            $sql .= " AND s.event_date = ?";
            $params[] = $queryParams['date'];
        }
        
        // Filter by status
        if (!empty($queryParams['status'])) {
            $sql .= " AND s.status = ?";
            $params[] = $queryParams['status'];
        }
        
        $sql .= " GROUP BY s.id ORDER BY s.event_date DESC, s.created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $sessions,
            'count' => count($sessions)
        ]);
        break;
        
    case 'POST':
        // POST /api/attendance/sessions - Create session (admin only)
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Admin only']);
            exit;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) $input = $_POST;
        
        // Validation
        if (empty($input['title'])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Title wajib diisi']);
            exit;
        }
        
        // Generate unique code
        require_once __DIR__ . '/../../../../utils/code_generator.php';
        $uniqueCode = generateUniqueCode(8);
        
        // Set expires_at (default 24 jam dari sekarang)
        $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
        
        // Insert session
        $stmt = $pdo->prepare("
            INSERT INTO attendance_sessions 
            (title, event_id, meeting_id, event_date, unique_code, expires_at, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        try {
            $stmt->execute([
                $input['title'],
                $input['event_id'] ?? null,
                $input['meeting_id'] ?? null,
                $input['event_date'] ?? date('Y-m-d'),
                $uniqueCode,
                $input['expires_at'] ?? $expiresAt,
                $user['id']
            ]);
            
            $sessionId = $pdo->lastInsertId();
            
            // Generate QR code
            $qrData = [
                'session_id' => $sessionId,
                'code' => $uniqueCode,
                'title' => $input['title']
            ];
            
            echo json_encode([
                'success' => true,
                'message' => 'Attendance session created',
                'data' => [
                    'id' => $sessionId,
                    'title' => $input['title'],
                    'unique_code' => $uniqueCode,
                    'qr_data' => $qrData,
                    'expires_at' => $input['expires_at'] ?? $expiresAt
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>