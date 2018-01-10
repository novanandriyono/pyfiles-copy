# pyfiles-copy
implementing pyfiles with copy

## Getting Started

### Installing

```
npm install pyfiles-copy
```

### Use

```
var pyfilesCopy = require('pyfiles-copy');
var options = {
	'fromDir': './node_modules',
	'toDir': './tests',
	'formatFile': 'js',
	'srcFiles': false,
	'except': ['.git','tests'],
}
console.log(pyfilesCopy(options));
```

### not goal :C