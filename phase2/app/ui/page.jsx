// phase2/app/layout.js

import { redirect } from "next/navigation";
import { Logout } from "./localStorageUser";
import PageTitle from "./PageTitle";
import User from "../../repos/user";
import Classes from "../../repos/classes";
import AdminCards from "./admin/cards";
import InstructorCards from "./instructor/cards";
import StudentCards from "./student/cards";

const getUser = async (userId) => {
  if (!userId) {
    redirect("/ui/login");
  }
  const user = await User.getUserById(userId);
  if (!user) {
    redirect("/ui/login");
  }
  return user;
};

const getClasses = async (user, searchTerm) => {
  if (user.role === "administrator") {
    return await Classes.getClasses({ searchTerm });
  } else if (user.role === "instructor") {
    return await Classes.getClasses({ searchTerm, instructorId: user.id });
  } else if (user.role === "student") {
    return await Classes.getClasses({ searchTerm, studentId: user.id });
  } else {
    redirect("/ui/login");
  }
};

export default async function MainPage({ searchParams }) {
  const userId     = (await searchParams).userId;
  const searchTerm = (await searchParams).searchTerm;
  const user       = await getUser(userId);
  const classes    = await getClasses(user, searchTerm);

  return (
    <>
      {/* Navbar: title on left, logout & admin links on right */}
      <header className="navbar">
        <header className="page-header">
        <div className="header-container">
          <img
            src="https://www.qu.edu.qa/Style%20Library/assets/images/qulogo.png"
            alt="Qatar University Logo"
            className="logo"
          />
        </div>
      </header>
        <div id="btns-list" className="btns-list">
          <Logout />
          {user.role === "administrator" && (
            <>
              <a
                href={`/ui/admin/statistics?userId=${userId}`}
                className="btn-signin"
              >
                Statistics
              </a>
              <a
                href={`/ui/admin/addCourse?userId=${userId}`}
                className="btn-signin"
              >
                Add Course
              </a>
              <a
                href={`/ui/admin/addClass?userId=${userId}`}
                className="btn-signin"
              >
                Add Class
              </a>
            </>
          )}
        </div>
      </header>

      {/* Centered search bar */}
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

      {/* Main content: cards */}
      <main>
        <div id="cours-list" className="cours-list">
          {user.role === "administrator" && (
            <AdminCards classes={classes} />
          )}
          {user.role === "instructor" && (
            <InstructorCards classes={classes} />
          )}
          {user.role === "student" && (
            <StudentCards classes={classes} userId={userId} />
          )}
        </div>
      </main>
    </>
  );
}
