var fs = require('fs');


this.test = function () {

    console.log('!!!!');

}

this.getFileSize = function (file) {

    return fs.readFileSync(file).length

};
