import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Kbd } from '@/components/ui/Kbd'
import { InjurySelector } from '@/components/logs/InjurySelector'
import { PainSlider } from '@/components/logs/PainSlider'
import { PainFrequencySlider } from '@/components/logs/PainFrequencySlider'
import { RemedyCheckboxGroup } from '@/components/logs/RemedyCheckboxGroup'
import { useLogModal } from '@/context/LogModalContext'
import { useInjuries } from '@/hooks/useInjuries'
import { createLogSession } from '@/db/queries/logEntries'
import { toDatetimeLocalValue, fromDatetimeLocalValue } from '@/lib/dates'
import { saveShortcutLabel, cancelShortcutLabel } from '@/lib/shortcuts'

interface PerInjuryState {
  painLevel?: number
  painFrequency?: number
  remedyIds: string[]
}

export function LogEntryModal() {
  const { state, closeLogModal } = useLogModal()
  const injuries = useInjuries() ?? []

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [perInjury, setPerInjury] = useState<Record<string, PerInjuryState>>({})
  const [notes, setNotes] = useState('')
  const [timestamp, setTimestamp] = useState(() => toDatetimeLocalValue(new Date().toISOString()))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (state.open) {
      setSelectedIds(state.initialInjuryIds)
      setPerInjury(
        Object.fromEntries(
          state.initialInjuryIds.map((id) => [id, { painLevel: undefined, painFrequency: undefined, remedyIds: [] }]),
        ),
      )
      setNotes('')
      setTimestamp(toDatetimeLocalValue(new Date().toISOString()))
    }
  }, [state.open, state.initialInjuryIds])

  const toggleInjury = (injuryId: string) => {
    setSelectedIds((prev) =>
      prev.includes(injuryId) ? prev.filter((id) => id !== injuryId) : [...prev, injuryId],
    )
    setPerInjury((prev) =>
      prev[injuryId] ? prev : { ...prev, [injuryId]: { painLevel: undefined, painFrequency: undefined, remedyIds: [] } },
    )
  }

  const setPainLevel = (injuryId: string, painLevel: number | undefined) => {
    setPerInjury((prev) => ({ ...prev, [injuryId]: { ...prev[injuryId], painLevel, remedyIds: prev[injuryId]?.remedyIds ?? [] } }))
  }

  const setPainFrequency = (injuryId: string, painFrequency: number | undefined) => {
    setPerInjury((prev) => ({
      ...prev,
      [injuryId]: { ...prev[injuryId], painFrequency, remedyIds: prev[injuryId]?.remedyIds ?? [] },
    }))
  }

  const toggleRemedy = (injuryId: string, remedyId: string) => {
    setPerInjury((prev) => {
      const current = prev[injuryId]?.remedyIds ?? []
      const remedyIds = current.includes(remedyId)
        ? current.filter((id) => id !== remedyId)
        : [...current, remedyId]
      return { ...prev, [injuryId]: { ...prev[injuryId], remedyIds } }
    })
  }

  const handleSave = async () => {
    if (selectedIds.length === 0) return
    setSaving(true)
    try {
      await createLogSession({
        timestamp: fromDatetimeLocalValue(timestamp),
        notes: notes.trim() || undefined,
        injuries: selectedIds.map((injuryId) => ({
          injuryId,
          painLevel: perInjury[injuryId]?.painLevel,
          painFrequency: perInjury[injuryId]?.painFrequency,
          remedyIds: perInjury[injuryId]?.remedyIds ?? [],
        })),
      })
      closeLogModal()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={state.open}
      onClose={closeLogModal}
      onSave={handleSave}
      title="Log entry"
      footer={
        <>
          <Button onClick={handleSave} disabled={saving || selectedIds.length === 0}>
            Submit
            <Kbd>{saveShortcutLabel}</Kbd>
          </Button>
          <Button variant="ghost" onClick={closeLogModal}>
            Cancel
            <Kbd>{cancelShortcutLabel}</Kbd>
          </Button>
        </>
      }
    >
      <InjurySelector injuries={injuries} selectedIds={selectedIds} onToggle={toggleInjury} />

      {selectedIds.map((injuryId) => {
        const injury = injuries.find((i) => i.id === injuryId)
        if (!injury) return null
        return (
          <div key={injuryId} className="space-y-[14px] rounded-[14px] border border-subtle p-[14px]">
            <p className="text-sm font-semibold text-ink mb-4">{injury.name}</p>
            <PainSlider
              value={perInjury[injuryId]?.painLevel}
              onChange={(value) => setPainLevel(injuryId, value)}
            />
            <PainFrequencySlider
              value={perInjury[injuryId]?.painFrequency}
              onChange={(value) => setPainFrequency(injuryId, value)}
            />
            <RemedyCheckboxGroup
              injuryId={injuryId}
              selectedRemedyIds={perInjury[injuryId]?.remedyIds ?? []}
              onToggle={(remedyId) => toggleRemedy(injuryId, remedyId)}
            />
          </div>
        )
      })}

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
          autoFocus
        />
      </div>
    </Modal>
  )
}
