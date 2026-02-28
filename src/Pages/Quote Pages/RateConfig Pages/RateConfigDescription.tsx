import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { Textarea } from "../../../components/ui/Textarea"; // Using your component
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import { useGetCategories, useUpdateCategoryDescription, } from "../../../apiList/Quote Api/RateConfig Api/rateConfigApi";
import { Textarea } from "../../../components/ui/TextArea";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

export default function RateConfigDescription() {
    const { organizationId, id: categoryId } = useParams();
    const navigate = useNavigate();

    // API Hooks
    const { data: categories, isLoading } = useGetCategories(organizationId!);
    const { mutateAsync: updateScope } = useUpdateCategoryDescription();
    const [savingField, setSavingField] = useState<string | null>(null);

    // Local State for the three fields
    const [scopeData, setScopeData] = useState({
        whatsIncluded: "",
        whatsNotIncluded: "",
        disclaimer: ""
    });

    const currentCategory = categories?.find((cat: any) => cat._id === categoryId);

    // Initial Load
    useEffect(() => {
        if (currentCategory) {
            setScopeData({
                whatsIncluded: currentCategory?.whatsIncluded || "",
                whatsNotIncluded: currentCategory?.whatsNotIncluded || "",
                disclaimer: currentCategory?.disclaimer || ""
            });
        }
    }, [currentCategory]);

    const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault(); // Prevents adding a newline when saving
            handleSaveField(fieldName);
        }
    };

    const handleSaveField = async (fieldName: string) => {
        try {
            setSavingField(fieldName); // ✅ Start loading for this specific field
            await updateScope({
                categoryId: categoryId!,
                field: fieldName,
                content: (scopeData as any)[fieldName]
            });
            toast({ title: "Success", description: `Saved successfully!` });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update",
                variant: "destructive"
            });
        }
        finally {
        setSavingField(null); // ✅ Stop loading
    }
    };

    if (isLoading) return <MaterialOverviewLoading />;

    return (
        <div className="space-y-8 mx-auto max-h-full overflow-y-auto">
            <header className="sticky top-0 left-0 flex items-center gap-4 border-b pb-6 bg-white">
                <Button variant="outline" onClick={() => navigate(-1)} className="rounded-full w-10 h-10 p-0">
                    <i className="fas fa-arrow-left"></i>
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
                        Scope & Disclaimer Config
                    </h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Category: <span className="text-indigo-600">{currentCategory?.name}</span>
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* 1. WHAT'S INCLUDED */}
                <div className="bg-white p-6 rounded-[32px] border border-emerald-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black uppercase text-emerald-600 tracking-widest">
                            What's Included
                        </label>
                        <Button
                            onClick={() => handleSaveField("whatsIncluded")}
                            // isLoading={isPending}
                            isLoading={savingField === "whatsIncluded"}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 rounded-xl text-[10px]"
                        >
                            Save Included
                        </Button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium italic block -mt-2 mb-2">
                        Tip: Press <kbd className="font-sans font-bold text-slate-500 bg-slate-100 px-1 rounded">Ctrl + Enter</kbd> to save quickly.
                    </span>
                    <Textarea
                        value={scopeData.whatsIncluded}
                        onChange={(e) => setScopeData({ ...scopeData, whatsIncluded: e.target.value })}
                        onKeyDown={(e) => handleKeyDown(e, "whatsIncluded")} // ✅ Added this
                        placeholder="Bullet points of what the client gets..."
                        className="min-h-[150px] border-emerald-100 focus:border-emerald-400"
                    />
                </div>

                {/* 2. WHAT'S NOT INCLUDED */}
                <div className="bg-white p-6 rounded-[32px] border border-amber-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black uppercase text-amber-600 tracking-widest">
                            What's Not Included
                        </label>
                        <Button
                            onClick={() => handleSaveField("whatsNotIncluded")}
                            // isLoading={isPending}
                            isLoading={savingField === "whatsNotIncluded"} // ✅ Targeted loading
                            className="bg-amber-600 hover:bg-amber-700 text-white h-8 rounded-xl text-[10px]"
                        >
                            Save Not Included
                        </Button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium italic block -mt-2 mb-2">
                        Tip: Press <kbd className="font-sans font-bold text-slate-500 bg-slate-100 px-1 rounded">Ctrl + Enter</kbd> to save quickly.
                    </span>
                    <Textarea
                        value={scopeData.whatsNotIncluded}
                        onChange={(e) => setScopeData({ ...scopeData, whatsNotIncluded: e.target.value })}
                        onKeyDown={(e) => handleKeyDown(e, "whatsNotIncluded")} // ✅ Added this
                        placeholder="Items like civil work, deep cleaning, etc..."
                        className="min-h-[150px] border-amber-100 focus:border-amber-400"
                    />
                </div>

                {/* 3. DISCLAIMER */}
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black uppercase text-slate-600 tracking-widest">
                            Legal Disclaimer
                        </label>
                        <Button
                            onClick={() => handleSaveField("disclaimer")}
                            // isLoading={isPending}
                            isLoading={savingField === "disclaimer"} // ✅ Targeted loading
                            className="bg-slate-800 hover:bg-slate-900 text-white h-8 rounded-xl text-[10px]"
                        >
                            Save Disclaimer
                        </Button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium italic block -mt-2 mb-2">
                        Tip: Press <kbd className="font-sans font-bold text-slate-500 bg-slate-100 px-1 rounded">Ctrl + Enter</kbd> to save quickly.
                    </span>
                    <Textarea
                        value={scopeData.disclaimer}
                        onChange={(e) => setScopeData({ ...scopeData, disclaimer: e.target.value })}
                        onKeyDown={(e) => handleKeyDown(e, "disclaimer")} // ✅ Added this
                        placeholder="Terms, fluctuations, and site conditions..."
                        className="min-h-[150px] border-slate-200 focus:border-slate-400"
                    />
                </div>
            </div>
        </div>
    );
}