import { ERROR_FILE_UPLOAD, ERROR_IMAGE_DIMENSIONS, PROCESSING, SUCCESS, FAILURE } from "../constants";

export type Action = {
    type: string,
    payload?: any
}

export type UploadJobState = {
    imageUploadStarted: boolean,
    imageUploadProgress: number,
    error: string | undefined,
    processingStatus: string | undefined,
    jobId: string | undefined,
    message: string | undefined,
    shouldPoll: boolean,
}

export const states = {
    IMAGE_UPLOAD_PROGRESS: 'IMAGE_UPLOAD_PROGRESS',
    IMAGE_UPLOAD_FAILED: 'IMAGE_UPLOAD_FAILED',
    IMAGE_UPLOAD_SUCCESS: 'IMAGE_UPLOAD_SUCCESS',
    IMAGE_DIMENSIONS_INVALID: 'IMAGE_DIMENSIONS_INVALID',
    IMAGE_CROP_PROCESSING: 'IMAGE_CROP_PROCESSING',
    IMAGE_CROP_SUCCESS: 'IMAGE_CROP_SUCCESS',
    IMAGE_CROP_FAILURE: 'IMAGE_CROP_FAILURE',
};

export const initialState = {
    imageUploadStarted: false,
    imageUploadProgress: 0,
    error: undefined,
    processingStatus: undefined,
    jobId: undefined,
    message: undefined,
    shouldPoll: true,
}

export const reducer = (state: UploadJobState, action: Action): UploadJobState => {
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
            return { ...state, message: payload.message, processingStatus: PROCESSING };
        }
        case states.IMAGE_CROP_SUCCESS: {
            return { ...state, message: payload.message, shouldPoll: false, processingStatus: SUCCESS };
        }
        case states.IMAGE_CROP_FAILURE: {
            return { ...state, error: payload.message, shouldPoll: false, processingStatus: FAILURE };
        }
        default: return state;
    }
}