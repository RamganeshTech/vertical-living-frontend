// ModularUnitCardNew.tsx
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import type { ISelectedUnit } from "../Selected Units New/SelectedModularUnitNew";
import { NO_IMAGE } from "../../../constants/constants";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
interface ModularUnitCardNewProps {
  unit: ISelectedUnit;
  onView: () => void;
  onDelete?: () => void;
  onAddToCart?: (e: React.FormEvent, unit: ISelectedUnit, quantity: number) => void;
  isDeleting?: boolean;
  isCartUpdating?: boolean;
  isProjectDetails?: boolean;
  cartQuantity?: number; // Current quantity in cart for this unit
  isAddingToCart?: boolean;
}

const ModularUnitCardNew = ({
  unit,
  onView,
  onDelete,
  onAddToCart,
  isDeleting = false,
  isCartUpdating = false,
  isProjectDetails = false,
  cartQuantity = 0,
  isAddingToCart = false
}: ModularUnitCardNewProps) => {
 
  const { role, permission } = useAuthCheck();
  const canDelete = role === "owner" || permission?.modularunit?.delete;
  // const canList = role === "owner" || permission?.modularunit?.list;
  const canCreate = role === "owner" || permission?.modularunit?.create;
  const canEdit = role === "owner" || permission?.modularunit?.edit;

  const handleAddToCart = (e: React.FormEvent, quantity: number) => {
    if (onAddToCart) {
      onAddToCart(e, unit, quantity);
    }
  };

  const isInCart = cartQuantity > 0;

  return (
    <Card onClick={onView} className="overflow-hidden  cursor-pointer hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative h-40 bg-gray-100 cursor-pointer" onClick={onView}>
        {unit.productImages && unit.productImages.length > 0 ? (
          <img
            src={unit?.productImages?.length > 0 ? unit?.productImages[0]?.url! : NO_IMAGE}
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

        {/* Cart Badge - Show only in project details when item is in cart */}
        {isProjectDetails && isInCart && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow">
            <i className="fas fa-check-circle mr-1" />
            In Cart ({cartQuantity})
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
          {/* {unit.fabricationCost && (
            <div className="text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded whitespace-nowrap">
              <i className="fas fa-hammer text-orange-600 mr-1" />
              ₹{unit.fabricationCost.toLocaleString()}
            </div>
          )} */}

          {unit.serialNo && (
          <p className="text-[10px] text-gray-500 flex items-center gap-1 pt-2">
            <i className="fas fa-barcode" />
            Unit: <span className="text-gray-900 font-semibold">{unit.serialNo}</span>
          </p>
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
            <div className="flex items-center gap-1 font-semibold text-gray-700">
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
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 flex items-center justify-center">
          <span className="text-2xl font-bold text-green-700 flex items-center gap-1">
            <i className="fas fa-indian-rupee-sign text-lg" />
            {unit.fabricationCost?.toLocaleString('en-IN') || 0}
          </span>
        </div>

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

        {/* Conditional Action Buttons */}
        {isProjectDetails ? (
          // PROJECT DETAILS VIEW - Add to Cart Functionality
          <div className="space-y-2 pt-1">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
              <span className="text-xs font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center gap-2">
                {(canCreate || canEdit ) &&<Button
                  variant="outline"
                  size="sm"
                  // onClick={handleDecrement}
                  onClick={(e) => handleAddToCart(e, cartQuantity - 1)}
                  disabled={cartQuantity <= 0 || isAddingToCart}
                  className="h-7 w-7 p-0"
                >
                  <i className="fas fa-minus text-xs"></i>
                </Button>}
                <span className="font-bold text-gray-900 min-w-[30px] text-center">
                  {isCartUpdating ? <i className="fas fa-spinner animate-spin"></i> : cartQuantity}
                </span>
                {(canCreate || canEdit ) && <Button
                  variant="outline"
                  size="sm"
                  // onClick={handleIncrement}
                  onClick={(e) => handleAddToCart(e, cartQuantity + 1)}
                  disabled={isAddingToCart}
                  className="h-7 w-7 p-0"
                >
                  <i className="fas fa-plus text-xs"></i>
                </Button>}
              </div>
            </div>

            {/* Total Price for Selected Quantity */}
            {cartQuantity > 0 && (
              <div className="bg-blue-50 rounded-lg p-2 flex items-center justify-between">
                <span className="text-xs font-medium text-blue-700">Total:</span>
                <span className="text-sm font-bold text-blue-700">
                  ₹{((unit.fabricationCost * cartQuantity) || 0).toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        ) : (
          // REGULAR VIEW - View and Delete Functionality
          <div className="flex gap-2 pt-1">
           
            {(onDelete && canDelete) && (
              <Button
                variant="danger"
                size="sm"
                isLoading={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                disabled={isDeleting}
              >
                <i className="fas fa-trash mr-1" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModularUnitCardNew;