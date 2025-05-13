import React from "react";
import SectionHeader from "../../common/SectionHeader.jsx";
import { LogoutButton } from "../../common/UserSession.js";
import GoBackButton from "../../instructor/grades/GoBackButton.jsx";
import AddCourseForm from "./AddCourseForm.jsx";
import CurriculumService from "../../../../dataServices/curriculumService.js";

export default async function AddCoursePage() {
  const courses = await CurriculumService.fetchAllCourses();

  return (
    <>
      <SectionHeader text="New Course" />

      <nav className="navbar">
        <div className="navbar-buttons">
          <LogoutButton />
          <GoBackButton />
        </div>
      </nav>

      <section className="form-section">
        <AddCourseForm courses={courses} />
      </section>
    </>
  );
}
