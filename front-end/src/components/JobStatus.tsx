import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import Message from './Message';

type JobStatusProps = {
    isVisible: boolean, 
    className: string, 
    message: string | undefined,
}

const constainerStyle = {
    display: 'flex',
    alignItems: 'center'
}

const JobStatus = ({ isVisible, className, message }: JobStatusProps) => (isVisible ? (<div style={constainerStyle}>
    <CircularProgress size={25}/>
    <Message className={className} message={message}/>
</div>) : null);

export default JobStatus;
