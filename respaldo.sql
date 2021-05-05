-- MySQL dump 10.17  Distrib 10.3.25-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: retoTrip
-- ------------------------------------------------------
-- Server version	10.3.25-MariaDB-0ubuntu1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `BannedCategories`
--

DROP TABLE IF EXISTS `BannedCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BannedCategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idCategory` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idCategory` (`idCategory`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BannedCategories`
--

LOCK TABLES `BannedCategories` WRITE;
/*!40000 ALTER TABLE `BannedCategories` DISABLE KEYS */;
INSERT INTO `BannedCategories` VALUES (1,1,'meat','Carne'),(2,2,'fish','Pescado'),(3,3,'shellfish','Marisco'),(4,4,'vegetable','Verduras'),(5,5,'dairyProducts','Lacteos'),(6,6,'eggs','Huevos'),(7,7,'pulses','Legumbres'),(8,8,'pasta','Pasta');
/*!40000 ALTER TABLE `BannedCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Favs`
--

DROP TABLE IF EXISTS `Favs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Favs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) DEFAULT NULL,
  `idRecipe` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_store_unique` (`idUser`,`idRecipe`),
  KEY `idRecipe` (`idRecipe`),
  CONSTRAINT `Favs_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `Users` (`id`),
  CONSTRAINT `Favs_ibfk_2` FOREIGN KEY (`idRecipe`) REFERENCES `Recipes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Favs`
--

LOCK TABLES `Favs` WRITE;
/*!40000 ALTER TABLE `Favs` DISABLE KEYS */;
INSERT INTO `Favs` VALUES (7,2,2),(8,2,3),(1,2,4);
/*!40000 ALTER TABLE `Favs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ingredients`
--

DROP TABLE IF EXISTS `Ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ingredients`
--

LOCK TABLES `Ingredients` WRITE;
/*!40000 ALTER TABLE `Ingredients` DISABLE KEYS */;
/*!40000 ALTER TABLE `Ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Recipes`
--

DROP TABLE IF EXISTS `Recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Recipes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idUser` (`idUser`),
  CONSTRAINT `Recipes_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Recipes`
--

LOCK TABLES `Recipes` WRITE;
/*!40000 ALTER TABLE `Recipes` DISABLE KEYS */;
INSERT INTO `Recipes` VALUES (2,1,'HOLA HOLA'),(3,1,'HOLA HOLA'),(4,1,'HOLA HOLA');
/*!40000 ALTER TABLE `Recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserBannedCategories`
--

DROP TABLE IF EXISTS `UserBannedCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserBannedCategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idCategory` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUser` (`idUser`),
  KEY `idCategory` (`idCategory`),
  CONSTRAINT `UserBannedCategories_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `Users` (`id`),
  CONSTRAINT `UserBannedCategories_ibfk_2` FOREIGN KEY (`idCategory`) REFERENCES `BannedCategories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserBannedCategories`
--

LOCK TABLES `UserBannedCategories` WRITE;
/*!40000 ALTER TABLE `UserBannedCategories` DISABLE KEYS */;
INSERT INTO `UserBannedCategories` VALUES (80,2,2),(81,4,2);
/*!40000 ALTER TABLE `UserBannedCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserBannedIngredients`
--

DROP TABLE IF EXISTS `UserBannedIngredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserBannedIngredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idIngredient` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUser` (`idUser`),
  KEY `idIngredient` (`idIngredient`),
  CONSTRAINT `UserBannedIngredients_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `Users` (`id`),
  CONSTRAINT `UserBannedIngredients_ibfk_2` FOREIGN KEY (`idIngredient`) REFERENCES `Ingredients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserBannedIngredients`
--

LOCK TABLES `UserBannedIngredients` WRITE;
/*!40000 ALTER TABLE `UserBannedIngredients` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserBannedIngredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `secret` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pass` varchar(64) NOT NULL,
  `userName` varchar(50) DEFAULT NULL,
  `boolFavCalendar` tinyint(1) DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Pkd0Dl5uzW','c@aa.es','cf0fc5378a8315c66fc5426b03a1cf3112fb705e53483e0be1ec5da45c5a5f3e','Roberto',0,'http://kk.es','Roberto Villares'),(2,'Vs0skLR5pA','c1@aa.es','cf0fc5378a8315c66fc5426b03a1cf3112fb705e53483e0be1ec5da45c5a5f3e','c',1,'http://kk.es','Roberto'),(15,'QkBdPfda25','c3@aa.es','cf0fc5378a8315c66fc5426b03a1cf3112fb705e53483e0be1ec5da45c5a5f3e','Roberto',0,'http://kk.es','Roberto'),(16,'XL7aJy00pK','c2@aa.es','cf0fc5378a8315c66fc5426b03a1cf3112fb705e53483e0be1ec5da45c5a5f3e','Roberto',0,'http://kk.es','Roberto'),(17,'DYnk0kmpWO','a3@aa.es','cf0fc5378a8315c66fc5426b03a1cf3112fb705e53483e0be1ec5da45c5a5f3e','Roberto',0,'http://kk.es','Roberto'),(18,'z0FhY6N5kO','aa@aa.es','fbd9d81e01aaf559359f437afa7ffcec5d737dd919c244dcf0e7d5b32c82b5ef','sdsdf',0,NULL,'sdsdf');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-04 20:51:28
