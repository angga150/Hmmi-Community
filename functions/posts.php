<?php
include_once __DIR__ . '/../config/connect.php';

function createPost($content, $user_id, $image_path = null) {
    global $koneksi;
    
    $stmt = mysqli_prepare($koneksi, "INSERT INTO posts (user_id, content, image_path, created_at) VALUES (?, ?, ?, NOW())");
    mysqli_stmt_bind_param($stmt, "iss", $user_id, $content, $image_path);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success', 'message' => 'Post berhasil dibuat']);
        return true;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal membuat post']);
        return false;
    }
}

function getPosts() {
    global $koneksi;
    $result = mysqli_query($koneksi, 
        "SELECT p.*, u.name AS author 
         FROM posts p 
         JOIN tbl_users u ON p.user_id = u.id 
         ORDER BY p.created_at DESC"
    );
    $posts = [];
    while($row = mysqli_fetch_assoc($result)) {
        $posts[] = $row;
    }
    return $posts;
}

function likePost($post_id, $user_id) {
    global $koneksi;
    
    // Cek apakah sudah like
    $stmt = mysqli_prepare($koneksi, "SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?");
    mysqli_stmt_bind_param($stmt, "ii", $post_id, $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if (mysqli_num_rows($result) > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Anda sudah like post ini']);
        return false;
    }
    
    $stmt = mysqli_prepare($koneksi, "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)");
    mysqli_stmt_bind_param($stmt, "ii", $post_id, $user_id);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success', 'message' => 'Post berhasil di-like']);
        return true;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal like post']);
        return false;
    }
}

function addComment($post_id, $user_id, $comment) {
    global $koneksi;
    
    $stmt = mysqli_prepare($koneksi, "INSERT INTO post_comments (post_id, user_id, comment) VALUES (?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "iis", $post_id, $user_id, $comment);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success', 'message' => 'Komentar berhasil ditambahkan']);
        return true;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menambahkan komentar']);
        return false;
    }
}
?>