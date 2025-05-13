// app/ui/instructor/grades/GradesPage.jsx
import React from "react";
import SectionHeader from "../../common/SectionHeader.jsx";
import { LogoutButton } from "../../common/UserSession.js";
import SessionTable from "../SessionTable.jsx";
import GoBackButton from "./GoBackButton.jsx";
import GradeForm from "./GradeForm.jsx";
import EnrollmentService from "../../../../dataServices/enrollmentService.js";

/**
 * Server component for instructors to enter grades.
 */
export default async function GradesPage({ searchParams }) {
  const classId = searchParams.classId;
  const studentCourses = await EnrollmentService.getStudentCourses(
    classId,
    "registered"
  );

  return (
    <>
      <SectionHeader text="Enter Grades" />

      <nav className="navbar">
        <div className="navbar-buttons">
          <LogoutButton />
          <GoBackButton />
        </div>
      </nav>

      <section className="grades-table-section">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {studentCourses.map((sc) => (
              <tr key={sc.id}>
                <td>{sc.student.name}</td>
                <td>
                  <GradeForm enrollmentId={sc.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
