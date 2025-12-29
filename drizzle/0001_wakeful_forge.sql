CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`userId` int,
	`role` enum('user','assistant','system') NOT NULL,
	`content` text NOT NULL,
	`language` varchar(10) DEFAULT 'nl',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text NOT NULL,
	`city` varchar(100) NOT NULL,
	`postalCode` varchar(20),
	`province` varchar(100),
	`country` varchar(100) NOT NULL DEFAULT 'Netherlands',
	`latitude` varchar(50),
	`longitude` varchar(50),
	`openingHoursWeekday` varchar(100),
	`openingHoursWeekend` varchar(100),
	`closedDays` varchar(255),
	`phone` varchar(50),
	`email` varchar(255),
	`website` varchar(255),
	`hasParking` boolean DEFAULT true,
	`hasVintedLocker` boolean DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `machines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`machineId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`model` varchar(100),
	`status` enum('operational','maintenance','offline','full','coming-soon') NOT NULL DEFAULT 'coming-soon',
	`bottleCapacity` int NOT NULL DEFAULT 1000,
	`canCapacity` int NOT NULL DEFAULT 1000,
	`bottlesCount` int NOT NULL DEFAULT 0,
	`cansCount` int NOT NULL DEFAULT 0,
	`glassCount` int NOT NULL DEFAULT 0,
	`totalCollected` int NOT NULL DEFAULT 0,
	`itemsPerMinute` int DEFAULT 120,
	`locationId` int,
	`eportalSerial` varchar(64),
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `machines_id` PRIMARY KEY(`id`),
	CONSTRAINT `machines_machineId_unique` UNIQUE(`machineId`)
);
--> statement-breakpoint
CREATE TABLE `recycling_contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`displayName` varchar(50),
	`bottleCount` int NOT NULL DEFAULT 0,
	`canCount` int NOT NULL DEFAULT 0,
	`glassCount` int NOT NULL DEFAULT 0,
	`totalWeight` int NOT NULL DEFAULT 0,
	`earnedAmount` int NOT NULL DEFAULT 0,
	`machineId` varchar(64),
	`locationId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recycling_contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `weekly_leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`displayName` varchar(50) NOT NULL,
	`weekStartDate` timestamp NOT NULL,
	`totalBottles` int NOT NULL DEFAULT 0,
	`totalCans` int NOT NULL DEFAULT 0,
	`totalItems` int NOT NULL DEFAULT 0,
	`totalEarned` int NOT NULL DEFAULT 0,
	`rank` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weekly_leaderboard_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `welfare_partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`descriptionEn` text,
	`address` text,
	`city` varchar(100),
	`website` varchar(255),
	`logo` varchar(255),
	`totalDonations` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `welfare_partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `displayName` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `preferredLanguage` varchar(10) DEFAULT 'nl';--> statement-breakpoint
ALTER TABLE `users` ADD `totalBottles` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalCans` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalEarned` int DEFAULT 0 NOT NULL;