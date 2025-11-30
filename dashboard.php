<?php
    include_once __DIR__ . '/functions/global.php';

    if (!checkLogin()) {
        header('Location: index.php');
        exit;
    }

    echo $_SESSION['user_role'];

?>