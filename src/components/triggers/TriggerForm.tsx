import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Kbd } from '@/components/ui/Kbd'
import { useFormShortcuts } from '@/hooks/useFormShortcuts'
import { saveShortcutLabel, cancelShortcutLabel } from '@/lib/shortcuts'

interface TriggerFormValues {
  name: string
  description: string
}

interface TriggerFormProps {
  initial?: TriggerFormValues
  submitLabel: string
  onSubmit: (values: TriggerFormValues) => void | Promise<void>
  onCancel?: () => void
}

export function TriggerForm({ initial, submitLabel, onSubmit, onCancel }: TriggerFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [submitting, setSubmitting] = useState(false)

  const doSubmit = async () => {
    if (!name.trim() || submitting) return
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void doSubmit()
  }

  useFormShortcuts({ onSave: doSubmit, onCancel })

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg border border-dashed border-strong p-3">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Trigger Name" required autoFocus />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Notes (optional)"
      />
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting || !name.trim()} className='flex-1'>
          {submitLabel}
          <Kbd>{saveShortcutLabel}</Kbd>
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className='flex-1'>
            Cancel
            <Kbd>{cancelShortcutLabel}</Kbd>
          </Button>
        )}
      </div>
    </form>
  )
}
