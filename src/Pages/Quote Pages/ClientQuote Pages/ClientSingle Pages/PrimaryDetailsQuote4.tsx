import React from 'react';
import { Button } from '../../../../components/ui/Button';

interface PrimaryQuoteProps {
    // Actions & Handlers
    handleSaveTemplate: () => void;
    handlePrint: () => void;
    isSaving?: boolean;
    autoExpand: (el: HTMLTextAreaElement) => void;
    adjustHeight: (el: HTMLTextAreaElement | null) => void;

    // Header Info
    COMPANY_DETAILS: { COMPANY_LOGO: string; COMPANY_NAME: string };
    quoteNo: string;
    version: string | number;
    creationDate: string;
    creationTime: string;

    // Organization Data
    orgData: any;
    orgLoading?: boolean;
    showClientAndProjectDetails?: boolean
    showSaveTemplateButton?: boolean

    // Content Data
    data: any;
    clientDetailsFallback?: string;
    projectDetailsFallback?: string;
    brandlistString?: string;
    DEFAULT_QUOTE_TEXTS: any;
}

const PrimaryDetailsQuote4: React.FC<PrimaryQuoteProps> = ({
    handleSaveTemplate, handlePrint, isSaving, autoExpand, adjustHeight,
    showClientAndProjectDetails,
    showSaveTemplateButton,
    COMPANY_DETAILS, quoteNo, version, creationDate, creationTime,
    orgData, orgLoading, data, clientDetailsFallback,
    projectDetailsFallback, brandlistString, DEFAULT_QUOTE_TEXTS
}) => {
    return (
        <>
            {/* ACTION BUTTONS */}
            <section className="flex justify-end gap-3 mb-6 print:hidden">
                { showSaveTemplateButton && <Button
                    onClick={handleSaveTemplate}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    {isSaving ? "Saving..." : "Save Template Changes"}
                </Button>
                }
                    <Button onClick={handlePrint} className="bg-[#4fa3c7]">
                        Print PDF
                    </Button>
               
            </section>

            {/* BRANDED HEADER */}
            <div className="flex justify-between items-center border-b-4 border-blue-600 pb-6 mb-8">
                <div className="flex items-center gap-5">
                    <div className="p-2 bg-white rounded-xl shadow-lg border border-gray-100">
                        <img src={COMPANY_DETAILS.COMPANY_LOGO} alt="Logo" className="h-[80px] w-auto object-contain" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-blue-900 m-0 tracking-tighter uppercase">{COMPANY_DETAILS.COMPANY_NAME}</h1>
                        <p className="text-[11px] text-orange-500 m-0 uppercase font-bold tracking-[0.2em]">Premium Interior Design & Modular Execution</p>
                    </div>
                </div>

                <div className="flex flex-col justify-center border-l-2 border-gray-100 pl-8 min-w-[240px]">
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center gap-6">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quote Ref No</span>
                            <span className="text-sm font-black text-blue-900 uppercase">{quoteNo}</span>
                        </div>
                        <div className="flex justify-between items-center gap-6">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revision No:</span>
                            <span className="text-xs font-semibold text-gray-700">R{version}</span>
                        </div>
                        <div className="flex justify-between items-center gap-6">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issued On</span>
                            <span className="text-xs font-semibold text-gray-700">{creationDate}</span>
                        </div>
                        <div className="flex justify-between items-center gap-6">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timestamp</span>
                            <span className="text-xs font-semibold text-gray-700">{creationTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ORG INFO BOXES */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                    {
                        label: "Registered Entity", icon: "fa-id-card", color: "blue",
                        show: !!(orgData?.registeredEntity || orgData?.address),
                        content: (
                            <>
                                {orgData?.registeredEntity && <strong>{orgData.registeredEntity}</strong>}
                                <br />
                                {orgData?.address && <span>{orgData.address}</span>}
                            </>
                        )
                    },
                    {
                        label: "Contact Details", icon: "fa-phone-alt", color: "orange",
                        show: !!(orgData?.organizationPhoneNo || orgData?.email || orgData?.website),
                        content: (
                            <>
                                {orgData?.organizationPhoneNo && <div>📞 {orgData.organizationPhoneNo}</div>}
                                {orgData?.email && <div>✉️ {orgData.email}</div>}
                                {orgData?.website && <div>🌐 {orgData.website}</div>}
                            </>
                        )
                    },
                    {
                        label: "Tax Registration", icon: "fa-file-invoice", color: "gray",
                        show: !!orgData?.gstin,
                        content: <><b>GSTIN:</b> <span className="text-orange-600 font-bold">{orgData?.gstin}</span><br />Status: <span className="text-green-600 font-bold">Active</span></>
                    }
                ].filter(box => box.show).map((box, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <i className={`fas ${box.icon} text-${box.color}-500 text-xs`}></i>
                            <span className={`text-[10px] font-black uppercase tracking-widest text-${box.color}-600`}>{box.label}</span>
                        </div>
                        <div className="text-[11px] leading-relaxed text-gray-600">
                            {orgLoading ? <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div> : box.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* CLIENT & PROJECT DETAILS */}
            {showClientAndProjectDetails && <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="space-y-3">
                    <h3 className="text-[11px] font-black text-blue-900 uppercase flex items-center gap-2"><i className="fas fa-user-tie"></i> Client Info</h3>
                    <textarea
                        className="w-full min-h-[70px] p-5 text-sm leading-relaxed text-gray-700 bg-blue-50/40 border-2 border-blue-100/50 rounded-xl outline-none resize-none overflow-hidden"
                        name="clientDetails"
                        defaultValue={data?.clientDetails || clientDetailsFallback}
                        onInput={(e) => autoExpand(e.currentTarget)}
                        ref={adjustHeight}
                    />
                </div>
                <div className="space-y-3">
                    <h3 className="text-[11px] font-black text-orange-900 uppercase flex items-center gap-2"><i className="fas fa-map-marker-alt"></i> Site Context</h3>
                    <textarea
                        className="w-full min-h-[70px] p-5 text-sm leading-relaxed text-gray-700 bg-orange-50/40 border-2 border-orange-100/50 rounded-xl outline-none resize-none overflow-hidden"
                        name="projectDetails"
                        defaultValue={data?.projectDetails || projectDetailsFallback}
                        onInput={(e) => autoExpand(e.currentTarget)}
                        ref={adjustHeight}
                    />
                </div>

            </div>
            }


            {/* INCLUSIONS / EXCLUSIONS / TERMS */}
            <div className="space-y-10 mb-16">
                {[
                    { label: "What Is Included", key: "whatsIncluded", defaultKey: "included", color: "blue", icon: "fa-check-circle" },
                    { label: "What Is Excluded", key: "whatsNotIncluded", defaultKey: "excluded", color: "red", icon: "fa-times-circle" },
                    { label: "What Is Free", key: "whatIsFree", defaultKey: "free", color: "green", icon: "fa-gift" },
                    { label: "Brands Specification", key: "brandlist", defaultKey: "brands", color: "emerald", icon: "fa-tags" },
                    { label: "Terms & Conditions", key: "TermsAndConditions", defaultKey: "terms", color: "orange", icon: "fa-file-signature" },
                    { label: "Project Disclaimer", key: "disclaimer", defaultKey: "disclaimer", color: "gray", icon: "fa-exclamation-triangle" }
                ].map((section) => {
                    let displayValue = data?.[section.key];
                    if (!displayValue || displayValue.trim() === "") {
                        displayValue = section.key === "brandlist" ? brandlistString : DEFAULT_QUOTE_TEXTS[section.defaultKey];
                    }
                    if (!displayValue) return null;

                    return (
                        <div key={section.key}>
                            <h3 className={`flex items-center gap-2 text-[10px] font-black text-${section.color}-600 uppercase tracking-widest mb-3`}>
                                <i className={`fas ${section.icon}`}></i> {section.label}
                            </h3>
                            <textarea
                                className={`w-full border border-${section.color}-100 bg-${section.color}-50/30 rounded-xl p-5 text-xs leading-relaxed text-gray-600 outline-none resize-none overflow-hidden`}
                                name={section.key}
                                defaultValue={displayValue}
                                onInput={(e) => autoExpand(e.currentTarget)}
                                ref={adjustHeight}
                                rows={2}
                            />
                        </div>
                    )
                })}
            </div>
        </>
    );
};

export default PrimaryDetailsQuote4;