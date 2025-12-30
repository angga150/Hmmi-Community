<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle preflight
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

try {
    $user = authMiddleware();
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication failed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (empty($input)) {
    $input = $_POST;
}

// QR code bisa berisi code langsung atau JSON
if (empty($input['data'])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'QR data wajib diisi']);
    exit;
}

$qrData = $input['data'];
$code = '';

// Cek apakah QR data adalah JSON
if (strpos($qrData, '{') === 0) {
    $decoded = json_decode($qrData, true);
    if ($decoded && isset($decoded['session_code'])) {
        $code = $decoded['session_code'];
    } elseif ($decoded && isset($decoded['code'])) {
        $code = $decoded['code'];
    }
} else {
    // QR data adalah plain code
    $code = $qrData;
}

if (empty($code)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Kode tidak ditemukan dalam QR data']);
    exit;
}

// Sekarang panggil manual check-in dengan kode yang ditemukan
try {
    // 1. Cari session berdasarkan kode
    $stmt = $pdo->prepare("
        SELECT s.*, 
               e.title as event_title,
               m.title as meeting_title,
               u.username as creator_name
        FROM attendance_sessions s
        LEFT JOIN events e ON s.event_id = e.id
        LEFT JOIN meetings m ON s.meeting_id = m.id
        LEFT JOIN users u ON s.created_by = u.id
        WHERE s.unique_code = ? 
        AND s.status = 'active'
    ");
    $stmt->execute([strtoupper(trim($code))]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$session) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Kode tidak valid atau session tidak aktif']);
        exit;
    }
    
    // 2. Cek expiry
    if ($session['expires_at'] && strtotime($session['expires_at']) < time()) {
        $stmt = $pdo->prepare("UPDATE attendance_sessions SET status = 'expired' WHERE id = ?");
        $stmt->execute([$session['id']]);
        
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Session sudah expired']);
        exit;
    }
    
    // 3. Cek duplikat check-in
    $stmt = $pdo->prepare("
        SELECT id, checkin_time 
        FROM attendance_records 
        WHERE session_id = ? AND user_id = ?
    ");
    $stmt->execute([$session['id'], $user['id']]);
    $existingCheckin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existingCheckin) {
        $checkinTime = date('H:i', strtotime($existingCheckin['checkin_time']));
        echo json_encode([
            'success' => false,
            'message' => 'Anda sudah check-in pada pukul ' . $checkinTime,
            'already_checked_in' => true,
            'checkin_time' => $existingCheckin['checkin_time']
        ]);
        exit;
    }
    
    // 4. Cek kuota
    if ($session['max_attendees'] > 0) {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM attendance_records WHERE session_id = ?");
        $stmt->execute([$session['id']]);
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        if ($count >= $session['max_attendees']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Kuota peserta sudah penuh']);
            exit;
        }
    }
    
    // 5. Lakukan check-in
    $stmt = $pdo->prepare("
        INSERT INTO attendance_records (session_id, user_id, checkin_time)
        VALUES (?, ?, NOW())
    ");
    $stmt->execute([$session['id'], $user['id']]);
    
    $recordId = $pdo->lastInsertId();
    
    // 6. Ambil data check-in
    $stmt = $pdo->prepare("
        SELECT r.*, u.username, u.email
        FROM attendance_records r
        JOIN users u ON r.user_id = u.id
        WHERE r.id = ?
    ");
    $stmt->execute([$recordId]);
    $checkinRecord = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Format waktu
    $checkinRecord['checkin_time_formatted'] = date('H:i', strtotime($checkinRecord['checkin_time']));
    $checkinRecord['checkin_date_formatted'] = date('d/m/Y', strtotime($checkinRecord['checkin_time']));
    
    // 7. Hitung total attendees
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM attendance_records WHERE session_id = ?");
    $stmt->execute([$session['id']]);
    $totalAttendees = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Check-in berhasil via QR Code!',
        'data' => [
            'checkin' => $checkinRecord,
            'session' => [
                'id' => $session['id'],
                'title' => $session['title'],
                'event_title' => $session['event_title'],
                'meeting_title' => $session['meeting_title']
            ],
            'summary' => [
                'your_checkin_time' => $checkinRecord['checkin_time_formatted'],
                'total_attendees' => $totalAttendees,
                'max_attendees' => $session['max_attendees'] ?: 'Tidak terbatas'
            ],
            'method' => 'qr_scan'
        ]
    ]);
    
} catch (Exception $e) {
    error_log("QR Scan error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Gagal melakukan check-in via QR: ' . $e->getMessage()
    ]);
}