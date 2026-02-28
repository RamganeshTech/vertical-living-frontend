import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetMaterialBrands } from '../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useGetSinglePreSalesQuote, useUpdateMainPreSalesQuote, useUpdatePreSalesQuote } from '../../../apiList/Quote Api/preSalesQuote_Api/preSalesQuoteApi';
import { toast } from '../../../utils/toast';
import PreSalesQuoteType4 from './PreSalesQuoteType4';
import CreatePreSalesQuoteModal from './CreatePreSalesQuoteModal';
import { PreSalesQuoteStep4 } from './PreSalesQuoteStep4';
import InfoTooltip from '../../../components/ui/InfoToolTip';
// import SearchSelectNew from '../../../components/ui/SearchSelectNew';

const ROOM_LIST = ["Living Room", "Kitchen", "Master Bedroom",
    // "Kids Bedroom", "Guest Bedroom", "Foyer", "Outside Area",
    "Washroom"];
// base unit, wall unit, pooja unit
//  OLD VERSION
// const PRODUCT_CATALOG: Record<string, any[]> = {
//     "Living Room": [
//         { id: "grand_tv", name: "Grand TV Unit", h: 8, w: 6 },
//         { id: "wardrobe", name: "Wardrobe", h: 7, w: 6 },
//         { id: "crockery", name: "Crockery Unit", h: 7, w: 4 },
//         { id: "bar_unit", name: "Bar Unit", h: 7, w: 3 },
//         { id: "book_shelf", name: "Book Shelf", h: 7, w: 3 },
//         { id: "wallpaper", name: "Wall Paper", h: 10, w: 10 },
//         { id: "temple", name: "Temple Design", h: 5, w: 3 },
//         { id: "sofa_panel", name: "Sofa Back Wall Panelling", h: 4, w: 10 },
//         { id: "dining_panel", name: "Dining Wall Panelling", h: 8, w: 6 },
//         { id: "diamond_mirror", name: "Diamond Mirror Wall", h: 8, w: 4 },
//     ],
//     "Master Bedroom": [
//         { id: "wardrobe", name: "Wardrobe", h: 7, w: 6 },
//         { id: "loft", name: "Loft", h: 2, w: 10 },
//         { id: "dressing", name: "Dressing", h: 6, w: 2 },
//         { id: "bed", name: "Bed", h: 1.5, w: 6 },
//         { id: "bed_back_fabric", name: "Bed Back Rest with Fabric", h: 3, w: 6 },
//         { id: "side_table", name: "Side Table", h: 1.5, w: 1.5 },
//         { id: "work_table", name: "Working Table", h: 2.5, w: 4 },
//         { id: "mini_tv", name: "Mini TV Unit", h: 4, w: 4 },
//         { id: "wallpaper_bed", name: "Wall Paper", h: 10, w: 10 },
//         { id: "laminate_panel", name: "Bed Back Wall Laminate Panelling", h: 8, w: 10 },
//     ],
//     "Washroom": [
//         { id: "vanity", name: "Vanity Below Handwash Counter", h: 2, w: 3 },
//         { id: "mirror_shelf", name: "Mirror with Shelfs Behind", h: 3, w: 2 },
//         { id: "shower_partition", name: "Shower Glass Partition", h: 7, w: 3 },
//     ],
//     "Kitchen": [
//         { id: "base_cabinets", name: "Base Cabinets", h: 2.5, w: 12 },
//         { id: "wall_cabinets", name: "Wall Cabinets", h: 2, w: 12 },
//         { id: "tall_unit", name: "Tall Unit", h: 7, w: 2 },
//         { id: "breakfast_counter", name: "Breakfast Counter", h: 3, w: 5 },
//         { id: "loft", name: "Loft", h: 2, w: 8 },
//     ]
// };


const PRODUCT_CATALOG: Record<string, any[]> = {
    "Living Room": [
        { id: "grand_tv", label: "tv unit", name: "TV Unit", h: 8, w: 6 },
        { id: "wardrobe", label: "wardrobe", name: "Wardrobe", h: 7, w: 6 },
        { id: "crockery", label: "crockery unit", name: "Crockery Unit", h: 7, w: 4 },
        { id: "bar_unit", label: "bar unit", name: "Bar Unit", h: 7, w: 3 },
        { id: "book_shelf", label: "book shelf", name: "Book Shelf", h: 7, w: 3 },
        { id: "wallpaper", label: "wall paper", name: "Wall Paper", h: 10, w: 10 },
        { id: "temple", label: "pooja unit", name: "Pooja Unit", h: 5, w: 3 },
        { id: "sofa_panel", label: "sofa back wall panelling", name: "Sofa Back Wall Panelling", h: 4, w: 10 },
        { id: "dining_panel", label: "dining wall panelling", name: "Dining Wall Panelling", h: 8, w: 6 },
        { id: "diamond_mirror", label: "diamond mirror wall", name: "Diamond Mirror Wall", h: 8, w: 4 },
    ],
    "Master Bedroom": [
        { id: "grand_tv", label: "tv unit", name: "TV Unit", h: 8, w: 6 },
        { id: "wardrobe", label: "wardrobe", name: "Wardrobe", h: 7, w: 6 },
        { id: "crockery", label: "crockery unit", name: "Crockery Unit", h: 7, w: 4 },
        { id: "loft", label: "loft", name: "Loft", h: 2, w: 10 },
        { id: "dressing", label: "dressing", name: "Dressing", h: 6, w: 2 },
        { id: "book_shelf", label: "book shelf", name: "Book Shelf", h: 7, w: 3 },
        { id: "bed", label: "bed", name: "Bed", h: 1.5, w: 6 },
        { id: "bed_back_fabric", label: "bed", name: "Bed Back Rest with Fabric", h: 3, w: 6 },
        { id: "wallpaper", label: "wall paper", name: "Wall Paper", h: 10, w: 10 },
        { id: "sofa_panel", label: "sofa back wall panelling", name: "Sofa Back Wall Panelling", h: 4, w: 10 },

        { id: "dining_panel", label: "dining wall panelling", name: "Dining Wall Panelling", h: 8, w: 6 },

        { id: "side_table", label: "sideboard", name: "Side Table", h: 1.5, w: 1.5 },
        { id: "work_table", label: "study table", name: "Working Table", h: 2.5, w: 4 },
        { id: "temple", label: "pooja unit", name: "Pooja Unit", h: 5, w: 3 },
        // { id: "mini_tv", label: "mini tv unit", name: "Mini TV Unit", h: 4, w: 4 },
        { id: "diamond_mirror", label: "diamond mirror wall", name: "Diamond Mirror Wall", h: 8, w: 4 },

        // { id: "wallpaper_bed", label: "wall paper bed", name: "Wall Paper", h: 10, w: 10 },
        // { id: "laminate_panel", label: "bed back wall laminate panelling", name: "Bed Back Wall Laminate Panelling", h: 8, w: 10 },
    ],
    "Washroom": [
        { id: "vanity", label: "vanity unit", name: "Vanity Below Handwash Counter", h: 2, w: 3 },
        { id: "mirror_shelf", label: "mirror with shelfs behind", name: "Mirror with Shelfs Behind", h: 3, w: 2 },
        { id: "shower_partition", label: "shower glass partition", name: "Shower Glass Partition", h: 7, w: 3 },
        { id: "grand_tv", label: "tv unit", name: "TV Unit", h: 8, w: 6 },
        { id: "wallpaper", label: "wall paper", name: "Wall Paper", h: 10, w: 10 },



        { id: "wardrobe", label: "wardrobe", name: "Wardrobe", h: 7, w: 6 },
        { id: "crockery", label: "crockery unit", name: "Crockery Unit", h: 7, w: 4 },
        { id: "loft", label: "loft", name: "Loft", h: 2, w: 8 },
        { id: "dressing", label: "dressing", name: "Dressing", h: 6, w: 2 },
        { id: "book_shelf", label: "book shelf", name: "Book Shelf", h: 7, w: 3 },
        { id: "temple", label: "pooja unit", name: "Pooja Unit", h: 5, w: 3 },
    ],
    "Kitchen": [
        { id: "base_cabinets", label: "kitchen", name: "Base Cabinets", h: 2.5, w: 12 },
        { id: "wall_cabinets", label: "kitchen", name: "Wall Cabinets", h: 2, w: 12 },
        { id: "tall_unit", label: "tall unit", name: "Tall Unit", h: 7, w: 2 },
        { id: "breakfast_counter", label: "breakfast counter", name: "Breakfast Counter", h: 3, w: 5 },
        { id: "loft", label: "loft", name: "Loft", h: 2, w: 8 },
        { id: "temple", label: "pooja unit", name: "Pooja Unit", h: 5, w: 3 },
        { id: "dining_panel", label: "dining wall panelling", name: "Dining Wall Panelling", h: 8, w: 6 },

        { id: "mirror_shelf", label: "mirror with shelfs behind", name: "Mirror with Shelfs Behind", h: 3, w: 2 },
        { id: "shower_partition", label: "shower glass partition", name: "Shower Glass Partition", h: 7, w: 3 },
        { id: "wardrobe", label: "wardrobe", name: "Wardrobe", h: 7, w: 6 },
        { id: "wallpaper", label: "wall paper", name: "Wall Paper", h: 10, w: 10 },
        { id: "grand_tv", label: "tv unit", name: "TV Unit", h: 8, w: 6 },
        { id: "crockery", label: "crockery unit", name: "Crockery Unit", h: 7, w: 4 },
        { id: "dressing", label: "dressing", name: "Dressing", h: 6, w: 2 },
        { id: "book_shelf", label: "book shelf", name: "Book Shelf", h: 7, w: 3 },
    ]
};


// NEW VERSION
// const PRODUCT_CATALOG: Record<string, any[]> = {
//     "Living Room": [
//         { id: "grand_tv", label: "tv unit", name: "Grand TV Unit", h: 8, w: 6, d: 1.25, p: 2, s: 4, dr: 2, sh: 2 },
//         { id: "crockery", label: "crockery unit", name: "Crockery Unit", h: 7, w: 4, d: 1.5, p: 1, s: 4, dr: 2, sh: 4 },
//         { id: "bar_unit", label: "bar unit", name: "Bar Unit", h: 7, w: 3, d: 1.5, p: 1, s: 3, dr: 1, sh: 2 },
//         { id: "book_shelf", label: "book shelf", name: "Book Shelf", h: 7, w: 3, d: 1, p: 1, s: 5, dr: 0, sh: 0 },
//         { id: "wallpaper", label: "wall paper", name: "Wall Paper", h: 10, w: 10, d: 0, p: 0, s: 0, dr: 0, sh: 0, type: "flat" },
//         { id: "temple", label: "pooja unit", name: "Temple Design", h: 5, w: 3, d: 1.5, p: 0, s: 2, dr: 2, sh: 2 },
//         { id: "sofa_panel", label: "sofa back wall panelling", name: "Sofa Back Wall Panelling", h: 4, w: 10, d: 0.1, p: 0, s: 0, dr: 0, sh: 0, type: "panel" },
//         { id: "dining_panel", label: "dining wall panelling", name: "Dining Wall Panelling", h: 8, w: 6, d: 0.1, p: 0, s: 0, dr: 0, sh: 0, type: "panel" },
//         { id: "diamond_mirror", label: "diamond mirror wall", name: "Diamond Mirror Wall", h: 8, w: 4, d: 0.1, p: 0, s: 0, dr: 0, sh: 0, type: "flat" },
//     ],
//     "Master Bedroom": [
//         { id: "wardrobe", label: "wardrobe", name: "Wardrobe", h: 7, w: 6, d: 2, p: 2, s: 6, dr: 2, sh: 3, type: "box" },
//         { id: "loft", label: "loft", name: "Loft", h: 2, w: 10, d: 2, p: 3, s: 0, dr: 0, sh: 5, type: "box" },
//         { id: "dressing", label: "dressing", name: "Dressing", h: 6, w: 2, d: 1, p: 1, s: 3, dr: 1, sh: 1, type: "box" },
//         { id: "bed", label: "bed", name: "Bed", h: 1.5, w: 6, d: 6.5, p: 2, s: 0, dr: 0, sh: 0, type: "bed" },
//         { id: "bed_back_fabric", label: "bed", name: "Bed Back Rest with Fabric", h: 3, w: 6, d: 0.2, p: 0, s: 0, dr: 0, sh: 0, type: "flat" },
//         { id: "side_table", label: "sideboard", name: "Side Table", h: 1.5, w: 1.5, d: 1.5, p: 0, s: 0, dr: 2, sh: 0, type: "box" },
//         { id: "work_table", label: "study table", name: "Working Table", h: 2.5, w: 4, d: 2, p: 0, s: 1, dr: 1, sh: 0, type: "box" },
//         { id: "mini_tv", label: "mini tv unit", name: "Mini TV Unit", h: 4, w: 4, d: 1, p: 0, s: 2, dr: 1, sh: 1, type: "box" },
//         { id: "wallpaper_bed", label: "wall paper bed", name: "Wall Paper", h: 10, w: 10, d: 0, p: 0, s: 0, dr: 0, sh: 0, type: "flat" },
//         { id: "laminate_panel", label: "bed back wall laminate panelling", name: "Bed Back Wall Laminate Panelling", h: 8, w: 10, d: 0.1, p: 0, s: 0, dr: 0, sh: 0, type: "panel" },
//     ],
//     "Washroom": [
//         { id: "vanity", label: "vanity unit", name: "Vanity Below Handwash Counter", h: 2, w: 3, d: 1.5, p: 1, s: 0, dr: 0, sh: 2, type: "box" },
//         { id: "mirror_shelf", label: "mirror with shelfs behind", name: "Mirror with Shelfs Behind", h: 3, w: 2, d: 0.5, p: 0, s: 2, dr: 0, sh: 1, type: "box" },
//         { id: "shower_partition", label: "shower glass partition", name: "Shower Glass Partition", h: 7, w: 3, d: 0, p: 0, s: 0, dr: 0, sh: 0, type: "flat" },
//     ],
//     "Kitchen": [
//         { id: "base_cabinets", label: "kitchen", name: "Base Cabinets", h: 2.5, w: 12, d: 2, p: 6, s: 0, dr: 3, sh: 8, type: "kitchen_base" },
//         { id: "wall_cabinets", label: "kitchen", name: "Wall Cabinets", h: 2, w: 12, d: 1, p: 6, s: 6, dr: 0, sh: 10, type: "kitchen_wall" },
//         { id: "tall_unit", label: "tall unit", name: "Tall Unit", h: 7, w: 2, d: 2, p: 1, s: 4, dr: 0, sh: 1, type: "box" },
//         { id: "breakfast_counter", label: "breakfast counter", name: "Breakfast Counter", h: 3, w: 5, d: 2, p: 0, s: 0, dr: 0, sh: 0, type: "flat" },
//         { id: "loft", label: "loft", name: "Loft", h: 2, w: 8, d: 2, p: 2, s: 0, dr: 0, sh: 4, type: "box" },
//     ]
// };


export const calculateMaterialSqft = (details: any, prodId: string) => {
    const H = Number(details.h || 0);
    const L = Number(details.w || 0); // L refers to width input
    const D = Number(details.d || 0);
    const P = Number(details.p || 0);
    const S = Number(details.s || 0);
    const DR = Number(details.dr || 0);
    const t = 0.5; // Standard drawer height proxy

    // Base Carcass Area (Common to most box units)
    const baseCarcass = 2 * (H * D) + 2 * (L * D) + (L * H);

    // Internal Area Components
    const partitionArea = P * (H * D);
    const shelvesArea = S * (L * D);
    const shuttersArea = 2 * (L * H);
    const drawerAreaPer = (L * D) + (L * t) + (L * t) + 2 * (D * t);
    const totalDrawerArea = DR * drawerAreaPer;

    switch (prodId) {
        case "wardrobe":
            // Formula: Carcass + Partitions + Shelves + Shutters + Drawers
            return baseCarcass + partitionArea + shelvesArea + shuttersArea + totalDrawerArea;

        case "grand_tv":
        case "mini_tv":
            // TV Unit Formula: Carcass + Shelves + Shutters (closed) + Drawers
            return baseCarcass + shelvesArea + shuttersArea + totalDrawerArea;

        case "crockery":
        case "temple":
            // Crockery/Pooja Unit Formula: Carcass + Partitions + Shelves + Shutters + Drawers
            return baseCarcass + partitionArea + shelvesArea + shuttersArea + totalDrawerArea;

        case "shoe_rack":
            // Shoe Rack Formula: Carcass + Shelves + Shutters + Drawers
            return baseCarcass + shelvesArea + shuttersArea + totalDrawerArea;

        case "loft":
            // Loft Formula: Carcass + Shelves + Shutters
            return baseCarcass + shelvesArea + shuttersArea;

        case "base_cabinets":
            // Kitchen Base Formula (uses RFT as L): Carcass + Partitions + Shelves + Shutters + Drawers
            return baseCarcass + partitionArea + shelvesArea + shuttersArea + totalDrawerArea;

        case "wall_cabinets":
            // Kitchen Wall Formula: Carcass + Shelves + Shutters
            return baseCarcass + shelvesArea + shuttersArea;

        case "vanity":
            // Vanity Unit Formula: Carcass + Shelves + Shutters + Drawers
            return baseCarcass + shelvesArea + shuttersArea + totalDrawerArea;

        case "bar_unit":
        case "sideboard":
            // Sideboard/Buffet Formula: Carcass + Partitions + Shelves + Shutters + Drawers
            return baseCarcass + partitionArea + shelvesArea + shuttersArea + totalDrawerArea;

        case "work_table":
            // Study Table Formula: Carcass + Shelves
            return baseCarcass + shelvesArea;

        case "bed":
            // Bed with Storage Formula: Headboard + Box sides + bottom + partitions + Drawers
            const headboard = (L * 3); // Proxy for headboard height
            const bedBox = (L * D) + 2 * (6 * D) + 2 * (L * 1.5); // L x D is bottom
            return headboard + bedBox + totalDrawerArea;

        case "sofa_panel":
        case "dining_panel":
        case "laminate_panel":
        case "wallpaper":
        case "wallpaper_bed":
        case "diamond_mirror":
            // Flat Panel Logic: Simple front area
            return (L * H);

        default:
            // Standard fallback to simple front area for unidentified units
            return (L * H);
    }
};

export default function PreSalesQuoteSingle() {
    const { organizationId, id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);


    // --- PERSISTENT DATA STATE ---
    const [roomCounts, setRoomCounts] = useState<Record<string, number>>({});
    const [globalDimType, setGlobalDimType] = useState<'standard' | 'custom'>('standard');
    const [globalProfitPercentage, setGlobalProfitPercentage] = useState<number>(0);


    //  adding the grouped percentage profirt for each product group
    const [groupProfitMargins, setGroupProfitMargins] = useState<Record<string, number>>({});


    // config structure: [roomId][roomInstanceIdx][productId][productInstanceIdx]
    const [config, setConfig] = useState<any>({});
    const [auditData, setAuditData] = useState({
        mainQuoteName: "New Audit", quoteNo: "QT-PRE-001", carpetArea: 0, bhk: '2 BHK', purpose: 'Move In',

        clientData: {
            clientName: "",
            whatsapp: "",
            email: "",
            location: "",
        },
        projectDetails: {
            projectName: "",
            quoteNo: "",
            dateofIssue: new Date()
        }
    });



    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalFormData, setModalFormData] = useState({ mainQuoteName: "" });


    const { data: quoteData, isLoading,refetch } = useGetSinglePreSalesQuote(id!)
    const { mutateAsync: updateMutation, isPending: updatePending } = useUpdatePreSalesQuote();
    const { mutateAsync: updateMainMutation, isPending: isUpdatingMainQuote } = useUpdateMainPreSalesQuote();




    // --- FETCH DATA HOOK ---

    // --- SYNC API DATA TO LOCAL STATE ---
    useEffect(() => {
        if (quoteData) {
            // Populate Audit Information
            setAuditData({
                mainQuoteName: quoteData?.mainQuoteName,
                quoteNo: quoteData?.quoteNo,
                carpetArea: quoteData?.carpetArea,
                bhk: quoteData?.bhk || "2 BHK",
                purpose: quoteData?.purpose || "Move In",
                clientData: { ...quoteData.clientData, clientName: quoteData.mainQuoteName || "" },
                projectDetails: { ...quoteData.projectDetails, projectName: quoteData.mainQuoteName || "", quoteNo: quoteData.quoteNo }
            });

            // Populate Configuration (Rooms and Products)
            // Assuming your backend stores 'config' and 'roomCounts'
            // if (quoteData.config) setConfig(quoteData?.config);

            // 2. Sync the deep configuration
            if (quoteData.config) {
                setConfig(quoteData.config);

                // 3. 🔹 THE FIX: Derive roomCounts from the config keys
                // If config has "Living Room": { "0": {...}, "1": {...} }, 
                // then Living Room count is 2.
                const derivedCounts: Record<string, number> = {};
                const derivedGroupMargins: Record<string, number> = {};

                Object.entries(quoteData.config).forEach(([roomName, instances]: [string, any]) => {
                    // Count how many keys (instance indices) exist for this room
                    const count = Object.keys(instances).length;
                    if (count > 0) {
                        derivedCounts[roomName] = count;
                    }


                    // Extract group margins from the first instance found for each product
                    Object.values(instances).forEach((products: any) => {
                        Object.entries(products).forEach(([prodId, pInstances]: any) => {
                            const firstUnit = Object.values(pInstances)[0] as any;
                            if (firstUnit && firstUnit.profitPercentage !== undefined) {
                                // Find the product name for the label
                                const productDef = PRODUCT_CATALOG[roomName]?.find((p: any) => p.id === prodId);
                                if (productDef) {
                                    derivedGroupMargins[productDef.name] = firstUnit.profitPercentage;
                                }
                            }
                        });
                    });
                });

                setRoomCounts(derivedCounts);
                setGroupProfitMargins(derivedGroupMargins); // Restore local group margins
            }

            // if (quoteData.roomCounts) setRoomCounts(quoteData?.roomCounts);
            if (quoteData.globalDimType) setGlobalDimType(quoteData?.globalDimType);

            // Restore global percentage from DB
            if (quoteData.globalProfitPercentage !== undefined || quoteData.globalProfitPercentage !== null) {
                setGlobalProfitPercentage(quoteData.globalProfitPercentage);
            }


            if (quoteData.mainQuoteName) setModalFormData({ mainQuoteName: quoteData.mainQuoteName })
        }
    }, [quoteData]);

    const { data: materialBrands } = useGetMaterialBrands(organizationId!, "plywood");
    const { data: innerLaminateBrands } = useGetMaterialBrands(organizationId!, "inner laminate");
    const { data: outerLaminateBrands } = useGetMaterialBrands(organizationId!, "outer laminate");

    const transformBrands = (brands: any[]) => (brands || []).map(b => ({


        id: b._id,
        name: (b.data?.Brand || b.data?.brand || "Generic"),
        cost: parseFloat(b.data?.manufacturCostPerSqft || 0),
        thickness: b.data?.["thickness (mm)"] || b.data?.thickness || 0,
        rs: parseFloat(b.data?.Rs || b.data?.rs || 0),
        // CRITICAL: Pass the full data object so the child can find "TV Unit", "Wardrobe", etc.
        data: b.data
    }));

    const plywoodOptions = useMemo(() => transformBrands(materialBrands), [materialBrands]);

    const innerOptions = useMemo(() => transformBrands(innerLaminateBrands), [innerLaminateBrands]);
    const outerOptions = useMemo(() => transformBrands(outerLaminateBrands), [outerLaminateBrands]);


    const [globalPlywood, setGlobalPlywood] = useState("");
    const [globalInner, setGlobalInner] = useState("");
    const [globalOuter, setGlobalOuter] = useState("");

    const updateAllProductsGlobally = (type: 'plywood' | 'inner' | 'outer', opt: any) => {
        // if (!opt) return;

        const selectedId = opt?.id || "";

        // Update the dropdown UI state
        if (type === 'plywood') setGlobalPlywood(selectedId);
        if (type === 'inner') setGlobalInner(selectedId);
        if (type === 'outer') setGlobalOuter(selectedId);

        setConfig((prev: any) => {
            const newConfig = { ...prev };
            Object.keys(newConfig).forEach(roomId => {
                Object.keys(newConfig[roomId]).forEach(rIdx => {
                    Object.keys(newConfig[roomId][rIdx]).forEach(prodId => {
                        Object.keys(newConfig[roomId][rIdx][prodId]).forEach(pIdx => {
                            const isLaminate = type === 'inner' || type === 'outer';
                            newConfig[roomId][rIdx][prodId][pIdx] = {
                                ...newConfig[roomId][rIdx][prodId][pIdx],
                                [`${type}Id`]: selectedId,
                                [`${type}Name`]: opt?.name,
                                [`${type}Cost`]: isLaminate ? 0 : opt?.cost,
                                [`${type}Thickness`]: opt?.thickness,
                                [`${type}Rs`]: opt?.rs || opt?.Rs
                            };
                        });
                    });
                });
            });
            return newConfig;
        });
    };

    const updateProductInstance = (roomId: string, rIdx: number, prodId: string, pIdx: number, updates: any) => {
        setConfig((prev: any) => {
            const rooms = { ...prev };
            if (!rooms[roomId]) rooms[roomId] = {};
            if (!rooms[roomId][rIdx]) rooms[roomId][rIdx] = {};
            if (!rooms[roomId][rIdx][prodId]) rooms[roomId][rIdx][prodId] = {};
            rooms[roomId][rIdx][prodId][pIdx] = { ...rooms[roomId][rIdx][prodId][pIdx], ...updates };
            return rooms;
        });
    };




    // Function to update group margins
    const updateGroupMargin = (groupLabel: string, value: number) => {
        setGroupProfitMargins(prev => ({ ...prev, [groupLabel]: value }));
    };

    // Sync Global Margin to all groups when Global Margin changes
    // useEffect(() => {
    //     const updatedMargins: Record<string, number> = {};
    //     // Get all unique product names from the current grouped units logic
    //     // or simply update all existing keys
    //     Object.keys(groupProfitMargins).forEach(key => {
    //         updatedMargins[key] = globalProfitPercentage;
    //     });
    //     setGroupProfitMargins(updatedMargins);
    // }, [globalProfitPercentage]);




    //  old version before having the group changes profit percentage for prudcts
    // const { grandTotal } = useMemo(() => {
    //     let total = 0;
    //     let area = 0;

    //     const profitMultiplier = 1 + (globalProfitPercentage / 100);

    //     Object.values(config).forEach((roomInstances: any) => {
    //         Object.values(roomInstances).forEach((products: any) => {
    //             Object.values(products).forEach((instances: any) => {
    //                 Object.values(instances).forEach((p: any) => {
    //                     const unitArea = parseFloat(p.h || 0) * parseFloat(p.w || 0);
    //                     // Using the .cost (mfgCost) fields we saved in Step 4
    //                     const totalRate =
    //                         parseFloat(p.plywoodCost || 0)
    //                     // parseFloat(p.innerCost || 0) +
    //                     // parseFloat(p.outerCost || 0);

    //                     total += (unitArea * totalRate) * profitMultiplier;
    //                     area += unitArea;
    //                 });
    //             });
    //         });
    //     });

    //     return { grandTotal: total, totalArea: area };
    // }, [config, globalProfitPercentage]);


    const { grandTotal } = useMemo(() => {
        let total = 0;
        Object.entries(config).forEach(([roomId, roomInsts]: any) => {
            Object.entries(roomInsts).forEach(([_rIdx, products]: any) => {
                Object.entries(products).forEach(([prodId, instances]: any) => {
                    // Find group name to get specific margin
                    const productDef = PRODUCT_CATALOG[roomId]?.find((p: any) => p.id === prodId);
                    const groupLabel = productDef?.name || "other";

                    // Use group-specific margin, fallback to global
                    const margin = groupProfitMargins[groupLabel] ?? globalProfitPercentage;
                    const multiplier = 1 + (margin / 100);

                    Object.values(instances).forEach((p: any) => {
                        const unitArea = parseFloat(p.h || 0) * parseFloat(p.w || 0);
                        const plywoodRate = parseFloat(p.plywoodCost || 0);
                        total += (unitArea * plywoodRate) * multiplier;
                    });
                });
            });
        });
        return { grandTotal: total };
    }, [config, globalProfitPercentage, groupProfitMargins]);




    // const sqftRate = totalArea > 0 ? (grandTotal / totalArea) : 0;


    // Helper to calculate total for a specific instance of a room
    // const calculateSpecificRoomTotal = (roomName: string, index: number) => {
    //     const roomInstance = config[roomName]?.[index];
    //     if (!roomInstance) return 0;
    //     let total = 0;
    //     Object.values(roomInstance).forEach((products: any) => {
    //         Object.values(products).forEach((p: any) => {
    //             total += (parseFloat(p.h || 0) * parseFloat(p.w || 0)) * (parseFloat(p.plywoodCost || 0) + parseFloat(p.innerCost || 0) + parseFloat(p.outerCost || 0));
    //         });
    //     });
    //     return total;
    // };


    // const extractRoomProducts = (roomName: string, index: number) => {
    //     // roomInstance is something like: { "grand_tv": { "0": {...} }, "crockery": { "0": {...} } }
    //     const roomInstance = config[roomName]?.[index];
    //     if (!roomInstance) return [];

    //     // We need to iterate through categories (grand_tv) and then their instances ("0")
    //     return Object.entries(roomInstance).flatMap(([prodId, categoryInstances]: [string, any]) => {
    //         return Object.entries(categoryInstances).map(([_instIdx, p]: [string, any]) => ({
    //             furnitureName: p.name || prodId.replace(/_/g, ' '), // Clean up grand_tv to "grand tv"
    //             width: p.w || 0,
    //             height: p.h || 0,
    //             depth: p.d || 2,
    //             dimensionType: p.dimensionType,
    //             // IMPORTANT: Map these to the keys used in PreSalesQuoteType4
    //             plywoodBrand: p.plywoodName,
    //             innerLaminateBrand: p.innerName,
    //             outerLaminateBrand: p.outerName,
    //             fittingsAndAccessories: p.fittingsAndAccessories || []
    //         }));
    //     });
    // };

    const handleUpdate = async () => {
        try {


            // 1. Process the config to inject the engineering Scope of Work for every unit
            const processedConfig = JSON.parse(JSON.stringify(config)); // Deep clone to avoid mutating state

            Object.entries(processedConfig).forEach(([roomId, roomInsts]: any) => {
                Object.entries(roomInsts).forEach(([rIdx, products]: any) => {
                    Object.entries(products).forEach(([prodId, instances]: any) => {


                        // 1. Determine the profit margin for this specific product group
                        const productDef = PRODUCT_CATALOG[roomId]?.find((p: any) => p.id === prodId);
                        const groupLabel = productDef?.name || "other";

                        // Priority: Group specific % > Global % > 0
                        const margin = groupProfitMargins[groupLabel] ?? globalProfitPercentage ?? 0;
                        const multiplier = 1 + (margin / 100);


                        Object.entries(instances).forEach(([pIdx, details]: any) => {


                            // OLD VERSION
                            // 1. RECALCULATE PRICE (Because details.productTotal might be undefined here)
                            const unitArea = Number(details.h || 0) * Number(details.w || 0);
                            const totalMaterialRate =
                                Number(details.plywoodCost || 0)
                            // Number(details.innerCost || 0) +
                            // Number(details.outerCost || 0);

                            const calculatedPrice = (unitArea * totalMaterialRate) * multiplier;


                            // ✅ FIX 1: Use the technical materialArea formula
                            // const materialArea = calculateMaterialSqft(details, prodId);

                            // const totalMaterialRate =
                            //     Number(details.plywoodCost || 0) +
                            //     Number(details.innerCost || 0) +
                            //     Number(details.outerCost || 0);

                            // // ✅ FIX 2: Calculate price based on Material Area (e.g., 144 SQFT)
                            // const calculatedPrice = materialArea * totalMaterialRate;


                            // --- START SCOPE GENERATION LOGIC ---
                            const plyBrand = details.plywoodName;
                            const outerBrand = details.outerName;
                            const innerBrand = details.innerName;

                            const uniqueFittings = (details.fittingsAndAccessories || [])
                                .map((f: any) => f.brandName)
                                .filter(Boolean)
                                .join(", ");

                            const dimParts = [];
                            if (details.w > 0) dimParts.push(`${details.w} ft (Width)`);
                            if (details.h > 0) dimParts.push(`${details.h} ft (Height)`);

                            let sentences = [];

                            // Substrate
                            sentences.push(plyBrand
                                ? `Primary structural fabrication utilizes ${plyBrand} substrate to ensure core dimensional stability.`
                                : `Structural fabrication is executed using specified core substrates to maintain architectural integrity.`);

                            // Exterior
                            sentences.push(outerBrand
                                ? `Exterior surfaces are finished with ${outerBrand} cladding for high-wear resistance.`
                                : `Exterior surfaces involve technical cladding applied to ensure surface protection.`);

                            // Interior & Hardware
                            const hardwarePart = uniqueFittings ? ` and integrated with ${uniqueFittings} hardware systems` : "";
                            sentences.push(innerBrand
                                ? `Internal reinforcement includes ${innerBrand} liner application${hardwarePart} to achieve a balanced seal.`
                                : `Internal reinforcement utilizes technical liners to maintain structural equilibrium.`);

                            // Dimensions
                            if (dimParts.length > 0) {
                                sentences.push(`Technical assembly is manufactured to precise engineering specifications of ${dimParts.join(" x ")}.`);
                            }

                            sentences.push(`Final execution follows a modular installation protocol focusing on precision edge-sealing.`);

                            // Inject the generated string into this specific unit
                            processedConfig[roomId][rIdx][prodId][pIdx].scopeOfWork = sentences.join(" ");
                            // --- END SCOPE GENERATION LOGIC ---


                            // 2. INJECT THE PROPER NAME INTO THE DB RECORD
                            // This ensures it saves as "Pooja Unit" or "Grand TV Unit"
                            processedConfig[roomId][rIdx][prodId][pIdx].furnitureName = productDef?.name || prodId.replace(/_/g, ' ').toUpperCase();

                            // 4. Store the specific margin used for this unit in the DB
                            processedConfig[roomId][rIdx][prodId][pIdx].profitPercentage = margin;
                            processedConfig[roomId][rIdx][prodId][pIdx].productTotal = calculatedPrice;

                            // 5. Update the totals object for PDF consistency
                            processedConfig[roomId][rIdx][prodId][pIdx].totals = {
                                furnitureTotal: calculatedPrice || 0,
                                core: calculatedPrice || 0,
                                fittings: 0,
                                glues: 0,
                                nbms: 0
                            };


                            // FIX: Assigning the calculatedPrice to furnitureTotal and core material
                            // processedConfig[roomId][rIdx][prodId][pIdx].totals = {
                            //     furnitureTotal: calculatedPrice || 0,
                            //     core: calculatedPrice || 0, // This ensures the row in PDF Table is populated
                            //     fittings: 0,
                            //     glues: 0,
                            //     nbms: 0
                            // };

                            // // Also update the top-level productTotal if needed for reload consistency
                            // processedConfig[roomId][rIdx][prodId][pIdx].productTotal = calculatedPrice;
                        });
                    });
                });
            });

            // 2. Prepare the final payload matching your Schema
            const payload = {
                carpetArea: auditData.carpetArea || 0,
                bhk: auditData.bhk,
                purpose: auditData.purpose,

                clientData: {
                    clientName: auditData.clientData?.clientName || "",
                    whatsapp: auditData.clientData?.whatsapp || "",
                    email: auditData.clientData?.email || "",
                    location: auditData.clientData?.location || "",
                },

                projectDetails: {
                    projectName: auditData.projectDetails?.projectName || "",
                    quoteNo: auditData.projectDetails?.quoteNo || auditData.quoteNo || "",
                    dateOfIssue: auditData.projectDetails?.dateofIssue || new Date()
                },

                // We send the PROCESSED config with all Scope of Work strings included
                config: processedConfig,

                globalProfitPercentage: globalProfitPercentage || 0,
                roomCounts: roomCounts,
                globalDimType: globalDimType,
                totalAmount: grandTotal,
                status: "draft"
            };

            const response = await updateMutation({
                id: id!,
                payload: payload
            });


            if(response?.ok){
                refetch();
                setStep(5)
            }



            console.log("Update success:", response);
            // toast({
            //     title: "Success",
            //     description: "Technical audit saved successfully",
            //     variant: "default"
            // });

        } catch (error: any) {
            console.error("Update error:", error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to save audit",
                variant: "destructive"
            });
        }
    };



    const handleUpdateMainQuote = async () => {
        if (!modalFormData.mainQuoteName) {
            toast({
                title: "Error",
                description: "Please enter quote name",
                variant: "destructive"
            });
            return;
        }

        try {
            const response = await updateMainMutation({
                id: id!, // 🔥 important
                mainQuoteName: modalFormData.mainQuoteName
            });

            console.log("update response", response);

            toast({
                title: "Success",
                description: "Quote name updated successfully"
            });

            setIsModalOpen(false);
            setModalFormData({ mainQuoteName: "" });

        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to update",
                variant: "destructive"
            });
        }
    };




    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <i className="fas fa-circle-notch fa-spin text-4xl text-blue-600"></i>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Technical Audit...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen max-h-full overflow-y-auto bg-[#F8FAFC] flex flex-col">


            {/* 🔹 ADD THIS STYLE BLOCK HERE */}
            {/* <style>
                {`
                @media print {
                    
                    body * {
                        visibility: hidden !important;
                    }

                    
                    #printable-quote, #printable-quote * {
                        visibility: visible !important;
                    }

                    
                    #printable-quote {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 20px !important; 
                        border: none !important;
                        box-shadow: none !important;
                    }

                    
                    html, body {
                        height: auto !important;
                        overflow: visible !important;
                        background: white !important;
                    }

                    
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    
                    header, .no-print, button, nav {
                        display: none !important;
                    }
                }
                `}
            </style> */}


            {isModalOpen && (
                <CreatePreSalesQuoteModal
                    formData={modalFormData}
                    setFormData={setModalFormData}
                    setModalOpen={setIsModalOpen}
                    isEditing={true}
                    handleSubmit={handleUpdateMainQuote}
                    isSubmitting={isUpdatingMainQuote}
                />
            )}



            <header className="sticky top-0 z-[110] bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200"><i className="fas fa-arrow-left" /></button>
                    <div>
                        <div className='flex gap-2 items-center'>

                            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">{auditData.mainQuoteName}</h1>


                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    // setModalFormData({ mainQuoteName: datamainQuoteName });
                                    setIsModalOpen(true);
                                }}
                            >
                                <i className="fas fa-pen text-sm text-gray-600"></i>
                            </Button>
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase">{auditData.quoteNo} • {auditData.bhk}</p>
                    </div>
                </div>
                {/* <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={`h-1.5 w-10 rounded-full transition-all duration-300 ${step >= s ? 'bg-blue-600' : 'bg-slate-100'}`} />
                    ))}
                </div> */}


                {/* Professional Step Indicator: 1 - 2 - 3 - 4 - 5 */}
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="flex items-center">
                            {/* Step Circle */}
                            <div
                            onClick={()=> setStep(s)}
                                className={`w-8 h-8 cursor-pointer rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-2 
                                    ${s === 5 ? 'rounded-full px-4 min-w-[70px]' : 'w-8 rounded-full'}
                                    ${step >= s
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'bg-white border-slate-200 text-slate-400'
                                    }`}
                            >
                                {s === 5 ? "Quote" : s}
                            </div>

                            {/* Connecting Line (Only show between circles) */}
                            {s < 5 && (
                                <div
                                    className={`w-6 h-0.5 transition-all duration-500 ${step > s ? 'bg-blue-600' : 'bg-slate-100'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 md:py-2 custom-scrollbar">
                {step === 1 && (
                    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mt-10">
                        <label className="text-[10px] font-black uppercase text-slate-500 block mb-3 tracking-widest">Total Area (SQFT)</label>
                        <Input
                            type="number"
                            className="h-14 text-2xl font-bold text-slate-900 mb-8 border-slate-300 focus:border-indigo-500 transition-colors cursor-pointer"
                            value={auditData.carpetArea || ""}
                            // onChange={(e) => setAuditData({ ...auditData, carpetArea: Math.max(0, Number(e.target.value)) })}
                            onChange={(e) => {
                                const val = e.target.value;
                                setAuditData({
                                    ...auditData,
                                    // If the user clears the input, set it to 0 in the state
                                    carpetArea: val === "" ? 0 : Math.max(0, Number(val))
                                });
                            }}
                        />

                        <label className="text-[10px] font-black uppercase text-slate-500 block mb-3 tracking-widest">BHK</label>
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa'].map(b => (
                                <button
                                    key={b}
                                    onClick={() => setAuditData({ ...auditData, bhk: b })}
                                    className={`py-3.5 cursor-pointer rounded-xl text-[11px] font-bold transition-all duration-200 border-2 ${auditData.bhk === b
                                        ? 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-100'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-purple-200 hover:text-slate-900'
                                        }`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>

                        <label className="text-[10px] font-black uppercase text-slate-500 block mb-3 tracking-widest">Project Intent</label>
                        <div className="grid grid-cols-3 gap-3 mb-10">
                            {['Move In', 'Rent Out', 'Renovate'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setAuditData({ ...auditData, purpose: p })}
                                    className={`py-3.5 cursor-pointer rounded-xl text-[11px] font-bold transition-all duration-200 border-2 ${auditData.purpose === p
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-slate-900'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <hr className="border-slate-100 mb-10" />


                        {/* --- NEW SECTION: CLIENT & PROJECT DETAILS --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-10">
                            {/* Client Details Column */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Client Information</h3>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Client Name</label>
                                    <Input
                                        placeholder="Client Name"
                                        value={auditData.clientData.clientName}
                                        onChange={(e) => setAuditData({
                                            ...auditData,
                                            clientData: { ...auditData.clientData, clientName: e.target.value }
                                        })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                                    <Input
                                        placeholder="Phone Number"
                                        value={auditData.clientData.whatsapp}
                                        maxLength={10}
                                        onChange={(e) => setAuditData({
                                            ...auditData,
                                            clientData: { ...auditData.clientData, whatsapp: e.target.value }
                                        })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="Client Email"
                                        value={auditData.clientData.email}
                                        onChange={(e) => setAuditData({
                                            ...auditData,
                                            clientData: { ...auditData.clientData, email: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>

                            {/* Project Details Column */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-purple-600 uppercase tracking-[0.2em] mb-4">Project Context</h3>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Project/Site Name</label>
                                    <Input
                                        placeholder="Skyline Residency"
                                        value={auditData.projectDetails.projectName}
                                        onChange={(e) => setAuditData({
                                            ...auditData,
                                            projectDetails: { ...auditData.projectDetails, projectName: e.target.value }
                                        })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Site Location</label>
                                    <Input
                                        placeholder=""
                                        value={auditData.clientData.location}
                                        onChange={(e) => setAuditData({
                                            ...auditData,
                                            clientData: { ...auditData.clientData, location: e.target.value }
                                        })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Quote Reference</label>
                                    <Input
                                        value={auditData.projectDetails.quoteNo}
                                        onChange={(e) => setAuditData({ ...auditData, quoteNo: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>



                        <div className="flex justify-end gap-3 items-center pt-8 border-t border-slate-100">
                            <div className="flex-1" />
                            <Button
                                className="cursor-pointer px-10 h-10 font-bold uppercase text-[10px] tracking-widest bg-slate-900 text-white shadow-md rounded-lg hover:!bg-black transition-all"
                                onClick={() => setStep(2)}
                            >
                                Step {step + 1} <i className="fas fa-chevron-right ml-2 text-[7px]" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="w-full px-4 space-y-4 animate-in fade-in duration-500">
                        <div className="text-center space-y-1">
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Room Selection</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
                            {ROOM_LIST.map(room => {
                                const count = roomCounts[room] || 0;
                                const isSelected = count > 0;

                                return (
                                    <div
                                        key={room}
                                        onClick={() => !isSelected && setRoomCounts(p => ({ ...p, [room]: 1 }))}
                                        className={`group bg-white relative rounded-xl border-2 transition-all duration-200 min-h-[70px] flex items-center justify-between px-4 cursor-pointer ${isSelected
                                            ? 'border-blue-500 shadow-lg shadow-blue-50'
                                            : 'border-slate-100 hover:border-blue-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={(e) => {
                                                    if (isSelected) {
                                                        e.stopPropagation();
                                                        setRoomCounts(p => ({ ...p, [room]: 0 }));
                                                    }
                                                }}
                                                className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${isSelected
                                                    ? 'bg-blue-600 border-blue-600'
                                                    : 'bg-white border-slate-300 group-hover:border-blue-400'
                                                    }`}
                                            >
                                                {isSelected && <i className="fas fa-check text-[8px] text-white" />}
                                            </div>

                                            <span className={`text-sm uppercase tracking-wide transition-colors ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'
                                                }`}>
                                                {room}
                                            </span>
                                        </div>


                                        {isSelected && (
                                            <div
                                                className="flex items-center gap-2 bg-slate-50 p-1 rounded-full border border-slate-200 flex-shrink-0 animate-in slide-in-from-right-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Minus Button */}
                                                <button
                                                    onClick={() => setRoomCounts(p => ({ ...p, [room]: Math.max(1, count - 1) }))}
                                                    className="w-6 h-6 cursor-pointer rounded-full bg-white text-slate-500 hover:text-slate-800 shadow-sm flex items-center justify-center transition-all active:scale-90"
                                                >
                                                    <i className="fas fa-minus text-[8px]" />
                                                </button>

                                                {/* Quantity Display */}
                                                <span className="text-xs font-bold text-slate-700 min-w-[14px] text-center">
                                                    {count}
                                                </span>

                                                {/* Plus Button */}
                                                <button
                                                    onClick={() => setRoomCounts(p => ({ ...p, [room]: count + 1 }))}
                                                    className="w-6 h-6 cursor-pointer rounded-full bg-white text-slate-500 hover:text-emerald-600 shadow-sm flex items-center justify-center transition-all active:scale-90"
                                                >
                                                    <i className="fas fa-plus text-[8px]" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-blue-600">{Object.values(roomCounts).filter(c => c > 0).length}</span> Areas Defined
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    className="px-6 h-10 font-bold uppercase text-[10px] tracking-widest rounded-lg cursor-pointer border border-slate-200"
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </Button>
                                <Button
                                    className="px-8 h-10 font-bold uppercase text-[10px] tracking-widest shadow-md rounded-lg bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white"
                                    onClick={() => setStep(3)}
                                >
                                    Step {step + 1} <i className="fas fa-chevron-right ml-2 text-[7px]" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}


                {/*  OLD VERSION */}

                {step === 3 && (
                    <div className="w-full px-4 space-y-6 animate-in fade-in duration-500">
                        <div className="bg-slate-900 p-4 rounded-2xl flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                                    <i className="fas fa-ruler-combined text-xs" />
                                </div>
                                <span className="text-xs font-medium text-slate-300 uppercase tracking-widest">Dimension Model</span>
                            </div>



                            <div className="flex gap-2 items-center">
                                <InfoTooltip position="bottom" content="Switching from Customized to Standard will remove all the dimension values entered in Customized type" />
                                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                                    {/* <button onClick={() => setGlobalDimType('standard')} className={`px-6 py-1.5 text-[10px] font-medium rounded-lg transition-all ${globalDimType === 'standard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>STANDARD</button> */}

                                    <button
                                        onClick={() => {
                                            setGlobalDimType('standard');
                                            // Reset all selected products to Catalog defaults
                                            Object.entries(config).forEach(([roomId, roomInsts]: any) => {
                                                Object.entries(roomInsts).forEach(([rIdx, products]: any) => {
                                                    Object.entries(products).forEach(([prodId, instances]: any) => {
                                                        const catalogItem = PRODUCT_CATALOG[roomId]?.find((p: any) => p.id === prodId);
                                                        if (catalogItem) {
                                                            Object.keys(instances).forEach((pIdx) => {
                                                                updateProductInstance(roomId, parseInt(rIdx), prodId, parseInt(pIdx), {
                                                                    h: catalogItem.h,
                                                                    w: catalogItem.w
                                                                });
                                                            });
                                                        }
                                                    });
                                                });
                                            });
                                        }}
                                        className={`px-6 py-1.5 text-[10px] font-medium rounded-lg transition-all ${globalDimType === 'standard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        STANDARD
                                    </button>


                                    <button onClick={() => setGlobalDimType('custom')} className={`px-6 py-1.5 text-[10px] font-medium rounded-lg transition-all ${globalDimType === 'custom' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>CUSTOMIZED</button>
                                </div>
                            </div>

                        </div>

                        <div className="space-y-8">
                            {Object.entries(roomCounts).filter(([_, count]) => count > 0).map(([roomId, count]) => (
                                <div key={roomId} className="space-y-4">
                                    {Array.from({ length: count }).map((_, rIdx) => (
                                        <div key={rIdx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                                                <span className="bg-indigo-600 text-white w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shadow-sm">{rIdx + 1}</span>
                                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                                    {roomId}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {(PRODUCT_CATALOG[roomId] || []).map(prod => {
                                                    const pInstances = config[roomId]?.[rIdx]?.[prod.id] || {};
                                                    const pQty = Object.keys(pInstances).length;
                                                    const isSel = pQty > 0;

                                                    // const isRunningFeetUnit = prod.id === 'base_cabinets' || prod.id === 'wall_cabinets';

                                                    return (
                                                        <div
                                                            key={prod.id}
                                                            onClick={() => !isSel && updateProductInstance(roomId, rIdx, prod.id, 0, { h: globalDimType === 'custom' ? 0 : prod.h, w: globalDimType === 'custom' ? 0 : prod.w })}
                                                            className={`p-3 rounded-2xl border transition-all duration-200 bg-white ${isSel ? 'border-indigo-500 shadow-md ring-1 ring-indigo-50' : 'border-slate-200 hover:border-slate-300 cursor-pointer'}`}
                                                        >

                                                            <div className="flex items-center justify-between gap-3 mb-3">
                                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                    <div
                                                                        onClick={(e) => {
                                                                            if (isSel) {
                                                                                e.stopPropagation();
                                                                                const nRoom = { ...config[roomId] };
                                                                                delete nRoom[rIdx][prod.id];
                                                                                setConfig({ ...config, [roomId]: nRoom });
                                                                            }
                                                                        }}
                                                                        className={`w-5 h-5 flex-shrink-0 rounded-md border flex items-center justify-center transition-all ${isSel ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}
                                                                    >
                                                                        {isSel && <i className="fas fa-check text-[8px] text-white" />}
                                                                    </div>
                                                                    <span className={`text-[11px] uppercase tracking-wide truncate ${isSel ? 'text-slate-800 font-semibold' : 'font-semibold text-slate-800'}`}>
                                                                        {prod.name}
                                                                    </span>
                                                                </div>

                                                                {isSel && (
                                                                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                                        <button
                                                                            onClick={() => { if (pQty > 1) { const nRoom = { ...config[roomId] }; delete nRoom[rIdx][prod.id][pQty - 1]; setConfig({ ...config, [roomId]: nRoom }); } }}
                                                                            className="w-7 h-7 cursor-pointer rounded-full bg-white text-slate-500 hover:text-rose-500 shadow-sm flex items-center justify-center transition-all active:scale-90"
                                                                        >
                                                                            <i className="fas fa-minus text-[9px]" />
                                                                        </button>

                                                                        <span className="text-xs font-black text-slate-700 min-w-[16px] text-center">{pQty}</span>

                                                                        <button
                                                                            onClick={() => updateProductInstance(roomId, rIdx, prod.id, pQty, { h: globalDimType === 'custom' ? 0 : prod.h, w: globalDimType === 'custom' ? 0 : prod.w })}
                                                                            className="w-7 h-7 cursor-pointer rounded-full bg-white text-slate-500 hover:text-emerald-500 shadow-sm flex items-center justify-center transition-all active:scale-90"
                                                                        >
                                                                            <i className="fas fa-plus text-[9px]" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {isSel && (
                                                                <div className="space-y-1.5 pt-2 border-t border-slate-50 animate-in fade-in">
                                                                    {globalDimType === 'standard' ? (


                                                                        <div className="flex items-center justify-center gap-6 py-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
                                                                            <div className="flex flex-col items-center">
                                                                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Height</span>
                                                                                <span className="text-base font-bold text-slate-700">
                                                                                    {pInstances[0]?.h || prod.h}
                                                                                </span>
                                                                            </div>

                                                                            <span className="text-slate-300 text-lg font-light mt-3">×</span>

                                                                            <div className="flex flex-col items-center">

                                                                                <span className={`text-[9px] font-black uppercase tracking-widest mb-1 text-amber-600`}>
                                                                                    {/* {isRunningFeetUnit ? "Running Ft" : "Width"} */}
                                                                                    Width
                                                                                </span>
                                                                                <span className="text-base font-bold text-slate-700">
                                                                                    {pInstances[0]?.w || prod.w}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ) : (



                                                                        Object.entries(pInstances).map(([pIdx, pData]: any) => (
                                                                            <div key={pIdx} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                                                                                <span className="text-[7px] font-bold text-indigo-400 w-5">U{parseInt(pIdx) + 1}</span>

                                                                                <div className="flex items-center gap-2 flex-1">
                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter ml-1">Height</span>
                                                                                        <Input
                                                                                            type="number"
                                                                                            value={pData.h || ""}
                                                                                            onChange={(e) => {
                                                                                                const val = e.target.value;
                                                                                                updateProductInstance(roomId, rIdx, prod.id, parseInt(pIdx), { h: val === "" ? 0 : Math.max(0, parseFloat(val)) }
                                                                                                )
                                                                                            }
                                                                                            }
                                                                                            className="h-7 w-12 text-[10px] font-medium border-emerald-100 bg-emerald-50/30 focus:border-emerald-400 focus:bg-white p-1 transition-colors"
                                                                                            placeholder="H"
                                                                                        />
                                                                                    </div>

                                                                                    <span className="text-[8px] text-slate-300 mt-3">×</span>

                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <span className={`text-[8px] font-black uppercase  ml-1 
                                                                                            text-amber-600`
                                                                                        }>
                                                                                            {/* {isRunningFeetUnit ? "Running Ft" : "Width"} */}
                                                                                            Width
                                                                                        </span>
                                                                                        <Input
                                                                                            type="number"
                                                                                            value={pData.w || ""}
                                                                                            onChange={(e) => {
                                                                                                const val = e.target.value;

                                                                                                updateProductInstance(roomId, rIdx, prod.id, parseInt(pIdx), { w: val === "" ? 0 : Math.max(0, parseFloat(val)) })
                                                                                            }
                                                                                            }

                                                                                            className="h-7 w-12 text-[10px] font-medium border-amber-100 bg-amber-50/30 focus:border-amber-400 focus:bg-white p-1 transition-colors"
                                                                                            // placeholder={isRunningFeetUnit ? "R.FT" : "W"}
                                                                                            placeholder={"W"}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 items-center pt-8 border-t border-slate-100">
                            <Button variant="secondary" className="px-6 h-10 font-medium uppercase text-[10px] tracking-widest rounded-lg " onClick={() => setStep(2)}>Back</Button>
                            <Button className="px-10 h-10 font-medium uppercase text-[10px] tracking-widest bg-indigo-600 shadow-sm rounded-lg hover:bg-indigo-700" onClick={() => setStep(4)}>
                                Step {step + 1}  <i className="fas fa-chevron-right ml-2 text-[7px]" />
                            </Button>
                        </div>
                    </div>
                )}


                {/*  NEW VERSION */}
                {/* {step === 3 && (
                    <div className="w-full px-4 space-y-6 animate-in fade-in duration-500">
                        <div className="bg-slate-900 p-4 rounded-2xl flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                                    <i className="fas fa-ruler-combined text-xs" />
                                </div>
                                <span className="text-xs font-medium text-slate-300 uppercase tracking-widest">Dimension Model</span>
                            </div>
                            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                                <button onClick={() => setGlobalDimType('standard')} className={`px-6 py-1.5 text-[10px] font-medium rounded-lg transition-all ${globalDimType === 'standard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>STANDARD</button>
                                <button onClick={() => setGlobalDimType('custom')} className={`px-6 py-1.5 text-[10px] font-medium rounded-lg transition-all ${globalDimType === 'custom' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>CUSTOMIZED</button>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {Object.entries(roomCounts).filter(([_, count]) => count > 0).map(([roomId, count]) => (
                                <div key={roomId} className="space-y-4">
                                    {Array.from({ length: count }).map((_, rIdx) => (
                                        <div key={rIdx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                                                <span className="bg-indigo-600 text-white w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shadow-sm">{rIdx + 1}</span>
                                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                                    {roomId}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {(PRODUCT_CATALOG[roomId] || []).map(prod => {
                                                    const pInstances = config[roomId]?.[rIdx]?.[prod.id] || {};
                                                    const pQty = Object.keys(pInstances).length;
                                                    const isSel = pQty > 0;

                                                    const isRunningFeetUnit = prod.id === 'base_cabinets' || prod.id === 'wall_cabinets';

                                                    // Use your existing formula to show live calculation
                                                    // const getDisplayArea = (data: any) => calculateMaterialSqft(data, prod.id).toFixed(1);

                                                    return (
                                                        <div
                                                            key={prod.id}
                                                            onClick={() => !isSel && updateProductInstance(roomId, rIdx, prod.id, 0, { h: globalDimType === 'custom' ? 0 : prod.h, w: globalDimType === 'custom' ? 0 : prod.w })}
                                                            className={`p-3 rounded-2xl border transition-all duration-200 bg-white ${isSel ? 'border-indigo-500 shadow-md ring-1 ring-indigo-50' : 'border-slate-200 hover:border-slate-300 cursor-pointer'}`}
                                                        >

                                                            <div className="flex items-center justify-between gap-3 mb-3">
                                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                    <div
                                                                        onClick={(e) => {
                                                                            if (isSel) {
                                                                                e.stopPropagation();
                                                                                const nRoom = { ...config[roomId] };
                                                                                delete nRoom[rIdx][prod.id];
                                                                                setConfig({ ...config, [roomId]: nRoom });
                                                                            }
                                                                        }}
                                                                        className={`w-5 h-5 flex-shrink-0 rounded-md border flex items-center justify-center transition-all ${isSel ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}
                                                                    >
                                                                        {isSel && <i className="fas fa-check text-[8px] text-white" />}
                                                                    </div>
                                                                    <span className={`text-[11px] uppercase tracking-wide truncate ${isSel ? 'text-slate-800 font-semibold' : 'font-semibold text-slate-800'}`}>
                                                                        {prod.name}
                                                                    </span>
                                                                </div>

                                                                {isSel && (
                                                                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                                        <button
                                                                            onClick={() => { if (pQty > 1) { const nRoom = { ...config[roomId] }; delete nRoom[rIdx][prod.id][pQty - 1]; setConfig({ ...config, [roomId]: nRoom }); } }}
                                                                            className="w-7 h-7 cursor-pointer rounded-full bg-white text-slate-500 hover:text-rose-500 shadow-sm flex items-center justify-center transition-all active:scale-90"
                                                                        >
                                                                            <i className="fas fa-minus text-[9px]" />
                                                                        </button>

                                                                        <span className="text-xs font-black text-slate-700 min-w-[16px] text-center">{pQty}</span>

                                                                        <button
                                                                            onClick={() => updateProductInstance(roomId, rIdx, prod.id, pQty, { h: globalDimType === 'custom' ? 0 : prod.h, w: globalDimType === 'custom' ? 0 : prod.w })}
                                                                            className="w-7 h-7 cursor-pointer rounded-full bg-white text-slate-500 hover:text-emerald-500 shadow-sm flex items-center justify-center transition-all active:scale-90"
                                                                        >
                                                                            <i className="fas fa-plus text-[9px]" />
                                                                        </button>
                                                                    </div>
                                                                )}

                                                              
                                                            </div>

                                                            {isSel && (
                                                                <div className="space-y-1.5 pt-2 border-t border-slate-50 animate-in fade-in">
                                                                    {globalDimType === 'standard' ? (

<div className="flex items-center justify-center gap-6 py-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
                                                                        <> {isRunningFeetUnit ? <>

                                                                            <>
                                                                                <div className="flex flex-col items-center">
                                                                                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Running Ft</span>
                                                                                    <span className="text-base font-bold text-slate-700">
                                                                                        {pInstances[0]?.w || prod.w}
                                                                                    </span>
                                                                                </div>
                                                                                <span className="text-slate-300 text-lg font-light mt-3">×</span>
                                                                                <div className="flex flex-col items-center">
                                                                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Height</span>
                                                                                    <span className="text-base font-bold text-slate-700">
                                                                                        {pInstances[0]?.h || prod.h}
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        </> :

                                                                            // (<div className="flex items-center justify-center gap-6 py-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
                                                                            //     <div className="flex flex-col items-center">
                                                                            //         <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Height</span>
                                                                            //         <span className="text-base font-bold text-slate-700">
                                                                            //             {pInstances[0]?.h || prod.h}
                                                                            //         </span>
                                                                            //     </div>

                                                                            //     <span className="text-slate-300 text-lg font-light mt-3">×</span>

                                                                            //     <div className="flex flex-col items-center">

                                                                            //         <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isRunningFeetUnit ? 'text-indigo-600' : 'text-amber-600'}`}>
                                                                            //             {isRunningFeetUnit ? "Running Ft" : "Width"}
                                                                            //         </span>
                                                                            //         <span className="text-base font-bold text-slate-700">
                                                                            //             {pInstances[0]?.w || prod.w}
                                                                            //         </span>
                                                                            //     </div>
                                                                            // </div>
                                                                            // )

                                                                            <>
                                                                                <div className="flex flex-col items-center">
                                                                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Height</span>
                                                                                    <span className="text-base font-bold text-slate-700">
                                                                                        {pInstances[0]?.h || prod.h}
                                                                                    </span>
                                                                                </div>
                                                                                <span className="text-slate-300 text-lg font-light mt-3">×</span>
                                                                                <div className="flex flex-col items-center">
                                                                                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Width</span>
                                                                                    <span className="text-base font-bold text-slate-700">
                                                                                        {pInstances[0]?.w || prod.w}
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        }
                                                                        </>
                                                                        </div>

                                                                        // <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium">
                                                                        //     <div className="bg-slate-50 p-2 rounded-xl">
                                                                        //         <p className="text-[8px] uppercase text-slate-400 font-black mb-1">Dimensions (FT)</p>
                                                                        //         <p className="text-slate-700">{prod.h}H × {prod.w}W × {prod.d || 0}D</p>
                                                                        //     </div>
                                                                        //     <div className="bg-slate-50 p-2 rounded-xl">
                                                                        //         <p className="text-[8px] uppercase text-slate-400 font-black mb-1">Internals</p>
                                                                        //         <p className="text-slate-700">{prod.p || 0}P | {prod.s || 0}S | {prod.dr || 0}DR</p>
                                                                        //     </div>
                                                                        // </div>
                                                                    ) : (



                                                                        Object.entries(pInstances).map(([pIdx, pData]: any) => (
                                                                            <div key={pIdx} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                                                                                <span className="text-[7px] font-bold text-indigo-400 w-5">U{parseInt(pIdx) + 1}</span>

                                                                                

                                                                                <div className="grid grid-cols-1 gap-3">

                                                                                    <div className="flex flex-col gap-1">
                                                                                        <label className="text-[7px] font-black text-emerald-600 uppercase ml-1">Dimensions (H × L × D)</label>
                                                                                        <div className="flex gap-1.5">
                                                                                            {[
                                                                                                { label: 'Height', key: 'h', color: 'emerald' },
                                                                                                { label: 'Length', key: 'w', color: 'emerald' },
                                                                                                { label: 'Depth', key: 'd', color: 'emerald' }
                                                                                            ].map((item) => (
                                                                                                <div key={item.key} className="flex flex-col items-start flex-1">
                                                                                                    <label className={`text-[6px] font-black text-${item.color}-600 uppercase ml-1 mb-0.5`}>
                                                                                                        {item.label}
                                                                                                    </label>
                                                                                                    <Input
                                                                                                        // value={pData[item.key]}
                                                                                                        // onChange={(e) => updateProductInstance(roomId, rIdx, prod.id, parseInt(pIdx), { [item.key]: Number(e.target.value) })}
                                                                                                        type="number"
                                                                                                        value={pData[item.key] || ""}
                                                                                                        // onChange={(e) => updateProductInstance(roomId, rIdx, prod.id, parseInt(pIdx), { [item.key]: Number(e.target.value) })}
                                                                                                        onChange={(e) => {
                                                                                                            const val = e.target.value;
                                                                                                            // Fix NaN: If empty, set to 0, otherwise convert to Number
                                                                                                            const numericVal = val === "" ? 0 : Math.max(0, Number(val));
                                                                                                            updateProductInstance(roomId, rIdx, prod.id, parseInt(pIdx), { [item.key]: numericVal });
                                                                                                        }}
                                                                                                        className="h-7 text-[10px] text-center px-1 no-spinner border-slate-200 bg-white"
                                                                                                        placeholder="0"
                                                                                                    />
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>

                                                                                    {!["wallpaper", "diamond_mirror", "sofa_panel", "dining_panel"].includes(prod.id) && (
                                                                                        <div className="flex flex-col gap-1 pt-2 border-t border-dashed border-slate-200">
                                                                                            <label className="text-[7px] font-black text-amber-600 uppercase ml-1">Internals (P | S | DR)</label>
                                                                                            <div className="flex gap-1.5">
                                                                                                {[
                                                                                                    { label: 'Partition', key: 'p', color: 'amber' },
                                                                                                    { label: 'Shelves', key: 's', color: 'amber' },
                                                                                                    { label: 'Drawers', key: 'dr', color: 'amber' }
                                                                                                ].map((item) => (
                                                                                                    <div key={item.key} className="flex flex-col items-start flex-1">
                                                                                                        <label className={`text-[6px] font-black text-${item.color}-600 uppercase ml-1 mb-0.5`}>
                                                                                                            {item.label}
                                                                                                        </label>
                                                                                                        <Input
                                                                                                            type="number"
                                                                                                            value={pData[item.key] || ""}
                                                                                                            // onChange={(e) => updateProductInstance(roomId, rIdx, prod.id, parseInt(pIdx), { [item.key]: Number(e.target.value) })}
                                                                                                            onChange={(e) => {
                                                                                                                const val = e.target.value;
                                                                                                                // Fix NaN: If empty, set to 0, otherwise convert to Number
                                                                                                                const numericVal = val === "" ? 0 : Math.max(0, Number(val));
                                                                                                                updateProductInstance(roomId, rIdx, prod.id, parseInt(pIdx), { [item.key]: numericVal });
                                                                                                            }}
                                                                                                            className="h-7 text-[10px] text-center px-1 no-spinner border-slate-200 bg-white"
                                                                                                            placeholder="0"
                                                                                                        />
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                </div>

                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 items-center pt-8 border-t border-slate-100">
                            <Button variant="secondary" className="px-6 h-10 font-medium uppercase text-[10px] tracking-widest rounded-lg " onClick={() => setStep(2)}>Back</Button>
                            <Button className="px-10 h-10 font-medium uppercase text-[10px] tracking-widest bg-indigo-600 shadow-sm rounded-lg hover:bg-indigo-700" onClick={() => setStep(4)}>
                                Step {step + 1}  <i className="fas fa-chevron-right ml-2 text-[7px]" />
                            </Button>
                        </div>
                    </div>
                )} */}

                {/* {step === 4 && (
                    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Technical Mapping & Valuation</h2>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Select materials to see live unit pricing</p>
                        </div>



                        
                        <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 mb-10 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-5 bg-indigo-600 rounded-full" />
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Global Brand Selection</h3>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">(Updates all units)</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { k: 'plywood', l: 'Plywood', o: plywoodOptions, color: 'indigo', state: globalPlywood },
                                    { k: 'inner', l: 'Inner Laminate', o: innerOptions, color: 'emerald', state: globalInner },
                                    { k: 'outer', l: 'Outer Laminate', o: outerOptions, color: 'amber', state: globalOuter }
                                ].map(m => (
                                    <div key={`global-${m.k}`} className="flex flex-col gap-2">
                                        <label className={`text-[9px] font-black uppercase tracking-widest text-${m.color}-600 flex items-center gap-2`}>
                                            <div className={`w-1.5 h-1.5 rounded-full bg-${m.color}-500`} />
                                            Global {m.l}
                                        </label>
                                        <select
                                            className="cursor-pointer h-12 px-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                            onChange={(e) => {
                                                const opt = m.o.find(x => x.id === e.target.value);
                                                updateAllProductsGlobally(m.k as any, opt);
                                            }}
                                            // FIX: Use the state variable instead of hardcoded empty string
                                            value={m.state}
                                        >
                                            <option value="">Bulk apply to all units...</option>
                                            {m.o.map(o => (
                                                <option key={o.id} value={o.id}>
                                                    {o.name} | {o.thickness}mm {m.k === 'plywood' ? `| ₹${o.cost}/sqft` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(config).map(([roomId, roomInsts]: any) =>
                                Object.entries(roomInsts).map(([rIdx, products]: any) =>
                                    Object.entries(products).map(([prodId, instances]: any) =>
                                        Object.entries(instances).map(([pIdx, details]: any) => {



                                            const unitArea = Number(details.h || 0) * Number(details.w || 0);

                                            // Combine all 3 material costs dynamically
                                            const totalMaterialRate =
                                                Number(details.plywoodCost || 0) +
                                                Number(details.innerCost || 0) +
                                                Number(details.outerCost || 0);

                                            const unitPrice = unitArea * totalMaterialRate;

                                            return (
                                                <div key={`${roomId}-${rIdx}-${prodId}-${pIdx}`} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-indigo-200 transition-all">
                                                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase">{roomId}</span>
                                                                <h4 className="text-sm font-bold text-slate-700 uppercase">
                                                                    {PRODUCT_CATALOG[roomId]?.find(p => p.id === prodId)?.name}
                                                                    <span className="ml-2 text-slate-400 font-medium">(Unit {parseInt(pIdx) + 1})</span>
                                                                </h4>
                                                            </div>



                                                            <section className='flex gap-2 items-center'>
                                                                <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                                        <i className="fas fa-arrows-alt text-xs" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Size (FT)</span>
                                                                        <span className="text-xs font-bold text-slate-700 leading-none">
                                                                            <span className="text-emerald-600">{details.h}H</span>
                                                                            <span className="mx-1 text-slate-300">×</span>
                                                                            <span className="text-amber-600">{details.w}W</span>
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                                        <i className="fas fa-vector-square text-xs" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Total Area</span>
                                                                        <span className="text-xs font-bold text-slate-700 leading-none">
                                                                            {unitArea} <span className="text-[9px] text-slate-400">SQFT</span>
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Total:</span>
                                                                    <span className="text-xl font-black text-emerald-600">₹{unitPrice.toLocaleString('en-IN')}</span>
                                                                </div>
                                                            </section>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 grid grid-cols-3 gap-6">
                                                        {[
                                                            { k: 'plywood', l: 'Plywood', o: plywoodOptions, color: 'indigo' },
                                                            { k: 'inner', l: 'Inner Laminate', o: innerOptions, color: 'emerald' },
                                                            { k: 'outer', l: 'Outer Laminate', o: outerOptions, color: 'amber' }
                                                        ].map(m => {
                                                            const selectedId = details[`${m.k}Id`];
                                                            const selectedData = m.o.find(opt => opt.id === selectedId);

                                                            return (
                                                                <div key={m.k} className="flex flex-col gap-2">
                                                                    <label className={`text-[9px] font-black uppercase tracking-widest text-${m.color}-600 flex items-center gap-2`}>
                                                                        <div className={`w-1.5 h-1.5 rounded-full bg-${m.color}-500`} />
                                                                        {m.l}
                                                                    </label>

                                                                    <select
                                                                        className={`cursor-pointer w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none transition-all focus:ring-2 focus:ring-${m.color}-500/20 focus:border-${m.color}-500`}
                                                                        value={selectedId || ""}
                                                                        onChange={(e) => {
                                                                            const opt = m.o.find(x => x.id === e.target.value);
                                                                            // NOTICE: We save with key-specific names (plywoodCost, innerCost, outerCost)

                                                                            // We store the cost as 0 for calculation purposes if it is inner or outer
                                                                            // but keep the actual RS/Name for the Brand Specification Table
                                                                            const isLaminate = m.k === 'inner' || m.k === 'outer';


                                                                            updateProductInstance(roomId, parseInt(rIdx), prodId, parseInt(pIdx), {
                                                                                [`${m.k}Id`]: opt?.id,
                                                                                [`${m.k}Name`]: opt?.name,
                                                                                // CRITICAL: We pass 0 to the cost field for laminates to exclude them from SQFT math
                                                                                [`${m.k}Cost`]: isLaminate ? 0 : opt?.cost,
                                                                                [`${m.k}Thickness`]: opt?.thickness,
                                                                                [`${m.k}Rs`]: opt?.rs || (opt as any)?.Rs
                                                                            });
                                                                        }}
                                                                    >
                                                                        <option value="">Select Brand</option>
                                                                        {m.o.map(o => (
                                                                            <option key={o.id} value={o.id}>
                                                                                {o.name} | {o.thickness}mm |
                                                                                {m.k === 'plywood' ? `  ₹${o.cost}/sqft` : ''}                                                                            </option>
                                                                        ))}
                                                                    </select>

                                                                    {selectedData && (
                                                                        <div className={`mt-1 flex items-center justify-between px-3 py-1.5 rounded-lg bg-${m.color}-50 border border-${m.color}-100`}>
\                                                                            <span className={`text-[9px] font-bold text-${m.color}-700 uppercase`}>
                                                                                {m.k === 'plywood' ? 'Rate Applied' : 'Selected Brand'}
                                                                            </span>

                                                                            {m.k === 'plywood' ? (
                                                                                <span className={`text-[10px] font-black text-${m.color}-800`}>
                                                                                    ₹{selectedData.cost}
                                                                                </span>
                                                                            ) : (
                                                                                // For Inner/Outer, show a simple confirmation check or name
                                                                                <span className={`text-[10px] font-black text-${m.color}-800 truncate max-w-[100px]`}>
                                                                                    {selectedData.name}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>


                                                   
                                                </div>
                                            );
                                        })
                                    )
                                )
                            )}
                        </div>

                        <div className="flex justify-end gap-3 items-center pt-8 border-t border-slate-100">
                            <Button
                                variant="secondary"
                                className="cursor-pointer px-8 h-10 font-bold uppercase text-[10px] tracking-widest rounded-lg border border-slate-200 text-slate-500"
                                onClick={() => setStep(3)}
                            >
                                Back
                            </Button>
                            <Button
                                isLoading={updatePending}
                                className="cursor-pointer px-10 h-10 font-bold uppercase text-[10px] tracking-widest bg-indigo-600 text-white shadow-md rounded-lg hover:bg-indigo-700 transition-all"
                                // onClick={() => setStep(5)}
                                onClick={async () => {
                                    await handleUpdate()
                                    setStep(5)
                                }}
                            >
                                Generate  Quote <i className="fas fa-chevron-right ml-2 text-[7px]" />
                            </Button>
                        </div>
                    </div>
                )} */}


                {step === 4 && (
                    <PreSalesQuoteStep4

                        config={config}
                        PRODUCT_CATALOG={PRODUCT_CATALOG}
                        plywoodOptions={plywoodOptions}
                        innerOptions={innerOptions}
                        outerOptions={outerOptions}
                        globalPlywood={globalPlywood}
                        globalInner={globalInner}
                        globalOuter={globalOuter}


                        globalProfitPercentage={globalProfitPercentage}
                        setGlobalProfitPercentage={setGlobalProfitPercentage}

                        updateAllProductsGlobally={updateAllProductsGlobally}
                        updateProductInstance={updateProductInstance}
                        handleUpdate={handleUpdate}
                        setStep={setStep}
                        updatePending={updatePending}
                        groupProfitMargins={groupProfitMargins}
                        updateGroupMargin={updateGroupMargin}
                    />
                )}




                {step === 5 && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <PreSalesQuoteType4
                            key={quoteData?.clientData?.clientName || "loading"}
                            organizationId={organizationId!}
                            // rooms={Object.entries(roomCounts)
                            //     .filter(([_, count]) => count > 0)
                            //     .flatMap(([roomName, count]) =>
                            //         Array.from({ length: count as number }).map((_, idx) => ({
                            //             id: `${roomName}-${idx}`,
                            //             roomName: count > 1 ? `${roomName} ${idx + 1}` : roomName,
                            //             roomTotal: calculateSpecificRoomTotal(roomName, idx), // Your calculation helper
                            //             products: extractRoomProducts(roomName, idx) // Helper to get prods for this instance
                            //         }))
                            //     )}
                            // data={auditData}

                            // rooms={Object.entries(quoteData.config || {}).map(([roomName, roomGroup]: any) => ({
                            //     roomName: roomName,
                            //     // We need to drill down: Room -> rIdx -> ProductID -> pIdx
                            //     products: Object.values(roomGroup).flatMap((productGroup: any) =>
                            //         Object.values(productGroup).flatMap((instanceGroup: any) =>
                            //             Object.values(instanceGroup)
                            //         )
                            //     )
                            // }))}

                            rooms={Object.entries(quoteData.config || {}).map(([roomName, roomGroup]: any) => ({
                                roomName: roomName,
                                products: Object.values(roomGroup).flatMap((productInstanceGroup: any) =>
                                    // Object.entries here gives us [productName, instances]
                                    Object.entries(productInstanceGroup).flatMap(([productName, instanceGroup]: any) =>
                                        Object.values(instanceGroup).map((details: any) => ({
                                            ...details,
                                            // INJECT THE NAME HERE: This ensures furnitureName is available
                                            furnitureName: details.furnitureName || productName.replace(/_/g, ' ').toUpperCase()
                                        }))
                                    )
                                )
                            }))}


                            data={quoteData}
                            grandTotal={grandTotal}

                        />

                        <div className="fixed bottom-8 right-8 flex gap-3 print:hidden z-50">
                            <Button variant="primary" onClick={() => setStep(4)} className="shadow-lg">
                                Back to Summary
                            </Button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
















