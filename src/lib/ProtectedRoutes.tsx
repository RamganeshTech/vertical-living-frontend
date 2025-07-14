import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthCheck } from "../Hooks/useAuthCheck";
import useGetRole from "../Hooks/useGetRole";
import type React from "react";
import UnAuthorized from "../Pages/UnAuthorized/UnAuthorized";


interface ProtectedRoutesProps {
    allowedRoles: string[];
    children: React.ReactElement
}

const ProtectedRoutes = ({ allowedRoles, children }: ProtectedRoutesProps) => {
    const { loading, error, role, isauthenticated } = useAuthCheck();
    const location = useLocation();

    // console.log("first entering")
    // While waiting for the role

     if (!isauthenticated && loading === false) {
        return <Navigate to={`${role === "owner" ? "/login" : role === null ? `/login`: `/login/${role}`}`} state={{ from: location }} replace />;
    }

    if (loading || role === undefined || role === null ) {
        // console.log("2nd entering")

        return <div className="p-6 text-center">🔐 Loading...</div>;
    }
    // console.log("3rd entering")

     if (!allowedRoles.includes(role)) {
    return <UnAuthorized />;
  }

    // Role fetched but unauthorized
    if (error || !isauthenticated) {
        // console.log("4th entering")
        // console.log(isauthenticated, allowedRoles)
        return <Navigate to={`${role === "owner" ? "/login" : `/login/${role}`}`} state={{ from: location }} replace />;
    }

    // Authorized
    return <>{children}</>;
};

export default ProtectedRoutes;
