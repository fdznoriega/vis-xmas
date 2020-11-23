
// input: selector for a chart container e.g., ".chart"
// this is not used in the vis. it's a template...
export default function ChartTemplate(container) {

    // margin convention
    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    const width = 650 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select(".chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // define scales
    
    // define axes
  
    
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