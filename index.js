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
				var pypath = pyfilesResult[i];
				fs.access(pypath,fs.constants.F_OK || fs.constants.R_OK || fs.constants.X_OK || fs.constants.W_OK,(err) => {
					if(err){
						console.log(err);
						return;
					}
				});
			}

			prosescopy(pyfilesResult,fromDir,toDir,options);
			options.fromDir = toDir;
			return pyfiles(options);
}

function prosescopy(pyfilesResult,fromDir,toDir,options){
	var newDirMode = parseInt('0755',8);
	var newFileMode = parseInt('0644',8);
	if((typeof options.folderMode === 'string') && options.folderMode.length === 4){
		newDirMode = parseInt(options.folderMode,8);
	}
	if((typeof options.fileMode === 'string') && options.fileMode.length === 4){
		newFileMode = parseInt(options.fileMode,8);
	}
	for(var i = 0, len1 = pyfilesResult.length; i < len1; i++){
		var oldFiles = path.normalize(pyfilesResult[i]);
		var newDir = path.basename(fromDir);
		var newDirBase = toDir + path.sep + newDir + path.sep;
		var newFile = oldFiles.replace(path.normalize(fromDir),newDirBase);
		if(!fs.existsSync(newDirBase)){
			fs.mkdirSync(newDirBase);
			fs.chmodSync(newDirBase, newDirMode);
		}
		var newDir1 = path.dirname(newFile);
		mkdirSyncP(newDir1,newDirMode);
		fs.chmodSync(newDir1, newDirMode);
		fs.copyFileSync(oldFiles,newFile);
		fs.chmodSync(newFile, newFileMode);
	}
}

function mkdirSyncP(location,newDirMode) {
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
            fs.chmodSync(curDir,newDirMode);
        }
    }
}