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




export const existingUploads = [
        {
          _id: "kkkkkkk9kkkk",
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
          _id: "kkkk49kkkkkk",
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "kitchen-view.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
          _id: "kkkk1kkkkkkk",
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
        {
          _id: "kkkskkkkkkkk",
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
        {
          _id: "kkkk11kkkkkkk",
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
        {
          _id: "kkkkkkkkkkllkkkkkk",
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
    ];







    export const dummyStaffs = [
  { _id: "s1", name: "John Doe", email: "john.doe@example.com" },
  { _id: "s2", name: "Jane Smith", email: "jane.smith@example.com" },
  { _id: "s3", name: "Robert Brown", email: "robert.brown@example.com" },
  { _id: "s4", name: "Emily Davis", email: "emily.davis@example.com" },
  { _id: "s5", name: "Michael Johnson", email: "michael.johnson@example.com" },
  { _id: "s6", name: "Sarah Wilson", email: "sarah.wilson@example.com" },
  { _id: "s7", name: "William Lee", email: "william.lee@example.com" },
  { _id: "s8", name: "Olivia Martinez", email: "olivia.martinez@example.com" },
  { _id: "s9", name: "James Anderson", email: "james.anderson@example.com" },
  { _id: "s10", name: "Sophia Thomas", email: "sophia.thomas@example.com" },
];


export const dummyCTOs = [
  { _id: "cto1", name: "Alice Carter", email: "alice.carter@example.com" },
  { _id: "cto2", name: "David Evans", email: "david.evans@example.com" },
  { _id: "cto3", name: "Grace Scott", email: "grace.scott@example.com" },
  { _id: "cto4", name: "Henry Walker", email: "henry.walker@example.com" },
  { _id: "cto5", name: "Isabella Young", email: "isabella.young@example.com" },
  { _id: "cto6", name: "Jack Hall", email: "jack.hall@example.com" },
  { _id: "cto7", name: "Katherine Allen", email: "katherine.allen@example.com" },
  { _id: "cto8", name: "Liam Wright", email: "liam.wright@example.com" },
  { _id: "cto9", name: "Mia King", email: "mia.king@example.com" },
  { _id: "cto10", name: "Noah Hill", email: "noah.hill@example.com" },
];



export const dummyWorkers = [
  { _id: "w1", name: "Owen Green", email: "owen.green@example.com" },
  { _id: "w2", name: "Penelope Adams", email: "penelope.adams@example.com" },
  { _id: "w3", name: "Quinn Baker", email: "quinn.baker@example.com" },
  { _id: "w4", name: "Ryan Nelson", email: "ryan.nelson@example.com" },
  { _id: "w5", name: "Samantha Perez", email: "samantha.perez@example.com" },
  { _id: "w6", name: "Thomas Roberts", email: "thomas.roberts@example.com" },
  { _id: "w7", name: "Uma Turner", email: "uma.turner@example.com" },
  { _id: "w8", name: "Victor Phillips", email: "victor.phillips@example.com" },
  { _id: "w9", name: "Wendy Campbell", email: "wendy.campbell@example.com" },
  { _id: "w10", name: "Xavier Mitchell", email: "xavier.mitchell@example.com" },
];




export const dummyClients = [
  { _id: "c1", name: "Yara Carter", email: "yara.carter@example.com" },
  { _id: "c2", name: "Zachary Flores", email: "zachary.flores@example.com" },
  { _id: "c3", name: "Abigail Ramirez", email: "abigail.ramirez@example.com" },
  { _id: "c4", name: "Benjamin Rivera", email: "benjamin.rivera@example.com" },
  { _id: "c5", name: "Charlotte Sanders", email: "charlotte.sanders@example.com" },
  { _id: "c6", name: "Daniel Perry", email: "daniel.perry@example.com" },
  { _id: "c7", name: "Ella Jenkins", email: "ella.jenkins@example.com" },
  { _id: "c8", name: "Finn Long", email: "finn.long@example.com" },
  { _id: "c9", name: "Gabriella Hughes", email: "gabriella.hughes@example.com" },
  { _id: "c10", name: "Hudson Foster", email: "hudson.foster@example.com" },
];
