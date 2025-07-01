import React from "react";
import { Button } from "../../../components/ui/Button"; 

const StageControls = ({ onLock, onComplete, onDelete }: any) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6">
      <Button onClick={onLock} variant="outline" className="bg-yellow-100 border-yellow-400 text-yellow-800 w-full sm:w-auto">
        <i className="fa-solid fa-lock mr-2"></i> Lock Form
      </Button>
      <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
        <i className="fa-solid fa-circle-check mr-2"></i> Mark as Complete
      </Button>
      <Button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">
        <i className="fa-solid fa-trash mr-2"></i> Delete
      </Button>
    </div>
  );
};

export default React.memo(StageControls);