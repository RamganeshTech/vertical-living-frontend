import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { toast } from '../../../../utils/toast';
import {
    useGeneratePublicOrderMaterial,
} from '../../../../apiList/Stage Api/publicOrderMaterialApi';
import { downloadImage } from '../../../../utils/downloadFile';
import PublicOrderMaterialCompo from './PublicOrderMaterialCompo';

// interface AvailableProjetType {
//     _id: string;
//     projectName: string;
// }


const PublicOrderMatStaffView = () => {

    const { organizationId, projectId } = useParams();
    const navigate = useNavigate();

    // const [selectedProjectId, setSelectedProjectId] = useState<string>("");
   
    // Fetch projects
    // const { data } = useGetProjects(organizationId!);
    // const projects = data?.map((project: AvailableProjetType) => ({
    //     _id: project._id,
    //     projectName: project.projectName
    // }));

    // Auto-select first project
    // useEffect(() => {
    //     if (projects && projects.length > 0 && !selectedProjectId) {
    //         setSelectedProjectId(projects[0]?._id);
    //     }
    // }, [projects, selectedProjectId]);

    const { mutateAsync: generateLink, isPending: generatePending } = useGeneratePublicOrderMaterial()


    const handleGenerate = async () => {
        try {
            const res = await generateLink({ projectId: projectId!, organizationId: organizationId! });
            await downloadImage({ src: res?.pdfData?.url, alt: res?.pdfData?.pdfName })
            toast({ title: "Success", description: "Pdf Generated successfully" });
        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
        }
    };


    return (
        <div className="min-h-full bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-full mx-auto  px-4 sm:px-6 lg:px-3 py-4">
                    <div className="flex items-center justify-between">


                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(-1)}
                            >
                                <i className="fas fa-arrow-left" />

                            </Button>
                            <div className=''>
                                <h1 className="text-2xl font-bold text-gray-900">Order Materials</h1>
                                <span className="text-sm text-gray-500">view the material items ordered from the site</span>
                            </div>
                        </div>

                        {/* Project Selector */}


                        <Button
                            onClick={handleGenerate}
                            disabled={generatePending}
                            className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                            size="lg"
                        >
                            {generatePending ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-file-pdf"></i>
                                    Generate PDF
                                </>
                            )}
                        </Button>


                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-full mx-auto px-4 py-2">
                <PublicOrderMaterialCompo selectedProjectId={projectId!} organizationId={organizationId!} />
            </main>
        </div>
    )
}

export default PublicOrderMatStaffView