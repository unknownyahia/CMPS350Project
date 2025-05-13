"use client";

import React, { useEffect, useRef } from "react";

export default function Alert({ message, setAlert }) {
  const alertRef = useRef(null);

  useEffect(() => {
    if (message && alertRef.current) {
      const el = alertRef.current;
      // 1) Show
      el.style.display = "block";
      // 2) Scroll into view
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // 3) Auto-hide after 3s
      const timer = setTimeout(() => {
        el.style.display = "none";
        setAlert("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, setAlert]);

  // Render nothing if there's no message
  if (!message) return null;

  return (
    <div id="alert_box" className="alert" ref={alertRef}>
      {message}
    </div>
  );
}
