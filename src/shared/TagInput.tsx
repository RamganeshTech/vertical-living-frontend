import React, { memo, useState } from "react";
// import type { ProjectInput } from "../components/CreateProject";


type TaginputProp = {
  tags: string[],
  setState: React.Dispatch<React.SetStateAction<string[]>>

}

const TagInput: React.FC<TaginputProp> = ({ tags, setState }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: any) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        // setState(p => ({ ...p, "tags": [...tags, input.trim()] }));
        setState([...tags, input.trim()]);  // ✅ fixed here
      }
      setInput("");
    } else if (e.key === "Backspace" && !input) {
      // setState(p => ({ ...p, "tags": tags.slice(0, -1) }));
      setState(tags.slice(0, -1));  // ✅ fixed here
    }
  };

  const removeTag = (indexToRemove: number) => {
    // setState(p => ({ ...p, "tags": tags.filter((_, index) => index !== indexToRemove) }));
        setState(tags.filter((_, index) => index !== indexToRemove));  // ✅ fixed here

  };

  return (
    <div className="flex flex-wrap items-center border-b-1 border-[#565656] p-2 gap-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1"
        >
          {tag}
          <span
            className="cursor-pointer ml-1 text-xs"
            onClick={() => removeTag(index)}
          >
            ×
          </span>
        </div>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="input flex-1 outline-none text-sm border-none"
        placeholder="Type and press Enter"
      />
    </div>
  );
};

export default memo(TagInput);
