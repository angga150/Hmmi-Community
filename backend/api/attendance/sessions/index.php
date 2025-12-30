<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle preflight OPTIONS request
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $user = authMiddleware();
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication failed: ' . $e->getMessage()]);
    exit;
}

switch ($method) {
    case 'GET':
        // GET /api/attendance/sessions - List sessions
        // Admin bisa lihat semua, user hanya lihat yang aktif
        
        $params = [];
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
        
        // Filter by date
        if (!empty($_GET['date'])) {
            $sql .= " AND s.event_date = ?";
            $params[] = $_GET['date'];
        }
        
        // Filter by event
        if (!empty($_GET['event_id'])) {
            $sql .= " AND s.event_id = ?";
            $params[] = $_GET['event_id'];
        }
        
        // Filter by meeting
        if (!empty($_GET['meeting_id'])) {
            $sql .= " AND s.meeting_id = ?";
            $params[] = $_GET['meeting_id'];
        }
        
        // User hanya bisa lihat session aktif
        if ($user['role'] === 'user') {
            $sql .= " AND s.status = 'active' 
                     AND (s.expires_at IS NULL OR s.expires_at > NOW())";
        }
        
        // Filter active only (untuk admin dengan parameter)
        if (!empty($_GET['active_only'])) {
            $sql .= " AND s.status = 'active' 
                     AND (s.expires_at IS NULL OR s.expires_at > NOW())";
        }
        
        $sql .= " GROUP BY s.id ORDER BY s.created_at DESC";
        
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Format data
            foreach ($sessions as &$session) {
                $session['created_at_formatted'] = date('d/m/Y H:i', strtotime($session['created_at']));
                if ($session['expires_at']) {
                    $session['expires_at_formatted'] = date('d/m/Y H:i', strtotime($session['expires_at']));
                }
                
                // Tentukan status jika expired
                if ($session['status'] === 'active' && $session['expires_at'] && strtotime($session['expires_at']) < time()) {
                    $session['auto_status'] = 'expired';
                }
            }
            
            echo json_encode([
                'success' => true,
                'data' => $sessions,
                'count' => count($sessions),
                'user_role' => $user['role']
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    case 'POST':
        // POST /api/attendance/sessions - Create session (admin only)
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Hanya admin yang bisa membuat attendance session']);
            exit;
        }
        
        // Get input data
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }
        
        // Validasi required fields
        if (empty($input['title'])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Title wajib diisi']);
            exit;
        }
        
        // Generate unique code (8 karakter alphanumeric)
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $uniqueCode = '';
        for ($i = 0; $i < 8; $i++) {
            $uniqueCode .= $characters[rand(0, strlen($characters) - 1)];
        }
        
        // Set expiry time (default 24 jam)
        $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
        if (!empty($input['expires_in_hours'])) {
            $expiresAt = date('Y-m-d H:i:s', strtotime('+' . intval($input['expires_in_hours']) . ' hours'));
        }
        
        try {
            // Cek apakah event/meeting ada
            if (!empty($input['event_id'])) {
                $stmt = $pdo->prepare("SELECT id FROM events WHERE id = ?");
                $stmt->execute([$input['event_id']]);
                if (!$stmt->fetch()) {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'Event tidak ditemukan']);
                    exit;
                }
            }
            
            if (!empty($input['meeting_id'])) {
                $stmt = $pdo->prepare("SELECT id FROM meetings WHERE id = ?");
                $stmt->execute([$input['meeting_id']]);
                if (!$stmt->fetch()) {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'Meeting tidak ditemukan']);
                    exit;
                }
            }
            
            // Insert session
            $stmt = $pdo->prepare("
                INSERT INTO attendance_sessions 
                (title, event_id, meeting_id, event_date, unique_code, expires_at, created_by, max_attendees) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $eventDate = $input['event_date'] ?? date('Y-m-d');
            $maxAttendees = !empty($input['max_attendees']) ? intval($input['max_attendees']) : null;
            
            $stmt->execute([
                trim($input['title']),
                $input['event_id'] ?? null,
                $input['meeting_id'] ?? null,
                $eventDate,
                $uniqueCode,
                $expiresAt,
                $user['id'],
                $maxAttendees
            ]);
            
            $sessionId = $pdo->lastInsertId();
            
            // Ambil data session yang baru dibuat
            $stmt = $pdo->prepare("
                SELECT s.*, 
                       e.title as event_title,
                       m.title as meeting_title,
                       u.username as creator_name
                FROM attendance_sessions s
                LEFT JOIN events e ON s.event_id = e.id
                LEFT JOIN meetings m ON s.meeting_id = m.id
                LEFT JOIN users u ON s.created_by = u.id
                WHERE s.id = ?
            ");
            $stmt->execute([$sessionId]);
            $newSession = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'message' => 'Attendance session berhasil dibuat',
                'data' => [
                    'session' => $newSession,
                    'qr_data' => [
                        'code' => $uniqueCode,
                        'session_id' => $sessionId,
                        'title' => $input['title'],
                        'expires_at' => $expiresAt
                    ],
                    'qr_code_url' => '/api/attendance/qrcode/' . $uniqueCode // Endpoint baru
                ]
            ]);
            
        } catch (Exception $e) {
            error_log("Session creation error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'message' => 'Gagal membuat attendance session: ' . $e->getMessage()
            ]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}
?>