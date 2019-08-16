import axios, { AxiosRequestConfig } from 'axios';
import { states } from '../reducers/UploadJobReducer';

type ProgressEvent = {
    loaded: number, 
    total: number
}

const UploadFile = (file: File, dispactch: React.Dispatch<any>) => {
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

export default UploadFile;