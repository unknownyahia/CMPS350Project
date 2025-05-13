// app/ui/student/EnrollmentButton.jsx
"use client";

import React, { useState } from "react";
import ApiClient from "../common/ApiClient.js";
import NotificationToast from "../common/NotificationToast.jsx";

/**
 * Button to enroll the current learner in a class session.
 *
 * @param {string|number} learnerId
 * @param {string|number} sessionId
 */
export default function EnrollmentButton({ learnerId, sessionId }) {
  const [alert, setAlert] = useState("");

  const handleEnroll = async () => {
    try {
      const response = await ApiClient.fetchPost("/enrollments", {
        userId: learnerId,
        classId: sessionId,
      });
      const result = await response.json();

      if (result.success) {
        window.location.reload();
      } else {
        setAlert(result.errorMessage);
      }
    } catch (err) {
      setAlert(err.message);
    }
  };

  return (
    <>
      {alert && (
        <NotificationToast message={alert} clear={() => setAlert("")} />
      )}
      <button className="btn-enroll" onClick={handleEnroll}>
        Enroll
      </button>
    </>
  );
}
