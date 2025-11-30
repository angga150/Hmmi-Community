<?php
include_once __DIR__ . '/../config/connect.php';

function createUser($name, $email, $password, $role = 'anggota') {
    global $koneksi;
    
    // Validasi input
    if (empty($name) || empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Semua field harus diisi']);
        return false;
    }
    
    // Cek email sudah ada
    $stmt = mysqli_prepare($koneksi, "SELECT id FROM tbl_users WHERE email = ?");
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if (mysqli_num_rows($result) > 0) {
        $data = ["status" => "error", "message" => "Email sudah terdaftar"];
        // echo json_encode($data);
        return $data;
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert user
    $stmt = mysqli_prepare($koneksi, "INSERT INTO tbl_users (name, email, password, role) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "ssss", $name, $email, $hashedPassword, $role);
    
    if (mysqli_stmt_execute($stmt)) {
        $data = ["status" => "success", "message" => "User berhasil dibuat"];
        // echo json_encode($data);
        return $data;
    } else {
        $data = ["status" => "error", "message" => "Gagal membuat user"];
        // echo json_encode($data);
        return $data;
    }
}

function loginUser($email, $password) {
    global $koneksi;
    
    $stmt = mysqli_prepare($koneksi, "SELECT * FROM tbl_users WHERE email = ?");
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);
    
    if ($user && password_verify($password, $user['password'])) {
        // Hapus password dari response
        unset($user['password']);
        return $user;
    }
    return false;
}

function getAllUsers() {
    global $koneksi;
    $result = mysqli_query($koneksi, "SELECT id, name, email, role, created_at FROM tbl_users");
    $users = [];
    while($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }
    return $users;
}

function getUserById($id) {
    global $koneksi;
    $stmt = mysqli_prepare($koneksi, "SELECT id, name, email, role, created_at FROM tbl_users WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_assoc($result);
}
?>