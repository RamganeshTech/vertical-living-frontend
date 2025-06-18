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

    // console.log("first entering")
    // While waiting for the role
    if (loading || role === undefined || role === null) {
    // console.log("2nd entering")

        return <div className="p-6 text-center">🔐 Loading...</div>;
    }
    // console.log("3rd entering")

    // Role fetched but unauthorized
    if (error || !isauthenticated || !allowedRoles.includes(role)) {
    // console.log("4th entering")

        return <Navigate to={`${role === "owner" ? "/login" : `/${role}login`}`} state={{ from: location }} replace />;
    }

    // Authorized
    return <>{children}</>;
};

export default ProtectedRoutes;
