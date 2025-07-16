import { Navigate, useLocation } from "react-router-dom";
import { useAuthCheck } from "../Hooks/useAuthCheck";
import type React from "react";
import UnAuthorized from "../Pages/UnAuthorized/UnAuthorized";


interface ProtectedRoutesProps {
    allowedRoles: string[];
    children: React.ReactElement
}

const ProtectedRoutes = ({ allowedRoles, children }: ProtectedRoutesProps) => {
    const { loading, error, role, isauthenticated } = useAuthCheck();
    const location = useLocation();

    // While waiting for the role

     if (!isauthenticated && loading === false) {
        return <Navigate to={`${role === "owner" ? "/login" : role === null ? `/login`: `/login/${role}`}`} state={{ from: location }} replace />;
    }

    if (loading || role === undefined || role === null ) {

        return <div className="p-6 text-center">🔐 Loading...</div>;
    }

     if (!allowedRoles.includes(role)) {
    return <UnAuthorized />;
  }

    // Role fetched but unauthorized
    if (error || !isauthenticated) {
        return <Navigate to={`${role === "owner" ? "/login" : `/login/${role}`}`} state={{ from: location }} replace />;
    }

    // Authorized
    return <>{children}</>;
};

export default ProtectedRoutes;
