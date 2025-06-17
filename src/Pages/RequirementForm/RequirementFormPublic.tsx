import React, { useState, memo } from "react";
import { useParams } from "react-router-dom";
import KitchenSectionPublic from "./components/KitchenSectionPublic";
import LivingHallSectionPublic from "./components/LivingHallSectionPublic";
import BedroomSectionPublic from "./components/BedroomSectionPublic";
import WardrobeSectionPublic from "./components/WardrobeSectionPublic";
import { useCreateFormSubmission } from "../../apiList/requirementFormApi";
import { Button } from "./../../components/ui/Button";
import { Input } from "./../../components/ui/Input";
import { Label } from "./../../components/ui/Label";

const RequirementFormPublic: React.FC = () => {
  const { token, projectId } = useParams<{ token: string, projectId:string }>();
  const [formData, setFormData] = useState<any>({
    filledBy: { clientName: "", email: "", whatsapp: "", location: "" },
    kitchen: {},
    livingHall: {},
    bedroom: {},
    wardrobe: {},
    additionalNotes: "",
  });
  const [showClientInfo, setShowClientInfo] = useState(false);
  const { mutate, isPending, isSuccess, isError, error } = useCreateFormSubmission();

  const handleClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      filledBy: {
        ...prev.filledBy,
        [name]: value,
      },
    }));
  };

  const allSectionsFilled = () => {
    return (
      formData.kitchen &&
      formData.livingHall &&
      formData.bedroom &&
      formData.wardrobe
    );
  };

  const handleSubmit = () => {
    if (!projectId) return;
    mutate({ projectId, payload: formData, token:token! });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-800">House Requirements Form</h1>

      <KitchenSectionPublic formData={formData} setFormData={setFormData} />
      <LivingHallSectionPublic formData={formData} setFormData={setFormData} />
      <BedroomSectionPublic formData={formData} setFormData={setFormData} />
      <WardrobeSectionPublic formData={formData} setFormData={setFormData} />

      {!showClientInfo && (
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowClientInfo(true)}
            disabled={!allSectionsFilled()}
          >
            Proceed to Client Info
          </Button>
        </div>
      )}

      {showClientInfo && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Client Name</Label>
              <Input
                name="clientName"
                value={formData.filledBy.clientName}
                onChange={handleClientChange}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.filledBy.email}
                onChange={handleClientChange}
              />
            </div>
            <div>
              <Label>WhatsApp Number</Label>
              <Input
                name="whatsapp"
                value={formData.filledBy.whatsapp}
                onChange={handleClientChange}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                name="location"
                value={formData.filledBy.location}
                onChange={handleClientChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Additional Notes</Label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, additionalNotes: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-blue-200"
              rows={4}
            />
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              isLoading={isPending}
            >
              Submit Requirement Form
            </Button>
          </div>

          {isSuccess && <p className="text-green-600 mt-4">Form submitted successfully!</p>}
          {isError && <p className="text-red-600 mt-4">{(error as Error).message}</p>}
        </div>
      )}
    </div>
  );
};

export default memo(RequirementFormPublic);

