CREATE TABLE `drops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`machineId` varchar(64) NOT NULL,
	`previousCount` int NOT NULL,
	`newCount` int NOT NULL,
	`itemsAdded` int NOT NULL,
	`claimedBy` varchar(255) NOT NULL DEFAULT 'Scooterpoint',
	`claimedAt` timestamp,
	`status` enum('pending','claimed','expired') NOT NULL DEFAULT 'pending',
	`detectedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `drops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `drops_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`machineId` varchar(64) NOT NULL,
	`itemsCount` int NOT NULL,
	`previousCounter` int NOT NULL,
	`newCounter` int NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `drops_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `machine_status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`machineId` varchar(64) NOT NULL,
	`status` enum('operational','maintenance','offline','full') NOT NULL DEFAULT 'operational',
	`bottleCapacity` int NOT NULL DEFAULT 100,
	`canCapacity` int NOT NULL DEFAULT 100,
	`bottlesCount` int NOT NULL DEFAULT 0,
	`cansCount` int NOT NULL DEFAULT 0,
	`temperature` int,
	`lastKnownCounter` int NOT NULL DEFAULT 0,
	`lastKnownBottles` int NOT NULL DEFAULT 0,
	`lastKnownCans` int NOT NULL DEFAULT 0,
	`lastApiSuccess` timestamp,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `machine_status_id` PRIMARY KEY(`id`),
	CONSTRAINT `machine_status_machineId_unique` UNIQUE(`machineId`)
);
--> statement-breakpoint
CREATE TABLE `pending_drop` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`machineId` varchar(64) NOT NULL DEFAULT '090373',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `pending_drop_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recycling_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userName` varchar(255) NOT NULL,
	`userEmail` varchar(320),
	`userId` int,
	`machineId` varchar(64) NOT NULL,
	`startCount` int NOT NULL,
	`endCount` int,
	`bottleCount` int DEFAULT 0,
	`canCount` int DEFAULT 0,
	`totalItems` int DEFAULT 0,
	`status` enum('active','completed','timeout','cancelled') NOT NULL DEFAULT 'active',
	`startTime` timestamp NOT NULL DEFAULT (now()),
	`endTime` timestamp,
	`lastActivity` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recycling_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `chat_messages`;--> statement-breakpoint
DROP TABLE `machines`;--> statement-breakpoint
DROP TABLE `site_settings`;--> statement-breakpoint
ALTER TABLE `locations` MODIFY COLUMN `country` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `recycling_contributions` MODIFY COLUMN `userId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `weekly_leaderboard` MODIFY COLUMN `userId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `locations` ADD `openingHours` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `locations` ADD `machineId` varchar(64);--> statement-breakpoint
ALTER TABLE `recycling_contributions` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `weekly_leaderboard` ADD `userName` text NOT NULL;--> statement-breakpoint
ALTER TABLE `weekly_leaderboard` ADD `totalWeight` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `postalCode`;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `province`;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `openingHoursWeekday`;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `openingHoursWeekend`;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `closedDays`;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `website`;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `hasParking`;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `hasVintedLocker`;--> statement-breakpoint
ALTER TABLE `locations` DROP COLUMN `isActive`;--> statement-breakpoint
ALTER TABLE `recycling_contributions` DROP COLUMN `displayName`;--> statement-breakpoint
ALTER TABLE `recycling_contributions` DROP COLUMN `glassCount`;--> statement-breakpoint
ALTER TABLE `recycling_contributions` DROP COLUMN `machineId`;--> statement-breakpoint
ALTER TABLE `recycling_contributions` DROP COLUMN `locationId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `displayName`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `preferredLanguage`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `totalBottles`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `totalCans`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `totalEarned`;--> statement-breakpoint
ALTER TABLE `weekly_leaderboard` DROP COLUMN `displayName`;--> statement-breakpoint
ALTER TABLE `weekly_leaderboard` DROP COLUMN `totalItems`;--> statement-breakpoint
ALTER TABLE `welfare_partners` DROP COLUMN `descriptionEn`;--> statement-breakpoint
ALTER TABLE `welfare_partners` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `welfare_partners` DROP COLUMN `totalDonations`;--> statement-breakpoint
ALTER TABLE `welfare_partners` DROP COLUMN `isActive`;