



import React, { useState, useMemo } from "react";
import PremisesModal from "./PremisesModal";
import { useDeletePremises, useGetPremises, type IPremises } from "../../../apiList/eb_api/premisesApi";
import { useParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { TableContainer, TBody, Td, Th, THead, Tr } from "../../../components/ui/TableLayout";

export const PremiseMain: React.FC = () => {
    // 1. Auth & Role Hooks
    // const { organizationId } = useAuthData();
    const { organizationId } = useParams() as { organizationId: string };

    const canModify = true;

    // 2. React Query Hooks
    const { data: premisesList = [], isLoading, isError } = useGetPremises(organizationId!);
    const { mutateAsync: deletePremises, isPending: isDeleting } = useDeletePremises();

    // 3. Local State
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPremises, setSelectedPremises] = useState<IPremises | null>(null);

    // 4. Derived State (Filtering)
    const filteredPremises = useMemo(() => {
        if (!searchQuery) return premisesList;
        return premisesList.filter(p =>
            p.premisesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.consumerNumber && p.consumerNumber.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [premisesList, searchQuery]);

    // 5. Handlers
    const openCreateForm = () => {
        setSelectedPremises(null);
        setIsFormOpen(true);
    };

    const openEditForm = (item: IPremises) => {
        setSelectedPremises(item);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedPremises(null);
    };

    const handleDelete = async (premisesId: string) => {
        try {
            if (window.confirm("Are you sure you want to delete this premises?")) {
                await deletePremises({ organizationId: organizationId!, premisesId });
                // toast.success("Premises deleted successfully");
                toast({ title: "Success", description: "Deleted Successfully" });

            }
        } catch (error: any) {
            // toast.error(error?.message || "Operation Failed.");
            toast({ variant: "destructive", title: "Error", description: error?.message || "Failed to delete" });

        }
    };

    return (
        <div className="h-full bg-brand-surface p-4 font-sans flex flex-col">
            <div className="max-w-7xl mx-auto space-y-6 w-full flex-1 flex flex-col">

                {/* HEADER SECTION */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ash-medium pb-4 shrink-0">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-3">
                            <i className="fas fa-building text-action-primary"></i>
                            Premises Configuration
                        </h1>
                        <p className="text-sm text-text-muted mt-1 font-normal">
                            Manage buildings, blocks, and meter details for your school.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <Input
                            id="searchPremises"
                            placeholder="Search name or consumer no..."
                            // leftIcon="fas fa-search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            // wrapperClassName="w-full sm:w-64"
                        />
                        {canModify && (
                            <Button
                                onClick={openCreateForm}
                                // leftIcon="fas fa-plus"
                                variant="dark"
                                className="w-full sm:w-auto whitespace-nowrap shrink-0 font-medium"
                            >
                                Add New Premises
                            </Button>
                        )}
                    </div>
                </header>

                {/* DATA GRID / TABLE LAYOUT */}
                <div className="bg-surface border border-ash-medium rounded-lg shadow-sm overflow-hidden flex flex-col flex-1">
                    <TableContainer className="h-full overflow-y-auto">
                        <THead className="sticky top-0 z-10 bg-sub-header after:absolute after:bottom-0 after:left-0 after:right-0 after:border-b after:border-ash-medium">
                            <tr>
                                <Th className="w-16 text-center font-bold">S.No</Th>
                                <Th className="font-bold">Premises Details</Th>
                                <Th className="font-bold">Meter & Consumer No</Th>
                                <Th className="font-bold">Sanctioned Load</Th>
                                <Th className="font-bold">Status</Th>
                                {canModify && <Th className="text-center font-bold w-28">Actions</Th>}
                            </tr>
                        </THead>
                        <TBody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={canModify ? 6 : 5} className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <i className="fas fa-circle-notch fa-spin text-action-primary text-3xl mb-4"></i>
                                            <p className="text-text-muted text-sm font-medium">Loading premises...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={canModify ? 6 : 5} className="py-16 text-center">
                                        <div className="bg-action-danger/10 border border-action-danger/20 rounded-xl p-6 mx-auto max-w-md">
                                            <p className="text-action-danger font-medium">Failed to load premises. Please try again.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPremises.length === 0 ? (
                                <tr>
                                    <td colSpan={canModify ? 6 : 5} className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <i className="fas fa-building text-4xl text-text-muted  mb-3"></i>
                                            <h3 className="text-base font-medium text-text-main">No premises found</h3>
                                            <p className="text-sm text-text-muted mt-1">
                                                {searchQuery ? "Try adjusting your search criteria." : "Get started by adding a new premises."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPremises.map((item, index) => (
                                    <Tr key={item._id} className="group hover:bg-sub-header/60 transition-colors border-b border-border-soft last:border-0">
                                        <Td className="text-center font-medium text-text-muted">
                                            {index + 1}
                                        </Td>

                                        {/* Premises Details */}
                                        <Td>
                                            <p className="font-medium text-text-main flex items-center gap-2">
                                                <i className="fas fa-map-marker-alt text-action-primary text-sm"></i>
                                                {item.premisesName}
                                            </p>
                                            {item.premisesAddress && (
                                                <p className="text-[12px] text-text-muted mt-0.5 truncate max-w-[200px]" title={item.premisesAddress}>
                                                    {item.premisesAddress}
                                                </p>
                                            )}
                                        </Td>

                                        {/* Meter & Consumer */}
                                        <Td>
                                            <p className="font-medium text-text-main text-[13px]">
                                                {item.consumerNumber || 'N/A'}
                                            </p>
                                            <p className="text-[11px] text-text-muted mt-0.5">
                                                Loc: {item.meterLocation || 'Not specified'}
                                            </p>
                                        </Td>

                                        {/* Load */}
                                        <Td>
                                            <p className="font-medium text-text-main text-[13px]">
                                                {item.sanctionedLoad ? `${item.sanctionedLoad} kW` : 'N/A'}
                                            </p>
                                        </Td>

                                        {/* Status */}
                                        <Td>
                                            {/* <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${item.isActive
                                                ? "bg-success/10 text-action-success border border-success/20"
                                                : "bg-muted/10 text-text-muted border border-muted/20"
                                                }`}>
                                                {item.isActive ? "Active" : "Inactive"}
                                            </span> */}

                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
    item.isActive
        ? "bg-action-success/10 text-action-success border border-action-success/20"
        : "bg-text-muted/10 text-text-muted border border-text-muted/20" 
}`}>
    {item.isActive ? "Active" : "Inactive"}
</span>
                                        </Td>

                                        {/* Actions */}
                                        {canModify && (
                                            <Td className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-text-main hover:text-action-primary hover:bg-primary-soft/20 rounded-md"
                                                        onClick={() => openEditForm(item)}
                                                        title="Edit Premises"
                                                    >
                                                        <i className="fas fa-pen text-sm"></i>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="danger"
                                                        // className="text-action-danger hover:bg-action-danger/10 rounded-md"
                                                        onClick={() => handleDelete(item._id)}
                                                        disabled={isDeleting}
                                                        title="Delete Premises"
                                                    >
                                                        <i className="fas fa-trash-alt text-sm"></i>
                                                    </Button>
                                                </div>
                                            </Td>
                                        )}
                                    </Tr>
                                ))
                            )}
                        </TBody>
                    </TableContainer>
                </div>
            </div>

            {/* SIDE MODAL FOR CREATE/EDIT */}
            <PremisesModal
                isOpen={isFormOpen}
                onClose={closeForm}
                premisesData={selectedPremises}
                organizationId={organizationId!}
                canEdit={canModify}
            />
        </div>
    );
};

export default PremiseMain;