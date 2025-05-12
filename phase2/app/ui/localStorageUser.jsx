"use client";
export default class localStorageUser {
  static saveUser(user) {
    localStorage.setItem("userData", JSON.stringify(user));
  }

  static getUser() {
    return JSON.parse(localStorage.getItem("userData"));
  }
}

export function Logout() {
  const onClickLogout = () => {
    window.location.href = "/ui/login";
    localStorage.removeItem("userData");
    window.location.href = "/ui/login";
  };
  return (
    <button className="add-btn" id="add-cours" onClick={onClickLogout}>
      logout
    </button>
  );
}
