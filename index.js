'use strict';

// #############################################################################

const readDirectories = require('./utils/read-directories.js');
const stamp = require('./utils/stamp.js');
const dateTime = require('./utils/date-time.js');
const sendRequest = require('./utils/send-request.js');

module.exports = {
    readDirectories: readDirectories,
    stamp: stamp,
    dateTime: dateTime,
    sendRequest: sendRequest,
    createRequest: sendRequest
};
