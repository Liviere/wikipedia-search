const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env['PORT'] || 3000;
const publicFiles = [
	'',
	'index.html',
	'script.js',
	'styles.css',
	'favicon.ico',
	'favicon.png',
	'favicon_md.png',
	'favicon_lg.png',
];

function notFound(response) {
	fs.readFile('src/404.html', function (_, content) {
		response.writeHead(404, { 'Content-Type': 'text/html' });
		response.end(content, 'utf-8');
	});
}

http
	.createServer(function (request, response) {
		console.log('request ', request.url);
		let filePath = '' + request.url;
		if (filePath == '/') {
			filePath = '/index.html';
		}

		const extname = String(path.extname(filePath)).toLowerCase();
		const mimeTypes = {
			'.html': 'text/html',
			'.js': 'text/javascript',
			'.css': 'text/css',
			'.png': 'image/png',
			'.ico': 'image/x-icon',
		};

		const contentType = mimeTypes[extname] || 'application/octet-stream';
		const filename = filePath.substring(1);
		if (publicFiles.includes(filename))
			fs.readFile('src' + filePath, function (error, content) {
				if (error) {
					if (error.code == 'ENOENT') notFound(response);
					else {
						response.writeHead(500);
						response.end(
							'Sorry, check with the site admin for error: ' +
								error.code +
								' ..\n'
						);
					}
				} else {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				}
			});
		else notFound(response);
	})
	.listen(port);
console.log(`Server running at http://127.0.0.1:${port}/`);
