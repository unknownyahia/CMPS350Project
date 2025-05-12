"use client";
import React, { useState } from "react";
import { Logout } from "../../localStorageUser";
import PageTitle from "../../PageTitle";
import Back from "../../instructor/grades/Back";
import FormAddCourse from "./FormAddCourse";

export default function AddCoursePage({ searchParams }) {
  const courses = searchParams.courses;
  const [alert, setAlert] = useState("");

  return (
    <>
      <PageTitle title="Management students, courses." />
      <main>
        <nav className="navbar">
          <button className="btn" onClick={() => Logout()}>
            Logout
          </button>
          <Back />
        </nav>
        <section className="form-section">
          <div
            id="alert_box"
            className="alert"
            style={{ display: alert ? "block" : "none" }}
          >
            {alert}
          </div>
          <FormAddCourse courses={courses} setAlert={setAlert} />
        </section>
      </main>
    </>
  );
}