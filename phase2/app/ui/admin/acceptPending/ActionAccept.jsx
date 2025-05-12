"use client";
import React, { useState } from "react";
import Alert from "../../Alert";
import Requests from "../../Requests";

export default function ActionAccept({ studentCourseId }) {
  const [alert, setAlert] = useState("");

  const accept = async (action) => {
    let request;
    if (action === "accept") {
      request = await Requests.requestPATCH(`/acceptPending`, {
        studentCourseId,
      });
    } else if (action === "remove") {
      request = await Requests.requestDelete(`/acceptPending`, {
        studentCourseId,
      });
    }

    try {
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
    <div className="btns">
      <button className="update-btn" onClick={() => accept("accept")}>
        accept
      </button>
      <button className="delete-btn" onClick={() => accept("remove")}>
        Remove
      </button>
      <Alert message={alert} setAlert={setAlert} />
    </div>
  );
}
