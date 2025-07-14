import { useState } from "react";
import { useGetAllUsers } from "../apiList/getAll Users Api/getAllUsersApi";
import { useAssignStaffToStage } from "../apiList/Stage Api/assignStaffApi";
import { toast } from "../utils/toast";
import { Button } from "../components/ui/Button";

export type currentAssignedStaffType ={
   _id: string;
    staffName: string;
     email: string }

interface AssignStageStaffProps {
  stageName: "RequirementFormModel" | "SiteMeasurementModel" | "SampleDesignModel" | "TechnicalConsultationModel" | 
"MaterialRoomConfirmationModel" | "CostEstimation" | "PaymentConfirmationModel" | "OrderingMaterialModel" |
 "MaterialArrivalModel" | "WorkMainStageScheduleModel" | "InstallationModel" | 
"QualityCheckupModel" | "CleaningAndSanitationModel" | "ProjectDeliveryModel" 
  projectId: string;
  organizationId: string;
  currentAssignedStaff: currentAssignedStaffType  | null;
  className?: string
}

export default function AssignStageStaff({
  stageName,
  projectId,
  organizationId,
  currentAssignedStaff,
  className=""
}: AssignStageStaffProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [assigned, setAssigned] = useState(currentAssignedStaff);

  const { data: realStaffList, isLoading } = useGetAllUsers(organizationId, "staff");

  const { mutateAsync: assignStaff } = useAssignStaffToStage();

  // const dummyStaffList = [
  //   { _id: "1", staffName: "John Doe", email: "john@example.com" },
  //   { _id: "2", staffName: "Jane Smith", email: "jane@example.com" },
  //   { _id: "3", staffName: "Bob Johnson", email: "bob@example.com" },
  //   { _id: "4", staffName: "Alice Williams", email: "alice@example.com" },
  //   { _id: "5", staffName: "Tom Brown", email: "tom@example.com" },
  // ];

  const staffList =  realStaffList 

  const handleAssign = async (staff: { _id: string; staffName: string; email: string }) => {
    console.log("staff detials", staff)
    try {
      await assignStaff({
        projectId,
        staffId: staff._id,
        stageName,
      });
      setAssigned(staff);
      toast({
        title: "Success",
        description: `${staff.staffName} assigned to ${stageName}`,
      });
      setIsEditing(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err?.message || "Failed to assign staff",
        variant: "destructive",
      });
    }
  };

  

  return (
    <div className={`relative inline-flex items-center px-2 py-2 sm:py-1 rounded-lg text-sm shadow-sm border-[#92abc4] sm:border-none ${className} `}>
      <div className="flex items-center gap-2">
        <span className="text-gray-700 whitespace-nowrap">
          <span className="font-medium hidden sm:inline text-blue-800">Staff:</span>{" "}
          <span className="font-medium inline sm:hidden text-blue-800">Staff Member:</span>{" "}
          {assigned ? (
            <span className="text-gray-800 font-semibold">{assigned?.staffName}</span>
          ) : (
            <span className="text-gray-400 text-[12px]  italic">Not Assigned</span>
          )}
        </span>

        <Button
          size="sm"
          variant="ghost"
          className="text-blue-600 hover:bg-blue-50 px-2 py-1 text-xs"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <i className="fas fa-xmark text-red-600"></i> : <i className="fas fa-pencil text-blue-600"></i> }
        </Button>
      </div>

      {/* Dropdown */}
      {isEditing && (
        <div className="absolute z-10 top-full left-[0%] sm:left-[-20%] mt-2 w-[200px] bg-white border border-blue-200 rounded-md shadow-lg max-h-48 overflow-auto text-sm">
          {isLoading ? (
            <div className="p-3 text-gray-500 text-center">Loading...</div>
          ) : staffList.length === 0 ? (
            <div className="p-3 text-gray-400 text-center">No staff available</div>
          ) : (
            <ul className="divide-y divide-blue-100 max-h-40 overflow-y-auto custom-scrollbar">
              {staffList?.map((staff:any) => (
                <li
                  key={staff?._id}
                  onClick={() => handleAssign(staff)}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  <span className="font-medium text-blue-700 block truncate">{staff?.staffName || staff?.name }</span>
                  <span className="text-xs text-gray-500 truncate">{staff?.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}