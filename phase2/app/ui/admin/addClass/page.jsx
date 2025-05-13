// app/ui/admin/addClass/page.jsx
import Courses from "../../../../repos/courses";
import Users from "../../../../repos/user";
import { Logout } from "../../localStorageUser";
import PageTitle from "../../PageTitle";
import FormAddClass from "./FormAddClass";
import Back from "../../instructor/grades/Back";

export default async function AddClassPage() {
  // Fetch courses and instructors from your existing repos
  const [courses, instructors] = await Promise.all([
    Courses.getCourses(),
    Users.getInstructors(),
  ]);

  return (
    <>
      <PageTitle title="Management students, courses." />
      <main>
        <nav className="navbar">
          <div className="navbar-buttons">
            <Logout />
            <Back />
          </div>
        </nav>
        <section className="form-section">
          <FormAddClass courses={courses} instructors={instructors} />
        </section>
      </main>
    </>
  );
}
