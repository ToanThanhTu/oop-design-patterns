CREATE TABLE `boards_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `columns_table` (
	`board_id` text,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`board_id`) REFERENCES `boards_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `labels_table` (
	`color` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `snapshots_table` (
	`board_id` text,
	`description` text,
	`id` text PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`board_id`) REFERENCES `boards_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subtasks_table` (
	`id` text PRIMARY KEY NOT NULL,
	`is_complete` integer DEFAULT 0 NOT NULL,
	`position` integer NOT NULL,
	`task_id` text,
	`title` text NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `task_labels_table` (
	`label_id` text,
	`task_id` text,
	FOREIGN KEY (`label_id`) REFERENCES `labels_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`task_id`) REFERENCES `tasks_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks_table` (
	`assignee` text,
	`column_id` text,
	`description` text,
	`due_date` text,
	`id` text PRIMARY KEY NOT NULL,
	`is_template` integer DEFAULT 0 NOT NULL,
	`position` integer NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`title` text NOT NULL,
	`type` text DEFAULT 'task' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`column_id`) REFERENCES `columns_table`(`id`) ON UPDATE no action ON DELETE no action
);
