// input: selector for a chart container e.g., ".chart"
// this version of heatmap follows the update pattern
export default function heatmap(container) {
  // margin convention
  const margin = { top: 50, right: 50, bottom: 100, left: 450 };
  const width = 1000 - margin.left - margin.right,
    height = 530 - margin.top - margin.bottom;

  const svg = d3
    .select(".heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "heatmapbackground")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // define scales
  let x = d3
    .scaleBand()
    .range([0, width])
    .padding([0.05]);

  let y = d3
    .scaleBand()
    .range([height, 0])
    .padding(0.05);

  let colorScheme = d3
    .scaleLinear()
    .range(["green", "white"])
    .domain([1, 100]);

  // define axes
  const xAxis = d3
    .axisBottom()
    .scale(x)
    .ticks(20);

  const yAxis = d3.axisLeft().scale(y);

  const xAxisSVG = svg
    .append("g") //x axis
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")");

  const yAxisSVG = svg
    .append("g") //y axis
    .attr("class", "axis y-axis")
    .attr("transform", "translate(" + 0 + ", 0)");

  const listeners = { clicked: null };

  // LINEAR GRADIENT
  let defs = svg.append("defs");

  // choose the direction in which to slide the gradient
  let linearGradient = defs
    .append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "0%");

  //Set the color for the start (0%)
  linearGradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "white"); //light blue

  //Set the color for the end (100%)
  linearGradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "green"); //dark blue

  // DRAW THE LEGEND
  let legendWidth = 300;
  let legendHeight = 10;

  // create a legend container
  var legendsvg = svg
    .append("g")
    .attr("class", "legendWrapper")
    .attr(
      "transform",
      "translate(" + (width / 2 - 10) + "," + (height + 50) + ")"
    );

  legendsvg
    .append("rect")
    .attr("class", "legendRect")
    .attr("x", -legendWidth / 2)
    .attr("y", 10)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#linear-gradient)");

  legendsvg
    .append("text")
    .attr("class", "legendTitle")
    .attr("x", 0)
    .attr("y", -2)
    .attr("text-anchor", "middle")
    .attr("dx", 2)
    .text("Billboard Ranking");

  // scale for legend x
  let legendX = d3
    .scaleLinear()
    .range([0, legendWidth])
    .domain([100, 0]);

  let legendXAxis = d3
    .axisBottom()
    .ticks(5)
    .scale(legendX);

  legendsvg
    .append("g")
    .attr("class", "axis") //Assign "axis" class
    .attr(
      "transform",
      "translate(" + -legendWidth / 2 + "," + (10 + legendHeight) + ")"
    )
    .call(legendXAxis);

  function update(data, range, lyrics) {
    var scope = lyrics.map(function(d){return d.song})
    let songs = []; // rows of the heatmap
    let years = []; // columns of the heatmap
    // filter the data given the range of dates
    let [low, high] = range;

    data = data.filter(d => {
      if (d.year >= low && d.year < high) {
        return d;
      } else {
        return null;
      }
    });

    // set year range
    years = d3.range(low, high, 1);

    // populate songs array, adding by uniqueness
    data.forEach(d => (!songs.includes(d.song) ? songs.push(d.song) : null));

    // update scales & axes
    x.domain(years);
    y.domain(songs);

    xAxis.scale(x);
    yAxis.scale(y);

    // ~ call ~ axes
    xAxisSVG.call(xAxis);
    yAxisSVG.call(yAxis);

    // updata data
    const squares = svg.selectAll(".squares").data(data);

    squares
      .join("rect")
      .on("click", (event, d) => clicked(d))
      .on("mouseover", (event, d) => {      
        const pos = d3.pointer(event, window);
        // show tooltip
        d3.select("#tooltip")
          .style("left", pos[0] + "px")
          .style("top", pos[1] + "px")
          .html(
            `<p>Song: ${d.song} </p>` +
              `<p>Artist: ${d.artist} </p>` +
              `<p>Rank: ${d.rank} </p>`
          );

        //Show the tooltip
        d3.select("#tooltip").classed("hidden", false);
      })
      .on("mouseout", function(d) {
        //Hide the tooltip
        d3.select("#tooltip").classed("hidden", true);
      })
      .transition()
      .duration(1000)
      .attr("class", "squares")
      .attr("x", d => x(d.year))
      .attr("y", d => y(d.song))
      // .attr("opacity", 0.1)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("stroke", "black")
      .style("fill", d => colorScheme(d.rank));
      
    // add hover effect to display interaction
    d3.selectAll("rect").on("mouseenter", function(d,i){
      if (scope.includes(i.song)){
        d3.select(this)
          .style("stroke", "red")
          .style("stroke-width", "3px")
      }
    })
      .on("mouseleave", function(d,i){
      d3.select(this).style("stroke", "black").style("stroke-width", "1px")
    });

    // exit data
    squares.exit().remove();
  }

  function on(event, listener) {
    listeners[event] = listener;
  }

  function clicked(song) {
    if (song) {
      listeners["clicked"](song);
    }
  }

  return {
    update,
    on
  };
}
