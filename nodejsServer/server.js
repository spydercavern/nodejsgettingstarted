var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    mimeTypes = {
        html: 'text/html',
        jpeg: 'image/jpeg',
        jpg: 'image/jpg',
        png: 'image/png',
        js: 'text/javascript',
        css: 'text/css'
    };

//Crate Server
http.createServer(function(req, res) {
    var uri = url.parse(req.url).pathname,
        fileName = path.join(process.cwd(), unescape(uri)),
        stats,
        mimeType,
        fileStream;
    console.log('loading...' + uri);

    // check if the requested file is present, if not throw 404 error
    
    try {
        stats = fs.lstatSync(fileName);
    } catch (err){
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;
    }
    if(stats.isFile()){
        mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]];
        res.writeHead(200, {'Content-Type' : mimeType});
        fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if(stats.isDirectory()){
        res.writeHead(302, {
            'Location' : fileName + '/index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.write('500 Internal Error\n');
    }
}).listen(3000, '127.0.0.1');
console.log('Server running in localhost:3000');