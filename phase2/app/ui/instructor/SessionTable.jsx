// app/ui/instructor/SessionTable.jsx
import React from "react";

/**
 * Displays a list of class sessions and their registration stats.
 *
 * @param {Object[]} sessions
 * @param {number}   sessions[].id
 * @param {Object}   sessions[].course
 * @param {string}   sessions[].course.name
 * @param {number}   sessions[].numberRegistered
 * @param {number}   sessions[].numberFinalized
 */
export default function SessionTable({ sessions }) {
  return (
    <section className="session-table">
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Registered</th>
            <th>Finalized</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.course.name}</td>
              <td>{session.numberRegistered}</td>
              <td>{session.numberFinalized}</td>
              <td>
                {session.numberRegistered > 0 ? (
                  <a
                    href={`/ui/instructor/grades?classId=${session.id}`}
                    className="btn-primary"
                  >
                    Enter Grades
                  </a>
                ) : (
                  <span className="text-muted">No Students</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
