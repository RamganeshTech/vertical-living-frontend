import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "../utils/toast";

interface GenerateWhatsappLinkProps {
  enableCreate?: boolean;
  projectId: string;
  context: string;
  label?: string;
  stage: string,
  generateLink: ({ projectId }: { projectId: string }) => Promise<any>;
  isPending: boolean;
  data: any;
}

const GenerateWhatsappLink: React.FC<GenerateWhatsappLinkProps> = ({
  enableCreate,
  projectId,
  context,
  label,
  generateLink,
  isPending,
  data,
}) => {
  const [token, settoken] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Set token when backend returns it
  useEffect(() => {
    if (typeof data === "string") {
      settoken(data);
    }
  }, [data]);

  // Copy to clipboard handler
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy link", variant: "destructive" });
    }
  };

  // WhatsApp share handler
  const handleWhatsappShare = () => {
    const text = encodeURIComponent(`Hey, please check this ${context} link:\`${token}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Initial link generation handler
  const handleGenerate = async () => {
    try {
      const res = await generateLink({ projectId });
      if (res?.shareableUrl) {
        settoken(res.shareableUrl);
        toast({ title: "Link generated", description: "You can now share the link", variant: "default" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm w-full max-w-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
          <i className="fas fa-link"></i> {label || "Generate Shareable Link"}
        </h3>
      </div>

      {/* Show link after generation */}
      {token ? (
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <Input readOnly value={token} className="flex-1 text-sm cursor-default" />
          <Button onClick={handleCopy} variant="outline" className="flex gap-2">
            <i className={`fas ${copied ? "fa-check-circle" : "fa-copy"}`}></i>
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button onClick={handleWhatsappShare} className="bg-green-500 hover:bg-green-600 text-white flex gap-2">
            <i className="fab fa-whatsapp"></i>
            Share
          </Button>
        </div>
      ) : (
        <>
        {enableCreate && <Button
          onClick={handleGenerate}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isPending ? "Generating..." : "Generate Link"}
        </Button>}</>
      )}
    </div>
  );
};

export default GenerateWhatsappLink;
