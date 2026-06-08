import React, { useEffect, useState } from 'react';
import { COMPANY_DETAILS } from '../../../../constants/constants';
import { useGetAllRequirementInfo } from '../../../../apiList/Stage Api/requirementFormApi';
import { useParams } from 'react-router-dom';
import { useGetProjects } from '../../../../apiList/projectApi';
import { useUpdateClientQuote } from '../../../../apiList/Quote Api/ClientQuote/clientQuoteApi';
import { toast } from '../../../../utils/toast';
import { useGetSingleOrganization } from '../../../../apiList/organization_api/orgApi';
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
