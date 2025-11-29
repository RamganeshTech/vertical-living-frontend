
// FIVTH VERSION


import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    // type DragEndEvent,
    useDraggable
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// API Imports
import {
    useCreateBillNew,
    useGetBillNewById,
    useUpdateBillNew,
    useGetAllTemplates // For template drawer
} from '../../../../apiList/Department Api/Accounting Api/billNew_accounting_api/billNewAccountingApi';
// import { useGetProjects } from '../../../../apiList/Department Api/Project Api/projectApi'; // Project API
import { Button } from '../../../../components/ui/Button';
import { useGetProjects } from '../../../../apiList/projectApi';
// import { Card } from '../../../../components/ui/Card';

// --- UNDO/REDO HOOK ---
function useUndoRedo<T>(initialState: T) {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [index, setIndex] = useState(0);
    const state = history[index];

    // const setState = useCallback((value: T | ((val: T) => T)) => {
    //     setHistory((prev) => {
    //         const current = prev[index];
    //         const next = typeof value === 'function' ? (value as Function)(current) : value;
    //         if (JSON.stringify(current) === JSON.stringify(next)) return prev;
    //         const newHistory = prev.slice(0, index + 1);
    //         newHistory.push(next);
    //         if (newHistory.length > 50) newHistory.shift();
    //         return newHistory;
    //     });
    //     setIndex((prev) => prev + 1); // Simplified for this context
    // }, [index]);

    // Explicit setter for async updates
    const updateState = (value: T | ((val: T) => T)) => {
        const nextState = typeof value === 'function' ? (value as Function)(state) : value;
        if (JSON.stringify(state) === JSON.stringify(nextState)) return;
        const newHistory = history.slice(0, index + 1);
        newHistory.push(nextState);
        setHistory(newHistory);
        setIndex(newHistory.length - 1);
    };

    const undo = useCallback(() => setIndex(i => Math.max(i - 1, 0)), []);
    const redo = useCallback(() => setIndex(i => Math.min(i + 1, history.length - 1)), [history]);
    const reset = (newState: T) => { setHistory([newState]); setIndex(0); };

    return { state, setState: updateState, undo, redo, canUndo: index > 0, canRedo: index < history.length - 1, reset };
}

// --- TYPES ---
interface ComponentStyle {
    fontSize: number; color: string; backgroundColor: string; fontWeight: string; textAlign: string; width?: number; height?: number;
}
// interface TableCellData { content: string; style?: Partial<ComponentStyle>; }
interface ComponentItem {
    id: string; type: 'text' | 'image' | 'table' | 'data-field'; label: string; value: any; x: number; y: number;
    style: ComponentStyle; columnWidths?: number[]; rowHeights?: number[];
}
interface BillNewSingleProps { mode: 'create' | 'edit'; }

// --- UTILS ---
const generateId = () => `blk_${Math.random().toString(36).substr(2, 9)}`;
const defaultStyle: ComponentStyle = { fontSize: 12, color: '#000000', backgroundColor: 'transparent', fontWeight: 'normal', textAlign: 'left', width: 200, height: 'auto' as any };

// --- HELPER COMPONENTS ---
const TableGridSelector = ({ onSelect }: { onSelect: (r: number, c: number) => void }) => {
    const [hover, setHover] = useState({ rows: 0, cols: 0 });
    return (
        <div className="absolute top-12 left-0 z-50 bg-white shadow-xl border border-gray-300 p-3 rounded w-48">
            <div className="text-xs font-bold mb-2 text-gray-500">Table {hover.cols}x{hover.rows}</div>
            <div className="grid grid-cols-10 gap-1" onMouseLeave={() => setHover({ rows: 0, cols: 0 })}>
                {Array.from({ length: 50 }).map((_, i) => {
                    const r = Math.floor(i / 10) + 1; const c = (i % 10) + 1;
                    const isActive = r <= hover.rows && c <= hover.cols;
                    return <div key={i} className={`w-3 h-3 border ${isActive ? 'bg-blue-500 border-blue-600' : 'bg-gray-100 border-gray-300'}`} onMouseEnter={() => setHover({ rows: r, cols: c })} onClick={() => onSelect(r, c)} />;
                })}
            </div>
        </div>
    );
};

const ContextMenu = ({ x, y, actions, onClose }: { x: number, y: number, actions: any[], onClose: () => void }) => {
    useEffect(() => { const h = () => onClose(); document.addEventListener('click', h); return () => document.removeEventListener('click', h); }, [onClose]);
    return (
        <div className="fixed z-[9999] bg-white shadow-xl border border-gray-200 rounded py-1 min-w-[180px]" style={{ top: y, left: x }}>
            {actions.map((act, i) => (
                <button key={i} onClick={act.action} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 block ${act.color || 'text-gray-700'}`}>{act.label}</button>
            ))}
        </div>
    );
};

// --- TEMPLATE DRAWER COMPONENT ---
const TemplateDrawer = ({ organizationId, onSelect, onClose }: { organizationId: string, onSelect: (t: any) => void, onClose: () => void }) => {
    const { data } = useGetAllTemplates({ organizationId, limit: 20 });
    const templates = data?.pages.flatMap(p => p.data) || [];

    return (
        <div className="w-full bg-gray-50 border-b border-gray-200 p-4 animate-in slide-in-from-top-10 duration-300 shadow-inner">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-gray-700 uppercase">Select a Template</h3>
                <button onClick={onClose}><i className="fas fa-times text-gray-400 hover:text-gray-600"></i></button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {templates.map((t: any) => (
                    <div key={t._id} onClick={() => onSelect(t)} className="min-w-[160px] bg-white border rounded cursor-pointer hover:ring-2 ring-blue-500 transition-all">
                        <div className="h-24 bg-gray-100 flex items-center justify-center border-b text-gray-300"><i className="fas fa-file-invoice text-3xl"></i></div>
                        <div className="p-2"><p className="text-xs font-bold truncate">{t.templateName}</p></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- DRAGGABLE BLOCK ---
const DraggableBlock = ({ component, isSelected, onClick, onUpdateValue, onUpdateMeta, onResize, onDelete, activeCell, onCellSelect }: any) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: component.id, data: { ...component } });
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetR: number, targetC: number } | null>(null);

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform), position: 'absolute', left: `${component.x}px`, top: `${component.y}px`,
        width: component.style.width ? `${component.style.width}px` : 'auto', height: component.style.height ? `${component.style.height}px` : 'auto',
        zIndex: isDragging ? 9999 : (isSelected ? 100 : 1), fontSize: `${component.style.fontSize}px`, color: component.style.color,
        fontWeight: component.style.fontWeight, textAlign: component.style.textAlign, backgroundColor: component.style.backgroundColor
    };

    // ... (Keep Resize Handlers - same as previous) ...
    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation(); e.preventDefault(); const startX = e.clientX; const startY = e.clientY;
        const startW = component.style.width || 100; const startH = component.style.height || 100;
        const onMouseMove = (me: MouseEvent) => onResize(Math.max(50, startW + (me.clientX - startX)), Math.max(20, startH + (me.clientY - startY)));
        const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    };
    const handleColResize = (e: React.MouseEvent, i: number) => {
        e.stopPropagation(); const startX = e.clientX; const widths = component.columnWidths || []; const tableW = component.style.width || 300;
        const onMouseMove = (me: MouseEvent) => {
            const delta = ((me.clientX - startX) / tableW) * 100; const nw = [...widths];
            if (nw[i + 1] !== undefined) { nw[i] = Math.max(5, nw[i] + delta); nw[i + 1] = Math.max(5, nw[i + 1] - delta); onUpdateMeta('columnWidths', nw); }
        };
        const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    };
    const handleRowResize = (e: React.MouseEvent, i: number) => {
        e.stopPropagation(); const startY = e.clientY; const heights = component.rowHeights || [];
        const onMouseMove = (me: MouseEvent) => { const nh = [...heights]; nh[i] = Math.max(20, (nh[i] || 30) + (me.clientY - startY)); onUpdateMeta('rowHeights', nh); };
        const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    };

    const handleContextMenu = (e: React.MouseEvent, r: number = -1, c: number = -1) => {
        if (component.type !== 'table') return; e.preventDefault(); e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, targetR: r, targetC: c });
    };

    // Table Ops
    const insertRow = () => {
        const idx = contextMenu!.targetR === -1 ? component.value.length : contextMenu!.targetR + 1;
        const newVal = JSON.parse(JSON.stringify(component.value));
        newVal.splice(idx, 0, Array.from({ length: newVal[0].length }, () => ({ content: '', style: {} })));
        const h = [...(component.rowHeights || [])]; h.splice(idx, 0, 30);
        onUpdateValue(newVal); onUpdateMeta('rowHeights', h); setContextMenu(null);
    };
    const insertCol = () => {
        const idx = contextMenu!.targetC === -1 ? (component.columnWidths?.length || 1) : contextMenu!.targetC + 1;
        const newVal = component.value.map((row: any[]) => { const r = [...row]; r.splice(idx, 0, { content: '', style: {} }); return r; });
        let w = [...(component.columnWidths || [])]; w.splice(idx, 0, 15);
        const total = w.reduce((a, b) => a + b, 0); w = w.map(x => (x / total) * 100);
        onUpdateValue(newVal); onUpdateMeta('columnWidths', w); setContextMenu(null);
    };
    const deleteRow = () => {
        if (component.value.length <= 1) return;
        const newVal = [...component.value]; newVal.splice(contextMenu!.targetR, 1);
        const h = [...component.rowHeights]; h.splice(contextMenu!.targetR, 1);
        onUpdateValue(newVal); onUpdateMeta('rowHeights', h); setContextMenu(null);
    };
    const deleteCol = () => {
        if (component.value[0].length <= 1) return;
        const newVal = component.value.map((row: any[]) => row.filter((_, i) => i !== contextMenu!.targetC));
        let w = [...component.columnWidths]; w.splice(contextMenu!.targetC, 1);
        const total = w.reduce((a, b) => a + b, 0); w = w.map(x => (x / total) * 100);
        onUpdateValue(newVal); onUpdateMeta('columnWidths', w); setContextMenu(null);
    };

    return (
        <>
            <div ref={setNodeRef} style={style} onContextMenu={(e) => handleContextMenu(e)} onClick={(e) => { e.stopPropagation(); onClick(); }} className={`group ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`}>
                <div {...listeners} {...attributes} className={`absolute -top-3 -left-3 w-6 h-6 bg-white shadow rounded-full flex items-center justify-center cursor-move z-50 ${isSelected ? 'flex' : 'hidden group-hover:flex'}`}><i className="fa-solid fa-arrows-up-down-left-right text-xs text-gray-600"></i></div>

                {component.type === 'text' && <textarea className="w-full h-full p-1 bg-transparent border-transparent outline-none resize-none overflow-hidden" value={component.label} style={{ fontSize: component.style.fontSize, fontWeight: component.style.fontWeight, textAlign: component.style.textAlign, color: component.style.color }} onChange={(e) => onUpdateMeta('label', e.target.value)} onPointerDown={(e) => e.stopPropagation()} />}
                {component.type === 'data-field' && <div className="flex items-center gap-2 px-2 py-1 border border-dashed border-gray-400 bg-gray-50 w-full h-full overflow-hidden"><span className="font-bold text-xs whitespace-nowrap">{component.label}:</span><input className="bg-transparent border-b border-gray-300 text-xs w-full outline-none" value={component.value} onChange={(e) => onUpdateValue(e.target.value)} onPointerDown={(e) => e.stopPropagation()} /></div>}
                {/* {component.type === 'image' && <div className="w-full h-full bg-gray-100">{Array.isArray(component.value) && component.value.length > 0 ? <img src={component.value[0]} className="w-full h-full block pointer-events-none object-fill" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 border border-dashed">No Img</div>}</div>} */}

                {component.type === 'image' && (
                    <div className="w-full h-full bg-gray-100">
                        {Array.isArray(component.value) && component.value.length > 0 ? (
                            <img
                                src={
                                    typeof component.value[0] === 'string'
                                        ? component.value[0] // Existing S3 URL
                                        : (component.value[0] as any).preview // New File Preview
                                }
                                className="w-full h-full block pointer-events-none object-fill"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 border border-dashed">No Img</div>
                        )}
                    </div>
                )}

                {component.type === 'table' && Array.isArray(component.value) && (
                    <div className="w-full h-full flex flex-col relative">
                        {isSelected && <div className="flex w-full h-2 absolute -top-2 left-0 pointer-events-none z-20">{component.columnWidths?.map((w: number, i: number) => <div key={i} style={{ width: `${w}%` }} className="relative border-r border-blue-400 h-2 pointer-events-auto"><div onMouseDown={(e) => handleColResize(e, i)} className="absolute right-[-4px] top-[-4px] w-3 h-3 cursor-col-resize bg-blue-500 rounded-sm z-50"></div></div>)}</div>}
                        {isSelected && <div className="absolute -left-2 top-0 w-2 h-full flex flex-col pointer-events-none z-20">{component.rowHeights?.map((h: number, i: number) => <div key={i} style={{ height: `${h}px` }} className="relative border-b border-blue-400 w-2 pointer-events-auto"><div onMouseDown={(e) => handleRowResize(e, i)} className="absolute bottom-[-4px] left-[-4px] w-3 h-3 cursor-row-resize bg-blue-500 rounded-sm z-50"></div></div>)}</div>}
                        <table className="w-full table-fixed" style={{ borderCollapse: 'collapse', border: '1px solid #9ca3af' }}>
                            <colgroup>{component.columnWidths?.map((w: number, i: number) => <col key={i} style={{ width: `${w}%` }} />)}</colgroup>
                            <tbody>
                                {component.value.map((row: any[], r: number) => (
                                    <tr key={r} style={{ height: `${(component.rowHeights && component.rowHeights[r]) || 30}px` }}>
                                        {row.map((cell: any, c: number) => (
                                            <td key={c} style={{ border: '1px solid #9ca3af', padding: 0, verticalAlign: 'top', backgroundColor: cell.style?.backgroundColor || 'transparent' }} className={`relative ${activeCell?.r === r && activeCell?.c === c ? 'ring-2 ring-inset ring-blue-500 z-10' : ''}`} onContextMenu={(e) => handleContextMenu(e, r, c)}>
                                                <textarea className="w-full h-full p-1 border-none outline-none bg-transparent resize-none overflow-hidden" style={{ fontSize: `${cell.style?.fontSize || component.style.fontSize}px`, color: cell.style?.color || component.style.color, textAlign: cell.style?.textAlign || component.style.textAlign, fontWeight: cell.style?.fontWeight || component.style.fontWeight, fontFamily: 'inherit', lineHeight: '1.2' }} value={cell.content} onChange={(e) => { const nv = JSON.parse(JSON.stringify(component.value)); nv[r][c].content = e.target.value; onUpdateValue(nv); }} onFocus={() => onCellSelect(r, c)} onPointerDown={(e) => e.stopPropagation()} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {isSelected && <div onMouseDown={handleResizeMouseDown} onPointerDown={(e) => e.stopPropagation()} className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 cursor-nwse-resize rounded-full z-50 border-2 border-white shadow"></div>}
            </div>
            {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} actions={[{ label: 'Insert Row Below', action: insertRow, color: 'text-blue-600' }, { label: 'Insert Col Right', action: insertCol, color: 'text-blue-600' }, { label: 'Delete Row', action: deleteRow }, { label: 'Delete Col', action: deleteCol }, { label: 'Delete Table', action: onDelete, color: 'text-red-600' }]} />}
        </>
    );
};

// --- PROPERTY SIDEBAR ---
const PropertySidebar = ({ component, activeCell, onUpdate, onUpdateCell, onDelete, onClose }: any) => {
    const renderStyles = (fs: any, cl: any, bg: any, fw: any, ta: any, onChange: any, label: string) => (
        <div className="space-y-2 p-3 bg-gray-50 rounded border border-gray-200">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase">{label} Styling</h4>
            <div className="grid grid-cols-3 gap-2">
                <div><span className="text-[10px] text-gray-400">Size</span><input type="number" className="w-full border p-1 text-xs rounded" value={fs || 12} onChange={(e) => onChange('fontSize', Number(e.target.value))} /></div>
                <div className="relative"><span className="text-[10px] text-gray-400">Text</span><div className="flex items-center border p-1 rounded bg-white h-7"><input type="color" className="w-full h-full border-none p-0 bg-transparent cursor-pointer" value={cl || '#000000'} onChange={(e) => onChange('color', e.target.value)} /></div></div>
                <div className="relative"><span className="text-[10px] text-gray-400">BG</span><div className="flex items-center border p-1 rounded bg-white h-7"><input type="color" className="w-full h-full border-none p-0 bg-transparent cursor-pointer" value={bg || '#ffffff'} onChange={(e) => onChange('backgroundColor', e.target.value)} /></div></div>
            </div>
            <div className="flex gap-1">
                <button onClick={() => onChange('fontWeight', fw === 'bold' ? 'normal' : 'bold')} className={`flex-1 border p-1 text-xs ${fw === 'bold' ? 'bg-blue-100' : 'bg-white'}`}><i className="fa-solid fa-bold"></i></button>
                <button onClick={() => onChange('textAlign', 'left')} className={`flex-1 border p-1 text-xs ${ta === 'left' ? 'bg-blue-100' : 'bg-white'}`}><i className="fa-solid fa-align-left"></i></button>
                <button onClick={() => onChange('textAlign', 'center')} className={`flex-1 border p-1 text-xs ${ta === 'center' ? 'bg-blue-100' : 'bg-white'}`}><i className="fa-solid fa-align-center"></i></button>
                <button onClick={() => onChange('textAlign', 'right')} className={`flex-1 border p-1 text-xs ${ta === 'right' ? 'bg-blue-100' : 'bg-white'}`}><i className="fa-solid fa-align-right"></i></button>
            </div>
        </div>
    );

    let cStyle: any = {};
    if (component.type === 'table' && activeCell) cStyle = component.value[activeCell.r][activeCell.c].style || {};

    return (
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-50 fixed right-0 top-16 bottom-0" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center"><span className="font-bold text-xs uppercase text-gray-600">Properties</span><button onClick={onClose}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="p-4 space-y-6 overflow-y-auto flex-1">
                {component.type === 'text' && <textarea className="w-full border p-2 text-sm rounded" rows={3} value={component.label} onChange={(e) => onUpdate('label', e.target.value)} />}
                {component.type === 'data-field' && <><input className="w-full border p-2 text-sm rounded mb-2" value={component.label} onChange={(e) => onUpdate('label', e.target.value)} /><input className="w-full border p-2 text-sm rounded" value={component.value} onChange={(e) => onUpdate('value', e.target.value)} /></>}

                {component.type === 'table' && activeCell && renderStyles(cStyle.fontSize || component.style.fontSize, cStyle.color || component.style.color, cStyle.backgroundColor || 'transparent', cStyle.fontWeight || component.style.fontWeight, cStyle.textAlign || component.style.textAlign, (k: any, v: any) => onUpdateCell(activeCell.r, activeCell.c, k, v), "Cell")}
                {renderStyles(component.style.fontSize, component.style.color, component.style.backgroundColor, component.style.fontWeight, component.style.textAlign, (k: string, v: any) => onUpdate(k, v, true), "Global")}

                <button onClick={onDelete} className="w-full mt-6 bg-red-50 text-red-600 py-2 rounded border border-red-200 text-sm">Delete Block</button>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const BillNewSingle: React.FC<BillNewSingleProps> = ({ mode }) => {
    const navigate = useNavigate();
    const { id, organizationId } = useParams<{ id?: string; organizationId: string }>();
    const { data: billData, isLoading: isBillLoading } = useGetBillNewById({ id: id || '' });
    const { data: projects } = useGetProjects(organizationId!);

    // --- STATE ---
    const { state: components = [], setState: setComponents, undo, redo, canUndo, canRedo, reset: resetHistory } = useUndoRedo<ComponentItem[]>([]);
    const [billMeta, setBillMeta] = useState({ customerName: '', billNumber: '', projectId: '', projectName: '', pdfData: null as any });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeCell, setActiveCell] = useState<{ r: number, c: number } | null>(null);
    const [showTableGrid, setShowTableGrid] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false); // Toggle for template drawer
    const [sourceTemplateId, setSourceTemplateId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createMutation = useCreateBillNew();
    const updateMutation = useUpdateBillNew();
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    // --- SHORTCUTS ---
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
        };
        window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
    }, [undo, redo]);

    // --- LOAD DATA ---
    useEffect(() => {
        if (mode === 'edit' && billData) {
            setBillMeta({
                customerName: billData.customerName,
                billNumber: billData.billNumber,
                projectId: billData.projectId?._id || billData.projectId,
                projectName: '',
                pdfData: billData.pdfData
            });
            if (billData.layout && billData.layout[0]?.components) {
                const sanitized = billData.layout[0].components.map((c: any) => {
                    if (c.type === 'table' && typeof c.value[0]?.[0] === 'string') {
                        c.value = c.value.map((r: string[]) => r.map(s => ({ content: s, style: {} })));
                    }
                    return c;
                });
                resetHistory(sanitized);
            }
            // If create mode, auto-show templates if empty
        }
        if (mode === 'create' && components.length === 0) setShowTemplates(true);
    }, [billData, mode]);

    // --- ACTIONS ---
    const handleTemplateSelect = (template: any) => {
        setSourceTemplateId(template._id);
        const rawComps = JSON.parse(JSON.stringify(template.layout[0].components));
        const sanitized = rawComps.map((c: any) => {
            if (c.type === 'table' && typeof c.value[0]?.[0] === 'string') {
                c.value = c.value.map((r: string[]) => r.map((s: string) => ({ content: s, style: {} })));
            }
            return c;
        });
        setComponents(sanitized);
        setBillMeta(prev => ({ ...prev, pdfData: template.pdfData || null }));
        setShowTemplates(false);
    };

    const addBlock = (type: any) => {
        const newItem: ComponentItem = { id: generateId(), type, label: type === 'text' ? 'Text' : 'Field', value: type === 'text' ? '' : 'Val', x: 50, y: 50, style: { ...defaultStyle, width: 150, height: 'auto' as any } };
        setComponents(prev => [...prev, newItem]); setSelectedId(newItem.id); setActiveCell(null);
    };

    const addTable = (rows: number, cols: number) => {
        const newItem: ComponentItem = {
            id: generateId(), type: 'table', label: 'Table', value: Array.from({ length: rows }, () => Array(cols).fill({ content: '', style: {} })),
            x: 50, y: 100, style: { ...defaultStyle, width: 400, height: rows * 30 }, columnWidths: Array(cols).fill(100 / cols), rowHeights: Array(rows).fill(30)
        };
        setComponents(prev => [...prev, newItem]); setShowTableGrid(false); setSelectedId(newItem.id);
    };


    // Inside BillNewSingle.tsx

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Create Preview URL for UI
            // We attach the File object to the component value
            // But for rendering, we will use a temporary property or check type

            // TRICK: Store the file in value[0]. 
            // But we need to render it. So we attach previewUrl to the component logic temporarily?
            // Or better: Just store the file. In DraggableBlock, check type.

            // Let's just mix it. 
            // value: [File object with 'preview' property hack]
            const fileWithPreview = Object.assign(file, { preview: URL.createObjectURL(file) });

            const newBlock: ComponentItem = {
                id: generateId(),
                type: 'image',
                label: 'Img',
                value: [fileWithPreview], // Store FILE here
                x: 50,
                y: 50,
                style: { ...defaultStyle, width: 200, height: 200 }
            };
            setComponents(prev => [...prev, newBlock]);
        }
    };

    const updateComp = (id: string, field: string, val: any, isStyle = false) => {
        setComponents(prev => prev.map(c => c.id === id ? (isStyle ? { ...c, style: { ...c.style, [field]: val } } : { ...c, [field]: val }) : c));
    };

    const updateCell = (id: string, r: number, c: number, field: string, val: any) => {
        setComponents(prev => prev.map(comp => {
            if (comp.id !== id) return comp;
            const nv = JSON.parse(JSON.stringify(comp.value));
            nv[r][c].style = { ...nv[r][c].style, [field]: val };
            return { ...comp, value: nv };
        }));
    };

    const handleSave = () => {
        const backendLayout = [{ id: 'main_canvas', name: 'Canvas', order: 0, style: defaultStyle, components }];
        const payload = {
            organizationId: organizationId!,
            projectId: billMeta.projectId || null,
            templateId: sourceTemplateId,
            customerName: billMeta.customerName,
            billNumber: billMeta.billNumber,
            layout: backendLayout,
            initialValues: {}
        };

        if (mode === 'create') createMutation.mutate(payload, { onSuccess: (d) => navigate(`../single/${d.data._id}`, { replace: true }) });
        else updateMutation.mutate({ ...payload, id: id! });
    };

    if (mode === 'edit' && isBillLoading) return <div className="p-10 text-center">Loading...</div>;
    const activeComp = components.find(c => c.id === selectedId);

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* HEADER */}
            <div className="bg-white border-b px-4 py-2 shadow-sm z-30">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left text-gray-500"></i></button>
                        <input className="font-bold text-gray-700 outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 w-48" value={billMeta.customerName} onChange={(e) => setBillMeta({ ...billMeta, customerName: e.target.value })} placeholder="Customer Name" />
                        <select className="text-sm border border-gray-300 rounded px-2 py-1 w-48" value={billMeta.projectId} onChange={(e) => setBillMeta({ ...billMeta, projectId: e.target.value })}>
                            <option value="">Select Project</option>
                            {projects?.map((p: any) => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowTemplates(!showTemplates)}>{showTemplates ? 'Hide' : 'Show'} Templates</Button>
                        <Button onClick={handleSave} isLoading={createMutation.isPending || updateMutation.isPending}>Save Bill</Button>
                    </div>
                </div>

                {/* TOOLBAR */}
                <div className="flex items-center gap-2 border-t pt-2">
                    <button onClick={undo} disabled={!canUndo} className={`btn-tool ${!canUndo ? 'opacity-50' : ''}`} title="Undo (Ctrl+Z)"><i className="fa-solid fa-rotate-left"></i></button>
                    <button onClick={redo} disabled={!canRedo} className={`btn-tool ${!canRedo ? 'opacity-50' : ''}`} title="Redo (Ctrl+Y)"><i className="fa-solid fa-rotate-right"></i></button>
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <button onClick={() => addBlock('text')} className="btn-tool"><i className="fa-solid fa-font"></i> Text</button>
                    <button onClick={() => addBlock('data-field')} className="btn-tool"><i className="fa-solid fa-database"></i> Field</button>
                    <div className="relative">
                        <button onClick={() => setShowTableGrid(!showTableGrid)} className="btn-tool"><i className="fa-solid fa-table"></i> Table</button>
                        {showTableGrid && <TableGridSelector onSelect={addTable} />}
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} className="btn-tool"><i className="fa-regular fa-image"></i> Image</button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                </div>
            </div>

            {/* TEMPLATE DRAWER */}
            {showTemplates && <TemplateDrawer organizationId={organizationId!} onSelect={handleTemplateSelect} onClose={() => setShowTemplates(false)} />}

            {/* CANVAS */}
            <div className="flex-1 bg-gray-200 overflow-auto p-8 relative" onClick={() => { setSelectedId(null); setActiveCell(null); }}>
                <DndContext sensors={sensors} onDragEnd={(e) => {
                    const { active, delta } = e;
                    setComponents(prev => prev.map(c => c.id === active.id ? { ...c, x: c.x + delta.x, y: c.y + delta.y } : c));
                }}>
                    <div className="mx-auto bg-white shadow-2xl relative" style={{ width: 794, minHeight: 1123, height: 'auto' }}>
                        {billMeta.pdfData && <div className="absolute inset-0 z-0 pointer-events-none"><img src={billMeta.pdfData.url} className="w-full h-full opacity-50 object-cover" /></div>}
                        {components.map(comp => (
                            <DraggableBlock
                                key={comp.id}
                                component={comp}
                                isSelected={comp.id === selectedId}
                                activeCell={comp.id === selectedId ? activeCell : null}
                                onClick={() => setSelectedId(comp.id)}
                                onCellSelect={(r: number, c: number) => { setSelectedId(comp.id); setActiveCell({ r, c }); }}
                                onUpdateValue={(val: any) => updateComp(comp.id, 'value', val)}
                                onUpdateMeta={(field: string, val: any) => updateComp(comp.id, field, val, field === 'label' ? false : true)} // Hacky check
                                onResize={(w: number, h: number) => setComponents(prev => prev.map(c => c.id === comp.id ? { ...c, style: { ...c.style, width: w, height: h } } : c))}
                                onDelete={() => { setComponents(prev => prev.filter(c => c.id !== comp.id)); setSelectedId(null); }}
                            />
                        ))}
                    </div>
                </DndContext>
            </div>

            {selectedId && activeComp && (
                <PropertySidebar
                    component={activeComp}
                    activeCell={activeComp.type === 'table' ? activeCell : null}
                    onUpdate={(k: string, v: any, isStyle = false) => updateComp(selectedId, k, v, isStyle)}
                    onUpdateCell={(r: number, c: number, k: string, v: any) => updateCell(selectedId, r, c, k, v)}
                    onDelete={() => { setComponents(prev => prev.filter(c => c.id !== selectedId)); setSelectedId(null); }}
                    onClose={() => setSelectedId(null)}
                />
            )}
        </div>
    );
};


export default BillNewSingle