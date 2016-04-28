-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Apr 27, 2016 at 10:36 PM
-- Server version: 5.6.26
-- PHP Version: 7.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `{{database}}`
--
CREATE DATABASE IF NOT EXISTS `{{database}}` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `{{database}}`;

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

--
-- Dumping data for table `job_form_templates`
--

INSERT INTO `job_form_templates` (`templateID`, `name`, `content`, `date_created`, `date_touched`, `date_deleted`) VALUES
(1, 'Quote', '<style>\r\n	.pw-form {position:relative;background-color:white;font-size:13px;}\r\n	.pw-form li {list-style-type:none}\r\n	header, footer, row {display:table}\r\n	column {padding: 2px 10px}\r\n	row, column {float:left}\r\n</style>\r\n<style>\r\n	.qq-item {padding:0px 6px}\r\n	.qq-qty, .qq-price, .qq-total {\r\n		width: 70px;\r\n		text-align: center;\r\n		height:24px;\r\n		line-height:24px;\r\n		outline:0\r\n	}\r\n	.blob_item {border-right: 1px solid black;border-left: 1px solid black;line-height:24px;height:24px;}\r\n	.blob_item, .blob_item div {page-break-inside:avoid!important;}\r\n	@media print {.blob_item, .blob_item div {page-break-inside:avoid!important}}\r\n	.qq-left {border-left: 1px solid black;}\r\n	.ta {z-index:1;width:100%;border-top:1px solid #333;border-left:1px solid #333;border-right:1px solid #333;}\r\n	.typeahead {border:1px solid white;width:100%;outline:0}\r\n	.twitter-typeahead {border-bottom:1px dashed #999}\r\n</style>\r\n<section class="pw-form" style="position:relative;background-color:white;font-size:13px;" >\r\n	<header style="width:100%;display:table;" >\r\n		<div  form-logo style="float:left;" ></div>\r\n		<div style="float:right;" >\r\n			<div class="h2"  contenteditable form-type style="padding-left:10px;" >QUOTE</div>\r\n		</div>\r\n	</header>\r\n	<header style="width:100%;display:table;" >\r\n		<div style="float:left;" >\r\n			<div  contenteditable style="font-weight:600;min-width:160px;" >\r\n				{{user.company}}</br>\r\n				{{user.first}} {{user.last}}<br>\r\n				{{user.phone}}<br>\r\n				{{user.email}}\r\n			</div>\r\n		</div>\r\n		<div style="float:right;" >\r\n			<section>\r\n				<ul style="float:left;text-align:right;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;" >\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;list-style-type:none;" >Date</li>\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;list-style-type:none;" >Reference</li>\r\n				</ul>\r\n				<ul style="float:left;text-align:right;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;" >\r\n					<li  contenteditable form-date style="border-width:1px;border-style:solid;border-color:black;padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;text-align:center;min-width:86px;list-style-type:none;" ></li>\r\n					<li  contenteditable form-jobID style="border-width:1px;border-style:solid;border-color:black;border-top-style:none;padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;text-align:center;min-width:86px;list-style-type:none;" ></li>\r\n				</ul>\r\n			</section>\r\n		</div>\r\n	</header>\r\n	<section style="width:50%;padding-top:15px;" >\r\n		<header style="width:100%;display:table;" >\r\n			<span  contenteditable style="text-align:center;width:100%;display:block;background-color:#c4dff6;font-weight:600;border-width:1px;border-style:solid;border-color:black;" >CUSTOMER</span>\r\n		</header>\r\n		<section  contenteditable form-clientblob style="width:100%;border-width:1px;border-style:solid;border-color:black;border-top-style:none;text-align:center;padding-top:2px;padding-bottom:2px;padding-right:2px;padding-left:2px;display:block;" >\r\n			<br><br>\r\n		</section>\r\n	</section>\r\n	<section style="width:100%;padding-top:15px;" >\r\n		<header style="width:100%;display:table;" >\r\n			<span  contenteditable style="text-align:center;width:100%;display:block;background-color:#c4dff6;font-weight:600;border-width:1px;border-style:solid;border-color:black;" >JOB DESCRIPTION</span>\r\n		</header>\r\n		<section  contenteditable form-jobd style="width:100%;border-width:1px;border-style:solid;border-color:black;border-top-style:none;text-align:left;padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;display:block;" >\r\n			<br>\r\n		</section>\r\n	</section>\r\n	<section style="width:100%;padding-top:15px;" >\r\n		<div style="border-width:1px;border-style:solid;border-color:black;font-size:11px;font-weight:600;" >\r\n			<div style="text-align:center;float:right;background-color:#c4dff6;min-width:71px;border-left-width:1px;border-left-style:solid;border-left-color:black;height:20px;line-height:20px;" >TOTAL</div>\r\n			<div style="text-align:center;float:right;background-color:#c4dff6;min-width:71px;border-left-width:1px;border-left-style:solid;border-left-color:black;height:20px;line-height:20px;" >UNIT PRICE</div>\r\n			<div style="text-align:center;float:right;background-color:#c4dff6;min-width:71px;border-left-width:1px;border-left-style:solid;border-left-color:black;height:20px;line-height:20px;" >QTY UNIT</div>\r\n			<div style="text-align:center;background-color:#c4dff6;width:auto;overflow:hidden;height:20px;line-height:20px;" >CONTRACTORS & MATERIALS</div>\r\n		</div>\r\n		<div  form-inventory style="position:relative;margin-top:-1px;" ></div>\r\n		<div form-content></div>\r\n	</section>\r\n	<footer style="width:100%;padding-top:15px;display:table;" >\r\n		<div style="float:left;width:410px;font-size:11px;" >\r\n			<header style="width:100%;display:table;" >\r\n				<span  contenteditable style="text-align:center;width:100%;display:block;background-color:#c4dff6;border-width:1px;border-style:solid;border-color:black;" >TERMS & CONDITIONS</span>\r\n			</header>\r\n			<section  contenteditable style="width:100%;border-width:1px;border-style:solid;border-color:black;border-top-style:none;text-align:left;padding-top:2px;padding-bottom:2px;padding-right:2px;padding-left:2px;display:block;" >\r\n				<div><br></div>\r\n			</section>\r\n		</div>\r\n		<div style="float:right;margin-top:10px;margin-bottom:0px;margin-right:0px;margin-left:10px;" >\r\n			<section>\r\n				<ul style="float:left;text-align:right;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;" >\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;list-style-type:none;" >Sub Total</li>\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;list-style-type:none;" >GST</li>\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;font-weight:600;background-color:#c4dff6;border-width:1px;border-style:solid;border-color:black;list-style-type:none;" >TOTAL TO PAY</li>\r\n				</ul>\r\n				<ul style="float:left;text-align:right;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;" >\r\n					<li  form-subtotal style="padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;text-align:right;height:22px;min-width:100px;list-style-type:none;" ></li>\r\n					<li  form-tax style="padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;text-align:right;height:22px;list-style-type:none;" ></li>\r\n					<li  form-total style="border-width:1px;border-style:solid;border-color:black;border-left-style:none;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;text-align:right;height:24px;font-weight:600;list-style-type:none;" ></li>\r\n				</ul>\r\n			</section>\r\n		</div>\r\n	</footer>\r\n</section>', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'Invoice', '<style>\r\n	.pw-form {position:relative;background-color:white;font-size:13px;}\r\n	.pw-form li {list-style-type:none}\r\n	header, footer, row {display:table}\r\n	column {padding: 2px 10px}\r\n	row, column {float:left}\r\n</style>\r\n<style>\r\n	.qq-item {padding:0px 6px}\r\n	.qq-qty, .qq-price, .qq-total {\r\n		width: 70px;\r\n		text-align: center;\r\n		height:24px;\r\n		line-height:24px;\r\n		outline:0\r\n	}\r\n	.blob_item {border-right: 1px solid black;border-left: 1px solid black;line-height:24px;height:24px;}\r\n	.blob_item, .blob_item div {page-break-inside:avoid!important;}\r\n	@media print {.blob_item, .blob_item div {page-break-inside:avoid!important}}\r\n	.qq-left {border-left: 1px solid black;}\r\n	.ta {z-index:1;width:100%;border-top:1px solid #333;border-left:1px solid #333;border-right:1px solid #333;}\r\n	.typeahead {border:1px solid white;width:100%;outline:0}\r\n	.twitter-typeahead {border-bottom:1px dashed #999}\r\n</style>\r\n<section class="pw-form" style="position:relative;background-color:white;font-size:13px;" >\r\n	<header style="width:100%;display:table;" >\r\n		<div  form-logo style="float:left;" ></div>\r\n		<div style="float:right;" >\r\n			<div class="h2"  contenteditable form-type style="padding-left:10px;" >INVOICE</div>\r\n		</div>\r\n	</header>\r\n	<header style="width:100%;display:table;" >\r\n		<div style="float:left;" >\r\n			<div  contenteditable style="font-weight:600;min-width:160px;" >\r\n				{{user.company}}</br>\r\n				{{user.first}} {{user.last}}<br>\r\n				{{user.phone}}<br>\r\n				{{user.email}}\r\n			</div>\r\n		</div>\r\n		<div style="float:right;" >\r\n			<section>\r\n				<ul style="float:left;text-align:right;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;" >\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;list-style-type:none;" >Date</li>\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;list-style-type:none;" >Reference#</li>\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;list-style-type:none;" >GST#</li>\r\n				</ul>\r\n				<ul style="float:left;text-align:right;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;" >\r\n					<li  contenteditable form-date style="border-width:1px;border-style:solid;border-color:black;padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;text-align:center;min-width:86px;list-style-type:none;" ></li>\r\n					<li  contenteditable form-jobID style="border-width:1px;border-style:solid;border-color:black;border-top-style:none;padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;text-align:center;min-width:86px;list-style-type:none;" ></li>\r\n					<li  contenteditable style="border-width:1px;border-style:solid;border-color:black;border-top-style:none;padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;text-align:center;min-width:86px;list-style-type:none;" ></li>\r\n				</ul>\r\n			</section>\r\n		</div>\r\n	</header>\r\n	<section style="width:50%;padding-top:15px;" >\r\n		<header style="width:100%;display:table;" >\r\n			<span  contenteditable style="text-align:center;width:100%;display:block;background-color:#c4dff6;font-weight:600;border-width:1px;border-style:solid;border-color:black;" >CUSTOMER</span>\r\n		</header>\r\n		<section  contenteditable form-clientblob style="width:100%;border-width:1px;border-style:solid;border-color:black;border-top-style:none;text-align:center;padding-top:2px;padding-bottom:2px;padding-right:2px;padding-left:2px;display:block;" >\r\n			<br><br>\r\n		</section>\r\n	</section>\r\n	<section style="width:100%;padding-top:15px;" >\r\n		<header style="width:100%;display:table;" >\r\n			<span  contenteditable style="text-align:center;width:100%;display:block;background-color:#c4dff6;font-weight:600;border-width:1px;border-style:solid;border-color:black;" >JOB DESCRIPTION</span>\r\n		</header>\r\n		<section  contenteditable form-jobd style="width:100%;border-width:1px;border-style:solid;border-color:black;border-top-style:none;text-align:left;padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;display:block;" >\r\n			<br>\r\n		</section>\r\n	</section>\r\n	<section style="width:100%;padding-top:15px;" >\r\n		<div style="border-width:1px;border-style:solid;border-color:black;font-size:11px;font-weight:600;" >\r\n			<div style="text-align:center;float:right;background-color:#c4dff6;min-width:71px;border-left-width:1px;border-left-style:solid;border-left-color:black;height:20px;line-height:20px;" >TOTAL</div>\r\n			<div style="text-align:center;float:right;background-color:#c4dff6;min-width:71px;border-left-width:1px;border-left-style:solid;border-left-color:black;height:20px;line-height:20px;" >UNIT PRICE</div>\r\n			<div style="text-align:center;float:right;background-color:#c4dff6;min-width:71px;border-left-width:1px;border-left-style:solid;border-left-color:black;height:20px;line-height:20px;" >QTY UNIT</div>\r\n			<div style="text-align:center;background-color:#c4dff6;width:auto;overflow:hidden;height:20px;line-height:20px;" >CONTRACTORS & MATERIALS</div>\r\n		</div>\r\n		<div  form-inventory style="position:relative;margin-top:-1px;" ></div>\r\n		<div form-content></div>\r\n	</section>\r\n	<footer style="width:100%;padding-top:15px;display:table;" >\r\n		<div style="float:left;width:410px;font-size:11px;" >\r\n			<header style="width:100%;display:table;" >\r\n				<span  contenteditable style="font-weight:600;font-style:italic;display:block;padding-bottom:5px;" >\r\n					Details for Direct Crediting:<br>\r\n					Bank Account Name: {{user.first}} {{user.last}}<br>\r\n					Bank Account Number: <br>\r\n					Reference: <span form-jobID></span>\r\n				</span>\r\n				<span  contenteditable style="text-align:center;width:100%;display:block;background-color:#c4dff6;border-width:1px;border-style:solid;border-color:black;" >TERMS & CONDITIONS</span>\r\n			</header>\r\n			<section  contenteditable style="width:100%;border-width:1px;border-style:solid;border-color:black;border-top-style:none;text-align:left;padding-top:2px;padding-bottom:2px;padding-right:2px;padding-left:2px;display:block;" >\r\n				<div><br></div>\r\n			</section>\r\n		</div>\r\n		<div style="float:right;margin-top:10px;margin-bottom:0px;margin-right:0px;margin-left:10px;" >\r\n			<section>\r\n				<ul style="float:left;text-align:right;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;" >\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;list-style-type:none;" >Sub Total</li>\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;list-style-type:none;" >GST</li>\r\n					<li  contenteditable style="padding-top:2px;padding-bottom:2px;padding-right:10px;padding-left:10px;font-weight:600;background-color:#c4dff6;border-width:1px;border-style:solid;border-color:black;list-style-type:none;" >TOTAL TO PAY</li>\r\n				</ul>\r\n				<ul style="float:left;text-align:right;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;" >\r\n					<li  form-subtotal style="padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;text-align:right;height:22px;min-width:100px;list-style-type:none;" ></li>\r\n					<li  form-tax style="padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;text-align:right;height:22px;list-style-type:none;" ></li>\r\n					<li  form-total style="border-width:1px;border-style:solid;border-color:black;border-left-style:none;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;text-align:right;height:24px;font-weight:600;list-style-type:none;" ></li>\r\n				</ul>\r\n			</section>\r\n		</div>\r\n	</footer>\r\n</section>', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

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

--
-- Dumping data for table `job_status`
--

INSERT INTO `job_status` (`statusID`, `name`, `date_created`, `date_touched`, `date_deleted`) VALUES
(0, 'Completed', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(1, 'New', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

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
  MODIFY `clientID` int(8) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `inv`
--
ALTER TABLE `inv`
  MODIFY `invID` int(8) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `job`
--
ALTER TABLE `job`
  MODIFY `jobID` int(8) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `job_cache`
--
ALTER TABLE `job_cache`
  MODIFY `cacheID` int(8) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `job_form`
--
ALTER TABLE `job_form`
  MODIFY `formID` int(8) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `job_form_templates`
--
ALTER TABLE `job_form_templates`
  MODIFY `templateID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `job_status`
--
ALTER TABLE `job_status`
  MODIFY `statusID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `settingsID` int(8) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
