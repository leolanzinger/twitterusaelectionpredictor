var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require('node-tweet-stream');
var express = require('express');
var salient = require('salient');
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

http.listen(3000, function(){
  console.log('listening on *:3000');
});
// set up twit
var twit_t = new twitter({
  consumer_key:         '3vObh7vm2J3bAIejMb4OvuXht',
  consumer_secret:      '3FzozTIL9Gy7ezVPL0UDrajEFcWU4vOLWr1j8XroCt0l8wPYcs',
  token:         '65343092-Xum3w1WLU0seWtYJExD6YcRt0U86fIW0eoXZzjLaB',
  token_secret:  'opTimtkZmgj0CclXWtKeg9Ant2TDtrDyYyeFd1Msh6bNq'
});
var twit_h = new twitter({
  consumer_key:         '3vObh7vm2J3bAIejMb4OvuXht',
  consumer_secret:      '3FzozTIL9Gy7ezVPL0UDrajEFcWU4vOLWr1j8XroCt0l8wPYcs',
  token:         '65343092-Xum3w1WLU0seWtYJExD6YcRt0U86fIW0eoXZzjLaB',
  token_secret:  'opTimtkZmgj0CclXWtKeg9Ant2TDtrDyYyeFd1Msh6bNq'
});

twit_t.on('tweet', function (tweet) {
  tweet.t_sentiment = analyser.classify(tweet.text);
  io.emit('tweet_t', tweet);
});
twit_h.on('tweet', function (tweet) {
  tweet.t_sentiment = analyser.classify(tweet.text);
  io.emit('tweet_h', tweet);
})

twit_t.track('trump');
twit_h.track('hillary');
