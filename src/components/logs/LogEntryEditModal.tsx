import { useEffect, useState } from 'react'
import type { LogEntry } from '@/types/models'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { PainSlider } from '@/components/logs/PainSlider'
import { PainFrequencySlider } from '@/components/logs/PainFrequencySlider'
import { RemedyCheckboxGroup } from '@/components/logs/RemedyCheckboxGroup'
import { useInjury } from '@/hooks/useInjury'
import { updateLogEntry } from '@/db/queries/logEntries'
import { toDatetimeLocalValue, fromDatetimeLocalValue } from '@/lib/dates'

interface LogEntryEditModalProps {
  entry: LogEntry
  open: boolean
  onClose: () => void
}

export function LogEntryEditModal({ entry, open, onClose }: LogEntryEditModalProps) {
  const injury = useInjury(entry.injuryId)

  const [painLevel, setPainLevel] = useState<number | undefined>(entry.painLevel)
  const [painFrequency, setPainFrequency] = useState<number | undefined>(entry.painFrequency)
  const [remedyIds, setRemedyIds] = useState<string[]>(entry.remedyIds)
  const [notes, setNotes] = useState(entry.notes ?? '')
  const [timestamp, setTimestamp] = useState(() => toDatetimeLocalValue(entry.timestamp))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setPainLevel(entry.painLevel)
      setPainFrequency(entry.painFrequency)
      setRemedyIds(entry.remedyIds)
      setNotes(entry.notes ?? '')
      setTimestamp(toDatetimeLocalValue(entry.timestamp))
    }
  }, [open, entry])

  const toggleRemedy = (remedyId: string) => {
    setRemedyIds((prev) => (prev.includes(remedyId) ? prev.filter((id) => id !== remedyId) : [...prev, remedyId]))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateLogEntry(entry.id, {
        timestamp: fromDatetimeLocalValue(timestamp),
        painLevel,
        painFrequency,
        remedyIds,
        notes: notes.trim() || undefined,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={injury ? `Edit log entry — ${injury.name}` : 'Edit log entry'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            Save
          </Button>
        </>
      }
    >
      <PainSlider value={painLevel} onChange={setPainLevel} />
      <PainFrequencySlider value={painFrequency} onChange={setPainFrequency} />
      <RemedyCheckboxGroup injuryId={entry.injuryId} selectedRemedyIds={remedyIds} onToggle={toggleRemedy} />

      <div>
        <Label>When</Label>
        <Input type="datetime-local" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How does it feel today? What did you notice?"
          rows={3}
          className="min-h-[52px]"
        />
      </div>
    </Modal>
  )
}
