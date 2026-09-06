-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 15, 2026 at 01:45 AM
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
-- Database: `portfolio_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_me`
--

CREATE TABLE `about_me` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `resume_url` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `about_me`
--

INSERT INTO `about_me` (`id`, `title`, `subtitle`, `description`, `profile_image`, `resume_url`, `phone`, `email`, `location`, `linkedin_url`, `github_url`, `instagram_url`, `created_at`, `updated_at`) VALUES
(1, 'Kevin Syonin', 'Product Development Engineer | Robotics and IoT Innovator | Tech Entrepreneur.', 'I am a passionate technology professional dedicated to developing innovative solutions that bridge hardware and software. Currently pursuing my degree in Information Technology and Multimedia at President University, while actively building real-world projects in robotics, IoT systems, and intelligent automation.', NULL, NULL, '0895332606621', 'kevinsyonin.266@gmail.com', 'Central Jakarta, Jakarta, Indonesia', 'https://www.linkedin.com/in/kevin-syonin', 'https://github.com/HuangMingZhi0206', 'https://www.instagram.com/kevinsyonin/', '2026-01-06 09:07:10', '2026-01-06 12:07:35');

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `email`, `password`, `name`, `created_at`, `updated_at`) VALUES
(1, 'admin@kevinsyonin.com', '$2a$10$2MXUP25ZACBw/mL1thfFpuTYhodgaZkDnblyqyomOj9aKpEN16K9m', 'Kevin Syonin', '2026-01-06 09:07:10', '2026-01-06 09:23:20');

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `issuer` varchar(255) NOT NULL,
  `issue_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `credential_id` varchar(255) DEFAULT NULL,
  `credential_url` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certifications`
--

INSERT INTO `certifications` (`id`, `title`, `issuer`, `issue_date`, `expiry_date`, `credential_id`, `credential_url`, `image`, `description`, `order_index`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'IoT Device and Hardware Discovery - Samsung Innovation Campus Batch 7 Stage 2', 'dibimbing.id', '2025-11-01', NULL, '185SEIN-CC-SIC7IoT', NULL, '/uploads/certifications/1767718658601-439009630.jpg', 'Samsung Innovation Campus Batch 7 Stage 2 (2025-2026) Certificate of Completion. IoT Device and Hardware Discovery training supported by ibimbing. Successfully completed 24 hours of hands-on IoT learning including ESP32 setup, sensors, MQTT, Python dashboards, and mini IoT project. Final score: 82.13 with strong test performance (96.00).', 1, 1, '2026-01-06 16:51:25', '2026-01-06 16:57:38'),
(2, 'Code Kickstart Python Programming - Samsung Innovation Campus Batch 7 Stage 1', 'dibimbing.id', '2025-09-01', NULL, '0185SEIN-CC-SIC7CP', NULL, '/uploads/certifications/1767718660935-365721001.jpg', 'Samsung Innovation Campus Batch 7 (2025-2026) Certificate of Completion. Code Kickstart Python Programming Stage 1 training supported by ibimbing. Successfully completed 26 hours of comprehensive Python programming instruction including AI, prompting, and productivity hacks. Perfect score (100.00) in attendance, test results, and coding test.', 2, 1, '2026-01-06 16:51:34', '2026-01-06 16:57:40'),
(3, 'Silver Medal in IT and Robotics - World Invention Competition and Exhibition (WICE) 2025', 'Indonesian Young Scientist Association (IYSA)', '2025-09-01', NULL, 'WICE-2025-IT-ROBOTICS-SILVER', NULL, '/uploads/certifications/1767718669116-982339482.jpg', 'Awarded the Silver Medal in the IT and Robotics category at the World Invention Competition and Exhibition (WICE) 2025 for the project Automated waste management system with real time IoT and robotics monitoring. This online competition was held in Kota Damansara, Malaysia on September 12-15, 2025.', 3, 1, '2026-01-06 16:51:44', '2026-01-06 16:57:49'),
(4, 'Uji Kemahiran Berbahasa Indonesia (UKBI)', 'Badan Pengembangan dan Pembinaan Bahasa', '2025-08-01', NULL, 'SD-BB-1030348', NULL, '/uploads/certifications/1767718671811-400055141.jpg', 'Indonesian Language Proficiency Certification. This standardized test certifies proficiency in Indonesian language across listening, reading, writing, and speaking skills. UKBI is recognized for professional and academic credentials in Indonesia. Score: 544 (Madya).', 4, 1, '2026-01-06 16:51:53', '2026-01-06 16:57:51'),
(5, 'Junior Network Administrator - Digital Talent Scholarship 2025', 'Beasiswa Kementerian Komdigi', '2024-11-01', NULL, '19311269860-3/VSGA/BLSDM.Komdigi/2025', NULL, '/uploads/certifications/1767718677448-893429932.jpg', 'Vocational School Graduate Academy Digital Talent Scholarship Program. Comprehensive training in network administration, security, and system management. Successfully completed professional certification covering network infrastructure, security protocols, and IT operations.', 5, 1, '2026-01-06 16:52:03', '2026-01-06 16:57:57'),
(6, 'Brocade Certified Network Engineer (BCNE)', 'Badan Nasional Sertifikasi Profesi (BNSP)', '2024-04-01', '2027-04-01', '1565096012024', NULL, '/uploads/certifications/1767718680430-509739399.jpg', 'Advanced professional credential in network engineering with focus on Brocade technologies. Demonstrates expertise in enterprise network design, implementation, and management with industry-leading networking solutions. Valid for 3 years.', 6, 1, '2026-01-06 16:52:12', '2026-01-06 16:58:00'),
(7, 'October Digital Creativity 2023 - Finalist', 'SMK Mitra Industri MM2100', '2023-10-01', NULL, '1000/723/SMKIND.05/X/2023', NULL, '/uploads/certifications/1767718683087-752148825.jpg', 'Achieved finalist position in the October Digital Creativity 2023 competition in the field of robotics. Theme: Young Generation Leading Digital Innovation. Held in Bekasi, October 18, 2023.', 7, 1, '2026-01-06 16:52:22', '2026-01-06 16:58:03'),
(8, 'Back End Developer', 'Dicoding Indonesia', '2023-03-01', '2026-03-01', '81P289KN8POY', NULL, '/uploads/certifications/1767718687615-551037051.jpg', 'Comprehensive training in back-end development technologies including server-side programming, database management, and REST API development. This certification validates expertise in building robust and scalable backend systems.', 8, 1, '2026-01-06 16:52:31', '2026-01-06 16:58:07'),
(9, 'SAKSSI 2021 - Juara 3 Robotika', 'Pusat Layanan Pembiayaan Pendidikan Kemendikbud Ristek', '2021-12-01', NULL, '10290/D2/KP.04.00/2021', NULL, '/uploads/certifications/1767718693197-99886099.jpg', 'Won 3rd place in the 2021 Indonesian Vocational High School Student Competency Competition (Sayembara Kompetensi Siswa SMK Indonesia) in the field of robotics applications. Representing SMK Yadika 12 Depok, Jawa Barat.', 9, 1, '2026-01-06 16:52:48', '2026-01-06 16:58:13');

-- --------------------------------------------------------

--
-- Table structure for table `certification_media`
--

CREATE TABLE `certification_media` (
  `id` int(11) NOT NULL,
  `certification_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certification_media`
--

INSERT INTO `certification_media` (`id`, `certification_id`, `title`, `description`, `file_path`, `file_type`, `created_at`) VALUES
(3, 3, 'Silver Medal in IT and Robotics - WICE 2025', 'Awarded the Silver Medal in the IT and Robotics category at the World Invention Competition and Exhibition (WICE) 2025 for the project \"Automated waste management system with real time IoT and robotics monitoring.\" This online competition was held in Kota Damansara, Malaysia on September 12–15, 2025 and recognizes innovative solutions that integrate IoT and robotics to improve waste management efficiency and monitoring.', '/uploads/certifications/1767719655470-617059593.jpg', 'image/jpeg', '2026-01-06 17:14:15');

-- --------------------------------------------------------

--
-- Table structure for table `certification_skills`
--

CREATE TABLE `certification_skills` (
  `id` int(11) NOT NULL,
  `certification_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certification_skills`
--

INSERT INTO `certification_skills` (`id`, `certification_id`, `skill_id`) VALUES
(1, 1, 22),
(2, 2, 19),
(3, 3, 22),
(4, 3, 28),
(5, 3, 29),
(6, 4, 32),
(7, 4, 36),
(11, 5, 27),
(8, 5, 37),
(9, 5, 38),
(10, 5, 39),
(13, 6, 37),
(12, 6, 43),
(14, 6, 44),
(15, 7, 28),
(16, 7, 40),
(17, 8, 30),
(18, 9, 41),
(19, 9, 42);

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `institution` varchar(255) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `field_of_study` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `gpa` varchar(10) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`id`, `institution`, `degree`, `field_of_study`, `start_date`, `end_date`, `is_current`, `description`, `logo`, `gpa`, `order_index`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'President University', 'Bachelor of Informatic Engineer', 'Artificial Intelligence', '2024-08-01', NULL, 1, 'Currently pursuing a degree in Information Technology with focus on Artificial Intelligence and Multimedia.', '/uploads/education/1767700752229-34282051.png', NULL, 0, 1, '2026-01-06 11:44:38', '2026-01-06 11:59:12'),
(2, 'SMK Yadika 12', 'Vocational High School', 'Computer And Network Engineer', '2021-01-01', '2024-06-30', 0, 'Computer Systems Networking and Telecommunications program with focus on network engineering and technical skills.', '/uploads/education/1767700925509-560286301.png', NULL, 0, 1, '2026-01-06 11:44:38', '2026-01-06 12:02:05');

-- --------------------------------------------------------

--
-- Table structure for table `experiences`
--

CREATE TABLE `experiences` (
  `id` int(11) NOT NULL,
  `company` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `employment_type` varchar(50) DEFAULT 'Full-time',
  `location` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL,
  `company_logo` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `experiences`
--

INSERT INTO `experiences` (`id`, `company`, `position`, `employment_type`, `location`, `start_date`, `end_date`, `is_current`, `description`, `company_logo`, `order_index`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'PUMA Informatics', 'Chairperson', 'Full-time', 'North Cikarang, West Java, Indonesia', '2025-08-01', NULL, 1, 'Organizing all cabinet members and members outside the cabinet, and creating a work plan and timeline for the cabinet in 2025.', '/uploads/companies/1767700307312-17757592.png', 1, 1, '2026-01-06 11:42:30', '2026-01-06 11:51:47'),
(3, 'PUMA Informatics', 'PIC of Exhibition Elifair', 'Full-time', 'North Cikarang, West Java, Indonesia', '2025-03-01', NULL, 1, 'As the Person In Charge (PIC) for the Elifair Exhibition, I spearheaded the planning and execution of our annual IT project showcase for university students. I was responsible for the entire project lifecycle, from curating student projects and designing the exhibition layout to managing all operational logistics on the day of the event.', NULL, 2, 1, '2026-01-06 11:42:30', '2026-01-06 11:42:30'),
(4, 'PUMA Informatics', 'Creative Media', 'Part-time', 'North Cikarang, West Java, Indonesia', '2024-10-01', NULL, 1, 'Becoming a member of PUMA Informatics 2024-2025 as a Creative media member, such as documenting every event that takes place, creating designs for cabinet or event needs, summarizing Creative Design data.', '/uploads/companies/1767700319617-635634504.png', 3, 1, '2026-01-06 11:42:30', '2026-01-06 11:51:59'),
(5, 'PUMA Informatics', 'PIC of Documentation x Design Company Visit 2025', 'Full-time', 'North Cikarang, West Java, Indonesia', '2025-01-01', '2025-07-31', 0, 'As the Person In Charge (PIC) of Documentation and Design for the 2025 Company Visit, I led the end-to-end creative production for the event. I was responsible for developing the complete visual identity, creating all promotional materials such as posters and social media graphics.', NULL, 4, 1, '2026-01-06 11:42:46', '2026-01-06 11:42:46'),
(6, 'PUMA Informatics', 'Member of Liaison Officer Informatics Connect', 'Full-time', 'North Cikarang, West Java, Indonesia', '2024-10-01', '2025-03-31', 0, 'As a Liaison Officer for Informatics Connect, I served as the primary point of contact for building partnerships with other universities.', NULL, 5, 1, '2026-01-06 11:42:46', '2026-01-06 11:42:46'),
(7, 'PUMA Informatics', 'PIC of Documentation x Design Temu Alumni', 'Full-time', 'North Cikarang, West Java, Indonesia', '2024-10-01', '2025-02-28', 0, 'As a Staff of the MTDD Division for Temu Alumni 2025, I was responsible for creating the events visual identity and capturing its key moments.', NULL, 6, 1, '2026-01-06 11:42:46', '2026-01-06 11:42:46'),
(8, 'PUMA Informatics', 'PIC of MTDD Brainstormics 2024', 'Full-time', 'North Cikarang, West Java, Indonesia', '2024-10-01', '2024-12-31', 0, 'As an MTDD Staff for Brainstormics 2024, I designed all promotional materials for the event, including posters and social media content. I also handled video production, creating the final aftermovie.', NULL, 7, 1, '2026-01-06 11:42:46', '2026-01-06 11:42:46'),
(9, 'President University Badminton Club', 'Treasurer', 'Part-time', 'North Cikarang, West Java, Indonesia', '2025-08-01', NULL, 1, 'Managing financial operations and budget planning for the badminton club activities and events.', '/uploads/companies/1767717288632-579540898.png', 8, 1, '2026-01-06 11:42:59', '2026-01-06 16:34:48'),
(10, 'Google Developer Student Clubs UM', 'Support Team Manager', 'Part-time', 'Malang, East Java, Indonesia', '2024-12-01', NULL, 1, 'Helping to coordinate the team in developing a project, helping to find strategies for the progress of GDSC at the University of Malang, sharing the knowledge we have with members and the community.', '/uploads/companies/1767717391669-947908209.png', 9, 1, '2026-01-06 11:42:59', '2026-01-06 16:36:31'),
(11, 'President University Catholic Society (PUCatSo)', 'Multimedia', 'Part-time', 'North Cikarang, West Java, Indonesia', '2024-11-01', NULL, 1, 'Become a Multimedia Member at Pucatso (President University Catholic Society) in 2024-2025. Document every event at paleso, help prepare events and make a timeline summary for the next 1 year.', '/uploads/companies/1767717420267-67023572.png', 10, 1, '2026-01-06 11:43:13', '2026-01-06 16:37:00'),
(12, 'President University Catholic Society (PUCatSo)', 'Member of Public Relations RetRet Pucatso 2025', 'Full-time', 'North Cikarang, West Java, Indonesia', '2025-03-01', '2025-07-31', 0, 'As a member of the Public Relations team for RetRet Pucatso 2025, I was responsible for managing the events external communications and shaping its public image.', NULL, 11, 1, '2026-01-06 11:43:13', '2026-01-06 11:43:13'),
(13, 'President University Catholic Society (PUCatSo)', 'Member of MTDD Easter Pucatso 2025', 'Full-time', 'North Cikarang, West Java, Indonesia', '2025-01-01', '2025-05-31', 0, 'As a member of the Media, Technology, Design, and Documentation (MTDD) team for Easter Pucatso 2025, I helped create the visual and digital experience for the event.', NULL, 12, 1, '2026-01-06 11:43:13', '2026-01-06 11:43:13'),
(14, 'President University Robotics and Technology Club', 'Chairperson', 'Part-time', 'North Cikarang, West Java, Indonesia', '2024-10-01', NULL, 1, 'Organizing all cabinet members and members outside the cabinet, and creating a work plan and timeline for the cabinet in 2025. Creating collaborations outside of President University, such as with schools or companies.', '/uploads/companies/1767717521217-885756233.jpg', 13, 1, '2026-01-06 11:43:31', '2026-01-06 16:38:41'),
(15, 'President University Robotics and Technology Club', 'Founder', 'Part-time', 'North Cikarang, West Java, Indonesia', '2024-09-01', NULL, 1, 'As the founder of the robotics club at President University and starting from the beginning of building the club with our team.', '/uploads/companies/1767717516231-133418293.jpg', 14, 1, '2026-01-06 11:43:31', '2026-01-06 16:38:36'),
(16, 'President University Robotics and Technology Club', 'Workshop Robotics 2025 Supervisor', 'Full-time', 'North Cikarang, West Java, Indonesia', '2025-05-01', '2025-07-31', 0, 'As a Supervisor for Workshop Robotics 2025, organized by the President University Robotics and Technology Club, I led and directed the BOD division to achieve all event targets for 80 participants.', NULL, 15, 1, '2026-01-06 11:43:31', '2026-01-06 11:43:31'),
(17, 'digikids', 'Product Development Engineer', 'Full-time', 'West Java, Indonesia', '2024-06-01', '2024-11-30', 0, 'Research the latest Project Technology, create new programs and materials for teaching and also assemble robots using the latest technology.', '/uploads/companies/1767714654935-20920788.jpg', 16, 1, '2026-01-06 11:43:53', '2026-01-06 15:50:54'),
(18, 'Yayasan Abdi Karya (Yadika)', 'Robotics Leader', 'Full-time', 'Depok, West Java, Indonesia', '2021-09-01', '2024-07-31', 0, 'Organizing all robotics teams, taking care of weekly training schedules, creating project ideas, guiding members for competitions outside of school.', '/uploads/companies/1767704957630-704376021.png', 17, 1, '2026-01-06 11:43:53', '2026-01-06 13:09:17'),
(19, 'Al-Izhar Pondok Labu', 'Information Technology Support Specialist', 'Internship', 'Indonesia', '2023-01-01', '2023-05-31', 0, 'Organizing Network Systems for 4 main buildings and maintaining them on a regular basis, Logging goods in IT departments, Helping to solve problems in the school database system.', '/uploads/companies/1767704837535-412137500.png', 18, 1, '2026-01-06 11:43:53', '2026-01-06 13:07:17');

-- --------------------------------------------------------

--
-- Table structure for table `experience_highlights`
--

CREATE TABLE `experience_highlights` (
  `id` int(11) NOT NULL,
  `experience_id` int(11) NOT NULL,
  `highlight` text NOT NULL,
  `order_index` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `experience_media`
--

CREATE TABLE `experience_media` (
  `id` int(11) NOT NULL,
  `experience_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `experience_media`
--

INSERT INTO `experience_media` (`id`, `experience_id`, `title`, `description`, `file_path`, `file_type`, `created_at`) VALUES
(4, 12, 'Certificate', '', '/uploads/experiences/1767719776043-150024847.png', 'image/png', '2026-01-06 17:16:16');

-- --------------------------------------------------------

--
-- Table structure for table `experience_skills`
--

CREATE TABLE `experience_skills` (
  `id` int(11) NOT NULL,
  `experience_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `demo_url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `start_date` varchar(10) DEFAULT NULL,
  `end_date` varchar(10) DEFAULT NULL,
  `is_ongoing` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `short_description`, `image`, `demo_url`, `github_url`, `category`, `featured`, `order_index`, `is_active`, `created_at`, `updated_at`, `start_date`, `end_date`, `is_ongoing`) VALUES
(2, 'Nyctophobia: Industrial Escape Room Experience', 'Project Overview Nyctophobia is an immersive 3D escape room game developed using Roblox Studio. The game immerses players in a tense, abandoned industrial setting where they awaken as kidnapping victims with no memory, creating an immediate sense of vulnerability and urgency.', 'Immersive 3D escape room game in abandoned industrial setting', '/uploads/projects/1767978983128-230594793.jpg', '', '', 'Game', 1, 0, 1, '2026-01-09 17:14:02', '2026-01-09 17:25:54', '2025-11', '2025-12', 0),
(3, 'TaskFlow - Task Management Application', 'TaskFlow is a mobile application designed to help students and professionals effectively manage their assignments and daily tasks. Built with Flutter and Dart, featuring Clean UI with responsive layout.', 'Mobile app for task and assignment management', NULL, NULL, NULL, 'Mobile', 1, 0, 1, '2026-01-09 17:14:02', '2026-01-09 17:14:02', '2025-11', '2025-12', 0),
(4, 'Smart Waste Management System', 'We are creating a Car Robot based Smart Waste Management System that can be used in public and residential areas. The system is equipped with smart trash bins, control applications, and automated collection robots.', 'IoT-based smart waste collection robot system', NULL, NULL, NULL, 'IoT', 1, 0, 1, '2026-01-09 17:14:02', '2026-01-09 17:14:02', '2025-06', '2025-07', 0),
(5, 'MingZhi Virtual Tour', 'Virtual Campus Tour with Library Access is an interactive digital platform specifically designed to assist campuses in introducing the environment and facilities online, including direct access to the campus library system using 360 visual technology.', 'Interactive 360 virtual campus tour with library access', NULL, NULL, NULL, 'Web', 0, 0, 1, '2026-01-09 17:14:02', '2026-01-09 17:14:02', '2025-01', '2025-05', 0),
(6, 'Final 3D', 'Final 3D project showcasing 3D modeling and design skills.', '3D modeling and design project', NULL, NULL, NULL, 'Other', 0, 0, 1, '2026-01-09 17:17:24', '2026-01-09 17:17:24', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `project_media`
--

CREATE TABLE `project_media` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `media_url` varchar(500) NOT NULL,
  `media_type` varchar(50) DEFAULT 'image',
  `caption` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_media`
--

INSERT INTO `project_media` (`id`, `project_id`, `media_url`, `media_type`, `caption`, `order_index`, `created_at`) VALUES
(1, 2, '/uploads/projects/1767979554307-463165346.jpg', 'image', NULL, 1, '2026-01-09 17:25:54'),
(2, 2, '/uploads/projects/1767979554353-303616371.jpg', 'image', NULL, 2, '2026-01-09 17:25:54');

-- --------------------------------------------------------

--
-- Table structure for table `project_technologies`
--

CREATE TABLE `project_technologies` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `technology` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_technologies`
--

INSERT INTO `project_technologies` (`id`, `project_id`, `technology`) VALUES
(8, 3, 'Flutter'),
(9, 3, 'Dart'),
(10, 3, 'Mobile Application Development'),
(11, 3, 'User Interface Interface'),
(12, 3, 'State Management'),
(13, 4, 'Mobile Robotics'),
(14, 4, 'Information Technology Infrastructure'),
(15, 4, 'Robot Programming'),
(16, 4, 'Communication'),
(17, 4, 'Project Management'),
(18, 5, 'Leadership Development'),
(19, 5, 'Virtual Reality (VR)'),
(20, 5, 'Communication'),
(21, 5, 'Project Management'),
(22, 2, 'Roblox Studio'),
(23, 2, 'Game Design'),
(24, 2, 'Level Design'),
(25, 2, 'Lua (Programming Language)'),
(26, 2, '3D Modeling / Environment Design');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `proficiency` int(11) DEFAULT 80,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `name`, `category`, `proficiency`, `icon`, `color`, `order_index`, `is_active`, `created_at`, `updated_at`) VALUES
(19, 'Python', 'Programming', 90, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(20, 'C++', 'Programming', 85, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(21, 'JavaScript', 'Programming', 80, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(22, 'Internet of Things (IoT)', 'Technology', 90, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(23, 'ESP32', 'Hardware', 85, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(24, 'Arduino', 'Hardware', 90, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(25, 'Raspberry Pi', 'Hardware', 80, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(26, 'MQTT', 'Technology', 85, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(27, 'Network Engineering', 'Technology', 80, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(28, 'Robotics', 'Technology', 95, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(29, 'Waste Management', 'Domain', 75, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(30, 'Back-End Development', 'Programming', 85, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(31, 'Embedded Systems', 'Technology', 85, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(32, 'Communication', 'Soft Skills', 80, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(33, 'Graphic Design', 'Creative', 80, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(34, 'Leadership', 'Soft Skills', 90, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(35, 'Project Management', 'Soft Skills', 85, NULL, NULL, 0, 1, '2026-01-06 11:41:30', '2026-01-06 11:41:30'),
(36, 'Bahasa Indonesia', 'Language', 90, NULL, NULL, 0, 1, '2026-01-06 16:50:59', '2026-01-06 16:50:59'),
(37, 'Network Security', 'Networking', 80, NULL, NULL, 0, 1, '2026-01-06 16:50:59', '2026-01-06 16:50:59'),
(38, 'Network Administration', 'Networking', 80, NULL, NULL, 0, 1, '2026-01-06 16:50:59', '2026-01-06 16:50:59'),
(39, 'System Administration', 'Networking', 75, NULL, NULL, 0, 1, '2026-01-06 16:50:59', '2026-01-06 16:50:59'),
(40, 'Mobile Robotics', 'Robotics', 75, NULL, NULL, 0, 1, '2026-01-06 16:50:59', '2026-01-06 16:50:59'),
(41, 'Robot Programming', 'Robotics', 80, NULL, NULL, 0, 1, '2026-01-06 16:50:59', '2026-01-06 16:50:59'),
(42, 'Information Technology Infrastructure', 'IT', 75, NULL, NULL, 0, 1, '2026-01-06 16:50:59', '2026-01-06 16:50:59'),
(43, 'Engineering', 'General', 80, NULL, NULL, 0, 1, '2026-01-06 16:50:59', '2026-01-06 16:50:59'),
(44, 'Networking', 'Networking', 80, NULL, NULL, 0, 1, '2026-01-06 16:50:59', '2026-01-06 16:50:59'),
(45, 'English', 'Language', 75, '', '#6366f1', 0, 1, '2026-01-09 13:14:19', '2026-01-09 16:48:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_me`
--
ALTER TABLE `about_me`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `certification_media`
--
ALTER TABLE `certification_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `certification_id` (`certification_id`);

--
-- Indexes for table `certification_skills`
--
ALTER TABLE `certification_skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cert_skill` (`certification_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `experiences`
--
ALTER TABLE `experiences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `experience_highlights`
--
ALTER TABLE `experience_highlights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experience_id` (`experience_id`);

--
-- Indexes for table `experience_media`
--
ALTER TABLE `experience_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experience_id` (`experience_id`);

--
-- Indexes for table `experience_skills`
--
ALTER TABLE `experience_skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_exp_skill` (`experience_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_media`
--
ALTER TABLE `project_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `project_technologies`
--
ALTER TABLE `project_technologies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_me`
--
ALTER TABLE `about_me`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `certification_media`
--
ALTER TABLE `certification_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `certification_skills`
--
ALTER TABLE `certification_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `experiences`
--
ALTER TABLE `experiences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `experience_highlights`
--
ALTER TABLE `experience_highlights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `experience_media`
--
ALTER TABLE `experience_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `experience_skills`
--
ALTER TABLE `experience_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `project_media`
--
ALTER TABLE `project_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `project_technologies`
--
ALTER TABLE `project_technologies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certification_media`
--
ALTER TABLE `certification_media`
  ADD CONSTRAINT `certification_media_ibfk_1` FOREIGN KEY (`certification_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certification_skills`
--
ALTER TABLE `certification_skills`
  ADD CONSTRAINT `certification_skills_ibfk_1` FOREIGN KEY (`certification_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `certification_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `experience_highlights`
--
ALTER TABLE `experience_highlights`
  ADD CONSTRAINT `experience_highlights_ibfk_1` FOREIGN KEY (`experience_id`) REFERENCES `experiences` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `experience_media`
--
ALTER TABLE `experience_media`
  ADD CONSTRAINT `experience_media_ibfk_1` FOREIGN KEY (`experience_id`) REFERENCES `experiences` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `experience_skills`
--
ALTER TABLE `experience_skills`
  ADD CONSTRAINT `experience_skills_ibfk_1` FOREIGN KEY (`experience_id`) REFERENCES `experiences` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `experience_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_media`
--
ALTER TABLE `project_media`
  ADD CONSTRAINT `project_media_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_technologies`
--
ALTER TABLE `project_technologies`
  ADD CONSTRAINT `project_technologies_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
