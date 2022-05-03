let timeout: NodeJS.Timeout | null = null;
let language = (localStorage.getItem('language') as Language) || 'en';
let currentSearch = '';
const savedTheme: Theme =
	(localStorage.getItem('theme') as Theme) || 'light-theme';

async function getEntries(value: string) {
	const url =
		`https://${language}.wikipedia.org/w/api.php?` +
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

function onInput(value: string, delay = 400) {
	currentSearch = value;
	const searchBox = document.querySelector('.search-box');
	if (searchBox) {
		if (value) {
			debounce(() => search(value), delay);
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
}

function toggleTheme(button: HTMLButtonElement) {
	const body = document.querySelector('body');
	if (body) {
		const previousTheme = body.className as Theme;
		const nextTheme: Theme =
			previousTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';

		body.classList.add(nextTheme);
		body.classList.remove(previousTheme);
		localStorage.setItem('theme', nextTheme);
		button.innerHTML = nextTheme === 'light-theme' ? moon : sun;
	}
}

function selectLanguage(value: Language) {
	language = value;
	localStorage.setItem('language', value);
	onInput(currentSearch, 10);
}

async function search(value: string) {
	const listElement = document.getElementById('entries');
	const textLimit = 250;
	let content = '';
	if (listElement) {
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
						href="https://${language}.wikipedia.org/?curid=${page.pageid}"
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

/* Theme Icons */
const moon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
								<path d="M24 42Q16.5 42 11.25 36.75Q6 31.5 6 24Q6 
								17.25 9.975 12.55Q13.95 7.85 20.4 6.5Q22.45 6.1 23.2 7.2Q23.95 
								8.3 23.15 10.2Q22.7 11.35 22.45 12.55Q22.2 13.75 22.2 15Q22.2 
								19.5 25.35 22.65Q28.5 25.8 33 25.8Q34.25 25.8 35.425 25.575Q36.6 
								25.35 37.7 24.95Q39.85 24.15 40.9 25.025Q41.95 25.9 41.45 28Q40.1 
								34.05 35.4 38.025Q30.7 42 24 42Z"/>
							</svg>`;

const sun = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
							<path d="M24 34Q19.85 34 16.925 31.075Q14 28.15 14 24Q14 19.85 
							16.925 16.925Q19.85 14 24 14Q28.15 14 31.075 16.925Q34 19.85 34 
							24Q34 28.15 31.075 31.075Q28.15 34 24 34ZM3.5 25.5Q2.85 25.5 
							2.425 25.075Q2 24.65 2 24Q2 23.35 2.425 22.925Q2.85 22.5 3.5 
							22.5H8.5Q9.15 22.5 9.575 22.925Q10 23.35 10 24Q10 24.65 9.575 
							25.075Q9.15 25.5 8.5 25.5ZM39.5 25.5Q38.85 25.5 38.425 25.075Q38 
							24.65 38 24Q38 23.35 38.425 22.925Q38.85 22.5 39.5 
							22.5H44.5Q45.15 22.5 45.575 22.925Q46 23.35 46 24Q46 24.65 
							45.575 25.075Q45.15 25.5 44.5 25.5ZM24 10Q23.35 10 22.925 
							9.575Q22.5 9.15 22.5 8.5V3.5Q22.5 2.85 22.925 2.425Q23.35 2 24 
							2Q24.65 2 25.075 2.425Q25.5 2.85 25.5 3.5V8.5Q25.5 9.15 25.075 
							9.575Q24.65 10 24 10ZM24 46Q23.35 46 22.925 45.575Q22.5 45.15 
							22.5 44.5V39.5Q22.5 38.85 22.925 38.425Q23.35 38 24 38Q24.65 38 
							25.075 38.425Q25.5 38.85 25.5 39.5V44.5Q25.5 45.15 25.075 
							45.575Q24.65 46 24 46ZM12 14.1 9.15 11.3Q8.7 10.85 8.725 
							10.225Q8.75 9.6 9.15 9.15Q9.6 8.7 10.225 8.7Q10.85 8.7 
							11.3 9.15L14.1 12Q14.5 12.45 14.5 13.05Q14.5 13.65 14.1 
							14.05Q13.7 14.5 13.075 14.5Q12.45 14.5 12 14.1ZM36.7 38.85 33.9 
							36Q33.5 35.55 33.5 34.925Q33.5 34.3 33.95 33.9Q34.35 33.45 34.95 
							33.45Q35.55 33.45 36 33.9L38.85 36.7Q39.3 37.15 39.275 
							37.775Q39.25 38.4 38.85 38.85Q38.4 39.3 37.775 39.3Q37.15 39.3 
							36.7 38.85ZM33.9 14.1Q33.45 13.65 33.45 13.05Q33.45 12.45 33.9 
							12L36.7 9.15Q37.15 8.7 37.775 8.725Q38.4 8.75 38.85 9.15Q39.3 9.6 
							39.3 10.225Q39.3 10.85 38.85 11.3L36 14.1Q35.6 14.5 34.975 
							14.5Q34.35 14.5 33.9 14.1ZM9.15 38.85Q8.7 38.4 8.7 37.775Q8.7 
							37.15 9.15 36.7L12 33.9Q12.45 33.45 13.05 33.45Q13.65 33.45 14.1 
							33.9Q14.55 34.35 14.55 34.95Q14.55 35.55 14.1 36L11.3 38.85Q10.85 
							39.3 10.225 39.275Q9.6 39.25 9.15 38.85Z"/>
						</svg>`;

const themeButton = document.querySelector(
	'.switch-theme'
) as HTMLButtonElement;
if (themeButton) if (savedTheme === 'dark-theme') toggleTheme(themeButton);

const selectLang = document.querySelector(
	'.select-language'
) as HTMLSelectElement;
if (selectLang) selectLang.value = language;

type Theme = 'dark-theme' | 'light-theme';
type Language =
	| 'ar'
	| 'arz'
	| 'ceb'
	| 'cs'
	| 'da'
	| 'de'
	| 'en'
	| 'es'
	| 'fr'
	| 'it'
	| 'nl'
	| 'no'
	| 'ja'
	| 'pl'
	| 'pt'
	| 'ru'
	| 'tr'
	| 'sv'
	| 'uk'
	| 'vl'
	| 'war'
	| 'zh';

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
