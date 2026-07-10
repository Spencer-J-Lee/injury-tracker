import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface RemedyFormValues {
  name: string
  description: string
}

interface RemedyFormProps {
  initial?: RemedyFormValues
  submitLabel: string
  onSubmit: (values: RemedyFormValues) => void | Promise<void>
  onCancel?: () => void
}

export function RemedyForm({ initial, submitLabel, onSubmit, onCancel }: RemedyFormProps) {
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
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Remedy Name" required />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Notes (optional)"
      />
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting || !name.trim()} className='flex-1'>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className='flex-1'>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
