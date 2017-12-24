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
      console.log (" bitcoin bitcoin "+ keyword +  " " + total + " " + positive + " " + neutral + " " + negative)
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
            positive,
            btc_sentiment_values.positive_percentage,
            neutral,
            btc_sentiment_values.neutral_percentage,
            negative,
            btc_sentiment_values.negative_percentage,
            function() {
            findDocuments(db, function() {
                db.close();
            });
          });
          btc_sentiment_values.total=0;//every x amount of time, the total counter is reseted
          btc_sentiment_values.positive=0;
          btc_sentiment_values.neutral=0;
          btc_sentiment_values.negative=0;

        }
      else if (keyword=="eth"){
          insertDocuments(db,
            keyword,
            total,
            positive,
            eth_sentiment_values.positive_percentage,
            neutral,
            eth_sentiment_values.neutral_percentage,
            negative,
            eth_sentiment_values.negative_percentage,
            function() {
            findDocuments(db, function() {
                db.close();
            });
          });
          eth_sentiment_values.total=0;//every x amount of time, the total counter is reseted
          eth_sentiment_values.positive=0;
          eth_sentiment_values.neutral=0;
          eth_sentiment_values.negative=0;

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

var insertDocuments = function(db,keyword,total,positive,positivePercentage,neutral,neutralPercentage,negative,negativePercentage, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([{
    timeStamp:new Date(),
    keyword:keyword,
    data:{
        total:total, 
        positive:positive,
        neutral:neutral,
        negative:negative, 
        positive_percentage:positivePercentage, 
        neutral_percentage:neutralPercentage,
        negative_percentage:negativePercentage
    }
    }], function(err, result) {
    //assert.equal(err, null);
    //assert.equal(3, result.result.n);
    //assert.equal(3, result.ops.length);
    //console.log("Inserted 3 documents into the document collection", result);
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

function generateDate(j){
    return new Date().getHours()-j
}

function countSpecificTimeFrame(rez){
    var btc_summed_total_positive = new Array(24).fill(0);
    var eth_summed_total_positive = new Array(24).fill(0);
    for (i=0;i<rez.length;i++){
        if(rez[i].keyword=="btc"){  
            //console.log (" obo je btc " + rez[i].timeStamp.getHours()); 
            if(rez[i].timeStamp.getHours()>=generateDate(24) && rez[i].timeStamp.getHours() < generateDate(23)) {btc_summed_total_positive[0] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(23) && rez[i].timeStamp.getHours() < generateDate(22)) {btc_summed_total_positive[1] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(22) && rez[i].timeStamp.getHours() < generateDate(21)) {btc_summed_total_positive[2] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(21) && rez[i].timeStamp.getHours() < generateDate(20)) {btc_summed_total_positive[3] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(20) && rez[i].timeStamp.getHours() < generateDate(19)) {btc_summed_total_positive[4] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(19) && rez[i].timeStamp.getHours() < generateDate(18)) {btc_summed_total_positive[5] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(18) && rez[i].timeStamp.getHours() < generateDate(17)) {btc_summed_total_positive[6] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(17) && rez[i].timeStamp.getHours() < generateDate(16)) {btc_summed_total_positive[7] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(16) && rez[i].timeStamp.getHours() < generateDate(15)) {btc_summed_total_positive[8] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(15) && rez[i].timeStamp.getHours() < generateDate(14)) {btc_summed_total_positive[9] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(14) && rez[i].timeStamp.getHours() < generateDate(13)) {btc_summed_total_positive[10] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(13) && rez[i].timeStamp.getHours() < generateDate(12)) {btc_summed_total_positive[11] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(12) && rez[i].timeStamp.getHours() < generateDate(11)) {btc_summed_total_positive[12] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(11) && rez[i].timeStamp.getHours() < generateDate(10)) {btc_summed_total_positive[13] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(10) && rez[i].timeStamp.getHours() < generateDate(9)) {btc_summed_total_positive[14] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(9) && rez[i].timeStamp.getHours() < generateDate(8)) {btc_summed_total_positive[15] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(8) && rez[i].timeStamp.getHours() < generateDate(7)) {btc_summed_total_positive[16] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(7) && rez[i].timeStamp.getHours() < generateDate(6)) {btc_summed_total_positive[17] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(6) && rez[i].timeStamp.getHours() < generateDate(5)) {btc_summed_total_positive[18] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(5) && rez[i].timeStamp.getHours() < generateDate(4)) {btc_summed_total_positive[19] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(4) && rez[i].timeStamp.getHours() < generateDate(3)) {btc_summed_total_positive[20] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(3) && rez[i].timeStamp.getHours() < generateDate(2)) {btc_summed_total_positive[21] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(2) && rez[i].timeStamp.getHours() < generateDate(1)) {btc_summed_total_positive[22] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(1) && rez[i].timeStamp.getHours() < generateDate(0)) {btc_summed_total_positive[23] += rez[i].data.total}
        }
        else if(rez[i].keyword=="eth"){  
            //console.log (" obo je btc " + rez[i].timeStamp.getHours()); 
            if(rez[i].timeStamp.getHours()>=generateDate(24) && rez[i].timeStamp.getHours() < generateDate(23)) {eth_summed_total_positive[0] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(23) && rez[i].timeStamp.getHours() < generateDate(22)) {eth_summed_total_positive[1] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(22) && rez[i].timeStamp.getHours() < generateDate(21)) {eth_summed_total_positive[2] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(21) && rez[i].timeStamp.getHours() < generateDate(20)) {eth_summed_total_positive[3] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(20) && rez[i].timeStamp.getHours() < generateDate(19)) {eth_summed_total_positive[4] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(19) && rez[i].timeStamp.getHours() < generateDate(18)) {eth_summed_total_positive[5] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(18) && rez[i].timeStamp.getHours() < generateDate(17)) {eth_summed_total_positive[6] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(17) && rez[i].timeStamp.getHours() < generateDate(16)) {eth_summed_total_positive[7] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(16) && rez[i].timeStamp.getHours() < generateDate(15)) {eth_summed_total_positive[8] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(15) && rez[i].timeStamp.getHours() < generateDate(14)) {eth_summed_total_positive[9] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(14) && rez[i].timeStamp.getHours() < generateDate(13)) {eth_summed_total_positive[10] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(13) && rez[i].timeStamp.getHours() < generateDate(12)) {eth_summed_total_positive[11] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(12) && rez[i].timeStamp.getHours() < generateDate(11)) {eth_summed_total_positive[12] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(11) && rez[i].timeStamp.getHours() < generateDate(10)) {eth_summed_total_positive[13] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(10) && rez[i].timeStamp.getHours() < generateDate(9)) {eth_summed_total_positive[14] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(9) && rez[i].timeStamp.getHours() < generateDate(8)) {eth_summed_total_positive[15] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(8) && rez[i].timeStamp.getHours() < generateDate(7)) {eth_summed_total_positive[16] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(7) && rez[i].timeStamp.getHours() < generateDate(6)) {eth_summed_total_positive[17] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(6) && rez[i].timeStamp.getHours() < generateDate(5)) {eth_summed_total_positive[18] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(5) && rez[i].timeStamp.getHours() < generateDate(4)) {eth_summed_total_positive[19] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(4) && rez[i].timeStamp.getHours() < generateDate(3)) {eth_summed_total_positive[20] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(3) && rez[i].timeStamp.getHours() < generateDate(2)) {eth_summed_total_positive[21] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(2) && rez[i].timeStamp.getHours() < generateDate(1)) {eth_summed_total_positive[22] += rez[i].data.total}
            else if(rez[i].timeStamp.getHours()>=generateDate(1) && rez[i].timeStamp.getHours() < generateDate(0)) {eth_summed_total_positive[23] += rez[i].data.total}
        }
    }
    return [btc_summed_total_positive,eth_summed_total_positive];
}

var fetchData = function(callback){
    console.log("sum totalsssss " + 22)
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
        db.collection("documents").find({"timeStamp":{$gte:new Date(new Date().getTime()-60*60*24*1000)}}).toArray(function(err,rez) {
            if (err) throw err;
            //console.log ("rezz " + rez)
            //callback(rez);
          var rezultati = countSpecificTimeFrame(rez);
          console.log("napokon izracunato " + rezultati);
          callback(rezultati);
            //console.log( " summed total     " +  btc_summed_total_positive)
            //console.log( " timeStamp1     " +  typeof(rez[2].timeStamp))
            //console.log( " timeStamp2     " +  rez[77].timeStamp.getTime())
            //var firstDate = rez[2].timeStamp
            //var secondDate = rez[77].timeStamp
  

            //var status = firstDate<secondDate;
            //var status1 = firstDate>secondDate;

            //console.log(" evaultead time dite " + status)
            //console.log(" evaultead time dite " + status1)
            db.close();
        });

    });
};


/*      db.collection("documents").find(query).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        //callback(result);
        db.close();
      });*/




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
}

twit_t.on('tweet', function (tweet) {
  if (tweet.lang == 'en') {
    tweet.t_sentiment = analyser.classify(tweet.text);
    io.emit('tweet_t', tweet);
    btc_sentiment_values.total++;
    countSentiments("btc",tweet.t_sentiment);
  }
});


    setInterval( function(){saveToDatabase("btc",btc_sentiment_values.total,btc_sentiment_values.positive,btc_sentiment_values.neutral,btc_sentiment_values.negative)}, 60000);

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
    setInterval( function(){saveToDatabase("eth",eth_sentiment_values.total,eth_sentiment_values.positive,eth_sentiment_values.neutral,eth_sentiment_values.negative)}, 60000);


twit_t.track('bitcoin');
//twit_b.track('blockchain');
twit_h.track('ethereum');
//dropTable();