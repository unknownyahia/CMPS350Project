import React from "react";
import SectionHeader from "../../common/SectionHeader.jsx";
import { LogoutButton } from "../../common/UserSession.js";
import ApprovalActions from "./ApprovalActions.jsx";
import GoBackButton from "../../instructor/grades/GoBackButton.jsx";
import EnrollmentService from "../../../../dataServices/enrollmentService.js";

export default async function PendingRegistrationsPage({ searchParams }) {
  const classId     = searchParams.classId;
  const pendingList = await EnrollmentService.getStudentCourses(
    classId,
    "pending"
  );
  const courseName  = pendingList[0]?.class.course.name || "";

  return (
    <>
      <SectionHeader text={`Pending Registrations: ${courseName}`} />

      <nav className="navbar">
        <div className="navbar-buttons">
          <LogoutButton />
          <GoBackButton />
        </div>
      </nav>

      <section className="course-table">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingList.map((enroll) => (
              <tr key={enroll.id}>
                <td>{enroll.student.name}</td>
                <td>
                  <ApprovalActions enrollmentId={enroll.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
