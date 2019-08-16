import React from 'react';
import { ERROR, SUCCESS } from '../constants';

type MessageProps = {
    type?: string,
    message: string | undefined,
    className?: string,
    isVisible?: boolean,
};

const Message = ({ type, message, className, isVisible }: MessageProps) => {
    if (isVisible || message) {
        let style = undefined;
        switch (type) {
            case ERROR: {
                style = { color: 'red', fontSize: 12 };
                break;
            }
            case SUCCESS: {
                style = { color: 'green', fontSize: 14 };
                break;
            }
        }
        return (<span style={style} className={className}>{message}</span>);
    }
    return null;
}

export default Message;