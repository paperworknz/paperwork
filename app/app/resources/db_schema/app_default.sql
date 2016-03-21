-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Mar 20, 2016 at 04:24 PM
-- Server version: 5.6.26
-- PHP Version: 7.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app_default`
--
CREATE DATABASE IF NOT EXISTS `{{schema}}` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `{{schema}}`;

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `clientID` int(8) NOT NULL,
  `name` varchar(64) NOT NULL,
  `address` varchar(64) NOT NULL,
  `email` varchar(128) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `notes` text NOT NULL,
  `date_created` datetime NOT NULL,
  `date_touched` datetime NOT NULL,
  `date_deleted` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `inv`
--

CREATE TABLE `inv` (
  `invID` int(8) NOT NULL,
  `name` varchar(64) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `date_created` datetime NOT NULL,
  `date_touched` datetime NOT NULL,
  `date_deleted` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `job`
--

CREATE TABLE `job` (
  `jobID` int(8) NOT NULL,
  `clientID` int(8) NOT NULL,
  `statusID` int(8) DEFAULT '1',
  `cacheID` int(8) NOT NULL,
  `name` varchar(64) NOT NULL,
  `notes` text NOT NULL,
  `date_created` datetime NOT NULL,
  `date_touched` datetime NOT NULL,
  `date_deleted` datetime NOT NULL,
  `date_invoiced` datetime NOT NULL,
  `date_completed` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `job_cache`
--

CREATE TABLE `job_cache` (
  `cacheID` int(8) NOT NULL,
  `content` mediumtext NOT NULL,
  `formjs` varchar(32) NOT NULL,
  `date_created` datetime NOT NULL,
  `date_touched` datetime NOT NULL,
  `date_deleted` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `job_form`
--

CREATE TABLE `job_form` (
  `formID` int(8) NOT NULL,
  `clientID` int(8) NOT NULL,
  `jobID` int(8) NOT NULL,
  `name` varchar(64) NOT NULL,
  `html` mediumtext NOT NULL,
  `json` text NOT NULL,
  `date_created` datetime NOT NULL,
  `date_touched` datetime NOT NULL,
  `date_deleted` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `job_form_templates`
--

CREATE TABLE `job_form_templates` (
  `templateID` int(8) NOT NULL,
  `name` varchar(32) NOT NULL,
  `content` mediumtext NOT NULL,
  `date_created` datetime NOT NULL,
  `date_touched` datetime NOT NULL,
  `date_deleted` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `job_status`
--

CREATE TABLE `job_status` (
  `statusID` int(8) NOT NULL,
  `name` varchar(64) NOT NULL,
  `date_created` datetime NOT NULL,
  `date_touched` datetime NOT NULL,
  `date_deleted` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `settingsID` int(8) NOT NULL,
  `email_email` varchar(128) NOT NULL,
  `email_password` varchar(128) NOT NULL,
  `email_smtp` varchar(32) NOT NULL,
  `email_protocol` varchar(8) NOT NULL,
  `email_port` int(8) NOT NULL,
  `date_created` datetime NOT NULL,
  `date_touched` datetime NOT NULL,
  `date_deleted` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`clientID`);

--
-- Indexes for table `inv`
--
ALTER TABLE `inv`
  ADD PRIMARY KEY (`invID`);

--
-- Indexes for table `job`
--
ALTER TABLE `job`
  ADD PRIMARY KEY (`jobID`);

--
-- Indexes for table `job_cache`
--
ALTER TABLE `job_cache`
  ADD PRIMARY KEY (`cacheID`);

--
-- Indexes for table `job_form`
--
ALTER TABLE `job_form`
  ADD PRIMARY KEY (`formID`);

--
-- Indexes for table `job_form_templates`
--
ALTER TABLE `job_form_templates`
  ADD PRIMARY KEY (`templateID`);

--
-- Indexes for table `job_status`
--
ALTER TABLE `job_status`
  ADD PRIMARY KEY (`statusID`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`settingsID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `clientID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `inv`
--
ALTER TABLE `inv`
  MODIFY `invID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=495;
--
-- AUTO_INCREMENT for table `job`
--
ALTER TABLE `job`
  MODIFY `jobID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1037;
--
-- AUTO_INCREMENT for table `job_cache`
--
ALTER TABLE `job_cache`
  MODIFY `cacheID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `job_form`
--
ALTER TABLE `job_form`
  MODIFY `formID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=171;
--
-- AUTO_INCREMENT for table `job_form_templates`
--
ALTER TABLE `job_form_templates`
  MODIFY `templateID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `job_status`
--
ALTER TABLE `job_status`
  MODIFY `statusID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `settingsID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
