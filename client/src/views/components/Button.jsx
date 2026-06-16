import React from "react";

export default function Button({ children, variant = "primary", small, ...props }) {
  const base = "btn";
  const v =
    variant === "danger"
      ? "btn-danger"
      : variant === "ghost"
      ? "btn-ghost"
      : "btn-primary";
  const sz = small ? "btn-small" : "";

  return (
    <button className={`${base} ${v} ${sz}`} {...props}>
      {children}
    </button>
  );
}
