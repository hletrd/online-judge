CREATE TABLE `anti_cheat_events` (
	`id` text PRIMARY KEY NOT NULL,
	`assignment_id` text NOT NULL,
	`user_id` text NOT NULL,
	`event_type` text NOT NULL,
	`details` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ace_assignment_user_idx` ON `anti_cheat_events` (`assignment_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `ace_assignment_type_idx` ON `anti_cheat_events` (`assignment_id`,`event_type`);--> statement-breakpoint
CREATE TABLE `contest_access_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`assignment_id` text NOT NULL,
	`user_id` text NOT NULL,
	`redeemed_at` integer NOT NULL,
	`ip_address` text,
	FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cat_assignment_user_idx` ON `contest_access_tokens` (`assignment_id`,`user_id`);--> statement-breakpoint
ALTER TABLE `assignments` ADD `scoring_model` text DEFAULT 'ioi' NOT NULL;--> statement-breakpoint
ALTER TABLE `assignments` ADD `access_code` text;--> statement-breakpoint
ALTER TABLE `assignments` ADD `freeze_leaderboard_at` integer;--> statement-breakpoint
ALTER TABLE `assignments` ADD `enable_anti_cheat` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `exam_sessions` ADD `ip_address` text;--> statement-breakpoint
ALTER TABLE `submissions` ADD `ip_address` text;