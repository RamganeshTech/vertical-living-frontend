// import React, { useState, useMemo, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '../../components/ui/Button';
// import { useGetProjects } from '../../apiList/projectApi';
// import { useGetAllClientQuotesForDropDown } from '../../apiList/Quote Api/ClientQuote/clientQuoteApi';
// import SearchSelectNew from '../../components/ui/SearchSelectNew';
// import { Input } from '../../components/ui/Input';
// import { useGetAllRequirementInfo } from '../../apiList/Stage Api/requirementFormApi';
// import { useCurrentSupervisor } from '../../Hooks/useCurrentSupervisor';

// interface IHeader {
//     projectId: string | null;
//     selectedQuoteNo: string | null;
//     selectedQuoteId: string | null,
//     clientName: string;
//     location: string;
//     versionNo: string;
// }

// const CutlistForm: React.FC<any> = ({ mode, isGeneratingPdf, initialData, onSubmit, isSubmitting, organizationId, handleGenerate }) => {
//     const navigate = useNavigate();
//     const currentUser = useCurrentSupervisor()
//     console.log("mode", mode)
//     const [previewImage, setPreviewImage] = useState<string | null>(null);

//     const [header, setHeader] = useState<IHeader>({
//         projectId: null,
//         selectedQuoteNo: null,
//         selectedQuoteId: null,
//         clientName: '',
//         location: '',
//         versionNo: '1.0'
//     });


//     const defaultRoom = {
//         roomName: 'Room 1',
//         productName: 'Product 1',
//         backSideLaminateImage: null,
//         frontSideLaminateImage: null,
//         items: [{
//             sNo: 1,
//             measurement: '',
//             plyThickness: '',
//             innerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' },
//             outerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' }
//         }]
//     };


//     // const [rooms, setRooms] = useState<any[]>([defaultRoom]);
//     const [rooms, setRooms] = useState<any[]>(initialData?.rooms?.length ? initialData.rooms : [defaultRoom]);
//     const prevProjectIdRef = useRef(header?.projectId);

//     // Effect to handle data loading for Edit mode specifically
//     useEffect(() => {
//         if (initialData) {
//             setHeader({
//                 projectId: initialData.projectId?._id || initialData.projectId || null,
//                 selectedQuoteNo: initialData?.quoteNo || null,
//                 selectedQuoteId: initialData?.quoteId || null,
//                 clientName: initialData.clientName || '',
//                 location: initialData.location || '',
//                 versionNo: initialData.versionNo || '1.0',

//             });
//             setRooms(initialData.rooms?.length ? initialData.rooms : [defaultRoom]);
//             setSummary(initialData?.summary || summary);
//             prevProjectIdRef.current = initialData.projectId?._id || initialData.projectId;
//         }
//     }, [initialData]);



//     const [summary, setSummary] = useState({
//         fabricationRate: 0,
//         unit: 'sqmm',
//         plywoodSheetSizeW: 1220,
//         plywoodSheetSizeH: 2440,
//         kerf: 0,
//         materialSummary: []
//     });

//     const { data: projectsData = [] } = useGetProjects(organizationId);
//     const { data: quotesData = [] } =
//         useGetAllClientQuotesForDropDown(organizationId, header.projectId || "");
//     // 1. Fetch Requirement Data based on selected projectId
//     const { data: requirementData } = useGetAllRequirementInfo({
//         projectId: header.projectId || ""
//     });

//     // 2. Auto-fill effect
//     useEffect(() => {
//         // We only want to auto-fill if we have data AND we are not in "Edit Mode" 
//         // (In Edit Mode, initialData should take priority)
//         const hasProjectChanged = header.projectId !== prevProjectIdRef.current;
//         if (requirementData?.clientData && hasProjectChanged) {
//             const { clientName, location } = requirementData?.clientData;

//             setHeader(prev => ({
//                 ...prev,
//                 clientName: clientName || prev.clientName,
//                 location: location || prev.location

//                 // clientName: prev.clientName === '' ? (clientName || '') : prev.clientName,
//                 // location: prev.location === '' ? (location || '') : prev.location
//             }));

//             // Update the ref to the current project
//             prevProjectIdRef.current = header.projectId;
//         }
//     }, [requirementData, header?.projectId]);


//     // --- CALCULATION ENGINE ---
//     const calculatedTotals = useMemo(() => {
//         let totalSqmm = 0;
//         rooms.forEach(room => {
//             room.items.forEach((item: any) => {
//                 const parts = item.measurement?.toLowerCase().replace(/mm/gi, "").split(/[x*×]/);
//                 if (parts?.length === 2) {
//                     const w = parseFloat(parts[0]) || 0;
//                     const h = parseFloat(parts[1]) || 0;
//                     totalSqmm += (w * h);
//                 }
//             });
//         });

//         let area = summary.unit === "sqmm" ? totalSqmm : summary.unit === "sqm" ? totalSqmm / 1e6 : (totalSqmm / 1e6) * 10.7639;
//         const cost = area * summary.fabricationRate;

//         return {
//             area: area.toFixed(2),
//             cost: cost.toFixed(2),
//             unit: summary.unit
//         };
//     }, [rooms, summary.fabricationRate, summary.unit]);

//     const handleImageAction = (rIdx: number, side: 'backSideLaminateImage' | 'frontSideLaminateImage', file: File | null) => {
//         const newRooms = [...rooms];
//         if (file) {
//             newRooms[rIdx][side] = {
//                 url: URL.createObjectURL(file),
//                 file: file,
//                 type: "image"
//             };
//         } else {
//             newRooms[rIdx][side] = null;
//         }
//         setRooms(newRooms);
//     };


//     const addRoom = () => {
//         setRooms([...rooms, { ...defaultRoom, roomName: `Room ${rooms.length + 1}` }]);
//     };

//     const deleteRoom = (rIdx: number) => {
//         if (rooms.length > 1) {
//             setRooms(rooms.filter((_, index) => index !== rIdx));
//         }
//     };

//     const addItem = (rIdx: number) => {
//         const newRooms = [...rooms];
//         const currentItems = newRooms[rIdx].items;
//         newRooms[rIdx].items = [
//             ...currentItems,
//             {
//                 sNo: currentItems.length + 1,
//                 measurement: '',
//                 plyThickness: '',
//                 innerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' },
//                 outerFace: { laminateThickness: '1.0', laminateBrand: '', laminateNameCode: '' }
//             }
//         ];
//         setRooms(newRooms);
//     };

//     const deleteItem = (rIdx: number, iIdx: number) => {
//         const newRooms = [...rooms];
//         if (newRooms[rIdx].items.length > 1) {
//             newRooms[rIdx].items = newRooms[rIdx].items.filter((_: any, index: number) => index !== iIdx);
//             // Re-index S.No
//             newRooms[rIdx].items = newRooms[rIdx].items.map((item: any, idx: number) => ({ ...item, sNo: idx + 1 }));
//             setRooms(newRooms);
//         }
//     };



//     const handleQuoteSelection = (quoteId: string | null) => {
//         if (!quoteId) return;
//         const selectedQuote = quotesData.find((q: any) => q._id === quoteId);
//         if (!selectedQuote) return;

//         const mappedRooms = (selectedQuote.furnitures || []).map((furniture: any) => ({
//             roomName: furniture.furnitureName || 'Room',
//             productName: furniture.furnitureName || 'Product',
//             backSideLaminateImage: null,
//             frontSideLaminateImage: null,
//             items: (furniture.coreMaterials || []).map((material: any, idx: number) => ({
//                 sNo: idx + 1,
//                 measurement: '0 x 0',
//                 plyThickness: material.plywoodNos?.thickness?.toString() || '0',
//                 innerFace: {
//                     laminateThickness: material.innerLaminate?.thickness?.toString() || '0',
//                     laminateBrand: furniture.innerLaminateBrand || '',
//                     laminateNameCode: ''
//                 },
//                 outerFace: {
//                     laminateThickness: material.outerLaminate?.thickness?.toString() || '0',
//                     laminateBrand: furniture.outerLaminateBrand || '',
//                     laminateNameCode: ''
//                 }
//             }))
//         }));
//         setRooms(mappedRooms);
//         setHeader(prev => ({
//             ...prev,
//             selectedQuoteId: quoteId,
//             selectedQuoteNo: selectedQuote.quoteNo,
//             clientName: selectedQuote.clientName || '',
//             location: selectedQuote.location || ''
//         }));
//     };

//     // --- ADVANCED MATERIAL SUMMARY CALCULATOR ---
//     const calculatedMaterialSummary = useMemo(() => {

//         const sheetWidth = Number(summary.plywoodSheetSizeW) || 0;
//         const sheetHeight = Number(summary.plywoodSheetSizeH) || 0;


//         // const sheetWidth = summary.plywoodSheetSizeW || 0;

//         // const sheetHeight = summary.plywoodSheetSizeH || 0;
//         const kerf = Number(summary.kerf) || 0;

//         // Area of one full sheet in sqmm
//         const areaPerSheet = sheetWidth * sheetHeight;

//         if (areaPerSheet <= 0) return [];

//         // Grouping by thickness
//         const groups: Record<string, number> = {};

//         rooms.forEach(room => {
//             room.items.forEach((item: any) => {
//                 const thickness = item.plyThickness;
//                 if (!thickness) return;

//                 // Parse "1990 x 720"
//                 const parts = item.measurement?.toLowerCase().replace(/mm/gi, "").split(/[x*×]/);
//                 if (parts?.length === 2) {
//                     const h = parseFloat(parts[0]) || 0;
//                     const w = parseFloat(parts[1]) || 0;


//                     if (!isNaN(h) && !isNaN(w) && h > 0 && w > 0) {
//                         const itemAreaWithWaste = (h + kerf) * (w + kerf);
//                         groups[thickness] = (groups[thickness] || 0) + itemAreaWithWaste;
//                     }

//                     // We add the kerf to each dimension to account for the material lost during cutting
//                     // const itemAreaWithWaste = (h + kerf) * (w + kerf);

//                     // if (!groups[thickness]) groups[thickness] = 0;
//                     // groups[thickness] += itemAreaWithWaste;
//                 }
//             });
//         });

//         // Convert total area per thickness into number of sheets
//         return Object.entries(groups).map(([thickness, totalArea]) => {
//             // Math.ceil ensures we always round up to the next full sheet
//             const sheetsNeeded = Math.ceil(totalArea / areaPerSheet);
//             return {
//                 thickness,
//                 // sheetsNeeded: isFinite(sheetsNeeded) ? sheetsNeeded : 0 || 0
//                 sheetsNeeded: sheetsNeeded
//             };
//         });
//     }, [rooms, summary.plywoodSheetSizeW, summary.plywoodSheetSizeH, summary.kerf]);

//     // 2. NEW: Sync the calculation into the 'summary' state automatically
//     // Sync calculation to state ONLY if valid items exist
//     useEffect(() => {
//         // Only update the state if the calculation has found at least one valid measurement
//         if (calculatedMaterialSummary && calculatedMaterialSummary.length > 0) {
//             setSummary((prev: any) => ({
//                 ...prev,
//                 materialSummary: calculatedMaterialSummary
//             }));
//         }
//     }, [calculatedMaterialSummary]);

//     // bg-[#f4f6f9]
//     return (
//         <div className="  text-slate-900 w-full">

//             {/* 0. Image Preview Modal */}
//             {previewImage && (
//                 <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
//                     <div className="relative max-w-4xl max-h-full">
//                         <img src={previewImage} className="rounded-lg shadow-2xl border-4 border-white max-h-[85vh] object-contain" alt="Preview" />
//                         <button className="absolute -top-4 -right-4 bg-red-600 text-white w-10 h-10 rounded-full font-bold shadow-lg">×</button>
//                     </div>
//                 </div>
//             )}


//             <div className="sticky top-0 z-50 bg-white border-b border-slate-300 shadow-sm">

//                 <header className="px-4 py-3 flex justify-between items-center w-full">
//                     <div className='flex justify-between items-center gap-2'>
//                         <button type="button" onClick={() => navigate(-1)} className='bg-blue-100 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2'>
//                             <i className="fas fa-arrow-left"></i>
//                         </button>
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//                                 <i className="fas fa-receipt mr-3 text-blue-600"></i>
//                                 Cutlist – Site Entry
//                             </h1>

//                         </div>
//                     </div>



//                     <section className='flex gap-2 items-center'>

//                         <Button className="bg-[#43a047] hover:bg-[#2e7d32] text-white px-8 font-bold" onClick={() => onSubmit(header, rooms, summary, currentUser?.name || "")} isLoading={isSubmitting}>
//                             Save Cutlist
//                         </Button>

//                         {handleGenerate &&
//                             <Button className="bg-[#43a047] hover:bg-[#2e7d32] text-white px-8 font-bold" onClick={handleGenerate} isLoading={isGeneratingPdf}>
//                                 Generate Pdf
//                             </Button>}
//                     </section>

//                 </header>
//             </div>

//             <div className="w-full space-y-4 mt-3">
//                 <section className="bg-white rounded-xl shadow-sm border border-slate-300 p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
//                     <div className="space-y-1">
//                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project</label>
//                         <SearchSelectNew
//                             options={projectsData.map((p: any) => ({ value: p._id, label: p.projectName }))}
//                             placeholder="Select Project"
//                             value={header.projectId || ""}
//                             onValueChange={(val) => setHeader(p => ({ ...p, projectId: val, selectedQuoteId: null }))}
//                         />
//                     </div>
//                     <div className="space-y-1">
//                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirmed Quote</label>
//                         <SearchSelectNew
//                             options={quotesData.map((q: any) => ({ value: q._id, label: q.quoteNo || "Select Quote" }))}
//                             placeholder="Select Quote"
//                             value={header.selectedQuoteId || ""}
//                             onValueChange={handleQuoteSelection}
//                         />
//                     </div>
//                     <div className="space-y-1">
//                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Version</label>
//                         <Input value={header.versionNo} disabled className="bg-slate-50 cursor-not-allowed font-bold text-slate-400" />
//                     </div>
//                     <div className="space-y-1">
//                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Name</label>
//                         <Input placeholder="Client Name" value={header.clientName} onChange={(e) => setHeader({ ...header, clientName: e.target.value })} />
//                     </div>
//                     <div className="space-y-1">
//                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</label>
//                         <Input placeholder="Location" value={header.location} onChange={(e) => setHeader({ ...header, location: e.target.value })} />
//                     </div>
//                 </section>

//                 {/* 2. Room Cards */}
//                 {rooms.map((room, rIdx) => (
//                     <div key={rIdx} className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
//                         {/* bg-[#e3f2fd] */}
//                         <div className=" bg-[#fafbfc] px-6 py-3 border-b border-slate-300 flex justify-between items-center">

//                             <div className="flex gap-4 items-center">
//                                 <span className="bg-blue-600 text-white w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold">{rIdx + 1}</span>
//                                 <div className="flex items-center gap-2">
//                                     <label className="text-[10px] font-black text-slate-400 uppercase">Room:</label>
//                                     <input
//                                         className="bg-transparent border-b border-blue-200 font-bold text-slate-800 text-sm focus:border-blue-500 outline-none w-32"
//                                         value={room.roomName}
//                                         onChange={(e) => { const n = [...rooms]; n[rIdx].roomName = e.target.value; setRooms(n); }} />
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <label className="text-[10px] font-black text-slate-400 uppercase">Product:</label>
//                                     <input
//                                         className="bg-transparent border-b border-blue-200 font-bold text-slate-800 text-sm focus:border-blue-500 outline-none w-32"
//                                         value={room.productName}
//                                         onChange={(e) => { const n = [...rooms]; n[rIdx].productName = e.target.value; setRooms(n); }} />
//                                 </div>
//                             </div>

//                             <div className="flex items-center gap-6">
//                                 <div className="flex gap-6">
//                                     {[
//                                         { label: 'Back', key: 'backSideLaminateImage' },
//                                         { label: 'Front', key: 'frontSideLaminateImage' }
//                                     ].map((side) => (
//                                         <div key={side.label} className="flex flex-col items-center">
//                                             <label className="text-[9px] font-black text-slate-500 uppercase mb-1">{side.label} Side Laminate Image</label>
//                                             <div className="flex gap-1 items-center">
//                                                 {room[side.key] ? (
//                                                     <div className="flex flex-col gap-1 items-center group">
//                                                         <img
//                                                             src={room[side.key].url}
//                                                             className="w-10 h-10 object-cover rounded border-2 border-blue-400 cursor-zoom-in hover:scale-110 transition-transform shadow-md"
//                                                             onClick={() => setPreviewImage(room[side.key].url)}
//                                                         />

//                                                         <div className="flex  gap-2 opacity-0 group-hover:opacity-100 ">
//                                                             {/* Change Image */}
//                                                             <label className="cursor-pointer !text-gray-600 hover:text-blue-600 text-[10px] font-bold">
//                                                                 <i className="fas fa-sync-alt" />
//                                                                 <input type="file" className="hidden" onChange={(e) => e.target.files && handleImageAction(rIdx, side.key as any, e.target.files[0])} />
//                                                             </label>
//                                                             {/* Remove Image */}
//                                                             <button onClick={() => handleImageAction(rIdx, side.key as any, null)} className="text-red-500 hover:text-blue-600 text-[10px] font-bold">
//                                                                 <i className="fas fa-trash" />
//                                                             </button>
//                                                         </div>

//                                                     </div>
//                                                 ) : (
//                                                     <div className="w-10 h-10 bg-white border-2 border-dashed border-slate-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-400 relative">
//                                                         <i className="fas fa-camera text-slate-300 text-sm" />
//                                                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleImageAction(rIdx, side.key as any, e.target.files[0])} />
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>


//                                 {/* ADD THIS DELETE ROOM BUTTON */}
//                                 <button
//                                     type="button"
//                                     onClick={() => deleteRoom(rIdx)}
//                                     className=" p-2 text-red-600 hover:text-red-700 transition-colors"
//                                     title="Delete Room"
//                                 >
//                                     <i className="fas fa-trash-alt cursor-pointer text-lg" />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="w-full overflow-x-auto">
//                             <table className="w-full text-xs text-left border-collapse">
//                                 <thead className="bg-[#e3f2fd] text-slate-700">
//                                     <tr className="text-center font-bold">
//                                         <th className="border border-slate-300 p-3 w-12 text-center font-black">S No</th>
//                                         <th className="border border-slate-300 p-3 w-40">
//                                             {/* Measurement */}
//                                             <div className="flex flex-col items-center gap-0.5">
//                                                 <span className="block font-bold">Measurement</span>
//                                                 <span className="text-[10px] text-slate-500 font-medium  tracking-tight">
//                                                     Height (mm) x Width (mm)
//                                                 </span>
//                                             </div>

//                                         </th>
//                                         <th className="border border-slate-300 p-3 w-24">Plywood Thickness</th>
//                                         <th className="border border-slate-300 p-3 w-24">Face Type</th>
//                                         <th className="border border-slate-300 p-3 w-32">Laminate Thickness</th>
//                                         <th className="border border-slate-300 p-3">Laminate Brand</th>
//                                         <th className="border border-slate-300 p-3">Laminate Name & Code</th>
//                                         <th className="border border-slate-300 p-1">Action</th>

//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {room.items.map((item: any, iIdx: number) => (
//                                         <React.Fragment key={iIdx}>
//                                             <tr className="bg-white">
//                                                 <td rowSpan={2} className="border border-slate-300 p-3 text-center font-bold text-slate-400">{item.sNo}</td>
//                                                 <td rowSpan={2} className="border border-slate-300 p-3">
//                                                     <input className="w-full p-2 bg-[#fffde7] border border-[#fbc02d] rounded-md font-bold text-slate-700 outline-none" value={item.measurement}
//                                                         onChange={(e) => {
//                                                             // const n = [...rooms]; n[rIdx].items[iIdx].measurement = e.target.value; setRooms(n);

//                                                             const value = e.target.value;
//                                                             const newRooms = [...rooms]; // 1. Copy rooms array
//                                                             newRooms[rIdx] = {
//                                                                 ...newRooms[rIdx],
//                                                                 items: [...newRooms[rIdx].items] // 2. Copy items array
//                                                             };
//                                                             newRooms[rIdx].items[iIdx] = {
//                                                                 ...newRooms[rIdx].items[iIdx],
//                                                                 measurement: value // 3. Update the specific value
//                                                             };
//                                                             setRooms(newRooms); // 4. This new reference triggers useMemo
//                                                         }} />
//                                                 </td>
//                                                 <td rowSpan={2} className="border border-slate-300 p-3 text-center">
//                                                     <input className="w-16 p-2 border border-slate-200 rounded-md text-center font-bold text-slate-600" value={item.plyThickness}
//                                                         // onChange={(e) => {
//                                                         //     const n = [...rooms];
//                                                         //     n[rIdx].items[iIdx].plyThickness = e.target.value;
//                                                         //     setRooms(n);
//                                                         // }}

//                                                         onChange={(e) => {
//                                                             const value = e.target.value;

//                                                             // ✅ Allow only digits (0-9)
//                                                             if (!/^\d*$/.test(value)) return;

//                                                             const n = [...rooms];
//                                                             n[rIdx].items[iIdx].plyThickness = value; // stays string
//                                                             setRooms(n);
//                                                         }}

//                                                     />
//                                                 </td>
//                                                 <td className="border border-slate-300 p-3 font-black text-[#2e7d32] bg-[#f1f8e9]/50 text-center uppercase">Inner</td>
//                                                 <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" value={item.innerFace.laminateThickness} onChange={(e) => {
//                                                     const n = [...rooms]; n[rIdx].items[iIdx].innerFace.laminateThickness = e.target.value; setRooms(n);
//                                                 }} /></td>
//                                                 <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" value={item.innerFace.laminateBrand} onChange={(e) => {
//                                                     const n = [...rooms]; n[rIdx].items[iIdx].innerFace.laminateBrand = e.target.value; setRooms(n);
//                                                 }} /></td>
//                                                 <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" placeholder="Code and Name" value={item.innerFace.laminateNameCode} onChange={(e) => {
//                                                     const n = [...rooms]; n[rIdx].items[iIdx].innerFace.laminateNameCode = e.target.value; setRooms(n);
//                                                 }} /></td>

//                                                 <td rowSpan={2} className="border border-slate-300 p-1 text-center">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => deleteItem(rIdx, iIdx)}
//                                                         className="text-red-600  cursor-pointer hover:text-red-700"
//                                                     >
//                                                         <i className="fas fa-trash-alt text-[14px]" />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                             <tr className="bg-[#fcfcfc]">
//                                                 <td className="border border-slate-300 p-3 font-black text-[#1565c0] bg-[#e3f2fd]/50 text-center uppercase">Outer</td>
//                                                 <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" value={item.outerFace.laminateThickness} onChange={(e) => {
//                                                     const n = [...rooms]; n[rIdx].items[iIdx].outerFace.laminateThickness = e.target.value; setRooms(n);
//                                                 }} /></td>
//                                                 <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" value={item.outerFace.laminateBrand} onChange={(e) => {
//                                                     const n = [...rooms]; n[rIdx].items[iIdx].outerFace.laminateBrand = e.target.value; setRooms(n);
//                                                 }} /></td>
//                                                 <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" placeholder="Code and Name" value={item.outerFace.laminateNameCode} onChange={(e) => {
//                                                     const n = [...rooms]; n[rIdx].items[iIdx].outerFace.laminateNameCode = e.target.value; setRooms(n);
//                                                 }} /></td>
//                                             </tr>
//                                         </React.Fragment>
//                                     ))}
//                                 </tbody>

//                                 {/* ADD THIS TFOOT FOR ADD ITEM BUTTON */}
//                                 <tfoot>
//                                     <tr>
//                                         <td colSpan={8} className="p-2 bg-slate-50 border border-slate-300">
//                                             <button
//                                                 type="button"
//                                                 onClick={() => addItem(rIdx)}
//                                                 className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-wider hover:text-blue-800"
//                                             >
//                                                 <i className="fas fa-plus-circle" /> Add Item
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 </tfoot>


//                             </table>
//                         </div>
//                     </div>
//                 ))}

//                 <div className="flex justify-center py-4">
//                     <Button
//                         type="button"
//                         variant='outline'
//                         onClick={addRoom}
//                         className="bg-white border-2 border-dashed border-blue-300 px-12 py-3 rounded-xl text-blue-600 font-bold flex items-center gap-3 hover:bg-blue-50 transition-all shadow-sm"
//                     >
//                         <i className="fas fa-plus" /> ADD NEW PRODUCT
//                     </Button>
//                 </div>


//                 {/* 3. Fabrication & Plywood Summary (Single Column Stack) */}
//                 <section className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 space-y-6">
//                     <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b pb-4 uppercase tracking-tight">
//                         <i className="fas fa-chart-pie text-blue-600" /> Fabrication & Material Summary
//                     </h2>

//                     {/* A. Fabrication Calculation */}
//                     <div className="space-y-4">
//                         <div className="flex items-center gap-6">
//                             <div className="flex flex-col">
//                                 <label className="text-xs font-black text-slate-500 uppercase mb-1">Fabrication Rate</label>
//                                 <div className="flex gap-2">
//                                     <input type="number" className="w-34 p-2 border border-slate-300 rounded-lg font-bold" placeholder='Rate' value={summary.fabricationRate || ""} onChange={(e) => setSummary({ ...summary, fabricationRate: Math.max(0, Number(e.target.value)) })} />
//                                     <select className="p-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 bg-slate-50" value={summary.unit} onChange={(e) => setSummary({ ...summary, unit: e.target.value })}>
//                                         <option value="sqft">₹ per Sqft</option>
//                                         <option value="sqm">₹ per Sqm</option>
//                                         <option value="sqmm">₹ per Sqmm</option>
//                                     </select>
//                                 </div>
//                             </div>
//                             <div className="flex-1 grid grid-cols-2 gap-4 mt-4">
//                                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
//                                     <span className="text-[10px] font-black text-slate-400 uppercase">Total Area:</span>
//                                     <span className="font-black text-blue-600">{calculatedTotals.area} <small className="text-[8px] uppercase">{summary.unit}</small></span>
//                                 </div>
//                                 <div className="p-3 bg-[#f1f8e9] rounded-xl border border-[#c8e6c9] flex justify-between items-center">
//                                     <span className="text-[10px] font-black text-[#4caf50] uppercase">Total Cost:</span>
//                                     <span className="font-black text-[#2e7d32]">₹ {calculatedTotals.cost}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* B. Plywood Sheet Configuration (One by One layout) */}
//                     <div className="space-y-4 pt-4 border-t border-slate-100">
//                         <label className="text-xs font-black text-slate-500 uppercase block tracking-wider">1. Plywood Sheet Configuration</label>
//                         <div className="flex items-center gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-200 w-max">
//                             <div className="flex flex-col">
//                                 <span className="text-[9px] font-bold text-slate-400 mb-1">HEIGHT (MM)</span>
//                                 <input className="w-24 p-2 border border-slate-300 rounded-lg text-center font-bold text-slate-600" value={summary.plywoodSheetSizeH || ""} onChange={(e) => setSummary({ ...summary, plywoodSheetSizeH: Math.max(0, Number(e.target.value)) })} />
//                             </div>
//                             <span className="mt-4 text-slate-300 font-black">×</span>
//                             <div className="flex flex-col">
//                                 <span className="text-[9px] font-bold text-slate-400 mb-1">WIDTH (MM)</span>
//                                 <input className="w-24 p-2 border border-slate-300 rounded-lg text-center font-bold text-slate-600" value={summary.plywoodSheetSizeW || ""} onChange={(e) => setSummary({ ...summary, plywoodSheetSizeW: Math.max(0, Number(e.target.value)) })} />
//                             </div>
//                             <div className="flex flex-col ml-4">
//                                 <span className="text-[9px] font-bold text-slate-400 mb-1">KERF (MM)</span>
//                                 <input type="number" className="w-16 p-2 border border-slate-300 rounded-lg text-center font-bold text-blue-600" value={summary.kerf || ""} onChange={(e) => setSummary({ ...summary, kerf: Math.max(0, Number(e.target.value)) })} />
//                             </div>
//                         </div>
//                     </div>

//                     {/* C. Material Requirement Summary (One by One layout) */}
//                     <div className="space-y-4 pt-4 border-t border-slate-100">
//                         <label className="text-xs font-black text-slate-500 uppercase block tracking-wider">2. Material Requirement Summary</label>
//                         <div className="max-w-2xl">
//                             <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden shadow-sm">
//                                 <thead className="bg-[#e3f2fd] text-slate-700 font-black uppercase text-[10px]">
//                                     <tr>
//                                         <th className="border border-slate-200 p-3 text-left">Plywood Thickness</th>
//                                         <th className="border border-slate-200 p-3 text-center">Sheets Required</th>
//                                     </tr>
//                                 </thead>
//                                 {/* <tbody className="bg-white font-medium">
//                                     {Array.from(new Set(rooms.flatMap(r => r.items.map((i: any) => i.plyThickness)))).filter(t => t).map((thick, idx) => (
//                                         <tr key={idx} className="hover:bg-slate-50 transition-colors">
//                                             <td className="border border-slate-200 p-3 font-bold text-slate-700">{thick} mm</td>
//                                             <td className="border border-slate-200 p-3 text-center">
//                                                 <span className="bg-slate-100 border border-slate-300 px-6 py-1 rounded-full font-black text-blue-600 text-sm">0</span>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                     {rooms.flatMap(r => r.items).filter(i => i.plyThickness).length === 0 && (
//                                         <tr><td colSpan={2} className="p-4 text-center text-slate-400 italic font-bold">No thickness data entered in the tables above.</td></tr>
//                                     )}
//                                 </tbody> */}

//                                 <tbody className="bg-white font-medium">
//                                     {summary.materialSummary.map((item: any, idx: number) => (
//                                         <tr key={idx} className="hover:bg-slate-50 transition-colors">
//                                             <td className="border border-slate-200 p-3 font-bold text-slate-700">
//                                                 {item.thickness} mm
//                                             </td>
//                                             <td className="border border-slate-200 p-3 text-center">
//                                                 <span className="bg-blue-50 border border-blue-200 px-6 py-1 rounded-full font-black text-blue-600 text-sm">
//                                                     {item.sheetsNeeded}
//                                                 </span>
//                                             </td>
//                                         </tr>
//                                     ))}

//                                     {summary.materialSummary.length === 0 && (
//                                         <tr>
//                                             <td colSpan={2} className="p-4 text-center text-slate-400 italic font-bold">
//                                                 No valid measurements entered to calculate sheet requirements.
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </div >
//     );
// };

// export default CutlistForm;




//  SECOND VERSION


import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useGetProjects } from '../../apiList/projectApi';
import { useGetAllClientQuotesForDropDown } from '../../apiList/Quote Api/ClientQuote/clientQuoteApi';
import SearchSelectNew from '../../components/ui/SearchSelectNew';
import { Input } from '../../components/ui/Input';
import { useGetAllRequirementInfo } from '../../apiList/Stage Api/requirementFormApi';
import { useCurrentSupervisor } from '../../Hooks/useCurrentSupervisor';

interface IHeader {
    projectId: string | null;
    selectedQuoteNo: string | null;
    selectedQuoteId: string | null,
    clientName: string;
    location: string;
    versionNo: string;
}

const CutlistForm: React.FC<any> = ({ mode, isGeneratingPdf, initialData, onSubmit, isSubmitting, organizationId, handleGenerate }) => {
    const navigate = useNavigate();
    const currentUser = useCurrentSupervisor()
    console.log("mode", mode)
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [header, setHeader] = useState<IHeader>({
        projectId: null,
        selectedQuoteNo: null,
        selectedQuoteId: null,
        clientName: '',
        location: '',
        versionNo: '1.0'
    });


    const defaultRoom = {
        productName: '',
        backSideLaminateImage: null,
        frontSideLaminateImage: null,
        items: [{
            sNo: 1,
            // measurement: '',
            h: 0, // Height
            w: 0, // Width
            plyThickness: '',
            innerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' },
            outerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' }
        }]
    };


    // const [rooms, setRooms] = useState<any[]>([defaultRoom]);
    const [rooms, setRooms] = useState<any[]>(initialData?.rooms?.length ? initialData.rooms : [defaultRoom]);
    const prevProjectIdRef = useRef(header?.projectId);

    // Effect to handle data loading for Edit mode specifically
    useEffect(() => {
        if (initialData) {
            setHeader({
                projectId: initialData.projectId?._id || initialData.projectId || null,
                selectedQuoteNo: initialData?.quoteNo || null,
                selectedQuoteId: initialData?.quoteId || null,
                clientName: initialData.clientName || '',
                location: initialData.location || '',
                versionNo: initialData.versionNo || '1.0',

            });
            setRooms(initialData.rooms?.length ? initialData.rooms : [defaultRoom]);
            setSummary(initialData?.summary || summary);
            prevProjectIdRef.current = initialData.projectId?._id || initialData.projectId;
        }
    }, [initialData]);



    const [summary, setSummary] = useState({
        fabricationRate: 0,
        unit: 'sqmm',
        plywoodSheetSizeW: 1220,
        plywoodSheetSizeH: 2440,
        kerf: 0,
        materialSummary: []
    });

    const { data: projectsData = [] } = useGetProjects(organizationId);
    const { data: quotesData = [] } =
        useGetAllClientQuotesForDropDown(organizationId, header.projectId || "");
    // 1. Fetch Requirement Data based on selected projectId
    const { data: requirementData } = useGetAllRequirementInfo({
        projectId: header.projectId || ""
    });

    // 2. Auto-fill effect
    useEffect(() => {
        // We only want to auto-fill if we have data AND we are not in "Edit Mode" 
        // (In Edit Mode, initialData should take priority)
        const hasProjectChanged = header.projectId !== prevProjectIdRef.current;
        if (requirementData?.clientData && hasProjectChanged) {
            const { clientName, location } = requirementData?.clientData;

            setHeader(prev => ({
                ...prev,
                clientName: clientName || prev.clientName,
                location: location || prev.location

                // clientName: prev.clientName === '' ? (clientName || '') : prev.clientName,
                // location: prev.location === '' ? (location || '') : prev.location
            }));

            // Update the ref to the current project
            prevProjectIdRef.current = header.projectId;
        }
    }, [requirementData, header?.projectId]);


    // --- CALCULATION ENGINE ---
    const calculatedTotals = useMemo(() => {
        let totalSqmm = 0;
        rooms.forEach(room => {
            // room.items.forEach((item: any) => {
            //     const parts = item.measurement?.toLowerCase().replace(/mm/gi, "").split(/[x*×]/);
            //     if (parts?.length === 2) {
            //         const w = parseFloat(parts[0]) || 0;
            //         const h = parseFloat(parts[1]) || 0;
            //         totalSqmm += (w * h);
            //     }
            // });

            room.items.forEach((item: any) => {
                // Directly use numeric values from the state
                const h = parseFloat(item.h) || 0;
                const w = parseFloat(item.w) || 0;
                totalSqmm += (h * w);
            });

        });

        let area = summary.unit === "sqmm" ? totalSqmm : summary.unit === "sqm" ? totalSqmm / 1e6 : (totalSqmm / 80467.2);
        const cost = area * summary.fabricationRate;

        return {
            area: area.toFixed(2),
            cost: cost.toFixed(2),
            unit: summary.unit
        };
    }, [rooms, summary.fabricationRate, summary.unit]);

    const handleImageAction = (rIdx: number, side: 'backSideLaminateImage' | 'frontSideLaminateImage', file: File | null) => {
        const newRooms = [...rooms];
        if (file) {
            newRooms[rIdx][side] = {
                url: URL.createObjectURL(file),
                file: file,
                type: "image"
            };
        } else {
            newRooms[rIdx][side] = null;
        }
        setRooms(newRooms);
    };


    const addRoom = () => {
        setRooms([...rooms, { ...defaultRoom }]);
    };

    const deleteRoom = (rIdx: number) => {
        if (rooms.length > 1) {
            setRooms(rooms.filter((_, index) => index !== rIdx));
        }
    };

    const addItem = (rIdx: number) => {
        const newRooms = [...rooms];
        const currentItems = newRooms[rIdx].items;
        newRooms[rIdx].items = [
            ...currentItems,
            {
                sNo: currentItems.length + 1,
                // measurement: '',
                h: 0,
                w: 0,
                plyThickness: '',
                innerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' },
                outerFace: { laminateThickness: '1.0', laminateBrand: '', laminateNameCode: '' }
            }
        ];
        setRooms(newRooms);
    };

    const deleteItem = (rIdx: number, iIdx: number) => {
        const newRooms = [...rooms];
        if (newRooms[rIdx].items.length > 1) {
            newRooms[rIdx].items = newRooms[rIdx].items.filter((_: any, index: number) => index !== iIdx);
            // Re-index S.No
            newRooms[rIdx].items = newRooms[rIdx].items.map((item: any, idx: number) => ({ ...item, sNo: idx + 1 }));
            setRooms(newRooms);
        }
    };



    const handleQuoteSelection = (quoteId: string | null) => {
        if (!quoteId) return;
        const selectedQuote = quotesData.find((q: any) => q._id === quoteId);
        if (!selectedQuote) return;

        const mappedRooms = (selectedQuote.furnitures || []).map((furniture: any) => ({
            // roomName: furniture.furnitureName || 'Room',
            productName: furniture.furnitureName || 'Product',
            backSideLaminateImage: null,
            frontSideLaminateImage: null,
            items: (furniture.coreMaterials || []).map((material: any, idx: number) => ({
                sNo: idx + 1,
                // measurement: '0 x 0',
                h: 0,
                w: 0,
                plyThickness: material.plywoodNos?.thickness?.toString() || '0',
                innerFace: {
                    laminateThickness: material.innerLaminate?.thickness?.toString() || '0',
                    laminateBrand: furniture.innerLaminateBrand || '',
                    laminateNameCode: ''
                },
                outerFace: {
                    laminateThickness: material.outerLaminate?.thickness?.toString() || '0',
                    laminateBrand: furniture.outerLaminateBrand || '',
                    laminateNameCode: ''
                }
            }))
        }));
        setRooms(mappedRooms);
        setHeader(prev => ({
            ...prev,
            selectedQuoteId: quoteId,
            selectedQuoteNo: selectedQuote.quoteNo,
            // clientName: selectedQuote.clientName || '',
            // location: selectedQuote.location || ''
        }));
    };

    // --- ADVANCED MATERIAL SUMMARY CALCULATOR ---
    const calculatedMaterialSummary = useMemo(() => {

        const sheetWidth = Number(summary.plywoodSheetSizeW) || 0;
        const sheetHeight = Number(summary.plywoodSheetSizeH) || 0;


        // const sheetWidth = summary.plywoodSheetSizeW || 0;

        // const sheetHeight = summary.plywoodSheetSizeH || 0;
        const kerf = Number(summary.kerf) || 0;

        // Area of one full sheet in sqmm
        const areaPerSheet = sheetWidth * sheetHeight;

        if (areaPerSheet <= 0) return [];

        // Grouping by thickness
        const groups: Record<string, number> = {};

        rooms.forEach(room => {
            room.items.forEach((item: any) => {
                const thickness = item.plyThickness;
                if (!thickness) return;

                // // Parse "1990 x 720"
                // const parts = item.measurement?.toLowerCase().replace(/mm/gi, "").split(/[x*×]/);
                // if (parts?.length === 2) {
                //     const h = parseFloat(parts[0]) || 0;
                //     const w = parseFloat(parts[1]) || 0;


                //     if (!isNaN(h) && !isNaN(w) && h > 0 && w > 0) {
                //         const itemAreaWithWaste = (h + kerf) * (w + kerf);
                //         groups[thickness] = (groups[thickness] || 0) + itemAreaWithWaste;
                //     }

                // }

                // 🔥 Directly use the separate height and width fields
                const h = parseFloat(item.h) || 0;
                const w = parseFloat(item.w) || 0;


                if (h > 0 && w > 0) {
                    // Account for the kerf (blade thickness) lost during each cut
                    const itemAreaWithWaste = (h + kerf) * (w + kerf);

                    // Accumulate the area for this specific thickness group
                    groups[thickness] = (groups[thickness] || 0) + itemAreaWithWaste;
                }
            });
        });

        // Convert total area per thickness into number of sheets
        return Object.entries(groups).map(([thickness, totalArea]) => {
            // Math.ceil ensures we always round up to the next full sheet
            const sheetsNeeded = Math.ceil(totalArea / areaPerSheet);
            return {
                thickness,
                // sheetsNeeded: isFinite(sheetsNeeded) ? sheetsNeeded : 0 || 0
                sheetsNeeded: sheetsNeeded
            };
        });
    }, [rooms, summary.plywoodSheetSizeW, summary.plywoodSheetSizeH, summary.kerf]);

    // 2. NEW: Sync the calculation into the 'summary' state automatically
    // Sync calculation to state ONLY if valid items exist
    useEffect(() => {
        // Only update the state if the calculation has found at least one valid measurement
        if (calculatedMaterialSummary && calculatedMaterialSummary.length > 0) {
            setSummary((prev: any) => ({
                ...prev,
                materialSummary: calculatedMaterialSummary
            }));
        }
    }, [calculatedMaterialSummary]);

    // bg-[#f4f6f9]


    // const syncTableRows = (currentItems: any) => {
    //     const updatedItems = [...currentItems];
    //     const lastItem = updatedItems[updatedItems.length - 1];

    //     // Check if the last row has any data entered
    //     const hasData = lastItem.h || lastItem.w || lastItem.plyThickness;

    //     if (hasData) {
    //         // Add a new row automatically
    //         updatedItems.push({
    //             sNo: updatedItems.length + 1,
    //             h: 0,
    //             w: 0,
    //             plyThickness: '',
    //             innerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' },
    //             outerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' }
    //         });
    //     } else if (updatedItems.length > 1) {
    //         // If the last row is empty, check if the row BEFORE it is also empty
    //         const secondLastItem = updatedItems[updatedItems.length - 2];
    //         const secondLastHasData = secondLastItem.h || secondLastItem.w || secondLastItem.plyThickness;

    //         if (!secondLastHasData) {
    //             // Remove the redundant empty row
    //             updatedItems.pop();
    //         }
    //     }

    //     return updatedItems;
    // };


    //  second version
    // const syncTableRows = (currentItems: any[]) => {
    //     let updatedItems = [...currentItems];

    //     // 1. Logic to ADD a row: 
    //     // If the last item has data, add a new empty row.

    //     // Helper to check if a row is truly empty
    //     const isRowEmpty = (item: any) => {
    //         const hEmpty = !item.h || item.h === 0;
    //         const wEmpty = !item.w || item.w === 0;
    //         const plyEmpty = !item.plyThickness;

    //         // Check if laminate brand or name/code has been entered
    //         const innerEmpty = !item.innerFace.laminateBrand && !item.innerFace.laminateNameCode;
    //         const outerEmpty = !item.outerFace.laminateBrand && !item.outerFace.laminateNameCode;

    //         // Row is only empty if ALL these are true
    //         return hEmpty && wEmpty && plyEmpty && innerEmpty && outerEmpty;
    //     };

    //     // const lastItem = updatedItems[updatedItems.length - 1];
    //     // const lastItemHasData = lastItem.h || lastItem.w;
    //     const lastIdx = updatedItems.length - 1;
    //     const lastItem = updatedItems[lastIdx];

    //     if (!isRowEmpty(lastItem)) {
    //         updatedItems.push({
    //             sNo: updatedItems.length + 1,
    //             h: 0,
    //             w: 0,
    //             // displayUnit: 'sqft',
    //             plyThickness: '',
    //             innerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' },
    //             outerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' }
    //         });
    //         return updatedItems; // Return early after adding
    //     }

    //     // 2. Logic to DELETE rows: 
    //     // We check from the end of the list. If we find TWO empty rows at the end, 
    //     // we remove the very last one. This handles users clearing data.
    //     if (updatedItems.length > 1) {
    //         const lastRow = updatedItems[updatedItems.length - 1];
    //         const secondLastRow = updatedItems[updatedItems.length - 2];

    //         const lastRowEmpty = !lastRow.h && !lastRow.w;
    //         const secondLastRowEmpty = !secondLastRow.h && !secondLastRow.w;

    //         if (lastRowEmpty && secondLastRowEmpty) {
    //             updatedItems.pop();
    //         }
    //     }

    //     // 3. Re-index S.No to ensure they stay in order (1, 2, 3...)
    //     return updatedItems.map((item, index) => ({
    //         ...item,
    //         sNo: index + 1
    //     }));
    // };



    const syncTableRows = (currentItems: any[], editedIndex: number) => {
        let updatedItems = [...currentItems];
        const isLastRow = editedIndex === updatedItems.length - 1;
        const editedItem = updatedItems[editedIndex];

        // 1. ADD ROW LOGIC:
        // Only add a new row if we are editing the LAST row 
        // AND that row now has a valid measurement (> 0)
        const hasNewData = (Number(editedItem.h) > 0 || Number(editedItem.w) > 0);

        if (isLastRow && hasNewData) {
            updatedItems.push({
                sNo: updatedItems.length + 1,
                h: 0, // Keeping your preferred number format
                w: 0,
                displayUnit: 'sqft',
                plyThickness: '',
                innerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' },
                outerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' }
            });
            return updatedItems;
        }

        // 2. DELETE ROW LOGIC:
        // If the user clears a row (sets H & W back to 0), and it's not the only row,
        // and the row below it is also empty, we remove the extra one.
        if (updatedItems.length > 1) {
            const lastRow = updatedItems[updatedItems.length - 1];
            const secondLastRow = updatedItems[updatedItems.length - 2];

            const lastEmpty = (Number(lastRow.h) === 0 && Number(lastRow.w) === 0);
            const secondLastEmpty = (Number(secondLastRow.h) === 0 && Number(secondLastRow.w) === 0);

            // Only pop if we have two consecutive empty rows at the bottom
            if (lastEmpty && secondLastEmpty) {
                updatedItems.pop();
            }
        }

        // 3. Re-index S.No to maintain 1, 2, 3... sequence
        return updatedItems.map((item, index) => ({
            ...item,
            sNo: index + 1
        }));
    };


    return (
        <div className="  text-slate-900 w-full">

            {/* 0. Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-4xl max-h-full">
                        <img src={previewImage} className="rounded-lg shadow-2xl border-4 border-white max-h-[85vh] object-contain" alt="Preview" />
                        <button className="absolute -top-4 -right-4 bg-red-600 text-white w-10 h-10 rounded-full font-bold shadow-lg">×</button>
                    </div>
                </div>
            )}


            <div className="sticky top-0 z-50 bg-white border-b border-slate-300 shadow-sm">

                <header className="px-4 py-3 flex justify-between items-center w-full">
                    {/* <div className='flex justify-between items-center gap-2'>
                        <button type="button" onClick={() => navigate(-1)} className='bg-blue-100 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2'>
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <i className="fas fa-receipt mr-3 text-blue-600"></i>
                                Cutlist – Site Entry
                            </h1>
                            {mode === "view" && <span>Cutlist No: {initialData.cutlistNo}</span>}

                        </div>
                    </div> */}

                    <div className='flex justify-between items-center gap-2'>
                        <button type="button" onClick={() => navigate(-1)}
                         className='bg-blue-100 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2'>
                            <i className="fas fa-arrow-left"></i>
                        </button>

                        <div className="flex items-center">
                            {/* Common Icon for both Heading and No */}
                            <i className="fas fa-receipt mr-2 text-blue-600 text-3xl"></i>

                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                    Cutlist – Site Entry
                                </h1>

                                {mode === "view" && (
                                    <span className="text-sm font-semibold text-blue-600">
                                        Cutlist No: {initialData?.cutlistNo}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>



                    <section className='flex gap-2 items-center'>

                        <Button className="bg-[#43a047] hover:bg-[#2e7d32] text-white px-8 font-bold"
                            // onClick={() => onSubmit(header, rooms, summary, currentUser?.name || "")} 
                            onClick={() => {
                                // 1. Filter the rooms before passing to onSubmit
                                const filteredRooms = rooms.map(room => ({
                                    ...room,
                                    // 2. Only keep items that have at least one meaningful value
                                    items: room.items.filter((item: any) => {
                                        const hasH = item.h && item.h !== 0;
                                        const hasW = item.w && item.w !== 0;
                                        // const hasPly = !!item.plyThickness;
                                        // const hasPly = !item.plyThickness || item.plyThickness === '0';
                                        const hasPly = item.plyThickness && item.plyThickness !== '0' && item.plyThickness !== '';
                                        const hasInnerBrand = !!item.innerFace?.laminateBrand;
                                        const hasInnerCode = !!item.innerFace?.laminateNameCode;
                                        const hasOuterBrand = !!item.outerFace?.laminateBrand;
                                        const hasOuterCode = !!item.outerFace?.laminateNameCode;



                                        // Return true only if at least one of these is present
                                        return hasH || hasW || hasPly || hasInnerBrand || hasInnerCode || hasOuterBrand || hasOuterCode;
                                    })
                                })).filter(room => room?.items?.length > 0); // 3. Optional: remove rooms with 0 valid items

                                // 4. Pass the cleaned data to the actual submission function
                                onSubmit(header, filteredRooms, summary, currentUser?.name || "");
                            }}

                            isLoading={isSubmitting}>
                            Save Cutlist
                        </Button>

                        {handleGenerate &&
                            <Button className="bg-[#43a047] hover:bg-[#2e7d32] text-white px-8 font-bold" onClick={handleGenerate} isLoading={isGeneratingPdf}>
                                Generate Pdf
                            </Button>}
                    </section>

                </header>
            </div>

            <div className="w-full space-y-4 mt-3">
                <section className="bg-white rounded-xl shadow-sm border border-slate-300 p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project</label>
                        <SearchSelectNew
                            options={projectsData.map((p: any) => ({ value: p._id, label: p.projectName }))}
                            placeholder="Select Project"
                            value={header.projectId || ""}
                            onValueChange={(val) => setHeader(p => ({ ...p, projectId: val, selectedQuoteId: null }))}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirmed Quote</label>
                        <SearchSelectNew
                            options={quotesData.map((q: any) => ({ value: q._id, label: q.quoteNo || "Select Quote" }))}
                            placeholder="Select Quote"
                            value={header.selectedQuoteId || ""}
                            onValueChange={handleQuoteSelection}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Version</label>
                        <Input value={header.versionNo} disabled className="bg-slate-50 cursor-not-allowed font-bold text-slate-400" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Name</label>
                        <Input placeholder="Client Name" value={header.clientName} onChange={(e) => setHeader({ ...header, clientName: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</label>
                        <Input placeholder="Location" value={header.location} onChange={(e) => setHeader({ ...header, location: e.target.value })} />
                    </div>
                </section>

                {/* 2. Room Cards */}
                {rooms.map((room, rIdx) => (
                    <div key={rIdx} className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
                        {/* bg-[#e3f2fd] */}
                        <div className=" bg-[#fafbfc] px-6 py-3 border-b border-slate-300 flex justify-between items-center">

                            <div className="flex gap-4 items-center">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold">{rIdx + 1}</span>
                                {/* <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Room:</label>
                                    <input
                                        className="bg-transparent border-b border-blue-200 font-bold text-slate-800 text-sm focus:border-blue-500 outline-none w-32"
                                        value={room.roomName}
                                        onChange={(e) => { const n = [...rooms]; n[rIdx].roomName = e.target.value; setRooms(n); }} />
                                </div> */}
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Product:</label>
                                    <input
                                        className="bg-transparent border-b border-blue-200 font-bold text-slate-800 text-sm focus:border-blue-500 outline-none w-36"
                                        value={room.productName}
                                        placeholder='Enter Product Name'
                                        onChange={(e) => { const n = [...rooms]; n[rIdx].productName = e.target.value; setRooms(n); }} />
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex gap-6">
                                    {[
                                        { label: 'Back', key: 'backSideLaminateImage' },
                                        { label: 'Front', key: 'frontSideLaminateImage' }
                                    ].map((side) => (
                                        <div key={side.label} className="flex flex-col items-center">
                                            <label className="text-[9px] font-black text-slate-500 uppercase mb-1">{side.label} Side Laminate Image</label>
                                            <div className="flex gap-1 items-center">
                                                {room[side.key] ? (
                                                    <div className="flex flex-col gap-1 items-center group">
                                                        <img
                                                            src={room[side.key].url}
                                                            className="w-10 h-10 object-cover rounded border-2 border-blue-400 cursor-zoom-in hover:scale-110 transition-transform shadow-md"
                                                            onClick={() => setPreviewImage(room[side.key].url)}
                                                        />

                                                        <div className="flex  gap-2 opacity-0 group-hover:opacity-100 ">
                                                            {/* Change Image */}
                                                            <label className="cursor-pointer !text-gray-600 hover:text-blue-600 text-[10px] font-bold">
                                                                <i className="fas fa-sync-alt" />
                                                                <input type="file" className="hidden" onChange={(e) => e.target.files && handleImageAction(rIdx, side.key as any, e.target.files[0])} />
                                                            </label>
                                                            {/* Remove Image */}
                                                            <button onClick={() => handleImageAction(rIdx, side.key as any, null)} className="text-red-500 hover:text-blue-600 text-[10px] font-bold">
                                                                <i className="fas fa-trash" />
                                                            </button>
                                                        </div>

                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 bg-white border-2 border-dashed border-slate-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-400 relative">
                                                        <i className="fas fa-camera text-slate-300 text-sm" />
                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleImageAction(rIdx, side.key as any, e.target.files[0])} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>


                                {/* ADD THIS DELETE ROOM BUTTON */}
                                <button
                                    type="button"
                                    onClick={() => deleteRoom(rIdx)}
                                    className=" p-2 text-red-600 hover:text-red-700 transition-colors"
                                    title="Delete Room"
                                >
                                    <i className="fas fa-trash-alt cursor-pointer text-lg" />
                                </button>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead className="bg-[#e3f2fd] text-slate-700">
                                    {/* <tr className="text-center font-bold">
                                        <th className="border border-slate-300 p-3 w-12 text-center font-black">S No</th>
                                        <th colSpan={3} className="border border-slate-300 p-3 w-64 bg-[#e3f2fd]">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="block font-black text-slate-700">Dimensions & Area</span>
                                                <div className="flex gap-2 items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                                    <span>Height</span>
                                                    <span className="text-slate-300">|</span>
                                                    <span>Width</span>
                                                    <span className="text-slate-300">|</span>
                                                    <span>Conversion</span>
                                                </div>
                                            </div>
                                        </th>
                                        <th className="border border-slate-300 p-3 w-24">Plywood Thickness</th>
                                        <th className="border border-slate-300 p-3 w-24">Face Type</th>
                                        <th className="border border-slate-300 p-3 w-32">Laminate Thickness</th>
                                        <th className="border border-slate-300 p-3">Laminate Brand</th>
                                        <th className="border border-slate-300 p-3">Laminate Name & Code</th>
                                        <th className="border border-slate-300 p-1">Action</th>

                                    </tr> */}


                                    <tr className="text-center font-bold">
                                        <th rowSpan={2} className="border border-slate-300 p-3 w-15 font-black">S No</th>

                                        {/* Main Grouping Header */}
                                        <th colSpan={3} className="border border-slate-300 p-2 bg-[#d1e9ff] text-slate-800 uppercase tracking-widest text-[10px]">
                                            Dimensions & Area
                                        </th>

                                        <th rowSpan={2} className="border border-slate-300 p-3 w-32">Plywood Thickness</th>
                                        <th rowSpan={2} className="border border-slate-300 p-3 w-24">Face Type</th>
                                        <th rowSpan={2} className="border border-slate-300 p-3 w-32">Laminate Thickness</th>
                                        <th rowSpan={2} className="border border-slate-300 p-3">Laminate Brand</th>
                                        <th rowSpan={2} className="border border-slate-300 p-3">Laminate Name & Code</th>
                                        <th rowSpan={2} className="border border-slate-300 p-1 w-16">Action</th>
                                    </tr>

                                    {/* Second Header Row: Individual Sub-labels */}
                                    <tr className="text-center font-bold bg-[#e3f2fd]">
                                        <th className="border border-slate-300 p-2 text-[10px] w-28">Height (mm)</th>
                                        <th className="border border-slate-300 p-2 text-[10px] w-28">Width (mm)</th>
                                        {/* <th className="border border-slate-300 p-2 text-[10px] w-32">Conversion</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {room.items.map((item: any, iIdx: number) => (
                                        <React.Fragment key={iIdx}>
                                            <tr className="bg-white">
                                                <td rowSpan={2} className="border border-slate-300 p-3 text-center font-bold text-slate-400">{item.sNo}</td>


                                                {/* <td rowSpan={2} className="border border-slate-300 p-2">
                                                    <input
                                                        type="number"
                                                        className="w-full p-2 bg-[#fffde7] border border-[#fbc02d] rounded-md font-bold text-center outline-none"
                                                        value={item.h}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const n = [...rooms];
                                                            n[rIdx].items[iIdx].h = val;
                                                            setRooms(n);
                                                        }}
                                                    />
                                                </td>

                                                <td rowSpan={2} className="border border-slate-300 p-2">
                                                    <input
                                                        type="number"
                                                        className="w-full p-2 bg-[#fffde7] border border-[#fbc02d] rounded-md font-bold text-center outline-none"
                                                        value={item.w}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const n = [...rooms];
                                                            n[rIdx].items[iIdx].w = val;
                                                            setRooms(n);
                                                        }}
                                                    />
                                                </td> */}


                                                {/* MERGED MEASUREMENT COLUMN WITH CONVERSION */}
                                                <td rowSpan={2} colSpan={3} className="border border-slate-300 p-2 bg-slate-50/30">
                                                    <div className="flex flex-col gap-2">
                                                        {/* Input Row */}
                                                        <div className="flex gap-1 items-center">
                                                            <input
                                                                type="number"
                                                                placeholder="H"
                                                                className="w-1/2 p-2 bg-[#fffde7] border border-[#fbc02d] rounded-md font-bold text-center outline-none"
                                                                value={item.h || ""}
                                                                onChange={(e) => {
                                                                    const n = [...rooms];
                                                                    n[rIdx].items[iIdx].h = Math.max(0, Number(e.target.value));
                                                                    // Auto-sync rows
                                                                    n[rIdx].items = syncTableRows(n[rIdx].items, iIdx);
                                                                    setRooms(n);
                                                                }}
                                                            />
                                                            <span className="text-slate-400 font-bold">×</span>
                                                            <input
                                                                type="number"
                                                                placeholder="W"
                                                                className="w-1/2 p-2 bg-[#fffde7] border border-[#fbc02d] rounded-md font-bold text-center outline-none"
                                                                value={item.w || ""}
                                                                onChange={(e) => {
                                                                    const n = [...rooms];
                                                                    n[rIdx].items[iIdx].w = Math.max(0, Number(e.target.value));
                                                                    // Auto-sync rows
                                                                    n[rIdx].items = syncTableRows(n[rIdx].items, iIdx);
                                                                    setRooms(n);
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Conversion & Area Display */}
                                                        <div className="flex flex-col border-t border-slate-200 pt-2">
                                                            <select
                                                                className="text-[10px] bg-transparent font-bold text-blue-600 outline-none cursor-pointer mb-1"
                                                                value={item.displayUnit || 'sqft'}
                                                                onChange={(e) => {
                                                                    const n = [...rooms];
                                                                    n[rIdx].items[iIdx].displayUnit = e.target.value;
                                                                    setRooms(n);
                                                                }}
                                                            >
                                                                <option value="sqmm" className="py-2 text-slate-800 font-semibold">Area (Sq/mm)</option>
                                                                <option value="sqm" className="py-2 text-slate-800 font-semibold">Area (Sq/m)</option>
                                                                <option value="sqft" className="py-2 text-slate-800 font-semibold">Area (Sq/ft)</option>
                                                            </select>

                                                            <div className="text-[11px] font-black text-slate-700 bg-white px-2 py-1 rounded border border-slate-100 text-center">
                                                                {(() => {
                                                                    const h = parseFloat(item.h) || 0;
                                                                    const w = parseFloat(item.w) || 0;
                                                                    const areaSqmm = h * w;

                                                                    if (item.displayUnit === 'sqft') return `${(areaSqmm / 80467.2).toFixed(2)} sq/ft`;
                                                                    if (item.displayUnit === 'sqm') return `${(areaSqmm / 1e6).toFixed(2)} sq/m`;
                                                                    if (item.displayUnit === 'sqmm') return `${areaSqmm.toLocaleString()} sq/mm`;
                                                                    // return `${areaSqmm.toLocaleString()} mm²`;
                                                                    return `${(areaSqmm / 80467.2).toFixed(2)} sq/ft`;
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>


                                                <td rowSpan={2} className="border border-slate-300 p-3 text-center">
                                                    <input className="w-16 p-2 border border-slate-200 rounded-md text-center font-bold text-slate-600" value={item.plyThickness}
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            // ✅ Allow only digits (0-9)
                                                            if (!/^\d*$/.test(value)) return;

                                                            const n = [...rooms];
                                                            n[rIdx].items[iIdx].plyThickness = value; // stays string
                                                            setRooms(n);
                                                        }}

                                                    />
                                                </td>
                                                <td className="border border-slate-300 p-3 font-black text-[#2e7d32] bg-[#f1f8e9]/50 text-center uppercase">Inner</td>
                                                <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" value={item.innerFace.laminateThickness} onChange={(e) => {
                                                    const n = [...rooms]; n[rIdx].items[iIdx].innerFace.laminateThickness = e.target.value; setRooms(n);
                                                }} /></td>
                                                <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" value={item.innerFace.laminateBrand} onChange={(e) => {
                                                    const n = [...rooms]; n[rIdx].items[iIdx].innerFace.laminateBrand = e.target.value; setRooms(n);
                                                }} /></td>
                                                <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" placeholder="Code and Name" value={item.innerFace.laminateNameCode} onChange={(e) => {
                                                    const n = [...rooms]; n[rIdx].items[iIdx].innerFace.laminateNameCode = e.target.value; setRooms(n);
                                                }} /></td>

                                                <td rowSpan={2} className="border border-slate-300 p-1 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteItem(rIdx, iIdx)}
                                                        className="text-red-600  cursor-pointer hover:text-red-700"
                                                    >
                                                        <i className="fas fa-trash-alt text-[14px]" />
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr className="bg-[#fcfcfc]">
                                                <td className="border border-slate-300 p-3 font-black text-[#1565c0] bg-[#e3f2fd]/50 text-center uppercase">Outer</td>
                                                <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" value={item.outerFace.laminateThickness} onChange={(e) => {
                                                    const n = [...rooms]; n[rIdx].items[iIdx].outerFace.laminateThickness = e.target.value; setRooms(n);
                                                }} /></td>
                                                <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" value={item.outerFace.laminateBrand} onChange={(e) => {
                                                    const n = [...rooms]; n[rIdx].items[iIdx].outerFace.laminateBrand = e.target.value; setRooms(n);
                                                }} /></td>
                                                <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" placeholder="Code and Name" value={item.outerFace.laminateNameCode} onChange={(e) => {
                                                    const n = [...rooms]; n[rIdx].items[iIdx].outerFace.laminateNameCode = e.target.value; setRooms(n);
                                                }} /></td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>

                                {/* ADD THIS TFOOT FOR ADD ITEM BUTTON */}
                                <tfoot>
                                    <tr>
                                        <td colSpan={10} className="p-2 bg-slate-50 border border-slate-300">
                                            <button
                                                type="button"
                                                onClick={() => addItem(rIdx)}
                                                className="flex cursor-pointer items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-wider hover:text-blue-800"
                                            >
                                                <i className="fas fa-plus-circle" /> Add Item
                                            </button>
                                        </td>
                                    </tr>
                                </tfoot>


                            </table>
                        </div>
                    </div>
                ))}

                <div className="flex justify-center py-4">
                    <Button
                        type="button"
                        variant='outline'
                        onClick={addRoom}
                        className="bg-white border-2 border-dashed border-blue-300 px-12 py-3 rounded-xl text-blue-600 font-bold flex items-center gap-3 hover:bg-blue-50 transition-all shadow-sm"
                    >
                        <i className="fas fa-plus" /> ADD NEW PRODUCT
                    </Button>
                </div>


                {/* 3. Fabrication & Plywood Summary (Single Column Stack) */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 space-y-6">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b pb-4 uppercase tracking-tight">
                        <i className="fas fa-chart-pie text-blue-600" /> Fabrication & Material Summary
                    </h2>

                    {/* A. Fabrication Calculation */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <label className="text-xs font-black text-slate-500 uppercase mb-1">Fabrication Rate</label>
                                <div className="flex gap-2">
                                    <input type="number" className="w-34 p-2 border border-slate-300 rounded-lg font-bold" placeholder='Rate' value={summary.fabricationRate || ""} onChange={(e) => setSummary({ ...summary, fabricationRate: Math.max(0, Number(e.target.value)) })} />
                                    <select className="p-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 bg-slate-50" value={summary.unit} onChange={(e) => setSummary({ ...summary, unit: e.target.value })}>
                                        <option value="sqft">₹ per Sqft</option>
                                        <option value="sqm">₹ per Sqm</option>
                                        <option value="sqmm">₹ per Sqmm</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-4 mt-4">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Total Area:</span>
                                    <span className="font-black text-blue-600">{calculatedTotals.area} <small className="text-[8px] uppercase">{summary.unit}</small></span>
                                </div>
                                <div className="p-3 bg-[#f1f8e9] rounded-xl border border-[#c8e6c9] flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#4caf50] uppercase">Total Cost:</span>
                                    <span className="font-black text-[#2e7d32]">₹ {calculatedTotals.cost}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* B. Plywood Sheet Configuration (One by One layout) */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="text-xs font-black text-slate-500 uppercase block tracking-wider">1. Plywood Sheet Configuration</label>
                        <div className="flex items-center gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-200 w-max">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 mb-1">HEIGHT (MM)</span>
                                <input className="w-24 p-2 border border-slate-300 rounded-lg text-center font-bold text-slate-600" value={summary.plywoodSheetSizeH || ""} onChange={(e) => setSummary({ ...summary, plywoodSheetSizeH: Math.max(0, Number(e.target.value)) })} />
                            </div>
                            <span className="mt-4 text-slate-300 font-black">×</span>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 mb-1">WIDTH (MM)</span>
                                <input className="w-24 p-2 border border-slate-300 rounded-lg text-center font-bold text-slate-600" value={summary.plywoodSheetSizeW || ""} onChange={(e) => setSummary({ ...summary, plywoodSheetSizeW: Math.max(0, Number(e.target.value)) })} />
                            </div>
                            <div className="flex flex-col ml-4">
                                <span className="text-[9px] font-bold text-slate-400 mb-1">KERF (MM)</span>
                                <input type="number" className="w-16 p-2 border border-slate-300 rounded-lg text-center font-bold text-blue-600" value={summary.kerf || ""} onChange={(e) => setSummary({ ...summary, kerf: Math.max(0, Number(e.target.value)) })} />
                            </div>
                        </div>
                    </div>

                    {/* C. Material Requirement Summary (One by One layout) */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="text-xs font-black text-slate-500 uppercase block tracking-wider">2. Material Requirement Summary</label>
                        <div className="max-w-2xl">
                            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                <thead className="bg-[#e3f2fd] text-slate-700 font-black uppercase text-[10px]">
                                    <tr>
                                        <th className="border border-slate-200 p-3 text-left">Plywood Thickness</th>
                                        <th className="border border-slate-200 p-3 text-center">Sheets Required</th>
                                    </tr>
                                </thead>
                                {/* <tbody className="bg-white font-medium">
                                    {Array.from(new Set(rooms.flatMap(r => r.items.map((i: any) => i.plyThickness)))).filter(t => t).map((thick, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="border border-slate-200 p-3 font-bold text-slate-700">{thick} mm</td>
                                            <td className="border border-slate-200 p-3 text-center">
                                                <span className="bg-slate-100 border border-slate-300 px-6 py-1 rounded-full font-black text-blue-600 text-sm">0</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {rooms.flatMap(r => r.items).filter(i => i.plyThickness).length === 0 && (
                                        <tr><td colSpan={2} className="p-4 text-center text-slate-400 italic font-bold">No thickness data entered in the tables above.</td></tr>
                                    )}
                                </tbody> */}

                                <tbody className="bg-white font-medium">
                                    {summary.materialSummary.map((item: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="border border-slate-200 p-3 font-bold text-slate-700">
                                                {item.thickness} mm
                                            </td>
                                            <td className="border border-slate-200 p-3 text-center">
                                                <span className="bg-blue-50 border border-blue-200 px-6 py-1 rounded-full font-black text-blue-600 text-sm">
                                                    {item.sheetsNeeded}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                    {summary.materialSummary.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="p-4 text-center text-slate-400 italic font-bold">
                                                No valid measurements entered to calculate sheet requirements.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div >
    );
};

export default CutlistForm;