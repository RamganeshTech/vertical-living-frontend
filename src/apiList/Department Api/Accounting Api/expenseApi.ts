import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";

// ========================================
// 📌 Types & Interfaces
// ========================================

interface IExpense {
    _id: string;
    organizationId: string;
    vendorId: string;
    vendorName: string;
    invoiceNumber: string;
    dateOfPayment: Date;
    amount: number;
    paidThrough: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateExpenseInput {
    organizationId: string;
    vendorId: string;
    vendorName: string;
    dateOfPayment?: Date;
    amount: number;
    paidThrough: string;
    notes?: string;
}

interface UpdateExpenseInput {
    id: string;
    vendorId?: string;
    vendorName?: string;
    invoiceNumber?: string;
    dateOfPayment?: Date;
    amount?: number;
    paidThrough?: string;
    notes?: string;
}

interface GetAllExpensesParams {
    organizationId: string;
    vendorId?: string;
    invoiceNumber?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    paidThrough?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

interface GetExpenseStatisticsParams {
    organizationId: string;
    startDate?: string;
    endDate?: string;
}

interface ExpenseStatistics {
    totalExpenses: number;
    totalAmount: number;
    averageAmount: number;
    maxAmount: number;
    minAmount: number;
    topVendors: Array<{
        _id: string;
        vendorName: string;
        totalAmount: number;
        count: number;
    }>;
}

// ========================================
// 📌 API Functions
// ========================================

// ✅ Create Expense
const createExpense = async ({
    expenseData,
    api
}: {
    expenseData: CreateExpenseInput;
    api: AxiosInstance;
}) => {
    const { data } = await api.post("/department/accounting/expense/create", expenseData);
    if (!data.success) throw new Error(data.message);
    return data.data as IExpense;
};

// ✅ Update Expense
const updateExpense = async ({
    id,
    expenseData,
    api
}: {
    id: string;
    expenseData: Omit<UpdateExpenseInput, "id">;
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/department/accounting/expense/update/${id}`, expenseData);
    if (!data.success) throw new Error(data.message);
    return data.data as IExpense;
};

// ✅ Delete Expense
const deleteExpense = async ({
    id,
    api
}: {
    id: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/department/accounting/expense/delete/${id}`);
    if (!data.success) throw new Error(data.message);
    return data;
};

// ✅ Get Single Expense
const getExpenseById = async ({
    id,
    api
}: {
    id: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/department/accounting/expense/getsingle/${id}`);
    if (!data.success) throw new Error(data.message);
    return data.data as IExpense;
};

// ✅ Get All Expenses
const getAllExpenses = async ({
    params,
    api
}: {
    params: GetAllExpensesParams;
    api: AxiosInstance;
}) => {
    const { data } = await api.get("/department/accounting/expense/getall", { params });
    if (!data.success) throw new Error(data.message);
    return data as {
        data: IExpense[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    };
};

// ✅ Get Expense Statistics
const getExpenseStatistics = async ({
    params,
    api
}: {
    params: GetExpenseStatisticsParams;
    api: AxiosInstance;
}) => {
    const { data } = await api.get("/department/accounting/expense/getstatistics", { params });
    if (!data.success) throw new Error(data.message);
    return data.data as ExpenseStatistics;
};

// ========================================
// 📌 React Query Hooks
// ========================================

// ✅ 1. CREATE EXPENSE
export const useCreateExpense = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (expenseData: CreateExpenseInput) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to create expense");
            }
            if (!api) throw new Error("API instance not found for role");
            return await createExpense({ expenseData, api });
        },
        onSuccess: (data) => {
            // Invalidate all expenses list for this organization
            queryClient.invalidateQueries({ 
                queryKey: ["expenses", "list", data.organizationId] 
            });
            // Invalidate statistics
            queryClient.invalidateQueries({ 
                queryKey: ["expenses", "statistics", data.organizationId] 
            });
        }
    });
};

// ✅ 2. UPDATE EXPENSE
export const useUpdateExpense = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, ...expenseData }: UpdateExpenseInput) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to update expense");
            }
            if (!api) throw new Error("API instance not found for role");
            return await updateExpense({ id, expenseData, api });
        },
        onSuccess: (data, variables) => {
            // Invalidate the specific expense
            queryClient.invalidateQueries({ 
                queryKey: ["expenses", "detail", variables.id] 
            });
            // Invalidate all expenses list
            queryClient.invalidateQueries({ 
                queryKey: ["expenses", "list", data.organizationId] 
            });
            // Invalidate statistics
            queryClient.invalidateQueries({ 
                queryKey: ["expenses", "statistics", data.organizationId] 
            });
        }
    });
};

// ✅ 3. DELETE EXPENSE
export const useDeleteExpense = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ 
            id ,
            _organizationId:_unused 
            
        }: { 
            id: string; 
            _organizationId:string
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to delete expense");
            }
            if (!api) throw new Error("API instance not found for role");
            return await deleteExpense({ id, api });
        },
        onSuccess: (_, variables) => {
            // Invalidate the specific expense
            queryClient.invalidateQueries({ 
                queryKey: ["expenses", "detail", variables.id] 
            });
            // Invalidate all expenses list
            queryClient.invalidateQueries({ 
                queryKey: ["expenses", "list", variables._organizationId] 
            });
            // Invalidate statistics
            queryClient.invalidateQueries({ 
                queryKey: ["expenses", "statistics", variables._organizationId] 
            });
        }
    });
};

// ✅ 4. GET SINGLE EXPENSE
export const useGetExpenseById = (id: string, enabled: boolean = true) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["expenses", "detail", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to view expense");
            }
            if (!api) throw new Error("API instance not found for role");
            return await getExpenseById({ id, api });
        },
        enabled: enabled && !!id && !!role && !!api,
    });
};

// ✅ 5. GET ALL EXPENSES (with filters & pagination)// ✅ 5. GET ALL EXPENSES (with infinite scroll/pagination)
export const useGetAllExpenses = (
    params: Omit<GetAllExpensesParams, "page">, // Remove page from params
    enabled: boolean = true
) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["expenses", "list", params.organizationId, params],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to view expenses");
            }
            if (!api) throw new Error("API instance not found for role");
            
            return await getAllExpenses({ 
                params: { ...params, page: pageParam }, 
                api 
            });
        },
        getNextPageParam: (lastPage) => {
            // Return next page number if there's a next page, otherwise undefined
            return lastPage.pagination.hasNextPage 
                ? lastPage.pagination.page + 1 
                : undefined;
        },
        getPreviousPageParam: (firstPage) => {
            // Return previous page number if there's a previous page, otherwise undefined
            return firstPage.pagination.hasPrevPage 
                ? firstPage.pagination.page - 1 
                : undefined;
        },
        initialPageParam: 1,
        enabled: enabled && !!params.organizationId && !!role && !!api,
    });
};

// ✅ 6. GET EXPENSE STATISTICS
export const useGetExpenseStatistics = (
    params: GetExpenseStatisticsParams,
    enabled: boolean = true
) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["expenses", "statistics", params.organizationId, params],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to view statistics");
            }
            if (!api) throw new Error("API instance not found for role");
            return await getExpenseStatistics({ params, api });
        },
        enabled: enabled && !!params.organizationId && !!role && !!api,
    });
};