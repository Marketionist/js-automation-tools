'use strict';

// #############################################################################

const _attemptsDefault = 10;
const _waitTimeDefault = 1000;

/**
 * Executes a provided function once per a provided amount of milliseconds
 * until this function will return a truthy value or the amount of provided attempts will be exceeded
 * @param {Function} functionToExecute function to execute (if successful - should return a truthy value)
 * @param {Number} attempts number of attempts to retry (default value: `10`)
 * @param {Number} waitTime time to wait between retries (in milliseconds, default value: `1000`)
 * @returns {Promise} response of a function that was provided for execution
 */
async function asyncRetrySimple (
    functionToExecute,
    attempts = _attemptsDefault,
    waitTime = _waitTimeDefault
) {
    const result = new Promise((resolve, reject) => {
        let iteration = 0;
        const intervalId = setInterval(async () => {
            console.info(`Attempt: ${iteration}`);
            const res = await functionToExecute();

            if (res) {
                clearInterval(intervalId);
                return resolve(res);
            } else if (iteration < attempts) {
                iteration++;
            } else {
                clearInterval(intervalId);
                return reject(new Error(`Failed to succeed in ${iteration} attempts`));
            }
        }, waitTime)
    });

    return result;
}

module.exports = {
    asyncRetrySimple: asyncRetrySimple
};
