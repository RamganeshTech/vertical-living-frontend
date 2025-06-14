import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthCheck } from "../Hooks/useAuthCheck";
import useGetRole from "../Hooks/useGetRole";
import type React from "react";


interface ProtectedRoutesProps {
    allowedRoles: string[];
    children: React.ReactElement
}

const ProtectedRoutes = ({ allowedRoles , children}: ProtectedRoutesProps) => {
    const { loading, error, role, isauthenticated } = useAuthCheck();
    const location = useLocation();

    // While waiting for the role
    if (loading || role === undefined || role === null) {
        return <div className="p-6 text-center">🔐 Loading...</div>;
    }

    // Role fetched but unauthorized
    if (error || !isauthenticated || !allowedRoles.includes(role)) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Authorized
    return <>{children}</>;
};

export default ProtectedRoutes;
