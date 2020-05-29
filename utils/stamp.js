'use strict';

// #############################################################################

let stamp = {
    _timestamp: '',
    resetTimestamp: function () {
        let counter = 1;

        return function () {
            if (counter > 1) {
                // For each new call after the first, add 1 to timestamp
                this._timestamp = (parseInt(this._timestamp, 10) + 1)
                    .toString();

                console.log(`process.env.TIMESTAMP: ${process.env.TIMESTAMP}`);
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
    },
    getTimestamp: function () {
        process.env.TIMESTAMP = this._timestamp.length > 0 ?
            this._timestamp : this.resetTimestamp();

        return process.env.TIMESTAMP;
    }
};

module.exports = stamp;
