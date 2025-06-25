import React, { memo } from "react";

const SummaryCostEstimation = ({ data }: { data: any }) => {
  if (!data) return null;

  const { totalMaterialCost, totalLabourCost, totalEstimation } = data;

  return (
    <section className="mt-6 w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Cost Estimation Summary</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-600">
          <h4 className="text-sm font-semibold text-gray-500 mb-1">Total Material Cost</h4>
          <p className="text-xl font-bold text-gray-800">₹{totalMaterialCost?.toLocaleString() || 0}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-600">
          <h4 className="text-sm font-semibold text-gray-500 mb-1">Total Labour Cost</h4>
          <p className="text-xl font-bold text-gray-800">₹{totalLabourCost?.toLocaleString() || 0}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-purple-600">
          <h4 className="text-sm font-semibold text-gray-500 mb-1">Grand Total Estimation</h4>
          <p className="text-xl font-bold text-gray-800">₹{totalEstimation?.toLocaleString() || 0}</p>
        </div>
      </div>
    </section>
  );
};

export default memo(SummaryCostEstimation);
