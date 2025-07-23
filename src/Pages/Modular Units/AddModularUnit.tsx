"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { modularUnitFieldConfig } from "../../utils/Modular Units/fieldConfigs"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';

import { toast } from "../../utils/toast"
import { useUpdateModularUnit, useCreateModularUnit } from "../../apiList/Modular Unit Api/ModularUnitApi"

type AddModularUnitProps = {
  unitToEdit?: any
  setUnitToEdit?: React.Dispatch<React.SetStateAction<null>>
}

const disallowedKeysForEdit = ["_id", "organizationId", "customId", "images", "createdAt", "updatedAt", "__v"]

export default function AddModularUnit({ unitToEdit, setUnitToEdit }: AddModularUnitProps) {
  const navigate = useNavigate()
  const { organizationId } = useParams() as { organizationId: string }
  const [category, setCategory] = useState<string>(unitToEdit?.category || "showcase")
  const config = modularUnitFieldConfig[category]
  const [formValues, setFormValues] = useState<Record<string, any>>(unitToEdit || {})
  const [files, setFiles] = useState<File[]>([])

  const { mutateAsync: createUnit, isPending: isCreating } = useCreateModularUnit()
  const { mutateAsync: updateUnit, isPending: isUpdating } = useUpdateModularUnit()

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4 block text-center"></i>
          <p className="text-red-600 text-center font-semibold">Invalid unit type selected.</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const sanitizeFormValues = (data: Record<string, any>) => {
    return Object.fromEntries(Object.entries(data).filter(([key]) => !disallowedKeysForEdit.includes(key)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!formValues.name) {
        throw new Error("Name is required")
      }
      if (!formValues.price || formValues.price < 0) {
        throw new Error("Enter valid price")
      }
      const updatedFormValues = { ...formValues, category }

      if (unitToEdit) {
        const sanitized = sanitizeFormValues(updatedFormValues)
        await updateUnit({
          unitId: unitToEdit._id,
          formValues: sanitized,
          unitType: category,
          files,
        })
        toast({ title: "Success", description: "Product updated successfully" })
      } else {
        await createUnit({ organizationId, unitType: category, formValues: updatedFormValues, files })
        toast({ title: "Success", description: "Product added successfully" })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "operation failed",
        variant: "destructive",
      })
    }
  }

  const handleUnitChange = (val: string) => {
    setCategory(val)
    setFormValues({})
    setFiles([])
  }

  const handleCancelUpdate = () => {
    if (setUnitToEdit) {
      setUnitToEdit(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8 sm:py-6 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between sm:gap-4 gap-2">
            <div className="flex items-center sm:gap-4 gap-2">
              <div onClick={() => navigate(-1)} className="flex gap-2 items-center cursor-pointer rounded-full hover:bg-gray-100 p-2">
                <i className="fas fa-arrow-left"></i>
                <p className="">Back</p>
              </div>
              <div className="bg-gradient-to-r  from-blue-600 to-purple-600 p-3 rounded-xl">
                <i className={`fas ${unitToEdit ? "fa-edit" : "fa-plus"} text-white text-xl`}></i>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                  {unitToEdit ? "Edit" : "Add New"} {category} <span className="hidden sm:inline">Unit</span>
                </h1>
                <p className="text-gray-600 mt-1 hidden sm:block">
                  {unitToEdit ? "Update product information" : "Create a new product in your catalog"}
                </p>
              </div>
            </div>

            {!unitToEdit && (
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <label className="font-semibold text-gray-700 flex items-center gap-2">
                  <i className="fas fa-layer-group text-blue-600"></i>
                  Select Unit Type
                </label>
                <Select value={category} onValueChange={handleUnitChange}>
                  <SelectTrigger className="min-w-[200px] bg-white">
                    <SelectValue placeholder="Choose Unit Type" selectedValue={category} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(modularUnitFieldConfig).map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="capitalize">{type}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(config).map(([field, settings]) => {
                if (settings.label === "Budget Range" || settings.label === "Price Range") {
                  return null
                }

                return (
                  <div key={field} className="space-y-2">
                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                      <i className="fas fa-tag text-blue-500"></i>
                      {settings.label}
                      {settings.required && <span className="text-red-500">*</span>}
                    </Label>

                    {settings.type === "text" && (
                      <Input
                        value={formValues[field] || ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        required={settings.required}
                        className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder={`Enter ${settings.label.toLowerCase()}`}
                      />
                    )}

                    {settings.type === "number" && (
                      <Input
                        type="number"
                        value={formValues[field] || ""}
                        onChange={(e) => handleInputChange(field, +e.target.value)}
                        required={settings.required}
                        className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder={`Enter ${settings.label.toLowerCase()}`}
                      />
                    )}

                    {settings.type === "select" && (
                      <Select onValueChange={(val) => handleInputChange(field, val)} value={formValues[field] || ""}>
                        <SelectTrigger className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white">
                          <SelectValue placeholder={`Select ${settings.label}`} selectedValue={formValues[field]} />
                        </SelectTrigger>
                        <SelectContent>
                          {settings.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {settings.type === "checkbox" && (
                      <div className="bg-gray-50 rounded-xl p-4 max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {settings.options?.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-lg p-2 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={formValues[field]?.includes(option) || false}
                                onChange={(e) => {
                                  const checked = e.target.checked
                                  setFormValues((prev) => {
                                    const current = prev[field] || []
                                    return {
                                      ...prev,
                                      [field]: checked
                                        ? [...current, option]
                                        : current.filter((v: string) => v !== option),
                                    }
                                  })
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold flex items-center gap-2">
                  <i className="fas fa-images text-blue-500"></i>
                  Upload Images
                </Label>
                <div className="relative">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {files.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                    <i className="fas fa-check-circle"></i>
                    {files.length} file(s) selected
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {isCreating || isUpdating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className={`fas ${unitToEdit ? "fa-save" : "fa-plus"} mr-2`}></i>
                    {unitToEdit ? "Update Unit" : "Create Unit"}
                  </>
                )}
              </Button>


              {unitToEdit && <Button
                variant="secondary"
                className=" px-12 py-4 rounded-xl text-lg "
                onClick={handleCancelUpdate}>
                Cancel
              </Button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
