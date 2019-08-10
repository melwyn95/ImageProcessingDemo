// Refer: https://medium.com/javascript-in-plain-english/typescript-with-node-and-express-js-why-when-and-how-eb6bc73edd5d

import express from 'express';
import bodyParser from 'body-parser';

import UploadHandler from './interactors/UploadHandler';

const app: express.Application = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.json({ message: "running" });
});

app.get('/jobs/:jobId', function (req, res) {
    const { jobId } = req.params;



    res.json({ jobId });
});

app.post('/jobs/upload', function (req, res) {
    UploadHandler(req, res);
});

app.listen(3000, function () {
    console.log('Server Started:: Listening on port 3000');
});