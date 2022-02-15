var countries;
var co2emission;
var childrenborn;
var childrendeath;
var lifespan;
var income;
var year;
var year_range = { min: 1800, max: 2020 };
var svg;
var region;
var x_axis;
var y_axis;
var x_attribute;
var y_attribute;
var x_data;
var y_data;
var x_label;
var y_label;
var action_click;
var margin = { top: 20, right: 60, bottom: 60, left: 100 };

// load data
console.log("load data");
document.addEventListener("DOMContentLoaded", function () {
  Promise.all([
    d3.csv("data/countries_regions.csv"),
    d3.csv("data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv"),
    d3.csv("data/co2_emissions_tonnes_per_person.csv"),
    d3.csv("data/children_per_woman_total_fertility.csv"),
    d3.csv("data/child_mortality_0_5_year_olds_dying_per_1000_born.csv"),
    d3.csv("data/life_expectancy_years.csv"),
  ])
    .then(function (values) {
      console.log(values);
      countries = values[0];
      income = format(values[1]);
      co2emission = format(values[2]);
      childrenborn = format(values[3]);
      childrendeath = format(values[4]);
      lifespan = format(values[5]);

      drawScatterPlot();
    })
    .catch(function (error) {
      console.log(error);
    });
});

function format(data) {
  for (var i = 0; i < data.length; i++) {
    for (var j = year_range.min; j <= year_range.max; j++) {
      if (data[i][j])
        if (data[i][j].toLowerCase().includes("m")) {
          data[i][j] = parseFloat(data[i][j].split("m")[0]) * 1;
        } else if (data[i][j].toLowerCase().includes("k")) {
          data[i][j] = parseFloat(data[i][j].split("k")[0]) * 1;
        } else {
          data[i][j] = parseFloat(data[i][j]);
        }
      else {
        data[i][j] = 0;
      }
    }
  }
  return data;
}

// Draw Scatterplot

function drawScatterPlot() {
  d3.select("#scatterplot").select("svg").remove();

  var margin = { top: 30, right: 30, bottom: 100, left: 50 },
    width = 1920 - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;

  svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  region = document.getElementById("region_selector").value;
  year = document.getElementById("year").value;
  x_attribute = document.getElementById("X_attribute").value;
  y_attribute = document.getElementById("Y_attribute").value;

  if (x_attribute == "income") {
    x_data = income;
    x_label = "Income";
  } else if (x_attribute == "co2_emissions") {
    x_data = co2emission;
    x_label = "CO2 emissions per person";
  } else if (x_attribute == "children_born") {
    x_data = childrenborn;
    x_label = "Babies per woman";
  } else if (x_attribute == "children_mortality") {
    x_data = childrendeath;
    x_label = "Children mortality";
  } else if (x_attribute == "lifespan") {
    x_data = lifespan;
    x_label = "Life expectancy";
  }

  if (y_attribute == "income") {
    y_data = income;
    y_label = "Income";
  } else if (y_attribute == "co2_emissions") {
    y_data = co2emission;
    y_label = "CO2 emissions per person";
  } else if (y_attribute == "children_born") {
    y_data = childrenborn;
    y_label = "Babies per woman";
  } else if (y_attribute == "children_mortality") {
    y_data = childrendeath;
    y_label = "Children mortality";
  } else if (y_attribute == "lifespan") {
    y_data = lifespan;
    y_label = "Life expectancy";
  }

  // load the data
  x_axis = d3
    .scaleLinear()
    .domain([0, scale_lim(x_data, region)])
    .range([0, width]);
  svg
    .append("g")
    .attr("class", "X_axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x_axis));
  svg
    .append("text")
    .attr("class", "Xaxis_text")
    .style("text-anchor", "middle")
    .text(x_label)
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    );

  y_axis = d3
    .scaleLinear()
    .domain([0, scale_lim(y_data, region)])
    .range([height, 0]);
  svg.append("g").attr("class", "Y_axis").call(d3.axisLeft(y_axis));
  svg
    .append("text")
    .attr("class", "Yaxis_text")
    .style("text-anchor", "middle")
    .attr("y", -margin.left + 10)
    .attr("x", -(height / 2))
    .attr("transform", "rotate(-90)")
    .text(y_label);

  action_click = d3
    .select("body")
    .append("div")
    .style("color", "#68228B")
    .style("background", "#F5F5F5")
    .style("text-align", "center")
    .style("border", "3px solid #8860CE")
    .style("border-radius", "9px")
    .style("display", "none")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("font-size", "1.5rem")
    .text("Simple click");

  var zipped_data = datazipped(year, region, x_data, y_data);

  console.log(zipped_data);
  var data_dots = svg
    .append("g")
    .selectAll("dot")
    .attr("class", "dots")
    .data(zipped_data)
    .enter();

  data_dots
    .append("circle")
    .attr("fill", function (a) {
      return a.country_color;
    })
    .attr("cx", function (a) {
      return x_axis(a.x_attr);
    })
    .attr("cy", function (a) {
      return y_axis(a.y_attr);
    })
    .attr("class", "circles")
    .attr("r", 15)
    .style("opacity", "0.02")
    .style("stroke", "yellow");

  data_dots
    .append("text")
    .attr("class", "circle_texts")
    .attr("x", function (a) {
      return x_axis(a.x_attr) - 9;
    })
    .attr("y", function (a) {
      return y_axis(a.y_attr) + 4;
    })
    .style("opacity", "0.02")
    .text(function (a) {
      return a.country_geo;
    });

  svg
    .selectAll(".circles")
    .on("mouseover", function (a, i) {
      d3.select(this).style("stroke", "green");
      action_click.style("display", "block");
      //let text = "Country:" + i.country;
      action_click.html("Country:" + i.country);
    })
    .on("mouseout", function (a, i) {
      d3.select(this).style("stroke", "red");
      action_click.style("display", "none");
    })
    .on("mousemove", function (a, i) {
      action_click
        .style("top", a.pageY - 10 + "px")
        .style("left", a.pageX + 10 + "px");
    });

  svg.selectAll(".circles, .circle_texts").style("opacity", "0.8");
}

// Set up X-axis and Y-axis scales' limits
function scale_lim(values, region) {
  var max_value = -1;
  for (var i = 0; i < values.length; i++) {
    if (region_identifier(region, values[i]["country"]).length == 2) {
      for (var j = year_range.min; j <= year_range.max; j++) {
        if (max_value < values[i][j]) max_value = values[i][j];
      }
    }
  }
  return max_value;
}

// Assign the color scale to the country
function region_identifier(region, country) {
  var color_mapping = {
    "East Asia & Pacific": "#2acaea",
    "Europe & Central Asia": "#009999",
    "Latin America & Caribbean": "#ffa500",
    "Middle East & North Africa": "#00ff00",
    "North America": "#baa3fc",
    "South Asia": "#b4eeb4",
    "Sub-Saharan Africa": "#a75e11",
  };
  for (var i = 0; i < countries.length; i++) {
    if (
      countries[i]["name"] == country &&
      countries[i]["World bank region"] == region
    )
      return [countries[i]["geo"], color_mapping[region]];
  }
  return [];
}

// Extract country's data given year & region
function datazipped(year, region, x_data, y_data) {
  console.log(x_data);
  year = parseInt(year);
  var results = [];
  for (var i = 0; i < x_data.length; i++) {
    for (var j = 0; j < y_data.length; j++) {
      var identified_region = region_identifier(region, x_data[i]["country"]);
      // console.log(identified_region);
      if (
        x_data[i]["country"] == y_data[j]["country"] &&
        identified_region.length == 2
      ) {
        results.push({
          country: x_data[i]["country"],
          x_attr: x_data[i][year],
          y_attr: y_data[j][year],
          country_geo: identified_region[0],
          country_color: identified_region[1],
        });
      }
    }
  }
  console.log(results);
  return results;
}

// Change region
function region_change() {
  drawScatterPlot();
}

// Update Scatterplot

function new_ScatterPlot() {
  svg.selectAll(".circles, .circle_texts, .dots").remove();

  var margin = { top: 30, right: 30, bottom: 100, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  region = document.getElementById("region_selector").value;
  year = document.getElementById("year").value;
  x_attribute = document.getElementById("X_attribute").value;
  y_attribute = document.getElementById("Y_attribute").value;

  if (x_attribute == "income") {
    x_data = income;
    x_label = "Income";
  } else if (x_attribute == "co2_emissions") {
    x_data = co2emission;
    x_label = "CO2 emissions per person";
  } else if (x_attribute == "children_born") {
    x_data = childrenborn;
    x_label = "Babies per woman";
  } else if (x_attribute == "children_mortality") {
    x_data = childrendeath;
    x_label = "Children mortality";
  } else if (x_attribute == "lifespan") {
    x_data = lifespan;
    x_label = "Life expectancy";
  }

  if (y_attribute == "income") {
    y_data = income;
    y_label = "Income";
  } else if (y_attribute == "co2_emissions") {
    y_data = co2emission;
    y_label = "CO2 emissions per person";
  } else if (y_attribute == "children_born") {
    y_data = childrenborn;
    y_label = "Babies per woman";
  } else if (y_attribute == "children_mortality") {
    y_data = childrendeath;
    y_label = "Children mortality";
  } else if (y_attribute == "lifespan") {
    y_data = lifespan;
    y_label = "Life expectancy";
  }

  // load the data
  x_axis = d3
    .scaleLinear()
    .domain([0, scale_lim(x_data, region)])
    .range([0, width]);
  svg
    .append("g")
    .attr("class", "X_axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x_axis));
  svg
    .append("text")
    .attr("class", "Xaxis_text")
    .style("text-anchor", "middle")
    .text(x_label);
  //.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")

  y_axis = d3
    .scaleLinear()
    .domain([0, scale_lim(y_data, region)])
    .range([height, 0]);
  svg.append("g").attr("class", "Y_axis").call(d3.axisLeft(y_axis));
  svg
    .append("text")
    .attr("class", "Yaxis_text")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text(y_label);

  action_click = d3
    .select("body")
    .append("div")
    .style("color", "#68228B")
    .style("background", "#F5F5F5")
    .style("text-align", "center")
    .style("border", "3px solid #8860CE")
    .style("border-radius", "9px")
    .style("display", "none")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("font-size", "1.5rem")
    .text("Simple click");

  var zipped_data = datazipped(year, region, x_data, y_data);

  var data_dots = svg
    .append("g")
    .selectAll("dot")
    .attr("class", "dots")
    .data(zipped_data)
    .enter();

  data_dots
    .append("circle")
    .attr("fill", function (a) {
      return a.country_color;
    })
    .attr("cx", function (a) {
      return a.x_attr;
    })
    .attr("cy", function (a) {
      return a.y_attr;
    })
    .attr("class", "circles")
    .attr("r", 15)
    .style("opacity", "0.02")
    .style("stroke", "yellow")
    .on("mouseover", function (a, i) {
      d3.select(this).style("stroke", "green");
      action_click.style("display", "block");
      action_click.html("Country:" + i.country);
    })
    .on("mouseout", function (a, i) {
      d3.select(this).style("stroke", "red");
      action_click.style("display", "hidden");
    })
    .on("mousemove", function (a, i) {
      action_click
        .style("top", a.pageY - 10 + "px")
        .style("left", a.pageX + 10 + "px");
    });

  data_dots
    .append("text")
    .attr("class", "circle_texts")
    .attr("x", function (a) {
      return x_axis(a.x_attr) - 9;
    })
    .attr("y", function (a) {
      return y_axis(a.y_attr) + 4;
    })
    .style("opacity", "0.2")
    .text(function (a) {
      return a.country_geo;
    });

  svg.selectAll(".circles");

  svg
    .selectAll(".circles, .circle_texts")
    .style("opacity", "0.8")
    .duration(1500)
    .delay(function (a, i) {
      return i * 10;
    })
    .transition();
}

function update() {
  year = document.getElementById("year").value;
  var zipped_data = datazipped(year, region, x_data, y_data);

  svg
    .selectAll(".circles")
    .data(zipped_data)
    .transition()
    .duration(750)
    .attr("cx", function (a) {
      return x_axis(a.x_attr);
    })
    .attr("cy", function (a) {
      return y_axis(a.y_attr);
    })
    .delay(function (a, i) {
      return i * 3;
    });

  svg
    .selectAll(".circle_texts")
    .data(zipped_data)
    .transition()
    .duration(750)

    .attr("x", function (a) {
      return x_axis(a.x_attr) - 9;
    })
    .attr("y", function (a) {
      return y_axis(a.y_attr) + 4;
    })
    .text(function (a) {
      return a.country_geo;
    });
}

var flag = true;

function run() {
  if (flag) {
    flag = false;
    document.getElementById("button_run").value = "Run";
  } else {
    flag = true;
    document.getElementById("button_run").value = "Stop";
  }
  setInterval(function () {
    if (
      flag &&
      parseInt(document.getElementById("year").value) < year_range.max
    ) {
      document.getElementById("year").value =
        parseInt(document.getElementById("year").value) + 1;
      update();
    }
  }, 500);
}
