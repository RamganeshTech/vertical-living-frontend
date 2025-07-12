import axios from "axios";
import { toast } from "./toast";

export const downloadImage = async ({ src, alt }: { src: string, alt: string }) => {
    try {
        console.log("im donwloadin")
        const key = src.split(".com/")[1];
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/download-url?key=${encodeURIComponent(key)}&filename=${encodeURIComponent(alt)}`);


        const link = document.createElement("a");
        link.href = data.url;
        link.download = "";
        // link.target = "_blank"; // fallback
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    catch (error: any) {
        toast({ title: "Error", description: error?.response?.data?.message || "failed to download" })
    }
};