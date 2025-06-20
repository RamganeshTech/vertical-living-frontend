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
export interface IOrganization {
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
export interface IRequirementFormSchema {
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




// STAGE 2 SITE MEASUREMENT

export interface ISiteMeasurement {
  projectId: string;
  status: "pending" | "completed";
  isEditable: boolean;

  timer: {
    startedAt: Date | null;
    completedAt: Date | null;
    deadLine: Date | null;
  };

  uploads: {
    type: "image" | "pdf";
    url: string;
    originalName: string;
    uploadedAt: Date;
  }[];

  siteDetails: SiteDetails

  rooms: SiteRooms[];
}


export interface SiteDetails {
  totalPlotAreaSqFt: number | null;
  builtUpAreaSqFt: number | null;
  roadFacing: boolean | null;
  numberOfFloors: number | null;
  hasSlope?: boolean | null;
  boundaryWallExists?: boolean | null;
  additionalNotes?: string | null;
}

export type RoomName = "LivingHall" | "Bedroom" | "Kitchen" | "Wardrobe" | null; 
export interface SiteRooms {
  name: RoomName
  length: number | null;
  breadth: number | null;
  height?: number | null;
}




// SAMPLE DESIGN STAGE 3 

export interface IFileItem {
  type: "image" | "pdf";
  url: string;
  originalName?: string;
  uploadedAt?: Date;
}

export interface IRoom {
  roomName: string;
  files: IFileItem[];
}

export interface ISampleDesign {
  projectId: string;
  rooms: IRoom[];
  timer: {
    startedAt: Date | null;
    completedAt: Date | null;
    deadLine: Date | null;
  };
  status: "pending" | "completed";
  additionalNotes?: string | null;
  isEditable: boolean;
}



// TECH CONSUTLATION TYPE STAGE 4


export interface IConsultationAttachment {
    // _id?: string;
    type: "image" | "pdf";
    url: string;
    originalName?: string;
}


export interface IConsultationMessage {
    // _id?: string;
    sender: string; // the persons id who sent the message
    senderModel: string,
    senderRole: "owner" | "staff" | "CTO" | "worker";
    message: string;
    section?: string; // Optional tag like "Kitchen"
    attachments?: IConsultationAttachment[];
    createdAt: Date;
}

export interface IConsultationTimer {
    startedAt: Date | null;
    completedAt: Date | null;
    deadLine: Date | null;
}

export interface ITechnicalConsultation {
    projectId: string;
    messages: IConsultationMessage[];
    timer: IConsultationTimer;
    status: "pending" | "completed";
    isEditable: boolean;
}






// MATERIAL SELECTION STAGE 5 

export interface IMaterialSelectionRoomUpload {
  type: "image" | "pdf";
  url: string;
  originalName?: string;
  uploadedAt: Date
}

export interface IMaterialSelectionWork {
  workName: string;
  notes?: string;
  materials: string[]; // Can be expanded to object if needed later
}

export interface IMaterialSelectionRoom {
  roomName: string;
  uploads: IMaterialSelectionRoomUpload[];
  modularWorks: IMaterialSelectionWork[];
}

export interface IMaterialSelectionRoomConfirmation {
  projectId: string;
  rooms: IMaterialSelectionRoom[];
  status: "pending" | "completed";
  isEditable: boolean;
  timer: {
    startedAt: Date | null;
    completedAt: Date | null;
    deadLine: Date | null;
  };
}
