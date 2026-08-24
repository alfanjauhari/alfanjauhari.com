CREATE TABLE `comments` (
	`id` text PRIMARY KEY,
	`ref_table` text NOT NULL,
	`ref_id` text NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`parent_id` text,
	`root_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `comments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT `comments_parent_id_comments_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`),
	CONSTRAINT `comments_root_id_comments_id_fk` FOREIGN KEY (`root_id`) REFERENCES `comments`(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` text PRIMARY KEY,
	`ref_table` text NOT NULL,
	`ref_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_likes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `comments_ref_idx` ON `comments` (`ref_table`,`ref_id`);--> statement-breakpoint
CREATE INDEX `comments_user_idx` ON `comments` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `likes_ref_user_unique` ON `likes` (`ref_table`,`ref_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `likes_ref_idx` ON `likes` (`ref_table`,`ref_id`);