import React, { useState } from "react";
import type { ProjectInput } from "../components/CreateProject";


type TaginputProp = {
    tags:string[],
    setFormData: React.Dispatch<React.SetStateAction<ProjectInput>>
}

const TagInput:React.FC<TaginputProp> = ({ tags, setFormData }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e:any) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setFormData(p=> ({...p, "tags":[...tags, input.trim()]}));
      }
      setInput("");
    } else if (e.key === "Backspace" && !input) {
      setFormData(p=> ({...p, "tags":tags.slice(0, -1)}));
    }
  };

  const removeTag = (indexToRemove:number) => {
      setFormData(p=> ({...p, "tags":tags.filter((_, index) => index !== indexToRemove)}));
  };

  return (
    <div className="flex flex-wrap items-center border border-gray-400 rounded-md p-2 gap-2">
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
        className="flex-1 outline-none text-sm"
        placeholder="Type and press Enter"
      />
    </div>
  );
};

export default TagInput;
