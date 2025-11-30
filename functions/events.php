<?php
include_once __DIR__ . '/../config/connect.php';

function createEvent($title, $description, $event_date, $created_by) {
    global $koneksi;
    
    $stmt = mysqli_prepare($koneksi, "INSERT INTO events (title, description, event_date, created_by) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "sssi", $title, $description, $event_date, $created_by);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success', 'message' => 'Event berhasil dibuat']);
        return true;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal membuat event']);
        return false;
    }
}

function getEvents() {
    global $koneksi;
    $result = mysqli_query($koneksi, 
        "SELECT e.*, u.name AS creator_name 
         FROM events e 
         JOIN tbl_users u ON e.created_by = u.id 
         ORDER BY e.event_date DESC"
    );
    $events = [];
    while($row = mysqli_fetch_assoc($result)) {
        $events[] = $row;
    }
    return $events;
}

function getEventById($id) {
    global $koneksi;
    $stmt = mysqli_prepare($koneksi, "SELECT * FROM events WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_assoc($result);
}
?>