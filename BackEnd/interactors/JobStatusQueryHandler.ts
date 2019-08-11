import { Request, Response } from 'express';
import GetJobStatusInRedis from '../services/GetStatusInRedis';

const JobStatusQueryHandler = (req: Request, res: Response) => {
    const { jobId } = req.params;

    GetJobStatusInRedis(jobId, [], 
        (_: any, response: any) => res.json(response));
};

export default JobStatusQueryHandler;