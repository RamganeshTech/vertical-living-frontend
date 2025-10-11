
export const OrderInformation = () => {
    return <Card className="mt-6">
        <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-blue-600"></i>
                Order Information
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <i className="fa-solid fa-truck text-blue-600 mt-1"></i>
                    <div>
                        <p className="font-semibold text-gray-800">Delivery</p>
                        <p className="text-gray-600 text-xs mt-1">
                            Estimated 5-7 business days
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <i className="fa-solid fa-shield-halved text-green-600 mt-1"></i>
                    <div>
                        <p className="font-semibold text-gray-800">Secure Checkout</p>
                        <p className="text-gray-600 text-xs mt-1">
                            Your data is protected
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <i className="fa-solid fa-headset text-purple-600 mt-1"></i>
                    <div>
                        <p className="font-semibold text-gray-800">Support</p>
                        <p className="text-gray-600 text-xs mt-1">
                            24/7 customer service available
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <i className="fa-solid fa-rotate-left text-orange-600 mt-1"></i>
                    <div>
                        <p className="font-semibold text-gray-800">Returns</p>
                        <p className="text-gray-600 text-xs mt-1">
                            30-day return policy
                        </p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
}

import React, { useState, useEffect, useMemo } from 'react';
import { useGetCart, useUpdateCartItemQuantity, useRemoveCartItem, useGenrateMaterialInventCartPdf } from '../../../apiList/MaterialInventory Api/MaterialInventoryCartApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProjects } from "../../../apiList/projectApi";
import type { AvailableProjetType } from '../../Department Pages/Logistics Pages/LogisticsShipmentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { toast } from '../../../utils/toast';
import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { truncate } from '../../../utils/dateFormator';
import SearchSelectNew from '../../../components/ui/SearchSelectNew';
import { Label } from '../../../components/ui/Label';
import { downloadImage } from '../../../utils/downloadFile';

interface CartItemProps {
    item: {
        productId: string;
        quantity: number;
        specification: any;
        singleItemCost: number;
        orderedBefore: boolean;
    };
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemoveItem: (productId: string) => void;
    isUpdating: boolean;
    isRemoving: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem, isUpdating, isRemoving }) => {
    const spec = item.specification || {};
    const img = spec.imageUrl || spec.image || null;

    return (
        <Card className="mb-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-4 flex-1">
                    {img && (
                        <img
                            src={img}
                            alt="product"
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-400 flex-shrink-0"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                            <CardTitle className="text-base sm:text-lg font-bold text-blue-900">
                                {truncate(spec.subcategory || spec.name || spec.model || "Unnamed", 30)}
                            </CardTitle>
                            {item.orderedBefore && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs whitespace-nowrap">
                                    <i className="fa-solid fa-clock-rotate-left mr-1"></i>
                                    Reorder
                                </Badge>
                            )}
                        </div>
                        <CardDescription className="text-xs text-gray-500 mt-1">
                            {spec.category && <span className="mr-2"><Badge variant="secondary">{spec.category}</Badge></span>}
                            {spec.model && <span className="mr-2">Model: <span className="font-semibold">{truncate(spec.model, 14)}</span></span>}
                            {spec.itemCode && <span className="mr-2">Code: <span className="font-semibold">{spec.itemCode}</span></span>}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Product Details */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-700 mb-4">
                    {Object.entries(spec).map(([key, value]) => {
                        if (["image", "imageUrl", "_id", "organizationId", "series", "cct", "mrp", "itemCode", "name", "subcategory", "category", "model"].includes(key)) return null;
                        if (typeof value === "object" || value === undefined || value === null) return null;

                        return (
                            <div key={key} className="bg-gray-50 rounded px-2 py-1 border border-gray-100">
                                <span className="font-semibold capitalize">{truncate(key, 12)}:</span> {truncate(String(value), 18)}
                            </div>
                        );
                    })}
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-gray-200 pt-4">
                    {/* Price Info */}
                    <div className="space-y-1">
                        {spec.mrp && (
                            <p className="text-xs sm:text-sm text-gray-500">
                                Unit Price: ₹{spec.mrp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        )}
                        <p className="text-lg sm:text-xl font-bold text-blue-600">
                            Item Total: ₹{item.singleItemCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Quantity Controls & Remove Button */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                            <Button
                                onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 p-0 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm"
                                variant='danger'
                                disabled={isUpdating || item.quantity <= 1}
                                isLoading={false}
                            >
                                <i className="fa-solid fa-minus text-sm"></i>
                            </Button>

                            <span className="w-12 text-center font-bold text-gray-800 text-lg">
                                {item.quantity}
                            </span>

                            <Button
                                onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                                variant='primary'
                                className="w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                                disabled={isUpdating}
                                isLoading={false}
                            >
                                <i className="fa-solid fa-plus text-sm"></i>
                            </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                            onClick={() => onRemoveItem(item.productId)}
                            variant='danger'
                            className="w-10 h-10 p-0 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            disabled={isRemoving}
                            isLoading={isRemoving}
                        >
                            <i className="fa-solid fa-trash text-sm"></i>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const MaterialInventoryCartMain = () => {
    const { organizationId } = useParams<{ organizationId: string }>();
    const navigate = useNavigate();

    const [selectedProjectId, setSelectedProjectId] = useState("");

    const { data: projectsData } = useGetProjects(organizationId!);
    const projects = projectsData?.map((project: AvailableProjetType) => ({
        _id: project._id,
        projectName: project.projectName
    }));


    const projectOptions = (projectsData || [])?.map((project: AvailableProjetType) => ({
        value: project._id,
        label: project.projectName
    }))

    // Auto-select first project by default
    useEffect(() => {
        if (projects && projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projects[0]._id);
        }
    }, [projects, selectedProjectId]);

    const currentProjectName = useMemo(() => projects?.find((project: any) => {
        if (project._id === selectedProjectId) {
            console.log("projectname", project)
            return project?.projectName
        }
    }
    ), [selectedProjectId])

    console.log("currentProjectName", currentProjectName)

    const { data: cart, isLoading: isCartLoading, error: cartError, refetch } = useGetCart({
        organizationId: organizationId!,
        projectId: selectedProjectId
    });

    const { mutateAsync: updateQuantity, isPending: isUpdating } = useUpdateCartItemQuantity();
    const { mutateAsync: removeItem, isPending: isRemoving } = useRemoveCartItem();
    const { mutateAsync: generatePdf, isPending: isGenerating } = useGenrateMaterialInventCartPdf();

    const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
        if (!cart?._id || isUpdating) return;

        try {
            await updateQuantity({
                cartId: cart._id,
                productId,
                quantity: newQuantity,
                // organizationId: organizationId!,
                // projectId: selectedProjectId
            });
            toast({
                title: "Success",
                description: "Cart updated successfully"
            });
            refetch();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update quantity",
                variant: "destructive"
            });
        }
    };

    const handleRemoveItem = async (productId: string) => {
        if (!cart?._id || isRemoving) return;

        try {
            await removeItem({
                cartId: cart._id,
                productId,
                // organizationId: organizationId!,
                // projectId: selectedProjectId
            });
            toast({
                title: "Success",
                description: "Item removed from cart"
            });
            refetch();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to remove item",
                variant: "destructive"
            });
        }
    };

    const handleGeneratePDF = async () => {
        try {
            const data: any = await generatePdf({
                projectId: selectedProjectId,
                id: cart?._id || ""
            })


            downloadImage({ src: data?.url, alt: data?.fileName })
            refetch()
            toast({
                title: "Success",
                description: "Material Pdf Geenrated"
            });
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed too Generate Pdf",
                variant: "destructive"
            });
        }
    };

    // Loading State
    if (isCartLoading) {
        return <MaterialOverviewLoading />;
    }

    // Error State
    if (cartError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
                <div className="container mx-auto max-w-6xl">
                    <Card className="border-red-200">
                        <CardContent className="p-8 text-center">
                            <div className="mb-4">
                                <i className="fa-solid fa-circle-exclamation text-6xl text-red-500"></i>
                            </div>
                            <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Cart</h2>
                            <p className="text-gray-600 mb-4">
                                {cartError instanceof Error ? (cartError as any)?.response?.data?.message || cartError?.message : 'An unexpected error occurred'}
                            </p>
                            <Button
                                onClick={() => refetch()}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                <i className="fa-solid fa-rotate-right mr-2"></i>
                                Retry
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full max-h-full overflow-y-auto 
        bg-gradient-to-br from-blue-50 to-indigo-100 p-2 ">
            <div className="max-w-full">
                {/* Header with Back Button, Title, and Project Selector */}
                <header className="mb-2 ">


                    {/* Title and Project Selection Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Title */}

                        {/* Back Button */}

                        <section className='flex gap-3 items-center'>
                            <div
                                onClick={() => navigate(-1)}
                                className='bg-white hover:bg-slate-200 flex items-center justify-center w-10 h-10 border border-gray-300 cursor-pointer rounded-lg shadow-sm mb-4 transition-colors'
                            >
                                <i className='fas fa-arrow-left text-gray-700'></i>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 flex items-center gap-3">
                                    <i className="fa-solid fa-cart-shopping"></i>
                                    Inventory Cart
                                </h1>
                                <p className="text-gray-600 text-sm sm:text-base mt-1">
                                    Review and manage your selected materials
                                </p>
                            </div>
                        </section>


                        {/* Project Selector and Generate PDF */}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                            {/* Project Dropdown */}
                            <div className="relative min-w-[250px]">
                                <Label>Select project for the displaying the cart items</Label>
                                <SearchSelectNew
                                    options={projectOptions}
                                    placeholder="Select project"
                                    searchPlaceholder="Search projects..."
                                    value={selectedProjectId || undefined}
                                    onValueChange={(value) => setSelectedProjectId(value || "")}
                                    searchBy="name"
                                    displayFormat="simple"
                                    className="w-full"
                                />
                            </div>

                            {/* Generate PDF Button */}
                            <Button
                                isLoading={isGenerating}
                                onClick={handleGeneratePDF}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                                disabled={!cart?.items?.length}
                            >
                                <i className="fa-solid fa-file-pdf mr-2"></i>
                                Generate PDF
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Empty Cart State */}
                {(!cart || cart.items?.length === 0) ? (
                    <Card>
                        <CardContent className=" p-8 sm:p-12 text-center">
                            <div className="mb-6">
                                <i className="fa-solid fa-cart-shopping text-6xl sm:text-8xl text-gray-300"></i>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
                                Your Cart is Empty
                            </h2>
                            <p className="text-gray-500 mb-2 text-sm sm:text-base">
                                Start adding materials to see them here.
                            </p>

                            <p className="text-gray-500 mb-6 text-sm sm:text-base">
                                {selectedProjectId && currentProjectName?.projectName ? (
                                    <p>

                                        {`No Carts Available for the ${currentProjectName?.projectName}`}

                                    </p>
                                ) : null}
                            </p>
                            {/* <Button
                                onClick={() => navigate(-1)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <i className="fa-solid fa-plus mr-2"></i>
                                Browse Materials
                            </Button> */}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Cart Summary Header */}
                        <Card className="mb-6">
                            <CardContent className="p-2">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                    <div className='flex justify-between items-center'>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {cart?.items.length || 0}
                                        </p>
                                        <p className="text-2xl font-semibold ml-1 text-gray-600">Cart Items</p><br />
                                    </div>
                                    {/* <div className="text-left sm:text-right">
                                        <p className="text-sm text-gray-600">Cart Status</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${cart?.status === 'pending'
                                                ? 'bg-amber-100 text-amber-700'
                                                : cart?.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                <i className={`fa-solid ${cart?.status === 'pending' ? 'fa-clock' :
                                                    cart?.status === 'active' ? 'fa-circle-check' : 'fa-circle'
                                                    } mr-1`}></i>
                                                {cart?.status || 'N/A'}
                                            </span>
                                        </div>
                                    </div> */}
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ₹{cart?.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cart Items */}
                        <div className="space-y-4 mb-6">
                            {cart?.items.map((item) => (
                                <CartItem
                                    key={item.productId}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemoveItem={handleRemoveItem}
                                    isUpdating={isUpdating}
                                    isRemoving={isRemoving}
                                />
                            ))}
                        </div>

                        {/* Cart Summary & Checkout */}
                        <Card className=" bottom-4 sm:bottom-6 shadow-2xl">
                            <CardContent className="p-4 sm:p-6">
                                <div className="space-y-4">
                                    {/* Cost Breakdown */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm sm:text-base">
                                            <span className="text-gray-600">Subtotal ({cart?.items.length} items)</span>
                                            <span className="font-semibold text-gray-800">
                                                ₹{cart?.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        {/* <div className="flex justify-between items-center text-sm sm:text-base">
                                            <span className="text-gray-600">Tax & Fees</span>
                                            <span className="font-semibold text-gray-800">Calculated at checkout</span>
                                        </div> */}
                                        <div className="border-t-2 border-gray-300 pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg sm:text-xl font-bold text-gray-900">
                                                    Total Cost
                                                </span>
                                                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                                    ₹{cart?.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        <Button
                                            variant='secondary'
                                            onClick={() => navigate(-1)}
                                            className=" w-full order-2 sm:order-1"
                                        >
                                            <i className="fa-solid fa-arrow-left mr-2"></i>
                                            Continue Shopping
                                        </Button>
                                        <Button
                                            isLoading={isGenerating}
                                            onClick={handleGeneratePDF}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full shadow-lg hover:shadow-xl transition-all order-1 sm:order-2"
                                            disabled={!cart?.items.length}
                                        >
                                            <i className="fa-solid fa-file-pdf mr-2"></i>
                                            Generate Order PDF
                                        </Button>
                                    </div>

                                    {/* PDF Link */}
                                    {cart?.pdfLink && (
                                        <div className="pt-3 border-t border-gray-200">
                                            <a
                                                href={cart.pdfLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                                            >
                                                <i className="fa-solid fa-file-pdf"></i>
                                                <span>View Generated Order Summary (PDF)</span>
                                                <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info Card - Space reserved for future use */}
                        <div className="mt-6">
                            <OrderInformation />
                            {/* Uncomment above component when needed - it will fit perfectly here */}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MaterialInventoryCartMain;
