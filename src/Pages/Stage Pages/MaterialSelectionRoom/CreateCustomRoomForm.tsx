import { useState } from "react";
import { useCreateCustomRoom } from "../../../apiList/Stage Api/materialSelectionApi"; 

export default function CreateCustomRoomForm({ projectId }: { projectId: string }) {
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useCreateCustomRoom();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await mutateAsync({ projectId, name });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <div>
        <label className="block font-medium">Room Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <button
        disabled={isPending}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Create Room
      </button>
    </form>
  );
}
