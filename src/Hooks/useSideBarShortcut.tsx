import { useEffect } from "react";

function useSidebarShortcut(openFn: () => void, closeFn: ()=> void) {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "]") {
        e.preventDefault(); // optional
        closeFn();
      }
      else  if (e.ctrlKey && e.key === "[") {
        e.preventDefault(); // optional
        openFn();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    // return () => window.removeEventListener("keydown", handleKeydown);
  }, [closeFn, openFn]);
}

export default useSidebarShortcut