<?php
include_once __DIR__ . '/../config/connect.php';

function createAttendanceSession($title, $event_date, $unique_code, $created_by) {
    global $koneksi;
    
    $stmt = mysqli_prepare($koneksi, "INSERT INTO attendance_sessions (title, event_date, unique_code, created_by) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "sssi", $title, $event_date, $unique_code, $created_by);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            'status' => 'success', 
            'message' => 'Sesi absensi berhasil dibuat',
            'unique_code' => $unique_code
        ]);
        return true;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal membuat sesi absensi']);
        return false;
    }
}

function getAttendanceSessions() {
    global $koneksi;
    $result = mysqli_query($koneksi, 
        "SELECT s.*, u.name as created_by_name 
         FROM attendance_sessions s 
         LEFT JOIN tbl_users u ON s.created_by = u.id 
         ORDER BY s.event_date DESC"
    );
    $sessions = [];
    while($row = mysqli_fetch_assoc($result)) {
        $sessions[] = $row;
    }
    return $sessions;
}

function checkIn($session_id, $user_id) {
    global $koneksi;
    
    // Pastikan tabel attendance_records ada
    mysqli_query($koneksi, "
        CREATE TABLE IF NOT EXISTS attendance_records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            session_id INT,
            check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES tbl_users(id),
            FOREIGN KEY (session_id) REFERENCES attendance_sessions(id),
            UNIQUE KEY unique_attendance (user_id, session_id)
        )
    ");
    
    // Cek apakah sudah check-in
    $stmt = mysqli_prepare($koneksi, "SELECT id FROM attendance_records WHERE user_id = ? AND session_id = ?");
    mysqli_stmt_bind_param($stmt, "ii", $user_id, $session_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if (mysqli_num_rows($result) > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Anda sudah check-in untuk sesi ini']);
        return false;
    }
    
    // Insert check-in
    $stmt = mysqli_prepare($koneksi, "INSERT INTO attendance_records (user_id, session_id) VALUES (?, ?)");
    mysqli_stmt_bind_param($stmt, "ii", $user_id, $session_id);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success', 'message' => 'Check-in berhasil']);
        return true;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal check-in']);
        return false;
    }
}

function getAttendanceRecords($session_id) {
    global $koneksi;
    $stmt = mysqli_prepare($koneksi, 
        "SELECT ar.*, u.name 
         FROM attendance_records ar 
         JOIN tbl_users u ON ar.user_id = u.id 
         WHERE ar.session_id = ?"
    );
    mysqli_stmt_bind_param($stmt, "i", $session_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $records = [];
    while($row = mysqli_fetch_assoc($result)) {
        $records[] = $row;
    }
    return $records;
}
?>