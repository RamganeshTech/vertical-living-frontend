export function dateFormate (date:string){

    if(!date){
        return "N/A"
    }
    
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth()+1;
    const day = new Date(date).getDate();

    return `${day}-${month}-${year}`
}


export function formatTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit", // ⬅️ remove this if you don’t want seconds
    hour12: true       // ⬅️ set false if you want 24-hour format
  });
}
