// app/ui/admin/acceptPending/page.jsx
import StudentCourse from "../../../../services/studentCourseService";
import { Logout } from "../../localStorageUser";
import PageTitle from "../../PageTitle";
import ActionAccept from "./ActionAccept";
import Back from "../../instructor/grades/Back";

export default async function PendingPage({ searchParams }) {
  const classId = searchParams.classId;
  const studentCourses = await StudentCourse.getStudentCourses(
    classId,
    "pending"
  );
  const courseName = studentCourses[0]?.class?.course?.name || "";

  return (
    <>
      <PageTitle title={`Pending Registrations: ${courseName}`} />
      <main>
        <nav className="navbar">
          <div className="navbar-buttons">
            <Logout />
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
            <tbody>
              {studentCourses.map((sc) => (
                <tr key={sc.id}>
                  <td>{sc.student.name}</td>
                  <td>
                    <ActionAccept studentCourseId={sc.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div id="alert_box" className="alert" />
      </main>
    </>
  );
}
