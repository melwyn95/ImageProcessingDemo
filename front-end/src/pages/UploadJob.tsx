// https://stackoverflow.com/questions/13572129/is-it-possible-to-check-dimensions-of-image-before-uploading
import React, { useRef, useCallback, useReducer, useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MIN_IMAGE_HEIGHT, ERROR_IMAGE_DIMENSIONS, MIN_IMAGE_WIDTH, ERROR_FILE_UPLOAD, PROCESSING, SUCCESS, FAILURE, ERROR } from '../constants';
import axios, { AxiosRequestConfig } from 'axios';
import { History } from 'history';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
        margin: theme.spacing(1)
    },
    input: {
        display: 'none',
    },
    formBody: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '100px'
    },
    imageHide: {
        display: 'none'
    },
    imageShow: {
        display: 'flex',
        flexDirection: 'column'
    },
    linearProgressRoot: {
        width: '60%',
        margin: '30px'
    },
    defaultMessageClassName: {
        margin: 20,
        color: 'blue'
    },
  }),
);

const states = {
    IMAGE_UPLOAD_PROGRESS: 'IMAGE_UPLOAD_PROGRESS',
    IMAGE_UPLOAD_FAILED: 'IMAGE_UPLOAD_FAILED',
    IMAGE_UPLOAD_SUCCESS: 'IMAGE_UPLOAD_SUCCESS',
    IMAGE_DIMENSIONS_INVALID: 'IMAGE_DIMENSIONS_INVALID',
    IMAGE_CROP_PROCESSING: 'IMAGE_CROP_PROCESSING',
    IMAGE_CROP_SUCCESS: 'IMAGE_CROP_SUCCESS',
    IMAGE_CROP_FAILURE: 'IMAGE_CROP_FAILURE',

}

const initialState = {
    imageUploadStarted: false,
    imageUploadProgress: 0,
    error: undefined,
    processingStatus: undefined,
    jobId: undefined,
    message: undefined,
    shouldPoll: true,
}

type Action = {
    type: string,
    payload?: any
}

const reducer = (state:any, action: Action) => {
    const { type, payload } = action;
    switch (type) {
        case states.IMAGE_UPLOAD_PROGRESS: {
            return { ...state, 
                imageUploadProgress: payload.imageUploadProgress, 
                imageUploadStarted: true, 
                error: undefined
            };
        }
        case states.IMAGE_UPLOAD_SUCCESS: {
            return { ...state, jobId: payload.jobId };
        }
        case states.IMAGE_UPLOAD_FAILED: {
            return { ...state, imageUploadStarted: false, error: ERROR_FILE_UPLOAD };
        }
        case states.IMAGE_DIMENSIONS_INVALID: {
            return { ...state, error: ERROR_IMAGE_DIMENSIONS };
        }
        case states.IMAGE_CROP_PROCESSING: {
            return { ...state, message: payload.message, cprocessingStatus: PROCESSING };
        }
        case states.IMAGE_CROP_SUCCESS:
        case states.IMAGE_CROP_FAILURE: {
            return { ...state, message: payload.message, shouldPoll: false, processingStatus: SUCCESS };
        }
    }
}

const head = (arr: FileList) => arr[0];

const validateImageDimensions = (height: number, width: number) => height >= MIN_IMAGE_HEIGHT && width >= MIN_IMAGE_WIDTH;

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

type FileUploadProgress = {
    isVisible: boolean,
    value: number,
    rootClassName: string,
};

const FileUploadProgress = ({ isVisible, value, rootClassName }: FileUploadProgress) => (isVisible ?
    <>
        <Message isVisible={value === 100} type={SUCCESS} message="File upload successfull..."/>
        <LinearProgress classes={{ root: rootClassName }} variant="determinate" value={value}/>
    </>:
    null
);

type ProgressEvent = {
    loaded: number, 
    total: number
}

const uploadFile = (file: File, dispactch: React.Dispatch<any>) => {
    const formData = new FormData();
    formData.append('image', file);
    const config: AxiosRequestConfig = {
        onUploadProgress: function({ loaded, total}: ProgressEvent) {
            dispactch({ type: states.IMAGE_UPLOAD_PROGRESS,
                payload: { imageUploadProgress: Math.round( (loaded * 100) / total) }});
        }
    };
    return axios.put('http://localhost:8000/jobs/upload', formData, config);
}

type MessageProps = {
    type?: string,
    message: string,
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

type JobStatusProps = {
    isVisible: boolean, 
    className: string, 
    message: string,
}

const constainerStyle = {
    display: 'flex',
    alignItems: 'center'
}

const JobStatus = ({ isVisible, className, message }: JobStatusProps) => (isVisible ? (<div style={constainerStyle}>
    <CircularProgress size={25}/>
    <Message className={className} message={message}/>
</div>) : null);

const UploadJob = ({ history }: { history: History }) => {
    const { button, input, formBody, imageHide, imageShow, linearProgressRoot, defaultMessageClassName } = useStyles();
    // @ts-ignore
    const imageRef: React.MutableRefObject<HTMLImageElement> | undefined = useRef(undefined);
    const imageClassNameRef: React.MutableRefObject<string> = useRef(imageHide);
    // @ts-ignore
    const pollIntervalRef: React.MutableRefObject<Timeout> | undefined  = useRef(undefined);
    const [state, dispactch] = useReducer(reducer, initialState);

    const onFileUpoad = useCallback(({ target }: React.ChangeEvent<HTMLInputElement>) => {
        if (target) {
            const files = target.files;
            const file = files && head(files);
            const image = new Image();
       
            image.onload = () => {
                if (validateImageDimensions(image.height, image.width)) {
                    imageClassNameRef.current = imageShow;
                    file && uploadFile(file, dispactch).then((response: any) => {
                        if (response.data.type === 'failure') {
                            throw new Error('');
                        }
                        dispactch({ type: states.IMAGE_UPLOAD_SUCCESS, payload: {
                            jobId: response.data.jobId
                        }});
                    }).catch(_ => {
                        imageRef && (imageRef.current.src = '');
                        imageClassNameRef.current = imageHide;
                        dispactch({ type: states.IMAGE_UPLOAD_FAILED });
                    });
                } else {
                    imageClassNameRef.current = imageHide;
                    dispactch({ type: states.IMAGE_DIMENSIONS_INVALID });
                }
            }
            const imageUrl = window.URL.createObjectURL(file);
            image.src = imageUrl;
            imageRef && (imageRef.current.src = imageUrl);
        }
    }, [imageHide, imageShow]);
    
    useEffect(() => {
        if (state.jobId && state.shouldPoll) {
            pollIntervalRef.current = setInterval(() => {
                axios.get(`http://localhost:8000/jobs/${state.jobId}`).then((response: any) => {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = undefined;
                    switch (response.data.status) {
                        case PROCESSING: {
                            dispactch({ type: states.IMAGE_CROP_PROCESSING, payload: {
                                message: response.data.message
                            }});
                            break;
                        }
                        case SUCCESS: {
                            dispactch({ type: states.IMAGE_CROP_SUCCESS, payload: {
                                message: response.data.message,
                                processingStatus: SUCCESS,
                            }});
                            break;
                        }
                        case FAILURE: {
                            dispactch({ type: states.IMAGE_CROP_FAILURE, payload: {
                                message: undefined,
                                error: response.data.message,
                                processingStatus: FAILURE,
                            }});
                            break;
                        }
                    }
                });
            }, 500);
        }
    }, [state, imageHide, imageShow]);

    
    useEffect(() => {
        if (state.processingStatus === SUCCESS) {
            history.push(`/result/${state.jobId}`);
        }
    }, [state, history]);

    return (<form className={formBody}>
        <FileUploadInput onFileUpoad={onFileUpoad} 
            inputClassName={input} 
            buttonClassName={button}
            isVisible={!state.imageUploadStarted}/>
        <FileUploadProgress isVisible={state.imageUploadStarted}
            value={state.imageUploadProgress}
            rootClassName={linearProgressRoot}/>
        <JobStatus isVisible={!!state.message} 
            className={defaultMessageClassName} 
            message={state.message}/>
        <div className={imageClassNameRef.current}>
            Preview:
            <img ref={imageRef} height={250} width={250} alt=""/>
        </div>
        <Message isVisible={!!state.error} type={ERROR} message={state.error}/>
    </form>
)};

export default withRouter(UploadJob);

/*
Refactor UI codebase
Remove secret key and upload to git hub
Make screen cast of demo
Make zip file
Email demo, zip file and git hub link
*/