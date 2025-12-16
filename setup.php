<?php
define("USER_DATA", __DIR__ . "/data/user/users.json");
define("MEETING_DATA", __DIR__ . "/data/meeting/meetings.json");

function setup_user()
{
    $today = date("d-m-Y");

    $admin_data[24012217] = 
        [
            "name" => "Ihsan Baihaqi",
            "role" => "admin",
            "mail" => "admin@ihsan.com",
            "pass" => "admin123",
            "absen" => [
                $today => [
                    "status" => 1,
                    "keterangan" => ""
                ]
            ],
            "created_at" => $today,
            "updated_at" => $today,
            "updated_by" => ""
        ]
    ;

    if (!file_exists(USER_DATA)) {
        file_put_contents(USER_DATA, json_encode($admin_data, JSON_PRETTY_PRINT));
    }
}

function setup_meeting()
{
    $today = date("d-m-Y");

    $meeting_data = [
        [
            "image" => "",
            "tittle" => "Meeting 1",
            "desc" => "Belajar CSS",
            "room" => "Lab 1",
            "date" => $today,
            "start_time" => "08:00",
            "end_time" => "09:00",
            "created_at" => $today,
            "updated_at" => $today,
            "updated_by" => ""
        ]
    ];

    if (!file_exists(MEETING_DATA)) {
        file_put_contents(MEETING_DATA, json_encode($meeting_data, JSON_PRETTY_PRINT));
    }
}

setup_user();
setup_meeting();

function readJSON($file){
    if(!file_exists($file)){
        return [];
    }
    $data = file_get_contents($file);
    return json_decode($data, true) ?: [];
}

function getUsers($nim = false){
    $users = readJSON(USER_DATA);
    if ($nim) {
        return $users[$nim] ?? false;
    }
    return $users;
}



function getMeetings($id = false){
    $meetings = readJSON(MEETING_DATA);
    if ($id){
        return $meetings[$id];
    }
    return $meetings;
}
?>
