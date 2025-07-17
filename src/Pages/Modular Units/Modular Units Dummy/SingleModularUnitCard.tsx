"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../../components/ui/Button" 
import { toast } from "../../../utils/toast" 
import { useDeleteModularUnit } from "../../../apiList/Modular Unit Api/ModularUnitApi"

type SingleModularUnitCardProp = {
  unit: any
  onEdit?: (unit: any) => void
}

const SingleModularUnitCard: React.FC<SingleModularUnitCardProp> = ({ unit, onEdit }) => {
  const [imageError, setImageError] = useState(false)
  const { mutateAsync: deleteUnit, isPending: isDeleting } = useDeleteModularUnit()

  const handleDelete = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this unit?")) return
      await deleteUnit({
        unitId: unit._id,
        unitType: unit.unitType,
        organizationId: unit.organizationId,
      })
      toast({ title: "Success", description: "Product deleted successfully" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to delete",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {unit.images?.[0]?.url && !imageError ? (
          <img
            src={unit.images[0].url || "/placeholder.svg"}
            alt={unit.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-image text-gray-400 text-3xl mb-2"></i>
              <p className="text-gray-500 text-sm">No Image</p>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            {/* <button className="bg-white/90 text-gray-700 hover:bg-white p-2 rounded-lg shadow-lg transform hover:scale-110 transition-all">
              <i className="fas fa-eye text-sm"></i>
            </button> */}
            {/* {onEdit && (
              <button
                onClick={() => onEdit(unit)}
                className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-lg shadow-lg transform hover:scale-110 transition-all"
              >
                <i className="fas fa-edit text-sm"></i>
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 p-2 rounded-lg shadow-lg transform hover:scale-110 transition-all disabled:opacity-50"
            >
              <i className={`fas ${isDeleting ? "fa-spinner fa-spin" : "fa-trash"} text-sm`}></i>
            </button> */}
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
            {unit?.category }
          </span>
        </div>

        {/* Price Badge */}
        {unit.price && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
              <i className="fas fa-rupee-sign"></i>
              {unit.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {unit.name || "Unnamed Product"}
        </h3>

        {/* ID */}
        <div className="flex items-center gap-2 mb-3">
          <i className="fas fa-hashtag text-gray-400 text-xs"></i>
          <p className="text-xs text-gray-500 font-mono truncate">{unit.customId || unit._id}</p>
        </div>

        {/* Details Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <i className="fas fa-tag text-blue-500 text-xs"></i>
              Category
            </span>
            <span className="font-medium text-gray-900 capitalize truncate ml-2">{unit.unitType || "N/A"}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <i className="fas fa-rupee-sign text-green-500 text-xs"></i>
              Price
            </span>
            <span className="font-bold text-green-600">₹{unit.price?.toLocaleString() || "N/A"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onEdit && (
            <Button
              onClick={() => onEdit(unit)}
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 py-2 px-3 rounded-lg transition-all text-sm"
            >
              <i className="fas fa-edit mr-1"></i>
              Edit
            </Button>
          )}
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 py-2 px-3 rounded-lg transition-all disabled:opacity-50 text-sm"
          >
            <i className={`fas ${isDeleting ? "fa-spinner fa-spin" : "fa-trash"} mr-1`}></i>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SingleModularUnitCard
