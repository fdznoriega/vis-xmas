

// input: selector for a chart container e.g., ".chart"
export default function tree(data, selection) {
    var nodes = data.filter(function(d){return d.lyrics.includes(selection)});
    console.log(nodes);
    // margin convention
    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    const width = 650 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select(".tree").append("svg")
      .attr("viewBox", [0, 0, width, height]);

    // define scales
    var simulation = d3.forceSimulation(nodes)
    .force("center", d3.forceCenter(width/2, height/2))          
    .force("charge", d3.forceManyBody())
    .force('collision', d3.forceCollide().radius(function(d) {
    return d.radius}))
    // define axes

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", function(d){return d.lyrics.filter(c => c === selection).length;
})
        .attr("fill", "green");	
  
   node.append("title")
      .text(d => d.song);
  
    simulation.on("tick", () => {
    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }); 
  function update(data){ 
        // update scales & axes
        
        // ~ call ~ axes

        // updata data

        // exit data
        
	}

	return {
		update // ES6 shorthand for "update": update
	};
}