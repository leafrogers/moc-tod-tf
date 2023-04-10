import express from 'express';
import fetch from 'node-fetch';
import { doNotCache, security } from './middleware.js';

const app = express();

/**
 * @param {string} ftUrlPath
 */
const fetchFtPage = async (ftUrlPath) => {
	const response = await fetch(`https://www.ft.com${ftUrlPath}?format=html`);

	if (response.ok) {
		return response.text();
	}

	throw new Error(`Error fetching FT homepage: ${response.status}`);
};

/**
 * @param {string} htmlString
 */
const reversifyHtml = (htmlString) => {
	return (htmlString || '')
		.replace('overflow-x:hidden;', 'overflow-x:hidden;transform:scaleX(-1);')
		.replace('Financial Times', 'Financial Times'.split('').reverse().join(''));
};

app.use(security);
app.use(doNotCache);

app.get('*', (req, res, next) => {
	fetchFtPage(req.url)
		.then(reversifyHtml)
		.then((html) => res.send(html))
		.catch(next);
});

export default app;
