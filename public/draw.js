var socket = io();
var canvas_height = parseInt($('#canvas_t').innerHeight() - $('h1').outerHeight() - $('h5').outerHeight() - 40);

var trump = function() {
  var positive = 0;
  var neutral = 0;
  var negative = 0;
  var total = 0;
  // create trump svg
  var draw_t = SVG('canvas_t').size('100%', canvas_height);
  socket.on('tweet_t', function(tweet){
    var y = Math.random()*(canvas_height);
    var x = Math.random()*($('.col-md-6').width());
    var red, green;
    total++;
    $('#canvas_t .total').html(total);
    // negative sentiment
    if (tweet.t_sentiment < 0) {
      red = 255;
      green = 0;
      negative ++;
      $('#canvas_t .negative').html(Math.floor(negative / total * 100) + '%');
    }
    //neutral sentiment
    else if (tweet.t_sentiment == 0) {
      red = 125;
      green = 125;
      neutral ++;
      $('#canvas_t .neutral').html(Math.floor(neutral / total * 100) + '%');
    }
    // positive sentiment
    else {
      red = 0;
      green = 255;
      positive++;
      $('#canvas_t .positive').html(Math.floor(positive / total * 100) + '%');
    }
    var use  = draw_t.circle(20).move(x,y).fill({ r: red, g: green, b: 125 });
  });
}

var hillary = function() {
  var positive = 0;
  var neutral = 0;
  var negative = 0;
  var total = 0;
  // create hillary svg
  var draw_h = SVG('canvas_h').size('100%', canvas_height);
  socket.on('tweet_h', function(tweet){
    var y = Math.random()*(canvas_height);
    var x = Math.random()*($('.col-md-6').width());
    var red, green;
    total++;
    $('#canvas_h .total').html(total);
    // negative sentiment
    if (tweet.t_sentiment < 0) {
      red = 255;
      green = 0;
      negative ++;
      $('#canvas_h .negative').html(Math.floor(negative / total * 100) + '%');
    }
    //neutral sentiment
    else if (tweet.t_sentiment == 0) {
      red = 125;
      green = 125;
      neutral ++;
      $('#canvas_h .neutral').html(Math.floor(neutral / total * 100) + '%');
    }
    // positive sentiment
    else {
      red = 0;
      green = 255;
      positive++;
      $('#canvas_h .positive').html(Math.floor(positive / total * 100) + '%');
    }
    var use  = draw_h.circle(20).move(x,y).fill({ r: red, g: green, b: 125 });
  });
}
