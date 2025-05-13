// app/ui/instructor/grades/FormGrade.jsx
"use client";
import React, { useState, useRef } from "react";
import Alert from "../../Alert";
import Requests from "../../Requests";

export default function FormGrade({ studentCourseId }) {
  const [alert, setAlert] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const grade = inputRef.current.value;
    try {
      const req = await Requests.requestPATCH("/enterGrade", {
        studentCourseId,
        grade,
      });
      const data = await req.json();
      if (data.success) {
        window.location.reload();
      } else {
        setAlert(data.message);
      }
    } catch (err) {
      setAlert(err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-inline">
        <input
          ref={inputRef}
          name="grade"
          className="input_grade"
          type="number"
          min="0"
          max="100"
          placeholder="Grade"
          required
        />
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
      <Alert message={alert} setAlert={setAlert} />
    </>
  );
}
