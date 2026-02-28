import React, { useEffect, useState } from 'react';
import { COMPANY_DETAILS } from '../../../../constants/constants';
import { useGetAllRequirementInfo } from '../../../../apiList/Stage Api/requirementFormApi';
import { useParams } from 'react-router-dom';
import { useGetProjects } from '../../../../apiList/projectApi';
import { useUpdateClientQuote } from '../../../../apiList/Quote Api/ClientQuote/clientQuoteApi';
import { toast } from '../../../../utils/toast';
import { useGetSingleOrganization } from '../../../../apiList/orgApi';
import QuoteType4 from './QuoteType4';

interface Props {
    data: any;
    furnitures: any[];
    isBlurred: boolean;
}

export const DEFAULT_QUOTE_TEXTS = {
    included: `
• Modular Furniture (As per Approved Design)  
  Supply and installation of modular furniture strictly as per the final approved designs, layouts, dimensions, and specifications.

• Materials & Hardware (As Specified in the Quote)  
  Quality raw materials including boards/plywood, laminates/finishes, and premium hardware as mentioned in this quotation by brand, model, thickness, and finish.  
  Any upgrades or changes can be accommodated with a revised quote after your approval.

• Factory Finish & Edge Banding (2mm Standard Finish)  
  Professional factory finish with 2mm edge banding as part of the standard manufacturing process for the selected materials and finishes.  
  Special finishes or different edge band thickness can be provided based on your preference with a revised quote.
`,

    //     excluded: `• Civil, and plumbing works.
    // • Granite or Quartz countertop supply and fitting.
    // • External appliances and loose furniture items.`,


    excluded: `
• Electrical, Plumbing, Painting & Civil Works (Unless Specifically Quoted)  
  Electrical works, plumbing works, painting, wall cutting/chasing, patchwork, plastering, and any other civil modifications are not included unless they are specifically mentioned in this quotation.

• Appliances, Lights & Loose Accessories  
  Appliances, lights, fixtures, decorative fittings, and loose accessories are not included unless explicitly specified in the quotation.

• Debris Removal, Permissions & Third-Party Charges  
  Debris removal, waste disposal, building permissions, society or association charges, parking or loading fees, lift usage charges, and any third-party coordination or approvals are not included unless clearly mentioned in this quotation.
`,

    free: `Complimentary (Applicable for projects above ₹5,00,000):
     Electrical labour for open-wall wiring only
     Excludes wall cutting/chasing, plastering, patchwork, painting
     Excludes all electrical materials and accessories
     Subject to Complimentary Terms mentioned in Disclaimer`,



    //     terms: `• 50% Advance | 40% on Delivery | 10% Post Installation.
    // • Quote valid for 15 days from issuance date.
    // • Digital acceptance is considered legally valid.`,


    // 👇 UPDATED TERMS SECTION

    terms: `Vertical Living – PAYMENT TERMS
------------------------------------------------------------
MILESTONE | AMOUNT | WORK INCLUDED
◆ Booking Advance: INR 10,000 (fixed) (Site visit, discussion, proposal)
◆ Design Approval: INR 15,000 (fixed) (2D/3D design, site measurement, BOQ)
◆ Procurement: 80% of total (Material purchase, fabrication initiation)
◆ Execution: 10% of total (Installation, finishing, electrical/plumbing)
◆ Handover: 10% of total (Snag closure, cleaning, final handover)

PAYMENT TERMS AND CONDITIONS
------------------------------------------------------------
• Delayed Payments: Interest of 2% per month applies after 5 working days.
• GST: Added as applicable by law.
• Forfeiture Clause: If next milestone is not paid within 7 days, previous fixed payments (INR 25,000) are forfeited.
• Legal Validity: Acceptance via digital/physical signature or email is enforceable under the IT Act, 2000.`,

    disclaimer: `DISCLAIMER, PRELIMINARY ESTIMATE & CHANGE CONTROL
------------------------------------------------------------
1. PURPOSE OF PRELIMINARY QUOTES: Any rough estimate or sqft-based pricing is shared solely to help the Client assess budget feasibility. Final project cost may vary significantly once actual requirements and scope are defined.

2. INDICATIVE NATURE OF QUOTES: Rates shared without complete inputs (design, site measurements, material preferences) are only indicative and not binding. Final pricing is issued only after design finalization and material selection.

3. DESIGN FINALITY: All dimensions, finishes, and specifications are based on details approved at the time of quotation. Changes requested after approval will be treated as variations with additional costs.

4. SCOPE BOUNDARIES: Covers only explicitly mentioned items. Extra civil, electrical, or plumbing works requested during execution will be charged separately via revised quotation.

5. MATERIAL & PRICE FLUCTUATIONS: Materials are subject to market availability. Prices are subject to change due to supplier revisions, tax changes, or logistics costs.

6. TIMELINE DEPENDENCIES: Estimates depend on timely approvals and site readiness. External delays or design changes will result in automatic timeline extensions without penalty to the Company.

7. CLIENT APPROVALS: Approvals given via email, WhatsApp, or signature are final. Rework requested after approval is chargeable.

8. SITE CONDITIONS: Quotation is based on visible conditions. Hidden structural defects, dampness, or concealed plumbing/electrical issues discovered during execution are out of scope and charged separately.

9. NO COMMITMENT: No price or timeline is locked until a detailed final quotation is formally approved. Preliminary numbers do not constitute a commitment.

10. NO VERBAL COMMITMENTS: Only specifications recorded in writing within this document shall be binding.

11. FORCE MAJEURE: The Company is not liable for delays caused by strikes, lockdowns, transport disruptions, or natural calamities.

-------------------------------------------------------------------------------------------------------------------------

Complimentary Electrical Labour (Applicable for Projects Above ₹5,00,000)

• Complimentary electrical labour is provided only for open-wall wiring within the approved interior work scope.

• This complimentary service covers labour charges only and does not include any electrical materials or accessories such as wires, conduits, switches, sockets, switchboards, MCBs, DBs, fittings, lights, fans, or fixtures.

• Wall cutting, wall chasing, wall breaking, plastering, patchwork, painting, finishing, or restoration work is strictly excluded and will be charged separately if required.

• Complimentary electrical labour applies only to new wiring in open walls and excludes rewiring of existing concealed wiring, fault finding, rectification, shifting of main lines, or modifications to existing electrical infrastructure unless expressly quoted.

• Any additional electrical points, layout changes, or work beyond the approved electrical layout shall be chargeable.

• Complimentary electrical labour is applicable only if the final approved and executed project value exceeds ₹5,00,000. If the project value is revised below this threshold due to scope reduction, cancellation, or client-driven changes, the Company reserves the right to withdraw this benefit.

• Approvals, permits, inspections, and coordination with building management or authorities are not included and remain the Client’s responsibility unless separately quoted.

• This complimentary service does not extend the project delivery timeline. Delays due to material availability, client approvals, or site readiness shall not be attributed to the Company.

• Complimentary electrical labour is provided at the Company’s discretion, may be modified or withdrawn in case of payment delays, scope changes, site constraints, or non-compliance with payment terms, and is not a contractual entitlement.`
};

const ClientQuoteType4: React.FC<Props> = ({ data, furnitures, isBlurred }) => {
    const { organizationId } = useParams() as { organizationId: string }
    const handlePrint = () => window.print();

    let { data: organization, isLoading: orgLoading } = useGetSingleOrganization(organizationId!);

    const { mutateAsync: updateQuote, isPending: isSaving } = useUpdateClientQuote();

    const orgData = Array.isArray(organization) ? organization[0] : organization;


    // 1. Extract Unique Brands
    const allFittings = furnitures?.flatMap(f => f?.fittingsAndAccessories || []) || [];
    const allCommon = data?.commonMaterials || [];

    const uniqueFittings = [...new Set(allFittings.map((item: any) => item.brandName).filter(Boolean))];
    const uniqueCommon = [...new Set(allCommon.map((item: any) => item?.brandName).filter(Boolean))];
    const uniquePlywood = [...new Set(furnitures?.map(f => f.plywoodBrand).filter(Boolean))];
    const uniqueInnerLam = [...new Set(furnitures?.map(f => f.innerLaminateBrand).filter(Boolean))];
    const uniqueOuterLam = [...new Set(furnitures?.map(f => f.outerLaminateBrand).filter(Boolean))];

    // 2. Build the string array dynamically
    const brandRows: string[] = [];

    if (uniquePlywood.length > 0) brandRows.push(`• Plywood: ${uniquePlywood.join(", ")}`);
    if (uniqueInnerLam.length > 0) brandRows.push(`• Inner Laminate: ${uniqueInnerLam.join(", ")}`);
    if (uniqueOuterLam.length > 0) brandRows.push(`• Outer Laminate: ${uniqueOuterLam.join(", ")}`);
    if (uniqueFittings.length > 0) brandRows.push(`• Fittings: ${uniqueFittings.join(", ")}`);
    if (uniqueCommon.length > 0) brandRows.push(`• Common Materials: ${uniqueCommon.join(", ")}`);

    // 3. Join with newlines
    const brandlistString = brandRows.join("\n");



    // Using an object where key is furniture ID and value is the base64 preview
    const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});
    const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});

    const handleImageClick = (furnitureId: string) => {
        document.getElementById(`file-input-${furnitureId}`)?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, furnitureId: string) => {
        const file = e.target.files?.[0];
        console.log("furnirueId", furnitureId)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log("reader", reader)
                setLocalPreviews(prev => ({ ...prev, [furnitureId]: reader.result as string }));
                console.log("file", file)
                setSelectedFiles(prev => ({ ...prev, [furnitureId]: file }));
            };
            reader.readAsDataURL(file);
        }
    };
    // console.log("localPreviews", localPreviews)
    // console.log("funriture", furnitures)

    const handleSaveTemplate = async () => {
        try {

            const formDataPayload = new FormData();

            // 1. Collect standard template text fields
            const textFields = [
                'clientDetails', 'projectDetails', 'whatsIncluded',
                'whatsNotIncluded', 'whatIsFree', 'brandlist',
                'TermsAndConditions', 'disclaimer'
            ];

            textFields.forEach(field => {
                const el = document.querySelector(`textarea[name="${field}"]`) as HTMLTextAreaElement;
                formDataPayload.append(field, el?.value || "");
            });

            // 2. Collect Furniture Updates (Dimensions + Image Files)
            // We send a JSON string of updates to identify which furniture gets which dimensions

            console.log("furnitrues", furnitures)
            const furnitureUpdates = furnitures.map((f) => {
                // Get dimensions from the DOM for this specific furniture
                // Use querySelector with a specific identifier like data-furniture-id
                const container = document.querySelector(`[data-furniture-container="${f._id}"]`);
                const width = (container?.querySelector('input[name="width"]') as HTMLInputElement)?.value;
                const height = (container?.querySelector('input[name="height"]') as HTMLInputElement)?.value;
                const depth = (container?.querySelector('input[name="depth"]') as HTMLInputElement)?.value;


                const scopeOfWork = (container?.querySelector('textarea[name="scopeOfWork"]') as HTMLTextAreaElement)?.value;

                return {
                    furnitureId: f._id,
                    scopeOfWork: scopeOfWork,
                    dimention: {
                        width: Number(width) || 0,
                        height: Number(height) || 0,
                        depth: Number(depth) || 0
                    }
                };
            });

            formDataPayload.append("furnitureUpdates", JSON.stringify(furnitureUpdates));

            // 3. Attach Files using the furniture ID as the fieldname for matching
            Object.keys(selectedFiles).forEach((id) => {
                formDataPayload.append(`furnitureImage_${id}`, selectedFiles[id]);
            });

            await updateQuote({ id: data._id, formData: formDataPayload });
            toast({ title: "Success", description: "All changes saved successfully" });

            // Optional: Clear local state after successful save
            setSelectedFiles({});
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to save changes",
                variant: "destructive"
            });
        }
    };


    // Inside ClientQuoteSingle.tsx
    const { data: requirementInfo } = useGetAllRequirementInfo({ projectId: data?.projectId?._id! });
    const { data: allProjects } = useGetProjects(organizationId!);

    // Find the specific project name
    const currentProject = allProjects?.find((p: any) => p._id === data?.projectId?._id!);

    // console.log("requirementInfo", requirementInfo)

    // Prepare the strings for the Type 4 component
    const clientDetailsFallback = `Name: ${requirementInfo?.clientData?.clientName || 'Not Entered Yet'}
Email: ${requirementInfo?.clientData?.email || "Not Entered Yet"}
WhatsApp: ${requirementInfo?.clientData?.whatsapp || 'Not Entered Yet'}
Location: ${requirementInfo?.clientData?.location || 'Not Entered Yet'}`;

    const projectDetailsFallback = `Project: ${currentProject?.projectName || 'Not Entered Yet'}
Quotation No: ${data?.quoteNo || 'Not Entered Yet'}`;


    // Inside your ClientQuoteType4 component
    // const autoExpand = (e: React.FormEvent<HTMLTextAreaElement>) => {
    //     e.currentTarget.style.height = 'auto';
    //     e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
    // };


    const adjustHeight = (el: HTMLTextAreaElement | null) => {
        if (!el) return;
        el.style.height = 'auto'; // Reset height to get accurate scrollHeight
        el.style.height = `${el.scrollHeight}px`;
    };


    // Inside your ClientQuoteType4 component
    const autoExpand = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    };

    useEffect(() => {
        // 1. Give React a moment to ensure the DOM and data are ready
        const timer = setTimeout(() => {
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach((textarea) => {
                autoExpand(textarea as HTMLTextAreaElement);
            });
        }, 100); // Small delay to handle data population

        return () => clearTimeout(timer);
    }, [data, furnitures]); // Re-run if the main data changes


    // Data Mapping
    const quoteNo = data?.quoteNo; // cite: 1.1
    // const creationDate = new Date(data?.createdAt).toLocaleDateString('en-IN'); // cite: 1.1
    const creationTime = new Date(data?.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); // cite: 1.1

    // This will output: 3 Feb 2026 (based on the current year 2026)
    const creationDate = data?.createdAt
        ? new Date(data.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
        : new Date(data?.createdAt).toLocaleDateString('en-IN');

    const version = (data?.__v || 0) + 1; // cite: 1.1
    const grandTotal = data?.grandTotal || 0


    // 2. 🆕 GENERATE ENGINEERING-STANDARD SCOPE OF WORK FOR COMMON MATERIALS
    const generateCommonMaterialScope = () => {
        if (allCommon.length === 0) return "General site consumables and hardware required for standard execution.";

        const brands = uniqueCommon.join(", ");

        // Engineering-style professional description
        return `Technical provisioning of industrial-grade site consumables and installation hardware, primarily utilizing high-performance materials from ${brands}.
The scope includes the application of specialized adhesion protocols and structural fasteners to ensure the long-term integrity of all modular assemblies.
All site-wide consumables are selected to meet internal quality benchmarks and engineering standards for load-bearing capacity and environmental resistance.
Systematic integration of these general materials is performed to support the precision-fitting requirements of the primary furniture units.
Quality assurance is maintained through the consistent use of specified ${uniqueCommon.length > 1 ? 'brands' : 'brand'} to prevent material incompatibility and ensure a seamless finish.`;
    };

    const commonMaterialScopeOfWork = generateCommonMaterialScope();

    const renderBrandSpecificationTable = (furniture: any) => {
        const uniqueFittings = Array.from(new Set(furniture.fittingsAndAccessories?.filter((item: any) => item.brandName).map((item: any) => item.brandName))).join(", ");
        const uniqueGlues = Array.from(new Set(furniture.glues?.filter((item: any) => item.brandName).map((item: any) => item.brandName))).join(", ");

        const specs = [
            // { category: "Plywood", brand: furniture.plywoodBrand, desc: "Structural carcass material" },
            // { category: "Inner Laminate", brand: furniture.innerLaminateBrand, desc: "Internal finish" },
            // { category: "Outer Laminate", brand: furniture.outerLaminateBrand, desc: "Premium external finish" },
            // { category: "Fittings & Accessories", brand: uniqueFittings, desc: "Functional hardware" },
            // { category: "Adhesives/Glues", brand: uniqueGlues, desc: "Bonding agents" },

            { category: "Plywood", brand: furniture.plywoodBrand, desc: "" },
            { category: "Inner Laminate", brand: furniture.innerLaminateBrand, desc: "" },
            { category: "Outer Laminate", brand: furniture.outerLaminateBrand, desc: "" },
            { category: "Fittings & Accessories", brand: uniqueFittings, desc: "" },
            { category: "Adhesives/Glues", brand: uniqueGlues, desc: "" },
        ].filter(s => s.brand);

        if (specs.length === 0) return null;

        return (
            <table className="w-full border-collapse mt-3 text-[13px] bg-white rounded-lg overflow-hidden border border-gray-100">
                <thead>
                    <tr className="bg-[#eef4ff] text-[#1e3a8a]">
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Brand</th>
                        <th className="p-3 text-left">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {specs.map((spec, idx) => (
                        <tr key={idx}>
                            <td className="p-3 font-semibold text-gray-700">{spec.category}</td>
                            <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                    {spec.brand?.split(", ").map((b: any, bi: number) => (
                                        <span key={bi} className={`${isBlurred ? "blur-sm" : ""} px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold border border-blue-100 uppercase`}>
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="p-3 text-gray-400 italic">{spec.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // return (
    //     <main className="bg-[#f5f5f7] printable-content py-10 print:bg-white print:py-0" key={requirementInfo?.clientData?.clientName || 'loading'}>
    //         <div className="max-w-[230mm] mx-auto bg-white p-[15mm_20mm] shadow-2xl page-sheet print:shadow-none print:m-0" id="quote-page">

    //             <section className="flex justify-end gap-3 mb-6 print:hidden">
    //                 <Button
    //                     onClick={handleSaveTemplate}
    //                     disabled={isSaving}
    //                     className="bg-green-600 hover:bg-green-700 text-white"
    //                 >
    //                     {isSaving ? "Saving..." : "Save Template Changes"}
    //                 </Button>
    //                 <Button onClick={handlePrint} className="bg-[#4fa3c7]">
    //                     Print PDF
    //                 </Button>
    //             </section>

    //             {/* OFFICIAL HEADER */}
    //             {/* --- MODERN HEADER --- */}
    //             <header className="flex justify-between items-center border-b-4 border-blue-600 pb-6 mb-8">
    //                 <div className="flex items-center gap-5">
    //                     <div className="p-2 bg-white rounded-xl shadow-lg border border-gray-100">
    //                         <img src={COMPANY_DETAILS.COMPANY_LOGO} alt="Logo" className="h-[80px] w-auto object-contain" />
    //                     </div>
    //                     <div>
    //                         <h1 className="text-3xl font-black text-blue-900 m-0 tracking-tighter uppercase">{COMPANY_DETAILS.COMPANY_NAME}</h1>
    //                         <p className="text-[11px] text-orange-500 m-0 uppercase font-bold tracking-[0.2em]">Premium Interior Design & Modular Execution</p>
    //                     </div>
    //                 </div>

    //                 {/* Stylish Tracking Card */}
    //                 <div className="flex flex-col justify-center border-l-2 border-gray-100 pl-8 min-w-[240px]">
    //                     {/* Minimalist Tracking Layout */}
    //                     <div className="space-y-1.5">
    //                         <div className="flex justify-between items-center gap-6">
    //                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quote Ref No</span>
    //                             <span className="text-sm font-black text-blue-900 uppercase">{quoteNo}</span>
    //                         </div>

    //                         <div className="flex justify-between items-center gap-6">
    //                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revision No:</span>
    //                             <span className="text-xs font-semibold text-gray-700">R{version} (Updated)</span>
    //                         </div>

    //                         <div className="flex justify-between items-center gap-6">
    //                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issued On</span>
    //                             <span className="text-xs font-semibold text-gray-700">{creationDate}</span>
    //                         </div>

    //                         <div className="flex justify-between items-center gap-6">
    //                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timestamp</span>
    //                             <span className="text-xs font-semibold text-gray-700">{creationTime}</span>
    //                         </div>
    //                     </div>


    //                 </div>
    //             </header>



    //             <div className="grid grid-cols-3 gap-6 mb-10">
    //                 {[
    //                     {
    //                         label: "Registered Entity",
    //                         icon: "fa-id-card", // Updated to match settings
    //                         color: "blue",
    //                         show: !!(orgData?.registeredEntity || orgData?.address), // Only show if data exists
    //                         content: (
    //                             <>
    //                                 {orgData?.registeredEntity && <strong>{orgData.registeredEntity}</strong>}
    //                                 {/* {orgData?.registeredEntity && orgData?.address && <br />} */}
    //                                 <br />
    //                                 {orgData?.address && <span>{orgData.address}</span>}
    //                             </>
    //                         )
    //                     },
    //                     {
    //                         label: "Contact Details",
    //                         icon: "fa-phone-alt",
    //                         color: "orange",
    //                         show: !!(orgData?.organizationPhoneNo || orgData?.email || orgData?.website),
    //                         content: (
    //                             <>
    //                                 {orgData?.organizationPhoneNo && (
    //                                     <div>📞 {orgData.organizationPhoneNo}{orgData?.secondaryPhoneNo && <>, {orgData.secondaryPhoneNo}</>}</div>
    //                                 )}
    //                                 {orgData?.email && (
    //                                     <div>✉️ {orgData.email}</div>
    //                                 )}
    //                                 {orgData?.website && (
    //                                     <div>🌐 {orgData.website}</div>
    //                                 )}
    //                             </>
    //                         )
    //                     },
    //                     {
    //                         label: "Tax Registration",
    //                         icon: "fa-file-invoice",
    //                         show: !!orgData?.gstin,
    //                         content: (
    //                             <>
    //                                 <b>GSTIN:</b> <span className="text-orange-600 font-bold">{orgData?.gstin}</span>
    //                                 <br />
    //                                 Status: <span className="text-green-600 font-bold">Active Entity</span>
    //                             </>
    //                         )
    //                     }
    //                 ]
    //                     .filter(box => box?.show)?.map((box, idx) => (
    //                         <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
    //                             <div className="flex items-center gap-2 mb-2">
    //                                 <i className={`fas ${box.icon} text-${box.color}-500 text-xs`}></i>
    //                                 <span className={`text-[10px] font-black uppercase tracking-widest text-${box.color}-600`}>{box.label}</span>
    //                             </div>
    //                             <div className="text-[11px] leading-relaxed text-gray-600">
    //                                 {orgLoading ? (
    //                                     <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
    //                                 ) : (
    //                                     box.content
    //                                 )}
    //                             </div>
    //                         </div>
    //                     ))}
    //             </div>

    //             {/* CLIENT & PROJECT DETAILS */}
    //             {/* 1. PRIMARY PROJECT INFO */}
    //             <div className="grid grid-cols-2 gap-8 mb-12">
    //                 {/* Client Details Card */}
    //                 <div className="group space-y-3">
    //                     <div className="flex items-center gap-3">
    //                         <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
    //                             <i className="fas fa-user-tie text-white text-xs"></i>
    //                         </div>
    //                         <label className="text-[11px] font-black text-blue-900 uppercase tracking-widest">
    //                             Client Information
    //                         </label>
    //                     </div>
    //                     <div className="relative  rounded-xl overflow-hidden">
    //                         <textarea
    //                             className="w-full min-h-[70px] p-5 text-sm leading-relaxed text-gray-700 bg-blue-50/40 border-2 border-blue-100/50 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 resize-none overflow-hidden"
    //                             // defaultValue={`${data?.projectId?.clientName || "N/A"}\n${data?.projectId?.clientAddress || ""}`}
    //                             name="clientDetails"
    //                             defaultValue={data?.clientDetails || clientDetailsFallback}
    //                             onInput={(e) => autoExpand(e.currentTarget)}
    //                             ref={(el) => adjustHeight(el)}
    //                             rows={1}
    //                         />
    //                         {/* Corner Decorative Element */}
    //                     </div>
    //                 </div>

    //                 {/* Project Details Card */}
    //                 <div className="group space-y-3">
    //                     <div className="flex items-center gap-3">
    //                         <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-md">
    //                             <i className="fas fa-map-marker-alt text-white text-xs"></i>
    //                         </div>
    //                         <label className="text-[11px] font-black text-orange-900 uppercase tracking-widest">
    //                             Project Site Context
    //                         </label>
    //                     </div>
    //                     <div className="relative shadow-sm rounded-xl overflow-hidden">
    //                         <textarea
    //                             className="w-full min-h-[70px] p-5 text-sm leading-relaxed text-gray-700 bg-orange-50/40 border-2 border-orange-100/50 rounded-xl focus:bg-white focus:border-orange-500 outline-none transition-all duration-300 resize-none overflow-hidden"
    //                             // defaultValue={data?.mainQuoteName}
    //                             name="projectDetails"
    //                             defaultValue={data?.projectDetails || projectDetailsFallback}
    //                             onInput={(e) => autoExpand(e.currentTarget)}
    //                             ref={(el) => adjustHeight(el)}
    //                             rows={1}
    //                         />
    //                         {/* Corner Decorative Element */}
    //                     </div>
    //                 </div>
    //             </div>


    //             {/* 2. INCLUSIONS, EXCLUSIONS & TERMS (Reordered and Color-Coded) */}
    //             <div className="space-y-10 mb-16">
    //                 {[
    //                     { label: "What Is Included", key: "whatsIncluded", defaultKey: "included", color: "blue", icon: "fa-check-circle" },
    //                     { label: "What Is Excluded", key: "whatsNotIncluded", defaultKey: "excluded", color: "red", icon: "fa-times-circle" },
    //                     { label: "What Is Free (Complimentary)", key: "whatIsFree", defaultKey: "free", color: "green", icon: "fa-brand" },
    //                     { label: "Brands Specification", key: "brandlist", defaultKey: "brands", color: "green", icon: "fa-tags" }, , // Added Brand List                        
    //                     { label: "Terms & Conditions", key: "TermsAndConditions", defaultKey: "terms", color: "orange", icon: "fa-file-signature" },
    //                     { label: "Project Disclaimer", key: "disclaimer", defaultKey: "disclaimer", color: "gray", icon: "fa-exclamation-triangle" }
    //                 ].map((section) => {

    //                     // --- ADD THIS GUARD CLAUSE ---
    //                     if (!section) return null;


    //                     // --- DYNAMIC DATA LOGIC ---
    //                     let displayValue = data?.[section.key];

    //                     // If DB value is empty, use dynamic logic or defaults
    //                     if (!displayValue || displayValue.trim() === "") {
    //                         if (section.key === "brandlist") {
    //                             displayValue = brandlistString; // Use the dynamic logic calculated above
    //                         } else {
    //                             displayValue = DEFAULT_QUOTE_TEXTS[section.defaultKey as keyof typeof DEFAULT_QUOTE_TEXTS];
    //                         }
    //                     }


    //                     // Don't render the section at all if there's still no value (Prevents empty boxes)
    //                     if (!displayValue || displayValue.trim() === "") return null;

    //                     return (
    //                         <div key={section.key} className="relative pl-1 "
    //                         >
    //                             <h3 className="flex items-center gap-2 text-[10px] font-black text-gray-800 uppercase tracking-widest mb-3">
    //                                 <i className={`fas ${section.icon} text-${section.color}-500`}></i>
    //                                 {section.label}
    //                             </h3>

    //                             {/* Auto-expanding Textarea with soft background */}
    //                             <textarea
    //                                 className={`w-full border border-${section.color}-100 bg-${section.color}-50/30 rounded-xl p-5 text-xs leading-relaxed text-gray-600 focus:bg-white focus:ring-4 focus:ring-${section.color}-100/50 outline-none transition-all resize-none overflow-hidden`}
    //                                 name={section.key}
    //                                 placeholder={`Provide details for ${section.label.toLowerCase()}...`}
    //                                 defaultValue={displayValue}
    //                                 onInput={(e) => autoExpand(e.currentTarget)}
    //                                 ref={(el) => adjustHeight(el)}

    //                                 rows={2}
    //                             />
    //                         </div>
    //                     )
    //                 })
    //                 }
    //             </div>

    //             {/* PRODUCTS SECTION */}
    //             <div className="mt-8 new-page-section">
    //                 <h2 className="text-lg font-bold text-[#0f4c81] border-b-2 border-[#2563eb] pb-2 mb-6">Execution Scope & Product Estimates</h2>

    //                 {furnitures?.map((furniture, idx) => {
    //                     console.log("furnitures", furniture)

    //                     const displayImage = localPreviews[furniture._id] || furniture.coreMaterials?.[0]?.imageUrl;

    //                     const cardKey = `furniture-${furniture._id}-${idx}`;
    //                     return (
    //                         <div key={cardKey} data-furniture-container={furniture._id} className="mb-10 p-6 rounded-xl border-l-[6px] border-[#2563eb] bg-gradient-to-b from-[#fbfdff] to-[#f5f8ff] shadow-[0_10px_22px_rgba(0,0,0,0.06)] print:break-inside-avoid print:shadow-none print:border-gray-200">
    //                             <div className="flex justify-between items-start mb-4">
    //                                 <div>
    //                                     <h3 className="text-lg font-bold text-[#0f4c81]">{idx + 1}. Product: {furniture.furnitureName}</h3>
    //                                     <div className="text-[#16a34a] font-bold text-lg mt-1">Product Total: ₹{furniture.totals.furnitureTotal.toLocaleString('en-IN')}</div>
    //                                 </div>
    //                             </div>

    //                             {/* IMAGE & DIMENSIONS */}
    //                             <div className="flex gap-5 mb-6">
    //                                 <div
    //                                     className="w-[190px] border-2 border-dashed border-[#93c5fd] rounded-xl p-3 text-center bg-[#f8fbff] cursor-pointer hover:bg-blue-50 transition-colors group print:border-none"
    //                                     onClick={() => handleImageClick(furniture._id)}
    //                                 >
    //                                     <strong className="block mb-2 text-[13px] text-[#1e3a8a] print:hidden">Product Image</strong>

    //                                     <input
    //                                         type="file"
    //                                         id={`file-input-${furniture._id}`}
    //                                         className="hidden"
    //                                         accept="image/*"
    //                                         onChange={(e) => handleFileChange(e, furniture._id)}
    //                                     />

    //                                     {displayImage ? (
    //                                         <div className="relative group">
    //                                             <img src={displayImage} className="w-full rounded-lg border border-[#c7d2fe] shadow-sm" alt="Product" />
    //                                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity print:hidden">
    //                                                 <span className="text-white text-[10px] font-bold uppercase">Change Image</span>
    //                                             </div>
    //                                         </div>
    //                                     ) : (
    //                                         <div className="h-24 bg-gray-100 flex flex-col items-center justify-center rounded text-gray-400">
    //                                             <i className="fas fa-cloud-upload-alt text-xl mb-1"></i>
    //                                             <span className="text-[10px] font-bold">Upload 3D Image</span>
    //                                         </div>
    //                                     )}
    //                                 </div>


    //                                 <div className="flex-1 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
    //                                     {/* Modern Label */}
    //                                     <div className="flex items-center gap-2 mb-4">
    //                                         <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
    //                                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Technical Dimensions</span>
    //                                     </div>

    //                                     <div className="flex items-center justify-between gap-2">
    //                                         {[
    //                                             { label: 'Length', key: 'width', color: 'blue', icon: '↔️' },
    //                                             { label: 'Height', key: 'height', color: 'orange', icon: '↕️' },
    //                                             { label: 'Depth', key: 'depth', color: 'green', icon: '↗️' }
    //                                         ].map((dim, i) => (
    //                                             <React.Fragment key={dim.key}>
    //                                                 <div className="flex flex-col flex-1">
    //                                                     <div className="flex items-center gap-1 mb-1">
    //                                                         <span className="text-[9px] font-bold text-gray-400 uppercase">{dim.label}</span>
    //                                                     </div>
    //                                                     <div className={`relative flex items-center bg-${dim.color}-50/50 rounded-xl px-3 py-2 border border-${dim.color}-100 transition-all group-hover:bg-white`}>
    //                                                         <input
    //                                                             type="number"
    //                                                             name={dim.key}
    //                                                             defaultValue={furniture?.dimention?.[dim.key as keyof typeof furniture.dimention] || 0}
    //                                                             className={`w-full bg-transparent text-sm font-black text-${dim.color}-700 outline-none focus:ring-0`}
    //                                                         />
    //                                                         <span className="text-[9px] font-bold text-gray-400 ml-1 italic">ft</span>
    //                                                     </div>
    //                                                 </div>
    //                                                 {/* Visual Multiplier '×' between boxes */}
    //                                                 {i < 2 && <div className="text-gray-300 font-light text-xl self-end pb-2">×</div>}
    //                                             </React.Fragment>
    //                                         ))}
    //                                     </div>

    //                                 </div>
    //                             </div>


    //                             <div className="mt-3">
    //                                 <h2 className="font-bold text-sm text-gray-700 mt-5 mb-2">Execution Scope of Work</h2>
    //                                 {/* Modern Input Box */}
    //                                 <div className="relative group shadow-sm rounded-xl">
    //                                     <textarea
    //                                         name="scopeOfWork"
    //                                         className="w-full min-h-[100px] p-4 text-sm leading-relaxed text-gray-700 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 outline-none transition-all duration-200 resize-none overflow-hidden shadow-inner"
    //                                         defaultValue={furniture?.scopeOfWork || `Comprehensive manufacturing and installation of ${furniture.furnitureName} as per the approved site measurements and material standards.`}
    //                                         onInput={(e) => autoExpand(e.currentTarget)}
    //                                         ref={(el) => adjustHeight(el)}

    //                                         rows={1}
    //                                         placeholder="Describe the work to be performed..."
    //                                     />

    //                                     {/* Subtle edit indicator at bottom right */}
    //                                     <div className="absolute bottom-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity">
    //                                         <i className="fas fa-edit text-blue-300 text-xs"></i>
    //                                     </div>
    //                                 </div>
    //                             </div>

    //                             {/* SPECS TABLE */}
    //                             <h2 className="font-bold text-sm text-gray-700 mt-5 mb-2">Material & Brand Specifications</h2>
    //                             {renderBrandSpecificationTable(furniture)}

    //                             {/* COST BREAK-UP */}
    //                             <div className="font-bold text-sm text-gray-700 mt-6 mb-2">Cost Break-Up</div>
    //                             <table className="w-full border-collapse bg-white rounded-lg overflow-hidden border border-gray-100 text-sm">
    //                                 <thead>
    //                                     <tr className="bg-[#eef4ff] text-[#1e3a8a] text-left">
    //                                         <th className="p-3">Description</th>
    //                                         <th className="p-3 text-right">Amount (₹)</th>
    //                                     </tr>
    //                                 </thead>
    //                                 <tbody className="divide-y divide-gray-100">
    //                                     <tr><td className="p-3">Core Materials (Plywood & Laminates)</td><td className={`${isBlurred ? "blur-sm" : ""} p-3 text-right font-medium`}>₹{furniture.totals.core.toLocaleString('en-IN')}</td></tr>
    //                                     <tr><td className="p-3">Fittings & Accessories</td><td className={`${isBlurred ? "blur-sm" : ""} p-3 text-right font-medium `}>₹{furniture.totals.fittings.toLocaleString('en-IN')}</td></tr>
    //                                     <tr><td className="p-3">Adhesives & Glues</td><td className={`${isBlurred ? "blur-sm" : ""} p-3 text-right font-medium`}>₹{furniture.totals.glues.toLocaleString('en-IN')}</td></tr>
    //                                     <tr><td className="p-3">Non-Branded Materials</td><td className={`${isBlurred ? "blur-sm" : ""} p-3 text-right font-medium`}>₹{furniture.totals.nbms.toLocaleString('en-IN')}</td></tr>
    //                                 </tbody>
    //                             </table>

    //                             <div className="text-right mt-4 text-lg font-bold text-[#16a34a]">Product Total: ₹{furniture.totals.furnitureTotal.toLocaleString('en-IN')}</div>
    //                         </div>
    //                     )

    //                 }

    //                 )}
    //             </div>


    //             <div className="mt-10 text-right">
    //                 <div className="inline-block bg-green-50 border border-green-200 rounded-md px-6 py-4">
    //                     <p className="text-md font-medium text-gray-700 mb-1">
    //                         Grand Total
    //                     </p>

    //                     <p className="text-2xl font-bold text-green-700">
    //                         ₹{grandTotal?.toLocaleString("en-in")}
    //                     </p>
    //                 </div>
    //             </div>

    //             {/* PAGE FOOTER */}
    //             <footer className="mt-10 pt-4 border-t border-gray-200 flex justify-between text-[10px] text-[#6e6e73] uppercase tracking-widest font-bold">
    //                 <span>© {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME} - Official Quotation</span>
    //                 <span>RAMS TECH CIRCLE (OPC) PVT LTD</span>
    //             </footer>
    //         </div>
    //     </main>
    // );


    return (
        <QuoteType4
            // Basic Info
            quoteNo={quoteNo}
            version={version}
            usedIn='quoteForClients'
            creationDate={creationDate}
            creationTime={creationTime}

            // Branding & Org
            COMPANY_DETAILS={COMPANY_DETAILS}
            orgData={orgData}
            orgLoading={orgLoading}
            showSaveTemplateButton={true}

            // Text Content
            data={data}
            clientDetailsFallback={clientDetailsFallback}
            projectDetailsFallback={projectDetailsFallback}
            brandlistString={brandlistString}
            DEFAULT_QUOTE_TEXTS={DEFAULT_QUOTE_TEXTS}

            // Products
            furnitures={furnitures}
            commonMaterial={data?.commonMaterials || []}
            commonMaterialScopeOfWork={commonMaterialScopeOfWork}
            grandTotal={grandTotal}
            localPreviews={localPreviews}
            isBlurred={isBlurred}

            // Handlers
            isSaving={isSaving}
            handleSaveTemplate={handleSaveTemplate}
            handlePrint={handlePrint}
            handleImageClick={handleImageClick}
            handleFileChange={handleFileChange}
            renderBrandSpecificationTable={renderBrandSpecificationTable}
            autoExpand={autoExpand}
            adjustHeight={adjustHeight}
        />
    )
};

export default ClientQuoteType4;
