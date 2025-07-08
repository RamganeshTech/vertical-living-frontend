import React from "react";
import { Link } from "react-router-dom";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  labels: Record<string, string>;
  path: Record<string, string>;
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, labels, path }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white w-[75%] overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={onClose} className="text-xl text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {Object.entries(labels).map(([key, value]) => (
            path[key] ? (
              <Link
                key={key}
                to={path[key]}
                className="text-gray-800 hover:bg-gray-100 p-3 rounded"
                onClick={onClose}
              >
                {value}
              </Link>
            ) : (
              <span
                key={key}
                className="text-gray-400 p-3 rounded cursor-not-allowed"
              >
                {value}
              </span>
            )
          ))}
        </nav>
      </aside>
    </>
  );
};

export default MobileSidebar;
