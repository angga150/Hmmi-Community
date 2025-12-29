<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = authMiddleware(); // Semua endpoint events butuh login

switch ($method) {
    case 'GET':
        // GET /api/events - List events dengan filter
        $queryParams = $_GET;
        
        $sql = "SELECT e.*, u.username as creator_name 
                FROM events e 
                JOIN users u ON e.created_by = u.id 
                WHERE 1=1";
        $params = [];
        
        // Filter by status
        if (!empty($queryParams['status'])) {
            $sql .= " AND e.status = ?";
            $params[] = $queryParams['status'];
        }
        
        // Filter by date range
        if (!empty($queryParams['start_date'])) {
            $sql .= " AND DATE(e.event_date) >= ?";
            $params[] = $queryParams['start_date'];
        }
        if (!empty($queryParams['end_date'])) {
            $sql .= " AND DATE(e.event_date) <= ?";
            $params[] = $queryParams['end_date'];
        }
        
        // Role-based filter: user hanya lihat event aktif
        if ($user['role'] === 'user') {
            $sql .= " AND e.status IN ('upcoming', 'ongoing')";
        }
        
        $sql .= " ORDER BY e.event_date ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format response
        foreach ($events as &$event) {
            $event['event_date_formatted'] = date('d/m/Y H:i', strtotime($event['event_date']));
            $event['created_at_formatted'] = date('d/m/Y H:i', strtotime($event['created_at']));
        }
        
        echo json_encode([
            'success' => true,
            'data' => $events,
            'count' => count($events)
        ]);
        break;
        
    case 'POST':
        // POST /api/events - Create new event (admin only)
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Admin only']);
            exit;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) $input = $_POST;
        
        // Validation
        $required = ['title', 'description', 'event_date'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => "Field $field wajib diisi"]);
                exit;
            }
        }
        
        // Insert event
        $stmt = $pdo->prepare("
            INSERT INTO events (title, description, event_date, place, status, created_by) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $status = $input['status'] ?? 'upcoming';
        $place = $input['place'] ?? null;
        
        try {
            $stmt->execute([
                $input['title'],
                $input['description'],
                $input['event_date'],
                $place,
                $status,
                $user['id']
            ]);
            
            $eventId = $pdo->lastInsertId();
            
            // Get created event
            $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
            $stmt->execute([$eventId]);
            $newEvent = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'message' => 'Event created successfully',
                'data' => $newEvent
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