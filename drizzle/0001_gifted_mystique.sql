CREATE TABLE `canteen_status` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`current_crowd_level` text NOT NULL,
	`last_updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `class_schedules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`day_of_week` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`class_name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `food_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`image_url` text NOT NULL,
	`caption` text NOT NULL,
	`hashtags` text,
	`likes_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `group_order_participants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_order_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`order_items` text NOT NULL,
	`amount` real NOT NULL,
	FOREIGN KEY (`group_order_id`) REFERENCES `group_orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `group_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`join_code` text NOT NULL,
	`creator_id` text NOT NULL,
	`group_name` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`total_amount` real DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_orders_join_code_unique` ON `group_orders` (`join_code`);--> statement-breakpoint
CREATE TABLE `help_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`image_url` text,
	`category` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meal_preferences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`budget_range` text NOT NULL,
	`diet_preference` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `meal_preferences_user_id_unique` ON `meal_preferences` (`user_id`);--> statement-breakpoint
CREATE TABLE `post_comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`comment` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `food_posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `post_likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `food_posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pre_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`order_items` text NOT NULL,
	`pickup_time` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`total_orders` integer DEFAULT 0 NOT NULL,
	`total_spent` real DEFAULT 0 NOT NULL,
	`badges` text,
	`rank` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_stats_user_id_unique` ON `user_stats` (`user_id`);--> statement-breakpoint
CREATE TABLE `wallet_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wallet_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`amount` real NOT NULL,
	`transaction_type` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`balance` real DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wallets_user_id_unique` ON `wallets` (`user_id`);