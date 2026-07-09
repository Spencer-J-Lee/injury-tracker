import { useState, type FormEvent } from 'react'
import type { Injury, InjuryStatus } from '@/types/models'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'

interface InjuryFormValues {
  name: string
  description: string
  status: InjuryStatus
}

interface InjuryFormProps {
  initial?: Injury
  onSubmit: (values: InjuryFormValues) => void | Promise<void>
  onCancel: () => void
  submitLabel: string
}

export function InjuryForm({ initial, onSubmit, onCancel, submitLabel }: InjuryFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<InjuryStatus>(initial?.status ?? 'active')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim(), status })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label size="md">Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Right hand, pinky-side pain"
          required
        />
      </div>
      {initial && (
        <div>
          <Label size="md">Status</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as InjuryStatus)}>
            <option value="active">Active</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
          </Select>
        </div>
      )}
      <div>
        <Label size="md">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any other details worth noting"
          rows={3}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting || !name.trim()}>
          {submitLabel}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
