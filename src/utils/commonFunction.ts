export const  formatDateToDDMMMYYYY = (dateString:string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
}

export const checkType = (type:number) =>{
    if(type === 1){
        return 'To Receive'
    }else if(type === 2){
        return 'To Send'
    }
}

export const checkSettledStatus = (type:boolean) =>{
    if(type){
        return 'Done'
    }else{
        return 'Pending'
    }
}