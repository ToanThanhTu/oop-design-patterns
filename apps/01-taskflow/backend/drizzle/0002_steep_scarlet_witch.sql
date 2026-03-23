PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_columns_table` (
	`board_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`board_id`) REFERENCES `boards_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_columns_table`("board_id", "id", "name", "position", "created_at", "updated_at") SELECT "board_id", "id", "name", "position", "created_at", "updated_at" FROM `columns_table`;--> statement-breakpoint
DROP TABLE `columns_table`;--> statement-breakpoint
ALTER TABLE `__new_columns_table` RENAME TO `columns_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_subtasks_table` (
	`id` text PRIMARY KEY NOT NULL,
	`is_complete` integer DEFAULT false NOT NULL,
	`position` integer NOT NULL,
	`task_id` text NOT NULL,
	`title` text NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_subtasks_table`("id", "is_complete", "position", "task_id", "title") SELECT "id", "is_complete", "position", "task_id", "title" FROM `subtasks_table`;--> statement-breakpoint
DROP TABLE `subtasks_table`;--> statement-breakpoint
ALTER TABLE `__new_subtasks_table` RENAME TO `subtasks_table`;--> statement-breakpoint
CREATE TABLE `__new_task_labels_table` (
	`label_id` text NOT NULL,
	`task_id` text NOT NULL,
	PRIMARY KEY(`label_id`, `task_id`)
);
--> statement-breakpoint
INSERT INTO `__new_task_labels_table`("label_id", "task_id") SELECT "label_id", "task_id" FROM `task_labels_table`;--> statement-breakpoint
DROP TABLE `task_labels_table`;--> statement-breakpoint
ALTER TABLE `__new_task_labels_table` RENAME TO `task_labels_table`;--> statement-breakpoint
CREATE TABLE `__new_tasks_table` (
	`assignee` text,
	`column_id` text NOT NULL,
	`description` text,
	`due_date` text,
	`id` text PRIMARY KEY NOT NULL,
	`is_template` integer DEFAULT false NOT NULL,
	`position` integer NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`title` text NOT NULL,
	`type` text DEFAULT 'task' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`column_id`) REFERENCES `columns_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_tasks_table`("assignee", "column_id", "description", "due_date", "id", "is_template", "position", "priority", "title", "type", "created_at", "updated_at") SELECT "assignee", "column_id", "description", "due_date", "id", "is_template", "position", "priority", "title", "type", "created_at", "updated_at" FROM `tasks_table`;--> statement-breakpoint
DROP TABLE `tasks_table`;--> statement-breakpoint
ALTER TABLE `__new_tasks_table` RENAME TO `tasks_table`;