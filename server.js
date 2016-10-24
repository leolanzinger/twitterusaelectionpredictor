var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require('node-tweet-stream');
var express = require('express');
var salient = require('salient');
var config = require('./twit_auth');
var analyser = new salient.sentiment.BayesSentimentAnalyser();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use("/", express.static(__dirname + "/public/"));

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});
// set up twit
var twit_t = new twitter(config.twitter_auth);
var twit_h = new twitter(config.twitter_auth);

twit_t.on('tweet', function (tweet) {
  if (tweet.lang == 'en') {
    tweet.t_sentiment = analyser.classify(tweet.text);
    io.emit('tweet_t', tweet);
  }
});
twit_h.on('tweet', function (tweet) {
  if (tweet.lang == 'en') {
    tweet.t_sentiment = analyser.classify(tweet.text);
    io.emit('tweet_h', tweet);
  }
});

twit_t.track('trump');
twit_h.track('hillary');
