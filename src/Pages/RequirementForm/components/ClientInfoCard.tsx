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
    // <Card className={`${className} p-5 bg-white shadow border-l-4 border-blue-500`}>

    <Card className={`${className} p-5 bg-brand-surface  shadow-sm border-2 border-ash-medium rounded-xl`}>
      {/* <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-700">
          <i className="fa-solid fa-user-tie mr-2" /> Client Info
        </h2> */}

      <div className="flex justify-between items-center mb-5 pb-3 border-b border-ash-light">
        <h2 className="text-sm font-bold text-text-main uppercase tracking-wide flex items-center">
          <i className="fa-regular fa-address-card mr-2 text-text-muted text-base" /> Client Info
        </h2>

        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-text-muted hover:text-action-primary transition-colors"
          >
            <i className="fa-solid fa-pen-to-square sm:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="text-text-muted hover:text-text-main hover:bg-brand-ash h-8 px-3 transition-colors"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              isLoading={isPending}
              variant="dark"
              className="h-8 px-4 shadow-sm"
            >
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
              <Label className="text-[10px] uppercase font-bold text-text-muted">Client Name</Label>
              <Input name="clientName" value={localData?.clientName || ""} onChange={handleInputChange}
                // className="bg-gray-50/10 border-gray-200 focus:ring-gray-200 focus:border-gray-300 text-gray-800"
                className="bg-transparent border-0 border-b border-ash-light !rounded-none focus:ring-0 focus:border-ash-dark text-text-main px-0 transition-all "

              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-text-muted">Email</Label>
              <Input type="email" name="email" value={localData?.email || ""} onChange={handleInputChange}
                // className="bg-gray-50/10 border-ash-light focus:ring-gray-200 focus:border-gray-300 text-gray-800"
                className="bg-transparent border-0 border-b border-ash-light !rounded-none focus:ring-0 focus:border-ash-dark text-text-main px-0 transition-all "

              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-text-muted">WhatsApp Number</Label>
              <Input name="whatsapp" value={localData?.whatsapp || ""} onChange={handleInputChange} maxLength={10}
                // className="bg-gray-50/10 border-ash-light focus:ring-gray-200 focus:border-gray-300 text-gray-800"
                className="bg-transparent border-0 border-b border-ash-light !rounded-none focus:ring-0 focus:border-ash-dark text-text-main px-0 transition-all "
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-text-muted">Location</Label>
              <Input name="location" value={localData?.location || ""} onChange={handleInputChange}
                // className="bg-gray-50/10 border-ash-light focus:ring-gray-200 focus:border-gray-300 text-gray-800"
                className="bg-transparent border-0 border-b border-ash-light !rounded-none focus:ring-0 focus:border-ash-dark text-text-main px-0 transition-all "

              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const Info = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="flex items-center gap-2">
    <i className={`fa-solid ${icon} text-text-muted w-4`} />
    <strong className="text-text-muted">{label}:</strong> <span className="text-text-main">{value || "N/A"}</span>
  </div>
);

export default memo(ClientInfoCard);