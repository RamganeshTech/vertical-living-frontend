import { COMPANY_DETAILS } from '../../../constants/constants';
import OrganizationAndUserRegistration from './OrganizationAndUserRegistration'
import { useNavigate } from 'react-router-dom';

const OrganizationAndUserRegistrationMain = () => {
    const navigate = useNavigate();
    return (
        // Full screen height with a clean, soft modern SaaS gradient
        // <main className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/40 p-4 md:p-8 overflow-hidden font-poppins">
            
        //     {/* --- Decorative Background Elements (Soft Mesh Only) --- */}
            
        //     {/* Top Left Ambient Glow */}
        //     <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none"></div>
            
        //     {/* Bottom Right Ambient Glow */}
        //     <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none"></div>

        //     {/* --- Main Content Wrapper --- */}
        //     <div className="relative z-10 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                
        //         {/* The Registration Component */}
        //         <OrganizationAndUserRegistration />
                
        //     </div>
        // </main>

        <main className="min-h-screen w-full relative flex flex-col bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/40 overflow-hidden font-poppins">
            
            {/* --- Sticky Header --- */}
            <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-md border-b border-gray-100 px-6 py-3 md:py-5">
                <div className="max-w-full mx-auto flex items-center justify-between">
                    {/* Logo & Name Section */}
                    <div 
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate('/home')}
                    >
                        <img 
                            src={COMPANY_DETAILS.COMPANY_LOGO} 
                            alt="Logo" 
                            className="w-8 h-8 rounded-md object-contain shadow-sm"
                        />
                        <span className="font-poppins font-medium md:font-bold text-gray-800 text-lg">
                            {COMPANY_DETAILS.COMPANY_NAME}
                        </span>
                    </div>

                    {/* Back Action */}
                    <button 
                        onClick={() => navigate('/home')}
                        className="text-sm font-medium text-gray-500 hover:text-indigo-600 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <i className="fa-solid fa-house text-xs"></i>
                        <span className="hidden sm:inline">Back to Home</span>
                    </button>
                </div>
            </header>

            {/* --- Main Content Area --- */}
            <div className="flex-1 w-full relative flex items-center justify-center p-4 md:p-8">
                
                {/* Background Ambient Glows */}
                <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Content Wrapper */}
                <div className="relative z-10 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <OrganizationAndUserRegistration />
                </div>
            </div>
        </main>
    )
}

export default OrganizationAndUserRegistrationMain