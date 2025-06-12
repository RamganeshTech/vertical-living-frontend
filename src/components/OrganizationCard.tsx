import { Button } from "./ui/Button"
import { Card, CardContent, CardHeader } from "./ui/Card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/DropdownMenu"
import { Badge } from "./ui/Badge"
import { useDeleteOrganization } from './../apiList/orgApi';
import { toast } from './../utils/toast';

// Import icons
import {
  FiUsers as Users,
  FiMoreVertical as MoreVertical,
  FiEdit as Edit,
  FiTrash2 as Trash2,
  FiUserPlus as UserPlus,
  FiMapPin as MapPin,
  FiPhone as Phone,
} from "react-icons/fi"
import { useNavigate } from "react-router-dom";

interface OrganizationCardProps {
  organization: {
    _id: string
    organizationName: string
    type?: string
    address?: string
    logoUrl?: string
    organizationPhoneNo?: string
    staffCount?: number
  }
}

export default function OrganizationCard({ organization }: OrganizationCardProps) {
  const deleteOrganization = useDeleteOrganization()

  const navigate = useNavigate()

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        await deleteOrganization.mutateAsync(organization._id)
        toast({
          title: "Success",
          description: "Organization deleted successfully",
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete organization",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:bg-white hover:scale-105">
      <CardHeader className="pb-4 bg-gradient-to-br from-blue-50 to-blue-100/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              {organization.logoUrl ? (
                <img
                  src={organization.logoUrl || "/placeholder.svg"}
                  alt={organization.organizationName}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <Users className="w-7 h-7 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-blue-900 text-lg truncate">{organization.organizationName}</h3>
              {organization.type && (
                <Badge variant="default" className="mt-1">
                  {organization.type}
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Staff
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2">
            <p className="text-sm text-gray-600 flex items-start">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
              {organization?.address || "N/A"}
            </p>
          {organization.organizationPhoneNo && (
            <p className="text-sm text-gray-600 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-blue-500" />
              {organization.organizationPhoneNo}
            </p>
          )}
          <div className="flex items-center justify-end pt-3 border-t border-blue-100">
            {/* <div className="flex items-center text-blue-600">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">{organization.staffCount || 0} Staff</span>
            </div> */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/organization/${organization._id}`)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
