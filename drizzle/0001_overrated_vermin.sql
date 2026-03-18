CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`session_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`problem_id` text,
	`model` text,
	`provider` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `exam_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`assignment_id` text NOT NULL,
	`user_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`personal_deadline` integer NOT NULL,
	FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exam_sessions_assignment_user_idx` ON `exam_sessions` (`assignment_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `exam_sessions_assignment_idx` ON `exam_sessions` (`assignment_id`);--> statement-breakpoint
CREATE INDEX `exam_sessions_user_idx` ON `exam_sessions` (`user_id`);--> statement-breakpoint
ALTER TABLE `assignments` ADD `exam_mode` text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE `assignments` ADD `exam_duration_minutes` integer;--> statement-breakpoint
ALTER TABLE `problems` ADD `comparison_mode` text DEFAULT 'exact' NOT NULL;--> statement-breakpoint
ALTER TABLE `problems` ADD `float_absolute_error` real;--> statement-breakpoint
ALTER TABLE `problems` ADD `float_relative_error` real;