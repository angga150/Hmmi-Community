<?php
session_start();

require "setup.php";


$user = $_SESSION["user"] ?? false;
if ($user){
    if ($user["role"] == "admin") 
        header("Location: admin/");
    else
        header("Location: user/");
} else {
    header("Location: login.php");
    exit();
}

?>