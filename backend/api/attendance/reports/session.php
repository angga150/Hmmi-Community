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

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

try {
    $user = authMiddleware();
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication failed: ' . $e->getMessage()]);
    exit;
}

// Hanya admin yang bisa akses reports
if ($user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Hanya admin yang bisa mengakses laporan']);
    exit;
}

$sessionId = $_GET['session_id'] ?? null;

if (!$sessionId) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Session ID diperlukan']);
    exit;
}

try {
    // 1. Ambil data session
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
    $session = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$session) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Session tidak ditemukan']);
        exit;
    }
    
    // Format dates
    $session['created_at_formatted'] = date('d/m/Y H:i', strtotime($session['created_at']));
    if ($session['expires_at']) {
        $session['expires_at_formatted'] = date('d/m/Y H:i', strtotime($session['expires_at']));
    }
    
    // 2. Ambil attendance records
    $stmt = $pdo->prepare("
        SELECT r.*, u.username, u.email, u.role
        FROM attendance_records r
        JOIN users u ON r.user_id = u.id
        WHERE r.session_id = ?
        ORDER BY r.checkin_time ASC
    ");
    $stmt->execute([$sessionId]);
    $attendance = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format attendance data
    $totalAttendees = count($attendance);
    $firstCheckin = null;
    $lastCheckin = null;
    
    foreach ($attendance as &$record) {
        $record['checkin_time_formatted'] = date('H:i', strtotime($record['checkin_time']));
        $record['checkin_date_formatted'] = date('d/m/Y', strtotime($record['checkin_time']));
        
        // Track first and last checkin
        if (!$firstCheckin || strtotime($record['checkin_time']) < strtotime($firstCheckin)) {
            $firstCheckin = $record['checkin_time'];
        }
        if (!$lastCheckin || strtotime($record['checkin_time']) > strtotime($lastCheckin)) {
            $lastCheckin = $record['checkin_time'];
        }
    }
    
    // 3. Hitung statistik
    $stats = [
        'total_attendees' => $totalAttendees,
        'max_attendees' => $session['max_attendees'] ?: 'Tidak terbatas',
        'attendance_percentage' => $session['max_attendees'] ? 
            round(($totalAttendees / $session['max_attendees']) * 100, 1) . '%' : '100%',
        'first_checkin' => $firstCheckin ? date('H:i', strtotime($firstCheckin)) : '-',
        'last_checkin' => $lastCheckin ? date('H:i', strtotime($lastCheckin)) : '-',
        'checkin_duration' => $firstCheckin && $lastCheckin ? 
            round((strtotime($lastCheckin) - strtotime($firstCheckin)) / 60, 0) . ' menit' : '-'
    ];

    // echo json_encode([
    //     'success' => true,
    //     'data' => [
    //         'session' => $session,
    //         'attendance' => $attendance,
    //         'stats' => $stats
    //     ]
    // ]);
    // exit;
    
    // 4. Group by role
    // $roleStats = [];
    // foreach ($attendance as $record) {
    //     $role = $record['role'];
    //     if (!isset($roleStats[$role])) {
    //         $roleStats[$role] = 0;
    //     }
    //     $roleStats[$role]++;
    // }
    
    echo json_encode([
        'success' => true,
        'data' => [
            'session' => $session,
            'attendance' => $attendance,
            'stats' => $stats,
            // 'role_stats' => $roleStats,
            'summary' => [
                'session_title' => $session['title'],
                'unique_code' => $session['unique_code'],
                'status' => $session['status'],
                'created_by' => $session['creator_name'],
                'report_generated_at' => date('d/m/Y H:i:s')
            ]
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Report error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Gagal mengambil laporan: ' . $e->getMessage()
    ]);
}
?>