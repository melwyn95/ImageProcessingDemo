import { Request, Response } from 'express';
import GetJobStatusInRedis from '../services/GetJobStatusInResis';

const JobStatusQueryHandler = (req: Request, res: Response) => {
    const { jobId } = req.params;

    GetJobStatusInRedis(jobId, ['jobId', 'status', 'message'], (_: any, { status, message }: any) => {

        res.json({ jobId, status, message });
    })
};

export default JobStatusQueryHandler;