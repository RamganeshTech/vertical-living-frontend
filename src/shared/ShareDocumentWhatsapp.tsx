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


    // console.log("msgData",msgData?.message)
    const formattedPhone = clientData?.phoneNo?.startsWith("+91") ? clientData?.phoneNo : `+91${clientData?.phoneNo}`;
    let fullMessage = `Hello *${clientData?.clientName}*,\n\n${msgData?.message}`;

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
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 min-w-30 rounded items-center ${className}`}
        >
            <i className="fab fa-whatsapp mr-1 "></i>
            {loadingClient || loadingMessage || isStageCompleted !== "completed" ? (
                <span>Share Doc</span>
            ) : (
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=""
                >
                    Share Doc
                </a>
            )}
        </Button>
    );
};

export default ShareDocumentWhatsapp;
