var socket = io();
var canvas_height = parseInt($('#canvas_t').innerHeight() - $('h1').outerHeight() - $('h5').outerHeight() - 40);

function Candidate(canvas, tweet) {
  var positive = 0;
  var neutral = 0;
  var negative = 0;
  var total = 0;
  // create trump svg
  var draw = SVG(canvas).size('100%', canvas_height);
  // receive tweet
  socket.on(tweet, function(tweet){
    var red, green, blue;
    total++;
    $('#' + canvas + ' .total').html(total);
    // negative sentiment
    if (tweet.t_sentiment < 0) {
      red = 200;
      green = 0;
      blue = 0;
      negative ++;
      $('#' + canvas + ' .negative').html(Math.floor(negative / total * 100) + '%');
    }
    //neutral sentiment
    else if (tweet.t_sentiment == 0) {
      red = 125;
      green = 125;
      blue = 125;
      neutral ++;
      $('#' + canvas + ' .neutral').html(Math.floor(neutral / total * 100) + '%');
    }
    // positive sentiment
    else {
      red = 0;
      green = 200;
      blue = 0;
      positive++;
      $('#' + canvas + ' .positive').html(Math.floor(positive / total * 100) + '%');
    }
    new Dot(tweet, red, green, blue, draw);
  });
}

function Dot(tweet, red, green, blue, draw) {
  var y = Math.random()*(canvas_height);
  var x = Math.random()*($('.col-md-6').width());
  var dot  = draw.circle(1).move(x,y).fill({ r: red, g: green, b: blue });
  dot.animate(300, '<', 0).scale(20)/*.after(function() {
    this.animate(7000, '>', 0).attr({fill: '#FFF'})
    .after(function() {
      this.remove();
    });
  });*/
}
