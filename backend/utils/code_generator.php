<?php
function generateUniqueCode($length = 8) {
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $code = '';
    
    for ($i = 0; $i < $length; $i++) {
        $code .= $characters[rand(0, $charactersLength - 1)];
    }
    
    return $code;
}

function generateQRCodeData($sessionId, $code, $title = '') {
    $data = [
        'type' => 'attendance',
        'session_id' => $sessionId,
        'code' => $code,
        'title' => $title,
        'timestamp' => time(),
        'url' => 'https://yourdomain.com/checkin?code=' . $code
    ];
    
    return json_encode($data);
}

function validateCode($code) {
    // Code harus 6-12 karakter, alphanumeric
    return preg_match('/^[A-Z0-9]{6,12}$/', $code);
}
?>