import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useGetAllMixedUnits } from "../../apiList/Modular Unit Api/ModularUnitApi";
import { modularUnitFieldConfig } from "../../utils/Modular Units/fieldConfigs";
import { Button } from "../../components/ui/Button";
import SingleModularUnitCard from "./SingleModularUnit";

type SingleUnitType = {
    _id: string;
    name: string;
    unitType: string;
    images?: { url: string }[];
    carcassMaterial?: string;
    materialCarcass?: string;
    price?: number; // Add this field if available
};


// const unitTypes = Object.keys(modularUnitFieldConfig);

export default function ModularUnitMain() {
    const { organizationId } = useParams() as { organizationId: string }

    const [selectedCategory, _setSelectedCategory] = useState<string>("");
    const navigate = useNavigate();
    // const locaiton = useLocation()

    // const { data, isLoading, isError } = useGetModularUnits(selectedType);
    const { data, isLoading, isError } = useGetAllMixedUnits(organizationId)

    if (isLoading) return <p>loading ....</p>

    //   const allUnits: any[] = [];
    console.log("data", data)
    //   if (data) {
    //     Object.entries(data)?.forEach(([section, units]) => {
    //       (units as any[])?.forEach((unit) => {
    //         allUnits.push({ ...unit, section });
    //       });
    //     });
    //   }

    //   const filteredUnits = selectedCategory
    //     ? allUnits?.filter((u) => u.section === selectedCategory)
    //     : allUnits;

    const isChildRoute = location.pathname.includes("add") || location.pathname.includes("category")

    return (
        <>
            {isChildRoute ?
                <>
                    <Outlet />
                </>
                :
                <div className="flex flex-col max-h-screen md:flex-row gap-6 max-w-full mx-auto p-6">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 border-r pr-4 max-h-full overflow-y-auto custom-scrollbar">
                        <h2 className="text-lg font-semibold mb-4">Sections</h2>
                        <ul className="space-y-2 ">
                            {Object.keys(modularUnitFieldConfig).map((cat) => (
                                <>
                                <li
                                    key={cat}
                                    className={`cursor-pointer px-3 py-2 rounded ${selectedCategory === cat
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-200"
                                        }`}
                                    onClick={() => navigate(`category/${cat}`)}
                                >
                                    {cat}
                                </li>
                                <li
                                    key={cat}
                                    className={`cursor-pointer px-3 py-2 rounded ${selectedCategory === cat
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-200"
                                        }`}
                                    onClick={() => navigate(`category/${cat}`)}
                                >
                                    {cat}
                                </li><li
                                    key={cat}
                                    className={`cursor-pointer px-3 py-2 rounded ${selectedCategory === cat
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-200"
                                        }`}
                                    onClick={() => navigate(`category/${cat}`)}
                                >
                                    {cat}
                                </li>
                                </>
                            ))}
                        </ul>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-semibold">
                                {selectedCategory ? `${selectedCategory} Units` : "Select a Section"}
                            </h1>
                            <Button onClick={() => navigate("add")}>
                                + Add New
                            </Button>
                        </div>

                        {isLoading ? (
                            <p>Loading units...</p>
                        ) : isError ? (
                            <p className="text-red-500">Failed to load units.</p>
                        ) : data?.length === 0 ? (
                            <p className="text-gray-500">No units found for this section.</p>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto max-h-[90%]  custom-scrollbar ">
                                {data?.map((unit: SingleUnitType) => {
                                    console.log("unit", unit)

                                    //           <div
                                    //             key={unit._id}
                                    //             className="border p-4 rounded shadow hover:shadow-md transition"
                                    //           >
                                    //             <h2 className="text-lg font-semibold mb-2">
                                    //               {unit.name || "Unnamed Unit"}
                                    //             </h2>
                                    //             <p className="text-sm text-gray-500 mb-1">ID: {unit._id}</p>
                                    //             {unit.images?.length ? (
                                    //               <img
                                    //                 src={unit.images[0].url}
                                    //                 alt={unit.name}
                                    //                 className="w-full h-32 object-cover rounded"
                                    //               />
                                    //             ) : (
                                    //               <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
                                    //                 No Image
                                    //               </div>
                                    //             )}


                                    //             {/* ✅ Newly added fields */}
                                    //   <p className="text-sm text-gray-700">
                                    //     <strong>Type:</strong> {unit.unitType || "N/A"}
                                    //   </p>
                                    //   <p className="text-sm text-gray-700">
                                    //     <strong>Carcass Material:</strong> {unit.carcassMaterial || "N/A"}
                                    //   </p>
                                    //   <p className="text-sm text-gray-700">
                                    //     <strong>Material Carcass:</strong> {unit.materialCarcass || "N/A"}
                                    //   </p>
                                    //   <p className="text-sm text-gray-700">
                                    //     <strong>Price:</strong> ₹{unit.price?.toLocaleString() || "N/A"}
                                    //   </p>

                                    //           </div>

                                    return (
                                    
                                    <>
                                    <SingleModularUnitCard key={unit._id} unit={unit} />
                                    </>)

                                })}
                            </div>
                        )}
                    </div>
                </div>
            }
        </>

    );
}
