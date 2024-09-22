'use strict';

// #############################################################################

let _hoursInDay = 24;
let _minutesInHour = 60;
let _secondsInMinute = 60;
let _millisecondsInSecond = 1000;

let dateTime = {
    /**
     * Generates current date and time (for example: '2024-03-14T00:14:25').
     * @returns {String} string with date and time (for example: '2024-03-14T00:14:25').
     */
    generateDateTime: function () {
        process.env.DATETIME = new Date(
            new Date().toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME;
    },
    // ==== Plus functions =====================================================
    /* eslint-disable max-len */
    /**
     * Generates current (if no initial date is provided) date and time plus number of days (for example: '2024-03-15T00:14:25').
     * @param {Number} days number of days that will be added to current (if no initial date is provided) date and time.
     * @param {String=} initialDate string with initial date and time that you want to add a number of days to (for example: '2024-03-14T00:14:25').
     * @returns {String} string with date and time plus number of days (for example: '2024-03-15T00:14:25').
     */
    generateDateTimePlusDays: function (days, initialDate) {
        /* eslint-enable max-len */
        const date = initialDate ? initialDate : Date.now();

        process.env.DATETIME_PLUS_DAYS = new Date(
            new Date(new Date(date).getTime() + days *
                (
                    _hoursInDay *
                    _minutesInHour *
                    _secondsInMinute *
                    _millisecondsInSecond
                )
            ).toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME_PLUS_DAYS;
    },
    /**
     * Generates current date and time plus number of hours (for example: '2024-03-14T01:14:25').
     * @param {Number} hours number of hours that will be added to current date and time.
     * @returns {String} string with date and time plus number of hours (for example: '2024-03-14T01:14:25').
     */
    generateDateTimePlusHours: function (hours) {
        process.env.DATETIME_PLUS_HOURS = new Date(
            new Date(Date.now() + hours *
                (
                    _minutesInHour *
                    _secondsInMinute *
                    _millisecondsInSecond
                )
            ).toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME_PLUS_HOURS;
    },
    /**
     * Generates current date and time plus number of minutes (for example: '2024-03-14T00:15:25').
     * @param {Number} minutes number of minutes that will be added to current date and time.
     * @returns {String} string with date and time plus number of minutes (for example: '2024-03-14T00:15:25').
     */
    generateDateTimePlusMinutes: function (minutes) {
        process.env.DATETIME_PLUS_MINUTES = new Date(
            new Date(Date.now() +
                (
                    minutes *
                    _secondsInMinute *
                    _millisecondsInSecond
                )
            ).toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME_PLUS_MINUTES;
    },
    /**
     * Generates current date and time plus number of seconds (for example: '2024-03-14T00:14:26').
     * @param {Number} seconds number of seconds that will be added to current date and time.
     * @returns {String} string with date and time plus number of seconds (for example: '2024-03-14T00:14:26').
     */
    generateDateTimePlusSeconds: function (seconds) {
        process.env.DATETIME_PLUS_SECONDS = new Date(
            new Date(
                Date.now() + (seconds * _millisecondsInSecond)
            ).toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME_PLUS_SECONDS;
    },
    // ==== Minus functions ====================================================
    /**
     * Generates current date and time minus number of hours (for example: '2024-03-13T23:14:25').
     * @param {Number} hours number of hours that will be added to current date and time.
     * @returns {String} string with date and time minus number of hours (for example: '2024-03-13T23:14:25').
     */
    generateDateTimeMinusHours: function (hours) {
        process.env.DATETIME_MINUS_HOURS = new Date(
            new Date(Date.now() - hours *
                (
                    _minutesInHour *
                    _secondsInMinute *
                    _millisecondsInSecond
                )
            ).toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME_MINUS_HOURS;
    }
};

module.exports = dateTime;
