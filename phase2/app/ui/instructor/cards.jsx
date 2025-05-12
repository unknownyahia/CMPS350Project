import React from "react";

export default function InstructorCards({ classes }) {
  return (
    <section className="courses-table">
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Registered</th>
            <th>Finalized</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="course_list">
          {classes.map((item) => (
            <tr key={item.id}>
              <td>{item.course.name}</td>
              <td>{item.numberRegistered}</td>
              <td>{item.numberFinalized}</td>
              <td>
                {item.numberRegistered ? (
                  <a
                    href={`/ui/instructor/grades?classId=${item.id}`}
                    className="btn btn-primary"
                  >
                    Enter Grades
                  </a>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}