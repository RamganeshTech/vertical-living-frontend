import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    type DragEndEvent,
    useDraggable
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Imports
import {
    useGetTemplateById,
    useUpdateTemplateLayout,
    useCreateNewTemplate
} from '../../../../apiList/Department Api/Accounting Api/billNew_accounting_api/billNewAccountingApi';
import { Button } from '../../../../components/ui/Button';

// --- CUSTOM HOOK: USE UNDO REDO ---
// This replaces the standard useState to add history tracking
function useUndoRedo<T>(initialState: T) {
    // History array
    const [history, setHistory] = useState<T[]>([initialState]);
    // Current pointer in history
    const [index, setIndex] = useState(0);

    // Get current state
    const state = history[index];

    // Wrapper for setState that pushes to history
    // const setState = useCallback((value: T | ((val: T) => T)) => {
    //     setHistory((prevHistory) => {
    //         const currentIndex = index; // Use the state index from closure isn't safe in setState updater, but we use refs or careful logic.
    //         // Actually, let's use the resolved value logic
    //         const current = prevHistory[currentIndex];
    //         const nextState = typeof value === 'function'
    //             ? (value as Function)(current)
    //             : value;

    //         // Simple JSON comparison to avoid pushing identical states (performance)
    //         if (JSON.stringify(current) === JSON.stringify(nextState)) return prevHistory;

    //         // Slice history to remove "future" if we made a change in the "past"
    //         const newHistory = prevHistory.slice(0, currentIndex + 1);
    //         newHistory.push(nextState);

    //         // Limit history size to prevent memory issues (e.g., 50 steps)
    //         if (newHistory.length > 50) newHistory.shift();

    //         return newHistory;
    //     });

    //     // We need to update index *after* history updates. 
    //     // Since setHistory is async, we update index based on the *new* length logic.
    //     // However, cleaner way in React is to rely on the history length change or just update index directly.
    //     setIndex(prev => {
    //         // If we pushed, index is simply +1, but we need to account for slicing.
    //         // To keep it synced, we calculate based on prevHistory in setHistory, 
    //         // but here we just assume valid push.
    //         // A safer way for simple hooks:
    //         return history.length; // This is tricky due to closure staleness.
    //     });
    // }, [history, index]);

    // Fixed SetState Implementation to ensure sync
    const updateState = (value: T | ((val: T) => T)) => {
        const nextState = typeof value === 'function'
            ? (value as Function)(state)
            : value;

        if (JSON.stringify(state) === JSON.stringify(nextState)) return;

        const newHistory = history.slice(0, index + 1);
        newHistory.push(nextState);

        setHistory(newHistory);
        setIndex(newHistory.length - 1);
    };

    const undo = useCallback(() => {
        setIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    const redo = useCallback(() => {
        setHistory((prev) => {
            // We just need the length here, but we aren't changing history
            setIndex((prevIdx) => Math.min(prevIdx + 1, prev.length - 1));
            return prev;
        });
    }, []);

    // Reset history (e.g. when loading from API)
    const reset = (newState: T) => {
        setHistory([newState]);
        setIndex(0);
    };

    return {
        state,
        setState: updateState,
        undo,
        redo,
        canUndo: index > 0,
        canRedo: index < history.length - 1,
        reset
    };
}

// --- TYPES ---

interface ComponentStyle {
    fontSize: number;
    color: string;
    backgroundColor: string;
    fontWeight: string;
    textAlign: string;
    width?: number;
    height?: number;
}

interface TableCellData {
    content: string;
    style?: Partial<ComponentStyle>;
}

interface ComponentItem {
    id: string;
    type: 'text' | 'image' | 'table' | 'data-field';
    label: string;
    value: any;
    x: number;
    y: number;
    style: ComponentStyle;
    columnWidths?: number[];
    rowHeights?: number[];
}

interface TemplateBillSingleProps {
    mode: 'create' | 'edit';
}

// --- UTILS ---
const generateId = () => `blk_${Math.random().toString(36).substr(2, 9)}`;

const defaultStyle: ComponentStyle = {
    fontSize: 12,
    color: '#000000',
    backgroundColor: 'transparent',
    fontWeight: 'normal',
    textAlign: 'left',
    width: 200,
    height: 'auto' as any
};

// --- SUB-COMPONENTS ---

const TableGridSelector = ({ onSelect,  }: { onSelect: (rows: number, cols: number) => void, }) => {
    const [hover, setHover] = useState({ rows: 0, cols: 0 });
    return (
        <div className="absolute top-12 left-0 z-50 bg-white shadow-xl border border-gray-300 p-3 rounded w-48">
            <div className="text-xs font-bold mb-2 text-gray-500">Table {hover.cols}x{hover.rows}</div>
            <div className="grid grid-cols-10 gap-1" onMouseLeave={() => setHover({ rows: 0, cols: 0 })}>
                {Array.from({ length: 50 }).map((_, i) => {
                    const r = Math.floor(i / 10) + 1;
                    const c = (i % 10) + 1;
                    const isActive = r <= hover.rows && c <= hover.cols;
                    return (
                        <div key={i} className={`w-3 h-3 border ${isActive ? 'bg-blue-500 border-blue-600' : 'bg-gray-100 border-gray-300'}`}
                            onMouseEnter={() => setHover({ rows: r, cols: c })} onClick={() => onSelect(r, c)} />
                    );
                })}
            </div>
        </div>
    );
};

const ContextMenu = ({ x, y, actions, onClose }: { x: number, y: number, actions: { label: string, color?: string, action: () => void }[], onClose: () => void }) => {
    useEffect(() => {
        const handleClick = () => onClose();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [onClose]);

    return (
        <div className="fixed z-[9999] bg-white shadow-xl border border-gray-200 rounded py-1 min-w-[180px]" style={{ top: y, left: x }}>
            {actions.map((act, i) => (
                <button key={i} onClick={act.action} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 block ${act.color || 'text-gray-700'}`}>
                    {act.label}
                </button>
            ))}
        </div>
    );
};



// --- UPDATED DRAGGABLE BLOCK ---
// const DraggableBlock = ({ 
//     component, 
//     isSelected, 
//     onClick,
//     onUpdateValue,
//     onUpdateMeta,
//     onResize,
//     onDelete,
//     activeCell,
//     onCellSelect
// }: { 
//     component: ComponentItem; 
//     isSelected: boolean; 
//     onClick: () => void; 
//     onUpdateValue: (val: any) => void;
//     onUpdateMeta: (field: string, val: any) => void;
//     onResize: (w: number, h: number) => void;
//     onDelete: () => void;
//     activeCell?: { r: number, c: number } | null;
//     onCellSelect?: (r: number, c: number) => void;
// }) => {
//     const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//         id: component.id,
//         data: { ...component }
//     });

//     // Store coordinates AND the target row/col that was clicked
//     const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetR: number, targetC: number } | null>(null);

//     const style: React.CSSProperties = {
//         transform: CSS.Translate.toString(transform),
//         position: 'absolute',
//         left: `${component.x}px`,
//         top: `${component.y}px`,
//         width: component.style.width ? `${component.style.width}px` : 'auto',
//         height: component.style.height ? `${component.style.height}px` : 'auto',
//         zIndex: isDragging ? 9999 : (isSelected ? 100 : 1), 
//         fontSize: `${component.style.fontSize}px`,
//         color: component.style.color,
//         fontWeight: component.style.fontWeight as any,
//         textAlign: component.style.textAlign as any,
//         backgroundColor: component.style.backgroundColor,
//     };

//     // --- RESIZERS (Unchanged) ---
//     const handleResizeMouseDown = (e: React.MouseEvent) => {
//         e.stopPropagation(); e.preventDefault();
//         const startX = e.clientX; const startY = e.clientY;
//         const startW = component.style.width || 100; const startH = component.style.height || 100;
//         const onMouseMove = (me: MouseEvent) => {
//             const newW = Math.max(50, startW + (me.clientX - startX));
//             const newH = Math.max(20, startH + (me.clientY - startY));
//             onResize(newW, newH);
//         };
//         const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
//         document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
//     };

//     const handleColResize = (e: React.MouseEvent, colIndex: number) => {
//         e.stopPropagation();
//         const startX = e.clientX;
//         const widths = component.columnWidths || [];
//         const tableWidth = component.style.width || 300;
//         const onMouseMove = (me: MouseEvent) => {
//             const deltaPercent = ((me.clientX - startX) / tableWidth) * 100;
//             const newWidths = [...widths];
//             if (newWidths[colIndex + 1] !== undefined) {
//                 newWidths[colIndex] = Math.max(5, newWidths[colIndex] + deltaPercent);
//                 newWidths[colIndex + 1] = Math.max(5, newWidths[colIndex + 1] - deltaPercent);
//                 onUpdateMeta('columnWidths', newWidths);
//             }
//         };
//         const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
//         document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
//     };

//     const handleRowResize = (e: React.MouseEvent, rowIndex: number) => {
//         e.stopPropagation();
//         const startY = e.clientY;
//         const heights = component.rowHeights || [];
//         const onMouseMove = (me: MouseEvent) => {
//             const newHeights = [...heights];
//             const diff = me.clientY - startY;
//             newHeights[rowIndex] = Math.max(20, (newHeights[rowIndex] || 30) + diff); 
//             onUpdateMeta('rowHeights', newHeights);
//         };
//         const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
//         document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
//     };

//     // --- CONTEXT MENU TRIGGER ---
//     const handleContextMenu = (e: React.MouseEvent, r: number = -1, c: number = -1) => {
//         if(component.type !== 'table') return;
//         e.preventDefault();
//         e.stopPropagation();
//         // Save which cell was right-clicked
//         setContextMenu({ x: e.clientX, y: e.clientY, targetR: r, targetC: c });
//     };

//     // --- TABLE LOGIC (Targeted) ---

//     // 1. Insert Row Below
//     const insertRow = () => {
//         if (!contextMenu) return;
//         const { targetR } = contextMenu;
//         const index = targetR === -1 ? component.value.length : targetR + 1; // Default to end if weird state

//         const val = [...component.value];
//         const cols = val[0] ? val[0].length : 1;

//         // Insert at specific index
//         val.splice(index, 0, Array(cols).fill({ content: '', style: {} }));

//         const h = [...(component.rowHeights || [])];
//         h.splice(index, 0, 30); // Insert default height

//         onUpdateValue(val);
//         onUpdateMeta('rowHeights', h);
//         setContextMenu(null);
//     };

//     // 2. Insert Column Right
//     const insertCol = () => {
//         if (!contextMenu) return;
//         const { targetC } = contextMenu;
//         const index = targetC === -1 ? (component.columnWidths?.length || 1) : targetC + 1;

//         // Add cell to every row at index
//         const val = component.value.map((row: any[]) => {
//             const newRow = [...row];
//             newRow.splice(index, 0, { content: '', style: {} });
//             return newRow;
//         });

//         // Update Widths
//         const w = [...(component.columnWidths || [])];
//         const currentLen = w.length;
//         // We need to squeeze them to fit. Simple logic: Add 10%, shrink others proportionally, or just append.
//         // Let's simpler: Add entry, then re-normalize to 100%
//         w.splice(index, 0, 100 / (currentLen + 1)); // Arbitrary initial width

//         // Normalize so sum is ~100
//         const total = w.reduce((a, b) => a + b, 0);
//         const normalizedW = w.map(x => (x / total) * 100);

//         onUpdateValue(val);
//         onUpdateMeta('columnWidths', normalizedW);
//         setContextMenu(null);
//     };

//     // 3. Delete Specific Row
//     const deleteRow = () => {
//         if (!contextMenu || contextMenu.targetR === -1) return;
//         const { targetR } = contextMenu;

//         const val = [...component.value];
//         if (val.length <= 1) return; // Don't delete last remaining row

//         val.splice(targetR, 1);

//         const h = [...(component.rowHeights || [])];
//         h.splice(targetR, 1);

//         onUpdateValue(val);
//         onUpdateMeta('rowHeights', h);
//         setContextMenu(null);
//     };

//     // 4. Delete Specific Column
//     const deleteCol = () => {
//         if (!contextMenu || contextMenu.targetC === -1) return;
//         const { targetC } = contextMenu;

//         // Check if it's the last column
//         if (component.value[0].length <= 1) return;

//         const val = component.value.map((row: any[]) => {
//             return row.filter((_, i) => i !== targetC);
//         });

//         const w = [...(component.columnWidths || [])];
//         w.splice(targetC, 1);

//         // Re-normalize widths to fill 100%
//         const total = w.reduce((a, b) => a + b, 0);
//         const normalizedW = w.map(x => (x / total) * 100);

//         onUpdateValue(val);
//         onUpdateMeta('columnWidths', normalizedW);
//         setContextMenu(null);
//     };

//     return (
//         <>
//             <div 
//                 ref={setNodeRef} 
//                 style={style}
//                 // Global context menu (fallback)
//                 onContextMenu={(e) => handleContextMenu(e)}
//                 onClick={(e) => { e.stopPropagation(); onClick(); }}
//                 className={`group ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`}
//             >
//                 {/* DRAG HANDLE */}
//                 <div 
//                     {...listeners} {...attributes}
//                     className={`absolute -top-3 -left-3 w-6 h-6 bg-white shadow rounded-full flex items-center justify-center cursor-move z-50 
//                     ${isSelected ? 'flex' : 'hidden group-hover:flex'}`}
//                 >
//                     <i className="fa-solid fa-arrows-up-down-left-right text-xs text-gray-600"></i>
//                 </div>

//                 {component.type === 'text' && (
//                     <textarea 
//                         className="w-full h-full p-1 bg-transparent border-transparent hover:border-dotted hover:border-gray-300 outline-none focus:bg-blue-50/20 cursor-text resize-none overflow-hidden" 
//                         value={component.label}
//                         style={{
//                             fontSize: component.style.fontSize,
//                             fontWeight: component.style.fontWeight as any,
//                             textAlign: component.style.textAlign as any,
//                             color: component.style.color,
//                         }}
//                         onChange={(e) => onUpdateMeta('label', e.target.value)}
//                         onPointerDown={(e) => e.stopPropagation()}
//                     />
//                 )}

//                 {component.type === 'data-field' && (
//                     <div className="flex items-center gap-2 px-2 py-1 border border-dashed border-gray-400 bg-gray-50 w-full h-full overflow-hidden" {...listeners} {...attributes}>
//                         <span className="font-bold text-xs whitespace-nowrap">{component.label}:</span>
//                         <input className="bg-transparent border-b border-gray-300 text-xs w-full outline-none" value={component.value} onChange={(e) => onUpdateValue(e.target.value)} placeholder="Value..." onPointerDown={(e)=>e.stopPropagation()} />
//                     </div>
//                 )}

//                 {component.type === 'image' && (
//                     <div className="w-full h-full bg-gray-100" {...listeners} {...attributes}>
//                         {Array.isArray(component.value) && component.value.length > 0 ? (
//                             <img src={component.value[0]} alt="img" className="w-full h-full block pointer-events-none object-fill" />
//                         ) : (
//                             <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 border border-dashed">No Img</div>
//                         )}
//                     </div>
//                 )}

//                 {component.type === 'table' && Array.isArray(component.value) && (
//                     <div className="w-full h-full flex flex-col relative">
//                         {/* Col Resizers */}
//                         {isSelected && (
//                             <div className="flex w-full h-2 absolute -top-2 left-0 pointer-events-none">
//                                 {component.columnWidths?.map((w, i) => (
//                                     <div key={i} style={{ width: `${w}%` }} className="relative border-r border-gray-300 h-2 pointer-events-auto">
//                                         <div onMouseDown={(e) => handleColResize(e, i)} className="absolute right-[-4px] top-0 w-2 h-4 cursor-col-resize z-50 bg-blue-400 rounded hover:bg-blue-600"></div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                         {/* Row Resizers */}
//                         {isSelected && (
//                             <div className="absolute -left-2 top-0 w-2 h-full flex flex-col pointer-events-none">
//                                 {component.rowHeights?.map((h, i) => (
//                                     <div key={i} style={{ height: `${h}px` }} className="relative border-b border-gray-300 w-2 pointer-events-auto">
//                                         <div onMouseDown={(e) => handleRowResize(e, i)} className="absolute bottom-[-4px] left-0 w-4 h-2 cursor-row-resize z-50 bg-blue-400 rounded hover:bg-blue-600"></div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {/* TABLE STRUCTURE WITH PROPER BORDERS */}
//                         <table className="w-full border-collapse border border-gray-400 table-fixed">
//                             <colgroup>
//                                 {component.columnWidths?.map((w, i) => <col key={i} style={{ width: `${w}%` }} />)}
//                             </colgroup>
//                             <tbody>
//                                 {component.value.map((row: TableCellData[], r: number) => (
//                                     <tr key={r} style={{ height: `${(component.rowHeights && component.rowHeights[r]) || 30}px` }}>
//                                         {row.map((cell: TableCellData, c: number) => {
//                                             const cellStyle = cell.style || {};
//                                             const isActiveCell = activeCell?.r === r && activeCell?.c === c;

//                                             return (
//                                                 <td 
//                                                     key={c} 
//                                                     // Added specific border classes here and border-collapse to parent
//                                                     className={`border border-gray-400 p-0 relative ${isActiveCell ? 'ring-2 ring-inset ring-blue-400 z-10' : ''}`}
//                                                     style={{ backgroundColor: cellStyle.backgroundColor || 'transparent' }}
//                                                     // PASS R & C to Context Menu
//                                                     onContextMenu={(e) => handleContextMenu(e, r, c)}
//                                                 >
//                                                     <textarea 
//                                                         className="w-full h-full p-1 border-none outline-none bg-transparent cursor-text resize-none overflow-hidden whitespace-pre-wrap"
//                                                         style={{
//                                                             fontSize: `${cellStyle.fontSize || component.style.fontSize}px`,
//                                                             color: cellStyle.color || component.style.color,
//                                                             textAlign: (cellStyle.textAlign || component.style.textAlign) as any,
//                                                             fontWeight: (cellStyle.fontWeight || component.style.fontWeight) as any,
//                                                             fontFamily: 'inherit',
//                                                             lineHeight: '1.2'
//                                                         }}
//                                                         value={typeof cell === 'object' ? cell.content : cell}
//                                                         onChange={(e) => {
//                                                             const newVal = JSON.parse(JSON.stringify(component.value));
//                                                             if (typeof newVal[r][c] === 'string') {
//                                                                 newVal[r][c] = { content: e.target.value, style: {} };
//                                                             } else {
//                                                                 newVal[r][c].content = e.target.value;
//                                                             }
//                                                             onUpdateValue(newVal);
//                                                         }}
//                                                         onFocus={() => onCellSelect && onCellSelect(r, c)}
//                                                         onPointerDown={(e) => e.stopPropagation()}
//                                                     />
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 {/* RESIZE HANDLE */}
//                 {isSelected && (
//                     <div 
//                         onMouseDown={handleResizeMouseDown}
//                         onPointerDown={(e) => e.stopPropagation()} 
//                         className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 cursor-nwse-resize rounded-full z-50 border-2 border-white shadow"
//                     ></div>
//                 )}
//             </div>

//             {/* CONTEXT MENU (Updated to use targetR/TargetC) */}
//             {contextMenu && (
//                 <ContextMenu 
//                     x={contextMenu.x} y={contextMenu.y} 
//                     onClose={() => setContextMenu(null)}
//                     actions={[
//                         { label: 'Insert Row Below', action: insertRow, color: 'text-blue-600' },
//                         { label: 'Insert Column Right', action: insertCol, color: 'text-blue-600' },
//                         { label: 'Delete This Row', action: deleteRow, color: 'text-gray-600' },
//                         { label: 'Delete This Column', action: deleteCol, color: 'text-gray-600' },
//                         { label: 'Delete Entire Table', action: onDelete, color: 'text-red-600 font-bold border-t border-gray-200 mt-1 pt-1' }
//                     ]}
//                 />
//             )}
//         </>
//     );
// };

// --- FIXED DRAGGABLE BLOCK ---
const DraggableBlock = ({
    component,
    isSelected,
    onClick,
    onUpdateValue,
    onUpdateMeta,
    onResize,
    onDelete,
    activeCell,
    onCellSelect
}: {
    component: ComponentItem;
    isSelected: boolean;
    onClick: () => void;
    onUpdateValue: (val: any) => void;
    onUpdateMeta: (field: string, val: any) => void;
    onResize: (w: number, h: number) => void;
    onDelete: () => void;
    activeCell?: { r: number, c: number } | null;
    onCellSelect?: (r: number, c: number) => void;
}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: component.id,
        data: { ...component }
    });

    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetR: number, targetC: number } | null>(null);

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        position: 'absolute',
        left: `${component.x}px`,
        top: `${component.y}px`,
        width: component.style.width ? `${component.style.width}px` : 'auto',
        height: component.style.height ? `${component.style.height}px` : 'auto',
        zIndex: isDragging ? 9999 : (isSelected ? 100 : 1),
        fontSize: `${component.style.fontSize}px`,
        color: component.style.color,
        fontWeight: component.style.fontWeight as any,
        textAlign: component.style.textAlign as any,
        backgroundColor: component.style.backgroundColor,
    };

    // --- RESIZERS (Unchanged) ---
    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation(); e.preventDefault();
        const startX = e.clientX; const startY = e.clientY;
        const startW = component.style.width || 100; const startH = component.style.height || 100;
        const onMouseMove = (me: MouseEvent) => {
            const newW = Math.max(50, startW + (me.clientX - startX));
            const newH = Math.max(20, startH + (me.clientY - startY));
            onResize(newW, newH);
        };
        const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    };

    const handleColResize = (e: React.MouseEvent, colIndex: number) => {
        e.stopPropagation();
        const startX = e.clientX;
        const widths = component.columnWidths || [];
        const tableWidth = component.style.width || 300;
        const onMouseMove = (me: MouseEvent) => {
            const deltaPercent = ((me.clientX - startX) / tableWidth) * 100;
            const newWidths = [...widths];
            if (newWidths[colIndex + 1] !== undefined) {
                newWidths[colIndex] = Math.max(5, newWidths[colIndex] + deltaPercent);
                newWidths[colIndex + 1] = Math.max(5, newWidths[colIndex + 1] - deltaPercent);
                onUpdateMeta('columnWidths', newWidths);
            }
        };
        const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    };

    const handleRowResize = (e: React.MouseEvent, rowIndex: number) => {
        e.stopPropagation();
        const startY = e.clientY;
        const heights = component.rowHeights || [];
        const onMouseMove = (me: MouseEvent) => {
            const newHeights = [...heights];
            const diff = me.clientY - startY;
            newHeights[rowIndex] = Math.max(20, (newHeights[rowIndex] || 30) + diff);
            onUpdateMeta('rowHeights', newHeights);
        };
        const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    };

    const handleContextMenu = (e: React.MouseEvent, r: number = -1, c: number = -1) => {
        if (component.type !== 'table') return;
        e.preventDefault(); e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, targetR: r, targetC: c });
    };

    // --- TABLE LOGIC (FIXED) ---

    // 1. Insert Row Below
    const insertRow = () => {
        if (!contextMenu) return;
        const { targetR } = contextMenu;
        const index = targetR === -1 ? component.value.length : targetR + 1;

        // Deep copy current value
        const newVal = JSON.parse(JSON.stringify(component.value));
        const cols = newVal[0] ? newVal[0].length : 1;

        // FIX: Create UNIQUE objects for new cells, don't just reference same object
        const newRow = Array.from({ length: cols }, () => ({ content: '', style: {} }));

        newVal.splice(index, 0, newRow);

        const h = [...(component.rowHeights || [])];
        h.splice(index, 0, 30); // Insert default height

        onUpdateValue(newVal);
        onUpdateMeta('rowHeights', h);
        setContextMenu(null);
    };

    // 2. Insert Column Right
    const insertCol = () => {
        if (!contextMenu) return;
        const { targetC } = contextMenu;
        const index = targetC === -1 ? (component.columnWidths?.length || 1) : targetC + 1;

        const newVal = component.value.map((row: any[]) => {
            const newRow = [...row];
            // Insert unique cell object
            newRow.splice(index, 0, { content: '', style: {} });
            return newRow;
        });

        // Adjust Widths: normalize so we don't break the table
        let w = [...(component.columnWidths || [])];
        w.splice(index, 0, 15); // Add new width
        const total = w.reduce((a, b) => a + b, 0);
        w = w.map(width => (width / total) * 100); // Normalize to 100%

        onUpdateValue(newVal);
        onUpdateMeta('columnWidths', w);
        setContextMenu(null);
    };

    // 3. Delete Specific Row
    const deleteRow = () => {
        if (!contextMenu || contextMenu.targetR === -1) return;
        const { targetR } = contextMenu;

        const val = [...component.value];
        if (val.length <= 1) return;

        val.splice(targetR, 1);

        const h = [...(component.rowHeights || [])];
        h.splice(targetR, 1);

        onUpdateValue(val);
        onUpdateMeta('rowHeights', h);
        setContextMenu(null);
    };

    // 4. Delete Specific Column
    const deleteCol = () => {
        if (!contextMenu || contextMenu.targetC === -1) return;
        const { targetC } = contextMenu;

        if (component.value[0].length <= 1) return;

        const val = component.value.map((row: any[]) => row.filter((_, i) => i !== targetC));

        let w = [...(component.columnWidths || [])];
        w.splice(targetC, 1);

        // Normalize
        const total = w.reduce((a, b) => a + b, 0);
        w = w.map(width => (width / total) * 100);

        onUpdateValue(val);
        onUpdateMeta('columnWidths', w);
        setContextMenu(null);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                // Global context menu check
                onContextMenu={(e) => handleContextMenu(e)}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className={`group ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`}
            >
                {/* DRAG HANDLE */}
                <div
                    {...listeners} {...attributes}
                    className={`absolute -top-3 -left-3 w-6 h-6 bg-white shadow rounded-full flex items-center justify-center cursor-move z-50 
                    ${isSelected ? 'flex' : 'hidden group-hover:flex'}`}
                >
                    <i className="fa-solid fa-arrows-up-down-left-right text-xs text-gray-600"></i>
                </div>

                {component.type === 'text' && (
                    <textarea
                        className="w-full h-full p-1 bg-transparent border-transparent hover:border-dotted hover:border-gray-300 outline-none focus:bg-blue-50/20 cursor-text resize-none overflow-hidden"
                        value={component.label}
                        style={{
                            fontSize: component.style.fontSize,
                            fontWeight: component.style.fontWeight as any,
                            textAlign: component.style.textAlign as any,
                            color: component.style.color,
                        }}
                        onChange={(e) => onUpdateMeta('label', e.target.value)}
                        onPointerDown={(e) => e.stopPropagation()}
                    />
                )}

                {component.type === 'data-field' && (
                    <div className="flex items-center gap-2 px-2 py-1 border border-dashed border-gray-400 bg-gray-50 w-full h-full overflow-hidden" {...listeners} {...attributes}>
                        <span className="font-bold text-xs whitespace-nowrap">{component.label}:</span>
                        <input className="bg-transparent border-b border-gray-300 text-xs w-full outline-none" value={component.value} onChange={(e) => onUpdateValue(e.target.value)} placeholder="Value..." onPointerDown={(e) => e.stopPropagation()} />
                    </div>
                )}

                {/* {component.type === 'image' && (
                    <div className="w-full h-full bg-gray-100" {...listeners} {...attributes}>
                        {Array.isArray(component.value) && component.value.length > 0 ? (
                            <img src={component.value[0]} alt="img" className="w-full h-full block pointer-events-none object-fill" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 border border-dashed">No Img</div>
                        )}
                    </div>
                )} */}

                {component.type === 'image' && (
                    <div className="w-full h-full bg-gray-100">
                        {Array.isArray(component.value) && component.value.length > 0 ? (
                            <img
                                src={
                                    typeof component.value[0] === 'string'
                                        ? component.value[0]
                                        : (component.value[0] as any).preview
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

                        {/* Column Resizers (REVERTED TO RECTANGLES) */}
                        {isSelected && (
                            <div className="flex w-full h-2 absolute -top-2 left-0 pointer-events-none z-20">
                                {component.columnWidths?.map((w, i) => (
                                    <div key={i} style={{ width: `${w}%` }} className="relative border-r border-blue-400 h-2 pointer-events-auto">
                                        {/* Reverted to the rectangle style you wanted */}
                                        <div onMouseDown={(e) => handleColResize(e, i)} className="absolute right-[-4px] top-0 w-2 h-4 cursor-col-resize bg-blue-400 hover:bg-blue-600 rounded-sm z-50"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Row Resizers (REVERTED TO RECTANGLES) */}
                        {isSelected && (
                            <div className="absolute -left-2 top-0 w-2 h-full flex flex-col pointer-events-none z-20">
                                {component.rowHeights?.map((h, i) => (
                                    <div key={i} style={{ height: `${h}px` }} className="relative border-b border-blue-400 w-2 pointer-events-auto">
                                        {/* Reverted to the rectangle style you wanted */}
                                        <div onMouseDown={(e) => handleRowResize(e, i)} className="absolute bottom-[-4px] left-0 w-4 h-2 cursor-row-resize bg-blue-400 hover:bg-blue-600 rounded-sm z-50"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TABLE (FORCED BORDERS) */}
                        <table
                            className="w-full table-fixed"
                            style={{
                                borderCollapse: 'collapse',
                                border: '1px solid #000' // Outer border
                            }}
                        >
                            <colgroup>
                                {component.columnWidths?.map((w, i) => <col key={i} style={{ width: `${w}%` }} />)}
                            </colgroup>
                            <tbody>
                                {component.value.map((row: TableCellData[], r: number) => (
                                    <tr key={r} style={{ height: `${(component.rowHeights && component.rowHeights[r]) || 30}px` }}>
                                        {row.map((cell: TableCellData, c: number) => {
                                            const cellStyle = cell.style || {};
                                            const isActiveCell = activeCell?.r === r && activeCell?.c === c;

                                            return (
                                                <td
                                                    key={c}
                                                    // Explicit styling for borders to guarantee lines show
                                                    style={{
                                                        border: '1px solid #000',
                                                        padding: 0,
                                                        verticalAlign: 'top',
                                                        backgroundColor: cellStyle.backgroundColor || 'transparent',
                                                    }}
                                                    className={`relative ${isActiveCell ? 'ring-2 ring-inset ring-blue-500 z-10' : ''}`}
                                                    onContextMenu={(e) => handleContextMenu(e, r, c)}
                                                >
                                                    <textarea
                                                        className="w-full h-full p-1 border-none outline-none bg-transparent cursor-text resize-none overflow-hidden whitespace-pre-wrap"
                                                        style={{
                                                            fontSize: `${cellStyle.fontSize || component.style.fontSize}px`,
                                                            color: cellStyle.color || component.style.color,
                                                            textAlign: (cellStyle.textAlign || component.style.textAlign) as any,
                                                            fontWeight: (cellStyle.fontWeight || component.style.fontWeight) as any,
                                                            fontFamily: 'inherit',
                                                            lineHeight: '1.2'
                                                        }}
                                                        value={typeof cell === 'object' ? cell.content : cell}
                                                        onChange={(e) => {
                                                            // Use deep copy to avoid mutation issues
                                                            const newVal = JSON.parse(JSON.stringify(component.value));
                                                            if (typeof newVal[r][c] === 'string') {
                                                                newVal[r][c] = { content: e.target.value, style: {} };
                                                            } else {
                                                                newVal[r][c].content = e.target.value;
                                                            }
                                                            onUpdateValue(newVal);
                                                        }}
                                                        onFocus={() => onCellSelect && onCellSelect(r, c)}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* RESIZE HANDLE */}
                {isSelected && (
                    <div
                        onMouseDown={handleResizeMouseDown}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 cursor-nwse-resize rounded-full z-50 border-2 border-white shadow"
                    ></div>
                )}
            </div>

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x} y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    actions={[
                        { label: 'Insert Row Below', action: insertRow, color: 'text-blue-600' },
                        { label: 'Insert Column Right', action: insertCol, color: 'text-blue-600' },
                        { label: 'Delete This Row', action: deleteRow, color: 'text-gray-600' },
                        { label: 'Delete This Column', action: deleteCol, color: 'text-gray-600' },
                        { label: 'Delete Entire Table', action: onDelete, color: 'text-red-600 font-bold border-t border-gray-200 mt-1 pt-1' }
                    ]}
                />
            )}
        </>
    );
};


// --- PROPERTY SIDEBAR (Updated with BG and Cell Styles) ---
const PropertySidebar = ({
    component,
    activeCell,
    onUpdate,
    onUpdateCell,
    onDelete,
    onClose
}: {
    component: ComponentItem,
    activeCell?: { r: number, c: number } | null,
    onUpdate: Function,
    onUpdateCell: Function,
    onDelete: Function,
    onClose: () => any
}) => {

    const renderStyleControls = (
        fontSize: number,
        color: string,
        backgroundColor: string,
        fontWeight: string,
        textAlign: string,
        onChange: (key: string, val: any) => void,
        labelPrefix: string = ""
    ) => (
        <div className="space-y-2 p-3 bg-gray-50 rounded border border-gray-200">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase">{labelPrefix} Styling</h4>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <span className="text-[10px] text-gray-400">Size</span>
                    <input type="number" className="w-full border p-1 text-xs rounded" value={fontSize || 12} onChange={(e) => onChange('fontSize', Number(e.target.value))} />
                </div>
                <div className="relative">
                    <span className="text-[10px] text-gray-400">Text</span>
                    <div className="flex items-center border p-1 rounded bg-white h-7">
                        <input type="color" className="w-full h-full border-none p-0 bg-transparent cursor-pointer" value={color || '#000000'} onChange={(e) => onChange('color', e.target.value)} />
                    </div>
                </div>
                <div className="relative">
                    <span className="text-[10px] text-gray-400">BG Color</span>
                    <div className="flex items-center border p-1 rounded bg-white h-7">
                        <input type="color" className="w-full h-full border-none p-0 bg-transparent cursor-pointer" value={backgroundColor || '#ffffff'} onChange={(e) => onChange('backgroundColor', e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="flex gap-1">
                <button onClick={() => onChange('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold')} className={`flex-1 border p-1 rounded text-xs ${fontWeight === 'bold' ? 'bg-blue-100 text-blue-600' : 'bg-white'}`}><i className="fa-solid fa-bold"></i></button>
                <button onClick={() => onChange('textAlign', 'left')} className={`flex-1 border p-1 rounded text-xs ${textAlign === 'left' ? 'bg-blue-100 text-blue-600' : 'bg-white'}`}><i className="fa-solid fa-align-left"></i></button>
                <button onClick={() => onChange('textAlign', 'center')} className={`flex-1 border p-1 rounded text-xs ${textAlign === 'center' ? 'bg-blue-100 text-blue-600' : 'bg-white'}`}><i className="fa-solid fa-align-center"></i></button>
                <button onClick={() => onChange('textAlign', 'right')} className={`flex-1 border p-1 rounded text-xs ${textAlign === 'right' ? 'bg-blue-100 text-blue-600' : 'bg-white'}`}><i className="fa-solid fa-align-right"></i></button>
            </div>
        </div>
    );

    let cellStyle: Partial<ComponentStyle> = {};
    if (component.type === 'table' && activeCell && component.value[activeCell.r] && component.value[activeCell.r][activeCell.c]) {
        cellStyle = component.value[activeCell.r][activeCell.c].style || {};
    }

    return (
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-50 fixed right-0 top-16 bottom-0" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <span className="font-bold text-xs uppercase text-gray-600">Properties</span>
                <button onClick={onClose}><i className="fa-solid fa-xmark text-gray-400"></i></button>
            </div>
            <div className="p-4 space-y-6 overflow-y-auto flex-1">
                {component.type === 'text' && <div><label className="text-xs font-bold text-gray-400 mb-1 block">Text Content</label><textarea className="w-full border p-2 text-sm rounded" rows={3} value={component.label} onChange={(e) => onUpdate('label', e.target.value)} /></div>}
                {component.type === 'data-field' && <div><label className="text-xs font-bold text-gray-400 mb-1 block">Config</label><input className="w-full border p-2 text-sm rounded mb-2" placeholder="Label" value={component.label} onChange={(e) => onUpdate('label', e.target.value)} /><input className="w-full border p-2 text-sm rounded" placeholder="Default Value" value={component.value} onChange={(e) => onUpdate('value', e.target.value)} /></div>}

                {/* CELL STYLES */}
                {component.type === 'table' && activeCell && (
                    <div className="mb-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-xs font-bold text-green-600">Selected Cell ({activeCell.r + 1}, {activeCell.c + 1})</span>
                        </div>
                        {renderStyleControls(
                            cellStyle.fontSize || component.style.fontSize,
                            cellStyle.color || component.style.color,
                            cellStyle.backgroundColor || 'transparent',
                            cellStyle.fontWeight || component.style.fontWeight,
                            cellStyle.textAlign || component.style.textAlign,
                            (key, val) => onUpdateCell(activeCell.r, activeCell.c, key, val),
                            "Cell"
                        )}
                        <hr className="my-4 border-gray-200" />
                    </div>
                )}

                {/* GLOBAL STYLES */}
                {renderStyleControls(
                    component.style.fontSize,
                    component.style.color,
                    component.style.backgroundColor,
                    component.style.fontWeight,
                    component.style.textAlign,
                    (key, val) => onUpdate(key, val, true),
                    "Global / Block"
                )}

                <hr />
                <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-[10px]">X</span> <input type="number" className="w-full border p-1 text-sm" value={Math.round(component.x)} readOnly /></div>
                    <div><span className="text-[10px]">Y</span> <input type="number" className="w-full border p-1 text-sm" value={Math.round(component.y)} readOnly /></div>
                </div>
                <button onClick={() => onDelete()} className="w-full mt-6 bg-red-50 text-red-600 py-2 rounded border border-red-200 text-sm">Delete Block</button>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
export const TemplateBillSingle: React.FC<TemplateBillSingleProps> = ({ mode }) => {
    const navigate = useNavigate();
    const { id, organizationId } = useParams<{ id?: string; organizationId: string }>();
    const { data: specificData } = useGetTemplateById({ id: id || '', organizationId: organizationId! });

    const createMutation = useCreateNewTemplate();
    const updateMutation = useUpdateTemplateLayout();

    // --- REPLACED STATE WITH UNDO/REDO HOOK ---
    const {
        state: components = [], // Default to empty array
        setState: setComponents,
        undo,
        redo,
        canUndo,
        canRedo,
        reset: resetHistory
    } = useUndoRedo<ComponentItem[]>([]);

    const [templateName, setTemplateName] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeCell, setActiveCell] = useState<{ r: number, c: number } | null>(null);
    const [showTableGrid, setShowTableGrid] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    // KEYBOARD SHORTCUTS FOR UNDO/REDO
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    // INITIAL DATA LOAD
    useEffect(() => {
        if (mode === 'create') {
            setTemplateName('');
            resetHistory([]); // Clear history for new template
        }
        else if (specificData) {
            setTemplateName(specificData.templateName);
            if (specificData.layout && specificData.layout[0]?.components) {
                const loadedComps = specificData.layout[0].components;
                const sanitized = loadedComps.map((c: any) => {
                    if (c.type === 'table' && Array.isArray(c.value) && typeof c.value[0]?.[0] === 'string') {
                        c.value = c.value.map((row: string[]) => row.map(str => ({ content: str, style: {} })));
                    }
                    return c;
                });
                // Use Reset to avoid setting initial load as an "undoable" action
                resetHistory(sanitized);
            }
        }
    }, [specificData, mode]);

    const addBlock = (type: 'text' | 'data-field') => {
        const newBlock: ComponentItem = {
            id: generateId(), type, label: type === 'text' ? 'Text' : 'Field', value: type === 'text' ? '' : 'Val',
            x: 50, y: 50 + (components.length * 20),
            style: { ...defaultStyle, width: 150, height: 'auto' as any }
        };
        setComponents((prev) => [...prev, newBlock]); setSelectedId(newBlock.id); setActiveCell(null);
    };

    const addTable = (rows: number, cols: number) => {
        const tableData = Array.from({ length: rows }, () => Array(cols).fill({ content: '', style: {} }));
        const initialWidths = Array(cols).fill(100 / cols);
        const initialHeights = Array(rows).fill(30);
        const newBlock: ComponentItem = {
            id: generateId(), type: 'table', label: 'Table', value: tableData,
            x: 50, y: 100, columnWidths: initialWidths, rowHeights: initialHeights,
            style: { ...defaultStyle, width: 400, height: rows * 30 }
        };
        setComponents((prev) => [...prev, newBlock]); setShowTableGrid(false); setSelectedId(newBlock.id); setActiveCell(null);
    };

    // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files[0]) {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             const newBlock: ComponentItem = {
    //                 id: generateId(), type: 'image', label: 'Img', value: [reader.result],
    //                 x: 50, y: 50, style: { ...defaultStyle, width: 200, height: 200 }
    //             };
    //             setComponents((prev) => [...prev, newBlock]);
    //         };
    //         reader.readAsDataURL(e.target.files[0]);
    //     }
    // };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Store File object + Add Preview property hack
            const fileWithPreview = Object.assign(file, { preview: URL.createObjectURL(file) });

            const newBlock: ComponentItem = {
                id: generateId(),
                type: 'image',
                label: 'Img',
                value: [fileWithPreview], // Store raw File here
                x: 50,
                y: 50,
                style: { ...defaultStyle, width: 200, height: 200 }
            };
            setComponents(prev => [...prev, newBlock]);
        }
    };



    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        setComponents((prev) => prev.map(comp => {
            if (comp.id === active.id) {
                return { ...comp, x: comp.x + delta.x, y: comp.y + delta.y };
            }
            return comp;
        }));
    };

    const handleResize = (id: string, w: number, h: number) => {
        setComponents((prev) => prev.map(comp =>
            comp.id === id ? { ...comp, style: { ...comp.style, width: w, height: h } } : comp
        ));
    };

    const updateSelectedBlock = (field: string, value: any, isStyle = false) => {
        if (!selectedId) return;
        setComponents((prev) => prev.map(comp => {
            if (comp.id !== selectedId) return comp;
            if (isStyle) return { ...comp, style: { ...comp.style, [field]: value } };
            return { ...comp, [field]: value };
        }));
    };

    const updateSelectedCell = (r: number, c: number, field: string, value: any) => {
        if (!selectedId) return;
        setComponents((prev) => prev.map(comp => {
            if (comp.id !== selectedId) return comp;
            if (comp.type !== 'table') return comp;
            const newVal = JSON.parse(JSON.stringify(comp.value));
            if (newVal[r] && newVal[r][c]) {
                newVal[r][c].style = { ...newVal[r][c].style, [field]: value };
            }
            return { ...comp, value: newVal };
        }));
    };

    const handleSave = () => {
        if (!templateName.trim()) return alert("Name required");
        const backendLayout = [{
            id: 'main_canvas', name: 'Canvas', order: 0, style: defaultStyle, components: components
        }];
        const payload = { organizationId: organizationId!, templateName, layout: backendLayout };
        if (mode === 'create') createMutation.mutate(payload);
        else updateMutation.mutate({ ...payload, id: id! });
    };

    const activeComp = components.find(c => c.id === selectedId);

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* TOOLBAR */}
            <div className="h-14 bg-white border-b flex items-center justify-between px-4 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left text-gray-500"></i></button>
                    <input className="font-bold text-gray-700 outline-none" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template Name" />
                </div>
                <div className="flex gap-2">
                    <button onClick={undo} disabled={!canUndo} className={`btn-tool ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`} title="Undo (Ctrl+Z)"><i className="fa-solid fa-rotate-left"></i></button>
                    <button onClick={redo} disabled={!canRedo} className={`btn-tool ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`} title="Redo (Ctrl+Y)"><i className="fa-solid fa-rotate-right"></i></button>
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <button onClick={() => addBlock('text')} className="btn-tool"><i className="fa-solid fa-font"></i> Text</button>
                    <button onClick={() => addBlock('data-field')} className="btn-tool"><i className="fa-solid fa-database"></i> Field</button>
                    <div className="relative">
                        <button onClick={() => setShowTableGrid(!showTableGrid)} className="btn-tool"><i className="fa-solid fa-table"></i> Table</button>
                        {showTableGrid && <TableGridSelector onSelect={addTable}  />}
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} className="btn-tool"><i className="fa-regular fa-image"></i> Image</button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                </div>
                <Button onClick={handleSave} isLoading={createMutation.isPending || updateMutation.isPending}>Save Template</Button>
            </div>

            {/* CANVAS */}
            <div className="flex-1 bg-gray-200 overflow-auto p-8 relative" onClick={() => { setSelectedId(null); setActiveCell(null); }}>
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <div className="mx-auto bg-white shadow-2xl relative" style={{ width: 794, minHeight: 1123, height: 'auto' }}>
                        {components.map(comp => (
                            <DraggableBlock
                                key={comp.id}
                                component={comp}
                                isSelected={comp.id === selectedId}
                                activeCell={comp.id === selectedId ? activeCell : null}
                                onClick={() => setSelectedId(comp.id)}
                                onCellSelect={(r, c) => { setSelectedId(comp.id); setActiveCell({ r, c }); }}
                                onUpdateValue={(val) => setComponents((prev) => prev.map(c => c.id === comp.id ? { ...c, value: val } : c))}
                                onUpdateMeta={(field, val) => setComponents((prev) => prev.map(c => c.id === comp.id ? { ...c, [field]: val } : c))}
                                onResize={(w, h) => handleResize(comp.id, w, h)}
                                onDelete={() => { setComponents((prev) => prev.filter(c => c.id !== comp.id)); setSelectedId(null); setActiveCell(null); }}
                            />
                        ))}
                    </div>
                </DndContext>
            </div>
            {selectedId && activeComp && (
                <PropertySidebar
                    component={activeComp}
                    activeCell={activeComp.type === 'table' ? activeCell : null}
                    onUpdate={updateSelectedBlock}
                    onUpdateCell={updateSelectedCell}
                    onDelete={() => { setComponents((prev) => prev.filter(c => c.id !== selectedId)); setSelectedId(null); }}
                    onClose={() => setSelectedId(null)}
                />
            )}
        </div>
    );
};

// const btnToolClass = "px-3 py-1 bg-gray-50 border rounded hover:bg-blue-50 text-sm flex items-center gap-2 text-gray-700";

export default TemplateBillSingle