"use client";

import React, { useState } from "react";
import ApiClient from "../../common/ApiClient.js";
import NotificationToast from "../../common/NotificationToast.jsx";

export default function ApprovalActions({ enrollmentId }) {
  const [message, setMessage] = useState("");

  const handleAction = async (type) => {
    try {
      let res;
      if (type === "approve") {
        res = await ApiClient.fetchPatch("/enrollments/pending", {
          studentCourseId: enrollmentId,
        });
      } else {
        res = await ApiClient.fetchDelete("/enrollments/pending", {
          studentCourseId: enrollmentId,
        });
      }

      const result = await res.json();
      if (result.success) {
        window.location.reload();
      } else {
        setMessage(result.errorMessage);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <>
      {message && (
        <NotificationToast message={message} clear={() => setMessage("")} />
      )}
      <div className="action-buttons">
        <button className="btn-success" onClick={() => handleAction("approve")}>
          Approve
        </button>
        <button className="btn-danger" onClick={() => handleAction("remove")}>
          Remove
        </button>
      </div>
    </>
  );
}
