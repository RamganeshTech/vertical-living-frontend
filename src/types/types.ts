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