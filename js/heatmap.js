// input: selector for a chart container e.g., ".chart"
// this version of heatmap follows the update pattern
export default function heatmap(container) {
  // margin convention
  const margin = { top: 50, right: 50, bottom: 50, left: 450 };
  const width = 1000 - margin.left - margin.right,
    height = 530 - margin.top - margin.bottom;

  const svg = d3
    .select(".heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
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
    .range(["white", "green"])
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

  function update(data, range) {
    let songs = []; // rows of the heatmap
    let years = []; // columns of the heatmap
    // filter the data given the range of dates
    if (range) {
      
      // filter data
      let [low, high] = range;
      data = data.filter(
        d => d.date >= new Date(low, 0) && d.date <= new Date(high, 12)
      );
      
      // set year range
      years = d3.range(low, high + 1, 1);
      console.log(years);
    }
    else {
      years = d3.range("1958", "2018", 1)
    }

    // populate songs array, adding by uniqueness and date?
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
    const squares = svg.selectAll(".squares").data(data, d=>d.songid);

    squares
      .join("rect")
      .transition()
      .duration(1000)
      .attr("class", "squares")
      .attr("x", d => x(d.year))
      .attr("y", d => y(d.song))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", d => colorScheme(d.rank));

    // exit data
    squares.exit().remove();
  }

  return {
    update // ES6 shorthand for "update": update
  };
}
