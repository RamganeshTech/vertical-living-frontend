import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-gray-100">
      <div className="max-w-lg w-full text-center bg-white rounded-xl shadow-md p-8 space-y-6 border border-gray-200">

        {/* 404 Title */}
        <div>
          <h1 className="text-6xl sm:text-7xl font-extrabold text-blue-700">404</h1>
          <p className="text-xl sm:text-2xl font-semibold text-gray-800 mt-2">Page Not Found</p>
          <p className="text-sm text-gray-500 mt-1">
            Sorry! The page you’re looking for doesn’t exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/organizations")}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition duration-200"
          >
            <i className="fa-solid fa-house mr-2" />
            Go to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition duration-200"
          >
            <i className="fa-solid fa-arrow-left mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;