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

  // const yTitle = svg
  //   .append("text")
  //   .attr("class", "axis y-title")
  //   .attr("x", -20)
  //   .attr("y", -10)
  //   //.style("text-anchor", "end")
  //   .text("Number of Records");
  
  let lyrics;
  let formattedLyrics = [];

  function update(data) {
    // update scales & axes
    
    // takes in lyric data 
    console.log(data);
    
    // filter lyrics by id (weird double array bug?)
    lyrics = data.filter(d => d.songid === "BOBJINGL").map(d => d.lyrics)[0];
    
    // create an object of LYRIC to VALUE for bar
    lyrics.forEach(d => {
      
      // create an object: lyric: NAME, count: count
      let lyricObj = {
        lyric: d,
        count: 1
      }
      
      
      
      
    });
    
    // scales
    
    // axes
    
    // bar
      
    
  }

  return {
    update // ES6 shorthand for "update": update
  };
}
