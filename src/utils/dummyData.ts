import type { ProjectInput } from "../components/CreateProject";
import type { ILabourList, LabourEstimate } from "../types/types";

export const projects: ProjectInput[] = [
  {
    projectName: "CRM Dashboard",
    description: "loremloremloremloremloremlorem",
    // id: "P-2025-01",
    startDate: new Date(),
    endDate: new Date(),
    priority: "Medium",
    duration: 20,
    tags: ["dummy", "lskdfjl", "red", "blsdlfhs"],
    status: "Active",
    dueDate: new Date()

  },
  {
    projectName: "CRM Dashboard",
    description: "loremloremloremloremloremlorem",
    // id: "P-2025-01",
    startDate: new Date(),
    endDate: new Date(),
    priority: "Medium",
    duration: 20,
    tags: ["dummy", "lskdfjl", "red", "blsdlfhs"],
    status: "Active",
    dueDate: new Date()
  },
  {
    projectName: "CRM Dashboard",
    description: "loremloremloremloremloremlorem",
    // id: "P-2025-01",
    startDate: new Date(),
    endDate: new Date(),
    priority: "Medium",
    duration: 20,
    tags: ["dummy", "lskdfjl", "red", "blsdlfhs"],
    status: "Active",
    dueDate: new Date()
  },
  {
    projectName: "CRM Dashboard",
    description: "loremloremloremloremloremlorem",
    // id: "P-2025-01",
    startDate: new Date(),
    endDate: new Date(),
    priority: "Medium",
    duration: 20,
    tags: ["dummy", "lskdfjl", "red", "blsdlfhs"],
    status: "Active",
    dueDate: new Date()
  },
  {
    projectName: "CRM Dashboard",
    description: "loremloremloremloremloremlorem",
    // id: "P-2025-01",
    startDate: new Date(),
    endDate: new Date(),
    priority: "Medium",
    duration: 20,
    tags: ["dummy", "lskdfjl", "red", "blsdlfhs"],
    status: "Active",
    dueDate: new Date()
  },
];


export const mockLabourLists: ILabourList[] = [
  {
    projectId: "project-1",
    labourListName: "Frontend Development Team",
    labours: ["React Developer", "UI/UX Designer", "QA Tester"],
    clientApproval: "not assigned"
  },
  {
    projectId: "project-1",
    labourListName: "Backend Development Team",
    labours: ["Node.js Developer", "Database Administrator", "DevOps Engineer"],
    clientApproval: "not assigned"
  },

  {
    projectId: "project-1",
    labourListName: "Backend Development Team",
    labours: ["Node.js Developer", "Database Administrator", "DevOps Engineer"],
    clientApproval: "not assigned"
  },
  {
    projectId: "project-1",
    labourListName: "Backend Development Team",
    labours: ["Node.js Developer", "Database Administrator", "DevOps Engineer"],
    clientApproval: "not assigned"
  },
  {
    projectId: "project-1",
    labourListName: "Backend Development Team",
    labours: ["Node.js Developer", "Database Administrator", "DevOps Engineer"],
    clientApproval: "not assigned"
  },
  {
    projectId: "project-1",
    labourListName: "Backend Development Team",
    labours: ["Node.js Developer", "Database Administrator", "DevOps Engineer"],
    clientApproval: "not assigned"
  },
  {
    projectId: "project-1",
    labourListName: "Backend Development Team",
    labours: ["Node.js Developer", "Database Administrator", "DevOps Engineer"],
    clientApproval: "not assigned"
  },
  {
    projectId: "project-1",
    labourListName: "Backend Development Team",
    labours: ["Node.js Developer", "Database Administrator", "DevOps Engineer"],
    clientApproval: "not assigned"
  },
  {
    projectId: "project-1",
    labourListName: "Backend Development Team",
    labours: ["Node.js Developer", "Database Administrator", "DevOps Engineer"],
    clientApproval: "not assigned"
  },
]

export const mockLabourEstimates: LabourEstimate[] = [
  {
    labourListId: "frontend-team",
    mergedMaterials: [
      {
        role: "React Developer",
        numberOfPeople: 2,
        estimatedHours: 160,
        hourlyRate: 75,
        totalCost: 24000,
        notes: "Senior level developers for component architecture",
      },
      {
        role: "UI/UX Designer",
        numberOfPeople: 1,
        estimatedHours: 80,
        hourlyRate: 65,
        totalCost: 5200,
        notes: "Design system and user interface",
      },
    ],
    totalLabourCost: 29200,
  },
  {
    labourListId: "backend-team",
    mergedMaterials: [
      {
        role: "Node.js Developer",
        numberOfPeople: 2,
        estimatedHours: 120,
        hourlyRate: 80,
        totalCost: 19200,
        notes: "API development and integration",
      },
    ],
    totalLabourCost: 19200,
  },
]
