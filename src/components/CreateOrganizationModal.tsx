
import type React from "react"

import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Label } from "./ui/Label"
import { Textarea } from "./ui/TextArea"
import { useCreateOrganization } from "../apiList/orgApi"
import { toast } from "../utils/toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';

interface CreateOrganizationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateOrganizationModal({ isOpen, onClose }: CreateOrganizationModalProps) {
  const [formData, setFormData] = useState({
    organizationName: "",
    type: "",
    address: "",
    logoUrl: "",
    organizationPhoneNo: "",
  })

  const createOrganization = useCreateOrganization()

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
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create organization",
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-4 custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-blue-900">Create New Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-blue-800">
              Organization Name *
            </Label>
            <Input
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="Enter organization name"
              className="border-blue-200 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-blue-800">
              Type
            </Label>
            <Input
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="e.g., Company, NGO, Startup"
              className="border-blue-200 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationPhoneNo" className="text-blue-800">
              Phone Number
            </Label>
            <Input
              id="organizationPhoneNo"
              name="organizationPhoneNo"
              value={formData.organizationPhoneNo}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="border-blue-200 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-blue-800">
              Address
            </Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter organization address"
              className="border-blue-200 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl" className="text-blue-800">
              Logo URL
            </Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              placeholder="Enter logo URL"
              className="border-blue-200 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-blue-200 text-blue-600">
              Cancel
            </Button>
            <Button type="submit" disabled={createOrganization.isPending} className="bg-blue-600 hover:bg-blue-700">
              {createOrganization.isPending ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
