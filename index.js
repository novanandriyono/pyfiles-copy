'use strict';
var fs = require('fs');
var pyfiles = require('pyfiles');
var path = require('path');

module.exports = function(options){
			if(typeof options !== 'object'){
				return console.log('not valid options');
			}

			if((typeof options.fromDir == 'undefined')
				|| (typeof options.toDir == 'undefined')
				|| (typeof options.formatFile == 'undefined')
				|| (typeof options.srcFiles == 'undefined')){
				console.log('fill all options');
				return;
			}

			var fromDir = options.fromDir;
			var toDir = options.toDir;
			var formatFile = options.formatFile;
			var srcFiles = options.srcFiles;
			var pyfilesResult = pyfiles(options);
			for(var i = 0, len1 = pyfilesResult.length; i < len1; i++){
				var path = pyfilesResult[i];
				fs.access(path,fs.constants.F_OK || fs.constants.R_OK || fs.constants.X_OK || fs.constants.W_OK,(err) => {
					if(err){
						console.log(err);
						return;
					}
				});
			}

			if(typeof options.cleanToDir == true){
				if(fs.existsSync(toDir)){
					fs.rmdirSync(toDir);
				}
			}

			prosescopy(pyfilesResult,fromDir,toDir);

			var results = {
				'fromDir': toDir,
				'formatFile': 'scss',
				'scrFiles': false,
			};

			return pyfiles(results);
}

function prosescopy(pyfilesResult,fromDir,toDir){
	for(var i = 0, len1 = pyfilesResult.length; i < len1; i++){
		var newDirMode = parseInt('0755',8);
		var newFileMode = parseInt('0644',8);
		var oldFiles = path.normalize(pyfilesResult[i]);
		var newDir = path.basename(fromDir);
		var newDirBase = toDir + path.sep + newDir + path.sep;
		var newFile = oldFiles.replace(path.normalize(fromDir),newDirBase);
		if(!fs.existsSync(newDirBase)){
			fs.mkdirSync(newDirBase,newDirMode);
		}
		var newDir1 = path.dirname(newFile);
		mkdirSyncP(newDir1);
		fs.copyFileSync(oldFiles,newFile);
	}
}

function mkdirSyncP(location) {
    //https://stackoverflow.com/a/45287510/4949964
    let normalizedPath = path.normalize(location);
    let parsedPathObj = path.parse(normalizedPath);
    let curDir = parsedPathObj.root;
    let folders = parsedPathObj.dir.split(path.sep);
    folders.push(parsedPathObj.base);
    for(let part of folders) {
        curDir = path.join(curDir, part);
        if (!fs.existsSync(curDir)) {
            fs.mkdirSync(curDir);
        }
    }
}

function newFileMode(toDir){
	var fileMode = parseInt('0644',8);
	var options = {
		'fromDir': toDir,
		'formatFile': 'scss',
		'scrFiles': false
	}
	var results = pyfiles(options);
	// console.log(results);
	for(var i = 0, len1 = results.length; i < len1; i++){
		var res = results[i];
		fs.chmodSync(res, fileMode);
	}
}