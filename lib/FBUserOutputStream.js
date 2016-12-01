var request = require('request');

var Writable = require('stream').Writable;

function FBUserOutputStream(pageToken, userId) {
    var stream = new Writable({ objectMode: true });

    stream._write = function (messageData, encoding, cb) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: pageToken },
            method: 'POST',
            json: {
                recipient: { id: userId },
                message: messageData,
            }
        }, function(error, response, body) {
            if (error) {
                cb(error);
            } else if (response.body && response.body.error) {
                cb('fb error: ' + JSON.stringify(response.body.error));
            } else {
                cb();
            }
        });
    };

    return stream;
};

module.exports = FBUserOutputStream;
