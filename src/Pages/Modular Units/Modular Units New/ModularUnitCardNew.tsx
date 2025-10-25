
// import { Card, CardContent } from "../../../components/ui/Card";
// import { Button } from "../../../components/ui/Button";

// interface ModularUnitCardNewProps {
//   unit: any;
//   onView: () => void;
//   onDelete: () => void;
//   isDeleting: boolean;
// }

// const ModularUnitCardNew = ({ unit, onView, onDelete, isDeleting }: ModularUnitCardNewProps) => {
//   return (
//     <Card className="overflow-hidden hover:shadow-lg transition-shadow">
//       {/* Product Image */}
//       <div className="relative h-48 bg-gray-100 cursor-pointer" onClick={onView}>
//         {unit.productImages && unit.productImages.length > 0 ? (
//           <img
//             src={unit.productImages[0].url}
//             alt={unit.productName}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-400">
//             <i className="fas fa-image text-4xl" />
//           </div>
//         )}
//         {/* Category Badge */}
//         {unit.category && (
//           <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium text-gray-700 shadow">
//             <i className="fas fa-tag mr-1" />
//             {unit.category}
//           </div>
//         )}
//       </div>

//       <CardContent className="p-4 space-y-3">
//         {/* Product Name */}
//         <h3 
//           className="font-semibold text-lg text-gray-800 truncate cursor-pointer hover:text-blue-600"
//           onClick={onView}
//         >
//           {unit.productName || "Untitled Product"}
//         </h3>

//         {/* Serial Number */}
//         {unit.serialNo && (
//           <p className="text-xs text-gray-500 flex items-center gap-1">
//             <i className="fas fa-barcode" />
//             Serial: {unit.serialNo}
//           </p>
//         )}

//         {/* Dimensions (MUST) */}
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <i className="fas fa-ruler-combined text-gray-500" />
//           <span className="font-medium">Dimensions:</span>
//           <span>
//             {unit.dimention?.height || 0} × {unit.dimention?.width || 0} × {unit.dimention?.depth || 0} cm
//           </span>
//         </div>

//         {/* Price (MUST) */}
//         <div className="flex items-center justify-between">
//           <span className="text-xl font-bold text-gray-900 flex items-center gap-1">
//             <i className="fas fa-indian-rupee-sign text-lg" />
//             {unit.price?.toLocaleString() || 0}
//           </span>
//         </div>

//         {/* Time Required (MUST) */}
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <i className="fas fa-clock text-gray-500" />
//           <span className="font-medium">Time:</span>
//           <span>{unit.timeRequired || 0} days</span>
//         </div>

//         {/* Optional: Total Area */}
//         {unit.totalAreaSqFt && (
//           <div className="text-sm text-gray-600 flex items-center gap-2">
//             <i className="fas fa-expand text-gray-500" />
//             Area: {unit.totalAreaSqFt} sq ft
//           </div>
//         )}

//         {/* Optional: Fabrication Cost */}
//         {unit.fabricationCost && (
//           <div className="text-sm text-gray-600 flex items-center gap-2">
//             <i className="fas fa-hammer text-gray-500" />
//             Fabrication: ₹{unit.fabricationCost.toLocaleString()}
//           </div>
//         )}

//         {/* Optional: Attributes */}
//         {unit.attributes && unit.attributes.length > 0 && (
//           <div className="flex flex-wrap gap-1">
//             {unit.attributes.slice(0, 3).map((attr: string, idx: number) => (
//               <span
//                 key={idx}
//                 className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded flex items-center gap-1"
//               >
//                 <i className="fas fa-star text-[10px]" />
//                 {attr}
//               </span>
//             ))}
//             {unit.attributes.length > 3 && (
//               <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
//                 +{unit.attributes.length - 3}
//               </span>
//             )}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-2 pt-2">
//           <Button variant="outline" className="flex-1" onClick={onView}>
//             <i className="fas fa-eye mr-2" />
//             View
//           </Button>
//           <Button
//             variant="danger"
//             isLoading={isDeleting}
//             className="flex-1 bg-red-600 hover:bg-red-700 text-white"
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete();
//             }}
//           >
//             <i className="fas fa-trash mr-2" />
//             Delete
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ModularUnitCardNew;



import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

interface ModularUnitCardNewProps {
  unit: any;
  onView: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const ModularUnitCardNew = ({ unit, onView, onDelete, isDeleting }: ModularUnitCardNewProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative h-40 bg-gray-100 cursor-pointer" onClick={onView}>
        {unit.productImages && unit.productImages.length > 0 ? (
          <img
            src={unit.productImages[0].url}
            alt={unit.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <i className="fas fa-image text-3xl" />
          </div>
        )}
        {/* Category Badge */}
        {unit.category && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700 shadow">
            <i className="fas fa-tag mr-1 text-blue-600" />
            {unit.category}
          </div>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Product Name & Fabrication Cost */}
        <div className="flex items-start justify-between gap-2">
          <h3 
            className="font-semibold text-base text-gray-800 line-clamp-1 cursor-pointer hover:text-blue-600 flex-1"
            onClick={onView}
            title={unit.productName}
          >
            {unit.productName || "Untitled Product"}
          </h3>
          {unit.fabricationCost && (
            <div className="text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded whitespace-nowrap">
              <i className="fas fa-hammer text-orange-600 mr-1" />
              ₹{unit.fabricationCost.toLocaleString()}
            </div>
          )}
        </div>

        {/* Time & Area Row */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <i className="fas fa-clock text-blue-500" />
            <span className="font-medium">{unit.timeRequired || 0} days</span>
          </div>
          {unit.totalAreaSqFt && (
            <div className="flex items-center gap-1">
              <i className="fas fa-expand text-green-500" />
              <span className="font-medium">{unit.totalAreaSqFt} sq ft</span>
            </div>
          )}
        </div>

        {/* Dimensions - Compact with Labels */}
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-600">
              <i className="fas fa-ruler-combined text-purple-500 text-sm" />
              <span className="font-medium">Dimensions:</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-gray-700">
              <span className="flex items-center gap-0.5">
                <span className="text-[10px] text-gray-500">H:</span>
                {unit.dimention?.height || 0}
              </span>
              <span className="text-gray-400">×</span>
              <span className="flex items-center gap-0.5">
                <span className="text-[10px] text-gray-500">W:</span>
                {unit.dimention?.width || 0}
              </span>
              <span className="text-gray-400">×</span>
              <span className="flex items-center gap-0.5">
                <span className="text-[10px] text-gray-500">D:</span>
                {unit.dimention?.depth || 0}
              </span>
              <span className="text-[10px] text-gray-500">mm</span>
            </div>
          </div>
        </div>

        {/* Price - Prominent */}
        {/* <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 flex items-center justify-center">
          <span className="text-2xl font-bold text-green-700 flex items-center gap-1">
            <i className="fas fa-indian-rupee-sign text-lg" />
            {unit.price?.toLocaleString('en-IN') || 0}
          </span>
        </div> */}

        {/* Attributes */}
        {unit.attributes && unit.attributes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {unit.attributes.slice(0, 3).map((attr: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full font-medium"
              >
                {attr}
              </span>
            ))}
            {unit.attributes.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full font-medium">
                +{unit.attributes.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Serial Number (if exists) */}
        {unit.serialNo && (
          <p className="text-[10px] text-gray-500 flex items-center gap-1 border-t pt-2">
            <i className="fas fa-barcode" />
            SN: {unit.serialNo}
          </p>
        )}

        {/* Action Buttons - Compact */}
        <div className="flex gap-2 pt-1">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-xs py-1.5" 
            onClick={onView}
          >
            <i className="fas fa-eye mr-1" />
            View
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1.5"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <i className="fas fa-trash mr-1" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModularUnitCardNew;