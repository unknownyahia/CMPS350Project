// app/ui/instructor/grades/GradeForm.jsx
"use client";

import React, { useState, useRef } from "react";
import ApiClient from "../../common/ApiClient.js";
import NotificationToast from "../../common/NotificationToast.jsx";

/**
 * Inline form to submit a grade for a student enrollment.
 *
 * @param {number|string} enrollmentId
 */
export default function GradeForm({ enrollmentId }) {
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleSave = async (e) => {
    e.preventDefault();
    const value = inputRef.current.value;

    try {
      const res = await ApiClient.fetchPatch("/enrollments/grades", {
        studentCourseId: enrollmentId,
        grade: value,
      });
      const result = await res.json();
      if (result.success) {
        window.location.reload();
      } else {
        setError(result.errorMessage);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSave} className="grade-form">
        <input
          ref={inputRef}
          type="number"
          min="0"
          max="100"
          required
          placeholder="Grade"
          className="input-grade"
        />
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
      {error && (
        <NotificationToast message={error} clear={() => setError("")} />
      )}
    </>
  );
}
