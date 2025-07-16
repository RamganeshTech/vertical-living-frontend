import  { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetModularUnits } from "../../apiList/Modular Unit Api/ModularUnitApi";
import { modularUnitFieldConfig } from "../../utils/Modular Units/fieldConfigs";

export default function ModularUnitCategoryPage() {
  // const navigate = useNavigate();
  const { unitType } = useParams() as { unitType: string };
  const { data, isLoading, isError } = useGetModularUnits(unitType);
  // ✅ filters state: keys for each filter field
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const filterFields = Object.entries(modularUnitFieldConfig[unitType] || {})
    .filter(([_, config]) => config.type === "select" || config.type === "checkbox");


  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold capitalize">
          {unitType} Units
        </h1>
      </div>


      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {filterFields.map(([fieldName, config]) => (
          <div key={fieldName} className="flex flex-col">
            <label className="mb-1 font-medium">{config.label}</label>
            {config.type === "select" && config.options && (
              <select
                value={filters[fieldName]?.[0] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [fieldName]: [e.target.value] }))
                }
                className="border rounded px-3 py-2"
              >
                <option value="">All</option>
                {config.options.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {config.type === "checkbox" && config.options && (
              <div className="flex flex-col gap-1">
                {config.options.map((opt: string) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters[fieldName]?.includes(opt) || false}
                      onChange={(e) => {
                        setFilters((prev) => {
                          const existing = prev[fieldName] || [];
                          return {
                            ...prev,
                            [fieldName]: e.target.checked
                              ? [...existing, opt]
                              : existing.filter((v) => v !== opt),
                          };
                        });
                      }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>


      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load units.</p>
      ) : data?.length === 0 ? (
        <p className="text-gray-500">No units found for {unitType}.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.map((unit: any) => (
            <div
              key={unit._id}
              className="border p-4 rounded shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold mb-2">
                {unit.name || "Unnamed Unit"}
              </h2>
              {unit.images?.length ? (
                <img
                  src={unit.images[0].url}
                  alt={unit.name}
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
                  No Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
