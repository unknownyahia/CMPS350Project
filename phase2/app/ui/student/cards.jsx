import RegisterButton from "./RegisterButton";

export default function StudentCards({ classes, userId }) {
  return (
    <section className="courses-table">
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Available Seats</th>
            <th>Status</th>
            <th>Grade</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="course_list">
          {classes.map((cls) => {
            const studentCourse = cls.studentCourses[0];
            const status = studentCourse?.status;
            const grade = studentCourse?.grade;
            // compute available seats if your class object has a capacity field
            const availableSeats =
              typeof cls.capacity !== "undefined"
                ? cls.capacity - (cls.studentCourses?.length || 0)
                : "";

            return (
              <tr key={cls.id}>
                <td>{cls.course.name}</td>
                <td>{availableSeats}</td>
                <td>{status || "Not Registered"}</td>
                <td>{grade != null ? grade : ""}</td>
                <td>
                  {status ? (
                    <button className="btn" disabled>
                      {status}
                    </button>
                  ) : (
                    <RegisterButton userId={userId} classId={cls.id} />
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
