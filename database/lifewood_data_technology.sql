-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 17, 2025 at 05:49 AM
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
-- Database: `lifewood_data_technology`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `admin_pic` varchar(255) DEFAULT NULL,
  `admin_fname` varchar(50) NOT NULL,
  `admin_lname` varchar(50) NOT NULL,
  `admin_role` varchar(20) NOT NULL DEFAULT 'co_admin',
  `admin_email` varchar(255) NOT NULL,
  `admin_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `admin_pic`, `admin_fname`, `admin_lname`, `admin_role`, `admin_email`, `admin_password`) VALUES
(1, NULL, 'Davide', 'Ompokern', 'super_admin', 'david@gmail.com', '$2b$10$hwsD9STdbWbjmTaSPtkuwOhgzvGJl2iEetbDsqV9UBOtllRScQJhu');

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `app_id` int(11) NOT NULL,
  `app_fname` varchar(100) NOT NULL,
  `app_lname` varchar(100) NOT NULL,
  `app_address` text NOT NULL,
  `app_resume_path` varchar(255) NOT NULL,
  `app_email` varchar(100) NOT NULL,
  `app_phone` varchar(15) NOT NULL,
  `app_position` varchar(100) NOT NULL,
  `app_message` text DEFAULT NULL,
  `app_applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `app_status` varchar(20) NOT NULL DEFAULT 'pending',
  `app_approved_at` timestamp NULL DEFAULT NULL,
  `app_rejected_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`app_id`, `app_fname`, `app_lname`, `app_address`, `app_resume_path`, `app_email`, `app_phone`, `app_position`, `app_message`, `app_applied_at`, `app_status`, `app_approved_at`, `app_rejected_at`) VALUES
(25, 'June Vincent', 'Fullido', 'Taga Igop City', 'uploads\\1742173556657-Basnillo-Resume.pdf', 'juneigop@gmail.com', '9292292929', 'student', NULL, '2025-03-17 01:05:56', 'pending', NULL, NULL),
(26, 'Michael Bacalso', 'El Jordan', 'Taga NBA', 'uploads\\1742178231434-Basnillo-Resume.pdf', 'mikel@gmaili.com', '9292292229', 'student', NULL, '2025-03-17 02:23:51', 'pending', NULL, NULL),
(27, 'Donna', 'Paella', 'Taga Lifewood', 'uploads\\1742178928238-Basnillo-Resume.pdf', 'donnamy@gmail.com', '9292292229', 'developer', NULL, '2025-03-17 02:35:28', 'approved', '2025-03-17 02:36:03', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `admin_email` (`admin_email`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`app_id`),
  ADD UNIQUE KEY `app_email` (`app_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `app_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
