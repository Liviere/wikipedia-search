interface ApiResponse {
	query: {
		pages: {
			[id: string]: {
				pageid: number;
				ns: number;
				title: string;
				index: number;
				extract: string;
			};
		};
	};
}

async function search(search: string) {
	// const params = `lat=${pos.latitude}&lon=${pos.longitude}`;
	const url =
		'https://en.wikipedia.org/w/api.php?prop=extracts&action=query&' +
		'generator=prefixsearch&exintro=1&explaintext=1&redirects=1' +
		'&format=json&gpssearch=' +
		search;
	// const url = 'https://weather-proxy.freecodecamp.rocks/api/current?' + params;

	return new Promise<ApiResponse>((resolve, reject) => {
		try {
			// @ts-ignore
			const xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
					resolve(JSON.parse(xmlHttp.responseText));
				}
			};

			xmlHttp.open('GET', url, true); // true for asynchronous
			xmlHttp.send();
		} catch (e) {
			reject(e);
		}
	});
}

search('test').then((v) => v.query.pages);
