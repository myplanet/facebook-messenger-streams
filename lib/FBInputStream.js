var Readable = require('stream').Readable;
var express = require('express');
var xhub = require('express-x-hub');

function FBInputStream(webHookVerifyToken, appSecret) {
    var eventStream = new Readable({ objectMode: true });
    eventStream._read = function () {
        // no-op, we just wait for data to come in
    };

    var fbWebHookApp = new express.Router();

    fbWebHookApp.get('/', function (req, res) {
        if (req.query['hub.verify_token'] === webHookVerifyToken) {
            res.send(req.query['hub.challenge']);
            return;
        }

        res.status(400).send('Wrong validation token');
    });

    fbWebHookApp.post('/', xhub({
        algorithm: 'sha1',
        secret: appSecret
    }), function (req, res) {
        if (!req.isXHub) {
            return res.status(401).send('not xhub');
        }

        if (!req.isXHubValid()) {
            return res.status(401).send('not matching sig');
        }

        res.sendStatus(200);

        var messaging_events = req.body.entry[0].messaging;

        for (i = 0; i < messaging_events.length; i++) {
            var event = req.body.entry[0].messaging[i];

            eventStream.push(event); // @todo try/catch here
        }
    });

    eventStream.webhookRouter = fbWebHookApp;

    return eventStream;
}

module.exports = FBInputStream;
