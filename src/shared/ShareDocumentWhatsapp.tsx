import {
    useGetClientByProject,
    useGetDocMessageForWhatsapp,
} from "../apiList/Documentation Api/documentationApi";
import { Button } from "../components/ui/Button";

const ShareDocumentWhatsapp = ({
    projectId,
    stageNumber,
    isStageCompleted,
    className = "",
}: {
    projectId: string;
    stageNumber: string;
    isStageCompleted: string
    className?: string;
}) => {
    const { data: clientData, isLoading: loadingClient } = useGetClientByProject(projectId);
    const { data: msgData, isLoading: loadingMessage } = useGetDocMessageForWhatsapp({
        projectId,
        stageNumber,
    });


    // console.log("mesData", msgData)
    // console.log("clientData", clientData)

    const formattedPhone = clientData?.phoneNo.startsWith("+91") ? clientData?.phoneNo : `+91${clientData?.phoneNo}`;
    const fullMessage = `Hello ${clientData?.clientName},\n\n${msgData?.message}`;

    const whatsappUrl = `https://wa.me/${formattedPhone.replace("+", "")}?text=${encodeURIComponent(
        fullMessage
    )}`;

    const getTitle = () => {
        if (!clientData?.phoneNo) return "client's phone number not provided";
        if (isStageCompleted !== "completed") return "complete the stage";
        return "";
    };

    return (
        <Button variant={`outline`}
            disabled={loadingClient || loadingMessage || isStageCompleted !== "completed"}
            title={getTitle()}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded items-center ${className}`}
        >
            <i className="fab fa-whatsapp mr-1 "></i>
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                Share via WhatsApp
            </a>
        </Button>
    );
};

export default ShareDocumentWhatsapp;
