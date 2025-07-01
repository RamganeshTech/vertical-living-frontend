import { memo } from "react";
import { Card } from "../../../components/ui/Card"; 

type Props = {
  client: any
};

const ClientInfoCard = ({ client }: Props) => {
  return (
    <Card className="p-4 bg-white shadow border-l-4 border-blue-500">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">
        <i className="fa-solid fa-user-tie mr-2" /> Client Info
      </h2>
      <div className="space-y-2 text-sm">
        <Info label="Name" value={client?.clientName} icon="fa-user" />
        <Info label="Email" value={client?.email} icon="fa-envelope" />
        <Info label="WhatsApp" value={client?.whatsapp} icon="fa-phone" />
        <Info label="Location" value={client?.location} icon="fa-location-dot" />
      </div>
    </Card>
  );
};

const Info = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="flex items-center gap-2">
    <i className={`fa-solid ${icon} text-gray-600`} />
    <strong>{label}:</strong> {value || "No data"}
  </div>
);

export default memo(ClientInfoCard);