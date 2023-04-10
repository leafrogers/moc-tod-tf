import helmet from 'helmet';

/**
 * @param {ExpressRequest} _req
 * @param {ExpressResponse} res
 * @param {NextFunction} next
 */
export const doNotCache = (_req, res, next) => {
	res.setHeader(
		'Cache-Control',
		'no-store, no-cache, must-revalidate, proxy-revalidate'
	);
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Expires', '0');

	next();
};

/**
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {NextFunction} next
 */
export const security = (req, res, next) => {
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
	})(req, res, next);
};
