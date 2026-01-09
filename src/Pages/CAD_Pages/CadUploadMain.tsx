// import React, { useState } from "react";
// import { useExtractCAD } from "../../apiList/cad_Api/cadApi";
// import { Button } from "../../components/ui/Button";
// import { Label } from "../../components/ui/Label";
// import { useParams } from "react-router-dom";

// const CadUploadMain: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const { organizationId } = useParams() as { organizationId: string }
//   const { mutate, data, isPending, isSuccess } = useExtractCAD();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = () => {
//     if (file) {
//       mutate({file, organizationId});
//     }
//   };

//   return (
//     <div className="min-h-screen !max-h-full overflow-y-auto bg-[#F8FAFC] p-4 font-sans text-gray-900">
//       <div className="mx-auto max-w-7xl">
//         {/* Header Section */}
//         <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
//           <div>
//             <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
//               Project <span className="text-blue-600">Estimator Pro</span>
//             </h1>
//             <p className="mt-2 text-gray-500">
//               Trade-based automated takeoff and estimation for commercial layouts.
//             </p>
//           </div>
//         </div>


//         <div className="mb-10 overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-100/40 border border-gray-100">
//           <div className="p-8">
//             <Label className="mb-4 block text-lg font-bold">CAD Layout Upload</Label>
//             <div
//               className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-12 text-center 
//               ${file ? "border-blue-400 bg-blue-50/20" : "border-gray-200 hover:border-blue-500 hover:bg-gray-50"}`}
//             >
//               <input
//                 type="file"
//                 accept=".pdf"
//                 className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0"
//                 onChange={handleFileChange}
//               />
//               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
//                 <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
//               </div>
//               <p className="text-lg font-semibold text-gray-800">
//                 {file ? file.name : "Drop your CAD PDF here"}
//               </p>
//               <p className="mt-1 text-sm text-gray-400 font-medium">Supported: High-resolution Layout PDFs (Max 50MB)</p>
//             </div>

//             <div className="mt-8 flex justify-end gap-4">
//               {file && (
//                 <Button variant="ghost" onClick={() => setFile(null)}>
//                   Clear
//                 </Button>
//               )}
//               <Button
//                 variant="primary"
//                 size="lg"
//                 onClick={handleUpload}
//                 isLoading={isPending}
//                 disabled={!file}
//                 className="min-w-[200px]"
//               >
//                 <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Run Extraction
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Warnings / Errors */}
//         {data && data?.data?.extraction_warnings?.length > 0 && (
//           <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-700 text-sm">
//             <p className="font-bold mb-1"><i className="fa-solid fa-triangle-exclamation mr-2"></i>AI Extraction Notes:</p>
//             <ul className="list-disc ml-5">
//               {data.data.extraction_warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
//             </ul>
//           </div>
//         )}

//         {/* Dynamic Results Section - Grouped by WORK TYPE */}
//         {isSuccess && data?.data?.works && (
//           <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
//             {data.data.works.map((work: any, workIdx: number) => (
//               <div key={workIdx} className="space-y-4">
//                 {/* Work Category Header */}
//                 <div className="flex items-center gap-4 border-l-4 border-blue-600 pl-4 py-2 bg-blue-50/50 rounded-r-lg">
//                   <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
//                     {work.work_type}
//                   </h2>
//                   <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded">
//                     {work.rooms.length} Rooms Affected
//                   </span>
//                 </div>

//                 {/* Rooms inside this Work Category */}
//                 <div className="grid gap-6">
//                   {work.rooms.map((room: any, roomIdx: number) => (
//                     <div key={roomIdx} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//                       <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
//                         <h3 className="font-bold text-gray-700 flex items-center gap-2">
//                           <i className="fa-solid fa-location-dot text-blue-500"></i>
//                           {room.room_name}
//                         </h3>
//                         <span className="text-[10px] font-bold text-gray-400 uppercase">Room Detailed Takeoff</span>
//                       </div>

//                       <div className="overflow-x-auto">
//                         <table className="w-full text-left text-sm">
//                           <thead>
//                             <tr className="bg-white text-[10px] font-black uppercase text-gray-400 border-b">
//                               <th className="px-6 py-4">S.No / Code</th>
//                               <th className="px-6 py-4">Description & Dimensions</th>
//                               <th className="px-6 py-4 text-center">Qty</th>
//                               <th className="px-6 py-4">UOM</th>
//                               <th className="px-6 py-4 text-right">Unit Price</th>
//                               <th className="px-6 py-4 text-right">Total</th>
//                             </tr>
//                           </thead>
//                           <tbody className="divide-y divide-gray-50">
//                             {room.items.map((item: any, itemIdx: number) => (
//                               <tr key={itemIdx} className="hover:bg-gray-50/50 transition-colors">
//                                 <td className="px-6 py-4 font-mono font-bold text-blue-600">
//                                   {item.s_no}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                   <div className="font-semibold text-gray-900">{item.description}</div>
//                                   {(item.metadata?.l || item.metadata?.b) && (
//                                     <div className="text-[11px] text-gray-400 mt-1">
//                                       Specs: {item.metadata.l || '-'}(L) x {item.metadata.b || '-'}(B) x {item.metadata.h || '-'}(H)
//                                     </div>
//                                   )}
//                                   {item.location && <div className="text-[10px] text-blue-400 italic">Loc: {item.location}</div>}
//                                 </td>
//                                 <td className="px-6 py-4 text-center font-bold text-gray-700">
//                                   {item.quantity}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                   <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">
//                                     {item.uom}
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4 text-right font-mono text-gray-400">
//                                   {item.price ? `₹${item.price}` : "Pending"}
//                                 </td>
//                                 <td className="px-6 py-4 text-right font-bold text-gray-900">
//                                   {item.total_price ? `₹${item.total_price}` : "—"}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CadUploadMain;



import React, { useState, useEffect, useMemo } from "react";
import { useExtractCAD, useGetMultiMaterialBrands } from "../../apiList/cad_Api/cadApi";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { useParams } from "react-router-dom";
import dummyData from "./dummycaddata.json";
import CadUploadHeader from "./CadUploadHeader";
import SearchSelect from "../../components/ui/SearchSelect";
import { useGetCategories } from "../../apiList/Quote Api/RateConfig Api/rateConfigApi";



const CadUploadMain: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [localExtractionData, setLocalExtractionData] = useState<any>(dummyData);

  const { organizationId } = useParams() as { organizationId: string };
  let { mutate, data, isPending, isSuccess } = useExtractCAD();

  const isDevelopment = true;


  // Load AI data into local editable state once success occurs
  // useEffect(() => {
  //   if (isSuccess && data?.data) {
  //     setLocalExtractionData(data.data);
  //     setStep(2);
  //   }
  // }, [isSuccess, data]);


  useEffect(() => {
    if (isDevelopment) {
      // Automatically load dummy data and skip to step 2
      setLocalExtractionData(dummyData); // Note: dummyData usually has the {ok: true, data: {...}} structure
      setStep(2);
    } else if (isSuccess && data?.data) {
      // Real API logic
      setLocalExtractionData(data.data);
      setStep(2);
    }
  }, [isSuccess, data, isDevelopment]);

  // 1. Fetch available material categories from your new hook
  const { data: categoriesData } = useGetCategories(organizationId!);

  // 2. Prepare Category Options for the first SearchSelect
  const materialCategoryOptions = useMemo(() => {
    return categoriesData?.map((cat: any) => cat.name) || [];
  }, [categoriesData]);

  // 3. Extract all selected categories across the whole project to fetch brands
  const selectedCategoriesAcrossProject = useMemo(() => {
    if (!localExtractionData?.works) return [];
    const cats = new Set<string>();

    localExtractionData.works.forEach((work: any) => {
      // 1. Check Work Level
      if (work.selectedMaterial) cats.add(work.selectedMaterial);

      work.rooms.forEach((room: any) => {
        // 2. Check Room Level
        if (room.selectedMaterial) cats.add(room.selectedMaterial);

        room.items.forEach((item: any) => {
          // 3. Check Item Level
          if (item.materialCategory) cats.add(item.materialCategory);
        });
      });
    });

    return Array.from(cats); // Returns unique categories from all levels
  }, [localExtractionData]);


  // 4. Fetch brands only for the categories actually selected in the UI
  const brandQueries = useGetMultiMaterialBrands(organizationId!, selectedCategoriesAcrossProject);

  // 5. Map brands to their categories: { "Plywood": { "Century": 120 }, "Glass": { "Saint Gobain": 500 } }
  const brandMasterMap = useMemo(() => {
    const map: Record<string, any> = {};

    selectedCategoriesAcrossProject.forEach((cat, index) => {
      const brandList = brandQueries[index]?.data || [];
      const catMap: Record<string, any> = {};

      brandList.forEach((b: any) => {
        const d = b?.data || {};
        const bName = (d.Brand ?? d.brand)?.trim();
        const thickness = d["thickness (mm)"] || d.thickness || "";
        const rate = parseFloat(d.Rs ?? d.rs ?? 0);

        if (bName) {
          // Create a unique key like "Sharon GOLD-BWP (12mm)"
          const uniqueDisplayName = thickness ? `${bName} (${thickness}mm)` : bName;

          catMap[uniqueDisplayName] = {
            rate,
            originalName: bName,
            thickness: thickness
          };
        }
      });
      map[cat] = catMap;
    });

    return map;
  }, [brandQueries, selectedCategoriesAcrossProject]);

  // 1. Apply to Entire Work (Master)
  // const applyToWork = (workIdx: number, matName: string, brandName: string) => {
  //   const rate = brandMasterMap[matName]?.[brandName]?.rate || 0;
  //   const newData = { ...localExtractionData };

  //   // Set the "Current Selection" at the Work level for UI feedback
  //   newData.works[workIdx].selectedMaterial = matName;
  //   newData.works[workIdx].selectedBrand = brandName;

  //   newData.works[workIdx].rooms.forEach((room: any) => {
  //     // Sync Room level state
  //     room.selectedMaterial = matName;
  //     room.selectedBrand = brandName;
  //     room.roomRate = rate;

  //     // Sync individual items for calculation
  //     room.items.forEach((item: any) => {
  //       item.price = rate;
  //     });
  //   });
  //   setLocalExtractionData(newData);
  // };


  const applyToWork = (workIdx: number, matName: string, brandName: string, rate: number) => {
  const newData = { ...localExtractionData };

  newData.works[workIdx].selectedMaterial = matName;
  newData.works[workIdx].selectedBrand = brandName;

  newData.works[workIdx].rooms.forEach((room: any) => {
    room.selectedMaterial = matName;
    room.selectedBrand = brandName;
    room.roomRate = rate;

    room.items.forEach((item: any) => {
      item.price = rate;
      item.materialCategory = matName;
      item.brand = brandName;
    });
  });

  setLocalExtractionData(newData);
};

 // 2. Apply to Room Only (Override)
const applyToRoom = (workIdx: number, roomIdx: number, matName: string, brandName: string, rate: number) => {
  // 1. Shallow clone the state
  const newData = { ...localExtractionData };
  
  // 2. Target the specific room using indices
  const room = newData.works[workIdx].rooms[roomIdx];

  // 3. Update the Room-level selection state
  room.selectedMaterial = matName;
  room.selectedBrand = brandName;
  room.roomRate = rate;

  // 4. Update every item inside this room to use the new rate/brand
  room.items.forEach((item: any) => {
    item.price = rate;
    item.materialCategory = matName;
    item.brand = brandName;
  });

  // 5. Save the updated state
  setLocalExtractionData(newData);
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) mutate({ file, organizationId });
  };

  // HANDLER: Generic update function for any field in the nested structure
  const updateField = (workIdx: number, roomIdx: number, itemIdx: number, field: string, value: any) => {
    const newData = { ...localExtractionData };
    newData.works[workIdx].rooms[roomIdx].items[itemIdx][field] = value;
    setLocalExtractionData(newData);
  };

  // const handleProjectNameChange = (val: string) => {
  //   setLocalExtractionData({ ...localExtractionData, project_name: val });
  // };


  const handleStep = (step: 1 | 2) => {
    setStep(step)
  }


  // bg coolor = bg-[#F1F5F9]

  return (
    <div className="min-h-full max-h-full overflow-y-auto  !bg-white pb-20 font-sans text-slate-900">
      <div className="mx-auto max-w-full p-2">

        {/* --- MINIMALIST TYPOGRAPHY HEADER --- */}
        <CadUploadHeader step={step} localExtractionData={localExtractionData} handleStep={handleStep} />


        {/* --- STEP 1: UPLOAD --- */}
        {step === 1 && (
          <>
            <div className="mb-10 overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-100/40 border border-gray-100">
              <div className="p-8">
                <Label className="mb-4 block text-lg font-bold">CAD Layout Upload</Label>
                <div
                  className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-12 text-center 
              ${file ? "border-blue-400 bg-blue-50/20" : "border-gray-200 hover:border-blue-500 hover:bg-gray-50"}`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0"
                    onChange={handleFileChange}
                  />
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {file ? file.name : "Drop your CAD PDF here"}
                  </p>
                  <p className="mt-1 text-sm text-gray-400 font-medium">Supported: High-resolution Layout PDFs (Max 50MB)</p>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  {file && (
                    <Button variant="ghost" onClick={() => setFile(null)}>
                      Clear
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleUpload}
                    isLoading={isPending}
                    disabled={!file}
                    className="min-w-[200px]"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Run Extraction
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- STEP 2: FULLY EDITABLE CALCULATION --- */}
        {/* {step === 2 && localExtractionData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

            <div className="mb-4 flex items-center gap-3 px-1 group">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><i className="fa-solid fa-diagram-project"></i></div>


              <div className="flex-1">
                <span className="block text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-0.5">
                  Current Project
                </span>
                <input
                  value={localExtractionData.project_name}
                  onChange={(e) => handleProjectNameChange(e.target.value)}
                  placeholder="Enter Project Name..."
                  className="w-full text-xl font-bold text-slate-800 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {localExtractionData.works.map((work: any, workIdx: number) => (
              <div key={workIdx} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-blue-600 px-8 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-blue-400 w-5 flex justify-center">
                      <i className="fa-solid fa-hard-hat text-sm"></i>
                    </div>

                    <input
                      value={work.work_type}
                      onChange={(e) => {
                        const newData = { ...localExtractionData };
                        newData.works[workIdx].work_type = e.target.value;
                        setLocalExtractionData(newData);
                      }}
                      placeholder="Work Category Name"
                      className="bg-transparent flex-1 text-white font-bold uppercase tracking-widest text-[14px] outline-none border-b border-white/70 group-hover:border-blue-500/50 focus:border-blue-400 transition-all py-1 w-full"
                    />
                  </div>
                </div>

                <div className="p-4 space-y-8">
                  {work.rooms.map((room: any, roomIdx: number) => (
                    <div key={roomIdx} className="space-y-4">
                      <div className="flex items-center gap-2 pl-2 group/room mb-1">
                        <div className="w-4 flex justify-center text-blue-500">
                          <i className="fa-solid fa-door-open text-[14px]"></i>
                        </div>

                        <input
                          value={room.room_name}
                          onChange={(e) => {
                            const newData = { ...localExtractionData };
                            newData.works[workIdx].rooms[roomIdx].room_name = e.target.value;
                            setLocalExtractionData(newData);
                          }}
                          placeholder="Room Name"
                          className="flex-1 font-black text-slate-700 uppercase text-[14px] tracking-wider outline-none border-b border-blue-600/60 group-hover/room:border-slate-200 focus:border-blue-400 bg-transparent py-0.5 transition-all"
                        />
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <table className="w-full text-sm border-collapse">
                          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                            <tr>
                              <th className="px-6 py-4">Code</th>
                              <th className="px-6 py-4">Description</th>
                              <th className="px-6 py-4">Material / Brand Mapping</th>
                              <th className="px-6 py-4 text-center w-24">Qty</th>
                              <th className="px-6 py-4 w-24">UOM</th>
                              <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {room.items.map((item: any, itemIdx: number) => (
                              <tr key={itemIdx} className="group hover:bg-blue-50/20 transition-all">
                                <td className="px-6 py-4 w-32">
                                  <input
                                    value={item.s_no}
                                    onChange={(e) => updateField(workIdx, roomIdx, itemIdx, 's_no', e.target.value)}
                                    className="bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded border border-blue-100 w-full text-xs outline-none"
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <textarea
                                    rows={1}
                                    value={item.description}
                                    onChange={(e) => updateField(workIdx, roomIdx, itemIdx, 'description', e.target.value)}
                                    className="bg-transparent w-full font-bold text-slate-700 resize-none outline-none focus:text-blue-600"
                                  />


                                  <div className="flex gap-1.5 mt-1.5 items-center">
                                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded overflow-hidden focus-within:border-blue-400 transition-colors">
                                      <span className="bg-slate-200 px-1.5 py-0.5 text-[8px] font-black text-slate-500 uppercase border-r border-slate-200">
                                        L
                                      </span>
                                      <input
                                        placeholder="0"
                                        value={item.metadata?.l ?? ""}
                                        onChange={(e) => {
                                          const newData = { ...localExtractionData };
                                          if (!newData.works[workIdx].rooms[roomIdx].items[itemIdx].metadata) {
                                            newData.works[workIdx].rooms[roomIdx].items[itemIdx].metadata = { l: "", b: "", h: "" };
                                          }
                                          newData.works[workIdx].rooms[roomIdx].items[itemIdx].metadata.l = e.target.value;
                                          setLocalExtractionData(newData);
                                        }}
                                        // className="text-[10px] w-12 bg-transparent px-1 py-0.5 font-bold text-slate-700 outline-none"
                                        className="text-[11px] w-16 bg-transparent px-2 py-0.5 font-bold text-slate-700 outline-none"

                                      />
                                    </div>


                                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded overflow-hidden focus-within:border-blue-400 transition-colors">
                                      <span className="bg-slate-200 px-1.5 py-0.5 text-[8px] font-black text-slate-500 uppercase border-r border-slate-200">
                                        B
                                      </span>
                                      <input
                                        placeholder="0"
                                        value={item.metadata?.b ?? ""}
                                        onChange={(e) => {
                                          const newData = { ...localExtractionData };
                                          if (!newData.works[workIdx].rooms[roomIdx].items[itemIdx].metadata) {
                                            newData.works[workIdx].rooms[roomIdx].items[itemIdx].metadata = { l: "", b: "", h: "" };
                                          }
                                          newData.works[workIdx].rooms[roomIdx].items[itemIdx].metadata.b = e.target.value;
                                          setLocalExtractionData(newData);
                                        }}
                                        className="text-[11px] w-16 bg-transparent px-2 py-0.5 font-bold text-slate-700 outline-none"
                                      />
                                    </div>


                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <select className="w-full bg-slate-50 border-slate-200 rounded-lg text-xs font-bold p-2 outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Search Database Material...</option>
                                    <option>Saint Gobain Gypsum - 12.5mm</option>
                                    <option>Toughened Glass - 10mm</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateField(workIdx, roomIdx, itemIdx, 'quantity', parseFloat(e.target.value))}
                                    className="w-16 bg-slate-100 rounded text-center font-black p-1 outline-none"
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <select
                                    value={item.uom}
                                    onChange={(e) => updateField(workIdx, roomIdx, itemIdx, 'uom', e.target.value)}
                                    className="text-[10px] font-black uppercase bg-white border border-slate-200 rounded p-1"
                                  >
                                    <option value="NOS">NOS</option>
                                    <option value="SQFT">SQFT</option>
                                    <option value="RFT">RFT</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 text-right font-black text-slate-900">₹0.00</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )} */}


        {step === 2 && localExtractionData && (
          <>
            {/* <div className="flex-1 mb-4">
              <span className="block text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-0.5">
                Current Project
              </span>
              <input
                value={localExtractionData.project_name}
                onChange={(e) => handleProjectNameChange(e.target.value)}
                placeholder="Enter Project Name..."
                className="w-full text-xl font-bold text-slate-800 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 transition-all placeholder:text-slate-300"
              />
            </div> */}


            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {localExtractionData.works.map((work: any, workIdx: number) => {

                return (
                  <div key={workIdx} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* WORK HEADER WITH MASTER SELECTOR */}
                    <div className="bg-blue-600 px-8 py-3 flex justify-between items-center">
                      <div className="flex items-center gap-3 flex-1">
                        <i className="fa-solid fa-hard-hat text-white text-sm"></i>
                        <input
                          value={work.work_type}
                          onChange={(e) => {
                            const d = { ...localExtractionData };
                            d.works[workIdx].work_type = e.target.value;
                            setLocalExtractionData(d);
                          }}
                          className="bg-transparent text-white font-bold uppercase tracking-widest text-sm outline-none border-b border-white/30 w-2/3"
                        />
                      </div>


                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white font-bold uppercase mr-2">Master Category:</span>
                        <div className="w-50">
                          <SearchSelect
                            options={materialCategoryOptions}
                            placeholder="Material"
                            selectedValue={work.selectedMaterial || ""}
                            onSelect={(val) => {
                              const d = { ...localExtractionData };
                              d.works[workIdx].selectedMaterial = val;
                              setLocalExtractionData(d);
                            }}
                          // className="!bg-white/10 !border-white/10 !text-white text-xs"
                          />
                        </div>
                        <div className="w-50">
                          <SearchSelect
                            options={Object.keys(brandMasterMap[work.selectedMaterial] || {})}
                            placeholder="Brand"
                            selectedValue={work.selectedBrand || ""}
                            // disabled={!work.selectedMaterial}
                            // onSelect={(val) => applyToWork(workIdx, work.selectedMaterial, val || "")}
                            onSelect={(val) => {
                              if (!val) return;

                              // Find the brand object in our master map array that matches the name
                              const brandList = brandMasterMap[work.selectedMaterial] || [];
                              const selectedEntry = brandList.find((b: any) => b.name === val);

                              const rate = selectedEntry?.rate || 0;

                              // Now call applyToWork with the found rate
                              applyToWork(workIdx, work.selectedMaterial, val, rate);
                            }}
                          />
                        </div>
                      </div>

                    </div>

                    <div className="p-4 space-y-12">
                      {work.rooms.map((room: any, roomIdx: number) => (
                        <div key={roomIdx} className="space-y-4">
                          {/* ROOM HEADER WITH ROOM OVERRIDE */}
                          {/* <div className="flex items-center justify-between border-b border-slate-100 pb-2"> */}
                          <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 gap-4">
                            {/* <div className="flex items-center gap-2 pl-2"> */}
                            <div className="flex items-center gap-3 flex-1">

                              <i className="fa-solid fa-door-open text-blue-600 text-sm"></i>
                              <input
                                value={room.room_name}
                                onChange={(e) => {
                                  const d = { ...localExtractionData };
                                  d.works[workIdx].rooms[roomIdx].room_name = e.target.value;
                                  setLocalExtractionData(d);
                                }}
                                className="font-black text-slate-700 uppercase tracking-widest text-xs outline-none border-b border-blue-600/30 w-2/3"

                              />
                            </div>


                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black text-slate-400 uppercase">Room Override:</span>
                              <div className="w-50">
                                <SearchSelect
                                  options={materialCategoryOptions}
                                  placeholder="Material"
                                  selectedValue={room.selectedMaterial || ""}
                                  onSelect={(val) => {
                                    const d = { ...localExtractionData };
                                    d.works[workIdx].rooms[roomIdx].selectedMaterial = val;
                                    setLocalExtractionData(d);
                                  }}
                                />
                              </div>
                              <div className="w-50">
                                <SearchSelect
                                  options={Object.keys(brandMasterMap[room.selectedMaterial] || {})}
                                  placeholder="Brand"
                                  // disabled={!room.selectedMaterial}
                                  // onSelect={(val) => applyToRoom(workIdx, roomIdx, room.selectedMaterial, val || "")}
                                  onSelect={(val) => {
                                    if (!val) return;

                                    const brandList = brandMasterMap[room.selectedMaterial] || [];
                                    const selectedEntry = brandList.find((b: any) => b.name === val);

                                    const rate = selectedEntry?.rate || 0;

                                    applyToRoom(workIdx, roomIdx, room.selectedMaterial, val, rate);
                                  }}
                                />
                              </div>
                            </div>


                          </div>

                          <div className="overflow-x-auto rounded-xl border border-slate-100">
                            <table className="w-full text-sm border-collapse">
                              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                                <tr>
                                  <th className="px-4 py-3 text-left w-24">Code</th>
                                  <th className="px-4 py-3 text-left">Description</th>
                                  <th className="px-4 py-3 text-center w-20">Qty</th>
                                  <th className="px-4 py-3 text-center w-24">UOM</th>
                                  <th className="px-4 py-3 text-right w-32">Rate (₹)</th>
                                  <th className="px-4 py-3 text-right w-32">Total (₹)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {room.items.map((item: any, itemIdx: number) => {
                                  // Math: Area calculation for SQFT
                                  let multiplier = 1;
                                  if (item.uom === "SQFT" || item.uom === "SQM") {
                                    const l = parseFloat(item.metadata?.l || 0);
                                    const b = parseFloat(item.metadata?.b || 0);
                                    if (l > 0 && b > 0) multiplier = (l * b) / 92903.04;
                                  }

                                  const unitPrice = parseFloat(item.price || 0);
                                  const rowTotal = (parseFloat(item.quantity || 0) * multiplier * unitPrice);


                                  return (
                                    <tr key={itemIdx} className="hover:bg-blue-50/20 transition-all">
                                      <td className="px-4 py-4"><input value={item.s_no} onChange={(e) => updateField(workIdx, roomIdx, itemIdx, 's_no', e.target.value)} className="w-full bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded outline-none text-xs" /></td>
                                      <td className="px-4 py-4">
                                        <textarea rows={1} value={item.description} onChange={(e) => updateField(workIdx, roomIdx, itemIdx, 'description', e.target.value)} className="w-full font-bold text-slate-700 outline-none bg-transparent" />
                                        {/* L & B Inputs */}
                                        <div className="flex gap-2 mt-2">
                                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded overflow-hidden w-24">
                                            <span className="bg-slate-200 px-1.5 py-0.5 text-[8px] font-black uppercase border-r border-slate-200">L</span>
                                            <input value={item.metadata?.l ?? ""} onChange={(e) => {
                                              const d = { ...localExtractionData };
                                              if (!d.works[workIdx].rooms[roomIdx].items[itemIdx].metadata) d.works[workIdx].rooms[roomIdx].items[itemIdx].metadata = { l: "", b: "" };
                                              d.works[workIdx].rooms[roomIdx].items[itemIdx].metadata.l = e.target.value;
                                              setLocalExtractionData(d);
                                            }} className="text-[11px] w-full px-2 font-bold outline-none bg-transparent" />
                                          </div>
                                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded overflow-hidden w-24">
                                            <span className="bg-slate-200 px-1.5 py-0.5 text-[8px] font-black uppercase border-r border-slate-200">B</span>
                                            <input value={item.metadata?.b ?? ""} onChange={(e) => {
                                              const d = { ...localExtractionData };
                                              if (!d.works[workIdx].rooms[roomIdx].items[itemIdx].metadata) d.works[workIdx].rooms[roomIdx].items[itemIdx].metadata = { l: "", b: "" };
                                              d.works[workIdx].rooms[roomIdx].items[itemIdx].metadata.b = e.target.value;
                                              setLocalExtractionData(d);
                                            }} className="text-[11px] w-full px-2 font-bold outline-none bg-transparent" />
                                          </div>
                                        </div>
                                      </td>

                                      <td className="px-4 py-4 text-center"><input type="number" value={item.quantity} onChange={(e) => updateField(workIdx, roomIdx, itemIdx, 'quantity', e.target.value)} className="w-16 bg-slate-100 rounded text-center font-black p-1" /></td>
                                      <td className="px-4 py-4 text-center">
                                        <select value={item.uom} onChange={(e) => updateField(workIdx, roomIdx, itemIdx, 'uom', e.target.value)} className="text-[10px] font-black border border-slate-200 rounded p-1">
                                          <option value="nos">NOS</option>
                                          <option value="sqft">SQFT</option>
                                          <option value="sqmm">SQMM</option>
                                        </select>
                                      </td>
                                      <td className="px-4 py-4">
                                        <div className="flex items-center justify-end bg-emerald-50 border border-emerald-100 rounded px-2">
                                          <span className="text-[10px] text-emerald-600 font-bold mr-1">₹</span>
                                          <input type="number" value={item.unitPrice || 0} onChange={(e) => updateField(workIdx, roomIdx, itemIdx, 'price', e.target.value)} className="w-20 bg-transparent text-right font-black text-emerald-700 text-xs py-1 outline-none" />
                                        </div>
                                      </td>

                                      {/* <td className="px-4 py-4 text-right font-black text-slate-900">₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td> */}
                                      <td className="px-4 py-3 text-right font-black text-slate-900 bg-slate-50/30">
                                        ₹ {rowTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                      </td>
                                    </tr>

                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )
        }


      </div >
    </div >
  );
};

export default CadUploadMain;