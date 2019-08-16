import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

import { SUCCESS } from '../constants';
import Message from  './Message';

type FileUploadProgressProps = {
    isVisible: boolean,
    value: number,
    rootClassName: string,
};

const FileUploadProgress = ({ isVisible, value, rootClassName }: FileUploadProgressProps) => 
    (isVisible ?
        <>
            <Message isVisible={value === 100} type={SUCCESS} message="File upload successfull..."/>
            <LinearProgress classes={{ root: rootClassName }} variant="determinate" value={value}/>
        </>
        : null
);

export default FileUploadProgress