$.get(
    "/fetchDB",
    function(data) {
       //alert('page content: ' + data);
       console.log(data)
       var fetched_data = data;
       var btc_object = {
        positive_percentage:[],
       };
       var eth_object = {
        positive_percentage:[],
       }

       //for BTC / it is the first item in fetched data array
       $.each(fetched_data[0].total_positive_percentage_sum, function( index, value ) {
         //alert( index + ": " + value );
          btc_object.positive_percentage.push(value/fetched_data[0].total_count[index]);
       });

        //for ETH / it is the second item in fetched data array
       $.each(fetched_data[1].total_positive_percentage_sum, function( index, value ) {
         //alert( index + ": " + value );
          eth_object.positive_percentage.push(value/fetched_data[0].total_count[index]);
       });



var difference_positive_sentiment = eth_object.positive_percentage.map(function(item, index) {
  // In this case item correspond to currentValue of array a, 
  // using index to get value from array b
  return item - btc_object.positive_percentage[index]+10;
})
console.log("difference_positive_sentiment: ",difference_positive_sentiment);


       console.log("stats_object btc ", btc_object)
       console.log("stats_object eth ", eth_object)


      var yz=[btc_object.positive_percentage,eth_object.positive_percentage]



  
var temperatures = [
  {temp: 32, month: 'January'},
  {temp: 38, month: 'February'},
  {temp: 47, month: 'March'},
  {temp: 59, month: 'April'},
  {temp: 70, month: 'May'},
  {temp: 80, month: 'June'},
  {temp: 84, month: 'July'},
  {temp: 83, month: 'Auguest'},
  {temp: 76, month: 'September'},
  {temp: 64, month: 'October'},
  {temp: 49, month: 'November'},
  {temp: 37, month: 'December'}
];
var temperatures=[3,1,2,3,4,5,6,7,15,25]
var temperatures1=[1,3,2,6,5,5,4,7,17,27]

var temperatures=btc_object.positive_percentage
var temperatures1=eth_object.positive_percentage

/*var months = temperatures.map(function(t) {
  return t.month
});*/

var hours = temperatures.map(function(v,i){
  return String(-24+i);
})

var margin = {top: 5, right: 5, bottom: 50, left: 50};
// here, we want the full chart to be 700x200, so we determine
// the width and height by subtracting the margins from those values
var fullWidth = 550;
var fullHeight = 300;
// the width and height values will be used in the ranges of our scales
var width = fullWidth - margin.right - margin.left;
var height = fullHeight - margin.top - margin.bottom;
var svg = d3.select('#canvas_b').append('svg')
  .attr('width', fullWidth)
  .attr('height', fullHeight)
  // this g is where the bar chart will be drawn
  .append('g')
    // translate it to leave room for the left and top margins
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// x value determined by month
var monthScale = d3.scaleBand()
  .domain(hours)
  .range([0, width])
  .paddingInner(0.1);

// the width of the bars is determined by the scale
var bandwidth = monthScale.bandwidth();

// y value determined by temp
var maxTemp = d3.max(temperatures, function(d) { return d; });
var maxTemp1 = d3.max(temperatures1, function(d) { return d; });
if (maxTemp<maxTemp1){maxTemp=maxTemp1}//in case if second set has higher max value
var tempScale = d3.scaleLinear()
  .domain([0, maxTemp])
  .range([height, 0])
  .nice();

var xAxis = d3.axisBottom(monthScale);
var yAxis = d3.axisLeft(tempScale);

// draw the axes
svg.append('g')
  .classed('x axis', true)
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxis);

var yAxisEle = svg.append('g')
  .classed('y axis', true)
  .call(yAxis);

// add a label to the yAxis
var yText = yAxisEle.append('text')
  .attr('transform', 'rotate(-90)translate(-' + height/2 + ',0)')
  .style('text-anchor', 'middle')
  .style('fill', 'black')
  .attr('dy', '-2.5em')
  .style('font-size', 14)
  .text('Positive Percentages');

var barHolder = svg.append('g')
  .classed('bar-holder', true);

// draw the bars
var bars = barHolder.selectAll('rect.bar')
    .data(temperatures)
  .enter().append('rect')
    .classed('bar', true)
    .attr('x', function(d, i) {
      // the x value is determined using the
      // month of the datum
      return monthScale(-24+i)
    })
    .attr('width', bandwidth)
    .attr('fill','orange')
    .attr('opacity',0.82)
    .attr('y', function(d) {
      // the y position is determined by the datum's temp
      // this value is the top edge of the rectangle
      return tempScale(d);
    })
    .attr('height', function(d) {
      // the bar's height should align it with the base of the chart (y=0)
      return height - tempScale(d);
    });



    // draw the bars
var bars1 = barHolder.selectAll('rect.bar1')
    .data(temperatures1)
  .enter().append('rect')
    .classed('bar1', true)
    .attr('x', function(d, i) {
      // the x value is determined using the
      // month of the datum
      return monthScale(-24+i)
    })
    .attr('width', bandwidth)
    .attr('fill','lightgreen')
    .attr('opacity',0.68)
    .attr('y', function(d) {
      // the y position is determined by the datum's temp
      // this value is the top edge of the rectangle
      return tempScale(d);
    })
    .attr('height', function(d) {
      // the bar's height should align it with the base of the chart (y=0)
      return height - tempScale(d);
    });


function convert() {
  // convert temperatures between celsius and fahrenheit
  var converter = isCelsius ? toFahrenheit : toCelsius;
  yText.text(isCelsius ? 'Fahrenheit' : 'Celsius')
  isCelsius = !isCelsius;
  temperatures.forEach(function(t) {
    t.temp = converter(t.temp);
  });

  // redraw the bars
  bars
    .transition()
      .duration(2500)   
      .attr('y', function(d) {
        return tempScale(d);
      })
      .attr('height', function(d) {
        return height - tempScale(d);
      })
}

function toCelsius(f) {
  return (f-32)*5/9;
}

function toFahrenheit(c) {
  return c*9/5 + 32;
}

setInterval(convert, 5000);





})



