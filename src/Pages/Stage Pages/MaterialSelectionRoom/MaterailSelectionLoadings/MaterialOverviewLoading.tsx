import { Skeleton } from "../../../../components/ui/Skeleton"; 

const MaterialOverviewLoading = () => {
  const cards = Array.from({ length: 13 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((_, index) => (
          <div key={index} className="bg-white p-4 shadow rounded-lg">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialOverviewLoading;
