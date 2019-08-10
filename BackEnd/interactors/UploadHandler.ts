import uuid from 'uuid';
import { upload } from '../services/upload';
import { FAILURE, SUCCESS } from '../constants';
import { Request, Response } from 'express';

const UploadHandler = (req: Request, res: Response) => {
    const jobId = uuid();
    upload(req, res, error => {
        error && res.json({ error, type: FAILURE });
       
        
        
        return res.json({ type: SUCCESS, jobId });
    });
}

export default UploadHandler;