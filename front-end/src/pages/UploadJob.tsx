import React, { useRef, useCallback, useReducer, useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import { History } from 'history';

import UploadFile from '../services/UploadFile';
import GetJobStatus from '../services/GetJobStatus';

import Message from '../components/Message';
import JobStatus from '../components/JobStatus';
import FileUploadInput from '../components/FileUploadInput';
import FileUploadProgress from '../components/FileUploadProgress';

import useStyles from '../styles/pages/UploadJob/useStyles';

import { head, validateImageDimensions } from '../utils';

import { initialState, reducer, states, Action } from '../reducers/UploadJobReducer';

import { PROCESSING, SUCCESS, FAILURE, ERROR } from '../constants';


const fileUploadHandler = (imageClassNameRef: React.MutableRefObject<string>, 
    imageRef: React.MutableRefObject<HTMLImageElement> | undefined,
    imageShow: string, 
    imageHide: string, 
    dispactch: React.Dispatch<Action>) => 
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const files = target.files;
        const file = files && head(files);
        const image = new Image();
        
        image.onload = () => {
            if (validateImageDimensions(image.height, image.width)) {
                imageClassNameRef.current = imageShow;
                file && UploadFile(file, dispactch).then((response: any) => {
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
        const imageUrl = window.URL && window.URL.createObjectURL(file);
        image.src = imageUrl;
        imageRef && (imageRef.current.src = imageUrl);
}

const UploadJob = ({ history }: { history: History }) => {
    const { button, input, formBody, imageHide, imageShow, linearProgressRoot, defaultMessageClassName } = useStyles();
    // @ts-ignore
    const imageRef: React.MutableRefObject<HTMLImageElement> | undefined = useRef(undefined);
    const imageClassNameRef: React.MutableRefObject<string> = useRef(imageHide);
    // @ts-ignore
    const pollIntervalRef: React.MutableRefObject<Timeout> | undefined  = useRef(undefined);
    const [state, dispactch] = useReducer(reducer, initialState);

    
    const onFileUpoad = useCallback(fileUploadHandler(imageClassNameRef, imageRef, imageShow, imageHide, dispactch),
        [imageHide, imageShow]);
    
    useEffect(() => {
        if (state.jobId && state.shouldPoll) {
            pollIntervalRef.current = setInterval(() => {
                GetJobStatus(state.jobId).then((response: any) => {
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
                }).catch(error => dispactch({ type: states.IMAGE_CROP_FAILURE, payload: error }));
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
Remove secret key and upload to git hub

Make zip file
Write description of the architecture
Email demo, zip file and git hub link
*/