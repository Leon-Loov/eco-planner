-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: eco-planner
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_meta_roadmap_edit_groups`
--

DROP TABLE IF EXISTS `_meta_roadmap_edit_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_meta_roadmap_edit_groups` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_meta_roadmap_edit_groups_AB_unique` (`A`,`B`),
  KEY `_meta_roadmap_edit_groups_B_index` (`B`),
  CONSTRAINT `_meta_roadmap_edit_groups_A_fkey` FOREIGN KEY (`A`) REFERENCES `meta_roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_meta_roadmap_edit_groups_B_fkey` FOREIGN KEY (`B`) REFERENCES `user_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_meta_roadmap_edit_groups`
--

LOCK TABLES `_meta_roadmap_edit_groups` WRITE;
/*!40000 ALTER TABLE `_meta_roadmap_edit_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `_meta_roadmap_edit_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_meta_roadmap_editors`
--

DROP TABLE IF EXISTS `_meta_roadmap_editors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_meta_roadmap_editors` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_meta_roadmap_editors_AB_unique` (`A`,`B`),
  KEY `_meta_roadmap_editors_B_index` (`B`),
  CONSTRAINT `_meta_roadmap_editors_A_fkey` FOREIGN KEY (`A`) REFERENCES `meta_roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_meta_roadmap_editors_B_fkey` FOREIGN KEY (`B`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_meta_roadmap_editors`
--

LOCK TABLES `_meta_roadmap_editors` WRITE;
/*!40000 ALTER TABLE `_meta_roadmap_editors` DISABLE KEYS */;
/*!40000 ALTER TABLE `_meta_roadmap_editors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_meta_roadmap_view_groups`
--

DROP TABLE IF EXISTS `_meta_roadmap_view_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_meta_roadmap_view_groups` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_meta_roadmap_view_groups_AB_unique` (`A`,`B`),
  KEY `_meta_roadmap_view_groups_B_index` (`B`),
  CONSTRAINT `_meta_roadmap_view_groups_A_fkey` FOREIGN KEY (`A`) REFERENCES `meta_roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_meta_roadmap_view_groups_B_fkey` FOREIGN KEY (`B`) REFERENCES `user_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_meta_roadmap_view_groups`
--

LOCK TABLES `_meta_roadmap_view_groups` WRITE;
/*!40000 ALTER TABLE `_meta_roadmap_view_groups` DISABLE KEYS */;
INSERT INTO `_meta_roadmap_view_groups` VALUES ('1465162e-9262-4da8-9e3e-431fff64da8b','a8745681-667c-41da-b989-5c6b32cda9ac');
/*!40000 ALTER TABLE `_meta_roadmap_view_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_meta_roadmap_viewers`
--

DROP TABLE IF EXISTS `_meta_roadmap_viewers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_meta_roadmap_viewers` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_meta_roadmap_viewers_AB_unique` (`A`,`B`),
  KEY `_meta_roadmap_viewers_B_index` (`B`),
  CONSTRAINT `_meta_roadmap_viewers_A_fkey` FOREIGN KEY (`A`) REFERENCES `meta_roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_meta_roadmap_viewers_B_fkey` FOREIGN KEY (`B`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_meta_roadmap_viewers`
--

LOCK TABLES `_meta_roadmap_viewers` WRITE;
/*!40000 ALTER TABLE `_meta_roadmap_viewers` DISABLE KEYS */;
/*!40000 ALTER TABLE `_meta_roadmap_viewers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0cbb5bb6-b0fd-4bcb-bcc3-a7d6968cc6f3','ee00263da5e7775754366e6a32ccf788f15982a7309e69c76b2bc484217ac91a','2024-04-18 11:25:49.957','20231121082955_add_links_comments_categories',NULL,NULL,'2024-04-18 11:25:49.264',1),('115fad1c-07b9-4fa7-bfce-5ce21346b308','e52e408bfe4f6928dd9bda03de1ec45266f8ddc56e37dc2f7f728b28188a5a55','2024-04-18 11:25:48.751','20230926125122_add_national_goal_id',NULL,NULL,'2024-04-18 11:25:48.703',1),('126f2cb0-783b-4143-97f1-71c44c2ddafa','e664b6dfc545193132968fb3380df0fd26a764f156bffff2e523f29cf422f77c','2024-04-18 11:25:54.919','20240110131609_great_2024_rework',NULL,NULL,'2024-04-18 11:25:50.158',1),('12cfb2cf-6d35-45e6-b07f-c0c13ea349f1','b78e71ecfe56495bbeed13755028a3e4abaf728311060be10cddf1f40f21e772','2024-04-18 11:25:49.246','20231107083648_add_roadmap_description',NULL,NULL,'2024-04-18 11:25:49.198',1),('21c9bf52-0f30-4b36-b64b-4d3fe2f13203','3ffdd7a25d8c412869db5a79abb72aafce7f5cfeb5e14920b1bf535432ce5988','2024-04-18 11:25:48.481','20230818102217_add_is_admin',NULL,NULL,'2024-04-18 11:25:48.396',1),('3bff1a46-2bd9-4bb3-90cf-9df3870c0c3d','adc68968bf3b1b7f8e08df5136caddad0fe8bea6482c4d7a1e0b6d21c60666d1','2024-04-18 11:25:50.098','20231121152424_add_link_description',NULL,NULL,'2024-04-18 11:25:49.969',1),('8e95ee22-a6db-4e22-a6bd-9fe83ee18ebe','9747ac3c675df6e89f6d17a6cbf4139eaaca30c8c4f450db97bf183e00f0b50e','2024-04-18 11:25:48.882','20231010110534_action_start_and_end',NULL,NULL,'2024-04-18 11:25:48.826',1),('a40c2cea-4676-422b-83f8-6cea9b89b567','4cf6a56fb827de808e5a1c492dc3a5065bd62856a84d1c1df89ea5741c3a2937','2024-04-18 11:25:48.383','20230707120858_initial_migration',NULL,NULL,'2024-04-18 11:25:43.946',1),('bdd5db93-cf5c-4be2-a4a6-6513afaf8775','d94f6c98b0719bf15a8195f6d55df6f49a44ec3b6c1c7a07a11dcf1437b9e4ef','2024-04-23 13:24:05.323','20240409125858_add_featured_goals',NULL,NULL,'2024-04-23 13:24:05.223',1),('d8639a69-bae0-4782-8410-f4b5fb10f88b','b079cf83b54749e607406a100d98d248393dfab385f2459bef1dd320b09f604c','2024-04-18 11:25:48.810','20231009090510_county_and_municipality_for_roadmap',NULL,NULL,'2024-04-18 11:25:48.768',1),('d9e0fb97-2df1-4e5d-9cd7-f54fa2642b13','302a9eb575f29244dcf4299a0775076e4b41e4dc7e38fc585cb94b706bfd48fc','2024-04-18 11:25:49.183','20231012104854_change_necessary_fields_and_some_more',NULL,NULL,'2024-04-18 11:25:48.897',1),('dcedfe4d-4242-4563-bbc9-b60dcd5d7b7d','7eb95e55e3bef48ed45ed08f8da5056caac267dcf1c9a4092a27c1e886670101','2024-04-18 11:25:48.688','20230828092936_add_notes',NULL,NULL,'2024-04-18 11:25:48.498',1),('f5daec1a-14a4-4ad5-b8dd-c7ab7b6efdc9','21a851eab7544657a62dd377d819a6f318e986eb90f95531fa8b4ddb27022259','2024-04-18 11:25:54.964','20240122150143_roadmap_meta_roadmap_id_and_version_constraint',NULL,NULL,'2024-04-18 11:25:54.927',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_roadmap_edit_groups`
--

DROP TABLE IF EXISTS `_roadmap_edit_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_roadmap_edit_groups` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_roadmap_edit_groups_AB_unique` (`A`,`B`),
  KEY `_roadmap_edit_groups_B_index` (`B`),
  CONSTRAINT `_roadmap_edit_groups_A_fkey` FOREIGN KEY (`A`) REFERENCES `roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_roadmap_edit_groups_B_fkey` FOREIGN KEY (`B`) REFERENCES `user_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_roadmap_edit_groups`
--

LOCK TABLES `_roadmap_edit_groups` WRITE;
/*!40000 ALTER TABLE `_roadmap_edit_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `_roadmap_edit_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_roadmap_editors`
--

DROP TABLE IF EXISTS `_roadmap_editors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_roadmap_editors` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_roadmap_editors_AB_unique` (`A`,`B`),
  KEY `_roadmap_editors_B_index` (`B`),
  CONSTRAINT `_roadmap_editors_A_fkey` FOREIGN KEY (`A`) REFERENCES `roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_roadmap_editors_B_fkey` FOREIGN KEY (`B`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_roadmap_editors`
--

LOCK TABLES `_roadmap_editors` WRITE;
/*!40000 ALTER TABLE `_roadmap_editors` DISABLE KEYS */;
INSERT INTO `_roadmap_editors` VALUES ('064088f2-630e-4fa2-b6c6-ebd3cfc8d394','b240ebb1-aa83-4dcb-afec-bd27516a2fad'),('b03a0c71-e01b-4e77-95a9-314450d086be','b240ebb1-aa83-4dcb-afec-bd27516a2fad');
/*!40000 ALTER TABLE `_roadmap_editors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_roadmap_view_groups`
--

DROP TABLE IF EXISTS `_roadmap_view_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_roadmap_view_groups` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_roadmap_view_groups_AB_unique` (`A`,`B`),
  KEY `_roadmap_view_groups_B_index` (`B`),
  CONSTRAINT `_roadmap_view_groups_A_fkey` FOREIGN KEY (`A`) REFERENCES `roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_roadmap_view_groups_B_fkey` FOREIGN KEY (`B`) REFERENCES `user_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_roadmap_view_groups`
--

LOCK TABLES `_roadmap_view_groups` WRITE;
/*!40000 ALTER TABLE `_roadmap_view_groups` DISABLE KEYS */;
INSERT INTO `_roadmap_view_groups` VALUES ('064088f2-630e-4fa2-b6c6-ebd3cfc8d394','a8745681-667c-41da-b989-5c6b32cda9ac'),('b03a0c71-e01b-4e77-95a9-314450d086be','a8745681-667c-41da-b989-5c6b32cda9ac');
/*!40000 ALTER TABLE `_roadmap_view_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_roadmap_viewers`
--

DROP TABLE IF EXISTS `_roadmap_viewers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_roadmap_viewers` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_roadmap_viewers_AB_unique` (`A`,`B`),
  KEY `_roadmap_viewers_B_index` (`B`),
  CONSTRAINT `_roadmap_viewers_A_fkey` FOREIGN KEY (`A`) REFERENCES `roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_roadmap_viewers_B_fkey` FOREIGN KEY (`B`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_roadmap_viewers`
--

LOCK TABLES `_roadmap_viewers` WRITE;
/*!40000 ALTER TABLE `_roadmap_viewers` DISABLE KEYS */;
/*!40000 ALTER TABLE `_roadmap_viewers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_user_group`
--

DROP TABLE IF EXISTS `_user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_user_group` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_user_group_AB_unique` (`A`,`B`),
  KEY `_user_group_B_index` (`B`),
  CONSTRAINT `_user_group_A_fkey` FOREIGN KEY (`A`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_user_group_B_fkey` FOREIGN KEY (`B`) REFERENCES `user_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_user_group`
--

LOCK TABLES `_user_group` WRITE;
/*!40000 ALTER TABLE `_user_group` DISABLE KEYS */;
INSERT INTO `_user_group` VALUES ('b240ebb1-aa83-4dcb-afec-bd27516a2fad','798398a7-80ef-458e-9ea9-672797497ef1');
/*!40000 ALTER TABLE `_user_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `action`
--

DROP TABLE IF EXISTS `action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `action` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `cost_efficiency` text COLLATE utf8mb4_unicode_ci,
  `expected_outcome` text COLLATE utf8mb4_unicode_ci,
  `project_manager` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relevant_actors` text COLLATE utf8mb4_unicode_ci,
  `author_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `end_year` int DEFAULT NULL,
  `start_year` int DEFAULT NULL,
  `is_efficiency` tinyint(1) NOT NULL DEFAULT '0',
  `is_renewables` tinyint(1) NOT NULL DEFAULT '0',
  `is_sufficiency` tinyint(1) NOT NULL DEFAULT '0',
  `goal_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `action_author_id_fkey` (`author_id`),
  KEY `action_goal_id_fkey` (`goal_id`),
  CONSTRAINT `action_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `action_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action`
--

LOCK TABLES `action` WRITE;
/*!40000 ALTER TABLE `action` DISABLE KEYS */;
INSERT INTO `action` VALUES ('60f07699-e565-4d66-ac17-41daa5170711','2024-04-23 13:35:02.180','2024-04-23 13:35:02.180','Phasellus semper facilisis ornare','','','','','','b240ebb1-aa83-4dcb-afec-bd27516a2fad',2045,2035,0,0,0,'b987e965-13d1-4bcd-a671-26ad078c0137'),('71751f5b-7ac7-48f2-a324-4ec187b18161','2024-04-23 13:31:55.028','2024-04-23 13:31:55.028','Nulla semper cursus mauris in facilisis','Nam ultricies at tellus at ullamcorper. Etiam nulla sem, posuere in orci nec, scelerisque molestie mauris. Quisque vestibulum fringilla vulputate. Ut laoreet mauris eget enim cursus tincidunt. Quisque tincidunt aliquet felis non iaculis. Sed scelerisque in arcu ac dictum. Quisque magna neque, interdum at pretium ut, finibus rutrum nisi.','Vivamus euismod lobortis placerat','Cras semper ex nec nisl mattis, sit amet aliquam odio maximus. Nulla tempor augue non venenatis elementum.','Donec ante velit','Vulputate quis euismod nec','b240ebb1-aa83-4dcb-afec-bd27516a2fad',2050,2020,0,1,1,'b987e965-13d1-4bcd-a671-26ad078c0137');
/*!40000 ALTER TABLE `action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `comment_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `goal_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roadmap_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_roadmap_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comment_author_id_fkey` (`author_id`),
  KEY `comment_action_id_fkey` (`action_id`),
  KEY `comment_goal_id_fkey` (`goal_id`),
  KEY `comment_roadmap_id_fkey` (`roadmap_id`),
  KEY `comment_meta_roadmap_id_fkey` (`meta_roadmap_id`),
  CONSTRAINT `comment_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `action` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `comment_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_meta_roadmap_id_fkey` FOREIGN KEY (`meta_roadmap_id`) REFERENCES `meta_roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_roadmap_id_fkey` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES ('f36c50f1-0b84-4992-b8af-d3cbea6b3c53','2024-04-23 13:35:48.823','2024-04-23 13:35:48.823','Nulla non mi facilisis, tempor turpis ac, efficitur risus. Phasellus semper facilisis ornare. Aliquam erat volutpat. Ut sodales suscipit velit, facilisis dignissim sem tempor vitae. Ut tempus ultricies elit eu venenatis. Morbi vel neque eu urna placerat volutpat. Nullam viverra venenatis risus, vel volutpat nibh ultrices vitae. Phasellus eget malesuada sem. Sed quis tempus turpis. Vestibulum fermentum, mauris vel ornare laoreet, elit velit rhoncus eros, vitae vulputate ipsum libero vitae nisi.','b240ebb1-aa83-4dcb-afec-bd27516a2fad',NULL,'b987e965-13d1-4bcd-a671-26ad078c0137',NULL,NULL);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_series`
--

DROP TABLE IF EXISTS `data_series`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_series` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `val_2020` double DEFAULT NULL,
  `val_2021` double DEFAULT NULL,
  `val_2022` double DEFAULT NULL,
  `val_2023` double DEFAULT NULL,
  `val_2024` double DEFAULT NULL,
  `val_2025` double DEFAULT NULL,
  `val_2026` double DEFAULT NULL,
  `val_2027` double DEFAULT NULL,
  `val_2028` double DEFAULT NULL,
  `val_2029` double DEFAULT NULL,
  `val_2030` double DEFAULT NULL,
  `val_2031` double DEFAULT NULL,
  `val_2032` double DEFAULT NULL,
  `val_2033` double DEFAULT NULL,
  `val_2034` double DEFAULT NULL,
  `val_2035` double DEFAULT NULL,
  `val_2036` double DEFAULT NULL,
  `val_2037` double DEFAULT NULL,
  `val_2038` double DEFAULT NULL,
  `val_2039` double DEFAULT NULL,
  `val_2040` double DEFAULT NULL,
  `val_2041` double DEFAULT NULL,
  `val_2042` double DEFAULT NULL,
  `val_2043` double DEFAULT NULL,
  `val_2044` double DEFAULT NULL,
  `val_2045` double DEFAULT NULL,
  `val_2046` double DEFAULT NULL,
  `val_2047` double DEFAULT NULL,
  `val_2048` double DEFAULT NULL,
  `val_2049` double DEFAULT NULL,
  `val_2050` double DEFAULT NULL,
  `author_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scale` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `goal_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `data_series_goal_id_key` (`goal_id`),
  KEY `data_series_author_id_fkey` (`author_id`),
  CONSTRAINT `data_series_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `data_series_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_series`
--

LOCK TABLES `data_series` WRITE;
/*!40000 ALTER TABLE `data_series` DISABLE KEYS */;
INSERT INTO `data_series` VALUES ('14fbd15c-d100-4409-97ac-adcd64b13c4a','2024-04-23 13:43:56.626','2024-04-23 13:44:21.628','amount',0,18,25,55,37,24,30,78,20,72,22,37,89,95,5,72,20,80,85,49,89,85,71,3,47,17,74,39,74,1,66,'b240ebb1-aa83-4dcb-afec-bd27516a2fad',NULL,'5ac3d173-a6f8-44f2-a026-f5ca2971738c'),('546d4660-99e1-44b3-824d-3fec4efdf4d1','2024-04-23 13:58:46.132','2024-04-23 13:58:46.132','Test/s',14,65,54,43,82,51,13,69,2,63,24,81,93,4,97,47,2,49,40,32,1,52,54,81,64,51,39,0,83,63,52,'b240ebb1-aa83-4dcb-afec-bd27516a2fad',NULL,'09725e0d-c825-4b58-a16c-1b4d65bed6d5'),('591ff11d-936a-41d8-aae9-e8788f57d719','2024-04-23 13:56:39.318','2024-04-23 13:57:36.132','Test/s',0.3256513923642422,1.442170451898787,0.09304325496121207,0.2326081374030302,0.3256513923642422,1.930647540445151,0.3256513923642422,0.5349987160269695,2.279559746549696,0.8141284809106056,0.7676068534299996,2.023690795406363,0.7676068534299996,0.1628256961821211,1.674778589301817,2.070212422886969,1.837604285483939,1.186301500755454,1.69803940304212,1.023475804573333,1.372388010677878,2.116734050367575,0.8373892946509087,1.418909638158484,1.511952893119696,1.930647540445151,1.069997432053939,0.5815203435075754,0.7443460396896966,1.651517775561514,0.5815203435075754,'b240ebb1-aa83-4dcb-afec-bd27516a2fad',NULL,'d7977f95-85a1-4ddf-9cd0-8bdd33de979a'),('fdb423a4-c068-4e88-a89b-4e7f8b1d9449','2024-04-18 14:56:15.870','2024-04-23 13:26:17.484','Test/s',14,62,4,10,14,83,14,23,98,35,33,87,33,7,72,89,79,51,73,44,59,91,36,61,65,83,46,25,32,71,25,'b240ebb1-aa83-4dcb-afec-bd27516a2fad',NULL,'b987e965-13d1-4bcd-a671-26ad078c0137'),('ff360605-a044-4239-af46-6fd54612d133','2024-04-23 13:42:10.362','2024-04-23 13:45:26.282','Test/s',57,91,100,48,64,89,6,72,66,66,6,3,63,58,42,18,10,64,14,85,80,74,80,39,99,55,34,38,76,12,22,'b240ebb1-aa83-4dcb-afec-bd27516a2fad',NULL,'4152ec37-0c4d-4580-b3b5-23f326948949');
/*!40000 ALTER TABLE `data_series` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goal`
--

DROP TABLE IF EXISTS `goal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goal` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indicator_parameter` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `roadmap_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `goal_author_id_fkey` (`author_id`),
  KEY `goal_roadmap_id_fkey` (`roadmap_id`),
  CONSTRAINT `goal_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `goal_roadmap_id_fkey` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goal`
--

LOCK TABLES `goal` WRITE;
/*!40000 ALTER TABLE `goal` DISABLE KEYS */;
INSERT INTO `goal` VALUES ('09725e0d-c825-4b58-a16c-1b4d65bed6d5','2024-04-23 13:58:46.132','2024-04-23 13:58:46.132',NULL,'Test\\For\\Whatever','b240ebb1-aa83-4dcb-afec-bd27516a2fad',NULL,'064088f2-630e-4fa2-b6c6-ebd3cfc8d394',1),('4152ec37-0c4d-4580-b3b5-23f326948949','2024-04-23 13:42:10.362','2024-04-23 13:45:26.282','Fusce posuere vel felis nec hendrerit','Test\\For\\Testing','b240ebb1-aa83-4dcb-afec-bd27516a2fad','Sed dignissim tincidunt quam sed venenatis. Nullam id risus sit amet massa varius varius eget vitae orci. Curabitur nec pulvinar odio. Etiam vel volutpat dui. Ut tempor velit nisl, in efficitur justo tincidunt non. Aenean a rutrum ipsum. Donec vitae velit ornare, consequat purus venenatis, hendrerit lacus. Suspendisse molestie volutpat semper. Maecenas auctor est id tristique pretium.','b03a0c71-e01b-4e77-95a9-314450d086be',0),('5ac3d173-a6f8-44f2-a026-f5ca2971738c','2024-04-23 13:43:56.626','2024-04-23 13:44:21.628',NULL,'Info\\Minimal','b240ebb1-aa83-4dcb-afec-bd27516a2fad',NULL,'b03a0c71-e01b-4e77-95a9-314450d086be',1),('b987e965-13d1-4bcd-a671-26ad078c0137','2024-04-18 14:56:15.870','2024-04-23 13:26:17.484','Dolor sit amet','Test\\For\\Development','b240ebb1-aa83-4dcb-afec-bd27516a2fad','Nulla semper cursus mauris in facilisis. Nam ultricies at tellus at ullamcorper. Etiam nulla sem, posuere in orci nec, scelerisque molestie mauris. Quisque vestibulum fringilla vulputate. Ut laoreet mauris eget enim cursus tincidunt. Quisque tincidunt aliquet felis non iaculis. Sed scelerisque in arcu ac dictum. Quisque magna neque, interdum at pretium ut, finibus rutrum nisi.','b03a0c71-e01b-4e77-95a9-314450d086be',1),('d7977f95-85a1-4ddf-9cd0-8bdd33de979a','2024-04-23 13:56:39.318','2024-04-23 13:57:36.132','Dolor sit amet','Test\\For\\Development','b240ebb1-aa83-4dcb-afec-bd27516a2fad','Nulla semper cursus mauris in facilisis. Nam ultricies at tellus at ullamcorper. Etiam nulla sem, posuere in orci nec, scelerisque molestie mauris. Quisque vestibulum fringilla vulputate. Ut laoreet mauris eget enim cursus tincidunt. Quisque tincidunt aliquet felis non iaculis. Sed scelerisque in arcu ac dictum. Quisque magna neque, interdum at pretium ut, finibus rutrum nisi.','064088f2-630e-4fa2-b6c6-ebd3cfc8d394',1);
/*!40000 ALTER TABLE `goal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `link`
--

DROP TABLE IF EXISTS `link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `link` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `goal_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_roadmap_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `link_action_id_fkey` (`action_id`),
  KEY `link_goal_id_fkey` (`goal_id`),
  KEY `link_meta_roadmap_id_fkey` (`meta_roadmap_id`),
  CONSTRAINT `link_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `action` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `link_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `link_meta_roadmap_id_fkey` FOREIGN KEY (`meta_roadmap_id`) REFERENCES `meta_roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `link`
--

LOCK TABLES `link` WRITE;
/*!40000 ALTER TABLE `link` DISABLE KEYS */;
INSERT INTO `link` VALUES ('3bcbefb4-a1c1-413e-99eb-9160b92646ea','https://translate.google.com',NULL,'4152ec37-0c4d-4580-b3b5-23f326948949','Google',NULL),('52296f9d-da83-407e-9013-096d4a968713','https://stuns.se/',NULL,NULL,'STUNS Hemsida','a0dbf42c-4882-4e81-bedb-6f1a8714ebeb'),('8d1e4ba2-5ae9-47b5-a8d2-018721c1e0ba','https://example.com','71751f5b-7ac7-48f2-a324-4ec187b18161',NULL,'Vulputate vitae ipsum',NULL);
/*!40000 ALTER TABLE `link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_roadmap`
--

DROP TABLE IF EXISTS `meta_roadmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meta_roadmap` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('NATIONAL','REGIONAL','MUNICIPAL','LOCAL','OTHER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OTHER',
  `actor` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_roadmap_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `meta_roadmap_parent_roadmap_id_fkey` (`parent_roadmap_id`),
  KEY `meta_roadmap_author_id_fkey` (`author_id`),
  CONSTRAINT `meta_roadmap_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `meta_roadmap_parent_roadmap_id_fkey` FOREIGN KEY (`parent_roadmap_id`) REFERENCES `meta_roadmap` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_roadmap`
--

LOCK TABLES `meta_roadmap` WRITE;
/*!40000 ALTER TABLE `meta_roadmap` DISABLE KEYS */;
INSERT INTO `meta_roadmap` VALUES ('1465162e-9262-4da8-9e3e-431fff64da8b','2024-04-18 14:40:11.984','2024-04-18 14:40:11.984','Lorem Ipsum','Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','NATIONAL','Sverige',NULL,'b240ebb1-aa83-4dcb-afec-bd27516a2fad'),('a0dbf42c-4882-4e81-bedb-6f1a8714ebeb','2024-04-23 13:51:15.904','2024-04-23 13:51:15.904','Vestibulum maximus lectus eu dignissim iaculis','Mauris cursus orci tortor, quis volutpat nisi ultricies ut. Aenean sollicitudin, sem in ornare euismod, tortor augue interdum orci, id ultricies mauris odio vel nisl. Pellentesque pellentesque nibh et justo placerat laoreet. Mauris id quam lacus. In vel tellus sit amet ex dapibus posuere. Integer posuere ornare justo varius lobortis. Sed a nisl id orci tincidunt tincidunt vitae et nunc. Donec et tincidunt ligula. Aenean viverra nec orci id suscipit.','MUNICIPAL','Uppsala','1465162e-9262-4da8-9e3e-431fff64da8b','b240ebb1-aa83-4dcb-afec-bd27516a2fad');
/*!40000 ALTER TABLE `meta_roadmap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `note`
--

DROP TABLE IF EXISTS `note`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `note_action_id_fkey` (`action_id`),
  KEY `note_author_id_fkey` (`author_id`),
  CONSTRAINT `note_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `action` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `note_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `note`
--

LOCK TABLES `note` WRITE;
/*!40000 ALTER TABLE `note` DISABLE KEYS */;
/*!40000 ALTER TABLE `note` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roadmap`
--

DROP TABLE IF EXISTS `roadmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roadmap` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `author_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `meta_roadmap_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_version` int DEFAULT NULL,
  `version` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roadmap_meta_roadmap_id_version_key` (`meta_roadmap_id`,`version`),
  KEY `roadmap_author_id_fkey` (`author_id`),
  CONSTRAINT `roadmap_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `roadmap_meta_roadmap_id_fkey` FOREIGN KEY (`meta_roadmap_id`) REFERENCES `meta_roadmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roadmap`
--

LOCK TABLES `roadmap` WRITE;
/*!40000 ALTER TABLE `roadmap` DISABLE KEYS */;
INSERT INTO `roadmap` VALUES ('064088f2-630e-4fa2-b6c6-ebd3cfc8d394','2024-04-23 13:55:57.358','2024-04-23 13:55:57.358','b240ebb1-aa83-4dcb-afec-bd27516a2fad',NULL,'a0dbf42c-4882-4e81-bedb-6f1a8714ebeb',NULL,1),('b03a0c71-e01b-4e77-95a9-314450d086be','2024-04-18 14:49:39.268','2024-04-18 14:49:39.268','b240ebb1-aa83-4dcb-afec-bd27516a2fad','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non sodales nisl, vitae laoreet ante. Aenean posuere velit tempor orci feugiat, vel commodo arcu tincidunt. Maecenas tristique vehicula velit, ut tincidunt sem. Praesent vel quam luctus, cursus dolor at, fringilla eros. Suspendisse at nibh purus. Integer sit amet malesuada nulla. Nunc id ligula et ex pellentesque varius eget vel leo. Pellentesque sit amet pulvinar mauris. Etiam ut velit felis. Morbi pretium mi odio, quis scelerisque justo commodo vel. Fusce tristique ligula sem, vel porta sapien imperdiet vitae. Sed id metus vitae justo blandit ultrices non tempus nisi. Fusce lacinia urna ac tempor vestibulum. Nulla sed pellentesque neque. ','1465162e-9262-4da8-9e3e-431fff64da8b',NULL,1);
/*!40000 ALTER TABLE `roadmap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_username_key` (`username`),
  UNIQUE KEY `user_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('b240ebb1-aa83-4dcb-afec-bd27516a2fad','admin','admin@admin.admin','$2b$11$WAx5m6dxsXSQp./gsiNo6eJ4f1bK.1ezIbXMco7brx1qn0Vot1bWK',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_group`
--

DROP TABLE IF EXISTS `user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_group` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_group_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_group`
--

LOCK TABLES `user_group` WRITE;
/*!40000 ALTER TABLE `user_group` DISABLE KEYS */;
INSERT INTO `user_group` VALUES ('798398a7-80ef-458e-9ea9-672797497ef1','admin.admin'),('a8745681-667c-41da-b989-5c6b32cda9ac','Public');
/*!40000 ALTER TABLE `user_group` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-23 16:14:46
