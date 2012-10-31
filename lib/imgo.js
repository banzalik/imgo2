#!/usr/bin/env node

/**
 * Module dependencies.
 */
var program = require('commander'),
    path = require('path'),
    findit = require('findit'),
    fs = require('fs'),
    async = require('async'),
    img = require('./img'),
    IMGO = {
        CPUs: require('os').cpus().length,
        filesExt:new Array()
    },
    file = {},
    fileList = [],
    absFileList = [],
    config = {
        totalSize:0,
        saveSize:0,
        timeStart:new Date(),
        folder:process.cwd()
    };

Array.prototype.contains = function (k) {
    for (p in this)
        if (this[p] === k)
            return true;
    return false;
}

IMGO.buildFilesExt = function () {
    if (program.png || program.gif || program.ico || program.jpg) {

        if (program.png) {
            IMGO.filesExt.push('.png');
        }
        ;
        if (program.gif) {
            IMGO.filesExt.push('.gif');
        }
        ;
        if (program.ico) {
            IMGO.filesExt.push('.ico');
        }
        ;
        if (program.jpg) {
            IMGO.filesExt.push('.jpg');
            IMGO.filesExt.push('.jpeg');
        }
        ;

    } else {

        IMGO.filesExt.push('.png');
        IMGO.filesExt.push('.gif');
        IMGO.filesExt.push('.ico');
        IMGO.filesExt.push('.jpg');
        IMGO.filesExt.push('.jpeg');

    }
};

IMGO.getFilesList = function (fileArr) {
    for (i = 0; i < fileArr.length; i++) {

        var filePath = fileArr[i];
        findit.sync(filePath, 'follow_symlinks', function (file, stat) {
            if (stat.isFile()) {

                var ext = path.extname(file).toLowerCase();
                if (IMGO.filesExt.contains(ext)) {

                    fileList.push(path.normalize(file));

                    if (fs.existsSync(path.join(config.folder, file))) {

                        absFileList.push(path.join(config.folder, file));

                    } else {

                        absFileList.push(path.normalize(file));

                    }

                }

            }

        });

    }

    return fileList;
};

program
    .version('2.0.0')
    .option('-p, --png', 'optimize only PNG files')
    .option('-j, --jpg', 'optimize only JPEG files')
    .option('-g, --gif', 'optimize only GIF files')
    .option('-i, --ico', 'optimize only ICO files')
    .option('-b, --brute', 'brute mode, best compression, incompatible in IE6')
    .option('-a, --abbreviated', 'abbreviated information')
    .option('-e, --emulate', 'emulation mode - files are not overwritten')
    .option('-m, --multipass', 'multipass- image is processed several times')
    .option('-d, --diff', 'displays diff info')
    .option('-q, --quiet', 'hides the whole bar, be quiet')
    .option('-s, --separate', 'PNG divided into 2 files - the first with transparency, the second without')
    .option('-bkgd, --bkgd', 'set bKGD chunk -bkgd#ff0000, only 6 digits format')
    .option('-rt, --rt', 'Remove Transparency')
    .option('-nr, --nr', 'Disable recursive search in subdirectories')
    .option('-png8a, --png8a', 'convert PNG24+Alpha to PNG8+palette transparency')
    .option('-v, --log', 'display log')
    .option('-vv, --verbose', 'display detailed log')
    .parse(process.argv);

// строим масив из типов файлов, которые надо искать
IMGO.buildFilesExt();

// строим список файлов, которые надо обработать
IMGO.getFilesList(program.args);

// строим список файлов, которые надо обработать
console.log('num cores', IMGO.CPUs);
console.log('IMGO.filesExt', IMGO.filesExt);

console.log('IMGO.absFileList', absFileList);
console.log('IMGO.fileList', fileList);


// обходим массив с файлами
async.forEachLimit(absFileList, IMGO.CPUs, saveFile, function(err){

});

function saveFile(file){
    console.log(file);
}


// console.log(IMGO.getFileSize(program.args[0]));
//console.log('config', config);
//console.log('__dirname',__dirname);
//console.log('folder', config.folder);
//console.log('fileList',);
//console.log('absFileList',absFileList);
