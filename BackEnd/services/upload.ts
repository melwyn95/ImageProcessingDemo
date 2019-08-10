import multer from 'multer';
import storage from '../helpers/Storage';
import fileFilter from '../helpers/FileFilter';
import { IMAGE_PARAM_NAME, NUMBER_OF_FILES_TO_HANDLE } from '../config';

export const upload = multer({
    storage,
    fileFilter,
}).array(IMAGE_PARAM_NAME, NUMBER_OF_FILES_TO_HANDLE);

