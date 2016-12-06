# Facebook Messenger Streams

Wrap [Facebook Messenger API](https://developers.facebook.com/docs/messenger-platform) in a stream-oriented interface. Using [streams](https://github.com/substack/stream-handbook) allows using a piping/filtering metaphor on incoming/outgoing messages which may help structure code better.

## Usage

```js
var FBInputStream = require('facebook-messenger-streams').InputStream;
var FBUserOutputStream = require('facebook-messenger-streams').UserOutputStream;

var fbInputStream = new FBInputStream(
    'mysecrettoken',
    process.env.APP_SECRET
);

fbInputStream.on('data', function (data) {
    var senderId = data.sender.id;

    console.log('got data from user', senderId, data);

    var userOutputStream = new FBUserOutputStream(
        process.env.PAGE_TOKEN,
        senderId
    );

    userOutputStream.write({ text: 'Hi there!' });
});

var app = new express.Router();
app.listen(process.env.PORT || 3000);

app.use('/webhook', fbInputStream.webhookRouter);
```
