import React from "react";
import { Button } from "../../components/ui/Button";
import { toast } from "../../utils/toast";
import { useDeleteModularUnit } from "../../apiList/Modular Unit Api/ModularUnitApi";

type SingleModularUnitCardProp = {
    unit: any;
    onEdit?: (unit: any) => void; // You can customize if needed
};

const SingleModularUnitCard: React.FC<SingleModularUnitCardProp> = ({ unit, onEdit }) => {
    const { mutateAsync: deleteUnit, isPending: isDeleting } = useDeleteModularUnit();

    const handleDelete = async () => {
        try {
            if (!window.confirm("Are you sure you want to delete this unit?")) return;
            await deleteUnit(
                {
                    unitId: unit._id,
                    unitType: unit.unitType,
                    organizationId: unit.organizationId,
                },
            )
            toast({ title: "Success", description: "Product Added Successfully" })
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to add", variant: "destructive" })
        }
    };

    return (
        <div className="border rounded-lg shadow hover:shadow-md transition p-4 w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2">{unit.name || "Unnamed Unit"}</h2>

            {unit.images?.[0]?.url ? (
                <img
                    src={unit.images[0].url}
                    alt={unit.name}
                    className="w-full h-40 object-cover rounded"
                />
            ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                    No Image
                </div>
            )}

            <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p><strong>Price:</strong> ₹{unit.price?.toLocaleString() || "N/A"}</p>
                <p><strong>Custom ID:</strong> {unit.customId || unit._id}</p>
                <p><strong>Category:</strong> {unit.unitType || "N/A"}</p>
            </div>

            <div className="flex justify-end items-center gap-3 mt-4">
                {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(unit)}>
                        Edit
                    </Button>
                )}
                <Button
                    size="sm"
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </div>
        </div>
    );
};

export default SingleModularUnitCard;
