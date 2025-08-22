// import { useState } from "react";

import { useState } from "react";

// type EditableCellProps = {
//     materialKey: string,
//     formData: FormData;
//     item: string | number | null;
//     inputKey: keyof FormData;
//     handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//     onSave: (key: string) => Promise<any>;
//     handleEdit: (key: string, field: any) => void
// };


// interface FormData {
//     areaSqFt: number;
//     predefinedRate: number;
//     overriddenRate: number | null;
//     profitMargin: number;
// }

// const CostEstimationCell = ({ materialKey, formData, inputKey, item, onSave, handleChange, handleEdit }: EditableCellProps) => {
//     const [editingKey, setEditingKey] = useState<string | null>(null);
//     // const [editing, setEditing] = useState(false);
//     // const [inputValue, setInputValue] = useState(item);
//     const [loading, setLoading] = useState(false);

//     const handleSave = async () => {
//         // if (inputValue === item) {
//         //     console.log("geting insdie it ")
//         //     setEditingKey(null);
//         //     return;
//         // }
//         try {
//             setLoading(true);
//             await onSave(materialKey);
//         } finally {
//             setLoading(false);
//             setEditingKey(null);
//         }
//     };



//     return (
//         <div
//             className="border px-2 py-1 rounded min-h-[32px] cursor-pointer hover:bg-gray-50"
//             onClick={() => {
//                 handleEdit(inputKey, item)
//                 setEditingKey(materialKey)
//             }}
//         >
//             {editingKey === materialKey ? (
//                 <input
//                     className="w-full border px-2 py-1 rounded"
//                     value={editingKey ? formData[inputKey] ?? "" : item ?? ""}
//                     onChange={handleChange}
//                     onBlur={handleSave}
//                     name={inputKey}
//                     onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                             console.log("geting called")
//                             handleSave();
//                         }
//                         if (e.key === "Escape") {
//                             setEditingKey(null);
//                         }
//                     }}
//                     autoFocus
//                 />
//             ) : (
//                 <span className="inline-block w-full">
//                     {loading ? <i className="fa fa-spinner fa-spin text-gray-500" /> : item}
//                 </span>
//             )}
//         </div>
//     );
// };

// export default CostEstimationCell;



export interface MaterialItem {
  key: string;
  areaSqFt: number;
  predefinedRate: number;
  overriddenRate: number | null;
  profitMargin: number;
}

export type EditableField = keyof Omit<MaterialItem, 'key'>;

// Individual cell component
type EditableCellProps = {
  materialKey: string;
  setEditingKey: React.Dispatch<React.SetStateAction<string | null>>,
  fieldKey: EditableField;
  value: string | number | null;
  setFormData:  React.Dispatch<React.SetStateAction<FormData>>,
  originalData: MaterialItem;
  onSave: (materialKey: string, fullRowData: MaterialItem) => Promise<void>;
  formatDisplay?: (value: any) => string;
};

export const CostEstimationCell = ({ 
  materialKey, 
  fieldKey, 
  setEditingKey,
  setFormData,
  value,
  originalData,
  onSave,
  formatDisplay 
}: EditableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>('');
  const [loading, setLoading] = useState(false);

//   const cellId = `${materialKey}-${fieldKey}`;
  
  const startEditing = () => {
       setFormData(prev => ({
      ...prev,
      areaSqFt: originalData.areaSqFt,
      predefinedRate: originalData.predefinedRate,
      overriddenRate: originalData.overriddenRate ?? null,
      profitMargin: originalData.profitMargin ?? 0,
    }));
    setEditValue(value?.toString() || '');
    setEditingKey(materialKey)
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleSave = async () => {
    if (!isEditing) return;

    // Parse the new value based on field type
    let parsedValue: any = editValue;
    
    if (fieldKey === 'areaSqFt' || fieldKey === 'predefinedRate' || fieldKey === 'profitMargin') {
      parsedValue = parseFloat(editValue) || 0;
    } else if (fieldKey === 'overriddenRate') {
      parsedValue = editValue === '' ? null : parseFloat(editValue) || 0;
    }

    // Check if value actually changed
    if (parsedValue === value) {
      cancelEditing();
      return;
    }

    try {
      setLoading(true);
      
      // Create updated row data with the new value
      const updatedRowData = {
        ...originalData,
        [fieldKey]: parsedValue
      };

      setIsEditing(false);
      await onSave(materialKey, updatedRowData);
    } catch (error) {
      console.error('Failed to save:', error);
      // Optionally show error message
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };


  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setEditValue(e.target.value)
          const newVal = fieldKey === "overriddenRate" || fieldKey === "profitMargin"
      ? parseFloat(e.target.value) || 0
      : parseFloat(e.target.value) || 0;

    setFormData(prev => ({
      ...prev,
      [fieldKey]: newVal,
    }));
  }

  const displayValue = formatDisplay ? formatDisplay(value) : (value ?? 'N/A');

  const generateSymbol = (value:string | number)=>{
    const fieldKeys = ["overriddenRate", "predefinedRate" ]
    const percentageField = ["profitMargin"]
    const areaSqFt = "areaSqFt"

    if(displayValue === "N/A"){
        return displayValue
    }


    if(areaSqFt === fieldKey){
      return value
    }
    
    if(fieldKeys.includes(fieldKey)){
        return "₹"+value
    }

    if(percentageField.includes(fieldKey)){
        return value+"%"
    }
  }

  return (


//     <div
//   className={`group border rounded-lg px-3 py-2 min-h-[36px] cursor-pointer transition-all duration-200
//     ${isEditing ? "bg-white shadow-sm" : "hover:bg-gray-50 hover:shadow-sm"}
//   `}
//   onClick={!isEditing ? startEditing : undefined}
// >
//   {isEditing ? (
//     <input
//       className="w-full rounded-md px-3 py-1.5 
//                  focus:outline-none 
                 
//                  text-gray-800 text-sm "
//       value={editValue}
//       onChange={(e) => setEditValue(e.target.value)}
//       onBlur={handleSave}
//       onKeyDown={handleKeyDown}
//       autoFocus
//       disabled={loading}
//     />
//   ) : (
//     <span className="inline-block w-full text-sm text-gray-700 truncate">
//       {loading ? (
//         <i className="fa fa-spinner fa-spin text-gray-500" />
//       ) : (
//         displayValue
//       )}
//     </span>
//   )}
// </div>


<div
  className={`group relative border-none !border-b-1 px-4 py-2  cursor-pointer transition-all duration-200
    ${isEditing ? "bg-white  border-gray-300" : "hover:bg-gray-50 hover:border-gray-300"}
  `}
  onClick={!isEditing ? startEditing : undefined}
>
  {isEditing ? (
    <input
  className={`w-full text-left outline-none  bg-transparent focus:ring-0 appearance-none`}
      value={editValue}
      onChange={handleChange}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      autoFocus
      type="number"
      disabled={loading}
      placeholder="Type and hit Enter..."
    />
  ) : (
    <span className="inline-block w-full text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
      {loading ? (
        <i className="fa fa-spinner fa-spin text-gray-400" />
      ) : (
        <p className="font-medium text-center">{generateSymbol(displayValue)}</p>
      )}
    </span>
  )}
</div>


  );
};


export interface FormData {
  areaSqFt: number;
  predefinedRate: number;
  overriddenRate: number | null;
  profitMargin: number;
}
