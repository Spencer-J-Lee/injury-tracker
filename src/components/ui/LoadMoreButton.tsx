export function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-accent-soft-text mt-4 font-semibold hover:underline"
    >
      Load more
    </button>
  );
}
