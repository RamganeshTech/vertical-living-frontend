export type FieldType = "text" | "select" | "checkbox" | "number";

export interface FieldConfig {
  label: string;
  type: FieldType;
  options?: string[]; // for select or checkbox group
  required?: boolean;
}


export const modularUnitFieldConfig:Record<string, Record<string, FieldConfig>> = {
  showcase: {
    name: {
      label: "Name",
      type: "text",
      required:true
    },
    unitType: {
      label: "Unit Type",
      type: "select",
      options: [
        "Wall-Mounted",
        "Free-Standing",
        "Floor-to-Ceiling",
        "Corner Showcase",
        "Floating Showcase",
      ],
    },
    length: {
      label: "Length",
      type: "select",
      options: [
        "600 mm",
        "900 mm",
        "1200 mm",
        "1500 mm",
        "1800 mm",
        "2100+ mm",
      ],
    },
    breadth: {
      label: "Breadth",
      type: "select",
      options: [
        "300 mm",
        "450 mm",
        "600 mm",
      ],
    },
    carcassMaterial: {
      label: "Carcass Material",
      type: "select",
      options: [
        "BWP Plywood",
        "MDF",
        "HDHMR",
        "Particle Board",
        "Engineered Wood",
      ],
    },
    frontMaterial: {
      label: "Front Material",
      type: "select",
      options: [
        "Laminate",
        "Acrylic",
        "PU",
        "Membrane",
        "Glass",
        "Aluminium + Glass",
      ],
    },
    finish: {
      label: "Finish",
      type: "select",
      options: [
        "Glossy",
        "Matte",
        "Textured",
        "Wood Grain",
        "Veneer",
        "Lacquered",
      ],
    },
    storageType: {
      label: "Storage Type",
      type: "select",
      options: [
        "Open Display",
        "Closed Shutters",
        "Mixed Storage",
      ],
    },
    shutterType: {
      label: "Shutter Type",
      type: "select",
      options: [
        "Glass",
        "Wooden",
        "Aluminium-Framed Glass",
        "Mirror Finish",
      ],
    },
    glassVisibility: {
      label: "Glass Visibility",
      type: "select",
      options: [
        "Clear",
        "Frosted",
        "Tinted",
      ],
    },
    lighting: {
      label: "Lighting",
      type: "select",
      options: [
        "Spotlights",
        "Strip Lights",
        "Warm Backlight",
        "No Lighting",
      ],
    },
    installationType: {
      label: "Installation Type",
      type: "select",
      options: [
        "Floor Mounted",
        "Wall Mounted",
        "Hybrid",
      ],
    },
    usagePurpose: {
      label: "Usage Purpose",
      type: "select",
      options: [
        "Living Room",
        "Dining Area",
        "Hallway",
        "Commercial Display",
        "Puja Showcase",
      ],
    },
    addons: {
      label: "Add-ons",
      type: "checkbox",
      options: [
        "Mirror Back Panel",
        "Decorative Handles",
        "Soft-Close Hinges",
        "Lockable Sections",
      ],
    },
    compartments: {
      label: "Compartments",
      type: "select",
      options: [
        "1 Door",
        "2 Doors",
        "3+ Doors",
        "1–4 Drawers",
        "1–5+ Shelves",
      ],
    },
    edges: {
      label: "Edges",
      type: "select",
      options: [
        "Rounded",
        "Sharp",
      ],
    },
    modularType: {
      label: "Modular Type",
      type: "select",
      options: [
        "Factory Modular",
        "Carpenter-Made",
      ],
    },
    priceRange: {
      label: "Price Range",
      type: "select",
      options: [
        "₹5,000–₹10,000",
        "₹10,000–₹25,000",
        "₹25,000–₹50,000",
        "₹50,000+",
      ],
    },
  },



   falseCeiling: {
    name: { label: "Name", type: "text", required:true },
    ceilingType: { label: "Ceiling Type", type: "select", options: ["Pop", "Gypsum", "PVC", "Wooden", "Metal"] },
    lightingType: { label: "Lighting Type", type: "select", options: ["Spotlight", "LED Strip", "Cove", "Pendant"] },
    roomType: { label: "Room Type", type: "select", options: ["Living Room", "Bedroom", "Hallway", "Commercial"] },
    materialType: { label: "Material Type", type: "select", options: ["Gypsum", "POP", "PVC", "Wood"] },
    designStyle: { label: "Design Style", type: "select", options: ["Modern", "Traditional", "Minimalistic"] },
    colorTheme: { label: "Color Theme", type: "select", options: ["White", "Beige", "Custom"] },
    levels: { label: "Levels", type: "select", options: ["Single", "Double", "Multi"] },
    edgeProfile: { label: "Edge Profile", type: "select", options: ["Straight", "Curved"] },
    fixtureIntegration: { label: "Fixture Integration", type: "select", options: ["Fan", "Light", "AC Vent"] },
    panelType: { label: "Panel Type", type: "select", options: ["Flat", "Recessed"] },
    shapeGeometry: { label: "Shape & Geometry", type: "select", options: ["Rectangular", "Circular", "Custom"] },
    modularType: { label: "Modular Type", type: "select", options: ["Factory Modular", "Carpenter-Made"] },
    installationComplexity: { label: "Installation Complexity", type: "select", options: ["Low", "Medium", "High"] },
    budgetRange: { label: "Budget Range", type: "select", options: ["₹5,000–₹10,000", "₹10,000–₹25,000", "₹25,000+"] },
  },


   shoeRack: {
    name: { label: "Name", type: "text", required:true },
    unitType: { label: "Unit Type", type: "select", options: ["Open", "Closed", "Bench Style"] },
    length: { label: "Length", type: "select", options: ["600 mm", "900 mm", "1200 mm"] },
    breadth: { label: "Breadth", type: "select", options: ["300 mm", "450 mm"] },
    height: { label: "Height", type: "select", options: ["600 mm", "900 mm"] },
    carcassMaterial: { label: "Carcass Material", type: "select", options: ["Plywood", "MDF", "Particle Board"] },
    shutterMaterial: { label: "Shutter Material", type: "select", options: ["Laminate", "Acrylic"] },
    finish: { label: "Finish", type: "select", options: ["Glossy", "Matte"] },
    storageType: { label: "Storage Type", type: "select", options: ["Open", "Closed"] },
    handleType: { label: "Handle Type", type: "select", options: ["Knob", "Pull"] },
    shoeCapacity: { label: "Shoe Capacity", type: "select", options: ["6 Pairs", "10 Pairs", "15 Pairs+"] },
    ventilation: { label: "Ventilation", type: "select", options: ["Louvered", "Mesh"] },
    installationType: { label: "Installation Type", type: "select", options: ["Floor Standing", "Wall Mounted"] },
    usagePurpose: { label: "Usage Purpose", type: "select", options: ["Home", "Office"] },
    addOns: { label: "Add-ons", type: "checkbox", options: ["Soft-Close Hinges", "Locks"] },
    edges: { label: "Edges", type: "select", options: ["Rounded", "Sharp"] },
    modularType: { label: "Modular Type", type: "select", options: ["Factory Modular", "Carpenter-Made"] },
    priceRange: { label: "Price Range", type: "select", options: ["₹5,000–₹10,000", "₹10,000–₹25,000", "₹25,000+"] },
  },

  // ✅ Wardrobe
  wardrobe: {
    name: { label: "Name", type: "text", required:true },
    wardrobeType: { label: "Wardrobe Type", type: "select", options: ["Sliding", "Hinged", "Walk-in"] },
    length: { label: "Length", type: "select", options: ["1200 mm", "1800 mm", "2400 mm+"] },
    breadth: { label: "Breadth", type: "select", options: ["450 mm", "600 mm"] },
    height: { label: "Height", type: "select", options: ["2100 mm", "2400 mm"] },
    carcassMaterial: { label: "Carcass Material", type: "select", options: ["Plywood", "MDF"] },
    shutterMaterial: { label: "Shutter Material", type: "select", options: ["Laminate", "Acrylic"] },
    finish: { label: "Finish", type: "select", options: ["Matte", "Glossy"] },
    handleType: { label: "Handle Type", type: "select", options: ["Knob", "Handle-less"] },
    internalAccessories: { label: "Internal Accessories", type: "checkbox", options: ["Pull-out Basket", "Tie Rack"] },
    mirrorProvision: { label: "Mirror Provision", type: "select", options: ["Yes", "No"] },
    lighting: { label: "Lighting", type: "select", options: ["LED Strip", "Spotlight"] },
    lockType: { label: "Lock Type", type: "select", options: ["Central Lock", "Individual Lock"] },
    edges: { label: "Edges", type: "select", options: ["Rounded", "Sharp"] },
    installationType: { label: "Installation Type", type: "select", options: ["Floor Standing", "Wall Mounted"] },
    modularType: { label: "Modular Type", type: "select", options: ["Factory Modular", "Carpenter-Made"] },
    priceRange: { label: "Price Range", type: "select", options: ["₹10,000–₹25,000", "₹25,000–₹50,000"] },
  },


  tv: {
    name: { label: "Name", type: "text", required:true },
    unitType: { label: "Unit Type", type: "select", options: ["Wall-Mounted", "Free-Standing", "Panel Unit"] },
    length: { label: "Length", type: "select", options: ["1200 mm", "1500 mm", "1800 mm"] },
    breadth: { label: "Breadth", type: "select", options: ["300 mm", "450 mm"] },
    height: { label: "Height", type: "select", options: ["1200 mm", "1500 mm"] },
    panelMaterial: { label: "Panel Material", type: "select", options: ["Plywood", "MDF", "Particle Board"] },
    finish: { label: "Finish", type: "select", options: ["Glossy", "Matte", "Textured"] },
    storageType: { label: "Storage Type", type: "select", options: ["Open", "Closed", "Mixed"] },
    shutterType: { label: "Shutter Type", type: "select", options: ["Glass", "Wooden", "Aluminium-Framed"] },
    openShelves: { label: "Open Shelves", type: "select", options: ["Yes", "No"] },
    lighting: { label: "Lighting", type: "select", options: ["Spotlights", "Strip Lights", "None"] },
    addOns: { label: "Add-ons", type: "checkbox", options: ["Cable Manager", "Sound Bar Mount"] },
    edges: { label: "Edges", type: "select", options: ["Rounded", "Sharp"] },
    installationType: { label: "Installation Type", type: "select", options: ["Floor Standing", "Wall Mounted"] },
    modularType: { label: "Modular Type", type: "select", options: ["Factory Modular", "Carpenter-Made"] },
    priceRange: { label: "Price Range", type: "select", options: ["₹10,000–₹25,000", "₹25,000–₹50,000"] },
  },

  // ✅ Bed Cot
  BedCot: {
    name: { label: "Name", type: "text", required:true },
    bedType: { label: "Bed Type", type: "select", options: ["Single", "Double", "Queen", "King"] },
    length: { label: "Length", type: "select", options: ["1800 mm", "2000 mm"] },
    breadth: { label: "Breadth", type: "select", options: ["900 mm", "1200 mm", "1500 mm"] },
    height: { label: "Height", type: "select", options: ["450 mm", "600 mm"] },
    frameMaterial: { label: "Frame Material", type: "select", options: ["Wood", "Metal", "Engineered Wood"] },
    headboardMaterial: { label: "Headboard Material", type: "select", options: ["Plywood", "Upholstered", "MDF"] },
    finish: { label: "Finish", type: "select", options: ["Matte", "Glossy", "Textured"] },
    storageType: { label: "Storage Type", type: "select", options: ["Box Storage", "Drawer Storage", "No Storage"] },
    addOns: { label: "Add-ons", type: "checkbox", options: ["Hydraulic Lift", "LED Headboard"] },
    edges: { label: "Edges", type: "select", options: ["Rounded", "Sharp"] },
    installationType: { label: "Installation Type", type: "select", options: ["Knock Down", "Pre-assembled"] },
    modularType: { label: "Modular Type", type: "select", options: ["Factory Modular", "Carpenter-Made"] },
    priceRange: { label: "Price Range", type: "select", options: ["₹10,000–₹25,000", "₹25,000–₹50,000", "₹50,000+"] },
  },

  // ✅ Kitchen Cabinet
  kitchenCabinet: {
    name: { label: "Name", type: "text", required:true },
    unitType: { label: "Unit Type", type: "select", options: ["Base", "Wall", "Tall Unit"] },
    internalLayout: { label: "Internal Layout", type: "select", options: ["Shelf", "Drawer", "Pull-out"] },
    compartments: { label: "Compartments", type: "select", options: ["1 Door", "2 Doors", "3+ Doors"] },
    featureTags: { label: "Feature Tags", type: "checkbox", options: ["Soft Close", "Hydraulic Hinges"] },
    dimensions: { label: "Dimensions", type: "text" },
    carcassMaterial: { label: "Carcass Material", type: "select", options: ["BWP Plywood", "MDF", "Particle Board"] },
    doorsMaterial: { label: "Doors Material", type: "select", options: ["Laminate", "Acrylic", "PU"] },
    finish: { label: "Finish", type: "select", options: ["Glossy", "Matte", "Textured"] },
    ssHardwareBrand: { label: "SS Hardware Brand", type: "select", options: ["Hettich", "Hafele"] },
    visibilityType: { label: "Visibility Type", type: "select", options: ["Open", "Closed"] },
    positionUsage: { label: "Position Usage", type: "select", options: ["Corner", "Straight", "L-Shape"] },
    installationType: { label: "Installation Type", type: "select", options: ["Floor Standing", "Wall Mounted"] },
    designCollection: { label: "Design Collection", type: "select", options: ["Modern", "Classic", "Contemporary"] },
    modularType: { label: "Modular Type", type: "select", options: ["Factory Modular", "Carpenter-Made"] },
    priceRange: { label: "Price Range", type: "select", options: ["₹25,000–₹50,000", "₹50,000+"] },
  },

  // ✅ Study Table
  studyTable: {
    name: { label: "Name", type: "text", required:true },
    unitType: { label: "Unit Type", type: "select", options: ["Wall-Mounted", "Free-Standing"] },
    length: { label: "Length", type: "select", options: ["900 mm", "1200 mm", "1500 mm"] },
    breadth: { label: "Breadth", type: "select", options: ["450 mm", "600 mm"] },
    height: { label: "Height", type: "select", options: ["750 mm", "900 mm"] },
    carcassMaterial: { label: "Carcass Material", type: "select", options: ["Plywood", "MDF"] },
    tableTopMaterial: { label: "Table Top Material", type: "select", options: ["Laminate", "Acrylic", "Wood"] },
    finish: { label: "Finish", type: "select", options: ["Matte", "Glossy"] },
    storageType: { label: "Storage Type", type: "select", options: ["Open", "Closed"] },
    addOns: { label: "Add-ons", type: "checkbox", options: ["Cable Tray", "Drawer Lock"] },
    edges: { label: "Edges", type: "select", options: ["Rounded", "Sharp"] },
    installationType: { label: "Installation Type", type: "select", options: ["Knock Down", "Pre-assembled"] },
    modularType: { label: "Modular Type", type: "select", options: ["Factory Modular", "Carpenter-Made"] },
    priceRange: { label: "Price Range", type: "select", options: ["₹5,000–₹10,000", "₹10,000–₹25,000"] },
  },

  // ✅ Crockery Unit
  crockery: {
    name: { label: "Name", type: "text", required:true },
    unitType: { label: "Unit Type", type: "select", options: ["Base", "Wall", "Tall Unit"] },
    length: { label: "Length", type: "select", options: ["900 mm", "1200 mm", "1500 mm"] },
    breadth: { label: "Breadth", type: "select", options: ["450 mm", "600 mm"] },
    height: { label: "Height", type: "select", options: ["750 mm", "900 mm"] },
    carcassMaterial: { label: "Carcass Material", type: "select", options: ["BWP Plywood", "MDF"] },
    shutterMaterial: { label: "Shutter Material", type: "select", options: ["Glass", "Wooden"] },
    finish: { label: "Finish", type: "select", options: ["Glossy", "Matte"] },
    glassType: { label: "Glass Type", type: "select", options: ["Clear", "Frosted"] },
    lighting: { label: "Lighting", type: "select", options: ["Spotlight", "Strip Lights"] },
    storageType: { label: "Storage Type", type: "select", options: ["Open", "Closed"] },
    handleType: { label: "Handle Type", type: "select", options: ["Knob", "Pull"] },
    addOns: { label: "Add-ons", type: "checkbox", options: ["Soft-Close Hinges", "Locks"] },
    edges: { label: "Edges", type: "select", options: ["Rounded", "Sharp"] },
    installationType: { label: "Installation Type", type: "select", options: ["Floor Standing", "Wall Mounted"] },
    modularType: { label: "Modular Type", type: "select", options: ["Factory Modular", "Carpenter-Made"] },
    priceRange: { label: "Price Range", type: "select", options: ["₹10,000–₹25,000", "₹25,000–₹50,000"] },
  },
};
