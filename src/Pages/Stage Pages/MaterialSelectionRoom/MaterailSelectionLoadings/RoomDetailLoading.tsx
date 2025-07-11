import { Skeleton } from "../../../../components/ui/Skeleton"; // Adjust path if needed

const RoomDetailsLoading = () => {
  const rows = Array.from({ length: 11 });

  return (
    <div className="w-full max-h-full overflow-hidden mx-auto mt-4 bg-white shadow rounded p-6">
      <Skeleton className="h-6 w-40 mb-2" />
      <Skeleton className="h-4 w-32 mb-6" />

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              {["Item", "Quantity", "Unit", "Remarks", "Actions"].map((_, idx) => (
                <th key={idx} className="p-3">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((_, i) => (
              <tr key={i} className="border-t">
                <td className="p-3"><Skeleton className="h-4 w-32" /></td>
                <td className="p-3"><Skeleton className="h-4 w-12" /></td>
                <td className="p-3"><Skeleton className="h-4 w-10" /></td>
                <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                <td className="p-3"><Skeleton className="h-8 w-8 rounded-full" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomDetailsLoading;
