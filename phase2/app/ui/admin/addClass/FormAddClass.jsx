// app/ui/admin/addClass/FormAddClass.jsx
"use client";

import React, { useRef, useState } from "react";
import Requests from "../../Requests";
import Alert from "../../Alert";

export default function FormAddClass({ courses, instructors }) {
  const [alert, setAlert] = useState("");
  const courseRef = useRef(null);
  const instructorRef = useRef(null);
  const maxStudentsRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseId = courseRef.current.value;
    const instructorId = instructorRef.current.value;
    const maxStudents = maxStudentsRef.current.value;

    try {
      const req = await Requests.requestPost("/addClass", {
        courseId,
        instructorId,
        maxStudents,
      });
      const data = await req.json();
      if (data.success) {
        window.history.back();
      } else {
        setAlert(data.message);
      }
    } catch (err) {
      setAlert(err.message);
    }
  };

  return (
    <>
      <Alert message={alert} setAlert={setAlert} />

      <form onSubmit={handleSubmit} className="form" id="form-add-class">
        <h2>Add Class</h2>

        <div className="form-input">
          <label htmlFor="courseId">Course</label>
          <select ref={courseRef} id="courseId" name="courseId" required>
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
          <select
            ref={instructorRef}
            id="instructorId"
            name="instructorId"
            required
          >
            <option value="" disabled>
              Select an instructor
            </option>
            {instructors.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-input">
          <label htmlFor="maxStudents">Max Students</label>
          <input
            ref={maxStudentsRef}
            type="number"
            id="maxStudents"
            name="maxStudents"
            min="1"
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            Add Class
          </button>
        </div>
      </form>
    </>
  );
}
