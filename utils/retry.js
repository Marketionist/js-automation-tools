'use strict';

// #############################################################################

const _attemptsDefault = 10;
const _waitTimeDefault = 1000;
const _logLevelDefault = 0;
const _spacesToIndent = 4;
const _returnResult = (result) => result;
const NOTIFICATION_ATTEMPT_NUMBER = '\n-> Running %s - attempt: %d';
const NOTIFICATION_FUNCTION_TO_EXECUTE_RESPONSE = '\n-> Response from';
const ERROR_SPECIFY_FUNCTION_TO_EXECUTE = '\n-> Please specify functionToExecute function';
const ERROR_SPECIFY_FUNCTION_CHECK = '\n-> Please specify proper functionCheck function, for example: ' +
    '(responseBody) => responseBody.length > 0';
const ERROR_FAILED_FUNCTION_TO_EXECUTE = '\n-> Provided number of attempts was exceeded - executed';

/* eslint-disable max-len */
/**
 * Retries executing a provided function (`functionToExecute`) once per a provided amount
 * of milliseconds (`waitTime`) until this function will return a value that upon passing a
 * (`functionCheck`) check will be `true` or the amount of provided attempts (`attempts`) will be exceeded.
 * @param {Object} configurationObject configuration object with parameters, for example: `{ functionToExecute: myFunction, functionCheck: checkFunction, attempts: 20, waitTime: 5000, logLevel: 2 }`.
 * @param {Function} configurationObject.functionToExecute function to execute (for example an API request).
 * @param {Function|_returnResult} configurationObject.functionCheck function to execute to check the result of `functionToExecute` (if successful - should return `true`, for example: `(responseBody) => responseBody.length > 0`).
 * @param {Number|_attemptsDefault} configurationObject.attempts number of attempts to retry (default value: `10`).
 * @param {Number|_waitTimeDefault} configurationObject.waitTime time to wait between retries (in milliseconds, default value: `1000`).
 * @param {Number|_logLevelDefault} configurationObject.logLevel must be an integer: 0 or 1 or 2 (default value: `0` - disabled).
 * @returns {Promise} response of a function that was provided for execution.
 */
async function retryIfFalse ({
    functionToExecute: functionToExecute,
    functionCheck: functionCheck,
    attempts: attempts,
    waitTime: waitTime,
    logLevel: logLevel
}) {
    /* eslint-enable max-len */
    /* eslint-disable no-param-reassign */
    functionToExecute = arguments[0].functionToExecute;
    functionCheck = arguments[0].functionCheck || _returnResult;
    attempts = arguments[0].attempts || _attemptsDefault;
    waitTime = arguments[0].waitTime || _waitTimeDefault;
    logLevel = arguments[0].logLevel || _logLevelDefault;
    /* eslint-enable no-param-reassign */
    if (functionToExecute === undefined || typeof functionToExecute !== 'function') {
        throw new Error(ERROR_SPECIFY_FUNCTION_TO_EXECUTE);
    }
    if (typeof functionCheck !== 'function') {
        throw new Error(ERROR_SPECIFY_FUNCTION_CHECK);
    }
    const result = new Promise((resolve, reject) => {
        let iteration = 0;
        const intervalId = setInterval(async () => {
            if (logLevel > 0) {
                console.info(NOTIFICATION_ATTEMPT_NUMBER, functionToExecute.name, iteration);
            }
            const res = await functionToExecute();

            if (logLevel === 2) {
                console.info(
                    `${NOTIFICATION_FUNCTION_TO_EXECUTE_RESPONSE} ${functionToExecute.name}:`,
                    JSON.stringify(res, null, _spacesToIndent)
                );
            }

            if (functionCheck(res)) {
                clearInterval(intervalId);
                return resolve(res);
            } else if (iteration < attempts) {
                iteration++;
            } else {
                clearInterval(intervalId);
                return reject(new Error(`${ERROR_FAILED_FUNCTION_TO_EXECUTE} ${functionToExecute.name} x ${attempts}`));
            }
        }, waitTime)
    });

    return result;
}

module.exports = retryIfFalse;
