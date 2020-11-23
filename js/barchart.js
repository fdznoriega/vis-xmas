// input: selector for a chart container e.g., ".chart"
// most popular songs per year
export default function barchart(container) {
  // margin convention
  const margin = { top: 50, right: 50, bottom: 50, left: 200 };
  const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select(".barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // define scales
  let x = d3.scaleBand().rangeRound([0, width]);
  let y = d3.scaleLinear().rangeRound([height, 0]);

  // define axes
  const xAxis = d3.axisBottom();
  const yAxis = d3.axisLeft();

  const xAxisSVG = svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`);
  const yAxisSVG = svg.append("g").attr("class", "axis y-axis");
  //axis titles
  // const xTitle = svg.append("text")
  //                     .attr("class", "axis x-axis")
  //                     .attr("transform", `translate(0, ${height})`)
  //                     .text("Year");

  const yTitle = svg
    .append("text")
    .attr("class", "axis y-title")
    .attr("x", -20)
    .attr("y", -10)
    //.style("text-anchor", "end")
    .text("Number of Records");

  function update(data) {
    // update scales & axes
    //scales
    x.domain(data.map(d => d.years));
    y.domain([0, d3.max(d => d.weeks)]);
    //axes
    xAxis.scale(x);
    yAxis.scale(y);

    // ~ call ~ axes
    xAxisSVG.call(xAxis);
    yAxisSVG.call(yAxis);

    // updata data
    const bars = svg.selectAll(".bar").data(data);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.year))
      .attr("y", d => y(Math.max(0, d.weeks))) //max weeks_on_chart per year
      .attr("width", x.bandwidth())
      .attr("height", d => Math.abs(y(d.weeks) - y(0)))
      .style("fill", "blue");

    // exit data
    bars.exit().remove();
  }

  return {
    update // ES6 shorthand for "update": update
  };
}
