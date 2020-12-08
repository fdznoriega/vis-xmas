// input: selector for a chart container e.g., ".chart"
export default function tree(container) {
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  
  const svg = d3
    .select(container)
    .append("svg")
    // .attr("viewBox", [0, 0, width, height])
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "treebackground")
    .style("background","url('https://cdn.glitch.com/4c909740-f901-4301-b90e-d2fae49fd29f%2FBuffalo%20Plaid%20Christmas%20Tree.png?v=1607234003134') no-repeat ")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // nodes and links
  var nodes, songs;
  

  var colorScale = d3.scaleOrdinal().range(d3.schemePaired);
  var radScale = d3.scaleSqrt().range([40, 60]);
  const legend = d3
    .select(".treelegend")
    .append("svg")
    .attr("width", 400)
    .attr("height", 200)
    .append("g");

  function update(data, selection) {
    
   
    nodes = data.filter(function(d) {
      return d.lyrics.includes(selection);
    });

    songs = nodes.map(function(d) {
      return d.song;
    });

    colorScale.domain(songs);

    d3.selectAll(".radLegend").remove();
    d3.selectAll(".legendText").remove();
    

    var min = 100;
    //Roundabout way of finding the extent of nodes, but it works
    var max = 0;
    nodes.forEach(function(d) {
      var val = d.lyrics.filter(c => c == selection).length;
      if (val > max) {
        max = val;
      }
      if (val <= min) {
        min = val;
      }
    });

    radScale.domain([min, max]);

    var simulation = d3
      .forceSimulation(nodes)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(3))
      .force(
        "collision",
        d3.forceCollide().radius(function(d) {
          return radScale(d.lyrics.filter(c => c === selection).length);
        })
      );

    var tooltip = d3
      .select(".tree")
      .append("div")
      .attr("class", "nodetip")
      .style("opacity", 0);

    var count = d3
      .select(".tree")
      .append("div")
      .attr("class", "freq");

    var node = svg
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll(".circles")
      .data(nodes)
      .join("circle")
      .attr("class", "circles")
      .attr("r", function(d) {
        return radScale(d.lyrics.filter(c => c === selection).length);
      })
      .attr("fill", function(d) {
        return colorScale(d.song);
      })
      .attr("count", d => {
        var song = nodes.filter(x => {
          return x.song == d.song;
        });
        var freq = song[0].lyrics.filter(d => {
          return d == selection;
        }).length;
        
        return freq;
      })
      .call(drag(simulation))
      .on("mouseover", function(d, i) {
        var song = nodes.filter(x => {
          return x.song == i.song;
        });
        var freq = song[0].lyrics.filter(i => {
          return i == selection;
        }).length;
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip
          .html(
            "<b>" +
              song[0].song +
              "</b>" +
              " has the word " +
              "<b>" +
              selection +
              " " +
              freq +
              "</b>" +
              " times"
          )
          .style("left", d.pageX + 20 + "px")
          .style("top", d.pageY + 20 + "px");
      })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(500)
          .style("opacity", 0);
      });
    /*
    var radLegend = legend
      .append("g")
      .selectAll(".treelegend")
      .data([min, max])
      .join("circle")
      .attr("class", "radLegend")
      .attr("r", function(d, i) {
        return radScale(d);
      })
      .attr("cx", function(d, i) {
        return radScale(d) + 2 * i * radScale(d);
      })
      .attr("cy", function(d, i) {
        return 120;
      })
      .attr("fill", "red");

    var legendText = legend
      .append("g")
      .selectAll(".radLegend")
      .data([min, max])
      .join("text")
      .attr("x", function(d, i) {
        return radScale(d) - 10 + 2 * i * radScale(d);
      })
      .attr("y", function(d, i) {
        return 130;
      })
      .text(d => d)
      .attr("class", "legendText")
      .style("font-size", "20px")
      .style("color", "white");

    var legendTitle = legend
      .append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("class", "legendTitle")
      .text("Node Radius Legend")
      .style("font-size", "30px")
      .style("color", "white");
*/
    simulation.on("tick", () => {
      node
        .attr("cx", d => {
          if (d.x >= width - 10) {
            return d.x = width - 10;
          } else if (d.x <= 10) {
            return (d.x = 10);
          } else {
            return d.x;
          }
        })
        .attr("cy", d => {
          if (d.y >= height - 10) {
            return (d.y = height - 10);
          } else if (d.y <= 10) {
            return (d.y = 10);
          } else {
            return d.y;
          }
        })
      .call(drawLabels)
    });
  }

  function drag(simulation) {
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

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  
  // draw labels on nodes every frame
  // theoretically, we should only really call this when something "moves"
  // but theory is hard LOL
  function drawLabels(vn) {
    
    // vn is the object passed in to call()
    // we can grab the raw node data by doing the following:
    let nodes = vn._groups[0];
    
    // a scale for text. mhm. nothing strange here.
    // oh the hardcoded domain? uh..............it's efficient?
    let textScale = d3.scaleLinear().range([15, 35]).domain([1, 20]);

    let circleLabels = svg.selectAll(".circleLabels").data(nodes);
    
    circleLabels
      .join("text")
      .attr("class", "circleLabels")
      .attr("text-anchor", "middle")
      .style("font-size", d => textScale(d.attributes.count.value))
      .attr("x", d => d.cx.animVal.value)
      .attr("y", d => d.cy.animVal.value)
      .attr("dx", "-1")
      .attr("dy", "7")
      .text(d => d.attributes.count.value)
      .style("-webkit-user-select", "none") //makes it so user doesn't highlight text inside nodes, easier dragging
    
  }

  return {
    update // ES6 shorthand for "update": update
  };
}
