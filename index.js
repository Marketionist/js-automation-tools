'use strict';

// #############################################################################

const readDirectories = require('./utils/read-directories.js');
const stamp = require('./utils/stamp.js');
const sendRequest = require('./utils/send-request.js');

module.exports = {
    readDirectories: readDirectories,
    stamp: stamp,
    sendRequest: sendRequest,
    createRequest: sendRequest
};
