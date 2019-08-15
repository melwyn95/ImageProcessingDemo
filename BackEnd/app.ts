// Refer: https://medium.com/javascript-in-plain-english/typescript-with-node-and-express-js-why-when-and-how-eb6bc73edd5d

import express from 'express';
import bodyParser from 'body-parser';

import UploadHandler from './interactors/UploadHandler';
import JobStatusQueryHandler from './interactors/JobStatusQueryHandler';

const app: express.Application = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT");
    next();
});

app.get('/', function (req, res) {
    res.json({ message: "running" });
});

app.get('/jobs/:jobId', function (req, res) {
    JobStatusQueryHandler(req, res);
});

app.put('/jobs/upload', function (req, res) {
    UploadHandler(req, res);
});

app.listen(8000, function () {
    console.log('Server Started:: Listening on port 8000');
});

// Make Script to start both backend and consumer