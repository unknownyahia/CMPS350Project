// ------------------------------------------------
// ErrorDisplay: Utility to show error messages
// ------------------------------------------------
class ErrorDisplay {
  static show(message) {
    const alertElement = document.querySelector("#alert_box");
    alertElement.style.display = "block";
    alertElement.textContent = message;
    setTimeout(() => {
      alertElement.style.display = "none";
      alertElement.textContent = "";
    }, 3000);
    alertElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ------------------------------------------------
// ApiClient: Simplified wrapper for HTTP requests
// ------------------------------------------------
const BASE_API = "http://localhost:3000/api";
class ApiClient {
  static async get(endpoint) {
    return fetch(BASE_API + endpoint);
  }
  static async post(endpoint, payload) {
    return fetch(BASE_API + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
  static async patch(endpoint, payload) {
    return fetch(BASE_API + endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
  static async remove(endpoint, payload) {
    return fetch(BASE_API + endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
}

// ------------------------------------------------
// UserAuth: Handles user authentication and session storage
// ------------------------------------------------
class UserAuth {
  static saveUser(user) {
    localStorage.setItem("userData", JSON.stringify(user));
  }
  static logout() {
    localStorage.removeItem("userData");
    window.location.reload();
  }
  static getCurrentUser() {
    return JSON.parse(localStorage.getItem("userData"));
  }
  static async processLogin(event) {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    try {
      // Updated endpoint: /login -> /session
      const res = await ApiClient.post('/session', { username, password });
      const data = await res.json();
      if (data.success) {
        UserAuth.saveUser(data.data);
        Dashboard.showMain();
      } else {
        ErrorDisplay.show(data.message);
      }
    } catch (error) {
      ErrorDisplay.show(error.message);
    }
  }
  static displayLogin() {
    const mainArea = document.querySelector("main");
    mainArea.innerHTML = `
      <div class="login-page-wrapper">
        <div class="login-title-box">
          <h2 class="login-title">SIGN IN</h2>
        </div>
        <div class="login-box">
          <div id="alert_box" class="alert" style="display:none;"></div>
          <form class="login-form" id="login_form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required placeholder="200240XYZ@stu.edu.qa" />
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required placeholder="Password" />
            <button type="submit" class="btn-signin">SIGN IN</button>
          </form>
        </div>
      </div>
      <footer class="page-footer">
        <p>© 2025 Inc | All Rights Reserved</p>
      </footer>
    `;
    const form = document.querySelector("#login_form");
    form.addEventListener("submit", UserAuth.processLogin);
  }
}

// ------------------------------------------------
// GradeEntry: For instructors to input student grades
// ------------------------------------------------
class GradeEntry {
  static async displayGrades(sectionId) {
    const mainArea = document.querySelector("main");
    mainArea.innerHTML = `
      <nav class="navbar">
        <button class="btn" onclick="UserAuth.logout()">Logout</button>
        <button class="btn" onclick="Dashboard.showMain()">Back</button>
      </nav>
      <header class="page-header">
        <h1 id="course_title"></h1>
        <div id="alert_box" class="alert"></div>
      </header>
      <!-- Using the same container class so the styling remains -->
      <section class="grades-table-section">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Enter Grade</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="grade_list"></tbody>
        </table>
      </section>
    `;
    GradeEntry.renderEntries(sectionId);
  }
  static async renderEntries(sectionId) {
    // Updated endpoint: /enterGrade -> /grading
    const res = await GradeEntry.fetchRegistered(sectionId);
    const { data } = res;
    const tbody = document.querySelector("#grade_list");
    const titleEl = document.querySelector("#course_title");
    titleEl.textContent = `Enter Grades for: ${data.name}`;

    tbody.innerHTML = data.studentsClassesData.map(student => `
      <tr>
        <td>${student.student_name}</td>
        <td>
          <input 
            type="number" 
            id="grade_input_${student.id}" 
            placeholder="Enter grade" 
            min="0" max="100" 
            required
          />
        </td>
        <td>
          <button class="btn btn-primary" onclick="GradeEntry.submitGrade(${sectionId}, ${student.id})">
            Save & Finalize
          </button>
        </td>
      </tr>
    `).join("");
  }
  static async submitGrade(sectionId, studentClassId) {
    const inputEl = document.getElementById(`grade_input_${studentClassId}`);
    const grade = inputEl.value;
    const payload = { studentClassId, grade };
    try {
      // Updated endpoint: /enterGrade -> /grading
      const res = await ApiClient.patch('/grading', payload);
      const result = await res.json();
      if (result.success) {
        GradeEntry.renderEntries(sectionId);
      } else {
        ErrorDisplay.show(result.message);
      }
    } catch (err) {
      ErrorDisplay.show(err.message);
    }
  }
  static async fetchRegistered(sectionId) {
    // Updated endpoint: /enterGrade -> /grading
    const res = await ApiClient.get(`/grading?classId=${sectionId}`);
    return await res.json();
  }
}

// ------------------------------------------------
// PendingRegistrations: For admins to handle pending enrollment requests
// ------------------------------------------------
class PendingRegistrations {
  static async showPending(sectionId) {
    const mainArea = document.querySelector("main");
    mainArea.innerHTML = `
      <nav class="navbar">
        <div class="navbar-brand">Pending Registrations</div>
        <div class="navbar-buttons">
          <button class="btn" onclick="UserAuth.logout()">Logout</button>
          <button class="btn" onclick="Dashboard.showMain()">Back</button>
        </div>
      </nav>
      <section class="courses-table">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="pending_list"></tbody>
        </table>
      </section>
      <div id="alert_box" class="alert"></div>
    `;
    PendingRegistrations.renderPendingCards(sectionId);
  }
  static async renderPendingCards(sectionId) {
    // Updated endpoint: /acceptPending -> /approvals
    const tbody = document.querySelector("#pending_list");
    const res = await ApiClient.get(`/approvals?classId=${sectionId}`);
    const result = await res.json();
    const { data } = result;
    tbody.innerHTML = data.studentsClassesData.map(student => `
      <tr>
        <td>${student.student_name}</td>
        <td>
          <button class="btn btn-success" onclick="PendingRegistrations.approve(${sectionId}, ${student.id})">
            Accept
          </button>
          <button class="btn btn-danger" onclick="PendingRegistrations.reject(${sectionId}, ${student.id})">
            Remove
          </button>
        </td>
      </tr>
    `).join("");
  }
  static async approve(sectionId, studentClassId) {
    try {
      // Updated endpoint: /acceptPending -> /approvals
      const res = await ApiClient.patch('/approvals', { studentClassId });
      const result = await res.json();
      if (result.success) {
        PendingRegistrations.renderPendingCards(sectionId);
      } else {
        ErrorDisplay.show(result.message);
      }
    } catch (err) {
      ErrorDisplay.show(err.message);
    }
  }
  static async reject(sectionId, studentClassId) {
    try {
      // Updated endpoint: /acceptPending -> /approvals
      const res = await ApiClient.remove('/approvals', { studentClassId });
      const result = await res.json();
      if (result.success) {
        PendingRegistrations.renderPendingCards(sectionId);
      } else {
        ErrorDisplay.show(result.message);
      }
    } catch (err) {
      ErrorDisplay.show(err.message);
    }
  }
}

// ------------------------------------------------
// CourseCreation: For administrators to add new programs
// ------------------------------------------------
class CourseCreation {
  static async getCourses() {
    // Updated endpoint: /courses -> /programs
    const res = await ApiClient.get('/programs');
    return await res.json();
  }
  static async handleCourseSubmission(event) {
    event.preventDefault();
    const name = document.querySelector("#name").value;
    const prerequisites = Array.from(document.querySelector("#prerequisites").selectedOptions)
                                 .map(opt => opt.value);
    try {
      // Updated endpoint: /courses -> /programs
      const res = await ApiClient.post('/programs', { name, prerequisites });
      const result = await res.json();
      if (result.success) {
        Dashboard.showMain();
      } else {
        ErrorDisplay.show(result.message);
      }
    } catch (err) {
      ErrorDisplay.show(err.message);
    }
  }
  static async showCourseForm() {
    const coursesData = (await CourseCreation.getCourses()).data;
    const mainArea = document.querySelector("main");
    mainArea.innerHTML = `
      <nav class="navbar">
        <button class="btn" onclick="UserAuth.logout()">Logout</button>
        <button class="btn" onclick="Dashboard.showMain()">Back</button>
      </nav>
      <section class="form-section">
        <div id="alert_box" class="alert"></div>
        <form onsubmit="CourseCreation.handleCourseSubmission(event)" class="form" id="course_form">
          <h2>Add New Course</h2>
          <label for="name">Course Name</label>
          <input type="text" id="name" name="name" required />
          <label for="prerequisites">Prerequisites</label>
          <select id="prerequisites" name="prerequisites" multiple>
            ${coursesData.map(course => `<option value="${course.id}">${course.name}</option>`).join("")}
          </select>
          <div class="form-buttons">
            <button type="submit" class="btn btn-primary">Add Course</button>
          </div>
        </form>
      </section>
    `;
  }
}

// ------------------------------------------------
// ClassCreation: For admins to create new sections
// ------------------------------------------------
class ClassCreation {
  static async getInstructors() {
    // Updated endpoint: /instructors -> /faculty
    const res = await ApiClient.get('/faculty');
    return await res.json();
  }
  static async handleClassSubmission(event) {
    event.preventDefault();
    const courseId = document.querySelector("#courseId").value;
    const instructorId = document.querySelector("#instructorId").value;
    const maxStudents = document.querySelector("#maxStudents").value;
    try {
      // Updated endpoint: /classes -> /sections
      const res = await ApiClient.post('/sections', { courseId, instructorId, maxStudents });
      const result = await res.json();
      if (result.success) {
        Dashboard.showMain();
      } else {
        ErrorDisplay.show(result.message);
      }
    } catch (err) {
      ErrorDisplay.show(err.message);
    }
  }
  static async showClassForm() {
    const coursesData = (await CourseCreation.getCourses()).data;
    const instructorsData = (await ClassCreation.getInstructors()).data;
    const mainArea = document.querySelector("main");
    mainArea.innerHTML = `
      <nav class="navbar">
        <button class="btn" onclick="UserAuth.logout()">Logout</button>
        <button class="btn" onclick="Dashboard.showMain()">Back</button>
      </nav>
      <section class="form-section">
        <div id="alert_box" class="alert"></div>
        <form onsubmit="ClassCreation.handleClassSubmission(event)" class="form" id="class_form">
          <h2>Add New Class</h2>
          <label for="courseId">Course</label>
          <select id="courseId" name="courseId" required>
            <option value="" disabled selected>Select a course</option>
            ${coursesData.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}
          </select>
          <label for="instructorId">Instructor</label>
          <select id="instructorId" name="instructorId" required>
            <option value="" disabled selected>Select an instructor</option>
            ${instructorsData.map(inst => `<option value="${inst.id}">${inst.name}</option>`).join("")}
          </select>
          <label for="maxStudents">Max Students</label>
          <input type="number" id="maxStudents" name="maxStudents" required />
          <div class="form-buttons">
            <button type="submit" class="btn btn-primary">Add Class</button>
          </div>
        </form>
      </section>
    `;
  }
}

// ------------------------------------------------
// Dashboard: Main view for all user roles (students, instructors, admins)
// ------------------------------------------------
class Dashboard {
  static async showMain() {
    const currentUser = UserAuth.getCurrentUser();
    const mainArea = document.querySelector("main");
    let headerHTML = "";
    if (currentUser.role === "student") {
      headerHTML = `
        <tr>
          <th>Subject</th>
          <th>Available Seats</th>
          <th>Status</th>
          <th>Grade</th>
        </tr>
      `;
    } else if (currentUser.role === "instructor") {
      headerHTML = `
        <tr>
          <th>Subject</th>
          <th>Registered</th>
          <th>Finalized</th>
          <th>Action</th>
        </tr>
      `;
    } else if (currentUser.role === "administrator") {
      headerHTML = `
        <tr>
          <th>Subject</th>
          <th>Pending</th>
          <th>Registered</th>
          <th>Finalized</th>
          <th>Action</th>
        </tr>
      `;
    }
    mainArea.innerHTML = `
      <nav class="navbar">
        <div class="navbar-brand">Student Management</div>
        <div class="navbar-buttons">
          <button class="btn" onclick="UserAuth.logout()">Logout</button>
          ${
            currentUser.role === "administrator"
              ? `<button class="btn btn-secondary" onclick="CourseCreation.showCourseForm()">Add Course</button>
                 <button class="btn btn-secondary" onclick="ClassCreation.showClassForm()">Add Class</button>`
              : ""
          }
        </div>
      </nav>
      <div class="search-container">
        <form onsubmit="Dashboard.handleSearch(event)" class="search-form">
          <input type="text" id="search_input" name="search" placeholder="Search by Name" />
          <button class="btn btn-primary" type="submit">Search</button>
        </form>
      </div>
      <!-- NOTE: Using "courses-table" to match your CSS styling -->
      <section class="courses-table">
        <table>
          <thead>
            ${headerHTML}
          </thead>
          <tbody id="course_list"></tbody>
        </table>
      </section>
      <div id="alert_box" class="alert"></div>
    `;
    Dashboard.renderCards();
  }
  static renderCards() {
    const user = UserAuth.getCurrentUser();
    if (user.role === "student") {
      Dashboard.renderStudentCards();
    } else if (user.role === "instructor") {
      Dashboard.renderInstructorCards();
    } else if (user.role === "administrator") {
      Dashboard.renderAdminCards();
    }
  }
  static async renderStudentCards() {
    const tbody = document.querySelector("#course_list");
    const coursesData = (await Dashboard.fetchCourses()).data;
    tbody.innerHTML = coursesData.map(course => {
      const seatsAvailable = (typeof course.maxStudents !== "undefined" && typeof course.numberRegistered !== "undefined")
                             ? course.maxStudents - course.numberRegistered
                             : "N/A";
      if (course.studentClasse) {
        const status = course.studentClasse.status;
        const grade = (course.studentClasse.grade !== undefined) ? course.studentClasse.grade : "";
        return `
          <tr>
            <td>${course.name}</td>
            <td>${seatsAvailable}</td>
            <td>${status}</td>
            <td>${grade}</td>
          </tr>
        `;
      } else {
        return `
          <tr>
            <td>${course.name}</td>
            <td>${seatsAvailable}</td>
            <td>
              <button class="btn btn-primary" onclick="Dashboard.registerCourse(${course.id})">
                Register
              </button>
            </td>
            <td></td>
          </tr>
        `;
      }
    }).join("");
  }
  static async renderInstructorCards() {
    const tbody = document.querySelector("#course_list");
    const coursesData = (await Dashboard.fetchCourses()).data;
    tbody.innerHTML = coursesData.map(course => `
      <tr>
        <td>${course.name}</td>
        <td>${course.numberRegistered || 0}</td>
        <td>${course.numberFinalized || 0}</td>
        <td>
          <button class="btn btn-primary" onclick="GradeEntry.displayGrades(${course.id})">
            Enter Grades
          </button>
        </td>
      </tr>
    `).join("");
  }
  static async renderAdminCards() {
    const tbody = document.querySelector("#course_list");
    const coursesData = (await Dashboard.fetchCourses()).data;
    tbody.innerHTML = coursesData.map(course => `
      <tr>
        <td>${course.name}</td>
        <td>${course.numberPending || 0}</td>
        <td>${course.numberRegistered || 0}</td>
        <td>${course.numberFinalized || 0}</td>
        <td>
          ${course.numberPending ? `<button class="btn btn-primary" onclick="PendingRegistrations.showPending(${course.id})">
            Manage Pending
          </button>` : ""}
        </td>
      </tr>
    `).join("");
  }
  static async fetchCourses() {
    const user = UserAuth.getCurrentUser();
    const searchTerm = document.querySelector("#search_input") ? document.querySelector("#search_input").value : "";
    const searchParam = searchTerm ? `&search=${searchTerm}` : "";
    // Updated endpoint: /home -> /dashboard
    const res = await ApiClient.get(`/dashboard?userId=${user.id}${searchParam}`);
    return await res.json();
  }
  static handleSearch(event) {
    event.preventDefault();
    Dashboard.renderCards();
  }
  static async registerCourse(classId) { // Rename sectionId to classId
    const user = UserAuth.getCurrentUser();
    try {
      // Update the payload key from sectionId to classId
      const res = await ApiClient.post(`/enroll`, { userId: user.id, classId });
      const result = await res.json();
      if (result.success) {
        Dashboard.renderCards();
      } else {
        ErrorDisplay.show(result.message);
      }
    } catch (err) {
      ErrorDisplay.show(err.message);
    }
  }
  
}

// ------------------------------------------------
// Initialize the Application on DOMContentLoaded
// ------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const user = UserAuth.getCurrentUser();
  if (!user) {
    UserAuth.displayLogin();
  } else {
    Dashboard.showMain();
  }
});
