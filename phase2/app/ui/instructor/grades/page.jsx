// app/ui/instructor/grades/page.jsx
import StudentCourse from "../../../../repos/studentCourse";
import { Logout } from "../../localStorageUser";
import Back from "./Back";
import PageTitle from "../../PageTitle";
import FormGrade from "./FormGrade";

export default async function GradesPage({ searchParams }) {
  // Next.js automatically parses searchParams for server components:
  const classId = searchParams.classId;
  const studentCourses = await StudentCourse.getStudentCourses(
    classId,
    "registered"
  );

  return (
    <>
      <PageTitle title="Enter Grades" />
      <main>
        <nav className="navbar">
          <div className="navbar-buttons">
            <Logout />
            <Back />
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
                    <FormGrade studentCourseId={sc.id} />
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
