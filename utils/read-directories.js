'use strict';

// #############################################################################

const { join, } = require('path');
const { readdir, stat, } = require('fs');
const { promisify, } = require('util');

const readdirP = promisify(readdir);
const statP = promisify(stat);

/**
 * Asynchronously reads directory and returns the array of its files.
 * @param {String} directory path to directory.
 * @param {Array} allFiles array with file paths.
 * @returns {Array} array with file paths.
 */
async function _readDirectory (directory, allFiles) {
    const files = (await readdirP(directory)).map((filePath) => {
        return join(directory, filePath);
    });
    let allFilesPaths = allFiles || [];

    allFilesPaths.push(...files);
    await Promise.all(
        files.map(async (f) => {
            return (await statP(f)).isDirectory() && _readDirectory(f, allFilesPaths);
        })
    );

    return allFilesPaths;
}

/**
 * Asynchronously reads directories and returns the array of their files.
 * @param {Array} directories array with directories to read through.
 * @returns {Array} array with file paths.
 */
async function readDirectories (directories) {
    let allFilesPaths = [];

    (await Promise.all(
        directories.map(async (dir) => {
            let files = await _readDirectory(dir);

            return files;
        })
    )).map((value) => {
        allFilesPaths.push(...value);
    });

    return allFilesPaths;
}

module.exports = readDirectories;
