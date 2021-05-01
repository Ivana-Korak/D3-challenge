// @TODO: YOUR CODE HERE!
// Set SVG parameters
var svgWidth = 1000;
var svgHeight = 500;

// Margin for SVG graphics
var margin = {
  top: 20,
  bottom: 80,
  left: 100,
  right: 40
};

var width = svgWidth - margin.left - margin.right;    // 860
var height = svgHeight - margin.top - margin.bottom;  // 400


var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("fill", "red")      // font color for labels
  .attr("class", "chart");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import data
d3.csv("assets/data/data.csv").then(function (myData) {
  console.log("myData");
  console.log(myData);

  myData.forEach(function (st_data) {
    st_data.state = st_data.state;
    st_data.abbr = st_data.abbr;
    st_data.poverty = +st_data.poverty;
    st_data.obesity = +st_data.obesity;

  });


  var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(myData, d => d.obesity + 1)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([5, d3.max(myData, d => d.poverty + 5)])
    .range([height, 0]);

  // create axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //Append to chartGroup
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

 

 
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .attr("class", "aText")
    .text("In Poverty (%)");

  console.log("y axis label")
  console.log((0 - (height / 2)), (0 - margin.left + 60))

 
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .text("Obesity (%)");

  console.log("x axis label")
  console.log((width / 2), (height + margin.top + 30))


  
  var circlesGroup = chartGroup.selectAll("null")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "20")
    .attr("fill", "blue")   // remove fill: from .stateCircle in css/d3Style.css 
    .attr("class", "stateCircle");
  // <circle cx="320.5917" cy="292.0930" r="10" fill="blue" class="stateCircle"></circle>
  

  var stateAbbr = chartGroup.selectAll(null)
    .data(myData)
    .enter().append("text");

  stateAbbr
    .attr("x", function (d) {
      return xLinearScale(d.obesity);
    })
    .attr("y", function (d) {
      return yLinearScale(d.poverty) + 2
    })
    .text(function (d) {
      return d.abbr;
    })
    .attr("class", "stateText")
    .attr("font-size", "9px");
  

 
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, 60])
    .html(function (tp) {
      var theState = "<div>" + tp.state + "</div>";
      var theX = "<div>Obesity: " + tp.obesity + "%</div>";
      var theY = "<div>Poverty: " + tp.poverty + "%</div>";
      //return (`${tp.state}`);
      return theState + theX + theY;
    });

  chartGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    //mouseout
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

}).catch(function (error) {
  console.log(error);
});