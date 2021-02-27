'use strict';

// #############################################################################

const http = require('http');
const https = require('https');
const parseUrl = require('url').parse;

/**
 * Handles response from request and prints out response status, headers, body
 * @param {Object} response
 * @param {Number} logLevel must be an integer: 0 or 1 or 2
 * @param {Function} callbackFunction
 */
function _handleResponse (response, logLevel, callbackFunction) {
    const spacesToIndent = 4;

    let data = '';

    if (logLevel === 1 || logLevel === 2) {
        console.log(`\nResponse status: ${response.statusCode}`);

        if (response.headers && logLevel === 2) {
            console.log(`\nResponse headers: ${JSON.stringify(response.headers, null, spacesToIndent)}`);
        }
    }

    response.setEncoding('utf8');

    response.on('data', (chunk) => {
        // Accumulate all data from response
        data += chunk;
    });
    response.on('end', () => {
        let res = data.length > 0 ? data : 'empty';

        if (logLevel === 1 || logLevel === 2) {
            console.log(`\nResponse body: ${res}`);
        }
        // Resolve after response was finished and all data from response was accumulated
        callbackFunction(data);
    });
}

/**
 * Creates request
 * @param {String} method
 * @param {String} requestUrl
 * @param {String} headersString
 * @param {String} bodyString
 * @param {Number} logLevel must be an integer: 0 or 1 or 2
 * @returns {Promise} response
 */
function createRequest (
    method,
    requestUrl,
    headersString = '',
    bodyString = '',
    logLevel = 0
) {
    return new Promise((resolve, reject) => {
        // Check incoming body string to have proper JSON inside of it
        const requestBody = bodyString.length > 0 ? JSON.stringify(JSON.parse(bodyString)) : '';
        const contentType = method.toUpperCase() === 'GET' ? 'text/html' : 'application/json';

        // Check incoming headers string to have proper JSON inside of it
        const requestHeaders = headersString.length > 0 ?
            JSON.parse(headersString) :
            {
                'Content-Type': contentType,
                'Connection': 'close',
                'Content-Length': Buffer.byteLength(requestBody)
            };

        const parsedUrl = parseUrl(requestUrl);
        const options = {
            protocol: parsedUrl.protocol,
            auth: parsedUrl.auth,
            hostname: parsedUrl.hostname,
            path: parsedUrl.path,
            hash: parsedUrl.hash,
            port: parsedUrl.port,
            method: method,
            headers: requestHeaders
        };

        let req;

        if (requestUrl.includes('https')) {
            req = https.request(options, (res) => {
                _handleResponse(res, logLevel, resolve);
            });
        } else {
            req = http.request(options, (res) => {
                _handleResponse(res, logLevel, resolve);
            });
        }

        req.on('error', (err) => {
            console.log(`Problem with request: ${err.message}`);
            reject(err);
        });

        // Write data to request body
        req.write(requestBody);
        req.end();

    });
}

module.exports = createRequest;
