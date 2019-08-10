import { extname } from 'path';
import { compose, toLower, match } from 'ramda';
import { INVALID_FILE_EXTENSION_ERROR } from '../constants';

// TODO: add file extensions here....
const validFileExtensions = ['jpeg', 'jpeg', 'png'];
const validFileTypes = new RegExp(`\\.(${validFileExtensions.join('|')})$`);

const getFileExtension = compose(toLower, extname);
const matchFileTypes = match(validFileTypes);

const FileFilter = function (_: any, file: { mimetype: string; originalname: string; }, callback: Function) {
    const { mimetype, originalname } = file;
    const extension = getFileExtension(originalname);
    const isValidMimeType = matchFileTypes(mimetype);
    const isValidExtension = matchFileTypes(extension);

    if (isValidMimeType && isValidExtension) {
        return callback(null, true);
    }
    callback(`${INVALID_FILE_EXTENSION_ERROR} - ${validFileExtensions.join(', ')}`);
};

export default FileFilter;