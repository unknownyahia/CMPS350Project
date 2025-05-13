// app/ui/common/NotificationToast.jsx
"use client";

import React, { useEffect, useRef } from "react";

/**
 * Temporary toast notification.
 *
 * @param {Object} props
 * @param {string} props.message   – Text to show
 * @param {Function} props.clear   – Callback to clear the message
 */
export default function NotificationToast({ message, clear }) {
  const toastRef = useRef(null);

  useEffect(() => {
    if (!message || !toastRef.current) return;

    const el = toastRef.current;
    // 1) Show the toast
    el.style.display = "flex";
    // 2) Scroll into view
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // 3) Hide after 3 seconds
    const timer = setTimeout(() => {
      el.style.display = "none";
      clear();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, clear]);

  if (!message) return null;

  return (
    <div
      ref={toastRef}
      className="notification-toast"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
