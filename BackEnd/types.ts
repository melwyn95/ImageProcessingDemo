type Status = "processing" | "success" | "failure"; 

interface Job {
    jobId: string,
    status: Status,
    message: string,
    originalImage?: string,
    horizontal?: string,
    vertical?: string,
    horizontalSmall?: string,
    gallery?: string 
}

export { Job };