// ▶️ QuotePdfMain.tsx

import { useParams } from 'react-router-dom';
import { useGetPdfQuotes } from '../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi';
import QuotePdfCard from './QuotePdfCard';
import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';

const QuotePdfMain = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: quotes, isLoading } = useGetPdfQuotes(projectId!);

  return (
    <div className="p-4 max-h-full overflow-y-auto">
   


      <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-4">
            <i className="fas fa-file-invoice mr-3 text-blue-600"></i>
            PDF Variant Quotes
          </h1>
      {isLoading ? (
        <MaterialOverviewLoading />
      ) : !quotes || quotes.length === 0 ? (
        <div className="flex flex-col py-20 items-center justify-center text-center">
          <i className="fas fa-file-alt text-6xl text-gray-300 mb-4 text-center" />
          <h2 className="text-xl font-semibold text-gray-600">No Quote PDFs found.</h2>
          <p className="text-gray-400 text-sm mt-1">Generated Quote Pdf will be stored here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((quote: any) => (
            <QuotePdfCard key={quote._id} quote={quote} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotePdfMain;