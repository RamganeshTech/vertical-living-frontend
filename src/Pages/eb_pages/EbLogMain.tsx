import { useState, useMemo } from 'react';
// import { useSelector } from 'react-redux';
// import { type RootState } from '../../../features/store/store';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useDebounce } from '../../Hooks/useDebounce';
import { useDeleteEBLog, useGetAllEBLogs, type IEBLog } from '../../apiList/eb_api/ebLogApi';
import { useGetPremises } from '../../apiList/eb_api/premisesApi';
import type { SelectOption } from '../../components/ui/SearchSelectNew';
import { toast } from '../../utils/toast';
import { Button } from '../../components/ui/Button';
import SearchSelectNew from '../../components/ui/SearchSelectNew';
import { TableContainer, TBody, Td, Th, THead, Tr } from "../../components/ui/TableLayout";
import EbLogModal from './EbLogModal';
import { formatTime12Hour } from '../../utils/dateFormator';

export default function EbLogMain() {
    // --- Global State (Mocked based on context) ---
    const { organizationId } = useParams() as { organizationId: string };

    const location = useLocation();

    // --- Local Filter State ---
    const [filters, setFilters] = useState({
        premisesId: '',
        search: '',
        fromDate: '',
        toDate: '',
        minReading: 0,
        maxReading: 1000000,
    });

    const debouncedSearch = useDebounce(filters.search, 500);
    const debouncedMinReading = useDebounce(filters.minReading, 500);
    const debouncedMaxReading = useDebounce(filters.maxReading, 500);

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<IEBLog | null>(null);

    // --- Permissions ---
    // const { isCorrespondent, isAdmin, isPrincipal, isAccountant } = useRoleCheck();
    const canCreate = true; // Replace with: isCorrespondent || isAdmin || isPrincipal || isAccountant
    const canDelete = true; // Replace with appropriate roles

    // --- API Hooks ---
    // 1. Fetch Premises for the Filter Dropdown
    const { data: premisesList = [], isLoading: isPremisesLoading } = useGetPremises(organizationId!);

    const premisesOptions: SelectOption[] = useMemo(() => {
        return premisesList.map(p => ({
            label: p.premisesName,
            value: p._id
        }));
    }, [premisesList]);

    // 2. Fetch EB Logs (assuming standard array fetch based on your previous controller)
    const {
        data: ebLogs = [],
        isLoading,
        isError
    } = useGetAllEBLogs(organizationId!, {
        premisesId: filters.premisesId || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        minReading: debouncedMinReading ? String(debouncedMinReading) : undefined,
        maxReading: debouncedMaxReading ? String(debouncedMaxReading) : undefined,
        search: debouncedSearch || undefined,
    });

    const { mutateAsync: deleteEBLog, isPending: isDeleting } = useDeleteEBLog();

    // --- Handlers ---
    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            premisesId: '',
            search: '',
            fromDate: '',
            toDate: '',
            minReading: 0,
            maxReading: 1000000,
        });
    };

    const openCreateForm = () => {
        setSelectedLog(null); // Triggers Create Mode
        setIsFormOpen(true);
    };

    const openViewForm = (log: IEBLog) => {
        setSelectedLog(log);  // Triggers View/Edit Mode
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string, logNo: string) => {
        if (window.confirm(`Are you sure you want to delete EB Log ${logNo}?`)) {
            try {
                await deleteEBLog({ organizationId: organizationId!, logId: id });
                // toast.success("EB Log deleted successfully!");
                toast({ title: "Success", description: "Deleted Successfully" });

            } catch (error: any) {
                // toast.error(error.message || "Failed to delete EB log");
                toast({ variant: "destructive", title: "Error", description: error?.message || "Failed to delete EB log" });

            }
        }
    };

    const isChild = location.pathname.includes("single");
    if (isChild) {
        return <Outlet />;
    }

    return (
        <div className="w-full h-full bg-brand-surface flex flex-col p-2 sm:p-4 space-y-4 font-sans">

            {/* --- Header Section --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 px-2 pb-2 border-b border-ash-medium">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-3">
                        <i className="fas fa-bolt text-text-main"></i>
                        Electricity (EB) Logs
                    </h1>
                    <p className="text-sm text-text-muted mt-1 font-normal">
                        Track meter readings, power consumption, and logs across campus premises.
                    </p>
                </div>

                {/* Actions & Mobile Toggle */}
                <div className='flex gap-2 justify-between items-center w-full sm:w-auto'>
                    <div className="w-full sm:w-auto lg:hidden">
                        <Button
                            variant="outline"
                            className="w-full justify-center font-medium border-ash-medium"
                            // leftIcon="fas fa-filter"
                            onClick={() => setIsMobileFilterOpen(true)}
                        >
                            Filters
                        </Button>
                    </div>

                    {canCreate && (
                        <div className="block w-full sm:w-auto">
                            <Button
                                onClick={openCreateForm}
                                // leftIcon="fas fa-plus"
                                variant="dark"
                                className="w-full font-medium whitespace-nowrap"
                            >
                                <span className='hidden md:inline'>Log Reading</span>
                                <span className='inline md:hidden'>Log</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Main Content Layout (Responsive 25% Filters / 75% Table) --- */}
            <div className="flex-1 flex flex-col lg:flex-row gap-5 h-[calc(100vh-140px)] relative">

                {/* MOBILE OVERLAY */}
                {isMobileFilterOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileFilterOpen(false)}
                    />
                )}

                {/* LEFT PANEL: Filters */}
                <div className={`
                    fixed inset-y-0 left-0 z-50 w-[280px] bg-surface border-r border-ash-medium p-5 flex flex-col gap-5 shadow-2xl transition-transform duration-300 ease-in-out
                    lg:static lg:w-[25%] lg:min-w-[260px] lg:max-w-[320px] lg:shrink-0 lg:rounded-lg lg:shadow-sm lg:translate-x-0 lg:border lg:z-auto
                    ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
                    overflow-y-auto custom-scrollbar
                `}>
                    <div className="flex items-center justify-between lg:block border-b border-ash-medium pb-3">
                        <h3 className="font-medium text-text-main flex items-center gap-2">
                            <i className="fas fa-filter text-text-muted text-sm"></i> Filter Logs
                        </h3>
                        <button className="lg:hidden text-text-muted hover:text-text-main transition-colors" onClick={() => setIsMobileFilterOpen(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Search Input */}
                        <div>
                            <label className="text-[13px] font-medium text-text-main mb-1.5 block">Search</label>
                            <div className="relative">
                                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs"></i>
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Log No, Notes..."
                                    className="w-full pl-8 pr-3 py-2 rounded-md border border-ash-medium bg-background text-sm focus:outline-none focus:border-ash-dark transition-colors"
                                />
                            </div>
                        </div>

                        {/* Premises Filter */}
                        <div className="relative">
                            <label className="text-[13px] font-medium text-text-main mb-1.5 block">Premises</label>
                            <SearchSelectNew
                                options={premisesOptions}
                                value={filters.premisesId}
                                onValueChange={(opt) => handleFilterChange('premisesId', String(opt))}
                                placeholder={isPremisesLoading ? "Loading..." : "All Premises"}
                            />
                            {isPremisesLoading && <i className="fas fa-spinner fa-spin absolute right-3 top-[34px] text-text-muted text-sm"></i>}
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="text-[13px] font-medium text-text-main mb-1.5 block">Date Range</label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={filters.fromDate}
                                    onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                                    className="w-1/2 px-2 py-2 rounded-md border border-ash-medium bg-background text-[13px] focus:outline-none focus:border-primary-soft"
                                />
                                <input
                                    type="date"
                                    value={filters.toDate}
                                    onChange={(e) => handleFilterChange('toDate', e.target.value)}
                                    className="w-1/2 px-2 py-2 rounded-md border border-ash-medium bg-background text-[13px] focus:outline-none focus:border-primary-soft"
                                />
                            </div>
                        </div>

                        {/* Reading Range Slider */}
                        <div>
                            <label className="text-[13px] font-medium text-text-main mb-3 flex justify-between items-center">
                                <span>Meter Reading</span>
                                <span className="text-text-main font-medium text-xs bg-brand-ash px-2 py-0.5 rounded">
                                    {filters.minReading} - {filters.maxReading}
                                </span>
                            </label>
                            <div className="px-1">
                                <Slider
                                    range
                                    min={0}
                                    max={1000000}
                                    step={100}
                                    value={[filters.minReading, filters.maxReading]}
                                    onChange={(value) => {
                                        const [min, max] = value as number[];
                                        setFilters((prev) => ({ ...prev, minReading: min, maxReading: max }));
                                    }}
                                    styles={{
                                        track: { backgroundColor: 'var(--brand-primary, #4b5563)' },
                                        handle: { borderColor: 'var(--brand-primary, #4b5563)', opacity: 1, backgroundColor: '#fff' },
                                        rail: { backgroundColor: 'var(--border-default, #dbdbdb)' }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-5 border-t border-ash-medium space-y-2">
                        <Button variant="outline" className="w-full font-medium border-ash-medium" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                        <Button variant="primary" className="w-full lg:hidden font-medium" onClick={() => setIsMobileFilterOpen(false)}>
                            Apply Filters
                        </Button>
                    </div>
                </div>

                {/* RIGHT PANEL: Data Table */}
                <div className="flex-1 bg-surface border border-ash-medium rounded-lg shadow-sm flex flex-col overflow-hidden">
                    <TableContainer className="h-full overflow-y-auto">
                        <THead className="sticky top-0 z-10 after:absolute after:bottom-0 after:left-0 after:right-0 after:border-b after:border-ash-medium">
                            <tr>
                                <Th className="text-center font-bold">S.No</Th>
                                <Th className="font-bold">Log Details</Th>
                                <Th className="font-bold">Premises</Th>
                                <Th className="font-bold">Reading</Th>
                                {/* <Th className="font-bold">Notes</Th> */}
                                <Th className="text-center font-bold w-24">Actions</Th>
                            </tr>
                        </THead>
                        <TBody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <i className="fas fa-circle-notch fa-spin text-text-main text-2xl mb-3"></i>
                                            <p className="text-text-muted text-sm font-medium">Loading EB logs...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="bg-action-danger/10 border border-action-danger/20 rounded-lg p-5 mx-auto max-w-sm">
                                            <p className="text-action-danger font-medium text-sm">Failed to load logs. Please try again.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : ebLogs.length > 0 ? (
                                ebLogs.map((log: any, index: number) => (
                                    <Tr key={log._id} className="group hover:bg-brand-surface-hover transition-colors border-b border-ash-light last:border-0">

                                        {/* S.No */}
                                        <Td className="text-center font-medium text-text-muted text-[13px]">
                                            {index + 1}
                                        </Td>

                                        {/* Log Details (No & Date/Time) */}
                                        <Td>
                                            <p className="font-medium text-text-main text-[14px]">
                                                {log.ebLogNo || 'N/A'}
                                            </p>
                                            <p className="text-[12px] text-text-muted flex items-center gap-1.5 mt-0.5">
                                                <i className="far fa-calendar text-[10px]"></i>
                                                {new Date(log.date).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                                <span className="mx-1">•</span>
                                                <i className="far fa-clock text-[10px]"></i>
                                                {formatTime12Hour(log.time)}
                                            </p>
                                        </Td>

                                        {/* Premises */}
                                        <Td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-primary-soft/30 flex items-center justify-center text-text-main text-xs shrink-0">
                                                    <i className="fas fa-building"></i>
                                                </div>
                                                <p className="font-medium text-text-main text-[13px]">
                                                    {log.premisesId?.premisesName || 'Unknown'}
                                                </p>
                                            </div>
                                        </Td>

                                        {/* Reading */}
                                        <Td>
                                            <span className="inline-flex items-center font-medium text-text-main text-[14px] bg-background border border-ash-medium px-2 py-1 rounded">
                                                <i className="fas fa-tachometer-alt text-text-main-soft mr-2 text-xs"></i>
                                                {log.meterReading?.toLocaleString()} <span className="text-[11px] text-text-muted ml-1">kWh</span>
                                            </span>
                                        </Td>

                                        {/* Notes */}
                                        {/* <Td>
                                            <p className="text-[13px] text-text-muted line-clamp-2 max-w-[200px]" title={log.note}>
                                                {log.note || <span className="italic opacity-50">No notes</span>}
                                            </p>
                                        </Td> */}

                                        {/* Actions */}
                                        <Td className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-text-main hover:text-text-main hover:hover:bg-brand-surface-hover rounded-md"
                                                    onClick={() => openViewForm(log)}
                                                    title="View / Edit Log"
                                                >
                                                    <i className="fas fa-pen text-xs"></i>
                                                </Button>
                                                {canDelete && (
                                                    <Button
                                                        variant="danger"
                                                        className="h-8 w-8 p-0 text-action-danger hover:bg-action-danger/10 rounded-md"
                                                        onClick={() => handleDelete(log._id, log.ebLogNo)}
                                                        disabled={isDeleting}
                                                        title="Delete Log"
                                                    >
                                                        {isDeleting ? <i className="fas fa-spinner fa-spin text-xs"></i> : <i className="fas fa-trash-alt text-xs"></i>}
                                                    </Button>
                                                )}
                                            </div>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-background border border-ash-medium flex items-center justify-center mb-4 text-text-soft text-xl shadow-sm">
                                                <i className="fas fa-bolt"></i>
                                            </div>
                                            <h3 className="text-[15px] font-medium text-text-main mb-1">No EB Logs Found</h3>
                                            <p className="text-text-muted text-[13px] max-w-sm">
                                                Adjust your filters or record a new meter reading to populate this list.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </TBody>
                    </TableContainer>
                </div>
            </div>

            {/* Dummy Modal Component - Ensure to create/import this correctly */}
            <EbLogModal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setSelectedLog(null);
                }}
                logId={selectedLog?._id}
                organizationId={organizationId!}
            />
        </div>
    );
}