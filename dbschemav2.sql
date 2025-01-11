-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Jan 09. 22:42
-- Kiszolgáló verziója: 8.0.33
-- PHP verzió: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `flare`
--
CREATE DATABASE IF NOT EXISTS `flare` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `flare`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `classical_registration`
--

CREATE TABLE `classical_registration` (
  `id` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `discord_registration`
--

CREATE TABLE `discord_registration` (
  `id` int NOT NULL,
  `discord_id` int NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `profile`
--

CREATE TABLE `profile` (
  `id` int(10) UNSIGNED ZEROFILL NOT NULL,
  `username` varchar(15) DEFAULT NULL,
  `description` varchar(75) DEFAULT NULL,
  `streak` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `isDiscord` binary(1) NOT NULL,
  `profile_id` int NOT NULL,
  `registration_id` int NOT NULL,
  `token` varchar(136) DEFAULT NULL,
  `hashed_token` varchar(64) DEFAULT NULL,
  `username` varchar(15) NOT NULL,
  `joined` datetime NOT NULL,
  `isAccountValid` binary(1) NOT NULL,
  `role` enum('basic','pro','enterprise','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `classical_registration`
--
ALTER TABLE `classical_registration`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- A tábla indexei `discord_registration`
--
ALTER TABLE `discord_registration`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `discord_id_UNIQUE` (`discord_id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- A tábla indexei `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_id_UNIQUE` (`registration_id`),
  ADD UNIQUE KEY `profile_id_UNIQUE` (`profile_id`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`),
  ADD UNIQUE KEY `token_UNIQUE` (`token`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `classical_registration`
--
ALTER TABLE `classical_registration`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `discord_registration`
--
ALTER TABLE `discord_registration`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
