var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require('node-tweet-stream');
var express = require('express');
var salient = require('salient');
var config = require('./twit_auth');
var Sentiment_values = require('./sentiment_values')
var analyser = new salient.sentiment.BayesSentimentAnalyser();


var btc_sentiment_values = new Sentiment_values();
var eth_sentiment_values = new Sentiment_values();


var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
// Connection URL
var url = 'mongodb://localhost:27017/sentiments';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
 
/*  insertDocuments(db, function() {
    findDocuments(db, function() {
        db.close();
    });
  });*/
});

function calculatePercentage(keyword,total,positive,neutral,negative){

    if(keyword=="btc"){
        btc_sentiment_values.positive_percentage = (positive/total*100);
        btc_sentiment_values.neutral_percentage = (neutral/total*100)
        btc_sentiment_values.negative_percentage = (negative/total*100)
    }
    else if(keyword=="eth"){
        eth_sentiment_values.positive_percentage = (positive/total*100);
        eth_sentiment_values.neutral_percentage = (neutral/total*100)
        eth_sentiment_values.negative_percentage = (negative/total*100) 
    }

/*    var positivePercentage = (positive/total*100)
    var neutralPercentage = (neutral/total*100)
    var negativePercentage = (negative/total*100)
    //console.log("Percentages "+positivePercentage + " "+ negativePercentage )
    return [positivePercentage,neutralPercentage,negativePercentage];*/
}

function saveToDatabase(keyword,total,positive,neutral,negative){
    calculatePercentage(keyword,total,positive,neutral,negative);

/*    var positivePercentage = arrayWithPercentages[0]
    var neutralPercentage = arrayWithPercentages[1]
    var negativePercentage = arrayWithPercentages[2]*/
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      if (keyword=="btc"){
          insertDocuments(db,
            keyword,
            total,
            btc_sentiment_values.positive_percentage,
            btc_sentiment_values.neutral_percentage,
            btc_sentiment_values.negative_percentage,
            function() {
            findDocuments(db, function() {
                db.close();
            });
          });
        }
      else if (keyword=="eth"){
          insertDocuments(db,
            keyword,
            total,
            eth_sentiment_values.positive_percentage,
            eth_sentiment_values.neutral_percentage,
            eth_sentiment_values.negative_percentage,
            function() {
            findDocuments(db, function() {
                db.close();
            });
          });
      }
    });
}


var dropTable = function(db, callback) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("documents").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection deleted");
        db.close();
      });
    });
}

var insertDocuments = function(db,keyword,total,positivePercentage,neutralPercentage,negativePercentage, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([{
    timeStamp:new Date(),
    keyword:keyword,
    data:{
        total:total, 
        positive_percentage:positivePercentage, 
        neutral_percentage:neutralPercentage, 
        negative_percentage:negativePercentage
    }
    }], function(err, result) {
    //assert.equal(err, null);
    //assert.equal(3, result.result.n);
    //assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection", result);
    callback(result);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    //assert.equal(err, null);
    //assert.equal(2, docs.length);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}

var fetchData = function(callback){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var query = { keyword: "eth"};
      //var query1 = {data.total:2}};
      db.collection("documents").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        callback(result);
        db.close();
      });
    });
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/fetchDB', function (req, res) {
  // .. do database stuff
  fetchData(function(results){
    res.send(results)
  });
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
var twit_b = new twitter(config.twitter_auth);


var countSentiments = function(keyword,sentiment){
    if (keyword=="btc"){
        if (sentiment < 0) {
          btc_sentiment_values.negative++;
          //btcNegative ++;
          //$('#' + canvas + ' .negative').html(Math.floor(negative / total * 100) + '%');
        }
        //neutral sentiment
        else if (sentiment == 0) {
            btc_sentiment_values.neutral++;
          //btcNeutral ++;
          //$('#' + canvas + ' .neutral').html(Math.floor(neutral / total * 100) + '%');
        }
        // positive sentiment
        else {
          btc_sentiment_values.positive++;
          //btcPositive++;
          //$('#' + canvas + ' .positive').html(Math.floor(positive / total * 100) + '%');
        }

    }
    else if(keyword=="eth"){
        if (sentiment < 0) {
          eth_sentiment_values.negative++;
          //btcNegative ++;
          //$('#' + canvas + ' .negative').html(Math.floor(negative / total * 100) + '%');
        }
        //neutral sentiment
        else if (sentiment == 0) {
            eth_sentiment_values.neutral++;
          //btcNeutral ++;
          //$('#' + canvas + ' .neutral').html(Math.floor(neutral / total * 100) + '%');
        }
        // positive sentiment
        else {
          eth_sentiment_values.positive++;
          //btcPositive++;
          //$('#' + canvas + ' .positive').html(Math.floor(positive / total * 100) + '%');
        }
    }

    if (sentiment < 0) {
      btc_sentiment_values.negative++;
      //btcNegative ++;
      //$('#' + canvas + ' .negative').html(Math.floor(negative / total * 100) + '%');
    }
    //neutral sentiment
    else if (sentiment == 0) {
        btc_sentiment_values.neutral++;
      //btcNeutral ++;
      //$('#' + canvas + ' .neutral').html(Math.floor(neutral / total * 100) + '%');
    }
    // positive sentiment
    else {
      btc_sentiment_values.positive++;
      //btcPositive++;
      
      //$('#' + canvas + ' .positive').html(Math.floor(positive / total * 100) + '%');
    }
}

twit_t.on('tweet', function (tweet) {
  if (tweet.lang == 'en') {
    tweet.t_sentiment = analyser.classify(tweet.text);
    io.emit('tweet_t', tweet);
    btc_sentiment_values.total++;
    countSentiments("btc",tweet.t_sentiment);
  }
});
    setInterval( function(){saveToDatabase("btc",btc_sentiment_values.total,btc_sentiment_values.positive,btc_sentiment_values.neutral,btc_sentiment_values.negative)}, 6000);

/*twit_b.on('tweet', function (tweet) {
  if (tweet.lang == 'en') {
    tweet.t_sentiment = analyser.classify(tweet.text);
    io.emit('tweet_b', tweet);
    console.log("Tweet arrived ",tweet);
  }
});*/
twit_h.on('tweet', function (tweet) {
  if (tweet.lang == 'en') {
    tweet.t_sentiment = analyser.classify(tweet.text);
    io.emit('tweet_h', tweet);
    eth_sentiment_values.total++;
    countSentiments("eth",tweet.t_sentiment);
  }
});
    setInterval( function(){saveToDatabase("eth",eth_sentiment_values.total,eth_sentiment_values.positive,eth_sentiment_values.neutral,eth_sentiment_values.negative)}, 6000);


twit_t.track('bitcoin');
//twit_b.track('blockchain');
twit_h.track('ethereum');
//dropTable();