export default function AdminCards({ classes }) {
  return (
    <section className="courses-table">
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Pending</th>
            <th>Registered</th>
            <th>Finalized</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="course_list">
          {classes.map((item) => (
            <tr key={item.id}>
              <td>{item.course.name}</td>
              <td>{item.numberPending || 0}</td>
              <td>{item.numberRegistered || 0}</td>
              <td>{item.numberFinalized || 0}</td>
              <td>
                {item.numberPending !== 0 && (
                  <a
                    href={`/ui/admin/acceptPending?classId=${item.id}`}
                    className="btn btn-secondary"
                  >
                    Manage Pending
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
