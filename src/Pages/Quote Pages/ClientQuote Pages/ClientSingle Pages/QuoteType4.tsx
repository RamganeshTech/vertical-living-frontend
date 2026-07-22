import React from 'react';
import PrimaryDetailsQuote4 from './PrimaryDetailsQuote4';

interface QuoteProps {
    // Basic Quote Info
    quoteNo: string;
    version: string | number;
    creationDate: string;
    creationTime: string;

    // Organization & Branding
    COMPANY_DETAILS: {
        COMPANY_LOGO: string;
        COMPANY_NAME: string;
    };
    orgData: {
        registeredEntity?: string;
        address?: string;
        organizationPhoneNo?: string;
        secondaryPhoneNo?: string;
        email?: string;
        website?: string;
        gstin?: string;
    };
    orgLoading?: boolean;

    // Client & Context
    data: {
        clientDetails?: string;
        projectDetails?: string;
        whatsIncluded?: string;
        whatsNotIncluded?: string;
        whatIsFree?: string;
        brandlist?: string;
        TermsAndConditions?: string;
        disclaimer?: string;
    };
    clientDetailsFallback?: string;
    projectDetailsFallback?: string;
    brandlistString?: string;
    DEFAULT_QUOTE_TEXTS: {
        included: string;
        excluded: string;
        free: string;
        // brands: string;
        terms: string;
        disclaimer: string;
    };

    // Products & Totals
    furnitures: any[];
    grandTotal: number;
    localPreviews: Record<string, string>;
    isBlurred?: boolean;
    showSaveTemplateButton?: boolean
    // Handlers & State
    isSaving?: boolean;
    usedIn: string
    handleSaveTemplate: () => void;
    handlePrint: () => void;
    handleImageClick: (id: string) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    renderBrandSpecificationTable: (furniture: any) => React.ReactNode;
    autoExpand: (el: HTMLTextAreaElement) => void;
    adjustHeight: (el: HTMLTextAreaElement | null) => void;
    preSaleslocalPreviews?: Record<string, string>
    commonMaterial?: any
    commonMaterialScopeOfWork?: any
}

const QuoteType4: React.FC<QuoteProps> = ({
    quoteNo, version, creationDate, creationTime,
    COMPANY_DETAILS, orgData, orgLoading,
    data, clientDetailsFallback, projectDetailsFallback,
    showSaveTemplateButton,
    brandlistString, DEFAULT_QUOTE_TEXTS,
    furnitures, grandTotal, localPreviews, isBlurred, preSaleslocalPreviews,
    isSaving, handleSaveTemplate, handlePrint,
    usedIn, commonMaterial, commonMaterialScopeOfWork,




    handleImageClick, handleFileChange, renderBrandSpecificationTable,
    autoExpand, adjustHeight
}) => {


    // 2. Helper to check if a specific array has any images
    const hasImagesInCategory = (items: any[]) => {
        return items?.some(item => item?.imageUrl);
    };


    // 3. GLOBAL CHECK: Determine if ANY furniture has ANY image in ANY category
    const hasFurnitureImages = furnitures?.some(furniture =>
        hasImagesInCategory(furniture?.coreMaterials) ||
        hasImagesInCategory(furniture?.fittingsAndAccessories) ||
        hasImagesInCategory(furniture?.glues) ||
        hasImagesInCategory(furniture?.nonBrandMaterials)
    );

    const hasCommonImages = hasImagesInCategory(commonMaterial);

    // 3. Global visibility (to show the main section title)
    const showMainGallerySection = (hasFurnitureImages || hasCommonImages) && usedIn === "quoteForClients";

    // Helper to calculate total for common materials
    const commonMaterialsTotal = (commonMaterial || [])?.reduce(
        (sum: number, item: any) => sum + (item?.rowTotal || 0),
        0
    );


    return (
        <main className="bg-[#f5f5f7] printable-content py-10 print:bg-white print:py-0">
            <div className="max-w-[230mm] mx-auto bg-white p-[15mm_20mm] shadow-2xl page-sheet print:shadow-none print:m-0" id="quote-page">

                <PrimaryDetailsQuote4

                    key={data?.clientDetails || data?.projectDetails || 'loading'}
                    quoteNo={quoteNo}
                    version={version}
                    creationDate={creationDate}
                    showSaveTemplateButton={showSaveTemplateButton}
                    creationTime={creationTime}
                    COMPANY_DETAILS={COMPANY_DETAILS}
                    orgData={orgData}
                    orgLoading={orgLoading}
                    data={data}
                    clientDetailsFallback={clientDetailsFallback}
                    showClientAndProjectDetails={true}
                    projectDetailsFallback={projectDetailsFallback}
                    brandlistString={brandlistString}
                    DEFAULT_QUOTE_TEXTS={DEFAULT_QUOTE_TEXTS}
                    isSaving={isSaving}
                    handleSaveTemplate={handleSaveTemplate}
                    handlePrint={handlePrint}
                    autoExpand={autoExpand}
                    adjustHeight={adjustHeight} />

                <div className="print:h-[20px] hidden print:block" style={{ clear: 'both' }}></div>


                <div className="mt-8 new-page-section">
                    <h2 className="text-lg font-bold text-[#0f4c81] border-b-2 border-[#2563eb] pb-2 mb-6 print-card">Execution Scope & Product Estimates</h2>
                    {furnitures?.map((furniture, idx) => {
                        const displayImage = localPreviews[furniture._id] || furniture.coreMaterials?.[0]?.imageUrl;

                        const isNonModular = furniture.typeOfWork === "non-modular";

                        console.log("furniture", idx + 1, furniture)


                        return (
                            <div key={furniture._id} className="mb-10 p-6 rounded-xl border-l-[6px] border-[#2563eb] bg-gradient-to-b from-[#fbfdff] to-[#f5f8ff] shadow-sm ">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#0f4c81]">{idx + 1}. Product: {furniture.furnitureName}</h3>
                                        <div className="text-[#16a34a] font-bold text-lg mt-1 text-right">Product Total: ₹{furniture.totals.furnitureTotal.toLocaleString('en-IN')}</div>
                                    </div>
                                </div>

                                {!isNonModular && <div className="flex gap-5 mb-6">
                                    {usedIn === "quoteForClients" && <div className="w-[190px] border-2 border-dashed border-[#93c5fd] rounded-xl p-3 text-center bg-[#f8fbff] cursor-pointer print:border-none"
                                        onClick={() => handleImageClick(furniture._id)}>
                                        <strong className="block mb-2 text-[13px] text-[#1e3a8a] print:hidden">Product Image</strong>
                                        <input type="file" id={`file-input-${furniture._id}`} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, furniture._id)} />
                                        {displayImage ? (
                                            <img src={displayImage} className="w-full rounded-lg border border-[#c7d2fe]" alt="Product" />
                                        ) : (
                                            <div className="h-24 bg-gray-100 flex flex-col items-center justify-center rounded text-gray-400">
                                                <i className="fas fa-cloud-upload-alt text-xl mb-1"></i>
                                                <span className="text-[10px] font-bold">Upload 3D Image</span>
                                            </div>
                                        )}
                                    </div>}


                                    {/* PRESALES VIEW: Multiple Image Array - Show First Image Only */}
                                    {usedIn === "presales" && (
                                        <div
                                            className="w-[190px] border-2 border-dashed border-[#93c5fd] rounded-xl p-3 text-center bg-[#f8fbff] cursor-pointer print:border-none"
                                            onClick={() => handleImageClick(furniture._id)}
                                        >
                                            <strong className="block mb-2 text-[13px] text-[#1e3a8a] print:hidden">Product Image</strong>
                                            <input
                                                type="file"
                                                id={`file-input-${furniture._id}`}
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => handleFileChange(e, furniture._id)}
                                            />
                                            {(() => {
                                                // 1. Show local preview if user just selected a new file
                                                if (preSaleslocalPreviews && preSaleslocalPreviews[furniture._id]) {
                                                    return (
                                                        <img
                                                            src={preSaleslocalPreviews[furniture._id]}
                                                            className="w-full rounded-lg border border-blue-200"
                                                            alt="Preview"
                                                        />
                                                    );
                                                }

                                                // 2. Otherwise show the first image from the DB array
                                                const firstDbImage = Array.isArray(furniture.imageUrl) && furniture.imageUrl.length > 0
                                                    ? furniture.imageUrl[0].url
                                                    : null;

                                                if (firstDbImage) {
                                                    return (
                                                        <div className="relative">
                                                            <img src={firstDbImage} className="w-full rounded-lg border border-[#c7d2fe]" alt="Product" />
                                                            {furniture.imageUrl.length > 1 && (
                                                                <span className="absolute bottom-1 right-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                                                                    +{furniture.imageUrl.length - 1}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                // 3. Default Upload Placeholder
                                                return (
                                                    <div className="h-24 bg-gray-100 flex flex-col items-center justify-center rounded text-gray-400">
                                                        <i className="fas fa-cloud-upload-alt text-xl mb-1"></i>
                                                        <span className="text-[10px] font-bold">Upload 3D Image</span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    <div className="flex-1 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Technical Dimensions</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            {[{ label: 'Length', key: 'width', color: 'blue' }, { label: 'Height', key: 'height', color: 'orange' }, { label: 'Depth', key: 'depth', color: 'green' }].map((dim, i) => (
                                                <React.Fragment key={dim.key}>
                                                    <div className="flex flex-col flex-1">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase mb-1">{dim.label}</span>
                                                        <div className={`relative flex items-center bg-${dim.color}-50/50 rounded-xl px-3 py-2 border border-${dim.color}-100`}>
                                                            <input type="number" readOnly value={furniture?.dimention?.[dim.key] || 0} className={`w-full bg-transparent text-sm font-black text-${dim.color}-700 outline-none`} />
                                                            <span className="text-[9px] font-bold text-gray-400 ml-1 italic">ft</span>
                                                        </div>
                                                    </div>
                                                    {i < 2 && <div className="text-gray-300 font-light text-xl self-end pb-2">×</div>}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>}

                                <div className="mt-3">
                                    <h2 className="font-bold text-sm text-gray-700 mt-5 mb-2">Execution Scope of Work</h2>
                                    <textarea

                                        name={isNonModular ? "engineeringDescription" : "scopeOfWork"}
                                        className="overflow-hidden w-full min-h-[100px] p-4 text-sm leading-relaxed text-gray-700 bg-white border-2 border-gray-100 rounded-xl outline-none"
                                        // defaultValue={furniture?.scopeOfWork || `Comprehensive manufacturing and installation of ${furniture.furnitureName} as per the approved site measurements and material standards.`}
                                        defaultValue={isNonModular ? furniture.engineeringDescription : (furniture?.scopeOfWork || `Comprehensive manufacturing and installation of ${furniture.furnitureName} as per the approved site measurements and material standards.`)}
                                        onInput={(e) => autoExpand(e.currentTarget)}
                                        ref={(el) => adjustHeight(el)}
                                    // value={furniture?.scopeOfWork || `Comprehensive manufacturing and installation of ${furniture.furnitureName}.`}
                                    />
                                </div>


                                {isNonModular && (
                                    <div className="mt-6">
                                        <h2 className="font-bold text-sm text-gray-700 mb-2">Execution Breakdown</h2>
                                        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden border border-gray-100 text-sm mb-6">
                                            <thead>
                                                <tr className="bg-[#eef4ff] text-[#1e3a8a] text-left">
                                                    <th className="p-3 border-r border-blue-50/50">Work Description</th>
                                                    <th className="p-3 text-center border-r border-blue-50/50">Area (Sq.ft)</th>
                                                    <th className="p-3 text-right">Amount (₹)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {(furniture.works || []).map((w: any, wIdx: number) => (
                                                    <tr key={wIdx}>
                                                        <td className="p-3 border-r border-gray-50">{w.workName}</td>
                                                        <td className="p-3 text-center border-r border-gray-50">{w.totalSqft}</td>
                                                        <td className={`${isBlurred ? "blur-sm" : ""} p-3 text-right font-medium`}>
                                                            ₹{w.totalAmount?.toLocaleString("en-IN") || 0}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-gray-700 font-bold text-xs mb-2">Inclusions</h4>
                                                <textarea name="included" className={`${isBlurred ? "blur-sm" : ""} min-h-[100px] w-full text-xs leading-relaxed text-gray-600 bg-white p-4 rounded-xl border-2 border-gray-100 outline-none resize-none`}
                                                defaultValue={furniture.included} onInput={(e) => autoExpand(e.currentTarget)} readOnly={!showSaveTemplateButton} />
                                            </div>
                                            <div>
                                                <h4 className="text-gray-700 font-bold text-xs mb-2">Exclusions</h4>
                                                <textarea name="excluded" className={`${isBlurred ? "blur-sm" : ""} min-h-[100px] w-full text-xs leading-relaxed text-gray-600 bg-white p-4 rounded-xl border-2 border-gray-100 outline-none resize-none`} 
                                                defaultValue={furniture.excluded} onInput={(e) => autoExpand(e.currentTarget)} readOnly={!showSaveTemplateButton} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <h4 className="text-gray-700 font-bold text-xs mb-2">Materials & Specifications</h4>
                                                <textarea name="materialsAndBrands" className={`${isBlurred ? "blur-sm" : ""} min-h-[100px] w-full text-xs leading-relaxed text-gray-600 bg-white p-4 rounded-xl border-2 border-gray-100 outline-none resize-none`}
                                                defaultValue={furniture.materialsAndBrands} onInput={(e) => autoExpand(e.currentTarget)} readOnly={!showSaveTemplateButton} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isNonModular && (
                                    <>
                                        <h2 className="font-bold text-sm text-gray-700 mt-5 mb-2">Material & Brand Specifications</h2>
                                        {renderBrandSpecificationTable(furniture)}

                                        <div className="font-bold text-sm text-gray-700 mt-6 mb-2">Cost Break-Up</div>
                                        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden border border-gray-100 text-sm">
                                            <thead>
                                                <tr className="bg-[#eef4ff] text-[#1e3a8a] text-left">
                                                    <th className="p-3">Description</th>
                                                    <th className="p-3 text-right">Amount (₹)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr><td className="p-3">Core Materials (Plywood & Laminates)</td><td className={`${isBlurred ? "blur-sm" : ""} p-3 text-right font-medium`}>₹{furniture.totals.core.toLocaleString('en-IN')}</td></tr>
                                                <tr><td className="p-3">Fittings & Accessories</td><td className={`${isBlurred ? "blur-sm" : ""} p-3 text-right font-medium`}>₹{furniture.totals.fittings.toLocaleString('en-IN')}</td></tr>
                                                <tr><td className="p-3">Adhesives & Glues</td><td className={`${isBlurred ? "blur-sm" : ""} p-3 text-right font-medium`}>₹{furniture.totals.glues.toLocaleString('en-IN')}</td></tr>
                                                <tr><td className="p-3">Non-Branded Materials</td><td className={`${isBlurred ? "blur-sm" : ""} p-3 text-right font-medium`}>₹{furniture.totals.nbms.toLocaleString('en-IN')}</td></tr>
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>


                {/* --- 2. NEW: GENERAL MATERIALS SECTION --- */}
                {(usedIn === "quoteForClients" && commonMaterial && commonMaterial?.length > 0 && commonMaterialsTotal > 0) && (
                    <div className="mt-8">
                        <div className="mb-10 p-6 rounded-xl border-l-[6px] border-[#2563eb] bg-gradient-to-b from-[#fbfdff] to-[#f5f8ff] shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-[#0f4c81]">Technical HardWares</h3>
                                    <div className="text-[#16a34a] font-bold text-lg mt-1">
                                        Total: ₹{commonMaterialsTotal?.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <h2 className="font-bold text-sm text-gray-700 mt-5 mb-2">Execution Scope of Work</h2>
                                <textarea
                                    className="overflow-hidden w-full min-h-[80px] p-4 text-sm leading-relaxed text-gray-700 bg-white border-2 border-gray-100 rounded-xl outline-none"

                                    defaultValue={commonMaterialScopeOfWork || "Provisioning of general hardware, adhesives, and site-wide consumables required for the comprehensive execution of the interior works."}
                                />
                            </div>

                            <div className="font-bold text-sm text-gray-700 mt-6 mb-2">Cost Break-Up</div>
                            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden border border-gray-100 text-sm shadow-sm">
                                <thead>
                                    <tr className="bg-[#eef4ff] text-[#1e3a8a] text-left">
                                        <th className="p-3">Category</th>
                                        <th className="p-3 text-right">Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="p-3 font-medium text-gray-700">Mechanical Integration</td>
                                        <td className={`${isBlurred ? "blur-sm" : ""} p-3 text-right font-bold text-[#0f4c81]`}>
                                            ₹{commonMaterialsTotal.toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


                {/* show the image here with the product name just like he above card design */}


                {/* --- 🆕 DYNAMIC PRODUCT GALLERY --- */}
                {/* This section ONLY renders if showGlobalGallery is true */}
                {/* --- 🆕 DYNAMIC PRODUCT GALLERY --- */}



                {/* --- 🖼️ DYNAMIC PRODUCT GALLERY --- */}
                {/* {(hasCommonImages && usedIn === "quoteForClients") && ( */}
                {(showMainGallerySection) && (
                    <div className="mt-12 new-page-section">
                        <h2 className="text-lg font-bold text-[#0f4c81] border-b-2 border-[#2563eb] pb-2 mb-6 uppercase tracking-wider">
                            Material & Hardware Visuals
                        </h2>

                        {/* 1. Furniture Galleries */}
                        {hasFurnitureImages && furnitures?.map((furniture, idx) => {
                            const categories = [
                                { label: "Core Materials", items: furniture.coreMaterials },
                                { label: "Fittings & Accessories", items: furniture.fittingsAndAccessories },
                                { label: "Adhesives & Glues", items: furniture.glues },
                                { label: "Non-Branded Materials", items: furniture.nonBrandMaterials }
                            ];

                            if (!categories.some(cat => hasImagesInCategory(cat.items))) return null;

                            return (
                                <div key={`gallery-${furniture._id}`} className="mb-10 p-6 rounded-xl border-l-[6px] border-[#2563eb] bg-gradient-to-b from-[#fbfdff] to-[#f5f8ff] shadow-sm">
                                    <h3 className="text-lg font-bold text-[#0f4c81] mb-6">
                                        {idx + 1}. Gallery: {furniture.furnitureName}
                                    </h3>

                                    <div className="space-y-8">
                                        {categories.map((cat) => {
                                            if (!hasImagesInCategory(cat.items)) return null;

                                            return (
                                                <div key={cat.label}>
                                                    <span className="text-[11px] font-black text-[#272829] uppercase tracking-[0.2em] block mb-3">
                                                        {cat.label}
                                                    </span>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                                        {cat.items?.map((item: any, i: number) => {
                                                            if (!item.imageUrl) return null;
                                                            return (
                                                                <div key={i} className="aspect-square w-full overflow-hidden rounded-md bg-white">
                                                                    <img
                                                                        src={item.imageUrl}
                                                                        className="w-full h-full object-cover transition-transform hover:scale-105"
                                                                        alt="Technical Component"
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {/* 2. 🆕 Technical Hardwares (Common Materials) Gallery */}
                        {hasCommonImages && (
                            <div className="mb-10 p-6 rounded-xl border-l-[6px] border-[#2563eb] bg-gradient-to-b from-[#fbfdff] to-[#f5f8ff] shadow-sm">
                                <h3 className="text-lg font-bold text-[#0f4c81] mb-6">
                                    Gallery: Technical Hardwares
                                </h3>

                                <div className="space-y-8">
                                    <div>
                                        <span className="text-[11px] font-black text-[#272829] uppercase tracking-[0.2em] block mb-3">
                                            Mechanical Integration & Assembly Components
                                        </span>

                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {commonMaterial?.map((item: any, i: number) => {
                                                if (!item.imageUrl) return null;
                                                return (
                                                    <div key={`common-img-${i}`} className="aspect-square w-full overflow-hidden rounded-md bg-white">
                                                        <img
                                                            src={item.imageUrl}
                                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                                            alt="Integration Component"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* end of image gallery */}

                <div className="mt-10 text-right">
                    <div className="inline-block bg-green-50 border border-green-200 rounded-md px-6 py-4">
                        <p className="text-md font-medium text-gray-700 mb-1">Grand Total</p>
                        <p className="text-2xl font-bold text-green-700">₹{grandTotal?.toLocaleString("en-in")}</p>
                    </div>
                </div>

                <footer className="mt-10 pt-4 border-t border-gray-200 flex justify-between text-[10px] text-[#6e6e73] uppercase tracking-widest font-bold">
                    <span>© {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME} - Official Quotation</span>
                    {/* <span>RAMS TECH CIRCLE (OPC) PVT LTD</span> */}
                    <span>{orgData?.registeredEntity}</span>
                </footer>
            </div>
        </main>
    );
};

export default QuoteType4;