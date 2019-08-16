import axios from 'axios';
import { ERROR_PROCESSING_JOB } from '../constants';

const GetJobStatus = (jobId: string | undefined) => {
    if (jobId) {
        return axios.get(`http://localhost:8000/jobs/${jobId}`)
    }
    return Promise.reject({ message: ERROR_PROCESSING_JOB });
}

export default GetJobStatus;