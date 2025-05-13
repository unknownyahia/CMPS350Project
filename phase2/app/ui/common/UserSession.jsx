// app/ui/common/UserSession.js
"use client";

import { useRouter } from "next/navigation";
import React from "react";

/**
 * Manages storing and retrieving the current user session in localStorage.
 */
class UserSession {
  /**
   * Save the session data.
   * @param {object} session – User info to store
   */
  static store(session) {
    localStorage.setItem("userSession", JSON.stringify(session));
  }

  /**
   * Load the current session data.
   * @returns {object|null}
   */
  static load() {
    const raw = localStorage.getItem("userSession");
    return raw ? JSON.parse(raw) : null;
  }

  /**
   * Clear out the session.
   */
  static clear() {
    localStorage.removeItem("userSession");
  }
}

/**
 * Button component to sign out the user.
 */
export function LogoutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    UserSession.clear();
    router.push("/ui/login");
  };

  return (
    <button className="btn-signout" onClick={handleSignOut}>
      Sign Out
    </button>
  );
}

export { UserSession };
