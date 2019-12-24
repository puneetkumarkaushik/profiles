const http = require('http');
const fs = require('fs');

let users = {
		data: [
		{
			id: 1,
			name: 'Puneet Kaushik',
			email: 'puneet.kumar@kaushik'
		},
		{
			id: 2,
			name: 'John Doe',
			email: 'john@doe'
		},
		{
			id: 3,
			name: 'Sally Marc',
			email: 'sally@marc'
		}
	]};

let availableid = 4;

const app = http.createServer((req, res) => {
	let url = req.url;
	let method = req.method;
	let reqPath = __dirname + url;

	if(url === '/'){
		let html = fs.readFileSync('./index.html', 'utf8');
    	res.write(html);
    	res.end();
	}
	else if(url === '/users'){
		let html = fs.readFileSync('./profiles.html', 'utf8');
    	res.write(html);
    	res.end();
	}
	else if(url === '/profiles') {
		res.end(JSON.stringify(users));
	}
	else if(url === '/add'){
		let html = fs.readFileSync('./add.html', 'utf8');
    	res.write(html);
    	res.end();
	}
	else if(url === '/added' && method === 'POST'){
		const body = [];

		req.on('data', (chunk) => {
			body.push(chunk);
		});

		req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			console.log(parsedBody);

			let data = parsedBody.split('&');

			let name = data[0].split('=')[1].replace('+', ' ');
			let email = data[1].split('=')[1].replace('%40', '@');

			let newProfile = {};

			
			if(name && email) {
				newProfile.id = availableid++;
				newProfile.name = name;
				newProfile.email = email;
				users.data.push(newProfile);

				let html = fs.readFileSync('./added.html', 'utf8');
		    	res.write(html);
				res.end();
			}else {
				let html = fs.readFileSync('./add.html', 'utf8');
		    	res.write(html);
				res.end();
			}
		});
	}

	else if(url.startsWith('/remove?')){
		let id = url.split('?')[1];

		let arr = users.data;

		let newArr = arr.map((profile) => {
			if(profile.id !== Number(id)) {
				return profile;
			}
		});

		users.data = newArr.filter(function(e){ return e === 0 || e });

		res.statusCode = 302;
		res.setHeader('Location', '/users');
		res.end();
	}

	else if(reqPath.includes('.css')){
		let file = fs.readFileSync(reqPath, 'utf8');
    	res.end(file);
	}

	else if(reqPath.includes('.js')){
		let file = fs.readFileSync(reqPath, 'utf8');
    	res.end(file);
	}

	else {
		res.write('<div style="text-align: center;">');
		res.write('<h2>404 - Not Found</h2></div>');
		res.end();
	}
});	

app.listen(3000);