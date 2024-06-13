'use strict';

// #############################################################################

let dateTime = {
    _minutesInHour: 60,
    _secondsInMinute: 60,
    _millisecondsInSecond: 1000,

    generateDateTime: function () {
        process.env.DATETIME = new Date(
            new Date().toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME;
    },
    // ==== Plus functions =====================================================
    generateDateTimePlusHours: function (hours) {
        process.env.DATETIME_PLUS_HOURS = new Date(
            new Date(Date.now() + hours *
                (
                    dateTime._minutesInHour *
                    dateTime._secondsInMinute *
                    dateTime._millisecondsInSecond
                )
            ).toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME_PLUS_HOURS;
    },
    generateDateTimePlusMinutes: function (minutes) {
        process.env.DATETIME_PLUS_MINUTES = new Date(
            new Date(Date.now() +
                (
                    minutes *
                    dateTime._secondsInMinute *
                    dateTime._millisecondsInSecond
                )
            ).toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME_PLUS_MINUTES;
    },
    generateDateTimePlusSeconds: function (seconds) {
        process.env.DATETIME_PLUS_SECONDS = new Date(
            new Date(
                Date.now() + (seconds * dateTime._millisecondsInSecond)
            ).toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME_PLUS_SECONDS;
    },
    // ==== Minus functions ====================================================
    generateDateTimeMinusHours: function (hours) {
        process.env.DATETIME_MINUS_HOURS = new Date(
            new Date(Date.now() - hours *
                (
                    dateTime._minutesInHour *
                    dateTime._secondsInMinute *
                    dateTime._millisecondsInSecond
                )
            ).toString().split('GMT')[0] + ' UTC'
        ).toISOString().split('.')[0];

        return process.env.DATETIME_MINUS_HOURS;
    }
};

module.exports = dateTime;
