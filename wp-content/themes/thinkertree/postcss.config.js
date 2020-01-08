const autoprefixer = require('autoprefixer');
const pixrem = require('pixrem');
const cssnano = require('cssnano');

module.exports = {
	plugins: [
		require('autoprefixer'),
		require('pixrem')({
			atrules: true,
		}),
		require('cssnano'),
	],
};