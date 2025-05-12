"use client";
import React, { useRef, useState } from "react";
import Requests from "../../Requests";
import Alert from "../../Alert";

export default function FormAddClass({ courses, instractors }) {
  const [alert, setAlert] = useState("");

  const maxStudentsRef = useRef(null);
  const courseRef = useRef(null);
  const instructorRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseId = courseRef.current.value;
    const instructorId = instructorRef.current.value;
    const maxStudents = maxStudentsRef.current.value;
    try {
      const request = await Requests.requestPost(`/addClass`, {
        courseId,
        instructorId,
        maxStudents,
      });
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
    <form onSubmit={handleSubmit}
      className="cours-form"
      id="cours-form"
    >
      <Alert message={alert} setAlert={setAlert} />
      <h1>add className</h1>
      <div className="form-input">
        <label htmlFor="courseId">Course</label>
        <select defaultValue={"null"} ref={courseRef} id="courseId" name="courseId">
          <option value="null" disabled>
            --------
          </option>
          $
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>
      <div className="form-input">
        <label htmlFor="instructorId">instructor</label>
        <select defaultValue={"null"} ref={instructorRef} id="instructorId" name="instructorId">
          <option value="null" disabled>
            --------
          </option>
          $
          {instractors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
          ))}
        </select>
      </div>
      <div className="form-input">
        <label htmlFor="maxStudents">max Students</label>
        <input
          ref={maxStudentsRef}
          type="number"
          id="maxStudents"
          name="maxStudents"
          required
        />
      </div>
      <div className="form-btns">
        <input type="submit" value="Add" />
      </div>
    </form>
  );
}
