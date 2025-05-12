"use client";
import React, { useEffect, useState } from "react";
import StudentCourse from "../../../../repos/studentCourse";
import Requests from "../../Requests";
import { Logout } from "../../localStorageUser";
import PageTitle from "../../PageTitle";
import Back from "../../instructor/grades/Back";

export default function AcceptPending({ searchParams }) {
  const classId = searchParams.classId;
  const [studentCourses, setStudentCourses] = useState([]);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    async function load() {
      const data = await StudentCourse.getStudentCourses(classId, "pending");
      setStudentCourses(data);
    }
    load();
  }, [classId]);

  const handleAction = async (studentCourseId, action) => {
    try {
      let res;
      if (action === "accept") {
        res = await Requests.requestPATCH("/acceptPending", { studentCourseId });
      } else {
        res = await Requests.requestDelete("/acceptPending", { studentCourseId });
      }
      const result = await res.json();
      if (result.success) {
        setStudentCourses((prev) => prev.filter((sc) => sc.id !== studentCourseId));
      } else {
        setAlert(result.message);
      }
    } catch (err) {
      setAlert(err.message);
    }
  };

  return (
    <>
      <PageTitle title="Management students, courses." />
      <main>
        <nav className="navbar">
          <div className="navbar-brand">Pending Registrations</div>
          <div className="navbar-buttons">
            <button className="btn" onClick={() => Logout()}>
              Logout
            </button>
            <Back />
          </div>
        </nav>

        <section className="courses-table">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="pending_list">
              {studentCourses.map((sc) => (
                <tr key={sc.id}>
                  <td>{sc.student.name}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleAction(sc.id, "accept")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleAction(sc.id, "remove")}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div
          id="alert_box"
          className="alert"
          style={{ display: alert ? "block" : "none" }}
        >
          {alert}
        </div>
      </main>
    </>
  );
}
