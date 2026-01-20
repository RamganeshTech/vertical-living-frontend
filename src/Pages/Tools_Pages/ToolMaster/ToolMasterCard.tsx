import { Button } from "../../../components/ui/Button";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

interface ToolCardProps {
    tool: any;
    onView: () => void;
    onDelete: () => void;
}

export const ToolCard = ({ tool, onView, onDelete }: ToolCardProps) => {
    // Determine badge color based on availability
    const statusColors: any = {
        available: 'bg-green-100 text-green-700 border-green-200',
        issued: 'bg-blue-100 text-blue-700 border-blue-200',
        repair: 'bg-orange-100 text-orange-700 border-orange-200',
        missing: 'bg-red-100 text-red-700 border-red-200',
    };



    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.toolhardware?.list;
    // const canCreate = role === "owner" || permission?.toolhardware?.create;
    const canDelete = role === "owner" || permission?.toolhardware?.delete;
    // const canEdit = role === "owner" || permission?.toolhardware?.edit;


    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            {/* Image Section */}
            <div className="h-40 bg-gray-100 relative overflow-hidden">
                {tool.toolImages?.[0]?.url ? (
                    <img
                        src={tool.toolImages[0].url}
                        alt={tool.toolName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <i className="fas fa-tools text-4xl"></i>
                    </div>
                )}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${statusColors[tool.availabilityStatus]}`}>
                    {tool.availabilityStatus}
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/60 text-white text-[10px] font-mono rounded backdrop-blur-sm">
                    {tool.toolCode}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="mb-3">
                    <h3 className="font-bold text-gray-900 truncate">{tool.toolName}</h3>
                    <p className="text-xs text-gray-500">{tool.brand} • {tool.toolCategory}</p>
                </div>

                <div className="space-y-2 border-t pt-3">
                    <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Serial No:</span>
                        <span className="font-medium text-gray-700">{tool.serialNumber}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Condition:</span>
                        <span className={`font-bold capitalize ${tool.conditionStatus === 'repair' ? 'text-red-500' : 'text-gray-700'}`}>
                            {tool.conditionStatus}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <Button onClick={onView} variant="outline" className="flex-1 py-1 h-8 text-xs">
                        Details
                    </Button>
                    {canDelete && <button
                        onClick={onDelete}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <i className="fas fa-trash-alt"></i>
                    </button>}
                </div>
            </div>
        </div>
    );
};