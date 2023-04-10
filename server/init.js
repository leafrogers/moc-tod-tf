import config from './config.js';
import app from './app.js';

const { PORT } = config;

app.listen(PORT, () => {
	console.info({
		event: 'APP_STARTED',
		message: `Listening on port ${PORT}`,
		url: `http://localhost:${PORT}`
	});
});
