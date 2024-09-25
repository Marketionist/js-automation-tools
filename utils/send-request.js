'use strict';

// #############################################################################

const http = require('http');
const https = require('https');
const url = require('url');
const _spacesToIndent = 4;
const _emptyString = '';
const _logLevelDefault = 0;

/* eslint-disable max-len */
/**
 * Handles response from request and prints out response status, headers, body.
 * @param {Object} response response from endpoint.
 * @param {Number} logLevel must be an integer: 0 or 1 or 2.
 * @param {Function} callbackFunction function to be called after response was finished and all data from response was accumulated.
 */
function _handleResponse (response, logLevel, callbackFunction) {
    /* eslint-enable max-len */
    let data = '';

    if (logLevel === 1 || logLevel === 2) {
        console.log(`\n-> Response status: ${response.statusCode}`);

        if (response.headers && logLevel === 2) {
            console.log(`\n-> Response headers: ${JSON.stringify(response.headers, null, _spacesToIndent)}`);
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
            console.log(`\n-> Response body: ${res}`);
        }
        // Resolve after response was finished and all data from response was accumulated
        callbackFunction({ statusCode: response.statusCode, headers: response.headers, body: data });
    });
}

/* eslint-disable max-len */
/**
 * Sends request to endpoint.
 * @param {Object} configurationObject configuration object with parameters, for example: `{ method: 'POST', requestUrl: 'http://httpbin.org/post', headersString: '{ "Content-Type": "application/json", "Authorization": "Bearer aBcD1234" }', bodyString: '{ "test1": 1, "test2": 2 }', logLevel: 1 }`.
 * @param {String} configurationObject.method string with method `'GET'` or `'POST'` or `'DELETE'` or any other.
 * @param {String} configurationObject.requestUrl string with URL of endpoint to send request to (for example: `'https://www.google.com/'`).
 * @param {String=} configurationObject.headersString string that contains request headers (for example: `'{ "Content-Type": "application/json", "Authorization": "Bearer aBcD1234" }'`, optional).
 * @param {String=} configurationObject.bodyString string that contains request body (for example: `'{ "test1": 1, "test2": 2 }'`, optional).
 * @param {Number=} configurationObject.logLevel number (for example: `0` or `1` or `2`, optional, default value: `0` - no logs).
 * @returns {Promise} response from endpoint. Resolves into an object with `statusCode`, `headers`, `body`.
 */
function sendRequest ({
    method: method,
    requestUrl: requestUrl,
    headersString: headersString,
    bodyString: bodyString,
    logLevel: logLevel
}) {
    /* eslint-enable max-len */
    /* eslint-disable no-param-reassign */
    headersString = arguments[0].headersString || _emptyString;
    bodyString = arguments[0].bodyString || _emptyString;
    logLevel = arguments[0].logLevel || _logLevelDefault;
    /* eslint-enable no-param-reassign */
    if (method.length === 0) {
        console.log('\n-> Problem with request method - please specify it ' +
            'as a string (for example: \'GET\' or \'POST\' or \'DELETE\' or ' +
            'any other)');
    }
    if (requestUrl.length === 0) {
        console.log('\n-> Problem with request URL - please specify it as a ' +
            'string (for example: \'https://www.google.com/\')');
    }

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

        const parsedUrl = new url.URL(requestUrl);
        const options = {
            protocol: parsedUrl.protocol,
            auth: parsedUrl.username ? `${parsedUrl.username}:${parsedUrl.password}` : '',
            hostname: parsedUrl.hostname,
            path: parsedUrl.search ? `${parsedUrl.pathname}${parsedUrl.search}` : parsedUrl.pathname,
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
            console.log(`\n-> Problem with request: ${err.message}`);
            reject(err);
        });

        // Write data to request body
        req.write(requestBody);
        req.end();

    });
}

module.exports = sendRequest;
