let timeout: NodeJS.Timeout | null = null;
let previousSearch = '';

interface ApiResponse {
	query?: {
		pages: {
			[id: string]: {
				pageid: number;
				ns: number;
				title: string;
				description?: string;
				descriptionSource: string;
				index: number;
				extract: string;
				thumbnail?: {
					source: string;
					width: number;
					height: number;
				};
			};
		};
	};
}

async function getEntries(value: string) {
	const url =
		'https://en.wikipedia.org/w/api.php?' +
		'format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=8' +
		'&prop=pageimages|extracts|description&pilimit=50&exintro=1' +
		'&explaintext=1&exsentences=2&exlimit=20' +
		'&pithumbsize=320&pilicense=any&origin=*&gsrsort=relevance&gsrsearch=' +
		value;

	return new Promise<ApiResponse>((resolve, reject) => {
		try {
			// @ts-ignore
			const xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
					const result = xmlHttp.responseText as string;
					const jsonResult = JSON.parse(result);
					console.log('result', jsonResult);
					resolve(jsonResult);
				}
			};

			xmlHttp.open('GET', url, true); // true for asynchronous
			xmlHttp.send();
		} catch (e) {
			reject(e);
		}
	});
}

function removeTimeout() {
	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
	}
}

function debounce(callback: Function, delay: number) {
	removeTimeout();
	timeout = setTimeout(() => {
		callback();
		removeTimeout();
	}, delay);
}

function onInput(value: string) {
	const searchBox = document.querySelector('.search-box');
	if (searchBox) {
		if (value) {
			debounce(() => search(value), 250);
			searchBox.classList.remove('empty');
		} else {
			removeTimeout();
			const listElement = document.getElementById('entries');
			if (listElement) listElement.innerHTML = '';
			searchBox.classList.add('empty');
		}
	}
}

function resetSearchBox() {
	const searchBox = document.querySelector(
		'.search-box input'
	) as HTMLInputElement;
	if (searchBox) searchBox.value = '';

	// element.value = '';
}

async function search(value: string) {
	console.log('search', search);
	const listElement = document.getElementById('entries');
	const textLimit = 250;
	let content = '';
	if (listElement && previousSearch !== value) {
		previousSearch = value;
		getEntries(value).then((response) => {
			if (response.query) {
				const entries = Object.values(response.query.pages)
					.map((page) => page)
					.sort((a, b) => a.index - b.index);
				entries.forEach((page) => {
					const intro =
						page.extract.length > textLimit
							? page.extract.slice(0, textLimit) + '...'
							: page.extract;
					content =
						content +
						`
					<li><a 
						href="https://en.wikipedia.org/?curid=${page.pageid}"
						target="_blank" 
						class="card"
					>
						<div class="image ${!page.thumbnail ? 'default' : ''}">
							<img 
							
								src="${
									page.thumbnail?.source ||
									'https://res.cloudinary.com/liviere/image/upload/v1651493219/article_yzsmlt.png'
								}" 
								width="${page.thumbnail?.width || 256}" 
								height="${page.thumbnail?.height || 256}" 
							/>
						</div>
						<div class="text">
							<h1>${page.title}</h1>
							<p class="description">${page.description || ''}</p>
							<p class="intro">${intro}</p>
						</div>
					</a></li>
				`;
				});
			} else content = '';
			listElement.innerHTML = content;
		});
	}
}
