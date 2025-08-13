import React, { useState } from "react";
import { useParams } from "react-router-dom";
// import KitchenSectionPublic from "./KitchenSectionPublic";
// import LivingHallSectionPublic from "./LivingHallSectionPublic";
// import BedroomSectionPublic from "./BedroomSectionPublic";
// import WardrobeSectionPublic from "./WardrobeSectionPublic";
import { useCreateFormSubmission } from "../../../apiList/Stage Api/requirementFormApi";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import type { IRequirementFormSchema } from "../../../types/types";
// import { Textarea } from "../../../components/ui/TextArea";
import { toast } from "../../../utils/toast";

const RequirementFormPublic: React.FC = () => {
  const { token, projectId } = useParams<{ token: string; projectId: string }>();

 const [formData, setFormData] = useState<IRequirementFormSchema>({
  clientData: {
    clientName: null,
    email: null,
    whatsapp: null,
    location: null,
  },
  // isEditable: true,
  // kitchen: {
  //   layoutType: null,
  //   kitchenPackage: null,
  //   measurements: { top: null, left: null, right: null },
  //   graniteCountertop: null,
  //   numberOfShelves: null,
  //   notes: null,
  // },
  // // livingHall: {
  //   seatingStyle: null,
  //   tvUnitDesignRequired: null,
  //   falseCeilingRequired: null,
  //   wallDecorStyle: null,
  //   numberOfFans: null,
  //   numberOfLights: null,
  //   livingHallPackage: null,
  //   notes: null,
  // },
  // bedroom: {
  //   numberOfBedrooms: null,
  //   bedType: null,
  //   wardrobeIncluded: null,
  //   falseCeilingRequired: null,
  //   tvUnitRequired: null,
  //   studyTableRequired: null,
  //   bedroomPackage: null,
  //   notes: null,
  // },
  // wardrobe: {
  //   wardrobeType: null,
  //   lengthInFeet: null,
  //   heightInFeet: null,
  //   mirrorIncluded: null,
  //   wardrobePackage: null,
  //   numberOfShelves: null,
  //   numberOfDrawers: null,
  //   notes: null,
  // },
  // additionalNotes: null,
});

  const [errors, setErrors] = useState<Record<string, string>>({})

  const [step, setStep] = useState(0);
  const { mutateAsync, isPending, isSuccess, isError, error } = useCreateFormSubmission();

  const handleClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;

    if (name === "whatsapp") {
      // Strip all non-numeric characters
      value = value.replace(/[^0-9]/g, "");
    }



    setFormData((prev: any) => ({
      ...prev,
      clientData: {
        ...prev.clientData,
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


    if(email){
      if(!email.includes("@")){
        errors.email = "should contain @"
      }
    }

    if (!whatsapp || whatsapp.trim() === "") {
      errors.whatsapp = "WhatsApp number is required";
    } else if (whatsapp.trim().length !== 10) {
      errors.whatsapp = "Number should be 10 digits long";
    }

    return errors
  }

  const handleSubmit = async () => {
    try {
      setErrors({})
      if (!projectId) return;

      const errors = handleValidate(formData)


      if (Object.keys(errors).length) {
        setErrors(errors)
        return;
      }

      await mutateAsync({ projectId, payload: formData, token: token! });
      toast({ title: "Success", description: "form data submitted successfully" })
    }
    catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to generate invitation link", variant: "destructive" })
    }
  };

  const steps = [
    // {
    //   label: "Kitchen",
    //   content: <KitchenSectionPublic formData={formData} setFormData={setFormData} />,
    // },
    // {
    //   label: "Living Hall",
    //   content: <LivingHallSectionPublic formData={formData} setFormData={setFormData} />,
    // },
    // {
    //   label: "Bedroom",
    //   content: <BedroomSectionPublic formData={formData} setFormData={setFormData} />,
    // },
    // {
    //   label: "Wardrobe",
    //   content: <WardrobeSectionPublic formData={formData} setFormData={setFormData} />,
    // },
    {
      label: "Client Info",
      content: (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Client Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Client Name</Label>
              <Input
                name="clientName"
                value={formData.clientData.clientName ?? ""}
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
                value={formData.clientData.email ?? ""}
                onChange={handleClientChange}
                required={true}
                error={errors.email || ""}
              />
            </div>
            <div>
              <Label>WhatsApp Number</Label>
              <Input
                name="whatsapp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{10}"
                value={formData.clientData.whatsapp ?? ""}
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
                value={formData.clientData.location ?? ""}
                onChange={handleClientChange}
              />
            </div>
          </div>

          {/* <div className="mt-4">
            <Label>Additional Notes</Label>
            <Textarea
              name="additionalNotes"
              value={formData.additionalNotes || ""}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, additionalNotes: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-blue-200"
              rows={4}
            />
          </div> */}

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
          {isError && <p className="text-red-600 mt-4">{(error as any)?.response?.data?.message || (error as Error).message || "Form Submission Failed"}</p>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8  max-h-[100vh] overflow-y-auto custom-scrollbar bg-gradient-to-br from-blue-50 via-white to-blue-100 !p-6 h-full w-full">
      <div className="max-w-5xl max-h-full mx-auto space-y-5">
        <h1 className="text-3xl font-bold text-center text-blue-800">Client Detail Form</h1>

        <div className="max-w-5xl  mx-auto">{steps[step].content}</div>

        <div className={`flex ${step > 0 ? "justify-between" : "justify-end"} mt-2`}>
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
    </div>
  );
};

export default RequirementFormPublic;