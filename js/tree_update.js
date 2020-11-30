// input: selector for a chart container e.g., ".chart"
export default function tree(container) {
  // margin

  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  // nodes and links
  var nodes, links;

  var colorScale = d3.scaleOrdinal().range(d3.schemePaired);

  // var simulation, tooltip;

  function update(data, selection) {
    nodes = data.filter(function(d) {
      return d.lyrics.includes(selection);
    });

    songs = nodes.map(function(d) {
      return d.song;
    });

    colorScale.domain(songs);

    var simulation = d3
      .forceSimulation(nodes)
      .force("center", d3.forceCenter(width / 2, height))
      .force("charge", d3.forceManyBody().strength(1))
      .force(
        "collision",
        d3.forceCollide().radius(function(d) {
          return d.lyrics.filter(c => c === selection).length * 2;
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
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", function(d) {
        return d.lyrics.filter(c => c === selection).length * 2;
      })
      .attr("fill", function(d) {
        return colorScale(d.song);
      })
      .call(drag(simulation))
      .text(d => d.song)
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

    simulation.on("tick", () => {
      node.attr("cx", d => d.x).attr("cy", d => d.y - 300);
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

  return {
    update // ES6 shorthand for "update": update
  };
}
