import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetModularUnits } from "../../apiList/Modular Unit Api/ModularUnitApi";
import { modularUnitFieldConfig } from "../../utils/Modular Units/fieldConfigs";
import SingleModularUnitCard from "./SingleModularUnit";
import AddModularUnit from "./AddModularUnit";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function ModularUnitCategoryPage() {
  // const navigate = useNavigate();
  const { unitType, organizationId } = useParams() as { unitType: string, organizationId: string };
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState(""); // this will go to the API

    const [showFilters, setShowFilters] = useState(false); // 👈 control visibility of filters


  const { data, isLoading, isError } = useGetModularUnits(
    unitType,
    organizationId,
    appliedFilters,
    appliedSearch,
  );

  const [unitToEdit, setUnitToEdit] = useState(null);

  const filterFields = Object.entries(modularUnitFieldConfig[unitType] || {})
    .filter(([_, config]) => config.type === "select" || config.type === "checkbox");

  const handleSearch = () => {
  setAppliedSearch(searchQuery); // triggers refetch
};

  // Handle Enter key for search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // console.log("filterFields", filterFields)
  return (
    <>

      {unitToEdit ? (
        <AddModularUnit unitToEdit={unitToEdit} />
      )
        :
        <div className="max-w-full overflow-y-auto max-h-screen border mx-auto p-6 ">
          <div className="flex justify-between relative items-center mb-4">
            <h1 className="text-2xl font-semibold capitalize">
              {unitType} Units
            </h1>


            <div className="flex gap-2 items-center">
              <Input
                placeholder="Search by name, id, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full"
              />
              <Button isLoading={isLoading} onClick={handleSearch}>Search</Button>

                <Button
                variant="outline"
                className=""
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <i className=" fas fa-bars mr-1" />
                Filters
              </Button>
            </div>
          </div>


            {showFilters && (
    <div    className={`max-w-7xl absolute top-20 right-0 w-full z-50 bg-white shadow-lg border rounded p-4 filter-animate ${showFilters ? 'show' : ''}`}
>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {filterFields.map(([fieldName, config]) => {
              console.log("filedName", fieldName)
              return <div key={fieldName} className="flex flex-col">
                <label className="mb-1 font-medium">{config.label}</label>
                {config.type === "select" && config.options && (
                  // <select
                  //   value={filters[fieldName]?.[0] || ""}
                  //   onChange={(e) =>
                  //     setFilters((prev) => ({ ...prev, [fieldName]: [e.target.value] }))
                  //   }
                  //   className="border rounded px-3 py-2"
                  // >
                  //   <option value="">All</option>
                  //   {config.options.map((opt: string) => (
                  //     <option key={opt} value={opt}>{opt}</option>
                  //   ))}
                  // </select>

                  <Select
                    value={filters[fieldName]?.[0] || ""}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        [fieldName]: value ? [value] : [],
                      }))
                    }
                  >
                    <SelectTrigger className="min-w-[150px]">
                      <SelectValue
                        placeholder="All"
                        selectedValue={filters[fieldName]?.[0] || ""}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {config.options.map((opt: string) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {config.type === "checkbox" && config.options && (
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-1">
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
            })}
          </div>

          <Button
          isLoading={isLoading}
            className="mt-4 mx-auto !block"
            onClick={() => {
              setAppliedFilters(filters);
            }}
          >
            Apply Filters
          </Button>
          </div>
            )}

          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p className="text-red-500">Failed to load units.</p>
          ) : data?.length === 0 ? (
            <p className="text-gray-500">No units found for {unitType}.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data?.map((unit: any) => (
                <>
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
</>
              ))}
            </div>
          )}
        </div>
      }
    </>
  );
}
