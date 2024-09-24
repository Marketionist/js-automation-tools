'use strict';

// #############################################################################

const _hoursInDay = 24;
const _minutesInHour = 60;
const _secondsInMinute = 60;
const _millisecondsInSecond = 1000;
const _zero = 0;


let dateTime = {
    /**
     * Generates current date and time (for example: '2024-09-23T19:26:35').
     * @returns {String} string with date and time (for example: '2024-09-23T19:26:35').
     */
    generateDateTime: function () {
        process.env.DATETIME = new Date(
            new Date().toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME;
    },
    // ==== Plus function ======================================================
    /* eslint-disable max-len */
    /**
     * Generates current (if no initial date is provided) date and time plus number of days, hours, minutes, seconds if they are provided.
     * @param {Object} configurationObject configuration object with parameters, for example: `{ days: 1, seconds: 25, initialDate: '2024-03-14T00:14:25' }`.
     * @param {Number=} configurationObject.days number of days that will be added to current (if no initial date is provided) date and time (default value: `0`).
     * @param {Number=} configurationObject.hours number of hours that will be added to current (if no initial date is provided) date and time (default value: `0`).
     * @param {Number=} configurationObject.minutes number of minutes that will be added to current (if no initial date is provided) date and time (default value: `0`).
     * @param {Number=} configurationObject.seconds number of seconds that will be added to current (if no initial date is provided) date and time (default value: `0`).
     * @param {String=} configurationObject.initialDate string with initial date and time that you want to add a number of days, hours, minutes, seconds to (for example: '2024-03-14T00:14:25', default value: current date and time).
     * @returns {String} string with date and time plus number of days, hours, minutes, seconds if they are provided (for example: '2024-03-15T00:14:50').
     */
    generateDateTimePlus: function ({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        initialDate: initialDate
    }) {
        /* eslint-enable max-len */
        /* eslint-disable no-param-reassign */
        days = arguments[0].days || _zero;
        hours = arguments[0].hours || _zero;
        minutes = arguments[0].minutes || _zero;
        seconds = arguments[0].seconds || _zero;
        initialDate = arguments[0].initialDate || Date.now();
        /* eslint-enable no-param-reassign */

        process.env.NEW_DATETIME = new Date(
            new Date(new Date(initialDate).getTime() +
                days * (_hoursInDay * _minutesInHour * _secondsInMinute * _millisecondsInSecond) +
                hours * (_minutesInHour * _secondsInMinute * _millisecondsInSecond) +
                minutes * (_secondsInMinute * _millisecondsInSecond) +
                (seconds * _millisecondsInSecond)
            ).toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.NEW_DATETIME;
    }
};

module.exports = dateTime;
