import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="space-y-2 text-center">
      <p className="text-ink-secondary">Page not found.</p>
      <Link to="/" className="hover:underline text-accent-soft-text">
        Back to dashboard
      </Link>
    </div>
  )
}
