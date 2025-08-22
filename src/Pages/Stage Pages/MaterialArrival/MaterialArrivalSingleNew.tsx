import type React from "react"

import { useState } from "react"
import { useToggleMaterialVerification } from "../../../apiList/Stage Api/materialArrivalNewApi"
import { Button } from "../../../components/ui/Button"
import { toast } from "../../../utils/toast"
import { NO_IMAGE } from "../../../constants/constants"

interface MaterialArrivalCardProps {
  item: {
    _id: string
    image: {
      url: string
      originalName?: string
    } | null
    quantity: number
    unitName: string
    isVerified: boolean
  }
  projectId: string,
  index: number
}

const MaterialArrivalCard: React.FC<MaterialArrivalCardProps> = ({ item, projectId, index }) => {
  const { mutateAsync: toggleVerification, isPending } = useToggleMaterialVerification()
  const [showImageModal, setShowImageModal] = useState(false)

  const handleToggle = async () => {
    try {
      await toggleVerification({ projectId, unitName: item.unitName, toggle: !item?.isVerified })
      toast({ title: "Success", description: "Verification status updated." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update",
        variant: "destructive",
      })
    }
  }


  // console.log("item", item)

  return (
    <>
      <div
        className={`grid grid-cols-5 gap-4 px-4 py-4 hover:bg-gray-50 transition-colors duration-200 ${
          index % 2 === 0 ? "bg-white" : "bg-gray-25"
        }`}
      >
        {/* Custom ID */}
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold">
              {index + 1}
            </div>
            <span className="font-medium text-gray-800 truncate">{item?.unitName || "N/A"}</span>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center">
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <span className="font-semibold text-gray-700">{item.quantity}</span>
          </div>
        </div>

        {/* Image */}
        <div className="flex items-center">
          {item?.image ? (
            <div className="relative group cursor-pointer" onClick={() => setShowImageModal(true)}>
              <div className="w-45 h-45 border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <img
                  src={item?.image?.url || NO_IMAGE}
                  alt={item.image.originalName || "Material Image"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* <div className="bg-white rounded-full p-2 shadow-lg">
                    <i className="fa-solid fa-expand text-gray-700 text-sm"></i>
                  </div> */}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-45 h-45 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <i className="fa-solid fa-image text-gray-400 text-lg mb-1"></i>
                <p className="text-xs text-gray-400">No Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              item.isVerified
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            <i className={`fa-solid ${item.isVerified ? "fa-check-circle" : "fa-clock"} text-xs`}></i>
            {item.isVerified ? "Verified" : "Pending"}
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center">
          <Button
            onClick={handleToggle}
            disabled={isPending}
            size="sm"
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              item.isVerified
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isPending ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className={`fa-solid ${item.isVerified ? "fa-times" : "fa-check"}`}></i>
            )}
            {item.isVerified ? "Not Confirm" : "Confirm"}
          </Button>
        </div>
      </div>

    {/* Image Modal */}
      {showImageModal && item.image && (
        <div
          className="fixed inset-0 bg-black/70  flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative w-[80vw] h-[80vh] max-w-4xl">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
            >
              <i className="fa-solid fa-times text-2xl"></i>
            </button>
            <img
              src={item?.image?.url || NO_IMAGE}
              alt={item?.image?.originalName || "Material Image"}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black  text-white p-4 rounded-b-lg">
              <p className="text-sm font-medium">{item.image.originalName || "Material Image"}</p>
              <p className="text-xs text-gray-300">Click outside to close</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MaterialArrivalCard
