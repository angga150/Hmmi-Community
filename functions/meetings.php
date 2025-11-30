<?php
include_once __DIR__ . '/../config/connect.php';

function createMeeting($title, $description, $meeting_date, $created_by) {
    global $koneksi;
    
    $stmt = mysqli_prepare($koneksi, "INSERT INTO meetings (title, description, meeting_date, created_by) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "sssi", $title, $description, $meeting_date, $created_by);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success', 'message' => 'Meeting berhasil dibuat']);
        return true;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal membuat meeting']);
        return false;
    }
}

function getMeetings() {
    global $koneksi;
    $result = mysqli_query($koneksi, 
        "SELECT m.*, u.name AS creator_name 
         FROM meetings m 
         JOIN tbl_users u ON m.created_by = u.id 
         ORDER BY m.meeting_date DESC"
    );
    $meetings = [];
    while($row = mysqli_fetch_assoc($result)) {
        $meetings[] = $row;
    }
    return $meetings;
}
?>