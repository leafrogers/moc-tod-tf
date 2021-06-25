const replaceImage = ({ urlString = '' }) => {
	/**
	 * @type {URL}
	 */
	let parsedUrl;

	try {
		parsedUrl = new URL(urlString);
	} catch (err) {
		return urlString;
	}

	if (!parsedUrl.host.endsWith('ft.com')) {
		return urlString;
	}

	if (
		!parsedUrl.pathname.startsWith('/__origami/service/image/v2/images/raw/')
	) {
		return urlString;
	}

	let newUrl;

	try {
		newUrl = new URL(
			decodeURIComponent(
				parsedUrl.pathname.replace(
					'/__origami/service/image/v2/images/raw/',
					''
				)
			)
		);
	} catch (err) {
		return urlString;
	}

	return newUrl.href;
};

const hrefAttributes = /src="(.+?)"/g;

const replaceImages = ({ htmlString = '' }) => {
	const replacer = (
		/** @type {string} */
		_,
		/** @type {string} */
		urlString
	) => `src="${replaceImage({ urlString })}"`;

	return htmlString.replace(hrefAttributes, replacer);
};

export default replaceImages;
