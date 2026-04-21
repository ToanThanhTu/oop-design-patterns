import type { Label } from '@/modules/labels/entities/label'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'

interface TaskLabelListProps {
  taskId: string
}

export default function TaskLabelList({ taskId }: TaskLabelListProps) {
  const labelFetcher = useFetcher<Label[]>()

  useEffect(() => {
    if (labelFetcher.state === 'idle' && !labelFetcher.data) {
      labelFetcher.load(`/api/tasks/${taskId}/labels`)
    }
  }, [labelFetcher, taskId])

  const labels = labelFetcher.data ?? []
  const isLoading = labelFetcher.state === 'loading' && !labelFetcher.data

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Labels
      </h3>
      {isLoading ? (
        <p className="text-sm text-muted-foreground italic">Loading labels…</p>
      ) : labels.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No labels</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <li key={label.id}>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${label.color}20`,
                  borderColor: `${label.color}40`,
                  color: label.color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                {label.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
