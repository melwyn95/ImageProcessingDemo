import React from 'react';

interface Params {
    jobId: string
}

interface Match {
    params: Params
}

interface ShowResultProps {
    match: Match
}

const ShowResult = ({ match: { params: { jobId } } }: ShowResultProps) => <div>jobId</div>;

export default ShowResult;