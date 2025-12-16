<?php
session_start();
require_once '../setup.php';

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    header('Location: ../login.php');
    exit;
}

$user = $_SESSION['user'];

// Sample meetings data
$meetings = [
    [
        'id' => 1,
        'title' => 'Rapat Proyek Akhir',
        'description' => 'Presentasi progress proyek akhir semester',
        'date' => '2024-12-25 14:00:00',
        'location' => 'Ruangan A301',
        'image' => 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
        'status' => 'upcoming', // upcoming, ongoing, finished
        'attendance_status' => 'none' // none, present, absent_with_reason
    ],
    [
        'id' => 2,
        'title' => 'Seminar Kewirausahaan',
        'description' => 'Seminar tentang startup dan bisnis digital',
        'date' => '2024-12-20 09:30:00',
        'location' => 'Auditorium Utama',
        'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w-400&h=300&fit=crop',
        'status' => 'ongoing',
        'attendance_status' => 'present'
    ],
    [
        'id' => 3,
        'title' => 'Workshop UI/UX Design',
        'description' => 'Pelatihan desain antarmuka pengguna',
        'date' => '2024-12-15 13:00:00',
        'location' => 'Lab Komputer 2',
        'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        'status' => 'finished',
        'attendance_status' => 'absent_with_reason'
    ],
    [
        'id' => 4,
        'title' => 'Rapat Koordinasi Himpunan',
        'description' => 'Koordinasi kegiatan himpunan mahasiswa',
        'date' => '2024-12-28 16:00:00',
        'location' => 'Sekretariat Himpunan',
        'image' => 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop',
        'status' => 'upcoming',
        'attendance_status' => 'none'
    ]
];

// Sample contacts data
$contacts = [
    ['name' => 'Prof. Ahmad Santoso', 'role' => 'Dosen Pembimbing', 'email' => 'ahmad@univ.ac.id'],
    ['name' => 'Dr. Siti Nurhaliza', 'role' => 'Koordinator Prodi', 'email' => 'siti@univ.ac.id'],
    ['name' => 'Budi Setiawan', 'role' => 'Ketua Himpunan', 'email' => 'budi@student.univ.ac.id'],
    ['name' => 'Ani Lestari', 'role' => 'Sekretaris Proyek', 'email' => 'ani@student.univ.ac.id'],
    ['name' => 'Admin Akademik', 'role' => 'Administrasi', 'email' => 'admin@univ.ac.id']
];

// Handle attendance submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['attendance_action'])) {
        $meetingId = $_POST['meeting_id'];
        $action = $_POST['attendance_action'];
        
        if ($action === 'present') {
            // Mark as present
            foreach ($meetings as &$meeting) {
                if ($meeting['id'] == $meetingId) {
                    $meeting['attendance_status'] = 'present';
                    break;
                }
            }
            $success_message = "Kehadiran berhasil dicatat!";
        } elseif ($action === 'absent' && isset($_POST['absence_reason'])) {
            $reason = trim($_POST['absence_reason']);
            if (!empty($reason)) {
                // Mark as absent with reason
                foreach ($meetings as &$meeting) {
                    if ($meeting['id'] == $meetingId) {
                        $meeting['attendance_status'] = 'absent_with_reason';
                        $meeting['absence_reason'] = $reason;
                        break;
                    }
                }
                $success_message = "Izin ketidakhadiran berhasil disimpan.";
            } else {
                $error_message = "Harap isi alasan ketidakhadiran.";
            }
        }
    }
}

// Get current page
$page = isset($_GET['page']) ? $_GET['page'] : 'home';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Student Portal</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #4361ee;
            --primary-dark: #3a0ca3;
            --secondary: #4cc9f0;
            --light: #f8f9fa;
            --dark: #212529;
            --gray: #6c757d;
            --gray-light: #e9ecef;
            --success: #2ecc71;
            --warning: #f8961e;
            --danger: #e74c3c;
            --info: #3498db;
            --border-radius: 10px;
            --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            --transition: all 0.3s ease;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f5f7fb;
            color: var(--dark);
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar Navigation */
        .sidebar {
            width: 260px;
            background: white;
            box-shadow: var(--shadow);
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100vh;
            z-index: 1000;
        }

        .logo-area {
            padding: 25px 20px;
            border-bottom: 1px solid var(--gray-light);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--primary);
            text-decoration: none;
            font-size: 1.5rem;
            font-weight: 700;
        }

        .logo i {
            font-size: 1.8rem;
        }

        .user-profile {
            padding: 25px 20px;
            text-align: center;
            border-bottom: 1px solid var(--gray-light);
        }

        .user-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            color: white;
            font-size: 2rem;
            font-weight: 600;
        }

        .user-info h3 {
            font-size: 1.2rem;
            margin-bottom: 5px;
            color: var(--dark);
        }

        .user-info p {
            color: var(--gray);
            font-size: 0.9rem;
            margin-bottom: 15px;
        }

        .user-role {
            display: inline-block;
            background: var(--gray-light);
            color: var(--dark);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .nav-menu {
            flex: 1;
            padding: 20px 0;
        }

        .nav-item {
            display: block;
            padding: 15px 25px;
            color: var(--dark);
            text-decoration: none;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 15px;
            font-weight: 500;
            border-left: 4px solid transparent;
        }

        .nav-item i {
            width: 20px;
            font-size: 1.2rem;
        }

        .nav-item:hover {
            background-color: rgba(67, 97, 238, 0.05);
            color: var(--primary);
        }

        .nav-item.active {
            background-color: rgba(67, 97, 238, 0.1);
            color: var(--primary);
            border-left-color: var(--primary);
        }

        .logout-area {
            padding: 20px;
            border-top: 1px solid var(--gray-light);
        }

        .btn-logout {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 12px;
            background: var(--gray-light);
            color: var(--dark);
            border: none;
            border-radius: var(--border-radius);
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
        }

        .btn-logout:hover {
            background: #ddd;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 260px;
            padding: 30px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 2rem;
            color: var(--dark);
        }

        .header-actions {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .notification-btn {
            position: relative;
            background: white;
            border: none;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: var(--shadow);
            color: var(--gray);
            transition: var(--transition);
        }

        .notification-btn:hover {
            color: var(--primary);
            transform: translateY(-2px);
        }

        .notification-badge {
            position: absolute;
            top: 5px;
            right: 5px;
            background: var(--danger);
            color: white;
            font-size: 0.7rem;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Page Content */
        .page-content {
            display: none;
        }

        .page-content.active {
            display: block;
            animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Home Page */
        .welcome-card {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            padding: 40px;
            border-radius: var(--border-radius);
            margin-bottom: 30px;
            box-shadow: var(--shadow);
        }

        .welcome-card h2 {
            font-size: 2.2rem;
            margin-bottom: 10px;
        }

        .welcome-card p {
            font-size: 1.1rem;
            opacity: 0.9;
            max-width: 600px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            gap: 20px;
            transition: var(--transition);
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: white;
        }

        .stat-icon.meetings {
            background: linear-gradient(135deg, var(--info), var(--primary));
        }

        .stat-icon.contacts {
            background: linear-gradient(135deg, var(--success), #27ae60);
        }

        .stat-icon.upcoming {
            background: linear-gradient(135deg, var(--warning), #e67e22);
        }

        .stat-info h3 {
            font-size: 1rem;
            color: var(--gray);
            margin-bottom: 5px;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--dark);
        }

        .upcoming-meetings-preview {
            background: white;
            border-radius: var(--border-radius);
            padding: 25px;
            box-shadow: var(--shadow);
        }

        .section-title {
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: var(--dark);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-title i {
            color: var(--primary);
        }

        .meetings-preview-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        /* Meetings Page */
        .meetings-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
        }

        .meeting-card {
            background: white;
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow);
            transition: var(--transition);
        }

        .meeting-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        .meeting-image {
            height: 180px;
            overflow: hidden;
        }

        .meeting-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .meeting-card:hover .meeting-image img {
            transform: scale(1.05);
        }

        .meeting-content {
            padding: 20px;
        }

        .meeting-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }

        .meeting-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--dark);
            margin-bottom: 5px;
        }

        .meeting-status {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .status-upcoming {
            background: rgba(52, 152, 219, 0.1);
            color: var(--info);
        }

        .status-ongoing {
            background: rgba(46, 204, 113, 0.1);
            color: var(--success);
        }

        .status-finished {
            background: rgba(108, 117, 125, 0.1);
            color: var(--gray);
        }

        .meeting-description {
            color: var(--gray);
            line-height: 1.5;
            margin-bottom: 20px;
            font-size: 0.95rem;
        }

        .meeting-details {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }

        .detail-item {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--dark);
            font-size: 0.9rem;
        }

        .detail-item i {
            width: 20px;
            color: var(--primary);
        }

        .countdown {
            background: rgba(67, 97, 238, 0.05);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
        }

        .countdown-label {
            font-size: 0.9rem;
            color: var(--gray);
            margin-bottom: 8px;
        }

        .countdown-timer {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary);
            font-family: 'Courier New', monospace;
        }

        .meeting-actions {
            display: flex;
            gap: 10px;
        }

        .btn-attend, .btn-absent {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-attend {
            background: var(--success);
            color: white;
        }

        .btn-attend:hover:not(:disabled) {
            background: #27ae60;
        }

        .btn-absent {
            background: var(--warning);
            color: white;
        }

        .btn-absent:hover:not(:disabled) {
            background: #e67e22;
        }

        .btn-attend:disabled, .btn-absent:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .attendance-status {
            padding: 10px 15px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            margin-top: 15px;
        }

        .status-present {
            background: rgba(46, 204, 113, 0.1);
            color: var(--success);
        }

        .status-absent {
            background: rgba(231, 76, 60, 0.1);
            color: var(--danger);
        }

        /* Contacts Page */
        .contacts-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
        }

        .contact-card {
            background: white;
            border-radius: var(--border-radius);
            padding: 25px;
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            gap: 20px;
            transition: var(--transition);
        }

        .contact-card:hover {
            transform: translateY(-5px);
        }

        .contact-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            font-weight: 600;
            flex-shrink: 0;
        }

        .contact-info h3 {
            font-size: 1.2rem;
            margin-bottom: 5px;
            color: var(--dark);
        }

        .contact-role {
            color: var(--primary);
            font-size: 0.9rem;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .contact-email {
            color: var(--gray);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        /* Modal for absence reason */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: var(--border-radius);
            width: 90%;
            max-width: 500px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .modal-title {
            font-size: 1.5rem;
            color: var(--dark);
        }

        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--gray);
            cursor: pointer;
            transition: var(--transition);
        }

        .close-modal:hover {
            color: var(--dark);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--dark);
        }

        .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--gray-light);
            border-radius: 8px;
            font-size: 1rem;
            transition: var(--transition);
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
        }

        .modal-actions {
            display: flex;
            gap: 10px;
            margin-top: 25px;
        }

        .btn-submit, .btn-cancel {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
        }

        .btn-submit {
            background: var(--warning);
            color: white;
        }

        .btn-submit:hover {
            background: #e67e22;
        }

        .btn-cancel {
            background: var(--gray-light);
            color: var(--dark);
        }

        .btn-cancel:hover {
            background: #ddd;
        }

        /* Alerts */
        .alert {
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .alert-success {
            background: rgba(46, 204, 113, 0.1);
            color: var(--success);
            border-left: 4px solid var(--success);
        }

        .alert-error {
            background: rgba(231, 76, 60, 0.1);
            color: var(--danger);
            border-left: 4px solid var(--danger);
        }

        /* Responsive */
        @media (max-width: 992px) {
            .sidebar {
                width: 70px;
                overflow: hidden;
            }
            
            .logo span, .user-profile, .nav-item span, .btn-logout span {
                display: none;
            }
            
            .logo {
                justify-content: center;
            }
            
            .nav-item {
                justify-content: center;
                padding: 15px;
            }
            
            .main-content {
                margin-left: 70px;
            }
        }

        @media (max-width: 768px) {
            .main-content {
                padding: 20px;
            }
            
            .header {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }
            
            .meetings-container, .contacts-container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Sidebar Navigation -->
    <div class="sidebar">
        <div class="logo-area">
            <a href="#" class="logo">
                <i class="fas fa-graduation-cap"></i>
                <span>HMMI Portal</span>
            </a>
        </div>
        
        <div class="user-profile">
            <div class="user-avatar">
                <?php echo strtoupper(substr($user['name'], 0, 2)); ?>
            </div>
            <div class="user-info">
                <h3><?php echo htmlspecialchars($user['name']); ?></h3>
                <p><?php echo htmlspecialchars($user['email']); ?></p>
                <span class="user-role"><?php echo htmlspecialchars($user['role']); ?></span>
            </div>
        </div>
        
        <div class="nav-menu">
            <a href="?page=home" class="nav-item <?php echo $page == 'home' ? 'active' : ''; ?>">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </a>
            <a href="?page=meetings" class="nav-item <?php echo $page == 'meetings' ? 'active' : ''; ?>">
                <i class="fas fa-calendar-alt"></i>
                <span>Meetings</span>
            </a>
            <a href="?page=contacts" class="nav-item <?php echo $page == 'contacts' ? 'active' : ''; ?>">
                <i class="fas fa-address-book"></i>
                <span>Contacts</span>
            </a>
        </div>
        
        <div class="logout-area">
            <button class="btn-logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </button>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
        <div class="header">
            <h1>
                <?php 
                switch($page) {
                    case 'home': echo 'Dashboard'; break;
                    case 'meetings': echo 'Meetings'; break;
                    case 'contacts': echo 'Contacts'; break;
                    default: echo 'Dashboard';
                }
                ?>
            </h1>
            <div class="header-actions">
                <button class="notification-btn">
                    <i class="fas fa-bell"></i>
                    <span class="notification-badge">3</span>
                </button>
            </div>
        </div>
        
        <!-- Success/Error Messages -->
        <?php if (isset($success_message)): ?>
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <?php echo htmlspecialchars($success_message); ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($error_message)): ?>
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                <?php echo htmlspecialchars($error_message); ?>
            </div>
        <?php endif; ?>
        
        <!-- Home Page -->
        <div id="home-page" class="page-content <?php echo $page == 'home' ? 'active' : ''; ?>">
            <div class="welcome-card">
                <h2>Welcome back, <?php echo htmlspecialchars($user['name']); ?>!</h2>
                <p>Here's what's happening with your academic activities today.</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon meetings">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Total Meetings</h3>
                        <div class="stat-value"><?php echo count($meetings); ?></div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon contacts">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Contacts</h3>
                        <div class="stat-value"><?php echo count($contacts); ?></div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon upcoming">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Upcoming Meetings</h3>
                        <div class="stat-value">
                            <?php 
                            $upcomingCount = 0;
                            foreach ($meetings as $meeting) {
                                if ($meeting['status'] == 'upcoming') $upcomingCount++;
                            }
                            echo $upcomingCount;
                            ?>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upcoming-meetings-preview">
                <h2 class="section-title">
                    <i class="fas fa-calendar-check"></i>
                    Upcoming Meetings
                </h2>
                <div class="meetings-preview-list">
                    <?php 
                    $upcomingMeetings = array_filter($meetings, function($meeting) {
                        return $meeting['status'] == 'upcoming';
                    });
                    
                    $upcomingMeetings = array_slice($upcomingMeetings, 0, 3);
                    
                    foreach ($upcomingMeetings as $meeting): 
                    ?>
                    <div class="meeting-card">
                        <div class="meeting-content">
                            <div class="meeting-header">
                                <h3 class="meeting-title"><?php echo htmlspecialchars($meeting['title']); ?></h3>
                                <span class="meeting-status status-upcoming">Upcoming</span>
                            </div>
                            <p class="meeting-description"><?php echo htmlspecialchars($meeting['description']); ?></p>
                            <div class="meeting-details">
                                <div class="detail-item">
                                    <i class="fas fa-calendar"></i>
                                    <span><?php echo date('F j, Y', strtotime($meeting['date'])); ?></span>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-clock"></i>
                                    <span><?php echo date('H:i', strtotime($meeting['date'])); ?></span>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span><?php echo htmlspecialchars($meeting['location']); ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        
        <!-- Meetings Page -->
        <div id="meetings-page" class="page-content <?php echo $page == 'meetings' ? 'active' : ''; ?>">
            <div class="meetings-container">
                <?php foreach ($meetings as $meeting): 
                    $meetingTime = strtotime($meeting['date']);
                    $currentTime = time();
                    $timeDiff = $meetingTime - $currentTime;
                    $statusClass = 'status-' . $meeting['status'];
                ?>
                <div class="meeting-card">
                    <div class="meeting-image">
                        <img src="<?php echo $meeting['image']; ?>" alt="<?php echo htmlspecialchars($meeting['title']); ?>">
                    </div>
                    
                    <div class="meeting-content">
                        <div class="meeting-header">
                            <h3 class="meeting-title"><?php echo htmlspecialchars($meeting['title']); ?></h3>
                            <span class="meeting-status <?php echo $statusClass; ?>">
                                <?php 
                                if ($meeting['status'] == 'upcoming') echo 'Upcoming';
                                elseif ($meeting['status'] == 'ongoing') echo 'Ongoing';
                                else echo 'Finished';
                                ?>
                            </span>
                        </div>
                        
                        <p class="meeting-description"><?php echo htmlspecialchars($meeting['description']); ?></p>
                        
                        <div class="meeting-details">
                            <div class="detail-item">
                                <i class="fas fa-calendar"></i>
                                <span><?php echo date('l, F j, Y', $meetingTime); ?></span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span><?php echo date('H:i', $meetingTime); ?></span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span><?php echo htmlspecialchars($meeting['location']); ?></span>
                            </div>
                        </div>
                        
                        <?php if ($meeting['status'] == 'upcoming' && $timeDiff > 0): ?>
                        <div class="countdown">
                            <div class="countdown-label">Starts in:</div>
                            <div class="countdown-timer" id="countdown-<?php echo $meeting['id']; ?>">
                                <!-- Countdown will be populated by JavaScript -->
                            </div>
                        </div>
                        <?php endif; ?>
                        
                        <?php if ($meeting['attendance_status'] == 'none' && $meeting['status'] != 'finished'): ?>
                        <div class="meeting-actions">
                            <form method="post" style="flex: 1;">
                                <input type="hidden" name="meeting_id" value="<?php echo $meeting['id']; ?>">
                                <input type="hidden" name="attendance_action" value="present">
                                <button type="submit" class="btn-attend">
                                    <i class="fas fa-check"></i> Hadir
                                </button>
                            </form>
                            
                            <button class="btn-absent" onclick="openAbsenceModal(<?php echo $meeting['id']; ?>, '<?php echo htmlspecialchars($meeting['title']); ?>')">
                                <i class="fas fa-user-clock"></i> Izin
                            </button>
                        </div>
                        <?php else: ?>
                        <div class="attendance-status <?php echo $meeting['attendance_status'] == 'present' ? 'status-present' : 'status-absent'; ?>">
                            <?php 
                            if ($meeting['attendance_status'] == 'present') {
                                echo '<i class="fas fa-check-circle"></i> Anda telah hadir';
                            } elseif ($meeting['attendance_status'] == 'absent_with_reason') {
                                echo '<i class="fas fa-clock"></i> Izin dengan alasan';
                            } else {
                                echo '<i class="fas fa-times-circle"></i> Belum memberikan konfirmasi';
                            }
                            ?>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        
        <!-- Contacts Page -->
        <div id="contacts-page" class="page-content <?php echo $page == 'contacts' ? 'active' : ''; ?>">
            <div class="contacts-container">
                <?php foreach ($contacts as $contact): 
                    $initials = '';
                    $nameParts = explode(' ', $contact['name']);
                    if (count($nameParts) >= 2) {
                        $initials = strtoupper($nameParts[0][0] . $nameParts[1][0]);
                    } else {
                        $initials = strtoupper(substr($contact['name'], 0, 2));
                    }
                ?>
                <div class="contact-card">
                    <div class="contact-avatar">
                        <?php echo $initials; ?>
                    </div>
                    <div class="contact-info">
                        <h3><?php echo htmlspecialchars($contact['name']); ?></h3>
                        <div class="contact-role"><?php echo htmlspecialchars($contact['role']); ?></div>
                        <div class="contact-email">
                            <i class="fas fa-envelope"></i>
                            <span><?php echo htmlspecialchars($contact['email']); ?></span>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    
    <!-- Absence Reason Modal -->
    <div id="absenceModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Alasan Ketidakhadiran</h3>
                <button class="close-modal" onclick="closeAbsenceModal()">&times;</button>
            </div>
            <form id="absenceForm" method="post">
                <input type="hidden" name="meeting_id" id="modalMeetingId">
                <input type="hidden" name="attendance_action" value="absent">
                
                <div class="form-group">
                    <label class="form-label" for="absence_reason">Alasan Izin *</label>
                    <textarea 
                        id="absence_reason" 
                        name="absence_reason" 
                        class="form-control" 
                        rows="5" 
                        placeholder="Mohon jelaskan alasan ketidakhadiran Anda..."
                        required
                    ></textarea>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="closeAbsenceModal()">Batal</button>
                    <button type="submit" class="btn-submit">Kirim Alasan</button>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (this.getAttribute('href') && this.getAttribute('href').startsWith('?')) {
                    e.preventDefault();
                    const page = this.getAttribute('href').split('=')[1];
                    window.location.href = `?page=${page}`;
                }
            });
        });
        
        // Logout button
        document.querySelector('.btn-logout').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'logout.php';
            }
        });
        
        // Countdown timers
        function updateCountdowns() {
            <?php foreach ($meetings as $meeting): 
                if ($meeting['status'] == 'upcoming'): 
                    $meetingTime = strtotime($meeting['date']);
            ?>
            const countdownElement = document.getElementById('countdown-<?php echo $meeting['id']; ?>');
            if (countdownElement) {
                const meetingTime = <?php echo $meetingTime; ?> * 1000;
                const now = new Date().getTime();
                const timeLeft = meetingTime - now;
                
                if (timeLeft > 0) {
                    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                    
                    if (days > 0) {
                        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m`;
                    } else {
                        countdownElement.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
                    }
                } else {
                    countdownElement.innerHTML = "Meeting started";
                    // Reload page to update meeting status
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                }
            }
            <?php endif; endforeach; ?>
        }
        
        // Update countdowns every second
        setInterval(updateCountdowns, 1000);
        updateCountdowns(); // Initial call
        
        // Absence modal functions
        function openAbsenceModal(meetingId, meetingTitle) {
            document.getElementById('modalMeetingId').value = meetingId;
            document.getElementById('absenceModal').classList.add('active');
            document.getElementById('absence_reason').focus();
            
            // Update modal title with meeting name
            document.querySelector('.modal-title').textContent = `Alasan Ketidakhadiran - ${meetingTitle}`;
        }
        
        function closeAbsenceModal() {
            document.getElementById('absenceModal').classList.remove('active');
            document.getElementById('absenceForm').reset();
        }
        
        // Close modal when clicking outside
        document.getElementById('absenceModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeAbsenceModal();
            }
        });
        
        // Notification button
        document.querySelector('.notification-btn').addEventListener('click', function() {
            alert('You have 3 new notifications:\n\n1. Meeting reminder: Rapat Proyek Akhir\n2. New message from Dr. Siti\n3. Assignment deadline approaching');
        });
    </script>
</body>
</html>