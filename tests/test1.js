const { stamp, createRequest, readDirectories } = require('../index.js');

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

const responseGet = await createRequest(
    'GET',
    'https://www.google.com/',
    '',
    ''
);
console.log(`responseGet: ${responseGet}`);

const responsePost = await createRequest(
    'POST',
    'http://httpbin.org/post',
    '{ "Content-Type": "application/json", "Authorization": "Bearer aBcD1234" }',
    '{ "test1": 1, "test2": 2 }'
);
console.log(`responsePost: ${responsePost}`);

const pathToDirectory1 = path.join(__dirname, '../');
const pathToDirectory2 = path.join(__dirname);

const allFiles = await readDirectories([pathToDirectory1, pathToDirectory2]);
console.log(`allFiles: ${allFiles}`);

