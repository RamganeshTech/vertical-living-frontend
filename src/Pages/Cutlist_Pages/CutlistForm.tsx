import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useGetProjects } from '../../apiList/projectApi';
import { useGetAllClientQuotesForDropDown } from '../../apiList/Quote Api/ClientQuote/clientQuoteApi';
import SearchSelectNew from '../../components/ui/SearchSelectNew';
import { Input } from '../../components/ui/Input';

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
        roomName: 'Room 1',
        productName: 'Product 1',
        backSideLaminateImage: null,
        frontSideLaminateImage: null,
        items: [{
            sNo: 1,
            measurement: '',
            plyThickness: '',
            innerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' },
            outerFace: { laminateThickness: '0.5', laminateBrand: '', laminateNameCode: '' }
        }]
    };


    // const [rooms, setRooms] = useState<any[]>([defaultRoom]);
    const [rooms, setRooms] = useState<any[]>(initialData?.rooms?.length ? initialData.rooms : [defaultRoom]);

    // Effect to handle data loading for Edit mode specifically
    useEffect(() => {
        if (initialData) {
            setHeader({
                projectId: initialData.projectId?._id || initialData.projectId || null,
                selectedQuoteNo: initialData?.quoteNo || null,
                selectedQuoteId: initialData?.quoteId || null,
                clientName: initialData.clientName || '',
                location: initialData.location || '',
                versionNo: initialData.versionNo || '1.0'
            });
            setRooms(initialData.rooms?.length ? initialData.rooms : [defaultRoom]);
            setSummary(initialData.summary || summary);
        }
    }, [initialData]);


    const [summary, setSummary] = useState({
        fabricationRate: 0,
        unit: 'sqmm',
        plywoodSheetSizeW: 2440,
        plywoodSheetSizeH: 1220,
        kerf: 0
    });

    const { data: projectsData = [] } = useGetProjects(organizationId);
    const { data: quotesData = [] } =
        useGetAllClientQuotesForDropDown(organizationId, header.projectId || "");

    // --- CALCULATION ENGINE ---
    const calculatedTotals = useMemo(() => {
        let totalSqmm = 0;
        rooms.forEach(room => {
            room.items.forEach((item: any) => {
                const parts = item.measurement?.toLowerCase().replace(/mm/gi, "").split(/[x*×]/);
                if (parts?.length === 2) {
                    const w = parseFloat(parts[0]) || 0;
                    const h = parseFloat(parts[1]) || 0;
                    totalSqmm += (w * h);
                }
            });
        });

        let area = summary.unit === "sqmm" ? totalSqmm : summary.unit === "sqm" ? totalSqmm / 1e6 : (totalSqmm / 1e6) * 10.7639;
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
        setRooms([...rooms, { ...defaultRoom, roomName: `Room ${rooms.length + 1}` }]);
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
                measurement: '',
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
            roomName: furniture.furnitureName || 'Room',
            productName: furniture.furnitureName || 'Product',
            backSideLaminateImage: null,
            frontSideLaminateImage: null,
            items: (furniture.coreMaterials || []).map((material: any, idx: number) => ({
                sNo: idx + 1,
                measurement: '0 x 0',
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
            clientName: selectedQuote.clientName || '',
            location: selectedQuote.location || ''
        }));
    };

    return (
        <div className="bg-[#f4f6f9] max-h-full font-sans text-slate-900 w-full">

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
                    <div className='flex justify-between items-center gap-2'>
                        <button type="button" onClick={() => navigate(-1)} className='bg-blue-100 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2'>
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <i className="fas fa-receipt mr-3 text-blue-600"></i>
                                Cutlist – Site Entry
                            </h1>

                        </div>
                    </div>



                    <section className='flex gap-2 items-center'>

                        <Button className="bg-[#43a047] hover:bg-[#2e7d32] text-white px-8 font-bold" onClick={() => onSubmit(header, rooms, summary)} isLoading={isSubmitting}>
                            Save Cutlist
                        </Button>

                        {handleGenerate &&
                            <Button className="bg-[#43a047] hover:bg-[#2e7d32] text-white px-8 font-bold" onClick={handleGenerate} isLoading={isGeneratingPdf}>
                                Generate Pdf
                            </Button>}
                    </section>

                </header>
            </div>

            <div className="w-full space-y-4">
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
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Room:</label>
                                    <input
                                        className="bg-transparent border-b border-blue-200 font-bold text-slate-800 text-sm focus:border-blue-500 outline-none w-32"
                                        value={room.roomName}
                                        onChange={(e) => { const n = [...rooms]; n[rIdx].roomName = e.target.value; setRooms(n); }} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Product:</label>
                                    <input
                                        className="bg-transparent border-b border-blue-200 font-bold text-slate-800 text-sm focus:border-blue-500 outline-none w-32"
                                        value={room.productName}
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
                                    <tr className="text-center font-bold">
                                        <th className="border border-slate-300 p-3 w-12 text-center font-black">S No</th>
                                        <th className="border border-slate-300 p-3 w-40">Measurement</th>
                                        <th className="border border-slate-300 p-3 w-24">Plywood Thickness</th>
                                        <th className="border border-slate-300 p-3 w-24">Face Type</th>
                                        <th className="border border-slate-300 p-3 w-32">Laminate Thickness</th>
                                        <th className="border border-slate-300 p-3">Laminate Brand</th>
                                        <th className="border border-slate-300 p-3">Laminate Name & Code</th>
                                        <th className="border border-slate-300 p-1">Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {room.items.map((item: any, iIdx: number) => (
                                        <React.Fragment key={iIdx}>
                                            <tr className="bg-white">
                                                <td rowSpan={2} className="border border-slate-300 p-3 text-center font-bold text-slate-400">{item.sNo}</td>
                                                <td rowSpan={2} className="border border-slate-300 p-3">
                                                    <input className="w-full p-2 bg-[#fffde7] border border-[#fbc02d] rounded-md font-bold text-slate-700 outline-none" value={item.measurement} onChange={(e) => {
                                                        const n = [...rooms]; n[rIdx].items[iIdx].measurement = e.target.value; setRooms(n);
                                                    }} />
                                                </td>
                                                <td rowSpan={2} className="border border-slate-300 p-3 text-center">
                                                    <input className="w-16 p-2 border border-slate-200 rounded-md text-center font-bold text-slate-600" value={item.plyThickness} onChange={(e) => {
                                                        const n = [...rooms]; n[rIdx].items[iIdx].plyThickness = e.target.value; setRooms(n);
                                                    }} />
                                                </td>
                                                <td className="border border-slate-300 p-3 font-black text-[#2e7d32] bg-[#f1f8e9]/50 text-center uppercase">Inner</td>
                                                <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" value={item.innerFace.laminateThickness} onChange={(e) => {
                                                    const n = [...rooms]; n[rIdx].items[iIdx].innerFace.laminateThickness = e.target.value; setRooms(n);
                                                }} /></td>
                                                <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none" value={item.innerFace.laminateBrand} onChange={(e) => {
                                                    const n = [...rooms]; n[rIdx].items[iIdx].innerFace.laminateBrand = e.target.value; setRooms(n);
                                                }} /></td>
                                                <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none italic text-slate-400" placeholder="Code" value={item.innerFace.laminateNameCode} onChange={(e) => {
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
                                                <td className="border border-slate-300 p-3"><input className="w-full p-1 border-b border-slate-200 bg-transparent outline-none italic text-slate-400" placeholder="Code" value={item.outerFace.laminateNameCode} onChange={(e) => {
                                                    const n = [...rooms]; n[rIdx].items[iIdx].outerFace.laminateNameCode = e.target.value; setRooms(n);
                                                }} /></td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>

                                {/* ADD THIS TFOOT FOR ADD ITEM BUTTON */}
                                <tfoot>
                                    <tr>
                                        <td colSpan={8} className="p-2 bg-slate-50 border border-slate-300">
                                            <button
                                                type="button"
                                                onClick={() => addItem(rIdx)}
                                                className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-wider hover:text-blue-800"
                                            >
                                                <i className="fas fa-plus-circle" /> Add Item to {room.roomName}
                                            </button>
                                        </td>
                                    </tr>
                                </tfoot>


                            </table>
                        </div>
                    </div>
                ))}

                <div className="flex justify-center py-4">
                    <button
                        type="button"
                        onClick={addRoom}
                        className="bg-white border-2 border-dashed border-blue-300 px-12 py-3 rounded-xl text-blue-600 font-bold flex items-center gap-3 hover:bg-blue-50 transition-all shadow-sm"
                    >
                        <i className="fas fa-plus" /> ADD NEW ROOM
                    </button>
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
                                    <input type="number" className="w-24 p-2 border border-slate-300 rounded-lg font-bold" value={summary.fabricationRate} onChange={(e) => setSummary({ ...summary, fabricationRate: Number(e.target.value) })} />
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
                                <span className="text-[9px] font-bold text-slate-400 mb-1">WIDTH (MM)</span>
                                <input className="w-24 p-2 border border-slate-300 rounded-lg text-center font-bold text-slate-600" value={summary.plywoodSheetSizeW} onChange={(e) => setSummary({ ...summary, plywoodSheetSizeW: Number(e.target.value) })} />
                            </div>
                            <span className="mt-4 text-slate-300 font-black">×</span>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 mb-1">HEIGHT (MM)</span>
                                <input className="w-24 p-2 border border-slate-300 rounded-lg text-center font-bold text-slate-600" value={summary.plywoodSheetSizeH} onChange={(e) => setSummary({ ...summary, plywoodSheetSizeH: Number(e.target.value) })} />
                            </div>
                            <div className="flex flex-col ml-4">
                                <span className="text-[9px] font-bold text-slate-400 mb-1">KERF (MM)</span>
                                <input type="number" className="w-16 p-2 border border-slate-300 rounded-lg text-center font-bold text-blue-600" value={summary.kerf} onChange={(e) => setSummary({ ...summary, kerf: Number(e.target.value) })} />
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
                                <tbody className="bg-white font-medium">
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