var redis = require('redis');
// TODO: save password in .env file
var client = redis.createClient({ password: "foobared" }); 

client.on('connect', function() {
    console.log('connected');
});

/*

{
    job_id: uuid,
    status: JOB_RECEIVED | JOB_PROCESSING | JOB_DONE
    original_image: url_to_original_image
    c1
    c2
    c3
    c4
}

*/