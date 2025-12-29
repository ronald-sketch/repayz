CREATE TABLE `lifetime_counters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`machineId` varchar(64) NOT NULL,
	`baselineBottles` int NOT NULL DEFAULT 0,
	`baselineCans` int NOT NULL DEFAULT 0,
	`baselineTotal` int NOT NULL DEFAULT 0,
	`accumulatedBottles` int NOT NULL DEFAULT 0,
	`accumulatedCans` int NOT NULL DEFAULT 0,
	`lastDailyBottles` int NOT NULL DEFAULT 0,
	`lastDailyCans` int NOT NULL DEFAULT 0,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lifetime_counters_id` PRIMARY KEY(`id`),
	CONSTRAINT `lifetime_counters_machineId_unique` UNIQUE(`machineId`)
);
