-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 30, 2025 at 08:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_hmmi`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance_records`
--

CREATE TABLE `attendance_records` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `checkin_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_records`
--

INSERT INTO `attendance_records` (`id`, `session_id`, `user_id`, `checkin_time`) VALUES
(1, 2, 12, '2025-12-30 06:17:54'),
(2, 3, 12, '2025-12-30 06:54:19');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_sessions`
--

CREATE TABLE `attendance_sessions` (
  `id` int(11) NOT NULL,
  `title` varchar(64) NOT NULL,
  `event_date` date DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `meeting_id` int(11) DEFAULT NULL,
  `unique_code` varchar(64) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `max_attendees` int(11) DEFAULT NULL,
  `status` enum('active','closed','expired') DEFAULT 'active',
  `location` varchar(64) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_sessions`
--

INSERT INTO `attendance_sessions` (`id`, `title`, `event_date`, `event_id`, `meeting_id`, `unique_code`, `expires_at`, `max_attendees`, `status`, `location`, `created_by`, `created_at`) VALUES
(2, 'Absensi Workshop PHP', '2024-01-15', NULL, 1, 'TFJAG5M0', '2025-12-31 04:53:12', NULL, 'active', NULL, 11, '2025-12-30 04:53:12'),
(3, 'absensi belajar js', '2025-01-05', NULL, 2, 'CZVL1P04', '2025-12-31 06:41:10', NULL, 'active', NULL, 11, '2025-12-30 06:41:10');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(64) NOT NULL,
  `description` varchar(255) NOT NULL,
  `event_date` datetime NOT NULL,
  `event_date_only` date GENERATED ALWAYS AS (cast(`event_date` as date)) STORED,
  `status` enum('upcoming','ongoing','completed','cancelled','postponed') DEFAULT 'upcoming',
  `place` varchar(64) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `status`, `place`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Workshop PHP', 'Belajar PHP dasar', '2025-01-15 14:00:00', 'upcoming', 'Lab Komputer 1', 11, '2025-12-30 04:18:49', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `id` int(11) NOT NULL,
  `title` varchar(64) NOT NULL,
  `description` varchar(255) NOT NULL,
  `meeting_date` datetime DEFAULT NULL,
  `meeting_date_only` date GENERATED ALWAYS AS (cast(`meeting_date` as date)) STORED,
  `event_date` datetime DEFAULT NULL,
  `status` enum('upcoming','ongoing','completed','cancelled','postponed') DEFAULT 'upcoming',
  `place` varchar(64) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`id`, `title`, `description`, `meeting_date`, `event_date`, `status`, `place`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Workshop PHP', 'Belajar PHP dasar', '2025-01-15 14:00:00', NULL, 'upcoming', 'Lab Komputer 1', 11, '2025-12-30 04:32:37', NULL),
(2, 'Workshop Javascript', 'Belajar Javascript dasar', '2025-01-15 14:00:00', NULL, 'upcoming', 'Lab Komputer 1', 11, '2025-12-30 04:38:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `api_token` varchar(64) DEFAULT NULL,
  `token_expires_at` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `api_token`, `token_expires_at`, `created_at`, `updated_at`) VALUES
(11, 'admin', 'admin@gmail.com', '$2y$10$7gR0WnwmgNb5FNTl70zTR.gHDPQHFxTGLVmcePbajQu3WaJPx3k66', 'admin', '9a2a7e7432910d6c6ffc20dc8f9fd0ff7f2fcc24312d0fd6f812d1e7e735bf46', '2026-01-06 07:40:30', '2025-12-28 06:30:23', NULL),
(12, 'user', 'user@gmail.com', '$2y$10$pzP6iI8FYKe4XoH5xhGoeeqOvWEiGRtPuX7JRZN7bZMrxlsp/KF.G', 'user', 'b7cef5752878ad529eef6998574569fa89a0ead9f84c4a62312f55ebfc739ad9', '2026-01-06 07:35:48', '2025-12-28 06:32:46', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance_records`
--
ALTER TABLE `attendance_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendance_records_ibfk_1` (`session_id`),
  ADD KEY `attendance_records_ibfk_2` (`user_id`);

--
-- Indexes for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `meeting_id` (`meeting_id`),
  ADD KEY `attendance_sessions_ibfk_3` (`created_by`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `events_ibfk_1` (`created_by`),
  ADD KEY `idx_event_date` (`event_date_only`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_meeting_date` (`meeting_date_only`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance_records`
--
ALTER TABLE `attendance_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_records`
--
ALTER TABLE `attendance_records`
  ADD CONSTRAINT `attendance_records_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `attendance_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_records_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  ADD CONSTRAINT `attendance_sessions_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_sessions_ibfk_2` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_sessions_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
