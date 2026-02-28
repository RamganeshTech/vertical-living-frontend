import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { toast } from '../../../../utils/toast';
import {
    // useGeneratePublicOrderMaterial,
    useGetPublicProjects,
    usePublicOrderHistorySubmit,
} from '../../../../apiList/Stage Api/publicOrderMaterialApi';
// import { downloadImage } from '../../../../utils/downloadFile';
import PublicOrderMaterialCompo from './PublicOrderMaterialCompo';
import { COMPANY_DETAILS } from '../../../../constants/constants';

interface AvailableProjetType {
    _id: string;
    projectName: string;
}


const PublicOrderMaterialMain = () => {
    const { organizationId } = useParams() as { organizationId: string }
    const navigate = useNavigate();

    const [selectedProjectId, setSelectedProjectId] = useState<string>("");


    // Fetch projects
    const { data } = useGetPublicProjects(organizationId!);
    const projects = data?.map((project: AvailableProjetType) => ({
        _id: project._id,
        projectName: project.projectName
    }));

    // Auto-select first project
    useEffect(() => {
        if (projects && projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projects[0]?._id);
        }
    }, [projects, selectedProjectId]);


    // const { mutateAsync: generateLink, isPending: generatePending } = useGeneratePublicOrderMaterial()





    // const handleGenerate = async () => {
    //     try {
    //         const res = await generateLink({ projectId: selectedProjectId, organizationId: organizationId! });
    //         await downloadImage({ src: res?.pdfData?.url, alt: res?.pdfData?.pdfName })
    //         toast({ title: "Success", description: "Pdf Generated successfully" });
    //     } catch (err: any) {
    //         toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
    //     }
    // };




    const { mutateAsync: submitOrder, isPending: generatePending } = usePublicOrderHistorySubmit()

    const handlesubmit = async () => {
        try {
            await submitOrder({ projectId: selectedProjectId! });
            // await downloadImage({ src: res?.pdfData?.url, alt: res?.pdfData?.pdfName })
            toast({ title: "Success", description: "Order Sent to Ordering Material Stage" });
        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
        }
    };


    if (!organizationId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800">No Organization ID Found</h2>
                    <p className="text-gray-600 mt-2">Please set up your organization first.</p>
                    <Button
                        onClick={() => window.location.href = '/ordermaterial/setup'}
                        className="mt-4"
                    >
                        Go to Setup
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-3 py-4">
                    <div className="flex items-center justify-between">


                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                // onClick={() => navigate('/ordermaterial/setup')}
                                onClick={() => navigate(-1)}
                            >
                                <i className="fas fa-arrow-left" />

                            </Button>
                            <div className=''>
                                <h1 className="text-2xl font-bold text-gray-900">{COMPANY_DETAILS.COMPANY_NAME}</h1>
                                <span className="text-sm text-gray-500"> Order Materials</span>
                            </div>
                        </div>

                        {/* shop Selector */}
                        <div className="flex items-center gap-4">
                            <div className="min-w-[250px]">
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Select Project
                                </label>
                                <select
                                    value={selectedProjectId}
                                    onChange={(e) => setSelectedProjectId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    {projects?.map((project: AvailableProjetType) => (
                                        <option key={project._id} value={project._id}>
                                            {project.projectName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button
                                onClick={handlesubmit}
                                disabled={generatePending}
                                className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                size="lg"
                            >
                                Send To Order Material
                            </Button>


                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-full mx-auto px-4 py-8">
                {!selectedProjectId ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <i className="fas fa-project-diagram text-gray-300 text-5xl mb-4" />
                        <p className="text-gray-500 text-lg">Please select a project to continue</p>
                    </div>
                ) : (
                    <div>


                        <PublicOrderMaterialCompo selectedProjectId={selectedProjectId} organizationId={organizationId} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default PublicOrderMaterialMain;