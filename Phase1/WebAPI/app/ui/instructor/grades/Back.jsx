// app/ui/instructor/grades/Back.jsx
"use client";

export default function Back() {
  return (
    <button
      onClick={() => window.history.back()}
      className="btn btn-secondary"
    >
      Back
    </button>
  );
}
