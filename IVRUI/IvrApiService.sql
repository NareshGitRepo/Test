/*
SQLyog Community v13.1.1 (64 bit)
MySQL - 8.0.13 : Database - synapseivr
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`synapseivr` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `synapseivr`;

/*Table structure for table `vm_base` */

DROP TABLE IF EXISTS `vm_base`;

CREATE TABLE `vm_base` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `msisdn` varchar(20) DEFAULT NULL,
  `campaignid` int(11) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `submitdate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `vm_base` */

/*Table structure for table `vm_campaignactive` */

DROP TABLE IF EXISTS `vm_campaignactive`;

CREATE TABLE `vm_campaignactive` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campaignid` bigint(20) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `starttime` time DEFAULT NULL,
  `endtime` time DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  `updatedby` varchar(50) DEFAULT NULL,
  `updatedtime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`campaignid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `vm_campaignactive` */

/*Table structure for table `vm_campaigndetails` */

DROP TABLE IF EXISTS `vm_campaigndetails`;

CREATE TABLE `vm_campaigndetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaignname` varchar(50) DEFAULT NULL,
  `promotiontype` varchar(50) DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  `createddate` datetime DEFAULT NULL,
  `pattern` varchar(100) DEFAULT NULL,
  `starttime` time DEFAULT NULL,
  `endtime` time DEFAULT NULL,
  `dndstatus` tinyint(1) DEFAULT NULL,
  `campaigntype` varchar(50) DEFAULT NULL,
  `campaignflow` varchar(500) DEFAULT NULL,
  `promptpath` text,
  `infopath` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `vm_campaigndetails` */

insert  into `vm_campaigndetails`(`id`,`campaignname`,`promotiontype`,`startdate`,`enddate`,`createdby`,`createddate`,`pattern`,`starttime`,`endtime`,`dndstatus`,`campaigntype`,`campaignflow`,`promptpath`,`infopath`) values 
(1,'fdgdfgdfg','Info',NULL,NULL,31,'2019-08-09 10:32:44','undefined','10:32:35','00:00:00',0,'QUICK','',NULL,'one.wav'),
(2,'fgfdgdfgdfgfd','Promo',NULL,NULL,31,'2019-08-09 10:34:47','5','10:34:30','00:00:00',1,'QUICK','','two.wav','one.wav'),
(3,'6557567','Info',NULL,NULL,31,'2019-08-09 10:35:46','undefined','10:35:00','00:00:00',1,'BULK','',NULL,'one.wav'),
(4,'jjhjhhjhjj','Info',NULL,NULL,31,'2019-08-09 12:08:31','undefined','12:07:49','00:00:00',1,'QUICK','',NULL,'one.wav');

/*Table structure for table `vm_cdr` */

DROP TABLE IF EXISTS `vm_cdr`;

CREATE TABLE `vm_cdr` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to_number` varchar(50) DEFAULT NULL,
  `from_number` varchar(50) DEFAULT NULL,
  `campaignid` varchar(100) DEFAULT NULL,
  `startdate` datetime DEFAULT NULL,
  `enddate` datetime DEFAULT NULL,
  `answertime` datetime DEFAULT NULL,
  `billed_duration` int(11) DEFAULT NULL,
  `call_duration` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `total_cost` decimal(10,5) DEFAULT NULL,
  `call_uuid` varchar(100) DEFAULT NULL,
  `bill_rate` decimal(10,3) DEFAULT NULL,
  `digits` int(11) DEFAULT NULL,
  `inserttime` datetime DEFAULT NULL,
  `hangupcause` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_call_uuid` (`call_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `vm_cdr` */

/*Table structure for table `vm_roles` */

DROP TABLE IF EXISTS `vm_roles`;

CREATE TABLE `vm_roles` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `rolename` varchar(50) DEFAULT NULL,
  `createdby` varchar(50) DEFAULT NULL,
  `updatedby` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Id` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8;

/*Data for the table `vm_roles` */

insert  into `vm_roles`(`Id`,`rolename`,`createdby`,`updatedby`) values 
(53,'admin','1','1'),
(57,'moderator','31',NULL),
(58,'user','31',NULL);

/*Table structure for table `vm_users` */

DROP TABLE IF EXISTS `vm_users`;

CREATE TABLE `vm_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `roleid` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `createdby` varchar(100) DEFAULT NULL,
  `createdon` varchar(100) DEFAULT NULL,
  `updatedby` varchar(100) DEFAULT NULL,
  `updatedon` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phonenumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

/*Data for the table `vm_users` */

insert  into `vm_users`(`id`,`username`,`password`,`roleid`,`status`,`createdby`,`createdon`,`updatedby`,`updatedon`,`email`,`phonenumber`) values 
(31,'admin','admin','53','Active','1',NULL,NULL,NULL,'jagan@gmail.com','3456787887887'),
(33,'testuser','12345678','56','Active','31',NULL,'null',NULL,'testuser23@gmail.com','7799099965'),
(35,'sample','1234567','55','Active','31',NULL,'null',NULL,'sample@gmail.com','1234567890'),
(36,'jagan','123456','57','Active','31',NULL,'null',NULL,'jagan@vm.com','9876543210'),
(37,'user','123456','58','Active','31',NULL,NULL,NULL,'user@vm.com','9876543210');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
