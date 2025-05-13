// app/ui/instructor/grades/GoBackButton.jsx
"use client";

/**
 * Button that navigates back in browser history.
 */
export default function GoBackButton() {
  return (
    <button
      type="button"
      className="btn-secondary"
      onClick={() => window.history.back()}
    >
      Go Back
    </button>
  );
}
