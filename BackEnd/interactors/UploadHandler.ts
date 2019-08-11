import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import { head } from 'ramda';
import fetch from 'node-fetch';
import FormData from 'form-data';

import { FAILURE, PROCESSING, SUCCESS, INVALID_IMAGE_DIMENSIONS, UNABLE_TO_UPLOAD_IMAGE } from '../constants';
import { Request, Response } from 'express';
import { getMulterRequestHandler } from '../helpers/Upload';
import UpdateStatusInRedis from '../services/UpdateStatusInRedis';
import { IMGUR_UPLOAD_API_URL, IMGUR_AUTH_HEADER_VALUE } from '../config';
import ValidateImageDimensions from '../services/ValidateImageDimensions';
import { deleteFile } from '../utils';
import { AddJobToQueue } from '../services/AddJobToQueue';
import { Job } from '../types';

const headers = { Authorization: IMGUR_AUTH_HEADER_VALUE };
const getPathName = (fileName: string) => path.join(__dirname, '../images', fileName);

const UploadHandler = (req: Request, res: Response) => {
    const jobId = uuid();
    const upload = getMulterRequestHandler(jobId);

    upload(req, res, error => {
        error && res.json({ error, type: FAILURE });

        // @ts-ignore
        const file = head(req.files);
        const { fieldname, originalname } = file;
        const fileName = `${fieldname}_${jobId}_${originalname}`;
        const filePath = getPathName(fileName);

        // validate image dimensions
        if (!ValidateImageDimensions(filePath)) {
            deleteFile(filePath);
            return res.json({ error: INVALID_IMAGE_DIMENSIONS, type: FAILURE });
        }

        // Upload to Imgur
        const body = new FormData();
        body.append('image', fs.createReadStream(filePath));
        fetch(IMGUR_UPLOAD_API_URL, {
            method: 'POST',
            headers,
            body
        }).then(async response => {
            const { data: { link: imgurURL } = { link: ''}} = await response.json();
            const job: Job = {
                jobId,
                status: SUCCESS, 
                message: '',
                originalImage: imgurURL,
            }
            deleteFile(filePath);
            AddJobToQueue(jobId, JSON.stringify(job));
            
        }).catch(error => {
            const job: Job = { jobId, status: FAILURE, message: UNABLE_TO_UPLOAD_IMAGE };
            UpdateStatusInRedis(jobId, job);
        });

        UpdateStatusInRedis(jobId, { jobId, status: PROCESSING, message: '' });

        return res.json({ type: PROCESSING, jobId });
    });
}

export default UploadHandler;