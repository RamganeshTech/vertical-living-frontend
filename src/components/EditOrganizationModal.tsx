
import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "./ui/Button" 
import { Input } from "./ui/Input" 
import { Label } from "./ui/Label" 
import { useUpdateOrganizationName } from "../apiList/orgApi" 
import { toast } from "../utils/toast" 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';

interface EditOrganizationModalProps {
  isOpen: boolean
  onClose: () => void
  organization: {
    _id: string
    organizationName: string
    type?: string
    address?: string
    logoUrl?: string
    organizationPhoneNo?: string
  }
}

export default function EditOrganizationModal({ isOpen, onClose, organization }: EditOrganizationModalProps) {
  const [organizationName, setOrganizationName] = useState("")
  const updateOrganization = useUpdateOrganizationName()

  useEffect(() => {
    if (isOpen) {
      setOrganizationName(organization.organizationName)
    }
  }, [isOpen, organization.organizationName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!organizationName.trim()) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive",
      })
      return
    }

    try {
      await updateOrganization.mutateAsync({ organizationName })
      toast({
        title: "Success",
        description: "Organization updated successfully",
      })
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update organization",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-blue-900">Edit Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-blue-800">
              Organization Name *
            </Label>
            <Input
              id="organizationName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Enter organization name"
              className="border-blue-200 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-blue-200 text-blue-600">
              Cancel
            </Button>
            <Button type="submit" disabled={updateOrganization.isPending} className="bg-blue-600 hover:bg-blue-700">
              {updateOrganization.isPending ? "Updating..." : "Update Organization"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
