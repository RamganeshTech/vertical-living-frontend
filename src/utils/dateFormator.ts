export function dateFormate (date:string){

    if(!date){
        return "N/A"
    }
    
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth()+1;
    const day = new Date(date).getDate();

    return `${day}-${month}-${year}`
}