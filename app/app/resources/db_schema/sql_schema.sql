-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Feb 04, 2016 at 04:55 PM
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
  `date_touched` datetime NOT NULL
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
  `date_touched` datetime NOT NULL
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
  `date_touched` datetime NOT NULL
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
  `content` mediumtext NOT NULL,
  `date_created` datetime NOT NULL,
  `date_touched` datetime NOT NULL
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
  `date_touched` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `job_form_templates`
--

INSERT INTO `job_form_templates` (`templateID`, `name`, `content`, `date_created`, `date_touched`) VALUES
(1, 'Quote', '<style>\r\n.qq-item {line-height:22px;padding:0px 6px}\r\n.qq-qty, .qq-price {\r\n	width: 69px;\r\n	border: 0;\r\n	outline: none;\r\n	text-align: center;\r\n	line-height:22px;\r\n	height:22px;\r\n	padding:0;\r\n}\r\n.qq-total {\r\n	min-width: 70px;\r\n    border: 0;\r\n    outline: none;\r\n    text-align: center;\r\n    line-height: 22px;\r\n    height: 22px;\r\n}\r\n.ta {\r\n	position:absolute;\r\n	z-index:1;\r\n	margin-top:36px;\r\n	width:100%;\r\n	border-top:1px solid #333;\r\n	border-left:1px solid #333;\r\n	border-right:1px solid #333;\r\n}\r\n.wform li {list-style-type:none}\r\n</style>\r\n<div class="wform" style="width:650px;background-color:white;font-size:13px;font-family:''Helvetica Neue'', Helvetica, Arial, sans-serif;" >\r\n	<table style="width:100%;font-size:13px;background-color:white;" >\r\n		<tbody>\r\n			<tr>\r\n				<td colspan="2" style="font-size:13px;" >\r\n					<div class="h1 pull-right" contenteditable>QUOTE</div>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td colspan="2" style="font-size:13px;" >\r\n					<div class="pull-right" contenteditable><span style="color:#7f8c8d;" >#</span><span form-jobID>100</span></div>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td contenteditable style="font-size:13px;" >\r\n					<span style="color:#7f8c8d;" >To:</span><br>\r\n					<span form-clientblob>Cade Murphy</span>\r\n				</td>\r\n				<td  contenteditable style="text-align:right;font-size:13px;" >\r\n					<span style="color:#7f8c8d;" >Date: </span><span form-date>01/01/01</span>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td colspan="2" class="w" style="width:100%;font-size:13px;" >\r\n					<div class="pr" form-inventory style="position:relative;" >\r\n						<div class="ta" form-typeahead style="position:absolute;z-index:1;margin-top:36px;width:100%;border-top-width:1px;border-top-style:solid;border-top-color:#333;border-left-width:1px;border-left-style:solid;border-left-color:#333;border-right-width:1px;border-right-style:solid;border-right-color:#333;" >\r\n							<input class="typeahead tt" type="text" placeholder="Item" style="border-style:none;outline-style:none;width:100%;padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;" />\r\n						</div>\r\n					</div>\r\n					<div class="wrapper f0 br0 m15" form-itemlist style="margin-top:15px;font-size:0;border-top-width:1px;border-top-style:solid;border-top-color:black;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:black;border-left-width:1px;border-left-style:solid;border-left-color:black;" >\r\n						<table class="w" style="width:100%;font-size:13px;background-color:white;" >\r\n							<tbody>\r\n								<tr>\r\n									<td class="br" style="border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemname style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >CONTRACTORS & MATERIALS</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n									<td class="w7 br" style="width:70px;border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemqty style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >QTY UNIT</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n									<td class="w7 br" style="width:70px;border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemprice style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >UNIT PRICE</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n									<td class="w7 br" style="width:70px;border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemtotal style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >TOTAL</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n							</tbody>\r\n						</table>\r\n					</div>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td style="width:75%;font-size:13px;" >\r\n					<div class="tac" contenteditable style="font-size:11px!important;margin-top:10px;" >\r\n						<table style="font-size:11px!important;background-color:white;margin-top:5px;width:100%;" >\r\n							<tbody>\r\n								<tr class="ac bl uc" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;" >\r\n									<td class="bb w" style="border-width:1px;border-style:solid;border-color:#000;width:100%;font-size:11px!important;" >Terms and Conditions</td>\r\n								</tr>\r\n								<tr>\r\n									<td class="bb w" style="border-width:1px;border-style:solid;border-color:#000;width:100%;font-size:11px!important;padding-top:2px;padding-bottom:2px;padding-right:2px;padding-left:2px;" >\r\n										<br>\r\n									</td>\r\n								</tr>\r\n							</tbody>\r\n						</table>\r\n					</div>\r\n				</td>\r\n				<td class="vt" style="vertical-align:top;font-size:13px;" >\r\n					<table class="ar m90" style="margin-top:10px;text-align:right;margin-left:10px;font-size:13px;background-color:white;" >\r\n						<tbody>\r\n							<tr>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" >Sub Total</td>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" ><div form-subtotal></div></td>\r\n							</tr>\r\n							<tr>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" >GST</td>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" ><div form-tax></div></td>\r\n							</tr>\r\n							<tr>\r\n								<td class="b bb bl uc" style="font-size:12px;text-align:center;font-weight:600;border-width:1px;border-style:solid;border-color:#000;background-color:#ecf0f1;text-transform:uppercase;min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" >Total To Pay</td>\r\n								<td class="b bb" form-total style="font-weight:600;border-width:1px;border-style:solid;border-color:#000;min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" ></td>\r\n							</tr>\r\n						</tbody>\r\n					</table>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td colspan="2" style="font-size:13px;" >\r\n					<div  contenteditable style="text-align:center;" ><br><br>Thank you for your business!</div>\r\n				</td>\r\n			</tr>\r\n		</tbody>\r\n	</table>\r\n</div>', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'Estimate', '<style>\r\n.qq-item {line-height:22px;padding:0px 6px}\r\n.qq-qty, .qq-price {\r\n	width: 69px;\r\n	border: 0;\r\n	outline: none;\r\n	text-align: center;\r\n	line-height:22px;\r\n	height:22px;\r\n	padding:0;\r\n}\r\n.qq-total {\r\n	min-width: 70px;\r\n    border: 0;\r\n    outline: none;\r\n    text-align: center;\r\n    line-height: 22px;\r\n    height: 22px;\r\n}\r\n.ta {\r\n	position:absolute;\r\n	z-index:1;\r\n	margin-top:36px;\r\n	width:100%;\r\n	border-top:1px solid #333;\r\n	border-left:1px solid #333;\r\n	border-right:1px solid #333;\r\n}\r\n.wform li {list-style-type:none}\r\n</style>\r\n<div class="wform" style="width:650px;background-color:white;font-size:13px;font-family:''Helvetica Neue'', Helvetica, Arial, sans-serif;" >\r\n	<table style="width:100%;font-size:13px;background-color:white;" >\r\n		<tbody>\r\n			<tr>\r\n				<td colspan="2" style="font-size:13px;" >\r\n					<div class="h1 pull-right" contenteditable>ESTIMATE</div>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td colspan="2" style="font-size:13px;" >\r\n					<div class="pull-right" contenteditable><span style="color:#7f8c8d;" >#</span><span form-jobID>100</span></div>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td contenteditable style="font-size:13px;" >\r\n					<span style="color:#7f8c8d;" >To:</span><br>\r\n					<span form-clientblob>Cade Murphy</span>\r\n				</td>\r\n				<td  contenteditable style="text-align:right;font-size:13px;" >\r\n					<span style="color:#7f8c8d;" >Date: </span><span form-date>01/01/01</span>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td colspan="2" class="w" style="width:100%;font-size:13px;" >\r\n					<div class="pr" form-inventory style="position:relative;" >\r\n						<div class="ta" form-typeahead style="position:absolute;z-index:1;margin-top:36px;width:100%;border-top-width:1px;border-top-style:solid;border-top-color:#333;border-left-width:1px;border-left-style:solid;border-left-color:#333;border-right-width:1px;border-right-style:solid;border-right-color:#333;" >\r\n							<input class="typeahead tt" type="text" placeholder="Item" style="border-style:none;outline-style:none;width:100%;padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;" />\r\n						</div>\r\n					</div>\r\n					<div class="wrapper f0 br0 m15" form-itemlist style="margin-top:15px;font-size:0;border-top-width:1px;border-top-style:solid;border-top-color:black;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:black;border-left-width:1px;border-left-style:solid;border-left-color:black;" >\r\n						<table class="w" style="width:100%;font-size:13px;background-color:white;" >\r\n							<tbody>\r\n								<tr>\r\n									<td class="br" style="border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemname style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >CONTRACTORS & MATERIALS</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n									<td class="w7 br" style="width:70px;border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemqty style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >QTY UNIT</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n									<td class="w7 br" style="width:70px;border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemprice style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >UNIT PRICE</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n									<td class="w7 br" style="width:70px;border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemtotal style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >TOTAL</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n							</tbody>\r\n						</table>\r\n					</div>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td style="width:75%;font-size:13px;" >\r\n					<div class="tac" contenteditable style="font-size:11px!important;margin-top:10px;" >\r\n						<table style="font-size:11px!important;background-color:white;margin-top:5px;width:100%;" >\r\n							<tbody>\r\n								<tr class="ac bl uc" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;" >\r\n									<td class="bb w" style="border-width:1px;border-style:solid;border-color:#000;width:100%;font-size:11px!important;" >Terms and Conditions</td>\r\n								</tr>\r\n								<tr>\r\n									<td class="bb w" style="border-width:1px;border-style:solid;border-color:#000;width:100%;font-size:11px!important;padding-top:2px;padding-bottom:2px;padding-right:2px;padding-left:2px;" >\r\n										<br>\r\n									</td>\r\n								</tr>\r\n							</tbody>\r\n						</table>\r\n					</div>\r\n				</td>\r\n				<td class="vt" style="vertical-align:top;font-size:13px;" >\r\n					<table class="ar m90" style="margin-top:10px;text-align:right;margin-left:10px;font-size:13px;background-color:white;" >\r\n						<tbody>\r\n							<tr>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" >Sub Total</td>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" ><div form-subtotal></div></td>\r\n							</tr>\r\n							<tr>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" >GST</td>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" ><div form-tax></div></td>\r\n							</tr>\r\n							<tr>\r\n								<td class="b bb bl uc" style="font-size:12px;text-align:center;font-weight:600;border-width:1px;border-style:solid;border-color:#000;background-color:#ecf0f1;text-transform:uppercase;min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" >Total To Pay</td>\r\n								<td class="b bb" form-total style="font-weight:600;border-width:1px;border-style:solid;border-color:#000;min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" ></td>\r\n							</tr>\r\n						</tbody>\r\n					</table>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td colspan="2" style="font-size:13px;" >\r\n					<div  contenteditable style="text-align:center;" ><br><br>Thank you for your business!</div>\r\n				</td>\r\n			</tr>\r\n		</tbody>\r\n	</table>\r\n</div>', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'Invoice', '<style>\r\n.qq-item {line-height:22px;padding:0px 6px}\r\n.qq-qty, .qq-price {\r\n	width: 69px;\r\n	border: 0;\r\n	outline: none;\r\n	text-align: center;\r\n	line-height:22px;\r\n	height:22px;\r\n	padding:0;\r\n}\r\n.qq-total {\r\n	min-width: 70px;\r\n    border: 0;\r\n    outline: none;\r\n    text-align: center;\r\n    line-height: 22px;\r\n    height: 22px;\r\n}\r\n.ta {\r\n	position:absolute;\r\n	z-index:1;\r\n	margin-top:36px;\r\n	width:100%;\r\n	border-top:1px solid #333;\r\n	border-left:1px solid #333;\r\n	border-right:1px solid #333;\r\n}\r\n.wform li {list-style-type:none}\r\n</style>\r\n<div class="wform" style="width:650px;background-color:white;font-size:13px;font-family:''Helvetica Neue'', Helvetica, Arial, sans-serif;" >\r\n	<table style="width:100%;font-size:13px;background-color:white;" >\r\n		<tbody>\r\n			<tr>\r\n				<td colspan="2" style="font-size:13px;" >\r\n					<div class="h1 pull-right" contenteditable>INVOICE</div>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td colspan="2" style="font-size:13px;" >\r\n					<div class="pull-right" contenteditable><span style="color:#7f8c8d;" >#</span><span form-jobID>100</span></div>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td contenteditable style="font-size:13px;" >\r\n					<span style="color:#7f8c8d;" >To:</span><br>\r\n					<span form-clientblob>Cade Murphy</span>\r\n				</td>\r\n				<td  contenteditable style="text-align:right;font-size:13px;" >\r\n					<span style="color:#7f8c8d;" >Date: </span><span form-date>01/01/01</span>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td colspan="2" class="w" style="width:100%;font-size:13px;" >\r\n					<div class="pr" form-inventory style="position:relative;" >\r\n						<div class="ta" form-typeahead style="position:absolute;z-index:1;margin-top:36px;width:100%;border-top-width:1px;border-top-style:solid;border-top-color:#333;border-left-width:1px;border-left-style:solid;border-left-color:#333;border-right-width:1px;border-right-style:solid;border-right-color:#333;" >\r\n							<input class="typeahead tt" type="text" placeholder="Item" style="border-style:none;outline-style:none;width:100%;padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;" />\r\n						</div>\r\n					</div>\r\n					<div class="wrapper f0 br0 m15" form-itemlist style="margin-top:15px;font-size:0;border-top-width:1px;border-top-style:solid;border-top-color:black;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:black;border-left-width:1px;border-left-style:solid;border-left-color:black;" >\r\n						<table class="w" style="width:100%;font-size:13px;background-color:white;" >\r\n							<tbody>\r\n								<tr>\r\n									<td class="br" style="border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemname style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >CONTRACTORS & MATERIALS</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n									<td class="w7 br" style="width:70px;border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemqty style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >QTY UNIT</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n									<td class="w7 br" style="width:70px;border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemprice style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >UNIT PRICE</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n									<td class="w7 br" style="width:70px;border-right-width:1px;border-right-style:solid;border-right-color:black;" >\r\n										<ul class="f" form-itemtotal style="font-size:13px;-webkit-padding-start:0px!important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;" >\r\n											<li class="ac uc bl ihead" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;min-width:70px;font-size:11px;line-height:20px;height:20px;font-weight:600;list-style-type:none!important;" >TOTAL</li>\r\n											<li  form-itembuffer style="height:29px;list-style-type:none!important;" ></li>\r\n										</ul>\r\n									</td>\r\n							</tbody>\r\n						</table>\r\n					</div>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td style="width:75%;font-size:13px;" >\r\n					<div class="tac" contenteditable style="font-size:11px!important;margin-top:10px;" >\r\n						<table style="font-size:11px!important;background-color:white;margin-top:5px;width:100%;" >\r\n							<tbody>\r\n								<tr class="ac bl uc" style="text-align:center;background-color:#ecf0f1;text-transform:uppercase;" >\r\n									<td class="bb w" style="border-width:1px;border-style:solid;border-color:#000;width:100%;font-size:11px!important;" >Terms and Conditions</td>\r\n								</tr>\r\n								<tr>\r\n									<td class="bb w" style="border-width:1px;border-style:solid;border-color:#000;width:100%;font-size:11px!important;padding-top:2px;padding-bottom:2px;padding-right:2px;padding-left:2px;" >\r\n										<br>\r\n									</td>\r\n								</tr>\r\n							</tbody>\r\n						</table>\r\n					</div>\r\n				</td>\r\n				<td class="vt" style="vertical-align:top;font-size:13px;" >\r\n					<table class="ar m90" style="margin-top:10px;text-align:right;margin-left:10px;font-size:13px;background-color:white;" >\r\n						<tbody>\r\n							<tr>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" >Sub Total</td>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" ><div form-subtotal></div></td>\r\n							</tr>\r\n							<tr>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" >GST</td>\r\n								<td style="min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" ><div form-tax></div></td>\r\n							</tr>\r\n							<tr>\r\n								<td class="b bb bl uc" style="font-size:12px;text-align:center;font-weight:600;border-width:1px;border-style:solid;border-color:#000;background-color:#ecf0f1;text-transform:uppercase;min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" >Total To Pay</td>\r\n								<td class="b bb" form-total style="font-weight:600;border-width:1px;border-style:solid;border-color:#000;min-width:105px;padding-top:2px;padding-bottom:2px;padding-right:4px;padding-left:4px;" ></td>\r\n							</tr>\r\n						</tbody>\r\n					</table>\r\n				</td>\r\n			</tr>\r\n			<tr>\r\n				<td colspan="2" style="font-size:13px;" >\r\n					<div  contenteditable style="text-align:center;" ><br><br>Thank you for your business!</div>\r\n				</td>\r\n			</tr>\r\n		</tbody>\r\n	</table>\r\n</div>', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `job_status`
--

CREATE TABLE `job_status` (
  `statusID` int(8) NOT NULL,
  `name` varchar(64) NOT NULL,
  `date_created` datetime NOT NULL,
  `date_touched` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `job_status`
--

INSERT INTO `job_status` (`statusID`, `name`, `date_created`, `date_touched`) VALUES
(0, 'Completed', '2015-12-13 13:00:18', '2015-12-13 13:14:51'),
(1, 'New', '0000-00-00 00:00:00', '2016-02-05 12:10:39');

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
  `email_port` int(8) NOT NULL
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
  MODIFY `clientID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `inv`
--
ALTER TABLE `inv`
  MODIFY `invID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=426;
--
-- AUTO_INCREMENT for table `job`
--
ALTER TABLE `job`
  MODIFY `jobID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1021;
--
-- AUTO_INCREMENT for table `job_cache`
--
ALTER TABLE `job_cache`
  MODIFY `cacheID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `job_form`
--
ALTER TABLE `job_form`
  MODIFY `formID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=184;
--
-- AUTO_INCREMENT for table `job_form_templates`
--
ALTER TABLE `job_form_templates`
  MODIFY `templateID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
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
