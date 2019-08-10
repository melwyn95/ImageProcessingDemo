import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import { head } from 'ramda';
import fetch from 'node-fetch';
import FormData from 'form-data';

import { FAILURE, PROCESSING, SUCCESS, INVALID_IMAGE_DIMENSIONS, UNABLE_TO_UPLOAD_IMAGE } from '../constants';
import { Request, Response } from 'express';
import { getMulterRequestHandler } from '../services/Upload';
import UpdateStatusInRedis from '../services/UpdateStatusInRedis';
import { IMGUR_UPLOAD_API_URL, IMGUR_AUTH_HEADER_VALUE } from '../config';
import ValidateImageDimensions from '../services/ValidateImageDimensions';
import { deleteFile } from '../utils';


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
        const formData = new FormData();
        formData.append('image', fs.createReadStream(filePath));
        fetch(IMGUR_UPLOAD_API_URL, {
            method: 'POST',
            headers,
            body: formData
        }).then(async response => {
            const { data: { link: imgurURL } = { link: ''}} = await response.json();

            // Delete Image File
            deleteFile(filePath);

            // Queue Job on to Kafka

            // Update status in Redis
            UpdateStatusInRedis(jobId, { 
                status: SUCCESS, 
                message: '',
                originalImage: imgurURL,                
            });
            console.log(imgurURL);
            
        }).catch(error => {

            // Update Status in Redis
            UpdateStatusInRedis(jobId, { status: FAILURE, message: UNABLE_TO_UPLOAD_IMAGE });

        });

        UpdateStatusInRedis(jobId, { status: PROCESSING, message: '' });

        return res.json({ type: PROCESSING, jobId });
    });
}

export default UploadHandler;


/**
 * Client Id: 8475947c783fd3c
 * Client Secret: ba27d1222275f7b24de907d5298ac05f0cda71e7
 */


