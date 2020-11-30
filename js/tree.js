

// input: selector for a chart container e.g., ".chart"
export default function tree(data, selection) {
    var nodes = data.filter(function(d){return d.lyrics.includes(selection)});
    console.log(nodes);
    // margin convention
    var songs = nodes.map(function(d){return d.song});
    var colorScale = d3.scaleOrdinal().domain(songs).range(d3.schemePaired);

    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    const width = 650 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select(".tree").append("svg")
      .attr("viewBox", [0, 0, width, height]);

    var simulation = d3.forceSimulation(nodes)
    .force("center", d3.forceCenter(width/2, height))          
    .force("charge", d3.forceManyBody().strength(1))
    .force('collision', d3.forceCollide().radius(function(d) {
    return d.lyrics.filter(c => c === selection).length*2;}))

    var tooltip = d3.select(".tree").append("div")   
        .attr("class", "nodetip")               
        .style("opacity", 0);
    
    var count = d3.select(".tree").append("div")
        .attr("class", "freq");
    
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", function(d){return d.lyrics.filter(c => c === selection).length*2;
})
        .attr("fill", function(d){return colorScale(d.song)})
        .call(drag(simulation))
        .text(d=>d.song)
        .on("mouseover", function(d,i) {
          tooltip.transition().duration(200).style("opacity", .9);
          console.log(d);
          console.log(d.toElement.innerHTML);
          tooltip.html(d.toElement.innerHTML)
          .style("left", (d.pageX+20) + "px")     
          .style("top", (d.pageY+20) + "px");    
      })                  
      .on("mouseout", function(d) {       
          tooltip.transition().duration(500).style("opacity", 0);   
      })
      .call(freqs());
  
    function freqs(circle){
      freq.html(circle.toElement.innerHTML)
    }
  
    simulation.on("tick", () => {
    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y-300);
  }); 
  
function drag(simulation){
  
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
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