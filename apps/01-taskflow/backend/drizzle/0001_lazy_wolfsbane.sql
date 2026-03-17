PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_task_labels_table` (
	`label_id` text,
	`task_id` text,
	PRIMARY KEY(`label_id`, `task_id`)
);
--> statement-breakpoint
INSERT INTO `__new_task_labels_table`("label_id", "task_id") SELECT "label_id", "task_id" FROM `task_labels_table`;--> statement-breakpoint
DROP TABLE `task_labels_table`;--> statement-breakpoint
ALTER TABLE `__new_task_labels_table` RENAME TO `task_labels_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;