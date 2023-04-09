import { jest } from '@jest/globals';
import nock from 'nock';
import supertest from 'supertest';

import app from './app.js';
import config from './config.js';

const request = supertest(app);

jest.spyOn(global.console, 'debug').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe(`The ${config.APP_FRIENDLY_NAME} app`, () => {
	beforeAll(() => {
		nock.disableNetConnect();
		nock.enableNetConnect('127.0.0.1');
	});

	afterEach(() => {
		nock.cleanAll();
	});

	afterAll(() => nock.enableNetConnect());

	describe('GET /', () => {
		it('serves a 200 status', async () => {
			const { status, text } = await request.get('/');

			expect(status).toBe(200);
			expect(text).toContain('Hello');
		});
	});

	describe('Caching', () => {
		it('sets a no-cache header for the homepage', async () => {
			const { headers, status } = await request.get('/');
			expect(status).toBe(200);
			expect(headers['cache-control']).toEqual(
				'no-store, no-cache, must-revalidate, proxy-revalidate'
			);
		});
	});
});
