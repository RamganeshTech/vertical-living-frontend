// import { memo } from "react";
// import { Card } from "../../../components/ui/Card"; 

// type Props = {
//   client: any
//   className:string
// };

// const ClientInfoCard = ({ client , className }: Props) => {
//   return (
//     <Card className={` ${className} p-4 bg-white shadow border-l-4 border-blue-500`}>
//       <h2 className="text-lg font-semibold text-blue-700 mb-4">
//         <i className="fa-solid fa-user-tie mr-2" /> Client Info
//       </h2>
//       <div className="space-y-2 text-sm">
//         <Info label="Name" value={client?.clientName} icon="fa-user" />
//         <Info label="Email" value={client?.email} icon="fa-envelope" />
//         <Info label="WhatsApp" value={client?.whatsapp} icon="fa-phone" />
//         <Info label="Location" value={client?.location} icon="fa-location-dot" />
//       </div>
//     </Card>
//   );
// };

// const Info = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
//   <div className="flex items-center gap-2">
//     <i className={`fa-solid ${icon} text-gray-600`} />
//     <strong>{label}:</strong> {value || "N/A"}
//   </div>
// );

// export default memo(ClientInfoCard);









import { useState, memo, useEffect } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
// import { useUpdateClientInfoRequirement } from "../../../apiList/Requirement/requirementApi"; // Adjust path
import { toast } from "../../../utils/toast";
import { useUpdateClientInfoRequirement } from "../../../apiList/Stage Api/requirementFormApi";

type Props = {
  client: any;
  projectId: string;
  className: string;
};

const ClientInfoCard = ({ client, projectId, className }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(client);

  const { mutateAsync: updateClient, isPending } = useUpdateClientInfoRequirement();

  // Sync local state if client prop updates from parent
  useEffect(() => {
    setLocalData(client);
  }, [client]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // The controller expects { clientData: { ... } } inside the payload
      await updateClient({
        projectId,
        payload: { clientData: localData },
      });
      setIsEditing(false);
      toast({ title: "Success", description: "Client info updated" });
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message || "Update failed", 
        variant: "destructive" 
      });
    }
  };

  return (
    <Card className={`${className} p-5 bg-white shadow border-l-4 border-blue-500`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-700">
          <i className="fa-solid fa-user-tie mr-2" /> Client Info
        </h2>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <i className="fa-solid fa-pen-to-square mr-1" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} isLoading={isPending}>
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {!isEditing ? (
          <div className="space-y-2 text-sm">
            <Info label="Name" value={localData?.clientName} icon="fa-user" />
            <Info label="Email" value={localData?.email} icon="fa-envelope" />
            <Info label="WhatsApp" value={localData?.whatsapp} icon="fa-phone" />
            <Info label="Location" value={localData?.location} icon="fa-location-dot" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-[10px] uppercase font-bold text-gray-400">Client Name</Label>
              <Input name="clientName" value={localData?.clientName || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-gray-400">Email</Label>
              <Input type="email" name="email" value={localData?.email || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-gray-400">WhatsApp Number</Label>
              <Input name="whatsapp" value={localData?.whatsapp || ""} onChange={handleInputChange} maxLength={10} />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-gray-400">Location</Label>
              <Input name="location" value={localData?.location || ""} onChange={handleInputChange} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const Info = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="flex items-center gap-2">
    <i className={`fa-solid ${icon} text-gray-400 w-4`} />
    <strong className="text-gray-600">{label}:</strong> <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

export default memo(ClientInfoCard);