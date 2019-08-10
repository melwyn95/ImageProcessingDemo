import multer from 'multer';
import { FILE_UPLOAD_PATH } from '../config';

const Storage = (jobId: string) => multer.diskStorage({
    destination: function(_, __, callback) {
        callback(null, FILE_UPLOAD_PATH);
    },
    filename: function(_, { fieldname, originalname }, callback) {
        callback(null, `${fieldname}_${jobId}_${originalname}`);
    }
});

export default Storage;