<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "db_hmmi";

$koneksi = mysqli_connect($host, $username, $password, $database);

if (mysqli_connect_errno()) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Koneksi database gagal: ' . mysqli_connect_error()
    ]);
    exit();
}

mysqli_set_charset($koneksi, "utf8");
?>