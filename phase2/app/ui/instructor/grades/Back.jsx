import React from "react";

export default function Back() {
  return (
    <button onClick={() => window.history.back()} className="btn">
      Back
    </button>
  );
}