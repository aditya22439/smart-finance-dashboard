export default function ConfirmDialog({
  expense,
  isDeleting,
  onCancel,
  onConfirm
}) {
  if (!expense) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-labelledby="delete-dialog-title"
        aria-modal="true"
        className="confirm-dialog"
        role="dialog"
      >
        <h2 id="delete-dialog-title">Delete expense?</h2>
        <p>
          This will permanently remove the {expense.category || "selected"} expense
          of Rs {Number(expense.amount || 0).toLocaleString("en-IN")}.
        </p>
        <div className="dialog-actions">
          <button className="secondary-button" onClick={onCancel} type="button">
            Cancel
          </button>
          <button
            className="danger-button"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}
