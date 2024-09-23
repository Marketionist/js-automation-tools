const path = require('path');
const {
    stamp,
    dateTime,
    retryIfFalse,
    sendRequest,
    readDirectories
} = require('../index.js');

// Test randomDigits
const randomDigits = stamp.getTimestamp();

console.log(
    'process.env.TIMESTAMP: ' +
    `${randomDigits === process.env.TIMESTAMP} ${process.env.TIMESTAMP}`
);

const newRandomDigits = stamp.resetTimestamp();

console.log(
    'process.env.TIMESTAMP: ' +
    `${newRandomDigits === process.env.TIMESTAMP} ${process.env.TIMESTAMP}`
);

const baseDecimal = 10;

if (
    parseInt(newRandomDigits, baseDecimal) > parseInt(randomDigits, baseDecimal)
) {
    console.log('randomDigits look ok!');
} else {
    throw new Error('newRandomDigits should be more than randomDigits');
}

// Test dateTime
const currentDateTime = dateTime.generateDateTime();

console.log(
    'process.env.DATETIME: ' +
    `${currentDateTime === process.env.DATETIME} ${process.env.DATETIME}`
);

const currentDateTimePlusDay = dateTime.generateDateTimePlusDays(1);

console.log(
    'currentDateTimePlusDay in process.env.DATETIME_PLUS_DAYS: ' +
    `${currentDateTimePlusDay === process.env.DATETIME_PLUS_DAYS} ` +
    process.env.DATETIME_PLUS_DAYS
);

const pastDateTimePlusDay = dateTime.generateDateTimePlusDays(1, '2024-03-14T00:14:25');

console.log(
    'pastDateTimePlusDay in process.env.DATETIME_PLUS_DAYS: ' +
    `${pastDateTimePlusDay === process.env.DATETIME_PLUS_DAYS} ` +
    process.env.DATETIME_PLUS_DAYS
);

const currentDateTimePlusHour = dateTime.generateDateTimePlusHours(1);

console.log(
    'currentDateTimePlusHour in process.env.DATETIME_PLUS_HOURS: ' +
    `${currentDateTimePlusHour === process.env.DATETIME_PLUS_HOURS} ` +
    process.env.DATETIME_PLUS_HOURS
);

const pastDateTimePlusHour = dateTime.generateDateTimePlusHours(1, '2024-03-14T00:14:25');

console.log(
    'pastDateTimePlusHour in process.env.DATETIME_PLUS_HOURS: ' +
    `${pastDateTimePlusHour === process.env.DATETIME_PLUS_HOURS} ` +
    process.env.DATETIME_PLUS_HOURS
);

const currentDateTimePlusMinute = dateTime.generateDateTimePlusMinutes(1);

console.log(
    'currentDateTimePlusMinute in process.env.DATETIME_PLUS_MINUTES: ' +
    `${currentDateTimePlusMinute === process.env.DATETIME_PLUS_MINUTES} ` +
    process.env.DATETIME_PLUS_MINUTES
);

const pastDateTimePlusMinute = dateTime.generateDateTimePlusMinutes(1, '2024-03-14T00:14:25');

console.log(
    'pastDateTimePlusMinute in process.env.DATETIME_PLUS_MINUTES: ' +
    `${pastDateTimePlusMinute === process.env.DATETIME_PLUS_MINUTES} ` +
    process.env.DATETIME_PLUS_MINUTES
);

const currentDateTimePlusSecond = dateTime.generateDateTimePlusSeconds(1);

console.log(
    'currentDateTimePlusSecond in process.env.DATETIME_PLUS_SECONDS: ' +
    `${currentDateTimePlusSecond === process.env.DATETIME_PLUS_SECONDS} ` +
    process.env.DATETIME_PLUS_SECONDS
);

const pastDateTimePlusSecond = dateTime.generateDateTimePlusSeconds(1, '2024-03-14T00:14:25');

console.log(
    'pastDateTimePlusSecond in process.env.DATETIME_PLUS_SECONDS: ' +
    `${pastDateTimePlusSecond === process.env.DATETIME_PLUS_SECONDS} ` +
    process.env.DATETIME_PLUS_SECONDS
);

if (
    (Date.parse(currentDateTimePlusDay) > Date.parse(currentDateTimePlusHour)) &&
        (Date.parse(currentDateTimePlusHour) > Date.parse(currentDateTimePlusMinute)) &&
        (Date.parse(currentDateTimePlusMinute) > Date.parse(currentDateTimePlusSecond)) &&
        (Date.parse(currentDateTimePlusSecond) > Date.parse(currentDateTime))
) {
    console.log('currentDateTimePlus Day/Hour/Minute/Second looks ok!');
} else {
    throw new Error('currentDateTimePlus Day/Hour/Minute/Second should be more than currentDateTime');
}

if (
    (Date.parse(currentDateTime) > Date.parse(pastDateTimePlusDay)) &&
        (Date.parse(pastDateTimePlusDay) > Date.parse(pastDateTimePlusHour)) &&
        (Date.parse(pastDateTimePlusHour) > Date.parse(pastDateTimePlusMinute)) &&
        (Date.parse(pastDateTimePlusMinute) > Date.parse(pastDateTimePlusSecond))
) {
    console.log('pastDateTimePlus Day/Hour/Minute/Second looks ok!');
} else {
    throw new Error('pastDateTimePlus Day/Hour/Minute/Second should be less than currentDateTime');
}

const currentDateTimeMinusHour = dateTime.generateDateTimeMinusHours(1);

console.log(
    'process.env.DATETIME_MINUS_HOURS: ' +
    `${currentDateTimeMinusHour === process.env.DATETIME_MINUS_HOURS} ` +
    process.env.DATETIME_MINUS_HOURS
);

if (
    Date.parse(currentDateTimeMinusHour) < Date.parse(currentDateTime)
) {
    console.log('currentDateTimeMinus Hour looks ok!');
} else {
    throw new Error('currentDateTimeMinus Hour should be less than currentDateTime');
}

(async () => {
    // Enable all logs output
    const logLevel = 2;
    // Test sendRequest
    const responsePost = await sendRequest({
        method: 'POST',
        requestUrl: 'http://httpbin.org/post',
        headersString: '{ "Content-Type": "application/json", "Authorization": "Bearer aBcD1234" }',
        bodyString: '{ "test1": 1, "test2": 2 }',
        logLevel: logLevel
    });

    console.log('responsePost from sendRequest:', responsePost);

    // Test sendRequest with mixed arguments
    const responsePostMixed = await sendRequest({
        requestUrl: 'http://a:b@httpbin.org/post?query=string',
        method: 'POST',
        headersString: '{ "Content-Type": "application/json", "Authorization": "Bearer EfGh5678" }',
        logLevel: logLevel,
        bodyString: '{ "test3": 3, "test4": 4 }'
    });

    console.log('responsePost from sendRequest with mixed arguments:', responsePostMixed);

    // Generate random digits within a provided interval
    const _generateRandomDigit = async function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    const digitZero = 0;
    const digitTwo = 2;
    const digitTen = 10;
    const digitSeven = 7;

    // Test retryIfFalse with only 2 arguments
    const myFunctionSimple = async function () {
        return _generateRandomDigit(digitZero, digitTwo);
    };
    const retryIfFalseSimpleResult = await retryIfFalse({
        functionToExecute: myFunctionSimple,
        logLevel: logLevel
    });

    console.log(`retryIfFalseSimpleResult: ${retryIfFalseSimpleResult}`);

    // Test retryIfFalse with all 5 arguments
    const myFunctionCustom = async function () {
        return _generateRandomDigit(digitZero, digitTen);
    };
    const checkFunction = function (result) {
        return result > digitSeven;
    };

    const retryIfFalseResult = await retryIfFalse({
        functionToExecute: myFunctionCustom,
        functionCheck: checkFunction,
        attempts: 20,
        waitTime: 1000,
        logLevel: logLevel
    });

    console.log(`retryIfFalseResult: ${retryIfFalseResult}`);

    // Test readDirectories
    const pathToDirectory1 = path.join(__dirname, '..', 'utils');
    const pathToDirectory2 = path.join(__dirname);

    const allFiles = await readDirectories([pathToDirectory1, pathToDirectory2]);

    console.log('allFiles array:');
    allFiles.map((value) => {
        console.log(value);
    });

    if (allFiles.some((value) => value.includes('test_text.txt'))) {
        console.log('allFiles array looks ok!');
    } else {
        throw new Error('allFiles array should include "test_text.txt"');
    }
})();
