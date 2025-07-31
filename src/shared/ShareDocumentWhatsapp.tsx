import {
    useGetClientByProject,
    useGetDocMessageForWhatsapp,
} from "../apiList/Documentation Api/documentationApi";
import { useGetFormRequriemetn } from "../apiList/Stage Api/requirementFormApi";
import { Button } from "../components/ui/Button";
import { toast } from "../utils/toast";

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
    const { data: clientrequrieent } = useGetFormRequriemetn({ projectId })

    // console.log("msgData",msgData?.message)
    // const formattedPhone = clientData?.phoneNo?.startsWith("+91") ? clientData?.phoneNo : `+91${clientData?.phoneNo}`;
    let fullMessage = `Hello *${clientData?.clientName  || clientrequrieent?.clientData?.clientName || "Client"}*,\n\n${msgData?.message}`;

    // console.log("formatted phone", formattedPhone)

    // const whatsappUrl = `https://wa.me/${formattedPhone.replace("+", "")}?text=${encodeURIComponent(
    //     fullMessage
    // )}`;

    const getTitle = () => {
        if (!clientData?.phoneNo) return "client's phone number not provided";
        if (isStageCompleted !== "completed") return "complete the stage";
        return "";
    };



    const handleWhatsAppShare = () => {
        const formattedPhone = clientData?.phoneNo?.startsWith("+91")
            ? clientData?.phoneNo
            : clientData?.phoneNo
                ? `+91${clientData?.phoneNo}`
                : null;

        const fallbackPhone = clientrequrieent?.clientData?.whatsapp || null;
        const finalPhone = formattedPhone || fallbackPhone;

        if (!finalPhone) {
            toast({
                title: "Error",
                description: "Client WhatsApp number not provided",
                variant: "destructive",
            });
            return;
        }

        const whatsappUrl = `https://wa.me/${finalPhone.replace("+", "")}?text=${encodeURIComponent(fullMessage)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <Button variant={`outline`}
            disabled={loadingClient || loadingMessage || isStageCompleted !== "completed"}
            title={getTitle()}
            onClick={handleWhatsAppShare}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 min-w-30 rounded items-center ${className}`}
        >
            <i className="fab fa-whatsapp mr-1 "></i>
            {/* {loadingClient || loadingMessage || isStageCompleted !== "completed" ? (
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
            )} */}
             Share Doc
        </Button>
    );
};

export default ShareDocumentWhatsapp;
