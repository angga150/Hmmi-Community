<?php
    session_start();
    // Include semua functions
    include_once __DIR__ . '/../functions/events.php';
    include_once __DIR__ . '/../functions/users.php';
    include_once __DIR__ . '/../functions/attendance.php';
    include_once __DIR__ . '/../functions/meetings.php';
    include_once __DIR__ . '/../functions/posts.php';

    function checkLogin(){
        return isset($_SESSION['user_id']);
    }

    function isAdmin(){
        return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
    }

?>