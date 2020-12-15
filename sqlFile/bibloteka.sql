-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 29, 2020 at 06:23 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.2.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bibloteka`
--

-- --------------------------------------------------------

--
-- Table structure for table `lexuesit`
--

CREATE TABLE `lexuesit` (
  `id` int(250) NOT NULL,
  `email` varchar(50) NOT NULL,
  `emri` varchar(40) NOT NULL,
  `emriLibrit` varchar(20) NOT NULL,
  `dataMarrjes` varchar(20) NOT NULL,
  `dataKthimit` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `librat`
--

CREATE TABLE `librat` (
  `id` int(250) NOT NULL,
  `emri` varchar(50) NOT NULL,
  `autori` varchar(50) NOT NULL,
  `sasia` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `librat`
--

INSERT INTO `librat` (`id`, `emri`, `autori`, `sasia`) VALUES
(1, 'iliada dhe odisea', 'homeri', 2),
(2, 'elon musk', 'ashlee vance', 1),
(3, 'darka e gabuar', 'ismail kadare', 3),
(4, 'epi i gilgameshit', '-', 1),
(5, 'nje elefant elegant', 'rudina cupi', 3),
(6, 'tregime te moqme shqiptare', 'mitrush kuteli', 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lexuesit`
--
ALTER TABLE `lexuesit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `librat`
--
ALTER TABLE `librat`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lexuesit`
--
ALTER TABLE `lexuesit`
  MODIFY `id` int(250) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `librat`
--
ALTER TABLE `librat`
  MODIFY `id` int(250) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
