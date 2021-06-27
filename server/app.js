import express from 'express';
import helmet from 'helmet';
import fetch from 'node-fetch';

const app = express();

app.use(
	helmet({
		contentSecurityPolicy: {
			useDefaults: true,
			directives: {
				'base-uri': ["'self'"],
				'connect-src': ["'self'"],
				'default-src': ["'self'"],
				'font-src': ["'self'", 'https://www.ft.com'],
				'frame-src': ["'self'"],
				'img-src': [
					"'self'",
					'data: http://prod-upp-image-read.ft.com',
					'https://d1e00ek4ebabms.cloudfront.net',
					'https://www.ft.com '
				],
				'manifest-src': ["'self'", 'https://www.ft.com'],
				'media-src': ["'self'"],
				'object-src': ["'none'"],
				'script-src': ["'self'", 'https://polyfill.io', 'https://www.ft.com'],
				'style-src': ["'unsafe-inline'", 'https://www.ft.com'],
				'worker-src': ["'none'"]
			}
		}
	})
);

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
	return (htmlString || '')
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
