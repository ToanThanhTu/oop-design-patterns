import { Feature } from "#models/task/feature.js"
import { TaskTemplate } from "#models/task/template/taskTemplate.js"

export class FeatureTemplate extends TaskTemplate {
  createDefault(columnId: string): Feature {
    return new Feature({
      columnId,
      description: "Describe the feature, with expected behavior",
      isTemplate: true,
      position: 0,
      priority: "high",
      title: "New Feature",
    })
  }
}
