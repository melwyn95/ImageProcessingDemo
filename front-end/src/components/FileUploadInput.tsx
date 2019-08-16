import React from 'react';
import Button from '@material-ui/core/Button';

type FileUploadInputProps = {
    onFileUpoad: (e: React.ChangeEvent<HTMLInputElement>) => void,
    inputClassName: string,
    buttonClassName: string,
    isVisible: boolean,
}

const FileUploadInput = ({ onFileUpoad, inputClassName, buttonClassName, isVisible }: FileUploadInputProps) => (
    isVisible ? <>
        <input
            accept="image/*"
            className={inputClassName}
            id="raised-button-file"
            type="file"
            onChange={onFileUpoad}
        />
        <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" className={buttonClassName}>
                Upload an image
            </Button>
        </label>
    </> : null
);

export default FileUploadInput;