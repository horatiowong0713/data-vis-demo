var leftTopSvg;
var rightTopSvg;
var rightBottomSvg;
var leftBottomSvg;

var sectionWidth;
var sectionHeight;
var sectionInnerWidth;
var sectionInnerHeight;

var sectionMargin = { top: 60, right: 20, bottom: 30, left: 80 };

var oppositeData;
var supportiveData;

document.addEventListener("DOMContentLoaded", function () {
  leftTopSvg = d3.select("#left-top");
  leftBottomSvg = d3.select("#left-bottom");
  rightTopSvg = d3.select("#right-top");
  rightBottomSvg = d3.select("#right-bottom");

  sectionWidth = 530;
  sectionHeight = 250;
  sectionInnerWidth = sectionWidth - sectionMargin.left - sectionMargin.right;
  sectionInnerHeight = sectionHeight - sectionMargin.top - sectionMargin.bottom;

  Promise.all([
    d3.csv("assets/data/opposite_results.csv"),
    d3.csv("assets/data/supportive_results.csv"),
  ]).then(function (values) {
    oppositeData = values[0];
    supportiveData = values[1];
    console.log(oppositeData);
    console.log(supportiveData);
    draw();
  });
});

function draw() {
  d3.select("#left-top").remove();
  d3.select("#left-bottom").remove();
  d3.select("#right-top").remove();
  d3.select("#right-bottom").remove();

  var leftTopSvg = d3
    .select("#left-top-container")
    .append("svg")
    .attr("id", "left-top");
  var leftBottomSvg = d3
    .select("#left-bottom-container")
    .append("svg")
    .attr("id", "left-bottom");
  var rightTopSvg = d3
    .select("#right-top-container")
    .append("svg")
    .attr("id", "right-top");
  var rightBottomSvg = d3
    .select("#right-bottom-container")
    .append("svg")
    .attr("id", "right-bottom");

  var color = d3.scaleOrdinal(d3.schemeCategory10).domain(
    oppositeData.map(function (d) {
      return d.games;
    })
  );
  var leftTopX = d3
    .scaleBand()
    .range([0, sectionInnerWidth])
    .domain(
      oppositeData.map(function (d) {
        return d.games;
      })
    );

  var leftTopY = d3
    .scaleLinear()
    .range([sectionInnerHeight, 0])
    .domain([
      0,
      d3.max(
        oppositeData.map(function (d) {
          return Number(d.atheles_first_games);
        })
      ),
    ]);

  leftTopSvg
    .attr("width", sectionWidth)
    .attr("height", sectionHeight)
    .append("g")
    .attr("id", "left-top-base")
    .attr(
      "transform",
      "translate(" + sectionMargin.left + "," + sectionMargin.top + ")"
    )
    .selectAll("rect")
    .data(oppositeData)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return leftTopX(d.games);
    })
    .attr("y", function (d) {
      return leftTopY(d.atheles_first_games);
    })
    .attr("width", leftTopX.bandwidth() - 10)
    .attr("height", function (d) {
      return sectionInnerHeight - leftTopY(d.atheles_first_games);
    })
    .attr("fill", function (d) {
      return color(d.games);
    });

  d3.select("#left-top-base")
    .selectAll(".lt-notation")
    .data(oppositeData)
    .enter()
    .append("text")
    .attr("class", "lt-notation")
    .attr("x", function (d) {
      return leftTopX(d.games);
    })
    .attr("y", function (d) {
      return leftTopY(d.atheles_first_games);
    })
    .text(function (d) {
      return d.atheles_first_games;
    });

  var leftTopAxisX = d3.axisBottom(leftTopX);
  var leftTopAxisY = d3.axisLeft(leftTopY);

  leftTopSvg
    .append("g")
    .attr("id", "left-top-axis-x")
    .attr(
      "transform",
      "translate(" +
        sectionMargin.left +
        "," +
        (sectionMargin.top + sectionInnerHeight) +
        ")"
    )
    .call(leftTopAxisX.tickSize(0));

  leftTopSvg
    .append("g")
    .attr("id", "left-top-axis-y")
    .attr(
      "transform",
      "translate(" + sectionMargin.left + "," + sectionMargin.top + ")"
    )
    .call(leftTopAxisY);

  leftTopSvg
    .append("text")
    .attr("x", sectionWidth / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Number of New Atheletes Attending Games");

  var leftBottomX = d3
    .scaleLinear()
    .range([0, sectionInnerWidth])
    .domain([
      0,
      d3.max(
        oppositeData.map(function (d) {
          return Number(d.total_games_results);
        })
      ),
    ]);

  var leftBottomY = d3
    .scaleBand()
    .range([0, sectionInnerHeight])
    .domain(
      oppositeData.map(function (d) {
        return d.games;
      })
    );

  leftBottomSvg
    .attr("width", sectionWidth)
    .attr("height", sectionHeight)
    .append("g")
    .attr("id", "left-bottom-base")
    .attr(
      "transform",
      "translate(" + sectionMargin.left + "," + sectionMargin.top + ")"
    )
    .selectAll("rect")
    .data(oppositeData)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return leftBottomX(0);
    })
    .attr("y", function (d) {
      return leftBottomY(d.games);
    })
    .attr("height", leftBottomY.bandwidth() - 10)
    .attr("width", function (d) {
      return leftBottomX(d.total_games_results);
    })
    .attr("fill", function (d) {
      return color(d.games);
    });

  var leftBottomAxisX = d3.axisBottom(leftBottomX);
  var leftBottomAxisY = d3.axisLeft(leftBottomY);

  leftBottomSvg
    .append("g")
    .attr("id", "left-bottom-axis-x")
    .attr(
      "transform",
      "translate(" +
        sectionMargin.left +
        "," +
        (sectionMargin.top + sectionInnerHeight) +
        ")"
    )
    .call(leftBottomAxisX.tickSize(0));

  leftBottomSvg
    .append("g")
    .attr("id", "left-bottom-axis-y")
    .attr(
      "transform",
      "translate(" + sectionMargin.left + "," + sectionMargin.top + ")"
    )
    .call(leftBottomAxisY);

  leftBottomSvg
    .append("text")
    .attr("x", sectionWidth / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Gold Fraction");

  // using d3 to draw the grouped bar chart
  var groups = ["gold", "silver", "bronze"];
  var rightTopX = d3
    .scaleBand()
    .range([0, sectionInnerWidth])
    .domain(groups)
    .padding([0.2]);

  var rightTopY = d3
    .scaleLinear()
    .range([sectionInnerHeight, 0])
    .domain([0, 30]);

  var subGroupsX = d3
    .scaleBand()
    .range([0, rightTopX.bandwidth()])
    .domain(
      supportiveData.map(function (d) {
        return d.games;
      })
    );

  rightTopSvg
    .attr("width", sectionWidth)
    .attr("height", sectionHeight)
    .append("g")
    .attr("id", "right-top-base")
    .attr(
      "transform",
      "translate(" + sectionMargin.left + "," + sectionMargin.top + ")"
    )
    .selectAll(".rectg")
    .data(groups)
    .enter()
    .append("g")
    .attr("class", "rectg")
    .attr("transform", function (d, i) {
      return "translate(" + rightTopX(d) + ",0)";
    })
    .selectAll("rect")
    .data(function (d) {
      return supportiveData.map(function (dd) {
        // console.log(dd[d]);
        return { games: dd.games, value: dd[d] };
      });
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return subGroupsX(d.games);
    })
    .attr("y", function (d) {
      return rightTopY(d.value);
    })
    .attr("width", subGroupsX.bandwidth())
    .attr("height", function (d) {
      return sectionInnerHeight - rightTopY(d.value);
    })
    .attr("fill", function (d) {
      return color(d.games);
    });

  rightTopSvg.append("circle").attr("cx",450).attr("cy",20).attr("r", 3).style("fill", color("Tokyo2020"))
  rightTopSvg.append("circle").attr("cx",450).attr("cy",30).attr("r", 3).style("fill", color("Rio2016"))
  rightTopSvg.append("circle").attr("cx",450).attr("cy",40).attr("r", 3).style("fill", color("London2012"))
  rightTopSvg.append("circle").attr("cx",450).attr("cy",50).attr("r", 3).style("fill", color("Beijing2008"))
  rightTopSvg.append("circle").attr("cx",450).attr("cy",60).attr("r", 3).style("fill", color("Athens2004"))
  rightTopSvg.append("circle").attr("cx",450).attr("cy",70).attr("r", 3).style("fill", color("Sydney2000"))

  rightTopSvg.append("text").attr("x", 460).attr("y", 20).text("Tokyo2020").style("font-size", "8px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 460).attr("y", 30).text("Rio2016").style("font-size", "8px").attr("alignment-baseline","center")  
  rightTopSvg.append("text").attr("x", 460).attr("y", 40).text("London2012").style("font-size", "8px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 460).attr("y", 50).text("Beijing2008").style("font-size", "8px").attr("alignment-baseline","center")  
  rightTopSvg.append("text").attr("x", 460).attr("y", 60).text("Athens2004").style("font-size", "8px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 460).attr("y", 70).text("Sydney2000").style("font-size", "8px").attr("alignment-baseline","center")  
  
  rightTopSvg.append("text").attr("x", 110).attr("y", 190).text("5").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 125).attr("y", 130).text("16").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 147).attr("y", 170).text("9").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 166).attr("y", 180).text("7").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 180).attr("y", 150).text("13").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 195).attr("y", 70).text("28").style("font-size", "15px").attr("alignment-baseline","center")

  rightTopSvg.append("text").attr("x", 245).attr("y", 170).text("9").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 259).attr("y", 166).text("10").style("font-size", "15px").attr("alignment-baseline","center") 
  rightTopSvg.append("text").attr("x", 282).attr("y", 175).text("8").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 296).attr("y", 138).text("15").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 316).attr("y", 175).text("8").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 330).attr("y", 140).text("14").style("font-size", "15px").attr("alignment-baseline","center")

  rightTopSvg.append("text").attr("x", 380).attr("y", 190).text("5").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 392).attr("y", 150).text("13").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 415).attr("y", 170).text("9").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 428).attr("y", 125).text("17").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 446).attr("y", 99).text("22").style("font-size", "15px").attr("alignment-baseline","center")
  rightTopSvg.append("text").attr("x", 465).attr("y", 120).text("18").style("font-size", "15px").attr("alignment-baseline","center")

  var rightTopAxisX = d3.axisBottom(rightTopX);
  var rightTopAxisY = d3.axisLeft(rightTopY);

  rightTopSvg
    .append("g")
    .attr("id", "right-top-axis-x")
    .attr(
      "transform",
      "translate(" +
        sectionMargin.left +
        "," +
        (sectionMargin.top + sectionInnerHeight) +
        ")"
    )
    .call(rightTopAxisX.tickSize(0));

  rightTopSvg
    .append("g")
    .attr("id", "right-top-axis-y")
    .attr(
      "transform",
      "translate(" + sectionMargin.left + "," + sectionMargin.top + ")"
    )
    .call(rightTopAxisY);

  rightTopSvg
    .append("text")
    .attr("x", sectionWidth / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Number of Medals Japanese Team Received");

  var rightBottomX = d3
    .scaleBand()
    .range([0, sectionInnerWidth])
    .domain(
      supportiveData.map(function (d) {
        return d.games;
      })
    );

  var rightBottomY = d3
    .scaleLinear()
    .range([sectionInnerHeight, 0])
    .domain([
      0,
      d3.max(
        supportiveData.map(function (d) {
          return Number(d.gold_fraction);
        })
      ),
    ]);

  const valueline = d3
    .line()
    .x((d) => rightBottomX(d.games))
    .y((d) => rightBottomY(d.gold_fraction));

  rightBottomSvg
    .attr("width", sectionWidth)
    .attr("height", sectionHeight)
    .append("g")
    .attr("id", "right-bottom-base")
    .attr(
      "transform",
      "translate(" + sectionMargin.left + "," + sectionMargin.top + ")"
    )
    .selectAll("circle")
    .data(supportiveData)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return rightBottomX(d.games);
    })
    .attr("cy", function (d) {
      return rightBottomY(d.gold_fraction);
    })
    .attr("r", function (d) {
      return 5;
    })
    .attr("fill", function (d) {
      return color(d.games);
    });

  d3.select("#right-bottom-base")
    .append("path")
    .attr("class", "line")
    .attr("d", valueline(supportiveData))
    .attr("fill", "none")
    .attr("stroke", "steelblue");

  var rightBottomAxisX = d3.axisBottom(rightBottomX);
  var rightBottomAxisY = d3.axisLeft(rightBottomY);

  rightBottomSvg
    .append("g")
    .attr("id", "right-bottom-axis-x")
    .attr(
      "transform",
      "translate(" +
        sectionMargin.left +
        "," +
        (sectionMargin.top + sectionInnerHeight) +
        ")"
    )
    .call(rightBottomAxisX.tickSize(0));

  rightBottomSvg
    .append("g")
    .attr("id", "right-bottom-axis-y")
    .attr(
      "transform",
      "translate(" + sectionMargin.left + "," + sectionMargin.top + ")"
    )
    .call(rightBottomAxisY);

  rightBottomSvg
    .append("text")
    .attr("x", sectionWidth / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Gold Fraction");

  // const tooltip = d3
  //   .select("body")
  //   .append("div")
  //   .attr("class", "tooltip")
  //   .attr("z-index", 1500)
  //   .style("opacity", 1)
  //   .style("color", "white")
  //   .style("position", "absolute")
  //   .style("text-align", "center")
  //   .style("width", "100px")
  //   .style("height", "50px")
  //   .style("background", "black")
  //   .style("font", "12px sans-serif")
  //   .style("padding", "2px")
  //   .style("border", "2px solid black");
}
