// Hint: declare global variables here
let female_data;
let male_data;

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener("DOMContentLoaded", function () {
  // Hint: create or set your svg element inside this function

  // This will load your two CSV files and store them into two arrays.
  Promise.all([
    d3.csv("data/females_data.csv"),
    d3.csv("data/males_data.csv"),
  ]).then(function (values) {
    console.log("loaded females_data.csv and males_data.csv");
    female_data = values[0];
    male_data = values[1];
    console.log(female_data);
    console.log(male_data);
    // Hint: This is a good spot for doing data wrangling

    drawLolliPopChart();
  });
});

// Use this function to draw the lollipop chart.
function drawLolliPopChart() {
  console.log("trace:drawLollipopChart()");
  var select = document.getElementById("country_selector");
  var country = select.value;
  // append the svg object to the body of the page
  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 100, left: 30 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  d3.select("#canvas").remove();

  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("id", "canvas")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const formated_female_data = female_data.map((item) => [
    item["Year"],
    item[country],
  ]);
  const formated_male_data = male_data.map((item) => [
    item["Year"],
    item[country],
  ]);
  console.log(formated_male_data);
  console.log(formated_female_data);

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      formated_male_data.map(function (d) {
        return d[0];
      })
    )
    .padding(1);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0, 1,
      // Math.max(
      //   d3.max(formated_male_data.map((item) => item[1])),
      //   d3.max(formated_female_data.map((item) => item[1]))
      // ),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Lines
  svg
    .selectAll("maleLine")
    .data(formated_male_data)
    .enter()
    .append("line")
    .attr("x1", function (d) {
      return x(d[0]) - 5;
    })
    .attr("x2", function (d) {
      return x(d[0]) - 5;
    })
    .attr("y1", function (d) {
      return y(d[1]);
    })
    .attr("y2", y(0))
    .attr("stroke", "grey");

  svg
    .selectAll("femaleLine")
    .data(formated_female_data)
    .enter()
    .append("line")
    .attr("x1", function (d) {
      return x(d[0]) + 5;
    })
    .attr("x2", function (d) {
      return x(d[0]) + 5;
    })
    .attr("y1", function (d) {
      return y(d[1]);
    })
    .attr("y2", y(0))
    .attr("stroke", "grey");

  // Circles
  svg
    .selectAll("maleCircle")
    .data(formated_male_data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d[0]) - 5;
    })
    .attr("cy", function (d) {
      return y(d[1]);
    })
    .attr("r", "4")
    .style("fill", "#69b3a2")
    .attr("stroke", "black");

  svg
    .selectAll("femaleCircle")
    .data(formated_female_data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d[0]) + 5;
    })
    .attr("cy", function (d) {
      return y(d[1]);
    })
    .attr("r", "4")
    .style("fill", "blue")
    .attr("stroke", "black");


    // Legend
    var color = d3.scaleOrdinal()
	.domain(["Male Employment Rate","Female Employment Rate"])
	.range(["#69b3a2","blue"]);
 
    var size = 20
    svg.selectAll("legRect")
 	.data(["Female Employment Rate","Male Employment Rate"])
 	.enter()
 	.append("rect")
    	.attr("x", 100)
    	.attr("y", function(d,i){ return 100 + i*(size+5)})
    	.attr("width", size)
    	.attr("height", size)
    	.style("fill", function(d){ return color(d)})
 	.attr("transform",
          "translate(" + 600 + "," + -100 + ")");
 
     svg.selectAll("legText")
 	.data(["Female Employment Rate","Male Employment Rate"])
 	.enter()
 	.append("text")
    	.attr("x", 100 + size*1.2)
    	.attr("y", function(d,i){ return 105 + i*(size+5) + (size/2)})
    	.style("fill", function(d){ return color(d)})
    	.text(function(d){ return d})
    	.attr("text-anchor", "left")
    	.style("alignment-baseline", "middle")
 	.attr("transform",
          "translate(" + 600 + "," + -100 + ")");

}




