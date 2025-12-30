<?php
require_once __DIR__ . '/../../../../config/database.php';
require_once __DIR__ . '/../../../../config/cors.php';
require_once __DIR__ . '/../../../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // GET /api/attendance/qrcode/{code} - Generate QR code image
    
    // Parse code from URL
    $requestUri = $_SERVER['REQUEST_URI'];
    $basePath = '/Hmmi-Community/backend/public/api/attendance/qrcode/';
    
    if (strpos($requestUri, $basePath) !== false) {
        $code = substr($requestUri, strlen($basePath));
        $code = trim($code, '/');
    } else {
        $code = $_GET['code'] ?? '';
    }
    
    if (empty($code)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Kode wajib diisi']);
        exit;
    }
    
    // Cek apakah ada QR code library
    if (!class_exists('QRcode')) {
        // Jika tidak ada, install dulu: composer require chillerlan/php-qrcode
        // Atau kita gunakan Google Charts API untuk simple version
        
        // Option 1: Google Charts API (no library needed)
        $qrData = json_encode([
            'session_code' => $code,
            'type' => 'attendance_checkin'
        ]);
        
        $encodedData = urlencode($qrData);
        $googleQRUrl = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" . $encodedData;
        
        // Redirect ke QR code
        header('Location: ' . $googleQRUrl);
        exit;
    }
    
    // Option 2: PHP QR Code Library (jika diinstall)
    require_once __DIR__ . '/../../../../vendor/phpqrcode/qrlib.php';
    
    $qrData = json_encode([
        'session_code' => $code,
        'type' => 'attendance_checkin',
        'timestamp' => time()
    ]);
    
    // Generate QR code
    header('Content-Type: image/png');
    QRcode::png($qrData, null, QR_ECLEVEL_L, 10);
    exit;
    
} elseif ($method === 'POST') {
    // POST /api/attendance/qrcode/scan - Scan QR code untuk check-in
    
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
    
    if (empty($input['qr_data'])) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'QR data wajib diisi']);
        exit;
    }
    
    // Decode QR data
    $qrData = json_decode($input['qr_data'], true);
    
    if (!$qrData || empty($qrData['session_code'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'QR code tidak valid']);
        exit;
    }
    
    $code = $qrData['session_code'];
    
    // Gunakan logic check-in yang sama dengan manual.php
    require_once __DIR__ . '/../checkin/manual.php';
    
    // Tapi kita perlu modifikasi agar bisa dipanggil dari sini
    // Alternatif: buat fungsi checkin yang reusable
    
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}