const path = require('path');
const { stamp, createRequest, readDirectories } = require('../index.js');

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

    console.log(`responsePost: ${responsePost}`);

    // Test readDirectories
    const pathToDirectory1 = path.join(__dirname, '..', 'utils');
    const pathToDirectory2 = path.join(__dirname);

    const allFiles = await readDirectories([pathToDirectory1, pathToDirectory2]);

    console.log('allFiles array:');
    allFiles.map((value) => {
        console.log(value);
    });
})();

