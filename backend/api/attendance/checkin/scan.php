<?php
require_once __DIR__ . '/../../../../config/database.php';
require_once __DIR__ . '/../../../../config/cors.php';
require_once __DIR__ . '/../../../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// User harus login untuk check-in
$user = authMiddleware();

$input = json_decode(file_get_contents('php://input'), true);
if (empty($input)) $input = $_POST;

if (empty($input['code'])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Kode tidak boleh kosong']);
    exit;
}

$code = trim($input['code']);

// Cari session berdasarkan code
$stmt = $pdo->prepare("
    SELECT s.*, 
           e.title as event_title,
           m.title as meeting_title
    FROM attendance_sessions s
    LEFT JOIN events e ON s.event_id = e.id
    LEFT JOIN meetings m ON s.meeting_id = m.id
    WHERE s.unique_code = ? 
    AND s.status = 'active'
    AND (s.expires_at IS NULL OR s.expires_at > NOW())
");
$stmt->execute([$code]);
$session = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$session) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Kode tidak valid atau sudah expired']);
    exit;
}

// Cek apakah user sudah check-in
$stmt = $pdo->prepare("
    SELECT id FROM attendance_records 
    WHERE session_id = ? AND user_id = ?
");
$stmt->execute([$session['id'], $user['id']]);
$existing = $stmt->fetch();

if ($existing) {
    echo json_encode([
        'success' => false,
        'message' => 'Anda sudah melakukan check-in',
        'already_checked_in' => true,
        'checkin_time' => $existing['checkin_time'] ?? null
    ]);
    exit;
}

// Cek max attendees jika ada
if ($session['max_attendees'] > 0) {
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM attendance_records 
        WHERE session_id = ?
    ");
    $stmt->execute([$session['id']]);
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($count >= $session['max_attendees']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Kuota peserta sudah penuh']);
        exit;
    }
}

// Simpan check-in record
try {
    $stmt = $pdo->prepare("
        INSERT INTO attendance_records (session_id, user_id, checkin_time)
        VALUES (?, ?, NOW())
    ");
    $stmt->execute([$session['id'], $user['id']]);
    
    $recordId = $pdo->lastInsertId();
    
    // Get check-in details
    $stmt = $pdo->prepare("
        SELECT r.*, u.username, u.email
        FROM attendance_records r
        JOIN users u ON r.user_id = u.id
        WHERE r.id = ?
    ");
    $stmt->execute([$recordId]);
    $record = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Update session stats
    $stmt = $pdo->prepare("
        UPDATE attendance_sessions 
        SET updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([$session['id']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Check-in berhasil!',
        'data' => [
            'record' => $record,
            'session' => [
                'id' => $session['id'],
                'title' => $session['title'],
                'event_title' => $session['event_title'],
                'meeting_title' => $session['meeting_title']
            ]
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal melakukan check-in: ' . $e->getMessage()]);
}
?>