import users from "../../data/users/users.js";
import createResponse from "../../response.js";
import students from "../../data/students/students.js";
import studentsClasses from "../../data/studentCourses/studentsClasses.js";
import instructors from "../../data/instructors/instructors.js";
import classes from "../../data/classes/classes.js";
import administrators from "../../data/administrators/administrators.js";
export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");
  const search = searchParams.get("search");
  const user = await users.getUserById(userId);
  if (user.role === "student") {
    const student = await students.getStudentByUserId(userId);
    const classesData = search
      ? await studentsClasses.getAllClassesByStudentIdAndName(
          student.id,
          search
        )
      : await studentsClasses.getAllClassesByStudentId(student.id);
    return createResponse({ data: classesData });
  } else if (user.role === "instructor") {
    const instructor = await instructors.getInstructorByUserId(user.id);
    const classesData = search
      ? await classes.getClassesByInstructorIdAndName(instructor.id, search)
      : await classes.getClassesByInstructorId(instructor.id);
    return createResponse({ data: classesData });
  } else if (user.role === "administrator") {
    const classesData = search
      ? await classes.getAllClassesByName(search)
      : await classes.getAll();
    return createResponse({ data: classesData });
  }
  return createResponse({ error: "Invalid username or password", status: 401 });
}
