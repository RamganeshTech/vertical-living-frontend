import { useParams, useNavigate } from 'react-router-dom';
import { WORK_TEMPLATE } from './WorkDataTemplateMain';
// import { WORK_TEMPLATE } from './TemplateConfig';

const WorkDataSingleTemplate = () => {
    const { workType } = useParams<{ workType: string }>();
    const navigate = useNavigate();
    


    // Find the specific work config
    const activeModule = WORK_TEMPLATE.find(m => m.work === workType);

    // Initialize state (Dynamic)

    if (!activeModule) return <div className="p-10 text-center">Template Not Found</div>;

    return (
        <div className="bg-white max-h-full overflow-y-auto min-h-screen">
            {/* Header: Exact match to your screenshot style */}
            <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="cursor-pointer text-gray-400 hover:text-blue-600 transition-colors">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tight">
                        <i className="fas fa-th-large text-blue-600 text-sm"></i>
                        {activeModule.work} Work Data Template
                    </h1>
                </div>
                {/* <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-lg">Cancel</button>
                    <button className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg shadow-md shadow-blue-100 hover:bg-blue-700">Save Template</button>
                </div> */}
            </header>

            <main className="p-8 max-w-[1600px] mx-auto">
                <div className="space-y-10">
                    {activeModule.template.map((sec, sIdx) => (
                        <section key={sIdx} className="space-y-6">
                            {/* Section Title with the blue vertical line from your image */}
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h2 className="text-md font-bold text-gray-800">{sec.section}</h2>
                            </div>

                            {/* Responsive Grid: 3 or 4 columns based on your screenshot */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                                {sec.fields.map((field, fIdx) => (
                                    <div 
                                        key={fIdx} 
                                        className={`flex flex-col gap-2 ${field.type === 'textarea' ? 'md:col-span-3 lg:col-span-4' : ''}`}
                                    >
                                        <label className="text-sm font-medium text-gray-600">
                                            {field.label}
                                        </label>

                                        {field.type === 'select' ? (
                                            <div className="relative">
                                                <select className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all">
                                                    {field.options?.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"></i>
                                            </div>
                                        ) : field.type === 'textarea' ? (
                                            <textarea 
                                                className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[100px]"
                                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                            />
                                        ) : (
                                            <input 
                                                type={field.type}
                                                placeholder={field.type === 'number' ? '0' : `Enter ${field.label.toLowerCase()}...`}
                                                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default WorkDataSingleTemplate;