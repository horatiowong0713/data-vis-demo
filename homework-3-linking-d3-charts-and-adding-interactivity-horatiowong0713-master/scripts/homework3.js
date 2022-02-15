var mapSvg;

var lineSvg;
var lineWidth;
var lineHeight;
var lineInnerHeight;
var lineInnerWidth;
var lineMargin = { top: 20, right: 60, bottom: 60, left: 100 };

var mapData;
var timeData;

// This runs when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  mapSvg = d3.select("#map");
  lineSvg = d3.select("#linechart");
  lineWidth = +lineSvg.style("width").replace("px", "");
  lineHeight = +lineSvg.style("height").replace("px", "");
  lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
  lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;

  // Load both files before doing anything else
  Promise.all([
    d3.json("data/africa.geojson"),
    d3.csv("data/africa_gdp_per_capita.csv"),
  ]).then(function (values) {
    mapData = values[0];
    timeData = values[1];

    drawMap();
  });
});

// Get the min/max values for a year and return as an array
// of size=2. You shouldn't need to update this function.
function getExtentsForYear(yearData) {
  var max = Number.MIN_VALUE;
  var min = Number.MAX_VALUE;
  for (var key in yearData) {
    if (key == "Year") continue;
    let val = +yearData[key];
    if (val > max) max = val;
    if (val < min) min = val;
  }
  return [min, max];
}

// Draw the map in the #map svg
function drawMap() {
  d3.select('#wrapper').select('#map').remove();
  d3.select('#wrapper').select('#linechart').remove();
  d3.select('#wrapper').select('#hyperlink').remove();
  var mapsvg = d3.select('#wrapper')
  .append('svg')
    .attr('id', 'map');
  var linesvg = d3.select('#wrapper')
  .append('svg')
    .attr('id', 'linechart');
  var hyperlink = d3.select('#wrapper')
  .append('div')
    .attr('id', 'hyperlink')
    .text('Source: ')
  .append('a')
    .attr('href', 'https://databank.worldbank.org/source/africa-development-indicators')
    .html('The World Bank'); 
  mapSvg = d3.select('#map');
  lineSvg = d3.select('#linechart');


  // create the map projection and geoPath
  let projection = d3
    .geoMercator()
    .scale(400)
    .center(d3.geoCentroid(mapData))
    .translate([
      +mapSvg.style("width").replace("px", "") / 2,
      +mapSvg.style("height").replace("px", "") / 2.3,
    ]);
  let path = d3.geoPath().projection(projection);

  // get the selected year based on the input box's value
  var select = document.getElementById("year-input");
  var year = select.value;
  console.log(year);
  const div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("z-index", 1500)
    .style("opacity", 1)
    .style("color", "white")
    .style("position", "absolute")
    .style("text-align", "center")
    .style("width", "100px")
    .style("height", "50px")
    .style("background", "black")
    .style("font", "12px sans-serif")
    .style("padding", "2px")
    .style("border", "2px solid black");

  // get the GDP values for countries for the selected year
  let yearData = timeData.filter((d) => d.Year == year)[0];

  // get the min/max GDP values for the selected year
  let extent = getExtentsForYear(yearData);

  var colorSelect = document.getElementById("color-scale-select");
  console.log(colorSelect.value);
  // get the selected color scale based on the dropdown value
  var colorScale;
  if (colorSelect.value == "interpolateRdYlGn") {
    colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain(extent);
  } else if (colorSelect.value == "interpolateViridis") {
    colorScale = d3.scaleSequential(d3.interpolateViridis).domain(extent);
  } else {
    colorScale = d3.scaleSequential(d3.interpolateBrBG).domain(extent);
  }

  // draw the map on the #map svg
  let g = mapSvg.append("g");
  console.log(mapData);
  g.selectAll("path")
    .data(mapData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("id", (d) => {
      return d.properties.name;
    })
    .attr("class", "countrymap")
    .style("fill", (d) => {
      let val = +yearData[d.properties.name];
      if (isNaN(val)) return "white";
      return colorScale(val);
    })
    .on("mouseover", function (d, i) {
      // console.log("mouseover on " + d.properties.name);
      d3.select(this)
        .style("stroke", "Aqua")
        .style("stroke-width", "3");
      console.log(d.properties.name);
      div.transition().duration(200).style("opacity", 0.9);
      div
        .html(
          "Country:" +
            d.properties.name +
            "<br/>" +
            "GDP:" +
            yearData[d.properties.name]
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mousemove", function (d, i) {
      // console.log(d.properties.name);
      // d3.select("#" + d.properties.name).style("stroke", "red");
      // console.log("mousemove on " + d.properties.name);
      // div.transition().duration(200).style("opacity", 0.9);
      // div
      //   .html(d.properties.name + "<br/>")
      //   .style("left", d3.event.pageX + "px")
      //   .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d, i) {
      // console.log("mouseout on " + d.properties.name);
      d3.select("#" + d.properties.name)
        .style("stroke", "black")
        .style("stroke-width", "1");
      div.transition().duration(500).style("opacity", 0);
    })
    .on("click", function (d, i) {
      // console.log("clicked on " + d.properties.name);

      drawLineChart(d.properties.name);
    });

  // draw the legend
  let legend = mapSvg.append("g").attr("transform", "translate(20,500)");

  let legendData = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 8; i++) {
    legendData[i] = extent[0] + ((extent[1] - extent[0]) * i) / 7;
  }
  console.log(legendData);
  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("x", (d, i) => {
      return i * 30;
    })
    .attr("y", 0)
    .attr("width", 30)
    .attr("height", 10)
    .style("fill", (d) => {
      return colorScale(d);
    });

  legend
    .selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .style("font-size", "8")
    .attr("x", (d, i) => {
      return i * 30;
    })
    .attr("y", 20)
    .text((d) => {
      return d.toFixed(0);
    });
}

// Draw the line chart in the #linechart svg for
// the country argument (e.g., `Egypt').
function drawLineChart(country) {

  var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .attr("z-index", 1500)
  .style("opacity", 0)
  .style("color", "black")
  .style("position", "absolute")
  .style("text-align", "center")
  .style("width", "100px")
  .style("height", "50px")
  .style("background", "white")
  .style("font", "12px consolas")
  .style("padding", "2px")
  .style("border", "2px solid black");

  if(!country)
    return;
  d3.select("#linchartbase").remove();
  const margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 70,
  };
  const width = 800 - margin.left - margin.right;
  const height = 550 - margin.top - margin.bottom;

  // Parse the date / time
  const parseDate = d3.timeParse("%d-%b-%y");
  const formatTime = d3.timeFormat("%e %B");

  // Set the ranges
  var x = d3.scaleBand().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // Define the axes
  const xAxis = d3.axisBottom(x).ticks(8);
  const yAxis = d3.axisLeft(y).ticks(10);

  // Define the line
  const valueline = d3
    .line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));

  const data = timeData.map((item) => [item["Year"], item[country]]);
  // console.log(timeData);
  console.log(data);
  // Adds the svg canvas
  const svg = d3
    .select("#linechart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "linchartbase")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Get the data

  // Scale the range of the data
  x.domain(data.map((d) => d[0]));
  y.domain([0, 16000]);

  // Create the circle that travels along the curve of chart
  var bisect = d3.bisector(function(d) { return d.x; }).left;
  var focus = svg
   .append('g')
   .append('circle')
     .style("fill", "none")
     .attr("stroke", "black")
     .attr('r', 10)
     .style("opacity", 0)

  // Create the text that travels along the curve of chart
  var focusText = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")

  // Add the valueline path.
  svg
    .append("path")
    .attr("class", "line")
    .attr("d", valueline(data))
    .attr("fill", "none")
    .attr("stroke", "steelblue");

  // Create a rect on top of the svg area: this rectangle recovers mouse position
  svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width )
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);

    function mouseover() {
      focus.style("opacity", 1)
      focusText.style("opacity",1)
    }
  
    function mousemove() {
      // recover coordinate we need
      //find the projection between x to year
      var position = d3.mouse(this)[0];
      var i = parseInt((position-6)/13.647);
      selectedData = data[i]
      console.log(+selectedData[1]);
      focus
        .attr("cx", x(selectedData[0]))
        .attr("cy", y(+selectedData[1]))

      div.transition().duration(10).style("opacity", 0.9);
      div
        .html(
          "Year:" +
            selectedData[0] +
            "<br/>" +
            "GDP:" +
            selectedData[1]
        )
        .style("left", (d3.event.pageX +10) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      
      // console.log(d3.mouse(this)[0]);
      }
    function mouseout() {
      focus.style("opacity", 0);
      div.transition().duration(10).style("opacity", 0);
    }

  // Add the X Axis
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

  // Add the Y Axis
  svg.append("g").attr("class", "y axis").call(yAxis);

  // Add the text label for the y axis
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("GDP for " + country + "(based on current USD)");

  // Add the text label for the x axis
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Year");

}
