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

const currentDateTimePlusDay = dateTime.generateDateTimePlus({ days: 1 });

console.log(
    'currentDateTimePlusDay in process.env.NEW_DATETIME: ' +
    `${currentDateTimePlusDay === process.env.NEW_DATETIME} ` +
    process.env.NEW_DATETIME
);

const pastDateTimePlusDay = dateTime.generateDateTimePlus({ days: 1, initialDate: '2024-03-14T00:14:25' });

console.log(
    'pastDateTimePlusDay in process.env.NEW_DATETIME: ' +
    `${pastDateTimePlusDay === process.env.NEW_DATETIME} ` +
    process.env.NEW_DATETIME
);

const currentDateTimePlusHour = dateTime.generateDateTimePlus({ hours: 1 });

console.log(
    'currentDateTimePlusHour in process.env.NEW_DATETIME: ' +
    `${currentDateTimePlusHour === process.env.NEW_DATETIME} ` +
    process.env.NEW_DATETIME
);

const pastDateTimePlusHour = dateTime.generateDateTimePlus({ hours: 1, initialDate: '2024-03-14T00:14:25' });

console.log(
    'pastDateTimePlusHour in process.env.NEW_DATETIME: ' +
    `${pastDateTimePlusHour === process.env.NEW_DATETIME} ` +
    process.env.NEW_DATETIME
);

const currentDateTimePlusMinute = dateTime.generateDateTimePlus({ minutes: 1 });

console.log(
    'currentDateTimePlusMinute in process.env.NEW_DATETIME: ' +
    `${currentDateTimePlusMinute === process.env.NEW_DATETIME} ` +
    process.env.NEW_DATETIME
);

const pastDateTimePlusMinute = dateTime.generateDateTimePlus({ minutes: 1, initialDate: '2024-03-14T00:14:25' });

console.log(
    'pastDateTimePlusMinute in process.env.NEW_DATETIME: ' +
    `${pastDateTimePlusMinute === process.env.NEW_DATETIME} ` +
    process.env.NEW_DATETIME
);

const currentDateTimePlusSecond = dateTime.generateDateTimePlus({ seconds: 1 });

console.log(
    'currentDateTimePlusSecond in process.env.NEW_DATETIME: ' +
    `${currentDateTimePlusSecond === process.env.NEW_DATETIME} ` +
    process.env.NEW_DATETIME
);

const pastDateTimePlusSecond = dateTime.generateDateTimePlus({ seconds: 1, initialDate: '2024-03-14T00:14:25' });

console.log(
    'pastDateTimePlusSecond in process.env.NEW_DATETIME: ' +
    `${pastDateTimePlusSecond === process.env.NEW_DATETIME} ` +
    process.env.NEW_DATETIME
);

if (
    (Date.parse(currentDateTimePlusDay) > Date.parse(currentDateTimePlusHour)) &&
        (Date.parse(currentDateTimePlusHour) > Date.parse(currentDateTimePlusMinute)) &&
        (Date.parse(currentDateTimePlusMinute) > Date.parse(currentDateTimePlusSecond)) &&
        (Date.parse(currentDateTimePlusSecond) > Date.parse(currentDateTime))
) {
    console.log('currentDateTimePlus day/hour/minute/second looks ok!');
} else {
    throw new Error('currentDateTimePlus day/hour/minute/second should be more than currentDateTime');
}

if (
    (Date.parse(currentDateTime) > Date.parse(pastDateTimePlusDay)) &&
        (Date.parse(pastDateTimePlusDay) > Date.parse(pastDateTimePlusHour)) &&
        (Date.parse(pastDateTimePlusHour) > Date.parse(pastDateTimePlusMinute)) &&
        (Date.parse(pastDateTimePlusMinute) > Date.parse(pastDateTimePlusSecond))
) {
    console.log('pastDateTimePlus day/hour/minute/second looks ok!');
} else {
    throw new Error('pastDateTimePlus day/hour/minute/second should be less than currentDateTime');
}

const currentDateTimeMinusHour = dateTime.generateDateTimePlus({ hours: -1 });

console.log(
    'currentDateTimeMinusHour in process.env.NEW_DATETIME: ' +
    `${currentDateTimeMinusHour === process.env.NEW_DATETIME} ` +
    process.env.NEW_DATETIME
);

if (
    Date.parse(currentDateTimeMinusHour) < Date.parse(currentDateTime)
) {
    console.log('currentDateTimePlus -1 hour looks ok!');
} else {
    throw new Error('currentDateTimePlus -1 hour should be less than currentDateTime');
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

    const allFiles = await readDirectories([pathToDirectory1, pathToDirectory2,]);

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
