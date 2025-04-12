  // Base API url stays the same for backend connection
  const host = "http://localhost:3000/api";

  // -------------------------------
  // Error handling utility
  // -------------------------------
  class ErrorForm {
    static showError(error) {
      const alert_form = document.querySelector("#alert_form");
      alert_form.style.display = "block";
      alert_form.textContent = error;
      setTimeout(() => {
        alert_form.style.display = "none";
        alert_form.textContent = "";
      }, 3000);
      alert_form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }


  // -------------------------------
  // Wrapper for API Requests using fetch()
  // -------------------------------
  class Requests {
    static async requestGet(url) {
      return fetch(host + url);
    }
    static async requestPost(url, data) {
      return fetch(host + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    static async requestPATCH(url, data) {
      return fetch(host + url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    static async requestDelete(url, data) {
      return fetch(host + url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
  }

  // -------------------------------
  // EnterGrades: For instructors entering student grades
  // -------------------------------
  class EnterGrades {
    // Called when the instructor clicks "Enter Grades" on a specific class
    static async ShowRegistered(classId) {
      const main = document.querySelector("main");

      // Build a table layout (similar to the subject table)
      main.innerHTML = `
        <nav class="navbar">
          <button class="btn" onclick="Login.Logout()">Logout</button>
          <button class="btn" onclick="MainPage.ShowMainPage()">Back</button>
        </nav>
        <header class="page-header">
          <h1 id="material_name"></h1>
          <div id="alert_form" class="alert"></div>
        </header>
        <section class="grades-table-section">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Enter Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="cours-list"></tbody>
          </table>
        </section>
      `;

      // Populate table rows
      EnterGrades.showCards(classId);
    }

    // Fetch the registered students and fill the table body
    static async showCards(classId) {
      const { data } = await EnterGrades.getRegistered(classId);
      const tableBody = document.querySelector("#cours-list");
      const material_name = document.querySelector("#material_name");

      // Update the header to show the class name
      material_name.textContent = `Enter Grades for: ${data.name}`;

      // Build a <tr> for each student
      tableBody.innerHTML = data.studentsClassesData
        .map(
          (studentClass) => `
            <tr>
              <td>${studentClass.student_name}</td>
              <td>
                <!-- Input for the grade -->
                <input 
                  type="number" 
                  id="grade-${studentClass.id}" 
                  placeholder="Enter grade" 
                  min="0" max="100" 
                  required
                />
              </td>
              <td>
                <!-- Button to save the grade for this student -->
                <button 
                  class="btn btn-primary" 
                  onclick="EnterGrades.saveGrade(${classId}, ${studentClass.id})"
                >
                  Save & Finalize
                </button>
              </td>
            </tr>
          `
        )
        .join("");
    }

    // Called by the button above to save the grade for one student
    static async saveGrade(classId, studentClassId) {
      // Retrieve the grade from the input with ID = "grade-studentClassId"
      const gradeInput = document.getElementById(`grade-${studentClassId}`);
      const grade = gradeInput.value;

      // Prepare data for the backend
      const sendData = { studentClassId, grade };

      // Send PATCH request to /enterGrade
      try {
        const request = await Requests.requestPATCH(`/enterGrade`, sendData);
        const data = await request.json();
        if (data.success) {
          // Reload the table to reflect any changes
          EnterGrades.showCards(classId);
        } else {
          ErrorForm.showError(data.message);
        }
      } catch (error) {
        ErrorForm.showError(error.message);
      }
    }

    // Helper to fetch all registered students for a given class
    static async getRegistered(classId) {
      const request = await Requests.requestGet(`/enterGrade?classId=${classId}`);
      const data = await request.json();
      return data;
    }
  }





  // -------------------------------
  // AcceptPending: Manage pending student registration requests (for admins)
  // -------------------------------
  class AcceptPending {
    // Renders the Manage Pending view as a table.
    static async ShowAcceptPending(classId) {
      const main = document.querySelector("main");
      main.innerHTML = `
        <nav class="navbar">
          <div class="navbar-brand">Manage Pending Registrations</div>
          <div class="navbar-buttons">
            <button class="btn" onclick="Login.Logout()">Logout</button>
            <button class="btn" onclick="MainPage.ShowMainPage()">Back</button>
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
            <tbody id="pending-list"></tbody>
          </table>
        </section>
        <div id="alert_form" class="alert"></div>
      `;
      AcceptPending.showCards(classId);
    }

    // Retrieves the pending registrations and displays them as rows in the table.
    static async showCards(classId) {
      const tableBody = document.querySelector("#pending-list");
      const response = await Requests.requestGet(`/acceptPending?classId=${classId}`);
      const result = await response.json();
      const data = result.data;
      tableBody.innerHTML = data.studentsClassesData
        .map(studentClass => `
          <tr>
            <td>${studentClass.student_name}</td>
            <td>
              <button class="btn btn-success" onclick="AcceptPending.acceptPending(${classId}, ${studentClass.id})">
                Accept
              </button>
              <button class="btn btn-danger" onclick="AcceptPending.removePending(${classId}, ${studentClass.id})">
                Remove
              </button>
            </td>
          </tr>
        `)
        .join("");
    }

    // Sends a PATCH request to accept a pending registration.
    static async acceptPending(classId, studentClassId) {
      const request = await Requests.requestPATCH(`/acceptPending`, { studentClassId });
      try {
        const data = await request.json();
        if (data.success) {
          AcceptPending.showCards(classId);
        } else {
          ErrorForm.showError(data.message);
        }
      } catch (error) {
        ErrorForm.showError(error.message);
      }
    }

    // Sends a DELETE request to remove a pending registration.
    static async removePending(classId, studentClassId) {
      const request = await Requests.requestDelete(`/acceptPending`, { studentClassId });
      try {
        const data = await request.json();
        if (data.success) {
          AcceptPending.showCards(classId);
        } else {
          ErrorForm.showError(data.message);
        }
      } catch (error) {
        ErrorForm.showError(error.message);
      }
    }
  }



  // -------------------------------
  // AddCours: Add a new course (for admins)
  // -------------------------------
  class AddCours {
    static async getCourses() {
      const request = await Requests.requestGet(`/courses`);
      const data = await request.json();
      return data;
    }
    static async submitAddCours(event) {
      event.preventDefault();
      const name = document.querySelector("#name").value;
      const prerequisites = Array.from(document.querySelector("#prerequisites").selectedOptions).map(option => option.value);
      const request = await Requests.requestPost(`/courses`, { name, prerequisites });
      try {
        const data = await request.json();
        if (data.success) {
          MainPage.ShowMainPage();
        } else {
          ErrorForm.showError(data.message);
        }
      } catch (error) {
        ErrorForm.showError(error.message);
      }
    }
    static async ShowAddCours() {
      const courses = (await AddCours.getCourses()).data;
      const main = document.querySelector("main");
      main.innerHTML = `
        <nav class="navbar">
          <button class="btn" onclick="Login.Logout()">Logout</button>
          <button class="btn" onclick="MainPage.ShowMainPage()">Back</button>
        </nav>
        <section class="form-section">
          <div id="alert_form" class="alert"></div>
          <form onsubmit="AddCours.submitAddCours(event)" class="form" id="add-course-form">
            <h2>Add New Course</h2>
            <label for="name">Course Name</label>
            <input type="text" id="name" name="name" required />
            <label for="prerequisites">Prerequisites</label>
            <select id="prerequisites" name="prerequisites" multiple>
              ${courses.map(course => `<option value="${course.id}">${course.name}</option>`).join("")}
            </select>
            <div class="form-buttons">
              <button type="submit" class="btn btn-primary">Add Course</button>
            </div>
          </form>
        </section>
      `;
    }
  }

  // -------------------------------
  // AddClass: Add a new class (for admins)
  // -------------------------------
  class AddClass {
    static async getInstructors() {
      const request = await Requests.requestGet(`/instructors`);
      const data = await request.json();
      return data;
    }
    static async submitAddClass(event) {
      event.preventDefault();
      const courseId = document.querySelector("#courseId").value;
      const instructorId = document.querySelector("#instructorId").value;
      const maxStudents = document.querySelector("#maxStudents").value;
      const request = await Requests.requestPost(`/classes`, { courseId, instructorId, maxStudents });
      try {
        const data = await request.json();
        if (data.success) {
          MainPage.ShowMainPage();
        } else {
          ErrorForm.showError(data.message);
        }
      } catch (error) {
        ErrorForm.showError(error.message);
      }
    }
    static async ShowAddClass() {
      const courses = (await AddCours.getCourses()).data;
      const instructors = (await AddClass.getInstructors()).data;
      const main = document.querySelector("main");
      main.innerHTML = `
        <nav class="navbar">
          <button class="btn" onclick="Login.Logout()">Logout</button>
          <button class="btn" onclick="MainPage.ShowMainPage()">Back</button>
        </nav>
        <section class="form-section">
          <div id="alert_form" class="alert"></div>
          <form onsubmit="AddClass.submitAddClass(event)" class="form" id="add-class-form">
            <h2>Add New Class</h2>
            <label for="courseId">Course</label>
            <select id="courseId" name="courseId" required>
              <option value="" disabled selected>Select a course</option>
              ${courses.map(course => `<option value="${course.id}">${course.name}</option>`).join("")}
            </select>
            <label for="instructorId">Instructor</label>
            <select id="instructorId" name="instructorId" required>
              <option value="" disabled selected>Select an instructor</option>
              ${instructors.map(instructor => `<option value="${instructor.id}">${instructor.name}</option>`).join("")}
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

  // -------------------------------
  // MainPage: Dashboard for all users (student, instructor, admin)
  // -------------------------------
  class MainPage {
    // Renders the main dashboard based on the user's role.
    static async ShowMainPage() {
      const user = Login.getUser();
      const main = document.querySelector("main");
      let tableHeader = "";
  
      if (user.role === "student") {
        // For students, display a four-column table: Subject, Available Seats, Status, and Grade.
        tableHeader = `
          <tr>
            <th>Subject</th>
            <th>Available Seats</th>
            <th>Status</th>
            <th>Grade</th>
          </tr>
        `;
      } else if (user.role === "instructor") {
        tableHeader = `
          <tr>
            <th>Subject</th>
            <th>Registered</th>
            <th>Finalized</th>
            <th>Action</th>
          </tr>
        `;
      } else if (user.role === "administrator") {
        tableHeader = `
          <tr>
            <th>Subject</th>
            <th>Pending</th>
            <th>Registered</th>
            <th>Finalized</th>
            <th>Action</th>
          </tr>
        `;
      }
  
      main.innerHTML = `
        <nav class="navbar">
          <div class="navbar-brand">Student Management</div>
          <div class="navbar-buttons">
            <button class="btn" onclick="Login.Logout()">Logout</button>
            ${
              user.role === "administrator"
                ? `<button class="btn btn-secondary" onclick="AddCours.ShowAddCours()">Add Course</button>
                   <button class="btn btn-secondary" onclick="AddClass.ShowAddClass()">Add Class</button>`
                : ""
            }
          </div>
        </nav>
        <div class="search-container">
          <form onsubmit="MainPage.submitSearch(event)" class="search-form">
            <input type="text" id="search" name="search" placeholder="Search by Name" />
            <button class="btn btn-primary" type="submit">Search</button>
          </form>
        </div>
        <section class="courses-table">
          <table>
            <thead>
              ${tableHeader}
            </thead>
            <tbody id="cours-list"></tbody>
          </table>
        </section>
        <div id="alert_form" class="alert"></div>
      `;
      MainPage.showCards();
    }
  
    // Decides which rendering function to call based on the user's role.
    static showCards() {
      const user = Login.getUser();
      if (user.role === "student") {
        MainPage.cardsStudent();
      } else if (user.role === "instructor") {
        MainPage.cardsInstructor();
      } else if (user.role === "administrator") {
        MainPage.cardsAdministrators();
      }
    }
  
    // Renders the table rows for students.
    // For each course:
    // - If the student is registered, display the status and grade.
    // - Additionally, compute "Available Seats" as maxStudents - numberRegistered.
    static async cardsStudent() {
      const tableBody = document.querySelector("#cours-list");
      const classesData = (await MainPage.getClasses()).data;
      tableBody.innerHTML = classesData.map(course => {
        // Compute available seats if course has the required properties:
        const availableSeats =
          typeof course.maxStudents !== "undefined" && typeof course.numberRegistered !== "undefined"
            ? course.maxStudents - course.numberRegistered
            : "N/A";
        
        if (course.studentClasse) {
          // If student is registered, display status and grade.
          const status = course.studentClasse.status; // e.g., "Registered"
          const grade = (typeof course.studentClasse.grade !== "undefined")
            ? course.studentClasse.grade
            : "";
          return `
            <tr>
              <td>${course.name}</td>
              <td>${availableSeats}</td>
              <td>${status}</td>
              <td>${grade}</td>
            </tr>
          `;
        } else {
          // Not registered: show a Register button; still display available seats.
          return `
            <tr>
              <td>${course.name}</td>
              <td>${availableSeats}</td>
              <td>
                <button class="btn btn-primary" onclick="MainPage.RegisterMaterial(${course.id})">
                  Register
                </button>
              </td>
              <td></td>
            </tr>
          `;
        }
      }).join("");
    }
  
    // Renders the dashboard for instructors.
    static async cardsInstructor() {
      const tableBody = document.querySelector("#cours-list");
      const classesData = (await MainPage.getClasses()).data;
      tableBody.innerHTML = classesData
        .map(course => `
            <tr>
              <td>${course.name}</td>
              <td>${course.numberRegistered || 0}</td>
              <td>${course.numberFinalized || 0}</td>
              <td>
                <button class="btn btn-primary" onclick="EnterGrades.ShowRegistered(${course.id})">
                  Enter Grades
                </button>
              </td>
            </tr>
        `)
        .join("");
    }
  
    // Renders the dashboard for administrators.
    static async cardsAdministrators() {
      const tableBody = document.querySelector("#cours-list");
      const classesData = (await MainPage.getClasses()).data;
      tableBody.innerHTML = classesData
        .map(course => `
            <tr>
              <td>${course.name}</td>
              <td>${course.numberPending || 0}</td>
              <td>${course.numberRegistered || 0}</td>
              <td>${course.numberFinalized || 0}</td>
              <td>
                ${
                  course.numberPending
                    ? `<button class="btn btn-primary" onclick="AcceptPending.ShowAcceptPending(${course.id})">
                          Manage Pending
                       </button>`
                    : ""
                }
              </td>
            </tr>
        `)
        .join("");
    }
  
    // Fetches courses from the API.
    static async getClasses() {
      const user = Login.getUser();
      const searchInput = document.querySelector("#search");
      const searchValue = searchInput ? searchInput.value : "";
      const search = searchValue ? `&search=${searchValue}` : "";
      const request = await Requests.requestGet(`/home?userId=${user.id}${search}`);
      const data = await request.json();
      return data;
    }
  
    // Handles the search form submission.
    static submitSearch(event) {
      event.preventDefault();
      MainPage.showCards();
    }
  
    // Registers a student in a course and refreshes the dashboard.
    static async RegisterMaterial(classId) {
      const user = Login.getUser();
      const request = await Requests.requestPost(`/register`, { userId: user.id, classId });
      try {
        const data = await request.json();
        if (data.success) {
          MainPage.showCards();
        } else {
          ErrorForm.showError(data.message);
        }
      } catch (error) {
        ErrorForm.showError(error.message);
      }
    }
  }
  

  // -------------------------------
  // Login: Handles user authentication & session storage
  // -------------------------------
  class Login {
    static saveUser(user) {
      localStorage.setItem("userData", JSON.stringify(user));
    }
    static Logout() {
      localStorage.removeItem("userData");
      window.location.reload();
    }
    static getUser() {
      return JSON.parse(localStorage.getItem("userData"));
    }
    static async submitLogin(event) {
      event.preventDefault();
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      const request = await Requests.requestPost(`/login`, { username, password });
      try {
        const data = await request.json();
        if (data.success) {
          Login.saveUser(data.data);
          MainPage.ShowMainPage();
        } else {
          ErrorForm.showError(data.message);
        }
      } catch (error) {
        ErrorForm.showError(error.message);
      }
    }
    static ShowLogin() {
      const main = document.querySelector("main");
      main.innerHTML = `
        
        
        <!-- Centered login container -->
        <div class="login-page-wrapper">
        <div class="login-title-box">
        <h2 class="login-title">SIGN IN</h2>
        </div>
    
          <div class="login-box">
            
            
            <!-- Alert area for error messages -->
            <div id="alert_form" class="alert" style="display:none;"></div>
            
            <!-- Login form -->
            <form class="login-form" id="login-form">
              <label for="username">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                required 
                placeholder="200240XYZ@stu.edu.qa"
              />
              
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                placeholder="Password"
              />
    
              
              
              <!-- SIGN IN button -->
              <button type="submit" class="btn-signin">SIGN IN</button>
            </form>
          </div>
        </div>  
    
        <!-- Footer -->
        <footer class="page-footer">
          <p>© 2025 Inc | All Rights Reserved</p>
        </footer>
      `;
      
      const form = document.querySelector("#login-form");
      form.addEventListener("submit", Login.submitLogin);
    }
    
    
  }

  // -------------------------------
  // Initial page load
  // -------------------------------
  document.addEventListener("DOMContentLoaded", async () => {
    const user = Login.getUser();
    if (!user) {
      Login.ShowLogin();
    } else {
      MainPage.ShowMainPage();
    }
  });
