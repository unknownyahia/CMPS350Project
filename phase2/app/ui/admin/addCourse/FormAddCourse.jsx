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
    const request = await Requests.requestPost(`/addCourse`, {
      name,
      prerequisites,
    });
    try {
      const data = await request.json();
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
    <form onSubmit={handleSubmit} className="cours-form" id="cours-form">
      <Alert message={alert} setAlert={setAlert} />
      <h1>add course</h1>
      <div className="form-input">
        <label htmlFor="name">name</label>
        <input ref={nameRef} type="text" id="name" name="name" required />
      </div>
      <div className="form-input">
        <label htmlFor="prerequisites">prerequisites</label>
        <select
          ref={prerequisitesRef}
          id="prerequisites"
          name="prerequisites"
          multiple
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>

      <div className="form-btns">
        <input type="submit" value="Add" />
      </div>
    </form>
  );
}
