
import React, { useRef, useEffect, useState } from 'react';
import { ORDERMATERIAL_UNIT_OPTIONS } from '../OrderMaterialOverview';
import { Button } from '../../../../components/ui/Button';
import SearchSelectCombo from '../../../../components/ui/SearchSelectCombo';

interface SearchSelectComboOption {
    _id: string | number;
    value: string;
}

const MATERIAL_OPTIONS = [
    "Cement", "Steel Rods", "Bricks", "Sand", "Gravel", "Concrete Mix",
    "Paint", "Wood Planks", "Tiles", "Glass", "Nails", "Screws"
];

interface ExcelLikeRowProps {
    item?: any;
    isNewRow?: boolean;
    newRowData?: any;
    setNewRowData?: (data: any) => void;
    editingCell?: { subItemId: string; field: string } | null;
    setEditingCell?: (cell: { subItemId: string; field: string } | null) => void;
    onSave?: (subItemId: string, field: string, value: any) => void;
    onNewRowSave?: (data: any) => void;
    onDelete?: (subItemId: string) => void;
    isDeleting?: boolean;
    isAdding?: boolean;
}

const ExcelLikeRow: React.FC<ExcelLikeRowProps> = ({
    item,
    isNewRow = false,
    newRowData,
    setNewRowData,
    editingCell,
    setEditingCell,
    onSave,
    onNewRowSave,
    onDelete,
    isDeleting,
    isAdding
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Local state for editing to prevent premature API calls
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingCell]);

    if (isNewRow) {
        return (
            <div className="grid grid-cols-17 gap-0 bg-green-50 border-b border-gray-100">
                {/* Ref ID */}
                <div className="col-span-3 border-r border-gray-200 px-4 py-3 text-gray-400 text-sm">
                    Auto
                </div>

                {/* Material Name */}
                <div className="col-span-8 border-r border-gray-200">
                    <SearchSelectComboWrapper
                        value={newRowData?.name || ''}
                        options={MATERIAL_OPTIONS}
                        placeholder="Enter material name..."
                        onChange={(value) => {
                            // Only update state, don't save yet
                            setNewRowData?.({ ...newRowData, name: value });
                        }}
                        onSelectOption={(value) => {
                            // When option is selected from dropdown
                            setNewRowData?.({ ...newRowData, name: value });
                            if (newRowData?.unit) {
                                onNewRowSave?.({ ...newRowData, name: value });
                            }
                        }}
                        onEnter={() => {
                            // When Enter is pressed
                            if (newRowData?.name?.trim() && newRowData?.unit) {
                                onNewRowSave?.(newRowData);
                            }
                        }}
                    />
                </div>

                {/* Quantity */}
                <div className="col-span-2 border-r border-gray-200">
                    <input
                        type="number"
                        placeholder="Qty"
                        min="0"
                        value={newRowData?.quantity || 1}
                        onChange={(e) => {
                            setNewRowData?.({
                                ...newRowData,
                                quantity: Number(e.target.value) || 1
                            });
                        }}
                        className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                    />
                </div>

                {/* Unit */}
                <div className="col-span-3 border-r border-gray-200">
                    <SearchSelectComboWrapper
                        value={newRowData?.unit || ''}
                        options={ORDERMATERIAL_UNIT_OPTIONS}
                        placeholder="Select unit..."
                        onChange={(value) => {
                            // Only update state
                            setNewRowData?.({ ...newRowData, unit: value });
                        }}
                        onSelectOption={async (value) => {
                            // When option is selected
                            const updatedRow = { ...newRowData, unit: value };
                            setNewRowData?.(updatedRow);
                            
                            if (updatedRow.name?.trim()) {
                                await onNewRowSave?.(updatedRow);
                            }
                        }}
                        onEnter={async () => {
                            // When Enter is pressed
                            if (newRowData?.name?.trim() && newRowData?.unit) {
                                await onNewRowSave?.(newRowData);
                            }
                        }}
                    />
                </div>

                {/* Action */}
                <div className="col-span-1 flex items-center justify-center">
                    {isAdding && <i className="fas fa-spinner fa-spin text-green-600"></i>}
                </div>
            </div>
        );
    }

    // Existing Row
    return (
        <div className="grid grid-cols-17 gap-0 border-b border-gray-100 hover:bg-gray-50">
            {/* Ref ID */}
            <div className="col-span-3 border-r border-blue-200 px-4 py-3 text-sm text-gray-600">
                {item?.refId || "N/A"}
            </div>

            {/* Material Name */}
            <div className="col-span-8 border-r border-blue-200">
                {editingCell?.subItemId === item._id && editingCell?.field === 'name' ? (
                    <SearchSelectComboWrapper
                        value={editValue || item.subItemName}
                        options={MATERIAL_OPTIONS}
                        onChange={(value) => {
                            // Just update local state while typing
                            setEditValue(value);
                        }}
                        onSelectOption={(value) => {
                            // Save when option is selected
                            onSave?.(item._id, 'name', value);
                            setEditingCell?.(null);
                            setEditValue('');
                        }}
                        onEnter={() => {
                            // Save on Enter
                            onSave?.(item._id, 'name', editValue || item.subItemName);
                            setEditingCell?.(null);
                            setEditValue('');
                        }}
                        onBlur={() => {
                            setEditingCell?.(null);
                            setEditValue('');
                        }}
                        autoFocus
                    />
                ) : (
                    <div
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => {
                            setEditingCell?.({ subItemId: item._id, field: 'name' });
                            setEditValue(item.subItemName);
                        }}
                    >
                        {item.subItemName}
                    </div>
                )}
            </div>

            {/* Quantity */}
            <div className="col-span-2 border-r border-blue-200">
                {editingCell?.subItemId === item._id && editingCell?.field === 'quantity' ? (
                    <input
                        ref={inputRef}
                        type="number"
                        defaultValue={item.quantity}
                        min="0"
                        className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                        onBlur={(e) => {
                            onSave?.(item._id, 'quantity', e.target.value);
                            setEditingCell?.(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSave?.(item._id, 'quantity', e.currentTarget.value);
                                setEditingCell?.(null);
                            }
                            if (e.key === 'Escape') {
                                setEditingCell?.(null);
                            }
                        }}
                    />
                ) : (
                    <div
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => setEditingCell?.({ subItemId: item._id, field: 'quantity' })}
                    >
                        {item.quantity}
                    </div>
                )}
            </div>

            {/* Unit */}
            <div className="col-span-3 border-r border-blue-200">
                {editingCell?.subItemId === item._id && editingCell?.field === 'unit' ? (
                    <SearchSelectComboWrapper
                        value={editValue || item.unit}
                        options={ORDERMATERIAL_UNIT_OPTIONS}
                        onChange={(value) => {
                            setEditValue(value);
                        }}
                        onSelectOption={(value) => {
                            onSave?.(item._id, 'unit', value);
                            setEditingCell?.(null);
                            setEditValue('');
                        }}
                        onEnter={() => {
                            onSave?.(item._id, 'unit', editValue || item.unit);
                            setEditingCell?.(null);
                            setEditValue('');
                        }}
                        onBlur={() => {
                            setEditingCell?.(null);
                            setEditValue('');
                        }}
                        autoFocus
                    />
                ) : (
                    <div
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => {
                            setEditingCell?.({ subItemId: item._id, field: 'unit' });
                            setEditValue(item.unit);
                        }}
                    >
                        {item.unit}
                    </div>
                )}
            </div>

            {/* Delete */}
            <div className="col-span-1 flex items-center justify-center">
                <Button
                    variant="danger"
                    onClick={() => onDelete?.(item._id)}
                    disabled={isDeleting}
                    className="p-2 bg-red-600 text-white hover:bg-red-700 rounded transition-colors disabled:opacity-50"
                    title="Delete item"
                >
                    {isDeleting ? (
                        <i className="fas fa-spinner fa-spin text-sm"></i>
                    ) : (
                        <i className="fa fa-trash text-sm"></i>
                    )}
                </Button>
            </div>
        </div>
    );
};

// Wrapper component
const SearchSelectComboWrapper: React.FC<{
    value: string;
    options: string[];
    placeholder?: string;
    onChange: (value: string) => void;
    onSelectOption?: (value: string) => void; // ✅ New prop for selection
    onBlur?: () => void;
    onEnter?: () => void;
    autoFocus?: boolean;
}> = ({ value, options, placeholder, onChange, onSelectOption, onBlur, onEnter, autoFocus }) => {
    
    const handleChange = (newValue: string | SearchSelectComboOption | null) => {
        if (typeof newValue === 'string') {
            onChange(newValue);
        } else if (newValue && typeof newValue === 'object') {
            onChange(newValue.value);
        } else if (newValue === null) {
            onChange('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onEnter?.();
        }
    };

    return (
        <div className="w-full">
            <SearchSelectCombo
                label=""
                name="field"
                value={value}
                onChange={handleChange}
                onSelectOption={onSelectOption} // ✅ Pass through
                options={options}
                mode="simple"
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                onBlur={onBlur}
                autoFocus={autoFocus}
            />
        </div>
    );
};

export default ExcelLikeRow;