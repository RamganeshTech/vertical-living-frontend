

// //  SECOND VERSION

// import React from 'react';
// import PrimaryDetailsQuote4 from '../ClientQuote Pages/ClientSingle Pages/PrimaryDetailsQuote4';
// import { useGetAllRequirementInfo } from '../../../apiList/Stage Api/requirementFormApi';
// import { useGetProjects } from '../../../apiList/projectApi';
// import { useGetSingleOrganization } from '../../../apiList/orgApi';
// import { COMPANY_DETAILS } from '../../../constants/constants';
// import { DEFAULT_QUOTE_TEXTS } from '../ClientQuote Pages/ClientSingle Pages/ClientQuoteType4';

// interface PreSalesProps {
//     rooms: any[];
//     data: any; // auditData
//     grandTotal: number;
//     organizationId: string;
//     isBlurred?: boolean;
// }

// const PreSalesQuoteType4: React.FC<PreSalesProps> = ({
//     rooms,
//     data,
//     grandTotal,
//     organizationId,
// }) => {

//     // --- 1. Internalized Data Fetching ---
//     const { data: organization, isLoading: orgLoading } = useGetSingleOrganization(organizationId);
//     const { data: requirementInfo } = useGetAllRequirementInfo({ projectId: data?.projectId?._id! });
//     const { data: allProjects } = useGetProjects(organizationId);

//     const orgData = Array.isArray(organization) ? organization[0] : organization;
//     const currentProject = allProjects?.find((p: any) => p._id === data?.projectId?._id!);

//     // --- 2. Internal UI Logic ---
//     const handlePrint = () => window.print();
//     const handleSaveTemplate = () => { console.log("Save functionality for Pre-Sales"); };

//     const adjustHeight = (el: HTMLTextAreaElement | null) => {
//         if (!el) return;
//         el.style.height = 'auto';
//         el.style.height = `${el.scrollHeight}px`;
//     };

//     const autoExpand = (el: HTMLTextAreaElement) => {
//         el.style.height = 'auto';
//         el.style.height = el.scrollHeight + 'px';
//     };

//     // --- 3. Internal Mapping Logic ---
//     const quoteNo = data?.quoteNo;
//     const creationTime = new Date(data?.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
//     const creationDate = data?.createdAt
//         ? new Date(data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
//         : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

//     const version = (data?.__v || 0) + 1;

//     const clientDetailsFallback = `Name: ${requirementInfo?.clientData?.clientName || 'Not Entered Yet'}
// Email: ${requirementInfo?.clientData?.email || "Not Entered Yet"}
// WhatsApp: ${requirementInfo?.clientData?.whatsapp || 'Not Entered Yet'}
// Location: ${requirementInfo?.clientData?.location || 'Not Entered Yet'}`;

//     const projectDetailsFallback = `Project: ${currentProject?.projectName || 'Not Entered Yet'}
// Quotation No: ${data?.quoteNo || 'Not Entered Yet'}`;

//     // Helper to group unique brands within a specific room
//     const getRoomBrandSpecs = (room: any) => {
//         const products = room.products || [];
//         const plywoods = [...new Set(products.map((p: any) => p.plywoodBrand).filter(Boolean))].join(", ");
//         const innerLams = [...new Set(products.map((p: any) => p.innerLaminateBrand).filter(Boolean))].join(", ");
//         const outerLams = [...new Set(products.map((p: any) => p.outerLaminateBrand).filter(Boolean))].join(", ");
//         const allFittings = products.flatMap((p: any) => p.fittingsAndAccessories || []);
//         const uniqueFittings = [...new Set(allFittings.map((f: any) => f.brandName).filter(Boolean))].join(", ");

//         return [
//             { category: "Plywood", brand: plywoods },
//             { category: "Inner Laminate", brand: innerLams },
//             { category: "Outer Laminate", brand: outerLams },
//             { category: "Hardware/Fittings", brand: uniqueFittings },
//         ].filter(s => s.brand);
//     };



//     // Inside PreSalesQuoteType4 component
//     const brandlistString = rooms
//         ?.flatMap(room => room.products?.flatMap((p: any) => [
//             p.plywoodBrand,
//             p.innerLaminateBrand,
//             p.outerLaminateBrand
//         ]))
//         .filter((val, index, self) => val && self.indexOf(val) === index) // Unique only
//         .join(", ");



//     const generateRoomScopeDescription = (room: any) => {
//         // 1. Collect all brands used in the room across all products
//         const pBrand = [...new Set(room.products?.map((p: any) => p.plywoodBrand).filter(Boolean))].join(", ");
//         const iBrand = [...new Set(room.products?.map((p: any) => p.innerLaminateBrand).filter(Boolean))].join(", ");
//         const oBrand = [...new Set(room.products?.map((p: any) => p.outerLaminateBrand).filter(Boolean))].join(", ");

//         // 2. Identify unique fittings
//         const allFittings = room.products?.flatMap((p: any) => p.fittingsAndAccessories || []);
//         const uniqueFittings = [...new Set(allFittings.map((f: any) => f.brandName).filter(Boolean))].join(", ");

//         let sentences = [];

//         // Sentence 1: Substrate
//         sentences.push(pBrand
//             ? `Primary structural fabrication for this space utilizes ${pBrand} substrate to ensure core dimensional stability and load-bearing capacity.`
//             : `Structural fabrication is executed using high-grade core substrates to maintain architectural integrity.`);

//         // Sentence 2: Exterior
//         sentences.push(oBrand
//             ? `The exterior surfaces feature ${oBrand} cladding, applied with industrial-grade bonding for high-wear resistance and premium aesthetics.`
//             : `Exterior surfaces involve technical cladding applied to ensure surface durability and protection.`);

//         // Sentence 3: Interior/Hardware
//         const hardwarePart = uniqueFittings ? ` and integrated with ${uniqueFittings} hardware systems` : "";
//         sentences.push(iBrand
//             ? `Internal reinforcement includes ${iBrand} liner application${hardwarePart} to achieve a balanced moisture-resistant seal.`
//             : `Internal reinforcement utilizes technical liners to maintain structural equilibrium.`);

//         // Sentence 4: Mechanical Integration
//         if (uniqueFittings) {
//             sentences.push(`Mechanical integration is completed using ${uniqueFittings} hardware systems, specifically selected for high-cycle operational longevity.`);
//         }

//         // Sentence 5: Final Protocol
//         sentences.push(`Final execution follows a modular installation protocol focusing on precision edge-sealing and calibrated site-fitment to meet professional standards.`);

//         return sentences.join(" ");
//     };

//     return (
//         <main className="bg-[#f5f5f7] printable-content py-10 print:bg-white print:py-0">


//               <style>
//                 {`
//                 @media print {
//                     /* 1. Hide everything on the page */
//                     body * {
//                         visibility: hidden !important;
//                     }

//                     /* 2. Show only the quote container and its children */
//                     #printable-quote-type4, #printable-quote-type4 * {
//                         visibility: visible !important;
//                     }

//                     /* 3. Reset positioning so it starts at the top of the PDF */
//                     #printable-quote-type4 {
//                         position: absolute !important;
//                         left: 0 !important;
//                         top: 0 !important;
//                         width: 100% !important;
//                         margin: 0 !important;
//                         padding: 20px !important; /* Professional margin for PDF */
//                         border: none !important;
//                         box-shadow: none !important;
//                     }

//                     /* 4. Fix height issues to prevent empty pages or cut-offs */
//                     html, body {
//                         height: auto !important;
//                         overflow: visible !important;
//                         background: white !important;
//                     }

//                     /* 5. Force colors for Dark Headers and Blue boxes */
//                     * {
//                         -webkit-print-color-adjust: exact !important;
//                         print-color-adjust: exact !important;
//                     }

//                     /* 6. Specifically hide navigation/buttons */
//                      .no-print, button, nav {
//                         display: none !important;
//                     }
//                 }
//                 `}
//             </style>


//             <div id="printable-quote-type4" className="max-w-[230mm] mx-auto bg-white p-[15mm_20mm] shadow-2xl page-sheet print:shadow-none print:m-0">

//                 {/* 1. Branded Header & Terms Component */}
//                 <PrimaryDetailsQuote4
//                     key={data?.clientDetails || data?.projectDetails || 'loading'}
//                     quoteNo={quoteNo}
//                     showSaveTemplateButton={false}
//                     version={version}
//                     creationDate={creationDate}
//                     creationTime={creationTime}
//                     COMPANY_DETAILS={COMPANY_DETAILS}
//                     orgData={orgData}
//                     orgLoading={orgLoading}
//                     data={data}
//                     clientDetailsFallback={clientDetailsFallback}
//                     showClientAndProjectDetails={false}
//                     projectDetailsFallback={projectDetailsFallback}
//                     brandlistString={brandlistString}
//                     DEFAULT_QUOTE_TEXTS={DEFAULT_QUOTE_TEXTS}
//                     isSaving={false}
//                     handleSaveTemplate={handleSaveTemplate}
//                     handlePrint={handlePrint}
//                     autoExpand={autoExpand}
//                     adjustHeight={adjustHeight}
//                 />

//                 {/* 2. Room-wise Execution Scope */}
//                 <div className="mt-12">
//                     <h2 className="text-xl font-black text-blue-900 border-b-4 border-orange-500 pb-2 mb-8 uppercase tracking-tighter">
//                         Rooms & Cost Break-up
//                     </h2>

//                     {rooms?.map((room, idx) => {
//                         const brandSpecs = getRoomBrandSpecs(room);

//                         // Generate the technical description for this specific room
//                         const generatedScope = generateRoomScopeDescription(room);

//                         return (
//                             <div key={room.id} className="mb-12 border-l-[6px] border-[#2563eb] p-8 rounded-3xl  bg-white shadow-sm print:break-inside-avoid">
//                                 <div className="flex justify-between items-center border-b-2 border-slate-100 pb-4 mb-6">
//                                     <div className="flex items-center gap-3">
//                                         {/* Serial Number - Same size as room name, Blue */}
//                                         <span className="text-lg font-black text-blue-600">
//                                             {idx + 1}.
//                                         </span>

//                                         {/* Room Name - Blue */}
//                                         <h3 className="text-lg font-black text-blue-600 uppercase tracking-tight">
//                                             {room.roomName}
//                                         </h3>
//                                     </div>

//                                     {/* Investment Value - Green */}
//                                     <div className="text-right">
//                                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-0.5">
//                                             Room Total
//                                         </span>
//                                         <div className="text-2xl font-black text-green-600 tracking-tighter">
//                                             ₹{room.roomTotal?.toLocaleString('en-IN')}
//                                         </div>
//                                     </div>
//                                 </div>


//                                 <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
//                                     <i className="fas fa-list-ul text-blue-500"></i> Execution Scope of Work
//                                 </h4>

//                                 {/* Dynamic Textarea for Room Description */}
//                                 <div className="my-3">
//                                     <textarea
//                                         className="w-full min-h-[120px] p-5 text-sm leading-relaxed text-gray-600 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-500 resize-none overflow-hidden"
//                                         defaultValue={generatedScope || `Comprehensive manufacturing and installation of ${room.roomName} as per the approved site measurements and material standards.`}
//                                         // value={generatedScope}
//                                         onInput={(e) => autoExpand(e.currentTarget)}
//                                         ref={(el) => adjustHeight(el)}
//                                         rows={4}
//                                     />
//                                 </div>

//                                 <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
//                                     <table className="w-full text-left border-collapse">
//                                         <thead>
//                                             <tr className="bg-slate-900 text-white">
//                                                 <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] w-12 text-center">#</th>
//                                                 <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em]">Product Description</th>
//                                                 <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-right">Dimensions (L × H)</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-slate-100">
//                                             {room.products?.map((prod: any, pIdx: number) => (
//                                                 <tr key={pIdx} className="hover:bg-slate-50/50 transition-colors">
//                                                     {/* Index Column */}
//                                                     <td className="py-4 px-6 text-center">
//                                                         <span className="text-[11px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
//                                                             {String(pIdx + 1).padStart(2, '0')}
//                                                         </span>
//                                                     </td>

//                                                     {/* Name Column */}
//                                                     <td className="py-4 px-6">
//                                                         <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
//                                                             {prod.furnitureName}
//                                                         </p>
//                                                         <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mt-0.5 opacity-80">
//                                                             {prod.dimensionType || 'Standard Specification'}
//                                                         </p>
//                                                     </td>

//                                                     {/* Dimensions Column (Length x Height only) */}
//                                                     <td className="py-4 px-6 text-right">
//                                                         <div className="flex items-center justify-end gap-2">
//                                                             <span className="text-[13px] font-bold text-slate-700">
//                                                                 {prod.width}<small className="text-[9px] text-slate-400 ml-0.5">ft</small>
//                                                             </span>
//                                                             <span className="text-slate-300 text-xs font-light px-1">×</span>
//                                                             <span className="text-[13px] font-bold text-slate-700">
//                                                                 {prod.height}<small className="text-[9px] text-slate-400 ml-0.5">ft</small>
//                                                             </span>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>

//                                 <div className="overflow-hidden rounded-2xl border border-gray-100">
//                                     <table className="w-full text-sm">
//                                         <thead>
//                                             <tr className="bg-blue-900 text-white font-bold">
//                                                 <th className="p-3 text-left text-[10px] uppercase">Category</th>
//                                                 <th className="p-3 text-left text-[10px] uppercase">Selected Brands</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-gray-100">
//                                             {brandSpecs.map((spec, sIdx) => (
//                                                 <tr key={sIdx}>
//                                                     <td className="p-4 font-bold text-blue-900 bg-blue-50/20 w-1/3">{spec.category}</td>
//                                                     <td className="p-4">
//                                                         <div className="flex flex-wrap gap-2">
//                                                             {spec.brand.split(", ").map((b, bi) => (
//                                                                 <span key={bi} className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase">
//                                                                     {b}
//                                                                 </span>
//                                                             ))}
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 <div className="mt-10 text-right">
//                     <div className="inline-block bg-green-50 border border-green-200 rounded-md px-6 py-4">
//                         <p className="text-md font-medium text-gray-700 mb-1">Grand Total</p>
//                         <p className="text-2xl font-bold text-green-700">₹{grandTotal?.toLocaleString("en-in")}</p>
//                     </div>
//                 </div>

//                 <footer className="mt-16 pt-6 border-t border-gray-200 flex justify-between text-[10px] text-[#6e6e73] uppercase tracking-widest font-bold">
//                     <span>© {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME} - Official Quotation</span> 
//                     <span>{orgData?.registeredEntity}</span>

//                 </footer>
//             </div>
//         </main>
//     );
// };

// export default PreSalesQuoteType4;




import React, { useMemo, useState } from 'react';
import { useGetSingleOrganization } from '../../../apiList/orgApi';
import { COMPANY_DETAILS } from '../../../constants/constants';
import QuoteType4 from '../ClientQuote Pages/ClientSingle Pages/QuoteType4';
import { DEFAULT_QUOTE_TEXTS } from '../ClientQuote Pages/ClientSingle Pages/ClientQuoteType4';
import { toast } from '../../../utils/toast';
import { useUpdatePreSalesQuote4Alone } from '../../../apiList/Quote Api/preSalesQuote_Api/preSalesQuoteApi';
// import QuoteType4, { DEFAULT_QUOTE_TEXTS } from '../ClientQuote Pages/ClientSingle Pages/ClientQuoteType4';

interface PreSalesProps {
    rooms: any[];
    data: any; // auditData
    grandTotal: number;
    organizationId: string;
    isBlurred?: boolean;
}

const PreSalesQuoteType4: React.FC<PreSalesProps> = ({
    rooms,
    data,
    grandTotal,
    organizationId,
    isBlurred,
}) => {


    console.log("rooms", rooms)
    console.log("data", data)
    // --- 1. Data Fetching ---
    const { data: organization, isLoading: orgLoading } = useGetSingleOrganization(organizationId);
    // const { data: requirementInfo } = useGetAllRequirementInfo({ projectId: data?.projectId?._id! });
    // const { data: allProjects } = useGetProjects(organizationId);

    const orgData = Array.isArray(organization) ? organization[0] : organization;
    // const currentProject = allProjects?.find((p: any) => p._id === data?.projectId?._id!);

    // --- 2. Data Transformation (Flattening Rooms into Furnitures) ---
    // const furnitures = useMemo(() => {
    //     return (rooms || []).flatMap((room) =>
    //         // (room.products || []).map((product: any, pIdx: number) => ({
    //         (room.products || []).map((product: any, pIdx: number) => {
    //             // 1. Extract strictly factual data from the product
    //             // const plyBrand = product.plywoodBrand;
    //             // const outerBrand = product.outerLaminateBrand;
    //             // const innerBrand = product.innerLaminateBrand;

    //             // // 2. Identify unique fittings for this specific product
    //             // const uniqueFittings = Array.from(new Set(
    //             //     (product.fittingsAndAccessories || [])
    //             //         .map((f: any) => f.brandName)
    //             //         .filter(Boolean)
    //             // )).join(", ");

    //             // 3. Filter dimensions that are present and greater than 0
    //             const dimParts = [];
    //             if (product.width > 0) dimParts.push(`${product.width} ft (Width)`);
    //             if (product.height > 0) dimParts.push(`${product.height} ft (Height)`);
    //             if (product.depth > 0) dimParts.push(`${product.depth} ft (Depth)`);

    //             // // 4. Build the sentences based ONLY on available facts (Engineering Standards)
    //             // let sentences = [];

    //             // // Sentence 1: Substrate Fact
    //             // sentences.push(
    //             //     plyBrand
    //             //         ? `Primary structural fabrication utilizes ${plyBrand} substrate to ensure core dimensional stability and load-bearing capacity.`
    //             //         : `Structural fabrication is executed using specified core substrates to maintain architectural integrity and load-bearing capacity.`
    //             // );

    //             // // Sentence 2: Exterior Finish Fact
    //             // sentences.push(
    //             //     outerBrand
    //             //         ? `The exterior surfaces are finished with ${outerBrand} cladding, applied with industrial-grade bonding for high-wear resistance.`
    //             //         : `Exterior surfaces involve technical cladding applied to ensure surface durability and environmental protection.`
    //             // );

    //             // // Sentence 3: Interior/Hardware Fact
    //             // const hardwarePart = uniqueFittings ? ` and integrated with ${uniqueFittings} hardware systems` : "";
    //             // sentences.push(
    //             //     innerBrand
    //             //         ? `Internal reinforcement includes ${innerBrand} liner application${hardwarePart} to achieve a balanced moisture-resistant seal.`
    //             //         : `Internal reinforcement utilizes technical liners to maintain structural equilibrium and protect internal surfaces.`
    //             // );

    //             // // Sentence 4: Hardware Fittings Fact
    //             // if (uniqueFittings) {
    //             //     sentences.push(`Mechanical integration is completed using ${uniqueFittings} hardware systems, specifically selected for high-cycle operational longevity.`);
    //             // } else {
    //             //     sentences.push(`The unit integrates standardized mechanical hardware systems to support essential structural load distribution.`);
    //             // }

    //             // // Sentence 5: Dynamic Dimension Fact (Strictly Factual & in Feet)
    //             // if (dimParts.length > 0) {
    //             //     sentences.push(`The technical assembly is manufactured to precise engineering specifications of ${dimParts.join(" x ")}.`);
    //             // }

    //             // // Final Protocol
    //             // sentences.push(`Final execution follows a modular installation protocol focusing on precision edge-sealing and calibrated site-fitment to meet professional standards.`);

    //             // const generatedScope = sentences.join(" ");

    //             return {
    //                 ...product,
    //                 // Map Pre-Sales keys to QuoteType4 expected keys
    //                 _id: product.id || product._id || `prod-${room.roomName}-${pIdx}`,
    //                 furnitureName: product.furnitureName,
    //                 dimention: {
    //                     width: product.width || 0,
    //                     height: product.height || 0,
    //                     depth: product.depth || 0
    //                 },
    //                 // totals: {
    //                 //     furnitureTotal: product.productTotal || 0,
    //                 //     core: (product.plywoodCost || 0) + (product.innerLaminateCost || 0) + (product.outerLaminateCost || 0),
    //                 //     fittings: product.fittingsAndAccessories?.reduce((acc: number, f: any) => acc + (f.totalPrice || 0), 0) || 0,
    //                 //     glues: 0, // Defaulting as not present in flat pre-sales structure
    //                 //     nbms: 0
    //                 // },
    //                 // scopeOfWork: generatedScope,
    //                 // scopeOfWork: `Comprehensive manufacturing and installation of ${product.furnitureName} for the ${room.roomName}.`,

    //                 // CRITICAL: Use the totals and scopeOfWork ALREADY in the product object
    //                 // This prevents the "undefined" error in QuoteType4.tsx
    //                 totals: product.totals || {
    //                     furnitureTotal: product.productTotal || 0,
    //                     core: product.productTotal || 0,
    //                     fittings: 0,
    //                     glues: 0,
    //                     nbms: 0
    //                 },

    //                 // Use the scope pre-generated in handleUpdate
    //                 scopeOfWork: product.scopeOfWork || `Technical assembly for ${product.furnitureName}.`,

    //             roomContext: room.roomName // Extra field if you want to display room name
    //             };
    //         })
    //     );
    // }, [rooms]);


    // --- 2. Data Transformation (Flattening Rooms into Furnitures) ---

    // SEECOND VERSION
    // const furnitures = useMemo(() => {
    //     return (rooms || []).flatMap((room) =>
    //         (room.products || []).map((product: any, pIdx: number) => {

    //             // 1. EXTRACT DATA DIRECTLY FROM DB STRUCTURE
    //             // In your DB log: height is 'h', width is 'w'
    //             const dbHeight = product.h || 0;
    //             const dbWidth = product.w || 0;
    //             const dbDepth = product.depth || 0;

    //             console.log("product", product)
    //             return {
    //                 ...product, // Bring in all fields (including scopeOfWork and productTotal)
    //                 _id: product.id || product._id || `prod-${room.roomName}-${pIdx}`,

    //                 // 2. MAP DIMENSIONS CORRECTLY FOR QuoteType4
    //                 // QuoteType4 expects 'dimention.width' and 'dimention.height'
    //                 dimention: {
    //                     width: dbWidth,
    //                     height: dbHeight,
    //                     depth: dbDepth
    //                 },

    //                 // 3. MAP TOTALS CORRECTLY
    //                 // We use the 'totals' object from DB, or fallback to productTotal
    //                 totals: product.totals || {
    //                     furnitureTotal: product.productTotal || 0,
    //                     core: product.productTotal || 0,
    //                     fittings: 0,
    //                     glues: 0,
    //                     nbms: 0
    //                 },

    //                 // 4. PERSIST SCOPE OF WORK
    //                 // Use the string already generated and saved in your DB
    //                 scopeOfWork: product.scopeOfWork || `Technical assembly for ${product.furnitureName}.`,

    //                 roomContext: room.roomName
    //             };
    //         })
    //     );
    // }, [rooms]);



    const furnitures = useMemo(() => {
        // ✅ Change: Map over data.config instead of rooms
        // This ensures we get the latest 'scopeOfWork' saved by the AI
        const configSource = data?.config || {};

        return Object.entries(configSource).flatMap(([roomName, roomInsts]: any) =>
            Object.values(roomInsts).flatMap((productInstanceGroup: any) =>
                Object.entries(productInstanceGroup).flatMap(([_productName, instanceGroup]: any) =>
                    Object.values(instanceGroup).map((product: any, pIdx: number) => {

                        return {
                            ...product,
                            _id: product.id || product._id || `prod-${roomName}-${pIdx}`,
                            dimention: {
                                width: product.w || 0,
                                height: product.h || 0,
                                depth: product.depth || 0
                            },
                            totals: product.totals || {
                                furnitureTotal: product.productTotal || 0,
                                core: product.productTotal || 0,
                                fittings: 0, glues: 0, nbms: 0
                            },
                            // ✅ This will now correctly pick up the AI Scope from the data prop
                            scopeOfWork: product.scopeOfWork,
                            roomContext: roomName
                        };
                    })
                )
            )
        );
    }, [data]); // ✅ Add 'data' to dependencies


    console.log("furnitures", furnitures)

    // --- 3. Handlers ---
    const handlePrint = () => window.print();

    const { mutateAsync: updateQuote, isPending: isSaving } = useUpdatePreSalesQuote4Alone();
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});

    const [preSaleslocalPreviews, setLocalPreviews] = useState<Record<string, string>>({});
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // Store the actual files for the upload payload
            setSelectedFiles((prev: any) => ({ ...prev, [id]: Array.from(files) }));

            // Create a local URL for the FIRST image to show as a preview
            const objectUrl = URL.createObjectURL(files[0]);
            setLocalPreviews(prev => ({ ...prev, [id]: objectUrl }));
        }
    };


    const handleImageClick = (id: string) => {
        // This looks for the id="file-input-${furniture._id}" defined in your QuoteType4
        const inputElement = document.getElementById(`file-input-${id}`) as HTMLInputElement;
        if (inputElement) {
            inputElement.click();
        }
    };




    // Handle file selection locally before upload
    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    //     if (e.target.files && e.target.files[0]) {
    //         setSelectedFiles(prev => ({ ...prev, [id]: e.target.files![0] }));
    //         // Optional: Create a local preview URL if needed
    //         console.log(`File selected for ${id}:`, e.target.files[0].name);
    //     }
    // };

    const handleSaveTemplate = async () => {
        try {
            const formDataPayload = new FormData();

            // 1. Collect standard template text fields from textareas
            const textFields = [
                'clientDetails', 'projectDetails', 'whatsIncluded',
                'whatsNotIncluded', 'whatIsFree', 'brandlist',
                'TermsAndConditions', 'disclaimer'
            ];

            textFields.forEach(field => {
                // // Condition for the two specific fields with different DOM names
                // let selectorName = field;
                // if (field === 'clientDetails') selectorName = 'clientDataTextArea';
                // if (field === 'projectDetails') selectorName = 'projectDetailsTextArea';

                // const el = document.querySelector(`textarea[name="${selectorName}"]`) as HTMLTextAreaElement;
                // // Only append if element exists, otherwise send empty string
                // formDataPayload.append(field, el?.value || "");


                let selectorName = field;
                let payloadKey = field; // Use this for the append key

                if (field === 'clientDetails') {
                    selectorName = 'clientDetails'; // The name in the HTML
                    payloadKey = 'clientDataTextArea';    // The name the backend expects
                }
                if (field === 'projectDetails') {
                    selectorName = 'projectDetails'; // The name in the HTML
                    payloadKey = 'projectDetailsTextArea';    // The name the backend expects
                }

                const el = document.querySelector(`textarea[name="${selectorName}"]`) as HTMLTextAreaElement;
                formDataPayload.append(payloadKey, el?.value || "");
            });

            // 2. Collect Furniture Updates (Dimensions + Scope of Work)
            // We iterate through the 'furnitures' list currently displayed
            const furnitureUpdates = furnitures.map((f) => {
                const container = document.querySelector(`[data-furniture-container="${f._id}"]`);

                // Extract dimensions
                const width = (container?.querySelector('input[name="width"]') as HTMLInputElement)?.value;
                const height = (container?.querySelector('input[name="height"]') as HTMLInputElement)?.value;
                const depth = (container?.querySelector('input[name="depth"]') as HTMLInputElement)?.value;

                // Extract the editable scope of work
                const scopeOfWork = (container?.querySelector('textarea[name="scopeOfWork"]') as HTMLTextAreaElement)?.value;

                return {
                    furnitureId: f._id,
                    scopeOfWork: scopeOfWork || f.scopeOfWork,
                    dimention: {
                        width: Number(width) || 0,
                        height: Number(height) || 0,
                        depth: Number(depth) || 0
                    }
                };
            });

            formDataPayload.append("furnitureUpdates", JSON.stringify(furnitureUpdates));

            // 3. Attach Image Files
            // Using the furniture ID to help the backend map the image to the correct unit
            Object.keys(selectedFiles).forEach((id) => {
                formDataPayload.append(`furnitureImage_${id}`, selectedFiles[id]);
            });

            // 4. Execute Mutation
            // data._id is the quoteId from the initial fetch
            await updateQuote({ id: data._id, formData: formDataPayload });

            toast({
                title: "Success",
                description: "Quote and technical details updated successfully",
                variant: "default"
            });

            // Clear files after successful upload
            setSelectedFiles({});

        } catch (error: any) {
            console.error("Save Error:", error);
            toast({
                title: "Error",
                description: error?.message || "Failed to save template changes",
                variant: "destructive"
            });
        }
    };

    const adjustHeight = (el: HTMLTextAreaElement | null) => {
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };

    const autoExpand = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    };

    // --- 4. Brand String Construction ---
    const brandlistString = useMemo(() => {
        const allBrands = (rooms || []).flatMap(room => room.products?.flatMap((p: any) => [
            p.plywoodBrand,
            p.innerLaminateBrand,
            p.outerLaminateBrand
        ]));
        return [...new Set(allBrands)].filter(Boolean).join(", ");
    }, [rooms]);

    // --- 5. Branding & Fallbacks ---
    const quoteNo = data?.quoteNo || "N/A";
    const version = (data?.__v || 0) + 1;
    // const issueDate = data?.projectDetails?.dateofIssue || new Date();
    const creationTime = new Date(data?.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const creationDate = new Date(data?.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });


    const clientDetailsFallback = useMemo(() => {
        const c = data?.clientData;
        return `Client Name: ${c?.clientName || 'Not Entered Yet'}
WhatsApp: ${c?.whatsapp || 'Not Entered Yet'}
Email: ${c?.email || 'Not Entered Yet'}
Location: ${c?.location || 'Not Entered Yet'}`;
    }, [data?.clientData]);

    const projectDetailsFallback = useMemo(() => {
        const p = data?.projectDetails;
        return `Project: ${p?.projectName || 'Not Entered Yet'}
Site Context: ${data?.clientData?.location || 'Not Entered Yet'}
Quote Ref: ${data?.quoteNo || 'Not Entered Yet'}`;
    }, [data?.projectDetails, data?.clientData, data?.quoteNo]);


    const transformedData = useMemo(() => ({
        ...data,
        clientDetails: clientDetailsFallback, // Explicit string
        projectDetails: projectDetailsFallback // Explicit string
    }), [data, clientDetailsFallback, projectDetailsFallback]);


    // --- 4. DETAILED BRAND TABLE ---
    const renderBrandSpecificationTable = (furniture: any) => {
        const uniqueFittings = Array.from(new Set(furniture.fittingsAndAccessories?.filter((item: any) => item.brandName).map((item: any) => item.brandName))).join(", ");
        const uniqueGlues = Array.from(new Set(furniture.glues?.filter((item: any) => item.brandName).map((item: any) => item.brandName))).join(", ");

        const specs = [
            { category: "Plywood", brand: furniture.plywoodName, desc: "" },
            { category: "Inner Laminate", brand: furniture.innerName, desc: "" },
            { category: "Outer Laminate", brand: furniture.outerName, desc: "" },
            { category: "Fittings & Accessories", brand: uniqueFittings, desc: "" },
            { category: "Adhesives/Glues", brand: uniqueGlues, desc: "" },
        ].filter(s => s.brand);

        if (specs.length === 0) return null;

        return (
            <table className="w-full border-collapse mt-3 text-[12px] bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <thead>
                    <tr className="bg-[#f8fbff] text-[#1e3a8a] border-b border-gray-100">
                        {/* <th className="p-3 text-left font-black uppercase tracking-widest text-[9px]">Category</th>
                        <th className="p-3 text-left font-black uppercase tracking-widest text-[9px]">Brand</th>
                        <th className="p-3 text-left font-black uppercase tracking-widest text-[9px]">Description</th> */}

                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Brand</th>
                        <th className="p-3 text-left">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {specs.map((spec, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-gray-700">{spec.category}</td>
                            <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                    {spec.brand?.split(", ").map((b: any, bi: number) => (
                                        <span key={bi} className={`${isBlurred ? "blur-sm" : ""} px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-black border border-indigo-100 uppercase`}>
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="p-3 text-gray-400 italic text-[10px]">{spec.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <QuoteType4
            quoteNo={quoteNo}
            version={version}
            usedIn='presales'
            creationDate={creationDate}
            creationTime={creationTime}
            COMPANY_DETAILS={COMPANY_DETAILS}
            orgData={orgData}
            orgLoading={orgLoading}
            data={transformedData}
            showSaveTemplateButton={true}
            clientDetailsFallback={clientDetailsFallback}
            projectDetailsFallback={projectDetailsFallback}
            brandlistString={brandlistString}
            DEFAULT_QUOTE_TEXTS={DEFAULT_QUOTE_TEXTS}
            furnitures={furnitures}
            grandTotal={grandTotal}
            localPreviews={{}} // Pre-sales typically uses default material images
            preSaleslocalPreviews={preSaleslocalPreviews}
            isBlurred={false}
            handlePrint={handlePrint}
            handleImageClick={handleImageClick}

            isSaving={isSaving} // Pass the loading state from mutation
            handleSaveTemplate={handleSaveTemplate}
            handleFileChange={handleFileChange} // Pass the file handler

            renderBrandSpecificationTable={renderBrandSpecificationTable}
            autoExpand={autoExpand}
            adjustHeight={adjustHeight}
        />
    );
};

export default PreSalesQuoteType4;