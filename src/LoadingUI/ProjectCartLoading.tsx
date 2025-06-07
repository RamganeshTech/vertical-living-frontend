import React from "react";

const ProjectCardLoading = () => {
  return (
    <div className="animate-pulse bg-white border-l-8 border-blue-600 shadow-md rounded-xl p-4 flex flex-col justify-between min-h-[250px] w-full max-w-[500px]">
      {/* Title */}
      <div className="h-5 w-1/2 bg-gray-200 rounded mb-4" />

      {/* Start Date */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-4 bg-gray-300 rounded-full" />
        <div className="h-3 w-1/3 bg-gray-300 rounded" />
      </div>

      {/* End Date */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-4 bg-gray-300 rounded-full" />
        <div className="h-3 w-1/3 bg-gray-300 rounded" />
      </div>

      {/* Due Date */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 w-4 bg-gray-300 rounded-full" />
        <div className="h-3 w-1/3 bg-gray-300 rounded" />
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-gray-300 rounded w-full mb-4" />

      {/* Footer buttons */}
      <div className="flex justify-between items-center">
        <div className="h-3 w-1/4 bg-gray-300 rounded" />
        <div className="h-3 w-1/4 bg-gray-300 rounded" />
        <div className="h-3 w-1/4 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default ProjectCardLoading;
