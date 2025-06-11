import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "./ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Input } from "./ui/Input"
import { Label } from "./ui/Label"
import { Textarea } from "./ui/TextArea"
import { useCreateOrganization } from "../apiList/orgApi"
import { toast } from "../utils/toast" 

// Import icons
import { FiUpload as Upload, FiX as X,  } from "react-icons/fi"

interface CreateOrganizationFormProps {
  onSuccess?: () => void
}

export default function CreateOrganizationForm({ onSuccess }: CreateOrganizationFormProps) {
  const [formData, setFormData] = useState({
    organizationName: "",
    type: "",
    address: "",
    logoUrl: "",
    organizationPhoneNo: "",
  })
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const createOrganization = useCreateOrganization()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setUploadedFile(file)
        // In a real app, you would upload this file to your server/cloud storage
        // For demo purposes, we'll create a local URL
        const url = URL.createObjectURL(file)
        setFormData((prev) => ({ ...prev, logoUrl: url }))
        toast({
          title: "Success",
          description: "Logo uploaded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        })
      }
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        setUploadedFile(file)
        const url = URL.createObjectURL(file)
        setFormData((prev) => ({ ...prev, logoUrl: url }))
        toast({
          title: "Success",
          description: "Logo uploaded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        })
      }
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setFormData((prev) => ({ ...prev, logoUrl: "" }))
    if (formData.logoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(formData.logoUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.organizationName.trim()) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive",
      })
      return
    }

    try {
      await createOrganization.mutateAsync(formData)
      toast({
        title: "Success",
        description: "Organization created successfully",
      })
      setFormData({
        organizationName: "",
        type: "",
        address: "",
        logoUrl: "",
        organizationPhoneNo: "",
      })
      setUploadedFile(null)
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Create New Organization
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="font-medium">
                Organization Name *
              </Label>
              <Input
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Enter organization name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="font-medium">
                Organization Type
              </Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="e.g., Company, NGO, Startup"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationPhoneNo" className="font-medium">
                Phone Number
              </Label>
              <Input
                id="organizationPhoneNo"
                name="organizationPhoneNo"
                value={formData.organizationPhoneNo}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Organization Logo</Label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : uploadedFile
                      ? "border-green-300 bg-green-50"
                      : "border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={formData.logoUrl || "/placeholder.svg"}
                        alt="Logo preview"
                        className="w-12 h-12 rounded-lg object-cover border border-blue-200"
                      />
                      <div>
                        <p className="text-sm font-medium text-green-700">{uploadedFile.name}</p>
                        <p className="text-xs text-green-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-blue-600 mb-1">Drag & drop your logo here</p>
                    <p className="text-xs text-gray-500 mb-3">or click to browse</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button type="button" variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="font-medium">
              Address
            </Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter organization address"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createOrganization.isPending}>
              {createOrganization.isPending ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
