import { useState } from 'react'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import type { JournalEntry } from '@/types/models'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { IconButton } from '@/components/ui/IconButton'
import { Kbd } from '@/components/ui/Kbd'
import { formatFullDate } from '@/lib/dates'
import { updateJournalEntry, deleteJournalEntry } from '@/db/queries/journalEntries'
import { useFormShortcuts } from '@/hooks/useFormShortcuts'
import { saveShortcutLabel, cancelShortcutLabel } from '@/lib/shortcuts'

interface JournalEntryCardProps {
  entry: JournalEntry
  isEditing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
}

export function JournalEntryCard({ entry, isEditing, onStartEdit, onStopEdit }: JournalEntryCardProps) {
  const [draft, setDraft] = useState(entry.text)

  const startEdit = () => {
    setDraft(entry.text)
    onStartEdit()
  }

  const cancelEdit = () => {
    setDraft(entry.text)
    onStopEdit()
  }

  const handleSave = async () => {
    const text = draft.trim()
    if (!text) return
    await updateJournalEntry(entry.id, text)
    onStopEdit()
  }

  const handleDelete = async () => {
    if (!confirm('Delete this journal entry? This cannot be undone.')) return
    await deleteJournalEntry(entry.id)
  }

  useFormShortcuts({ onSave: handleSave, onCancel: cancelEdit, enabled: isEditing })

  return (
    <Card>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="font-heading text-xl font-semibold text-ink">{formatFullDate(entry.date)}</div>
        {!isEditing && (
          <div className="flex items-center gap-1">
            <IconButton icon={faPen} label="Edit entry" onClick={startEdit} />
            <IconButton icon={faTrash} tone="danger" label="Delete entry" onClick={handleDelete} />
          </div>
        )}
      </div>

      {isEditing ? (
        <>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[96px] resize-y text-sm!"
            autoFocus
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="ghost" onClick={cancelEdit}>
              Cancel
              <Kbd>{cancelShortcutLabel}</Kbd>
            </Button>
            <Button onClick={handleSave} disabled={!draft.trim()}>
              Save
              <Kbd>{saveShortcutLabel}</Kbd>
            </Button>
          </div>
        </>
      ) : (
        <p className="whitespace-pre-wrap text-[14px] leading-[1.6] text-ink-secondary">{entry.text}</p>
      )}
    </Card>
  )
}
