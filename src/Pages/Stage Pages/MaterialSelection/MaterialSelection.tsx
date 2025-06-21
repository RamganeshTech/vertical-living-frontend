// MaterialSelection.tsx
import { Outlet, useLocation } from "react-router-dom";

import MaterialRoomList from "./MaterialRoomList";

const MaterialSelection = () => {
   
    const location = useLocation();

    // Show room list only if not inside a specific room
    const isRoomDetail = location.pathname.includes("/materialroom");

console.log("is outlet is working",isRoomDetail)
    return (
        <>
            <div className="min-h-full bg-gray-50">
                {isRoomDetail ? <Outlet /> : <MaterialRoomList />}
            </div>
        </>
    );
};

export default MaterialSelection;
