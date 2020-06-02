'use strict';

// #############################################################################

let stamp = {
    _timestamp: '',
    _initiateTimestamp: function () {
        let counter = 0;

        return function () {
            if (counter > 1) {
                // For each new call after the first, add 1 to timestamp
                this._timestamp = (parseInt(this._timestamp, 10) + 1)
                    .toString();
            } else {
                this._timestamp = new Date().getTime().toString();
            }

            process.env.TIMESTAMP = this._timestamp;

            if (counter > 1) {
                // For each new call after the first, log the value
                console.log(`process.env.TIMESTAMP: ${process.env.TIMESTAMP}`);
            }

            counter += 1;

            return process.env.TIMESTAMP;
        };
    }
};

stamp.resetTimestamp = stamp._initiateTimestamp();
stamp.getTimestamp = function () {
    process.env.TIMESTAMP = stamp._timestamp.length > 0 ?
        stamp._timestamp : stamp.resetTimestamp();

    return process.env.TIMESTAMP;
};

module.exports = stamp;
