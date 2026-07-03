export default function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  return (
    <div className={`toast toast-${toast.type}`} role="status">
      <span>{toast.message}</span>
      <button aria-label="Close notification" onClick={onClose} type="button">
        x
      </button>
    </div>
  );
}
