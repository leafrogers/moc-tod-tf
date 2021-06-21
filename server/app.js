import express from 'express';
import helmet from 'helmet';
import fetch from 'node-fetch';

const app = express();

app.use(helmet());

app.get('/', (_, res, next) => {
	fetch('https://www.ft.com/?format=html')
		.then((ftResponse) => {
			if (ftResponse.ok) {
				return ftResponse.text();
			}

			throw new Error(`Nah: ${res.status}`);
		})
		.then((html) => {
			const toSend = (html || '').replace(
				'overflow-x:hidden;',
				'overflow-x:hidden;transform:scaleX(-1);'
			);
			res.set('Content-Type', 'text/html');
			res.send(toSend);
		})
		.catch(next);
});

export default app;
