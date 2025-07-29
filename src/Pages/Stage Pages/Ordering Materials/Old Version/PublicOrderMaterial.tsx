import { useParams } from "react-router-dom";
import { useState } from "react";
import { useGetOrderingMaterialPublicDetails } from "../../../../apiList/Stage Api/orderingMaterialApi";

import { COMPANY_DETAILS } from "../../../../constants/constants";

const PublicOrderMaterial = () => {
    const { projectId, token } = useParams();
    const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

    const { data, isLoading, isError } = useGetOrderingMaterialPublicDetails(
        projectId!,
        token!
    );

    const handleToggle = (roomKey: string) => {
        setExpandedRoom(prev => (prev === roomKey ? null : roomKey));
    };

    return (
        <div className="min-h-screen  outline-none  w-full bg-gray-50 text-gray-800 flex flex-col">
            {/* Header */}

            <Header />

            <main className="flex-1 w-full px-4 py-6 space-y-6 mx-auto sm:max-w-full md:max-w-[95%] lg:max-w-[85%] xl:max-w-[70%]">

                <h1 className="text-2xl font-semibold">Ordered Materials</h1>

                {/* Delivery Details */}
                <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">Shop Delivery Details</h2>
                    {isLoading ? (
                        <Skeleton />
                    ) : isError || !data?.shopDetails ? (
                        <p className="text-red-500">Failed to load shop details</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            {Object.entries(data.shopDetails).map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-gray-600"> {typeof value === "string" || typeof value === "number"
                                        ? value
                                        : typeof value === "boolean"
                                            ? value ? "✔️" : "❌"
                                            : "-"}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Site Details */}
                <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">Site Location Details</h2>
                    {isLoading ? (
                        <Skeleton />
                    ) : isError || !data?.deliveryLocationDetails ? (
                        <p className="text-red-500">Failed to load site details</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            {Object.entries(data.deliveryLocationDetails).map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-gray-600"> {typeof value === "string" || typeof value === "number"
                                        ? value
                                        : typeof value === "boolean"
                                            ? value ? "✔️" : "❌"
                                            : "-"}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Material Lists */}
                <section>
                    <h2 className="text-lg font-bold text-blue-800 mb-4">Material Rooms</h2>

                    {isLoading ? (
                        <Skeleton />
                    ) : isError || !data?.materialOrderingList ? (
                        <p className="text-red-500">Failed to load material data</p>
                    ) : (
                        (Object.entries(data.materialOrderingList) as [string, any[]][]).map(([roomKey, items]) => (
                            <div key={roomKey} className="mb-4 bg-white outline-noneh rounded-lg overflow-hidden shadow-sm">
                                <button
                                    onClick={() => handleToggle(roomKey)}
                                    className="w-full px-4 py-3 text-left flex items-center justify-between bg-blue-100 hover:bg-blue-200 transition-all"
                                >
                                    <span className="capitalize font-semibold text-blue-800">{roomKey.replace(/([A-Z])/g, " $1")}</span>
                                    <i className={`fas fa-chevron-${expandedRoom === roomKey ? "up" : "down"}`}></i>
                                </button>


                                <div
                                    className={`transition-all duration-300 overflow-hidden ${expandedRoom === roomKey ? "max-h-[1000px] p-4" : "max-h-0"
                                        }`}
                                >
                                    {items.length === 0 ? (
                                        <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-md shadow-inner">
                                            <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                                            <h3 className="text-lg font-semibold text-gray-700">No Items Found</h3>
                                            <p className="text-sm text-gray-500 mb-4">No items needed for this section.</p>
                                        </div>
                                    ) : (
                                        <div className="w-full overflow-x-auto">
                                            <div className="min-w-[900px] max-h-[400px] overflow-y-auto custom-scrollbar rounded border border-gray-200">
                                                {/* Header Row */}
                                                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] bg-blue-50 text-xs text-blue-900 font-semibold border-b border-blue-200 py-2 px-2 sticky top-0">
                                                    {Object.keys(items[0])
                                                        .filter(key => key !== "_id")
                                                        .map(key => (
                                                            <div key={key} className="text-center capitalize">
                                                                {key === "upload" ? "Image" : key.replace(/([A-Z])/g, " $1")}
                                                            </div>
                                                        ))}
                                                </div>

                                                {/* Data Rows */}
                                                {items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] text-xs text-gray-800 border-b border-gray-100 py-2 px-2 hover:bg-gray-50"
                                                    >
                                                        {Object.entries(item)
                                                            .filter(([key]) => key !== "_id")
                                                            .map(([_key, val], idx) => (
                                                                <div key={idx} className="text-center break-words">
                                                                    {typeof val === "boolean" ? (
                                                                        val ? "✔️" : "❌"
                                                                    ) : typeof val === "string" || typeof val === "number" ? (
                                                                        val
                                                                    ) : (
                                                                        "-"
                                                                    )}
                                                                </div>
                                                            ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))
                    )}
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

const Skeleton = () => (
    <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
);


export const Header = () => (
    <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-full w-full mx-auto flex items-center gap-4 px-4 py-3">
            <img
                src={COMPANY_DETAILS.COMPANY_LOGO}
                alt="Logo"
                className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-bold">{COMPANY_DETAILS.COMPANY_NAME}</h1>
        </div>
    </header>
);

export const Footer = () => (
    <footer className="bg-gray-100 border-t border-gray-200 py-6 px-6 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}. All rights reserved.
    </footer>
);

export default PublicOrderMaterial;
