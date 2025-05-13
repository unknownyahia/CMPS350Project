"use client";
import React, { useState, useRef } from "react";
import Requests from "../Requests";
import localStorageUser from "../localStorageUser";
import Alert from "../Alert";

export default function Login() {
  const [alert, setAlert] = useState("");
  const userRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = userRef.current.value;
    const password = passwordRef.current.value;

    try {
      const request = await Requests.requestPost(`/login`, { username, password });
      const data = await request.json();
      if (data.success) {
        localStorageUser.saveUser(data.data);
        window.location.href = `/ui/?userId=${data.data.id}`;
      } else {
        setAlert(data.message);
      }
    } catch (error) {
      setAlert(error.message);
    }
  };

  return (
    <>
      {/* --- page header with logo --- */}
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
          {/* --- maroon title bar --- */}
          <div className="login-title-box">
            <h2 className="login-title">SIGN IN</h2>
          </div>

          {/* --- white login panel --- */}
          <div className="login-box">
            <Alert message={alert} setAlert={setAlert} />

            <form
              id="login_form"
              className="login-form"
              onSubmit={handleSubmit}
            >
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

      {/* --- page footer --- */}
      <footer className="page-footer">
        <p>© 2025 Inc | All Rights Reserved</p>
      </footer>
    </>
  );
}
