// Simple http server 
const http = require('http')

var server = http.createServer((req, res) => {
    if(req.url == '/') {
        res.write('Hello World');
        res.end();
    } else if (req.url == '/api/courses'){
        res.write(JSON.stringify([1,2,3,4]));
        res.end();
    }


    
});

server.listen(3000);


console.log("Listening to port 3000");