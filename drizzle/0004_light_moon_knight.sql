CREATE TABLE `ab_test_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testName` varchar(100) NOT NULL,
	`variantKey` varchar(10) NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`eventType` enum('impression','conversion','dismiss') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ab_test_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ab_test_variants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testName` varchar(100) NOT NULL,
	`variantKey` varchar(10) NOT NULL,
	`title` varchar(255) NOT NULL,
	`emoji` varchar(10) NOT NULL,
	`description1` text NOT NULL,
	`highlight1` varchar(255) NOT NULL,
	`description2` text NOT NULL,
	`highlight2` varchar(255) NOT NULL,
	`primaryButtonText` varchar(100) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ab_test_variants_id` PRIMARY KEY(`id`)
);
