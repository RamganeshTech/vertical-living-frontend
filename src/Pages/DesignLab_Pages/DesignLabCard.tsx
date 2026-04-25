import React from 'react';
import type { IDesignLab } from './DesignLabMain';
import { useAuthCheck } from '../../Hooks/useAuthCheck';

interface CardProps {
    design: IDesignLab;
    handleView: (id: string) => void;
    handleDelete: (id: string) => void;
    deletePending: boolean;
}

// Helper for images (keeps code clean)
const ImageCollage = ({ images }: { images: any[] }) => {
    const validImages = images?.filter(img => img?.url).slice(0, 3) || [];

    if (validImages.length === 0) {
        return (
            // <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-300">
            //     <i className="fas fa-image text-3xl mb-2"></i>
            //     <span className="text-xs font-medium">No Reference Images</span>
            // </div>
            <div className="w-full h-full bg-brand-ash/50 flex flex-col items-center justify-center text-text-soft">
                <i className="fas fa-image text-3xl mb-2"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">No Reference</span>
            </div>
        );
    }

    if (validImages.length === 1) return <img src={validImages[0].url} className="w-full h-full object-cover" />;
    
    if (validImages.length === 2) {
        return (
            <div className="w-full h-full grid grid-cols-2 gap-0.5">
                {validImages.map((img, i) => <img key={i} src={img.url} className="w-full h-full object-cover" />)}
            </div>
        );
    }

    return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-0.5">
            <img src={validImages[0].url} className="col-span-2 row-span-2 w-full h-full object-cover" />
            <img src={validImages[1].url} className="col-span-1 row-span-1 w-full h-full object-cover" />
            <div className="relative col-span-1 row-span-1">
                 <img src={validImages[2].url} className="w-full h-full object-cover" />
                 {images.length > 3 && (
                    <div className="absolute inset-0 bg-action-primary/60 flex items-center justify-center text-brand-surface text-xs font-bold">
                        +{images.length - 3}
                    </div>
                 )}
            </div>
        </div>
    );
};

export const DesignLabCard: React.FC<CardProps> = ({ design, handleView, handleDelete, deletePending }) => {
        const { role, permission } = useAuthCheck();
    
            const canDelete = role === "owner" || permission?.design?.delete;

    return (
        <div
            onClick={() => handleView(design._id)}
            // className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
            className="group relative bg-brand-surface rounded-xl border border-ash-medium shadow-sm hover:shadow-md hover:border-ash-dark transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
        >
            {/* --- Top Section: Images --- */}
            {/* <div className="h-48 relative bg-gray-50 border-b border-gray-100 shrink-0"> */}
            <div className="h-44 relative bg-brand-ash/30 border-b border-ash-light shrink-0">
                
                <ImageCollage images={design.referenceImages || []} />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Floating Badge (Design Code) - Optional, kept for style */}
                {/* <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-mono rounded">
                        #{design.designCode}
                    </span>
                </div> */}

                {/* Floating Badge (Design Code) */}
                <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-action-primary/80 backdrop-blur-md text-brand-surface text-[9px] font-black uppercase tracking-wider rounded shadow-sm">
                        #{design.designCode}
                    </span>
                </div>

                {/* Delete Button (Floating) */}
              {canDelete &&  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(design._id);
                    }}
                    disabled={deletePending}
                    // className="absolute cursor-pointer top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 hover:bg-red-500 hover:text-white"
                    className="absolute cursor-pointer top-3 right-3 w-8 h-8 flex items-center justify-center bg-brand-surface text-action-danger rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 hover:bg-action-danger hover:text-brand-surface border border-ash-light"
                    title="Delete Design"
                >
                    {deletePending ? (
                        <i className="fas fa-spinner fa-spin text-xs"></i>
                    ) : (
                        <i className="fas fa-trash text-xs"></i>
                    )}
                </button>}
            </div>

            {/* --- Bottom Section: Content --- */}
            <div className="p-4 flex flex-col flex-1 gap-4">
                
                {/* Header */}
                <div>
                    {/* <h3 className="font-bold text-gray-900 text-base leading-tight truncate mb-1" title={design.productName}>
                        {design.productName}
                    </h3> */}
                    <h3 className="font-black text-text-strong text-sm leading-tight truncate mb-1" title={design.productName}>
                        {design.productName}
                    </h3>
                    {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                        <i className="fas fa-user-circle text-blue-500"></i>
                        <span className="font-medium truncate">{design.designerName}</span>
                    </div> */}

                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wide">
                        <i className="fas fa-user-circle text-action-primary/60"></i>
                        <span className="truncate">{design.designerName}</span>
                    </div>
                </div>

                {/* <div className="h-px bg-gray-100 w-full" /> */}
                <div className="h-px bg-ash-lighter w-full" />

                {/* Details Grid (2x2 Layout) */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                    
                    {/* 1. DL Code */}
                    <div className="flex flex-col">
                        <span className="text-[10px] text-text-soft uppercase tracking-wide font-medium">DL Code</span>
                        <span className="font-mono font-semibold text-text-main truncate" title={design.designCode}>
                            #{design.designCode}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[9px] text-text-soft uppercase tracking-widest font-medium mb-0.5">Space</span>
                        <span className="text-xs font-bold text-text-main truncate">
                            {design.spaceType || '—'}
                        </span>
                    </div>

                    {/* 2. Space Type */}
                    {/* <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Space</span>
                        <span className="font-semibold text-gray-800 truncate">
                            {design.spaceType || '—'}
                        </span>
                    </div> */}

                    {/* 3. Difficulty */}
                    <div className="flex flex-col">
                        <span className="text-[9px] text-text-soft uppercase tracking-widest font-medium mb-0.5">Difficulty</span>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                                design.difficultyLevel === 'Hard' ? 'bg-action-danger' : 
                                design.difficultyLevel === 'Medium' ? 'bg-action-warning' : 'bg-action-success'
                            }`}></span>
                            <span className="text-xs font-bold text-text-main">
                                {design.difficultyLevel || '—'}
                            </span>
                        </div>
                    </div>

                    {/* 4. Date */}
                    <div className="flex flex-col">
                        <span className="text-[9px] text-text-soft uppercase tracking-widest font-medium mb-0.5">Release Date</span>
                        <span className="text-xs font-bold text-text-main">
                             {new Date(design.designDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};