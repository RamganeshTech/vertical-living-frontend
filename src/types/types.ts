export interface ProjectType {
  projectName: string | null,
  description: string | null,
  duration: number | null,
  tags: string[],
  startDate: Date | null,
  endDate: Date | null,
  dueDate: Date | null,
  priority: string,
  status: string,
}


export interface projectInformation {
  owner: string
  tags: string[] | []
  startDate: (string | null)
  endDate: (string | null)
  dueDate: (string | null)
  duration: (number | null)
  priority: "none" | "low" | "medium" | "high"
  status: "Active" | "Delayed" | "In Progress" | "In Testing" | "On Track" | "On Hold" | "Approved" | "Cancelled" | "Planning" | "Invoice";
  projectGroup: string | null,
  completionTime: (string | null),
  TaskAndIssuePrefix: (string | null),
}

// PROJECT TYPE
export interface IProject extends Document {
  userId: string
  projectId: string,
  projectName: string,
  accessibleClientId: string[],
  description: (string | null);
  projectInformation: projectInformation
  tasks: (number | null),
  issues: (number | null),
  phases: (number | null),
  completionPercentage: (number | null),
  projectAccess: string,
  taskLists: string[],
  materials: string[]
  labours: string[],
  materialsFullyApproved: "approved" | "rejected" | "pending"
  laboursFullyApproved: "approved" | "rejected" | "pending"

}



// LABOUR LIST TYPE


export interface ILabourList {
  projectId: string,
  labourListName: string,
  labours: string[]
  _id?: string,
  clientApproval: string
}


export interface LabourItemType {
  role: string;                   // e.g., Mason, Carpenter
  numberOfPeople: number;
  estimatedHours: number;
  hourlyRate: number;
  totalCost: number;
  notes?: string | null;
  _id?: string,
  clientApproved?: string;
  clientFeedback?: string | null
}

export interface LabourEstimate {
  labourListId: string;   // references LabourList model
  mergedMaterials: LabourItemType[];
  totalLabourCost: number;
  _id?: string,
}



// MATERIAL LIST TYPE 

export interface MaterialListType {
  projectId: string;
  materialListName: string;
  materials: string[],
  _id?: string
}


export interface MaterialItemType {
  materialName: string;
  unit: string;
  unitPrice: number;
  materialQuantity: number;
  vendor?: string;
  notes?: string;
  singleMaterialCost: number;
  clientApproved?: string;
  clientFeedback?: string | null
  _id?: string

}

export interface MaterialEstimate extends Document {
  materialListId: string;
  materials: MaterialItemType[];
  totalCost: number;
  _id?: string

}



// ORGANIZATION TYPES 
export interface IOrganization  {
    organizationName: string;
    type?: string;
    address?: string;
    logoUrl?: string;
    organizationPhoneNo?: string
}

// STAFFS TYPES
export interface IStaff {
    email: string,
    password: string,
    staffName: string,
    phoneNo: string,
    role: string;
    organizationId?: string[];
}



// REQUIREMENT FORM TYPE STAGE 1
export interface IRequirementFormSchema{
  projectId?: string,
  clientData: {
    clientName: string,
    email: string,
    whatsapp: string,
    location: string
  },
  isEditable: boolean,
  kitchen: IKitchenRequirement,
  livingHall: ILivingHallRequirement,
  bedroom: IBedroomRequirement,
  wardrobe: IWardrobeRequirement,
  additionalNotes: string | null,
}

export interface IKitchenRequirement {
    layoutType: "L-shaped" | "Straight" | "U-shaped" | "Parallel";
    measurements?: {
        top: number;
        left: number;
        right: number;
    };
    kitchenPackage: "Essentials" | "Premium" | "Luxury" | "Build Your Own Package";
    // packageDetails?: {
    //     affordablePricing?: boolean;
    //     premiumDesigns?: boolean;
    //     elitePricing?: boolean;
    //     customDesign?: boolean;
    // };
    graniteCountertop?: boolean;
    numberOfShelves?: (number | null);
    notes?: string;
}

export interface IWardrobeRequirement {
  wardrobeType: "Sliding" | "Openable";
  lengthInFeet?: number;
  heightInFeet?: number;
  mirrorIncluded?: boolean;
  wardrobePackage: "Essentials" | "Premium" | "Luxury" | "Build Your Own Package";
  numberOfShelves?: (number | null);
  numberOfDrawers?: (number | null);
  notes?: (string | null);
}


export interface ILivingHallRequirement {
  seatingStyle?: "Sofa Set" | "L-Shaped Sofa" | "Recliner Chairs" | "Floor Seating";
  tvUnitDesignRequired?: boolean;
  falseCeilingRequired?: boolean;
  wallDecorStyle?: "Paint" | "Wallpaper" | "Wood Paneling" | "Stone Cladding";
  numberOfFans?: number;
  numberOfLights?: number;
  livingHallPackage: "Essentials" | "Premium" | "Luxury" | "Build Your Own Package";
  notes?: (string | null);
}

export interface IBedroomRequirement {
  numberOfBedrooms: number;
  bedType?: "Single" | "Double" | "Queen" | "King";
  wardrobeIncluded?: boolean;
  falseCeilingRequired?: boolean;
  tvUnitRequired?: boolean;
  studyTableRequired?: boolean;
  bedroomPackage: "Essentials" | "Premium" | "Luxury" | "Build Your Own Package";
  notes?: (string | null);
}