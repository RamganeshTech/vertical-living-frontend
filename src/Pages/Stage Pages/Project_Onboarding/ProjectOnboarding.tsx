// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { useGetAllRequirementInfo } from '../../../apiList/Stage Api/requirementFormApi';
// import { useGetSingleOrganization } from '../../../apiList/organization_api/orgApi';
// import { useGetProjectConfig } from '../../../apiList/projectConfigApi';


// const ProjectOnboarding: React.FC = () => {
//     // 1. Get Params
//     const { organizationId, projectId } = useParams<{ organizationId: string; projectId: string }>();

//     // 2. Fetch Data
//     const { data: reqData, isLoading: reqLoading } = useGetAllRequirementInfo({ projectId: projectId! });
//     const { data: orgData, isLoading: orgLoading } = useGetSingleOrganization(organizationId!);
//     const { data: configData, isLoading: configLoading } = useGetProjectConfig(organizationId!);

//     // 3. Derived State
//     const clientData = reqData?.clientData;
//     const organization = orgData; // Assuming your hook returns { data: ... } like standard axios setups

//     // Get the first video for the main player
//     const mainVideo = configData?.videos && configData.videos.length > 0 ? configData.videos[0] : null;
//     const images = configData?.images || [];

//     // 4. Loading State
//     if (reqLoading || orgLoading || configLoading) {
//         return (
//             <div className="min-h-screen bg-brand-surface flex items-center justify-center">
//                 <div className="flex flex-col items-center text-action-primary gap-3">
//                     <i className="fa-solid fa-circle-notch fa-spin text-4xl"></i>
//                     <p className="text-sm font-medium text-text-muted animate-pulse">Setting up your experience...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="h-full max-h-full overflow-y-auto bg-brand-ash font-poppins selection:bg-action-primary selection:text-white pb-20">

//             {/* ======================================= */}
//             {/* HEADER SECTION                          */}
//             {/* ======================================= */}
//             <header className="bg-brand-surface border-b border-ash-medium sticky top-0 z-50 shadow-sm">
//                 <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

//                     {/* Top Left: Client Info */}
//                     <div className="flex flex-col">
//                         {clientData?.clientName && (
//                             <h1 className="text-xl sm:text-2xl font-bold text-text-strong tracking-tight">
//                                 Welcome, {clientData.clientName}
//                             </h1>
//                         )}
//                         {clientData?.location && (
//                             <p className="text-sm font-medium text-text-muted mt-0.5 flex items-center gap-1.5">
//                                 <i className="fa-solid fa-location-dot text-action-primary/70"></i> 
//                                 {clientData.location}
//                             </p>
//                         )}
//                     </div>

//                     {/* Top Right: Organization Info */}
//                     <div className="flex items-center gap-3 bg-brand-ash/50 px-4 py-2 rounded-xl border border-ash-light">
//                         {organization?.logoUrl && (
//                             <img 
//                                 src={organization.logoUrl} 
//                                 alt="Company Logo" 
//                                 className="h-8 sm:h-10 w-auto object-contain drop-shadow-sm"
//                             />
//                         )}
//                         {organization?.organizationName && (
//                             <span className="hidden sm:block text-base font-bold text-text-strong border-l border-ash-medium pl-3">
//                                 {organization.organizationName}
//                             </span>
//                         )}
//                     </div>

//                 </div>
//             </header>

//             {/* ======================================= */}
//             {/* MAIN CONTENT SECTION                    */}
//             {/* ======================================= */}
//             <main className="max-w-7xl mx-auto px-6 mt-8 sm:mt-12 space-y-16">

//                 {/* Video Player Section */}
//                 {mainVideo && (
//                     <section className="flex flex-col items-center">
//                         <div className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-ash-dark relative group ring-4 ring-brand-surface">

//                             {/* The "Online Class" style player */}
//                             <video 
//                                 className="w-full aspect-video object-cover"
//                                 controls
//                                 controlsList="nodownload" // Adds a professional touch by preventing easy right-click downloads
//                                 preload="metadata"
//                             >
//                                 <source src={mainVideo.url} type={mainVideo.type || "video/mp4"} />
//                                 Your browser does not support the video tag.
//                             </video>

//                         </div>

//                         {/* Optional subtle shadow element under video to ground it */}
//                         <div className="w-full max-w-3xl h-6 bg-black/10 blur-xl rounded-full -mt-2"></div>
//                     </section>
//                 )}

//                 {/* Images Gallery Section */}
//                 {images.length > 0 && (
//                     <section>
//                         <div className="flex items-center gap-3 mb-6">
//                             <h2 className="text-xl sm:text-2xl font-bold text-text-strong">
//                                 Project References
//                             </h2>
//                             <div className="flex-1 h-px bg-ash-medium"></div>
//                         </div>

//                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//                             {images.map((img:any, index:number) => (
//                                 <div 
//                                     key={img._id || index} 
//                                     className="aspect-square bg-brand-surface rounded-xl overflow-hidden shadow-sm border border-ash-light group cursor-pointer hover:shadow-md transition-shadow"
//                                 >
//                                     <img 
//                                         src={img.url} 
//                                         alt={img.originalName || "Reference Image"} 
//                                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                                         loading="lazy"
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 )}

//                 {/* Empty State (If neither video nor images exist) */}
//                 {!mainVideo && images.length === 0 && (
//                     <div className="text-center py-20 bg-brand-surface rounded-2xl border border-ash-light shadow-sm">
//                         <i className="fa-solid fa-folder-open text-text-soft text-5xl mb-4"></i>
//                         <h3 className="text-lg font-medium text-text-strong">No Onboarding Materials Yet</h3>
//                         <p className="text-sm text-text-muted mt-2">Your project materials will appear here once uploaded.</p>
//                     </div>
//                 )}

//             </main>
//         </div>
//     );
// };

// export default ProjectOnboarding;




import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Updated Exact Imports
import { useGetAllRequirementInfo } from '../../../apiList/Stage Api/requirementFormApi';
import { useGetSingleOrganization } from '../../../apiList/organization_api/orgApi';
import { useGetProjectConfig } from '../../../apiList/projectConfigApi';
import ImageGalleryExample from '../../../shared/ImageGallery/ImageGalleryMain';
import { Button } from '../../../components/ui/Button';

// Component Imports (Adjust path to where your galleries actually live)
// import ImageGalleryExample from '../../../components/ImageGalleryExample';

const ProjectOnboarding: React.FC = () => {
    // 1. Get Params
    const { organizationId, projectId } = useParams<{ organizationId: string; projectId: string }>();


    const navigate = useNavigate()
    const [currentMainVideo, setCurrentMainVideo] = useState<any>(null);

    // 2. Fetch Data
    const { data: reqData, isLoading: reqLoading } = useGetAllRequirementInfo({ projectId: projectId! });
    const { data: orgData, isLoading: orgLoading } = useGetSingleOrganization(organizationId!);
    const { data: configData, isLoading: configLoading } = useGetProjectConfig(organizationId!);


    // Initialize the main video when data loads
    useEffect(() => {
        if (configData?.videos && configData.videos.length > 0 && !currentMainVideo) {
            setCurrentMainVideo(configData.videos[0]);
        }
    }, [configData, currentMainVideo]);


    // 3. Derived State
    const clientData = reqData?.clientData;
    const organization = orgData;

    // Video separation: First video is main, the rest go into a sub-grid
    const mainVideo = configData?.videos && configData.videos.length > 0 ? configData.videos[0] : null;
    // const additionalVideos = configData?.videos && configData.videos.length > 1 ? configData.videos.slice(1) : [];
    const additionalVideos = configData?.videos
        ? configData?.videos?.filter((vid: any) => vid?._id !== currentMainVideo?._id)
        : [];

    const images = configData?.images || [];

    // 4. Loading State
    if (reqLoading || orgLoading || configLoading) {
        return (
            <div className="min-h-screen bg-brand-surface flex items-center justify-center font-poppins">
                <div className="flex flex-col items-center text-action-primary gap-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-4xl"></i>
                    <p className="text-sm font-medium text-text-muted animate-pulse">Setting up your experience...</p>
                </div>
            </div>
        );
    }

    return (
        // Switched to font-poppins and reduced bottom padding
        <div className="h-full max-h-full overflow-y-auto bg-brand-surface font-poppins selection:bg-action-primary selection:text-white pb-10">

            {/* ======================================= */}
            {/* HEADER SECTION                          */}
            {/* ======================================= */}
            <header className="bg-brand-surface border-b border-ash-medium sticky top-0 z-10 shadow-sm">
                {/* Reduced padding from px-6 py-4 to px-4 py-3 for a tighter, more professional feel */}
                <div className="max-w-full mx-auto px-4 py-3 flex justify-between items-center">

                    {/* Top Left: Client Info */}
                    <div className="flex flex-col">
                        {clientData?.clientName && (
                            <h1 className="text-lg sm:text-xl font-bold text-text-strong tracking-tight">
                                Welcome, {clientData.clientName}
                            </h1>
                        )}
                        {clientData?.location && (
                            <p className="text-xs sm:text-sm font-medium text-text-muted mt-0.5 flex items-center gap-1.5">
                                <i className="fa-solid fa-location-dot text-action-primary/70"></i>
                                {clientData.location}
                            </p>
                        )}
                    </div>

                    {/* Top Right: Organization Info */}
                    <div className="flex items-center gap-3 bg-brand-surface px-2 py-1 rounded-full">

                        {/* Rounded Circular Logo */}
                        {organization?.logoUrl && (
                            <img
                                src={organization?.logoUrl}
                                alt="Company Logo"
                                className="h-10 w-10  rounded-full object-contain border-2 border-ash-medium shadow-sm bg-brand-surface"
                            />
                        )}

                        {organization?.organizationName && (
                            <span className="hidden sm:block text-sm font-bold text-text-strong pr-2">
                                {organization?.organizationName}
                            </span>
                        )}

                    </div>

                </div>
            </header>

            {/* ======================================= */}
            {/* MAIN CONTENT SECTION                    */}
            {/* ======================================= */}
            {/* Reduced top margin and overall spacing for a tighter layout */}
            <main className="max-w-full mx-auto px-4 mt-6 sm:mt-8 space-y-12">

                {/* Video Player Section */}
                {currentMainVideo && (
                    <section className="flex flex-col items-center">
                        {/* Main Video */}
                        <div className="w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-xl border border-ash-dark relative group ring-2 ring-ash-medium">
                            <video
                                key={currentMainVideo.url}
                                className="w-full aspect-video object-cover"
                                controls
                                controlsList="nodownload"
                                preload="metadata"
                            >
                                <source src={currentMainVideo.url} type={currentMainVideo.type || "video/mp4"} />
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        {/* Additional Videos Grid (If more than 1 uploaded) */}
                        {additionalVideos.length > 0 && (
                            <div className="w-full max-w-full mt-6">
                                <h3 className="text-sm font-semibold text-text-muted mb-3 tracking-wider">
                                    Additional Resources
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {additionalVideos.map((vid: any, idx: number) => (
                                        // <div key={vid._id || idx} className="bg-black rounded-lg overflow-hidden shadow-sm border border-ash-medium group cursor-pointer">
                                        <div
                                            key={vid._id || idx}
                                            onClick={() => setCurrentMainVideo(vid)}
                                            className="bg-black rounded-lg overflow-hidden shadow-sm border border-ash-medium group cursor-pointer relative"
                                        >
                                            {/* Optional: Add a play icon overlay to indicate it's a video thumbnail */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors z-10">
                                         <i className="fas fa-play-circle text-brand-surface/80 text-3xl group-hover:text-brand-surface transition-colors drop-shadow-md"></i>
                                    </div>

                                            <video
                                                className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                                // controls
                                                // controlsList="nodownload"
                                                preload="metadata"
                                            >
                                                <source src={vid.url} type={vid.type || "video/mp4"} />
                                            </video>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Images Gallery Section */}
                {images.length > 0 && (
                    <section className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            {/* Updated to a more professional heading */}
                            <h2 className="text-xl sm:text-2xl font-bold text-text-strong">
                                Curated Design Gallery
                            </h2>
                            <div className="flex-1 h-px bg-ash-medium"></div>
                        </div>

                        {/* Implemented your existing ImageGalleryExample component */}
                        <div className="bg-brand-surface p-4 rounded-xl shadow-sm border border-ash-light">
                            <ImageGalleryExample
                                imageFiles={images}
                                height={190}
                                minWidth={156}
                                maxWidth={100}
                                // Intentionally excluding delete callbacks so clients can only view

                                popupWidth="90vw"   // Make it wider
                                popupHeight="75vh"

                                overlayBg="bg-white/5" // Or pass "" to remove it completely

                                // 3. Force the image to fill the width (Warning: this might crop the top/bottom of tall images!)
                                imageClassName="w-full h-full object-cover"
                                // popupPlacement="items-end justify-center pb-24"
                                popupPlacement="items-center justify-center !pt-[80px] !pl-[100px]"
                            />
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {!mainVideo && images.length === 0 && (

                    <div className="text-center py-20 px-4 bg-brand-surface rounded-xl border border-ash-light shadow-sm max-w-4xl mx-auto flex flex-col items-center">
                        {/* Enclosed the icon in a subtle circle to make it look like an illustration rather than floating text */}
                        <div className="w-16 h-16 bg-brand-ash rounded-full flex items-center justify-center mb-5 border border-ash-medium shadow-inner">
                            <i className="fa-solid fa-folder-open text-text-soft text-2xl"></i>
                        </div>

                        <h3 className="text-lg font-medium text-text-strong">No Onboarding Materials Yet</h3>
                        <p className="text-sm text-text-muted mt-2 mb-7 max-w-md text-center">
                            Your project materials will appear here once uploaded.
                        </p>

                        {/* Improved Button: Added flex alignment, an icon, better padding, and hover elevation */}
                        <Button
                            variant="dark"
                            className="flex items-center gap-2 px-6 py-2.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                            onClick={() => navigate(`/organizations/${organizationId}/projects/projectconfiguration`)}
                        >
                            <i className="fa-solid fa-sliders text-sm"></i>
                            Configure Onboarding
                        </Button>
                    </div>
                )}

            </main>
        </div>
    );
};

export default ProjectOnboarding;