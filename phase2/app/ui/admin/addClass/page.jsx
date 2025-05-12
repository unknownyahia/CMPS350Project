"use client";
import React, { useState } from "react";
import { Logout } from "../../localStorageUser";
import PageTitle from "../../PageTitle";
import Back from "../../instructor/grades/Back";
import FormAddClass from "./FormAddClass";

export default function AddClassPage({ searchParams }) {
  const courses = searchParams.courses;
  const instructors = searchParams.instructors;
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
          <FormAddClass
            courses={courses}
            instructors={instructors}
            setAlert={setAlert}
          />
        </section>
      </main>
    </>
  );
}
