var path = require("path");
var fs = require("fs");
var utils = {};
var DecompressZip = require('decompress-zip');
var copydir = require('copy-dir');

utils.getterFromPost = function(req) {
    function get(atributos, mensajeDeFallo) {
        var arregloAtributos = atributos.split(".");
        var valor = req.body;
        for (var i = 0; i < arregloAtributos.length; i++) {
            valor = valor[arregloAtributos[i]];
        }

        if (mensajeDeFallo) {
            if (valor === null || valor === "" || typeof valor === "undefined") {
                var err = new Error(mensajeDeFallo);
                err.status = 400;
                throw err;
            }
        }
        return valor;
    }
    return {
        get: get
    };

};

utils.getter = function(data) {
    function get(attribute, messageIfNull) {
        var resp = data[attribute];
        if ((!resp || resp === "" || typeof resp === "undefined") && messageIfNull) {
            throw new Error(messageIfNull);
        }
        return resp;
    }
    return get;
};

utils.getterFromLine = function(line) {
    var i = 0;

    function next(messageIfNull) {
        while (i < line.length && line[i] === ' ') {
            i++;
        }
        var begin = i;
        while (i < line.length && line[i] !== ' ') {
            i++;
        }
        var resp = line.substring(begin, i);
        if ((!resp || resp === "") && messageIfNull) {
            throw new Error(messageIfNull);
        }
        return resp;
    }
    return {
        next: next
    };
};

utils.error = function(message, status) {
    var error = new Error(message);
    error.status = status;
    return error;
};

utils.deleteFolderRecursive = deleteFolderRecursive;

function deleteFolderRecursive(pathP) {
    if (fs.existsSync(pathP)) {
        if (fs.statSync(pathP).isDirectory()) {
            fs.readdirSync(pathP).forEach(function(file) {
                var curPath = path.join(pathP, file);
                deleteFolderRecursive(curPath);
            });
            fs.rmdirSync(pathP);
        } else {
            fs.unlinkSync(pathP);
        }
    }
}

/**
 * Crea un direcotrio y archivo con el contenido especificado.
 * @method createDirAndFile
 * @param {String} dirName Directorio Actual de Trabajo
 * @param {String} fileName Nombre del archivo a crear
 * @param {String} fileContent Contenido del archivo que se va a crear
 * @return {Promise} promesa
 */
utils.createDirAndFile = function(dirName, fileName, fileContent) {
    return new Promise(function(resolve, reject) {
        fs.mkdir(dirName, function(err) {
            if (err) return reject(err);
            var filePath = path.join(dirName, fileName);
            fs.writeFile(filePath, fileContent, function(err) {
                if (err) return reject(err);
                resolve(filePath);
            });
        });
    });
};

/**
 * Crea un archivo con el contenido especificado y en el direcotrio especificado.
 * @method createDirAndFile
 * @param {String} dirName Directorio Actual de Trabajo
 * @param {String} fileName Nombre del archivo a crear
 * @param {String} fileContent Contenido del archivo que se va a crear
 * @return {Promise} promesa
 */
utils.createFile = function(dirName, fileName, fileContent) {
    return new Promise(function(resolve, reject) {

        var filePath = path.join(dirName, fileName);
        fs.writeFile(filePath, fileContent, function(err) {
            if (err) return reject(err);
            resolve(filePath);
        });
    });
};

/**
 * Crea un direcotrio y archivo con el contenido especificado.
 * @method createDirAndFile
 * @param {String} dirName Directorio Actual de Trabajo
 * @param {String} fileName Nombre del archivo a crear
 * @param {String} fileContent Contenido del archivo que se va a crear
 * @return {Promise} promesa
 */
utils.createDir = function(dirName) {
    return new Promise(function(resolve, reject) {
        fs.mkdir(dirName, function(err) {
            if (err) return reject(err);
            resolve(dirName);
        });
    });
};
/**
 * Crea el direcotrio si no existe de manera sincrónica.
 * @method createDirAndFile
 * @param {String} dirName direcotrio a crear si no existe
 */
utils.ensureExists = function(dirName) {
    /* Se crea el directorio temporal si no existe */
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }
};

/**
 * Descomprime un archivo ZIP en la ruta especificada.
 * @method unZip
 * @param {String} zipPath ruta del archivo zip a descomprimir
 * @param {String} toPath directorio en el que se va a extaraer el zip
 * @param {Function} filter ({filename, path})
 */
utils.unZip = function(zipPath, toPath, filter) {
    return new Promise(function(resolve, reject) {
        var files = [];

        var unzipper = new DecompressZip(zipPath);

        unzipper.on('error', function(err) {
            reject(err);
        });

        unzipper.on('extract', function(log) {
            resolve(files);
        });

        unzipper.extract({
            path: toPath,
            filter: function(file) {
		        var incluir = filter(file);
		        if (incluir) {
		            console.log("Incluir:", file);
		            files.push(file);
		        }
		        return incluir;
		    }
        });
    });
};

utils.copydir = function(fromPath, toPath){
    return new Promise(function(resolve, reject){
        copydir(fromPath, toPath, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

};



module.exports = utils;
