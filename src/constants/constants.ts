export const SIDEBAR_LABELS = {
  //   DASHBOARD: "Dashboard",
  PROJECTS: "Projects",
  ISSUES: "Issues",
  COLLABORATION: "Collaboration",
  TASKS: "Tasks",
  PHASES: "Phases",
};

export const SIDEBAR_ICONS = {
  PROJECTS: "fa-solid fa-bars-progress text-2xl",
  ISSUES: "fa-solid fa-bug text-2xl",
  COLLABORATION: "fa-solid fa-user-group text-2xl",
  TASKS: "fa-solid fa-list text-2xl",
  PHASES: "fa-solid fa-briefcase text-2xl",
}

export const ORGANIZATION_ICONS = {
  PROJECTS: "fa-solid fa-bars-progress text-2xl",
  INVITECTO: "fa-solid fa-bars-progress text-2xl",
  INVITESTAFFS: "fa-solid fa-bars-progress text-2xl",
  DETAILS: "fa-solid fa-bars-progress text-2xl",
}

export const ORGANIZATION_LABELS = {
  INVITECTO: "Invite CTO",
  INVITESTAFFS: "Invite Staffs",
  DETAILS: "Org Details",
  PROJECTS: "Projects"
}

export const PROJECTS_LABELS = {
  MATERIALS: "Materials",
  LABOURS: "Labours",
  TRANSPORTATION: "Transportation",
  WORKERS: "Workers",
  INVITECLIENT: "Invite Client",
  REQUIREMENTFORM: "Requirement Form",
  SITEMEASUREMENT: "Site Measurement",
  SAMPLEDESIGN: "Sample Designs",
  TECHNICALCONSULTANT: "Technical consultant",
  MATERIALSELECTION: "Material Selection",
  COSTESTIMATION: "Cost Estiamtion",
  ORDERMATERIALS: "Ordering Material",
  MATERIALARRIVED: "Material Arrival",
  WORKSCHEDULE: "Work Schedule",
}


export const PROJECTS_ICONS = {
  MATERIALS: "fa-solid fa-cubes-stacked text-2xl",
  LABOURS: "fa-solid fa-users text-2xl",
  TRANSPORTATION: "fa-solid fa-road text-2xl",
  WORKERS: "fa-solid fa-circle-info text-2xl",
  INVITECLIENT: "fa-solid fa-user-group text-2xl",
  REQUIREMENTFORM: "fa-solid fa-pencil text-2xl",
  SITEMEASUREMENT: "fa-solid fa-building text-2xl",
  SAMPLEDESIGN: "fa-solid fa-object-group text-2xl",
  TECHNICALCONSULTANT: "fa-solid fa-comments text-2xl",
  MATERIALSELECTION: "fas fa-box text-2xl",
  COSTESTIMATION: "fa-solid fa-money-bill-1-wave text-2xl",
  ORDERMATERIALS: "fa-solid fa-shopping-cart text-2xl",
  MATERIALARRIVED: "fa-solid fa-receipt text-2xl",
  WORKSCHEDULE: "fas fa-digging text-2xl",

}


export const COMPANY_DETAILS = {
  COMPANY_NAME: "Vertical living",
  COMPANY_LOGO: "https://th.bing.com/th/id/OIP.Uparc9uI63RDb82OupdPvwAAAA?w=80&h=80&c=1&bgcl=c77779&r=0&o=6&dpr=1.3&pid=ImgRC"
}


export const requiredFieldsByRoomOrderMaterials: Record<string, string[]> = {
  carpentry: ["material", "brandName", "specification", "quantity", "unit", "remarks"],
  hardware: ["item", "size", "material", "brandName", "quantity", "unit", "remarks"],
  electricalFittings: ["item", "specification", "quantity", "unit", "remarks"],
  tiles: ["type", "brandName", "size", "quantity", "unit", "remarks"],
  ceramicSanitaryware: ["item", "specification", "quantity", "unit", "remarks"],
  paintsCoatings: ["type", "brandName", "color", "quantity", "unit", "remarks"],
  lightsFixtures: ["type", "brandName", "specification", "quantity", "unit", "remarks"],
  glassMirrors: ["type", "brandName", "size", "thickness", "quantity", "remarks"],
  upholsteryCurtains: ["item", "fabric", "color", "quantity", "unit", "remarks"],
  falseCeilingMaterials: ["item", "specification", "quantity", "unit", "remarks"]
};



export const requiredFieldsByRoomArrival: Record<string, string[]> = {
  carpentry: ["material", "brandName", "specification", "quantity", "unit", "remarks", "image", "verifiedByAccountant"],
  hardware: ["item", "size", "material", "brandName", "quantity", "unit", "remarks", "image", "verifiedByAccountant"],
  electricalFittings: ["item", "specification", "quantity", "unit", "remarks", "image", "verifiedByAccountant"],
  tiles: ["type", "brandName", "size", "quantity", "unit", "remarks", "image", "verifiedByAccountant"],
  ceramicSanitaryware: ["item", "specification", "quantity", "unit", "remarks", "image", "verifiedByAccountant"],
  paintsCoatings: ["type", "brandName", "color", "quantity", "unit", "remarks", "image", "verifiedByAccountant"],
  lightsFixtures: ["type", "brandName", "specification", "quantity", "unit", "remarks", "image", "verifiedByAccountant"],
  glassMirrors: ["type", "brandName", "size", "thickness", "quantity", "remarks", "image", "verifiedByAccountant"],
  upholsteryCurtains: ["item", "fabric", "color", "quantity", "unit", "remarks", "image", "verifiedByAccountant"],
  falseCeilingMaterials: ["item", "specification", "quantity", "unit", "remarks" , "image", "verifiedByAccountant"]
};


export const predefinedOptionsRooms:any = {
  brandName: {
    carpentry: ["Greenply", "Century", "Kitply", "Archid", "Austin"],
    hardware: ["Hettich", "Hafele", "Blum", "Godrej"],
    tiles: ["Kajaria", "Somany", "Johnson", "Nitco"],
    paintsCoatings: ["Asian Paints", "Berger", "Dulux"],
    lightsFixtures: ["Philips", "Syska", "Wipro"],
    glassMirrors: ["Saint-Gobain", "Modiguard", "Asahi"],
    ceramicSanitaryware: ["Cera", "Parryware", "Hindware"],
  },
  fabric: {
    upholsteryCurtains: ["Cotton", "Linen", "Velvet", "Polyester", "Silk"],
  },
};
