// ▶️ QuotePdfCard.tsx

import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
// import { useNavigate } from 'react-router-dom';
import { downloadImage } from '../../../utils/downloadFile';

type Props = {
  quote: any; // You'll improve this type later
};

const QuotePdfCard: React.FC<Props> = ({ quote }) => {
//   const navigate = useNavigate();

  return (
    <Card className="w-full border-l-4 border-blue-500 shadow-md bg-white hover:shadow-lg transition-all">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-blue-700 mb-1">
              Variant Quote: <span className='text-black'>{quote.quoteNo}</span>
            </h3>
            <p className="text-xs text-gray-500">
              Created on: {new Date(quote.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 italic mt-1">
              Furnitures: {quote.furnitures?.length || 0}
            </p>
          </div>
          <i className="fas fa-file-pdf text-red-500 text-xl" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="primary"
            size="sm"
            // onClick={() => downloadImage(quote?.pdfLink?.url, "_blank")}
            onClick={() => downloadImage({src:quote?.pdfLink?.url, alt:quote?.originalName })}
          >
            <i className="fas fa-download mr-2"></i>Download PDF
          </Button>

          {/* <Button
            variant="secondary"
            onClick={() => navigate(`view/${quote._id}`)}
            size="sm"
          >
            <i className="fas fa-eye mr-1" /> View
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotePdfCard;