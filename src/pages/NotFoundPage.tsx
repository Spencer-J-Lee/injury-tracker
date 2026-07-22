import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="space-y-2.5 text-center">
      <p className="text-ink-secondary">Page not found.</p>
      <Link to="/" className="text-accent-soft-text hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
