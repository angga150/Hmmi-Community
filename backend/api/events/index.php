<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = authMiddleware(); // Semua endpoint butuh login

switch ($method) {
    case 'GET':
        // GET /api/events - List events dengan filter
        $params = [];
        $sql = "SELECT e.*, u.username as creator_name 
                FROM events e 
                JOIN users u ON e.created_by = u.id 
                WHERE 1=1";
        
        // Filter by date
        if (!empty($_GET['date'])) {
            $sql .= " AND e.event_date_only = ?";
            $params[] = $_GET['date'];
        }
        
        // Filter by status
        if (!empty($_GET['status'])) {
            $sql .= " AND e.status = ?";
            $params[] = $_GET['status'];
        }
        
        // Filter upcoming events
        if (!empty($_GET['upcoming'])) {
            $sql .= " AND e.event_date >= NOW()";
        }
        
        $sql .= " ORDER BY e.event_date ASC";
        
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Format dates
            foreach ($events as &$event) {
                $event['event_date_formatted'] = date('d/m/Y H:i', strtotime($event['event_date']));
                $event['created_at_formatted'] = date('d/m/Y H:i', strtotime($event['created_at']));
            }
            
            echo json_encode([
                'success' => true,
                'data' => $events,
                'count' => count($events)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    case 'POST':
        // POST /api/events - Create event (admin only)
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Hanya admin yang bisa membuat event']);
            exit;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) $input = $_POST;
        
        // Validasi required fields
        $required = ['title', 'description', 'event_date'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => "Field $field wajib diisi"]);
                exit;
            }
        }
        
        try {
            $stmt = $pdo->prepare("
                INSERT INTO events (title, description, event_date, place, status, created_by) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            $place = $input['place'] ?? null;
            $status = $input['status'] ?? 'upcoming';
            
            $stmt->execute([
                $input['title'],
                $input['description'],
                $input['event_date'],
                $place,
                $status,
                $user['id']
            ]);
            
            $eventId = $pdo->lastInsertId();
            
            // Ambil data event yang baru dibuat
            $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
            $stmt->execute([$eventId]);
            $newEvent = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'message' => 'Event berhasil dibuat',
                'data' => $newEvent
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal membuat event: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}
?>