import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../store/store';

const ToolHub = () => {
    const navigate = useNavigate();


    const { role } = useSelector((state: RootState) => state.authStore)

    const allModules = [
        {
            id: 'handover',
            title: 'Handover Hub',
            description: 'Generate and verify OTPs for secure asset movement between staff.',
            icon: 'fa-shield-alt',
            color: 'bg-blue-600',
            lightColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            path: '../issueotp',
            count: 'OTP Active'
        },
        {
            id: 'master',
            title: 'Tool Master',
            description: 'Centralized registry to manage technical specs and stock status.',
            icon: 'fa-tools',
            color: 'bg-indigo-600',
            lightColor: 'bg-indigo-50',
            textColor: 'text-indigo-600',
            path: '../toolmain',
            count: 'Tool Registry'
        },
        {
            id: 'history',
            title: 'History Log',
            description: 'Keeps complete track of every tool issue and return in order.',
            icon: 'fa-history',
            color: 'bg-amber-600',
            lightColor: 'bg-amber-50',
            textColor: 'text-amber-600',
            path: '../toolhistory',
            count: 'Audit Trail'
        },
        {
            id: 'rooms',
            title: 'Tool Rooms',
            description: 'Manage room locations and room-wise allocations.',
            icon: 'fa-warehouse',
            color: 'bg-emerald-600',
            lightColor: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            path: '../toolroom',
            count: 'Inventory Sites'
        }
    ];


    const modules = role === 'worker'
        ? allModules.filter(m => m.id === 'handover')
        : allModules;

    return (
        <div className="p-8 bg-slate-50 min-h-full">
            <header className="mb-3">
                {/* <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Tools & Hardware Management 
                </h1> */}
                {/* <p className="text-slate-500 font-medium mt-1">Select a sub-module to manage your organization's tools.</p> */}

                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <i className="fas fa-tools mr-3 text-blue-600"></i>
                    Tools & Hardware Management
                </h1>
                <p className="text-gray-600 mt-1 font-medium text-sm">
                    Centralized Asset Registry & Handover Tracking for all organization tools
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((module) => (
                    <div
                        key={module.id}
                        onClick={() => navigate(module.path)}
                        className="group relative bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
                    >
                        {/* Decorative background icon */}
                        <i className={`fas ${module.icon} absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:opacity-10 transition-opacity`}></i>

                        <div className={`w-12 h-12 ${module.lightColor} ${module.textColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <i className={`fas ${module.icon} text-xl`}></i>
                        </div>

                        <div className="mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${module.textColor} opacity-80`}>
                                {module.count}
                            </span>
                            <h3 className="text-xl font-bold text-slate-800 mt-1">{module.title}</h3>
                        </div>

                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            {module.description}
                        </p>

                        <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                            Enter Module
                            <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Stats Footer */}
            {/* <footer className="mt-12 p-6 bg-white rounded-2xl border border-slate-200 flex justify-around items-center">
                <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Assets</p>
                    <p className="text-xl font-black text-slate-800">1,284</p>
                </div>
                <div className="w-[1px] h-8 bg-slate-200"></div>
                <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase">Active Handovers</p>
                    <p className="text-xl font-black text-blue-600">42</p>
                </div>
                <div className="w-[1px] h-8 bg-slate-200"></div>
                <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase">Damaged/Maintenance</p>
                    <p className="text-xl font-black text-red-500">08</p>
                </div>
            </footer> */}
        </div>
    );
};

export default ToolHub;