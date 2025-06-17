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
import type { IRequirementFormSchema } from "../../types/types";

const RequirementFormPublic: React.FC = () => {
  const { token, projectId } = useParams<{ token: string; projectId: string }>();

  const [formData, setFormData] = useState<IRequirementFormSchema>({
    clientData: {
      clientName: "",
      email: "",
      whatsapp: "",
      location: ""
    },
    isEditable: true, // or false, depending on your logic
    kitchen: {
      layoutType: "L-shaped",
      kitchenPackage: "Essentials",
      measurements: { top: 0, left: 0, right: 0 },
      graniteCountertop: false,
      numberOfShelves: 0,
      notes: ""
    },
    livingHall: {
      seatingStyle: "Sofa Set",
      tvUnitDesignRequired: false,
      falseCeilingRequired: false,
      wallDecorStyle: "Paint",
      numberOfFans: 0,
      numberOfLights: 0,
      livingHallPackage: "Essentials",
      notes: ""
    },
    bedroom: {
      numberOfBedrooms: 0,
      bedType: "Single",
      wardrobeIncluded: false,
      falseCeilingRequired: false,
      tvUnitRequired: false,
      studyTableRequired: false,
      bedroomPackage: "Essentials",
      notes: ""
    },
    wardrobe: {
      wardrobeType: "Sliding",
      lengthInFeet: 0,
      heightInFeet: 0,
      mirrorIncluded: false,
      wardrobePackage: "Essentials",
      numberOfShelves: 0,
      numberOfDrawers: 0,
      notes: ""
    },
    additionalNotes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({})

  const [step, setStep] = useState(0);
  const { mutate, isPending, isSuccess, isError, error } = useCreateFormSubmission();

  const handleClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      clientData: {
        ...prev.filledBy,
        [name]: value,
      },
    }));
  };


  const handleValidate = (formData: IRequirementFormSchema) => {
    let errors: any = {}

    // Object.entries(formData.clientData).map(([k,v])=>{
    //   if(k !== "location"){
    //     if(!v?.trim()){
    //        errors[k] = `${k} is required`
    //     }
    //   }
    // })


    const { clientName, email, whatsapp } = formData.clientData;

    if (!clientName || clientName.trim() === "") {
      errors.clientName = "Client name is required";
    }

    if (!email || email.trim() === "") {
      errors.email = "Email is required";
    }

    if (!whatsapp || whatsapp.trim() === "") {
      errors.whatsapp = "WhatsApp number is required";
      if (whatsapp?.length !== 10) {
        errors.whatsapp = "Number should be 10 digits long"
      }
    }


    return errors
  }

  const handleSubmit = () => {
    setErrors({})
    if (!projectId) return;

    const errors = handleValidate(formData)

    console.log(errors)

    if (Object.keys(errors).length) {
      setErrors(errors)
      return;
    }

    // mutate({ projectId, payload: formData, token: token! });
  };

  const steps = [
    {
      label: "Kitchen",
      content: <KitchenSectionPublic formData={formData} setFormData={setFormData} />,
    },
    {
      label: "Living Hall",
      content: <LivingHallSectionPublic formData={formData} setFormData={setFormData} />,
    },
    {
      label: "Bedroom",
      content: <BedroomSectionPublic formData={formData} setFormData={setFormData} />,
    },
    {
      label: "Wardrobe",
      content: <WardrobeSectionPublic formData={formData} setFormData={setFormData} />,
    },
    {
      label: "Client Info",
      content: (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Client Name</Label>
              <Input
                name="clientName"
                value={formData.clientData.clientName}
                onChange={handleClientChange}
                required={true}
                error={errors.clientName || ""}
              />

            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.clientData.email}
                onChange={handleClientChange}
                required={true}
                error={errors.email || ""}
              />
            </div>
            <div>
              <Label>WhatsApp Number</Label>
              <Input
                name="whatsapp"
                value={formData.clientData.whatsapp}
                onChange={handleClientChange}
                required={true}
                error={errors.whatsapp || ""}
                maxLength={10}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                name="location"
                value={formData.clientData.location}
                onChange={handleClientChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Additional Notes</Label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes || ""}
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
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-800">House Requirements Form</h1>

      <div>{steps[step].content}</div>

      <div className="flex justify-between mt-8">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep((prev) => prev - 1)}>
            Previous
          </Button>
        )}

        {step < steps.length - 1 && (
          <Button variant="primary" onClick={() => setStep((prev) => prev + 1)}>
            Skip & Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(RequirementFormPublic);



