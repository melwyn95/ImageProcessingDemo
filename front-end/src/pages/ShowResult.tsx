import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SUCCESS, PROCESSING } from '../constants';

import styles from '../styles/ShowResults.module.css';

interface Params {
    jobId: string
}

interface Match {
    params: Params
}

interface ShowResultProps {
    match: Match
}

type ImageData = {
    status: string,
    gallery?: string,
    horizontal?: string,
    horizontalSmall?: string,
    vertical?: string,
}

const initialImageData = {
    status: PROCESSING
}

const ShowResult = ({ match: { params: { jobId } } }: ShowResultProps) => {
    const [imageData, setImageData]: [ImageData, React.Dispatch<React.SetStateAction<ImageData>>] 
        = useState(initialImageData);
    
    useEffect(() => {
        axios.get(`http://localhost:8000/jobs/${jobId}`)
            .then((response: any) => setImageData(response.data))
            .catch(_ => setImageData(initialImageData));
    }, [jobId]);

    
    return (imageData.status === SUCCESS ? <div className={styles.containerImages}>
        <div className={styles.sectionContainer}>
            Gallery:
            <img src={imageData.gallery} className={styles.sizeGallery} alt=""/>
            Horizontal:
            <img src={imageData.horizontal} className={styles.sizeHorizontal} alt=""/>
        </div>
        <div className={styles.sectionContainer}>
            Horizontal Small:
            <img src={imageData.horizontalSmall} className={styles.sizeHorizontalSmall} alt=""/>
            Vertical:
            <img src={imageData.vertical} className={styles.sizeVertical} alt=""/>
        </div>
    </div> : <CircularProgress />);
};

export default ShowResult;