import { useNavigate, useParams } from 'react-router-dom'
import { useInjury } from '@/hooks/useInjury'
import { InjuryForm } from '@/components/injuries/InjuryForm'
import { createInjury, updateInjury } from '@/db/queries/injuries'

export function InjuryFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const injury = useInjury(id)

  if (isEdit && injury === undefined) {
    return <p className="text-ink-muted">Loading…</p>
  }

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-semibold text-ink">
        {isEdit ? 'Edit injury' : 'New injury'}
      </h1>
      <InjuryForm
        initial={injury ?? undefined}
        submitLabel={isEdit ? 'Save' : 'Create injury'}
        onSubmit={async (values) => {
          if (isEdit && id) {
            await updateInjury(id, values)
            navigate(`/injuries/${id}`)
          } else {
            const created = await createInjury(values)
            navigate(`/injuries/${created.id}`)
          }
        }}
        onCancel={() => navigate(isEdit && id ? `/injuries/${id}` : '/')}
      />
    </div>
  )
}
