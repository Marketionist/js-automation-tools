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
 * @param {Function=} configurationObject.functionCheck function to execute to check the result of `functionToExecute` (if successful - should return `true`, for example: `(responseBody) => responseBody.length > 0`, optional).
 * @param {Number=} configurationObject.attempts number of attempts to retry (optional, default value: `10`).
 * @param {Number=} configurationObject.waitTime time to wait between retries in milliseconds (optional, default value: `1000`).
 * @param {Number=} configurationObject.logLevel number (for example: `0` or `1` or `2`, optional, default value: `0` - no logs).
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
    const functionCheckValue = functionCheck || _returnResult;
    const attemptsValue = attempts || _attemptsDefault;
    const waitTimeValue = waitTime || _waitTimeDefault;
    const logLevelValue = logLevel || _logLevelDefault;

    if (functionToExecute === undefined || typeof functionToExecute !== 'function') {
        throw new Error(ERROR_SPECIFY_FUNCTION_TO_EXECUTE);
    }
    if (typeof functionCheckValue !== 'function') {
        throw new Error(ERROR_SPECIFY_FUNCTION_CHECK);
    }
    const result = new Promise((resolve, reject) => {
        let iteration = 0;
        const intervalId = setInterval(async () => {
            if (logLevelValue > 0) {
                console.info(NOTIFICATION_ATTEMPT_NUMBER, functionToExecute.name, iteration);
            }
            const res = await functionToExecute();

            if (logLevelValue === 2) {
                console.info(
                    `${NOTIFICATION_FUNCTION_TO_EXECUTE_RESPONSE} ${functionToExecute.name}:`,
                    JSON.stringify(res, null, _spacesToIndent)
                );
            }

            if (functionCheckValue(res)) {
                clearInterval(intervalId);
                return resolve(res);
            } else if (iteration < attemptsValue) {
                iteration++;
            } else {
                clearInterval(intervalId);
                return reject(new Error(
                    `${ERROR_FAILED_FUNCTION_TO_EXECUTE} ${functionToExecute.name} x ${attemptsValue}`
                ));
            }
        }, waitTimeValue);
    });

    return result;
}

module.exports = retryIfFalse;
