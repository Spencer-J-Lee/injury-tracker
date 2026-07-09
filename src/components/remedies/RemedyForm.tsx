import { useState, type FormEvent } from 'react'
import type { RemedyType } from '@/types/models'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const TYPE_LABELS: Record<RemedyType, string> = {
  relief: 'Relief (short-term)',
  longterm: 'Long-term',
}

interface RemedyFormValues {
  name: string
  description: string
}

interface RemedyFormProps {
  type: RemedyType
  initial?: RemedyFormValues
  submitLabel: string
  onSubmit: (values: RemedyFormValues) => void | Promise<void>
  onCancel?: () => void
}

export function RemedyForm({ type, initial, submitLabel, onSubmit, onCancel }: RemedyFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() })
      if (!initial) {
        setName('')
        setDescription('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg border border-dashed border-strong p-3">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Remedy name" required />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Notes (optional)"
      />
      <div className="flex items-center gap-2">
        <span className="text-sm text-ink-muted">{TYPE_LABELS[type]}</span>
        <Button type="submit" disabled={submitting || !name.trim()}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
