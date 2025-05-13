// app/ui/DashboardPage.jsx
import { redirect } from "next/navigation";
import { LogoutButton } from "./common/UserSession.js";
import SectionHeader from "./common/SectionHeader.jsx";
import AccountManager from "../../dataServices/accountManager.js";
import ClassService from "../../dataServices/classService.js";
import AdminCards from "./admin/cards";
import InstructorCards from "./instructor/cards";
import StudentCards from "./student/cards";

export default async function DashboardPage({ searchParams }) {
  const userId     = searchParams.userId;
  const searchTerm = searchParams.searchTerm || "";

  // Fetch user; if not found, redirect to login
  const user = await AccountManager.retrieveById(userId);
  if (!user) redirect("/ui/login");

  // Fetch class sessions based on search
  const classes = await ClassService.fetchSessions(searchTerm, user.id, user.role);

  return (
    <>
      <header className="navbar">
        <SectionHeader text="Course Management" />
        <div id="btns-list" className="btns-list">
          <LogoutButton />
          {user.role === "administrator" && (
            <>
              <a href={`/ui/admin/statistics?userId=${userId}`} className="btn-signin">
                Statistics
              </a>
              <a href={`/ui/admin/addCourse?userId=${userId}`} className="btn-signin">
                Add Course
              </a>
              <a href={`/ui/admin/addClass?userId=${userId}`} className="btn-signin">
                Add Class
              </a>
            </>
          )}
        </div>
      </header>

      <div className="search-bar">
        <form method="get" id="className-search" className="cours-search">
          <input
            type="text"
            id="search"
            name="searchTerm"
            placeholder="Search by Name"
            defaultValue={searchTerm}
          />
          <input type="hidden" name="userId" value={userId} />
          <button className="search-btn">Search</button>
        </form>
      </div>

      <main>
        <div id="cours-list" className="cours-list">
          {user.role === "administrator" && <AdminCards classes={classes} />}
          {user.role === "instructor"  && <InstructorCards classes={classes} />}
          {user.role === "student"     && <StudentCards classes={classes} userId={userId} />}
        </div>
      </main>
    </>
  );
}
