-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2025 at 03:30 AM
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
(2, NULL, 'Davide', 'Ompokern', 'super_admin', 'admin@gmail.com', '$2b$10$gly3Zf0hj/Jqoe.SMMdLweZxS0BOzK4eMuHiXGI73PLmsFEhF2/Bm');

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
(25, 'John', 'Doe', '123 Mabini Street, Barangay Malinis, Quezon City', 'uploads\\1742173556657-Basnillo-Resume.pdf', 'john.doe@gmail.com', '9392194920', 'Back-End Developer', NULL, '2025-05-28 01:05:56', 'approved', '2025-06-01 14:46:34', NULL),
(26, 'Jane', 'Doe', '456 Bonifacio Avenue, Barangay Bagong Buhay, Cebu City', 'uploads\\1742178231434-Basnillo-Resume.pdf', 'jane.doe@gmaili.com', '9292292229', 'Front-End Developer', NULL, '2025-05-30 02:23:51', 'rejected', '2025-06-01 14:42:09', NULL),
(49, 'Bob', 'Johnson', '123 M. J. Cuenco Avenue, Brgy. Mabolo Cebu City', 'uploads\\1748828275426-bob-johnson-resume.pdf', 'bob.johnson@gmail.com', '9121231238', 'Full-Stack Developer', 'I am very interested in this position and hope to be given the opportunity to prove myself by doing my best.', '2025-06-02 01:37:55', 'approved', '2025-06-02 01:40:51', NULL);

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
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `app_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
