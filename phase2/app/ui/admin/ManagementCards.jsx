import React from "react";

/**
 * Shows summary of each class session’s enrollments.
 */
export default function ManagementCards({ sessions }) {
  return (
    <section className="sessions-summary">
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Pending</th>
            <th>Registered</th>
            <th>Finalized</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td>{s.course.name}</td>
              <td>{s.numberPending || 0}</td>
              <td>{s.numberRegistered || 0}</td>
              <td>{s.numberFinalized || 0}</td>
              <td>
                {s.numberPending > 0 ? (
                  <a
                    href={`/ui/admin/pendingRegistrations?classId=${s.id}`}
                    className="btn-primary"
                  >
                    Manage
                  </a>
                ) : (
                  <span className="text-muted">None</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
