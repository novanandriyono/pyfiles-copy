var pyfilesCopy = require('./index.js');
var options = {
	'fromDir': './node_modules',
	'toDir': './tests',
	'formatFile': 'js',
	'srcFiles': false,
	'except': ['.git','tests'],
}
console.log(pyfilesCopy(options));