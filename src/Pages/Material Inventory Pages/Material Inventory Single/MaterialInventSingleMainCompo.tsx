import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { NO_IMAGE } from "../../../constants/constants";
import { Badge } from "../../../components/ui/Badge";
import type { EditableFieldKey, Variant } from "./MaterialInventorySingle";
// import { Badge } from "../../../components/ui/badge";


interface EditableField {
  key: string;
  label: string;
  icon: string;
  type?: string;
}

interface MaterialInventSingleMainCompoProps {
  displayValues: any;
  form: any;
  editMode: boolean;
  selectedVariant: Variant | null;
  handleVariantSelect: (variant: Variant) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEdit: () => void;
  editableFields: EditableField[];
  hasVariants: boolean | undefined;
  handleAddToCart: () => void;
  handleUpdateCartQuantity: (value: number) => void;
  handleRemoveFromCart: () => void;
  cartQuantity: number;
  isInCart: boolean;
  selectedProjectId: string;
  addToCartMutation: any;
  updateCartQuantityMutation: any;
  removeFromCartMutation: any;
  projects: any[];
}

const MaterialInventSingleMainCompo: React.FC<MaterialInventSingleMainCompoProps> = ({
  displayValues,
  form,
  editMode,
  selectedVariant,
  handleVariantSelect,
  handleChange,
  handleEdit,
  editableFields,
  hasVariants,
  handleAddToCart,
  handleUpdateCartQuantity,
  handleRemoveFromCart,
  cartQuantity,
  isInCart,
  selectedProjectId,
  addToCartMutation,
  updateCartQuantityMutation,
  removeFromCartMutation,
  projects,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-1">
                           <Card className="overflow-hidden border-2 border-violet-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                               <CardContent className="p-0">
                                   {displayValues?.image ? (
                                       <div className="relative group">
                                           <img
                                               src={displayValues.image}
                                               alt={displayValues.itemCode || "Material"}
                                               className="w-full h-auto object-cover rounded-t-xl"
                                               onError={(e) => {
                                                   (e.target as HTMLImageElement).src = NO_IMAGE;
                                               }}
                                           />
                                           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
                                       </div>
                                   ) : (
                                       <div className="bg-gradient-to-br from-violet-100 to-blue-100 h-80 flex items-center justify-center">
                                           <div className="text-center text-violet-300">
                                               <i className="fas fa-image text-6xl mb-3"></i>
                                               <p className="text-sm">No Image Available</p>
                                           </div>
                                       </div>
                                   )}
   
                                   {/* Variant Selector */}
                                   {hasVariants && (
                                       <div className="p-4 bg-white border-b">
                                           <Label className="text-sm text-gray-600 mb-2 block">Select Color Variant</Label>
                                           <div className="flex gap-2 flex-wrap">
                                               {form.variants?.map((variant:any, index:number) => (
                                                   <button
                                                       key={index}
                                                       onClick={() => handleVariantSelect(variant)}
                                                       className={`px-3 py-2 rounded-lg border-2 transition-all ${selectedVariant?.color === variant.color
                                                           ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                           : 'border-gray-300 hover:border-violet-300'
                                                           }`}
                                                   >
                                                       <div className="flex items-center gap-2">
                                                           <div
                                                               className="w-4 h-4 rounded-full border border-gray-300"
                                                               style={{
                                                                   backgroundColor: variant.color.toLowerCase() === 'white' ? '#ffffff' :
                                                                       variant.color.toLowerCase() === 'gold' ? '#FFD700' :
                                                                           variant.color.toLowerCase() === 'grey' ? '#808080' :
                                                                               variant.color
                                                               }}
                                                           />
                                                           <span className="capitalize text-sm">{variant.color}</span>
                                                       </div>
                                                   </button>
                                               ))}
                                           </div>
                                       </div>
                                   )}
   
                                   <div className="p-6 bg-gradient-to-br from-violet-50 to-blue-50">
                                       <div className="space-y-4">
                                           {displayValues.mrp && (
                                               <div>
                                                   <p className="text-2xl font-bold text-gray-900 mb-3">
                                                       ₹{displayValues.mrp}
                                                       <span className="text-xs font-normal text-gray-500 ml-2">MRP</span>
                                                   </p>
                                               </div>
                                           )}
                                           <div className="space-y-2 text-sm">
                                               {form?.category && (
                                                   <div className="flex items-center justify-between">
                                                       <Label className="text-gray-500">Category</Label>
                                                       <Badge variant="default">
                                                           {form.category}
                                                       </Badge>
                                                   </div>
                                               )}
                                               {displayValues.itemCode && (
                                                   <div className="flex items-center justify-between">
                                                       <Label className="text-gray-500">Code</Label>
                                                       <Badge variant="success" className="font-mono">
                                                           {displayValues.itemCode}
                                                       </Badge>
                                                   </div>
                                               )}
                                               {displayValues.color && (
                                                   <div className="flex items-center justify-between">
                                                       <Label className="text-gray-500">Color</Label>
                                                       <Badge variant="outline" className="capitalize">
                                                           {displayValues.color}
                                                       </Badge>
                                                   </div>
                                               )}
                                           </div>
                                           {/* Cart Actions */}
                                           <div className="pt-4 border-t border-violet-200">
                                               {!isInCart ? (
                                                   // Add to Cart Button
                                                   <Button
                                                       className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
                                                       onClick={handleAddToCart}
                                                       disabled={!selectedProjectId}
                                                       isLoading={addToCartMutation.isPending}
                                                   >
   
   
                                                       <i className="fas fa-shopping-cart mr-2"></i>
                                                       Add to Cart
   
   
                                                   </Button>
                                               ) : (
                                                   // Quantity Controls
                                                   <div className="space-y-3">
                                                       <div className="flex items-center justify-between bg-white rounded-lg p-2">
                                                           <Button
                                                               size="sm"
                                                               variant="outline"
                                                               onClick={() => handleUpdateCartQuantity(-1)}
                                                               disabled={updateCartQuantityMutation.isPending || removeFromCartMutation.isPending}
                                                               className="h-8 w-8 p-0"
                                                           >
                                                               <i className="fas fa-minus"></i>
                                                           </Button>
   
                                                           <div className="flex flex-col items-center">
                                                               <span className="text-xs text-gray-500">Quantity</span>
                                                               <span className="font-bold text-lg">{cartQuantity}</span>
                                                           </div>
   
                                                           <Button
                                                               size="sm"
                                                               variant="outline"
                                                               onClick={() => handleUpdateCartQuantity(1)}
                                                               disabled={updateCartQuantityMutation.isPending}
                                                               className="h-8 w-8 p-0"
                                                           >
                                                               <i className="fas fa-plus"></i>
                                                           </Button>
                                                       </div>
   
                                                       <Button
                                                           variant="danger"
                                                           size="sm"
                                                           className="w-full bg-red-600 text-white"
                                                           onClick={handleRemoveFromCart}
                                                           isLoading={removeFromCartMutation.isPending}
   
                                                       >
   
                                                           <i className="fas fa-trash mr-2"></i>
                                                           Remove from Cart
   
                                                       </Button>
                                                   </div>
                                               )}
   
                                               {/* Show cart info */}
                                               {isInCart && (
                                                   <div className="mt-3 p-2 bg-green-50 rounded-lg">
                                                       <p className="text-xs text-green-700 text-center">
                                                           <i className="fas fa-check-circle mr-1"></i>
                                                           Item in cart for {projects?.find((p: any) => p._id === selectedProjectId)?.projectName}
                                                       </p>
                                                   </div>
                                               )}
                                           </div>
   
                                           {/* View Cart Button */}
                                           {/* {cartData?.items && cartData.items.length > 0 && (
                                               <Button
                                                   variant="outline"
                                                   className="w-full"
                                                   onClick={() => navigate(`/organization/${organizationId}/cart`)}
                                               >
                                                   <i className="fas fa-shopping-bag mr-2"></i>
                                                   View Cart ({cartData.items.length} items)
                                               </Button>
                                           )} */}
                                       </div>
                                   </div>
                               </CardContent>
                           </Card>
                       </div>
   
                       {/* Right Column - Details */}
                       <div className="lg:col-span-2">
                           <Card className="border-2 border-violet-100 shadow-xl">
                               <CardHeader className="bg-gradient-to-r from-violet-50 to-blue-50 border-b-2 border-violet-100">
                                   <CardTitle className="text-2xl text-violet-700 flex items-center gap-2">
                                       <i className="fas fa-info-circle"></i>
                                       Specifications
                                   </CardTitle>
                                   <CardDescription>
                                       {editMode ? "Edit material specifications below" : "Detailed material information"}
                                   </CardDescription>
                               </CardHeader>
                               <CardContent className="p-6">
                                   {editMode ? (
                                       /* Edit Mode */
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                           {editableFields.map((field: any) => (
   
   
                                               <div key={field.key} className="space-y-2">
                                                   <Label htmlFor={field.key} className="flex items-center gap-2 text-violet-700">
                                                       <i className={`fas ${field.icon} text-sm`}></i>
                                                       {field.label}
                                                   </Label>
                                                   <Input
                                                       id={field.key}
                                                       name={field.key}
                                                       type={field.type}
                                                       // value={form[field.key as keyof MaterialSpecification] || ""}
                                                       value={form[field.key as keyof EditableFieldKey] || ""}
                                                       onChange={handleChange}
                                                       placeholder={`Enter ${field.label.toLowerCase()}`}
                                                       className="transition-all duration-200 hover:border-violet-300"
                                                   />
                                               </div>
   
                                           ))}
                                       </div>
                                   ) : (
                                       /* View Mode */
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                           {editableFields.map((field) => {
                                               if (field.key === "Variant") return null
                                               const value = form[field?.key as keyof EditableFieldKey];
                                               if (!value) return null;
   
                                               return (
                                                   <div
                                                       key={field.key}
                                                       className="bg-gradient-to-br from-white to-violet-50 p-4 rounded-xl border border-violet-100 hover:shadow-md transition-all duration-200"
                                                   >
                                                       <div className="flex items-start gap-3">
                                                           <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                               <i className={`fas ${field.icon} text-violet-600`}></i>
                                                           </div>
                                                           <div className="flex-1 min-w-0">
                                                               <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                                   {field.label}
                                                               </p>
                                                               <p className="text-gray-900 font-semibold truncate">
                                                                   {field.key === "mrp" ? `₹${value}` :
                                                                       field.key === "watt" ? `${value}W` : value}
                                                               </p>
                                                           </div>
                                                       </div>
                                                   </div>
                                               );
                                           })}
                                       </div>
                                   )}
   
                                   {/* Variants Display in View Mode */}
                                   {!editMode && hasVariants && (
                                       <div className="mt-8 pt-6 border-t-2 border-violet-100">
                                           <h3 className="text-lg font-semibold text-violet-700 mb-4 flex items-center gap-2">
                                               <i className="fas fa-palette"></i>
                                               Available Variants
                                           </h3>
                                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                               {form.variants?.map((variant:any, index:number) => (
                                                   <div
                                                       key={index}
                                                       className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedVariant?.color === variant.color
                                                           ? 'border-violet-500 bg-violet-50'
                                                           : 'border-gray-200 hover:border-violet-300'
                                                           }`}
                                                       onClick={() => handleVariantSelect(variant)}
                                                   >
                                                       <div className="flex items-center justify-between mb-2">
                                                           <div className="flex items-center gap-2">
                                                               <div
                                                                   className="w-6 h-6 rounded-full border-2 border-gray-300"
                                                                   style={{
                                                                       backgroundColor: variant.color.toLowerCase() === 'white' ? '#ffffff' :
                                                                           variant.color.toLowerCase() === 'gold' ? '#FFD700' :
                                                                               variant.color.toLowerCase() === 'grey' ? '#808080' :
                                                                                   variant.color
                                                                   }}
                                                               />
                                                               <span className="font-semibold capitalize">{variant.color}</span>
                                                           </div>
                                                           {selectedVariant?.color === variant.color && (
                                                               <i className="fas fa-check-circle text-violet-600"></i>
                                                           )}
                                                       </div>
                                                       <p className="text-sm text-gray-600 font-mono">{variant.itemCode}</p>
                                                       <p className="text-lg font-bold text-gray-900 mt-1">₹{variant.mrp}</p>
                                                   </div>
                                               ))}
                                           </div>
                                       </div>
                                   )}
   
                                   {/* Empty State */}
                                   {!editMode && Object.keys(form).filter(key => key !== 'image' && key !== 'variants').length === 0 && (
                                       <div className="text-center py-12">
                                           <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                               <i className="fas fa-inbox text-3xl text-violet-400"></i>
                                           </div>
                                           <p className="text-gray-500">No specifications available</p>
                                           <Button
                                               onClick={handleEdit}
                                               className="mt-4 bg-violet-600 hover:bg-violet-700 text-white"
                                           >
                                               <i className="fas fa-plus mr-2"></i>
                                               Add Specifications
                                           </Button>
                                       </div>
                                   )}
                               </CardContent>
                           </Card>
                       </div>
                   </div>
  );
};

export default MaterialInventSingleMainCompo;
