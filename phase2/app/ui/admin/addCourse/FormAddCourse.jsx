"use client";

import React, { useRef, useState } from "react";
import Requests from "../../Requests";
import Alert from "../../Alert";

export default function FormAddCourse({ courses }) {
  const [alert, setAlert] = useState("");
  const nameRef = useRef(null);
  const prerequisitesRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const prerequisites = Array.from(
      prerequisitesRef.current.selectedOptions
    ).map((option) => option.value);

    try {
      const req = await Requests.requestPost("/addCourse", {
        name,
        prerequisites,
      });
      const data = await req.json();
      if (data.success) {
        window.history.back();
      } else {
        setAlert(data.message);
      }
    } catch (error) {
      setAlert(error.message);
    }
  };

  return (
    <>
      <Alert message={alert} setAlert={setAlert} />

      <form onSubmit={handleSubmit} className="form" id="form-add-course">
        <h2>Add Course</h2>

        <div className="form-input">
          <label htmlFor="name">Name</label>
          <input
            ref={nameRef}
            type="text"
            id="name"
            name="name"
            required
          />
        </div>

        <div className="form-input">
          <label htmlFor="prerequisites">Prerequisites</label>
          <select
            ref={prerequisitesRef}
            id="prerequisites"
            name="prerequisites"
            multiple
          >
            <option value="" disabled>
              Select prerequisites
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            Add Course
          </button>
        </div>
      </form>
    </>
  );
}
