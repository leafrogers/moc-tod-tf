import express from 'express';
import helmet from 'helmet';
import fetch from 'node-fetch';
import replaceImages from './helpers/replace-images.js';

const app = express();

app.use(helmet());

const fetchFtHomepage = async () => {
	const response = await fetch('https://www.ft.com/?format=html');

	if (response.ok) {
		return response.text();
	}

	throw new Error(`Error fetching FT homepage: ${response.status}`);
};

/**
 * @param {string} htmlString
 */
const reversifyHtml = (htmlString) => {
	const html = replaceImages({
		htmlString
	});

	return (html || '')
		.replace('overflow-x:hidden;', 'overflow-x:hidden;transform:scaleX(-1);')
		.replace('Financial Times', 'Financial Times'.split('').reverse().join(''));
};

app.get('/', (_, res, next) => {
	fetchFtHomepage()
		.then(reversifyHtml)
		.then((html) => res.send(html))
		.catch(next);
});

export default app;
