import { Navigate, useLocation } from "react-router-dom";
import { useAuthCheck } from "../Hooks/useAuthCheck";
import type React from "react";
import { lazy } from "react";

const UnAuthorized = lazy(() => import("../Pages/UnAuthorized/UnAuthorized"));

interface ProtectedRoutesProps {
    allowedRoles: string[];
    children: React.ReactElement;
    // New optional props for granular control
    requiredDepartment?: string | string[]; // e.g., 'accounts', 'billing'
    // requiredAction?: 'create' | 'edit' | 'delete' | 'list';
    requiredAction?: string | string[];

}


const ProtectedRoutes = ({
    allowedRoles,
    children,
    requiredDepartment,
    requiredAction
}: ProtectedRoutesProps) => {
    const { loading, error, role, isauthenticated, permission } = useAuthCheck();
    const location = useLocation();

    // While waiting for the role

    if (!isauthenticated && loading === false) {
        // return <Navigate to={`${role === "owner" ? "/login" : role === null ? `/login` : `/login/${role}`}`} state={{ from: location }} replace />;
        return <Navigate to={`/login/common`} state={{ from: location }} replace />;
    }

    if (loading || role === undefined || role === null) {
        return <div className="p-6 text-center">🔐 Loading...</div>;
    }

    if (!allowedRoles.includes(role)) {
        return <UnAuthorized />;
    }

    // Role fetched but unauthorized
    if (error || !isauthenticated) {
        // return <Navigate to={`${role === "owner" ? "/login" : `/login/${role}`}`} state={{ from: location }} replace />;
        return <Navigate to={`/login/common`} state={{ from: location }} replace />;
    }

    // Authorized

    // 4. Permission Check (Granular Layer)
    // If the user is 'owner', we SKIP this check (Owners have full access)
    // --- PERMISSION CHECK LOGIC ---
    // if (role !== "owner") {
    //     if (requiredDepartment && requiredAction) {

    //         // const deptPermissions = permission?.[requiredDepartment];

    //         // 1. If requiredAction is an ARRAY (e.g. ['list', 'create'])
    //         if (Array.isArray(requiredAction)) {
    //             // Check if user has AT LEAST ONE of the required actions
    //             const hasAtLeastOne = requiredAction.some(action => deptPermissions?.[action] === true);

    //             if (!hasAtLeastOne) return <UnAuthorized />;
    //         }
    //         // 2. If requiredAction is a STRING (e.g. 'list')
    //         else {
    //             if (!deptPermissions?.[requiredAction]) return <UnAuthorized />;
    //         }
    //     }
    // }.

     // --- PERMISSION CHECK LOGIC ---
    if (role !== "owner") {
        if (requiredDepartment && requiredAction) {

            // 1. Normalize Departments to an Array
            const departmentsToCheck = Array.isArray(requiredDepartment) 
                ? requiredDepartment 
                : [requiredDepartment];

            // 2. Normalize Actions to an Array
            const actionsToCheck = Array.isArray(requiredAction) 
                ? requiredAction 
                : [requiredAction];

            // 3. CHECK: Does the user have permission in ANY of the listed departments?
            const hasAccess = departmentsToCheck.some(dept => {
                
                // Get the permission object for this specific department (e.g., permission.billing)
                const userDeptPerms = permission?.[dept];

                if (!userDeptPerms) return false;

                // Check if they have AT LEAST ONE of the required actions in this department
                return actionsToCheck.some(action => userDeptPerms[action] === true);
            });

            // If they fail check for ALL departments, deny access
            if (!hasAccess) {
                return <UnAuthorized />;
            }
        }
    }

    // 5. Authorized
    return <>{children}</>;
};

export default ProtectedRoutes;