"use client";

import React, { useRef, useState } from "react";
import ApiClient from "../../common/ApiClient.js";
import NotificationToast from "../../common/NotificationToast.jsx";
import SectionHeader from "../../common/SectionHeader.jsx";

export default function AddCourseForm({ courses }) {
  const [msg, setMsg] = useState("");
  const nameRef     = useRef(null);
  const prereqRef   = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseName  = nameRef.current.value;
    const prereqIds   = Array.from(
      prereqRef.current.selectedOptions
    ).map((opt) => opt.value);

    try {
      const res = await ApiClient.fetchPost("/courses", {
        name: courseName,
        prerequisites: prereqIds,
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

      <form id="add-course-form" className="form" onSubmit={handleSubmit}>
        <SectionHeader text="Add Course" />

        <div className="form-input">
          <label htmlFor="name">Course Name</label>
          <input ref={nameRef} type="text" id="name" required />
        </div>

        <div className="form-input">
          <label htmlFor="prerequisites">Prerequisites</label>
          <select
            ref={prereqRef}
            id="prerequisites"
            multiple
          >
            <option value="" disabled>
              Select prerequisites
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            Create Course
          </button>
        </div>
      </form>
    </>
  );
}
