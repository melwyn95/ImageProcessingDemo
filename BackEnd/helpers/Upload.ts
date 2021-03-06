import multer from 'multer';
import storage from './Storage';
import fileFilter from './FileFilter';
import { IMAGE_PARAM_NAME, NUMBER_OF_FILES_TO_HANDLE } from '../config';

export const getMulterRequestHandler = (jobId: string) => multer({
    storage: storage(jobId),
    fileFilter,
}).array(IMAGE_PARAM_NAME, NUMBER_OF_FILES_TO_HANDLE);