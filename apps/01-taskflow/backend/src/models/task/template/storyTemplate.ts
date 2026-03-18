import { Story } from "#models/task/story.js"
import { TaskTemplate } from "#models/task/template/taskTemplate.js"

export class StoryTemplate extends TaskTemplate {
  createDefault(columnId: string): Story {
    return new Story({
      columnId,
      description: "Describe the story",
      isTemplate: true,
      position: 0,
      priority: "high",
      title: "New Story",
    })
  }
}
