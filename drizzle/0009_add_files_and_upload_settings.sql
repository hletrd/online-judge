CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`original_name` text NOT NULL,
	`stored_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`category` text NOT NULL DEFAULT 'attachment',
	`width` integer,
	`height` integer,
	`uploaded_by` text REFERENCES `users`(`id`) ON DELETE set null,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `files_uploaded_by_idx` ON `files` (`uploaded_by`);
--> statement-breakpoint
CREATE INDEX `files_category_idx` ON `files` (`category`);
--> statement-breakpoint
CREATE INDEX `files_created_at_idx` ON `files` (`created_at`);
--> statement-breakpoint
ALTER TABLE `system_settings` ADD `upload_max_image_size_bytes` integer;
--> statement-breakpoint
ALTER TABLE `system_settings` ADD `upload_max_file_size_bytes` integer;
--> statement-breakpoint
ALTER TABLE `system_settings` ADD `upload_max_image_dimension` integer;
