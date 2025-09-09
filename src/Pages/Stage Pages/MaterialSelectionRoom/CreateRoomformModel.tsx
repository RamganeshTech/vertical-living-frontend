// import { useState } from "react";
// import { Input } from "../../../components/ui/Input";
// import { Label } from "../../../components/ui/Label";
// import { Button } from "../../../components/ui/Button";

// import { toast } from "../../../utils/toast";
// import { useCreateCustomRoom } from "../../../apiList/Stage Api/materialSelectionApi";

// interface CreateRoomFormProps {
//   onClose: () => void;
//   refetch: () => any;
//   projectId: string;
// }

// const CreateRoomformModel = ({ onClose, projectId, refetch }: CreateRoomFormProps) => {
//   const [roomName, setRoomName] = useState("");
//   const { mutateAsync: createRoom, isPending } = useCreateCustomRoom();

//   const handleCreateRoom = async () => {
//     if (!roomName.trim()) {
//       toast({ title: "Error", description: "Room name is required", variant: "destructive" });
//       return;
//     }
    
//     try {
//       await createRoom({ projectId, name: roomName });
//       toast({ title: "Success", description: "Room created successfully ✅" });
//       onClose();
//       refetch()
//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description: err?.response?.data?.message || err.message || "Failed to create room",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div onClick={onClose} className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div onClick={(e)=> e.stopPropagation()} className="bg-white rounded-lg w-full max-w-sm p-6 space-y-4">
//         <div>
//           <Label htmlFor="roomName" className="text-sm text-gray-700">
//             Room Name <span className="text-red-500">*</span>
//           </Label>
//           <Input
//             id="roomName"
//             value={roomName}
//             onChange={(e) => setRoomName(e.target.value)}
//             placeholder="e.g., Master Bedroom, Kitchen"
//             className="mt-1"
//           />
//         </div>

//         <Button
//           onClick={handleCreateRoom}
//           disabled={isPending}
//           className="w-full bg-blue-600 text-white hover:bg-blue-700 transition rounded-xl"
//         >
//           Create Room
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default CreateRoomformModel;
