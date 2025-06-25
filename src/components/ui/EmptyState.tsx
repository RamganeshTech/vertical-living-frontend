import React from "react";

interface EmptyStateProps {
  message: string;
  icon?: "envelope" | "box" | "message" | "chat" | "warning" | "custom";
  customIconClass?: string; // Used only if icon === "custom"
  color?: "primary" | "danger" | "success" | "warning" | "gray";
}

const colorClasses: Record<string, string> = {
  primary: "text-blue-400",
  danger: "text-red-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  gray: "text-gray-400",
};

const iconClasses: Record<string, string> = {
  envelope: "fas fa-envelope",
  box: "fas fa-box-open",
  message: "fas fa-comment-dots",
  chat: "fas fa-comments",
  warning: "fas fa-exclamation-triangle",
};

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon = "box",
  customIconClass,
  color = "gray",
}) => {
  const iconClass =
    icon === "custom"
      ? customIconClass || "fas fa-question-circle"
      : iconClasses[icon] || iconClasses["box"];

  const fullIconClass = `${iconClass} text-7xl mb-4 ${colorClasses[color] || colorClasses.gray}`;

  return (
    <div className="w-full flex flex-col justify-center items-center py-12 px-4 text-center">
      <i className={fullIconClass}></i>
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default EmptyState;
