const path = require('path');
const { stamp, createRequest, sendRequest, readDirectories } = require('../index.js');

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

(async () => {
    // Enable all logs output
    const logLevel = 2;

    // Test createRequest
    const responsePost = await createRequest(
        'POST',
        'http://httpbin.org/post',
        '{ "Content-Type": "application/json", "Authorization": "Bearer aBcD1234" }',
        '{ "test1": 1, "test2": 2 }',
        logLevel
    );

    console.log(`responsePost from createRequest: ${responsePost}`);

    // Test sendRequest
    const responsePost2 = await sendRequest({
        requestUrl: 'http://a:b@httpbin.org/post?query=string',
        method: 'POST',
        headersString: '{ "Content-Type": "application/json", "Authorization": "Bearer EfGh5678" }',
        logLevel: logLevel,
        bodyString: '{ "test3": 3, "test4": 4 }'
    });

    console.log(`responsePost from sendRequest: ${responsePost2}`);

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
