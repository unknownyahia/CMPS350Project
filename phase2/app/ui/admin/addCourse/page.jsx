// app/ui/admin/addCourse/page.jsx

import Courses from "../../../../repos/courses";
import { Logout } from "../../localStorageUser";
import PageTitle from "../../PageTitle";
import FormAddCourse from "./FormAddCourse";
import Back from "../../instructor/grades/Back";

export default async function AddCoursePage() {
  // fetch on the server
  const courses = await Courses.getCourses();

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
          <FormAddCourse courses={courses} />
        </section>
      </main>
    </>
  );
}
