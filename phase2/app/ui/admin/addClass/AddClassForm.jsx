"use client";

import React, { useRef, useState } from "react";
import ApiClient from "../../common/ApiClient.js";
import NotificationToast from "../../common/NotificationToast.jsx";
import SectionHeader from "../../common/SectionHeader.jsx";

export default function AddClassForm({ courses, instructors }) {
  const [msg, setMsg] = useState("");
  const courseRef     = useRef(null);
  const instrRef      = useRef(null);
  const capacityRef   = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseId     = courseRef.current.value;
    const instructorId = instrRef.current.value;
    const maxStudents  = capacityRef.current.value;

    try {
      const res = await ApiClient.fetchPost("/classes", {
        courseId,
        instructorId,
        maxStudents,
      });
      const result = await res.json();
      if (result.success) {
        window.history.back();
      } else {
        setMsg(result.errorMessage);
      }
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <>
      {msg && <NotificationToast message={msg} clear={() => setMsg("")} />}

      <form id="add-class-form" className="form" onSubmit={handleSubmit}>
        <SectionHeader text="Add Class" />

        <div className="form-input">
          <label htmlFor="courseId">Course</label>
          <select ref={courseRef} id="courseId" required>
            <option value="" disabled>
              Select a course
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-input">
          <label htmlFor="instructorId">Instructor</label>
          <select ref={instrRef} id="instructorId" required>
            <option value="" disabled>
              Select an instructor
            </option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-input">
          <label htmlFor="maxStudents">Max Students</label>
          <input
            ref={capacityRef}
            type="number"
            id="maxStudents"
            min="1"
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            Create Class
          </button>
        </div>
      </form>
    </>
  );
}
