import React, { useState } from 'react';
import SearchSelectNew from '../../../components/ui/SearchSelectNew';
import { useGetAllToolsforDD } from '../../../apiList/tools_api/toolOtpApi';
import { useParams } from 'react-router-dom';
import ToolHistoryTimeline from './ToolHistoryTimeline';
import { Label } from '../../../components/ui/Label';
import { Breadcrumb, type BreadcrumbItem } from '../../Department Pages/Breadcrumb';



interface ToolHistoryMainProps {
    showFilters?: boolean;
}

const ToolHistoryMain: React.FC<ToolHistoryMainProps> = ({
    showFilters = true,
}) => {
    const [toolId, setToolId] = useState<string | null>(null);
    const { organizationId } = useParams() as { organizationId: string }
    const { data: tools = [] } = useGetAllToolsforDD(organizationId);


    const toolOptions = tools.map((t: any) => ({
        value: t._id,
        label: `${t.toolName} — ${t.toolCode}`,
        subLabel: t.brand,
    }));

    const handleToolSelection = (id: string | null) => {
        setToolId(id);
    };

    const clearFilters = () => {
        setToolId(null);
    };


    const paths: BreadcrumbItem[] = [
        { label: "Tools & Hardware", path: `/organizations/${organizationId}/projects/toolhub` },
        { label: "Tool history", path: `/organizations/${organizationId}/projects/toolhistory` },
    ];

    return (
        <div className="p-6 bg-[#f8fafc] h-full flex flex-col gap-6">

            {/* HEADER SECTION */}
            {/* <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <i className="fas fa-history text-white text-lg"></i>
                            <i className="fas fa-history text-white text-lg"></i>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Asset Lifecycle Log
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium ml-13">
                        Track movement, assignments, and health history of your inventory.
                    </p>
                </div>


            </header> */}


            <header className="">
                <div className='flex justify-start  items-center gap-3'>
                    {/* <button
                        onClick={() => navigate(-1)}
                        className="bg-white hover:bg-gray-100 shadow-sm flex items-center justify-center w-10 h-10 border border-gray-200 text-gray-600 rounded-lg transition-all"
                    >
                        <i className="fas fa-arrow-left" />
                    </button> */}

                    <div>

                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            {/* <i className="fas fa-money-bill-wave mr-3 text-blue-600"></i> */}
                            <i className="fas fa-history font-bold mr-3 text-2xl text-blue-600 "></i>
                            Tool History Log
                        </h1>
                        {/* <p className="text-gray-600 mt-1 text-sm">
                            View the tools history here
                        </p> */}

                        <Breadcrumb paths={paths} />

                    </div>
                </div>
            </header>

            <main className="flex gap-6 flex-1 min-h-0">

                {/* LEFT SIDEBAR: FILTERS (30%) */}
                {showFilters && (
                    <aside className="w-80 flex-shrink-0 flex flex-col gap-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                    Selection
                                </h3>
                                {toolId && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-bold text-slate-400 uppercase">Primary Tool Asset</Label>
                                    <SearchSelectNew
                                        options={toolOptions}
                                        placeholder="Search by name or code..."
                                        value={toolId || ""}
                                        onValueChange={handleToolSelection}
                                        displayFormat="detailed"
                                        className="w-full"
                                    />
                                </div>

                                {/* Info Card for better UI density */}
                                {/* <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-[12px] leading-relaxed text-slate-500">
                                        <i className="fas fa-info-circle mr-1 text-blue-400"></i>
                                        Select a tool to generate the chronological history of transfers, returns, and audits.
                                    </p>
                                </div> */}
                            </div>
                        </div>
                    </aside>
                )}

                {/* RIGHT SIDE: TIMELINE HISTORY (70%) */}
                <section className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Inner Header for History Section */}
                    <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${toolId ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                            <h2 className="text-lg font-bold text-slate-800">Movement Timeline</h2>
                        </div>
                        {/* {toolId && (
                            <span className="text-[11px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
                                Live Data
                            </span>
                        )} */}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                        {!toolId ? (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                    <i className="fas fa-box-open text-3xl text-slate-300"></i>
                                </div>
                                <h3 className="text-slate-800 font-bold text-xl mb-2">No Tool Selected</h3>
                                <p className="text-slate-500 max-w-xs text-sm leading-relaxed">
                                    Please use  filter the drop donw on the left to select a tool and view its history.
                                </p>
                            </div>
                        ) : (
                            <div className=" max-w-[95%] mx-auto w-full">
                                <ToolHistoryTimeline toolId={toolId} organizationId={organizationId} />
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ToolHistoryMain;