import React from "react";
import { useNavigate } from "react-router-dom";

const UnAuthorized: React.FC = () => {


  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100 text-center">
      <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <i className="fa-solid fa-circle-exclamation text-red-500 text-6xl md:text-7xl"></i>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Access Denied
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Sorry, you don&apos;t have permission to view this page.
          </p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorized;
