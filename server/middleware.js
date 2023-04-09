import helmet from 'helmet';
import config from './config.js';
import { HttpError } from './helpers.js';

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
 * @param {number} maxAge Maximum cache time in seconds
 * @param {object} options
 * @param {boolean} [options.isPrivate] Set this to true if the response is personalised to a user or account
 */
export const cacheFor = (maxAge, { isPrivate = false } = {}) => {
	/**
	 * @param {ExpressRequest} _req
	 * @param {ExpressResponse} res
	 * @param {NextFunction} next
	 */
	return (_req, res, next) => {
		res.setHeader(
			'Cache-Control',
			`${isPrivate ? 'private' : 'public'}, max-age=${maxAge}`
		);

		next();
	};
};

/**
 * @param {ExpressRequest} _req
 * @param {ExpressResponse} _res
 * @param {NextFunction} next
 */
export const disallowInProduction = (_req, _res, next) => {
	if (config.IS_PRODUCTION) {
		return next(
			new HttpError(405, 'This method or route is not allowed in production')
		);
	}
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
