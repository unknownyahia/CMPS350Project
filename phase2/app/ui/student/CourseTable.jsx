// app/ui/student/CourseTable.jsx
import EnrollmentButton from "./EnrollmentButton.jsx";

/**
 * Renders a table of class sessions for a learner.
 *
 * @param {object[]} courses    – Array of session objects
 * @param {string|number} learnerId
 */
export default function CourseTable({ courses, learnerId }) {
  return (
    <section className="course-table">
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Seats Left</th>
            <th>Status</th>
            <th>Grade</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((session) => {
            const enrollment = session.studentCourses?.[0];
            const status     = enrollment?.status;
            const grade      = enrollment?.grade ?? "";
            const seatsLeft  =
              typeof session.maxStudents === "number"
                ? session.maxStudents - (session.studentCourses?.length ?? 0)
                : "";

            return (
              <tr key={session.id}>
                <td>{session.course.name}</td>
                <td>{seatsLeft}</td>
                <td>{status || "Not Enrolled"}</td>
                <td>{grade}</td>
                <td>
                  {status ? (
                    <button className="btn-disabled" disabled>
                      {status}
                    </button>
                  ) : (
                    <EnrollmentButton
                      learnerId={learnerId}
                      sessionId={session.id}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
