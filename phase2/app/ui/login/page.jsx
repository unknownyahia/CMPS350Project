// app/ui/login/page.jsx
"use client";

import React, { useState, useRef } from "react";
import ApiClient from "../common/ApiClient.js";
import { UserSession } from "../common/UserSession.js";
import NotificationToast from "../common/NotificationToast.jsx";

export default function Login() {
  const [alert, setAlert] = useState("");
  const userRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = userRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await ApiClient.fetchPost("/login", { username, password });
      const result = await response.json();

      if (result.success) {
        UserSession.store(result.payload);
        window.location.href = `/ui/?userId=${result.payload.id}`;
      } else {
        setAlert(result.error);
      }
    } catch (err) {
      setAlert(err.message);
    }
  };

  return (
    <>
      <header className="page-header">
        <div className="header-container">
          <img
            src="https://www.qu.edu.qa/Style%20Library/assets/images/qulogo.png"
            alt="Qatar University Logo"
            className="logo"
          />
        </div>
      </header>
      <hr />

      <main>
        <div className="login-page-wrapper">
          <div className="login-title-box">
            <h2 className="login-title">SIGN IN</h2>
          </div>

          <div className="login-box">
            <NotificationToast message={alert} clear={() => setAlert("")} />

            <form id="login_form" className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <input
                ref={userRef}
                type="text"
                id="username"
                name="username"
                required
                placeholder="200240XYZ@stu.edu.qa"
              />

              <label htmlFor="password">Password</label>
              <input
                ref={passwordRef}
                type="password"
                id="password"
                name="password"
                required
                placeholder="Password"
              />

              <button type="submit" className="btn-signin">
                SIGN IN
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="page-footer">
        <p>© 2025 Inc | All Rights Reserved</p>
      </footer>
    </>
  );
}
