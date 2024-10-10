# js-automation-tools

A collection of scripts for JavaScript test automation

[![Actions Status](https://github.com/Marketionist/js-automation-tools/workflows/Build%20and%20Test/badge.svg)](https://github.com/Marketionist/js-automation-tools/actions)
[![npm version](https://img.shields.io/npm/v/js-automation-tools.svg)](https://www.npmjs.com/package/js-automation-tools)
[![NPM License](https://img.shields.io/npm/l/js-automation-tools.svg)](https://github.com/Marketionist/js-automation-tools/blob/master/LICENSE)

## Supported versions
[Node.js](https://nodejs.org/en/download/package-manager): 8.x-22.x.
> Note: if you are choosing a version of Node.js to run with - check
> [release schedule](https://nodejs.org/en/about/previous-releases).

## Table of contents
* [Installation](#installation)
* [Generate timestamp or random digits](#generate-timestamp-or-random-digits)
* [Generate current date and time](#generate-current-date-and-time)
* [Send GET, POST or any other requests](#send-get-post-or-any-other-requests)
* [Retry executing function](#retry-executing-function)
* [Read directories](#read-directories)
* [Contributing](#contributing)
* [Thanks](#thanks)

## Installation
To install js-automation-tools and save it to your `package.json` just run:
```
npm install js-automation-tools --save-dev
```

## Generate timestamp or random digits
There ususally is a need to generate random names. Timestamp can be used to
generate a unique string of 13+ digits:
```
const { stamp } = require('js-automation-tools');

const randomDigits = stamp.getTimestamp(); // '1588556993141'
const newTestName = `My new test ${randomDigits}`; // 'My new test 1588556993141'
```
It will also write generated digits to a global environment variable
`process.env.TIMESTAMP` that can be easily accessed in any place of your tests:
```
console.log(process.env.TIMESTAMP); // '1588556993141'
```
To get new timestamp:
```
const newRandomDigits = stamp.resetTimestamp(); // '1588558255810'

console.log(process.env.TIMESTAMP); // '1588558255810'
```

## Generate current date and time
Sometimes you need to generate current date and time. It can easily be done with `generateDateTime` function:
```
const { dateTime } = require('js-automation-tools');

const currentDateTime = dateTime.generateDateTime(); // '2024-09-23T19:26:35'
```
Also you can use `generateDateTimePlus` function that generates current (if no initial date is provided) date and time plus number of days, hours, minutes, seconds if they are provided. This function accepts configuration object with 5 arguments:
1. `days` - number of days that will be added to current (if no initial date is provided) date and time (optional, default value: `0`).
2. `hours` - number of hours that will be added to current (if no initial date is provided) date and time (optional, default value: `0`).
3. `minutes` - number of minutes that will be added to current (if no initial date is provided) date and time (optional, default value: `0`).
4. `seconds` - number of seconds that will be added to current (if no initial date is provided) date and time (optional, default value: `0`).
5. `initialDate` - string with initial date and time that you want to add a number of days, hours, minutes, seconds to (for example: '2024-03-14T00:14:25', optional, default value: current date and time).
```
const { dateTime } = require('js-automation-tools');

const currentDateTimePlusDay = dateTime.generateDateTimePlus({ days: 1 }); // '2024-09-24T19:26:35'
const currentDateTimePlusHour = dateTime.generateDateTimePlus({ hours: 1 }); // '2024-09-23T20:26:35'
const currentDateTimePlusMinute = dateTime.generateDateTimePlus({ minutes: 1 }); // '2024-09-23T19:27:35'
const currentDateTimePlusSecond = dateTime.generateDateTimePlus({ seconds: 1 }); // '2024-09-23T19:26:36'

const currentDateTimeMinusHour = dateTime.generateDateTimePlus({ hours: -1 }); // '2024-09-23T18:26:35'

const pastDateTimePlusDay = dateTime.generateDateTimePlus({ days: 1, initialDate: '2024-03-14T00:14:25' }); // '2024-03-15T00:14:25'
const pastDateTimePlusHour = dateTime.generateDateTimePlus({ hours: 1, initialDate: '2024-03-14T00:14:25' }); // '2024-03-14T01:14:25'
const pastDateTimePlusMinute = dateTime.generateDateTimePlus({ minutes: 1, initialDate: '2024-03-14T00:14:25' }); // '2024-03-14T00:15:25'
const pastDateTimePlusSecond = dateTime.generateDateTimePlus({ seconds: 1, initialDate: '2024-03-14T00:14:25' }); // '2024-03-14T00:14:26'

const pastDateTimePlusDayHourMinuteSecond = dateTime.generateDateTimePlus({
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
    initialDate: '2024-03-14T00:14:25'
}); // '2024-03-15T01:15:26'
```
It will also write generated date and time to a global environment variable
`process.env.DATETIME` and `process.env.NEW_DATETIME` that can be easily
accessed in any place of your tests.

## Send GET, POST or any other requests
Send request to any URL and get response - `sendRequest` function accepts 
configuration object with 5 arguments:
1. `method` - string (for example: `'GET'` or `'POST'` or `'DELETE'` or any other).
2. `requestUrl` - string with URL of endpoint to send request to (for example: `'https://www.google.com/'`).
3. `headersString` - string that contains request headers (for example: `'{ "Content-Type": "application/json", "Authorization": "Bearer aBcD1234" }'`, optional).
4. `bodyString` - string that contains request body (for example: `'{ "test1": 1, "test2": 2 }'`, optional).
5. `logLevel` - number (for example: `0` or `1` or `2`, optional, default value: `0` - no logs).

Also you can just call `sendRequest` function without `headersString`,
`bodyString`, `logLevel` arguments if they are not needed - for example in GET
request:
```
const { sendRequest } = require('js-automation-tools');

const responseGet = await sendRequest({
    method: 'GET',
    requestUrl: 'https://www.google.com/'
});

const responsePost = await sendRequest({
    method: 'POST',
    requestUrl: 'http://httpbin.org/post',
    headersString: '{ "Content-Type": "application/json", "Authorization": "Bearer aBcD1234" }',
    bodyString: '{ "test1": 1, "test2": 2 }',
    logLevel: 1
});
```

By default logs are disabled (`logLevel` set to `0`). You can set logging output
to one of 3 levels:
- `0` - logs disabled (by default)
- `1` - partial logs are enabled - prints out:
  * Response status code
  * Response body
- `2` - full logs are enabled - prints out:
  * Response status code
  * Response headers
  * Response body

## Retry executing function
Retry executing a provided function once per a provided amount of milliseconds
until this function will return a value that upon passing a `functionCheck`
check will be `true` or the amount of provided attempts will be exceeded -
`retryIfFalse` function accepts configuration object with 5 arguments:
1. `functionToExecute` - function to execute. For example an API request:
    ```
    async function () {
        const response = await sendRequest({ method: 'GET', requestUrl: 'https://www.google.com/' });
        return response.body;
    }
    ```
2. `functionCheck` - function to execute to check the result of
    `functionToExecute` (if successful - should return `true`, for example:
    `(responseBody) => responseBody.length > 0`, optional).
3. `attempts` - number of attempts to retry (optional, default value: `10`).
4. `waitTime` - time to wait between retries in milliseconds (optional, default value: `1000`).
5. `logLevel` - number (for example: `0` or `1` or `2`, optional, default value: `0` - no logs).

> Note: you have to specify the `retryIfFalse` arguments inside the
> configuration object as `key: value` pairs:
```
const { retryIfFalse, sendRequest } = require('js-automation-tools');

const myFunction = async function () {
    const response = await sendRequest({ method: 'GET', requestUrl: 'https://www.google.com/' });
    return response;
};

const result = await retryIfFalse({
    functionToExecute: myFunction,
    attempts: 10,
    waitTime: 3000,
    logLevel: 2
}); // myFunction will be executed every 3 seconds up to 10 times until its result will be truthy
console.log('result:', result); // result: { statusCode: 200, headers: { 'content-type': 'application/json' }, body: 'Some data' }
```

**OR** if you want to provide a custom `functionCheck` function to check that
the result of `functionToExecute` (or any of its properties) is truthy:

```
const { retryIfFalse, sendRequest } = require('js-automation-tools');

const myFunction = async function () {
    const response = await sendRequest({ method: 'GET', requestUrl: 'https://www.google.com/' });
    return response;
};
const checkFunction = function (result) {
    return result.statusCode === 200;
};

const result = await retryIfFalse({
    functionToExecute: myFunction,
    functionCheck: checkFunction,
    attempts: 20,
    waitTime: 5000,
    logLevel: 2
}); // myFunction will be executed every 5 seconds up to 20 times until its result statusCode will be 200
console.log('result:', result); // result: { statusCode: 200, headers: { 'content-type': 'application/json' }, body: 'Some data' }
```

By default logs are disabled (`logLevel` set to `0`). You can set logging output
to one of 3 levels:
- `0` - logs disabled (by default)
- `1` - partial logs are enabled - prints out:
  * Each attempt number
- `2` - full logs are enabled - prints out:
  * Each attempt number
  * Response from `functionToExecute` after each attempt

## Read directories
Read the array of directories and get the array of files from this directories:
```
const { readDirectories } = require('js-automation-tools');

const pathToDirectory1 = path.join(__dirname, 'directory1');
const pathToDirectory2 = path.join(__dirname, '..', '..', 'directory2');

const allFiles = await readDirectories([pathToDirectory1, pathToDirectory2]);
```

## Contributing
You are welcome to contribute to this repository - please see
[CONTRIBUTING.md](https://github.com/Marketionist/js-automation-tools/blob/master/CONTRIBUTING.md)
to help you get started. It is not mandatory, so you can just create a pull
request and we will help you refine it along the way.

## Thanks
If this package was helpful to you, please give it a **★ Star** on
[GitHub](https://github.com/Marketionist/js-automation-tools).
