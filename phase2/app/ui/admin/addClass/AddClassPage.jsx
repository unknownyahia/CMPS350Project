import React from "react";
import SectionHeader from "../../common/SectionHeader.jsx";
import { LogoutButton } from "../../common/UserSession.js";
import GoBackButton from "../../instructor/grades/GoBackButton.jsx";
import AddClassForm from "./AddClassForm.jsx";
import CurriculumService from "../../../../dataServices/curriculumService.js";
import AccountManager    from "../../../../dataServices/accountManager.js";

export default async function AddClassPage() {
  const [courses, instructors] = await Promise.all([
    CurriculumService.fetchAllCourses(),
    AccountManager.listInstructors(),
  ]);

  return (
    <>
      <SectionHeader text="New Class Session" />

      <nav className="navbar">
        <div className="navbar-buttons">
          <LogoutButton />
          <GoBackButton />
        </div>
      </nav>

      <section className="form-section">
        <AddClassForm courses={courses} instructors={instructors} />
      </section>
    </>
  );
}
