"use client";
import React, { useState } from "react";
import Requests from "../Requests";
import Alert from "../Alert";

export default function RegisterButton({ userId, classId }) {
  const [alert, setAlert] = useState("");

  const register = async () => {
    try {
      const request = await Requests.requestPost("/studentRegister", {
        userId,
        classId,
      });
      const data = await request.json();
      if (data.success) {
        window.location.reload();
      } else {
        setAlert(data.message);
      }
    } catch (error) {
      setAlert(error.message);
    }
  };

  return (
    <>
      {alert && <Alert message={alert} setAlert={setAlert} />}
      <button className="btn" onClick={register}>
        Register
      </button>
    </>
  );
}
