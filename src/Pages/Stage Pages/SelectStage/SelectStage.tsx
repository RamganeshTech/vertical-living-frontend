import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { toast } from "../../../utils/toast"
import {
  useGetStageSelection,
  useUpsertStageSelection,
} from "../../../apiList/Modular Unit Api/Stage Selection Api/stageSelectionApi"
import { Card, CardContent } from "../../../components/ui/Card"

import { useState } from "react"
import { Button } from "../../../components/ui/Button" 
import type { ProjectDetailsOutlet } from "../../../types/types"

export default function SelectStage() {
  const { projectId, organizationId } = useParams()
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()

  const navigate = useNavigate()
  const { data: selectedStage, isLoading, refetch } = useGetStageSelection(projectId!)
  const { mutateAsync, isPending } = useUpsertStageSelection()

  // Local state for two-step selection
  const [currentSelection, setCurrentSelection] = useState<"Modular Units" | "Manual Flow" | null>(null)

  const handleCardSelect = (mode: "Modular Units" | "Manual Flow") => {
    if (isPending) return
    setCurrentSelection(mode)
  }

  const handleConfirmSelection = async () => {
    if (!currentSelection || isPending) return

    try {
      const data = await mutateAsync({ projectId: projectId!, mode: currentSelection })
      toast({ title: "Success", description: `${currentSelection} has been selected.` })
      refetch()
      if (data === "Manual Flow") {
        navigate(`/${organizationId}/projectdetails/${projectId}/materialselection`)
      } else if (data === "Modular Units") {
        navigate(`/${organizationId}/projectdetails/${projectId}/modularunits`)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update stage selection",
        variant: "destructive",
      })
    }
  }

  const isConfirmed = (mode: string) => selectedStage?.mode === mode
  const isCurrentlySelected = (mode: string) => currentSelection === mode

  const stageOptions = [
    {
      id: "Modular Units",
      title: "Modular Units",
      description: "Streamlined approach with pre-configured units and standardized pricing",
      icon: "fas fa-cube",
      colorClass: "bg-blue-500",
      features: ["Pre-defined unit pricing", "Quick configuration", "Standardized components", "skips 2 stages"],
      badge: "Recommended",
    },
    {
      id: "Manual Flow",
      title: "Manual Flow",
      description: "Complete customization with detailed material selection and cost estimation",
      icon: "fas fa-sliders-h",
      colorClass: "bg-purple-500",
      features: ["Full customization", "Material selection", "Cost estimation", "Detailed configuration"],
      badge: "Advanced",
    },
  ]

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="min-h-full p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
            {isMobile && (
              <button
                onClick={openMobileSidebar}
                className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                title="Open Menu"
              >
                <i className="fa-solid fa-bars"></i>
              </button>
            )}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6">
              <i className="fas fa-layer-group text-2xl text-slate-700" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Select Your Project Stage</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the approach that best fits your project requirements and timeline
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-2xl text-slate-600 mb-4" />
                <p className="text-slate-600">Loading stage selection...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-12">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-start sm:items-center sm:space-x-4">
                  <div className="flex items-center ">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <span className="sm:ml-2 text-sm font-medium text-slate-700">Stage Selection</span>
                  </div>
           {isMobile ?  <i className="mx-auto fas fa-arrow-down text-slate-400" /> : <i className="mx-auto fas fa-arrow-right text-slate-400" /> }
                  <div className="flex items-center sm:ml-2">
                    <div className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <span className="ml-2 text-sm font-medium text-slate-500">Configuration</span>
                  </div>
           {isMobile ?  <i className="mx-auto fas fa-arrow-down text-slate-400" /> : <i className="mx-auto fas fa-arrow-right text-slate-400" /> }
                  <div className="flex items-center sm:ml-2">
                    <div className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <span className="ml-2 text-sm font-medium text-slate-500">Implementation</span>
                  </div>
                </div>
              </div>

              {/* Selection Instructions */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-info-circle" />
                  <span>Step 1: Select an option below, then confirm your choice</span>
                </div>
              </div>

              {/* Stage Options */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {stageOptions.map((option) => {
                  const confirmed = isConfirmed(option.id)
                  const selected = isCurrentlySelected(option.id)

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleCardSelect(option.id as "Modular Units" | "Manual Flow")}
                      className={`cursor-pointer transition-all duration-300 hover:-translate-y-1 relative ${
                        isPending ? "pointer-events-none opacity-75" : ""
                      }`}
                    >
                      <Card
                        className={`overflow-hidden border-2 transition-all duration-300 ${
                          confirmed
                            ? "border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200"
                            : selected
                              ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                              : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                        }`}
                      >
                        {/* Status Indicators */}
                        <div className="absolute top-4 right-4 z-10">
                          {confirmed && (
                            <div className="flex items-center space-x-1 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              <i className="fas fa-check" />
                              <span>Confirmed</span>
                            </div>
                          )}
                          {selected && !confirmed && (
                            <div className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              <i className="fas fa-hand-pointer" />
                              <span>Selected</span>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-8">
                          <div className="flex items-start space-x-4 mb-6">
                            <div
                              className={`w-12 h-12 ${option.colorClass} rounded-lg flex items-center justify-center transition-all duration-300 ${
                                selected || confirmed ? "scale-110 shadow-lg" : ""
                              }`}
                            >
                              <i className={`${option.icon} text-white text-xl`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3
                                  className={`text-xl font-semibold transition-colors duration-300 ${
                                    confirmed ? "text-green-800" : selected ? "text-blue-800" : "text-slate-900"
                                  }`}
                                >
                                  {option.title}
                                </h3>
                                {/* <Badge variant="secondary" className="text-xs">
                                  {option.badge}
                                </Badge> */}
                              </div>
                              <p
                                className={`leading-relaxed transition-colors duration-300 ${
                                  confirmed ? "text-green-700" : selected ? "text-blue-700" : "text-slate-600"
                                }`}
                              >
                                {option.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4
                              className={`text-sm font-semibold mb-3 transition-colors duration-300 ${
                                confirmed ? "text-green-800" : selected ? "text-blue-800" : "text-slate-700"
                              }`}
                            >
                              Key Features:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {option.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                                      confirmed ? "bg-green-500" : selected ? "bg-blue-500" : "bg-slate-400"
                                    }`}
                                  />
                                  <span
                                    className={`text-sm transition-colors duration-300 ${
                                      confirmed ? "text-green-700" : selected ? "text-blue-700" : "text-slate-600"
                                    }`}
                                  >
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Selection Status */}
                          {confirmed && (
                            <div className="mt-6 p-3 bg-green-100 rounded-lg border border-green-200">
                              <p className="text-sm text-green-800 font-medium">
                                <i className="fas fa-check-circle mr-2" />
                                This option is currently active
                              </p>
                            </div>
                          )}

                          {selected && !confirmed && (
                            <div className="mt-6 p-3 bg-blue-100 rounded-lg border border-blue-200">
                              <p className="text-sm text-blue-800 font-medium">
                                <i className="fas fa-hand-pointer mr-2" />
                                Click "Confirm Selection" below to proceed
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>

              {/* Confirmation Section */}
              {currentSelection && (
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200 mb-8">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      <i className="fas fa-check-double mr-2 text-blue-600" />
                      Confirm Your Selection
                    </h3>
                    <p className="text-slate-600 mb-4">
                      You have selected <span className="font-semibold text-blue-600">{currentSelection}</span>. Click
                      confirm to proceed to the next stage.
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        onClick={() => setCurrentSelection(null)}
                        variant="outline"
                        disabled={isPending}
                        className="px-6"
                      >
                        <i className="fas fa-times mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleConfirmSelection}
                        disabled={isPending}
                        className="px-6 bg-blue-600 hover:bg-blue-700"
                      >
                        {isPending ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check mr-2" />
                            Confirm Selection
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Help Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  <i className="fas fa-question-circle mr-2 text-blue-500" />
                  Need help choosing?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">
                      <i className="fas fa-cube mr-2 text-blue-500" />
                      Choose Modular Units if:
                    </h4>
                    <ul className="space-y-1 ml-6">
                      <li>• You want to get started quickly</li>
                      <li>• Standard configurations meet your needs</li>
                      <li>• You prefer predictable pricing</li>
                      <li>• You can skip 2 stages</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">
                      <i className="fas fa-sliders-h mr-2 text-purple-500" />
                      Choose Manual Flow if:
                    </h4>
                    <ul className="space-y-1 ml-6">
                      <li>• You need complete customization</li>
                      <li>• You want detailed cost breakdowns</li>
                      <li>• You have specific material requirements</li>
                      <li>• You prefer granular control</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Loading Overlay */}
              {isPending && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                    <i className="fas fa-spinner fa-spin text-blue-600 text-xl" />
                    <span className="text-slate-700 font-medium">Processing your selection...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}


