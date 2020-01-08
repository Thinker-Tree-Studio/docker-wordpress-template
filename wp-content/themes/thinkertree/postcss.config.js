const autoprefixer = require('autoprefixer');
const pixrem = require('pixrem');
const cssnano = require('cssnano');

module.exports = {
	plugins: [
		require('autoprefixer')({
			browsers: ['> 5%', 'last 2 versions'],
		}),
		require('pixrem')({
			atrules: true,
		}),
		require('cssnano'),
	],
};