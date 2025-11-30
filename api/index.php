<?php
session_start();
header('Content-Type: application/json');

// Include global functions
include_once __DIR__ . '/../functions/global.php';

// Handle both POST and GET requests
$method = $_SERVER['REQUEST_METHOD'];
$input = [];

// Get data based on request method
if ($method === 'POST') {
    $input = $_POST;
} elseif ($method === 'GET') {
    $input = $_GET;
}

// For JSON requests
if (empty($input) && isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
}

$action = $input['action'] ?? '';

switch ($action) {
    case 'create_user':
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        createUser($name, $email, $password);
        break;

    case 'login_user':
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $user = loginUser($email, $password);
        if ($user) {
            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['user_name'] = $user['name'];
            
            echo json_encode([
                'status' => 'success', 
                'message' => 'Login berhasil',
                'user' => $user
            ]);
        } else {
            echo json_encode([
                'status' => 'error', 
                'message' => 'Email atau password salah'
            ]);
        }
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['status' => 'success', 'message' => 'Logout berhasil']);
        break;

    case 'get_users':
        $users = getAllUsers();
        echo json_encode(['status' => 'success', 'data' => $users]);
        break;

    case 'create_event':
        $title = $input['title'] ?? '';
        $description = $input['description'] ?? '';
        $event_date = $input['event_date'] ?? '';
        $created_by = $input['created_by'] ?? $_SESSION['user_id'] ?? 0;
        createEvent($title, $description, $event_date, $created_by);
        break;

    case 'get_events':
        $events = getEvents();
        echo json_encode(['status' => 'success', 'data' => $events]);
        break;

    case 'create_meeting':
        $title = $input['title'] ?? '';
        $description = $input['description'] ?? '';
        $meeting_date = $input['meeting_date'] ?? '';
        $created_by = $input['created_by'] ?? $_SESSION['user_id'] ?? 0;
        createMeeting($title, $description, $meeting_date, $created_by);
        break;

    case 'get_meetings':
        $meetings = getMeetings();
        echo json_encode(['status' => 'success', 'data' => $meetings]);
        break;

    case 'create_attendance_session':
        $title = $input['title'] ?? '';
        $event_date = $input['event_date'] ?? '';
        $unique_code = bin2hex(random_bytes(4));
        $created_by = $input['created_by'] ?? $_SESSION['user_id'] ?? 0;
        createAttendanceSession($title, $event_date, $unique_code, $created_by);
        break;

    case 'get_attendance_sessions':
        $sessions = getAttendanceSessions();
        echo json_encode(['status' => 'success', 'data' => $sessions]);
        break;

    case 'check_in':
        $session_id = $input['session_id'] ?? '';
        $user_id = $input['user_id'] ?? $_SESSION['user_id'] ?? 0;
        checkIn($session_id, $user_id);
        break;

    case 'create_post':
        $content = $input['content'] ?? '';
        $user_id = $input['user_id'] ?? $_SESSION['user_id'] ?? 0;
        createPost($content, $user_id);
        break;

    case 'get_posts':
        $posts = getPosts();
        echo json_encode(['status' => 'success', 'data' => $posts]);
        break;

    case 'like_post':
        $post_id = $input['post_id'] ?? '';
        $user_id = $input['user_id'] ?? $_SESSION['user_id'] ?? 0;
        likePost($post_id, $user_id);
        break;

    case 'add_comment':
        $post_id = $input['post_id'] ?? '';
        $user_id = $input['user_id'] ?? $_SESSION['user_id'] ?? 0;
        $comment = $input['comment'] ?? '';
        addComment($post_id, $user_id, $comment);
        break;

    default:
        echo json_encode([
            'status' => 'error', 
            'message' => 'Action tidak valid',
            'available_actions' => [
                'create_user', 'login_user', 'logout', 'get_users',
                'create_event', 'get_events', 
                'create_meeting', 'get_meetings',
                'create_attendance_session', 'get_attendance_sessions', 'check_in',
                'create_post', 'get_posts', 'like_post', 'add_comment'
            ]
        ]);
}
?>