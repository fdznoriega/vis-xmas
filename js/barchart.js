// input: selector for a chart container e.g., ".chart"
// most common lyric
export default function barchart(container) {
  // margin convention
  const margin = { top: 50, right: 50, bottom: 50, left: 70 };
  const width = 680 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

  const svg = d3
    .select(".barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // define scales
  let x = d3
    .scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);
  let y = d3.scaleLinear().rangeRound([height, 0]);

  // define axes
  const xAxis = d3.axisBottom().scale(x);
  const yAxis = d3.axisLeft().scale(y);

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`);

  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", "translate(" + 0 + ", 0)");

  svg
    .append("text")
    .attr("class", "axis y-title")
    .attr("x", 30)
    .attr("y", -15)
    .style("text-anchor", "end")
    .text("Frequency");

  let formattedLyrics = [];
  var myWords, array, freq;
  let listeners = { clicked: null, hovered: null };

  function update(data, song) {
    // takes in LYRICDATA
    // if song provided, use it
    if (song) {
      myWords = data.filter(
        data => data.song === song.song && data.artist === song.artist
      )[0];
      // check if my words is null
      if (myWords) {
        myWords = myWords.lyrics;
        // update title
        document.getElementById("bar-title").innerHTML = `${song.song}`;
      } else {
        console.log("No lyric data for that song");
        return;
      }
    }
    // use default song
    else {
      // say no song found?
      document.getElementById("bar-title").innerHTML = `Silver Bells`

      // say no song found
      // populate the word pool
      myWords = data.filter(
        // SILVER BELLS and BING CROSBY will be made dynamic
        data => data.song == "SILVER BELLS" && data.artist == "Bing Crosby"
      )[0].lyrics;
    }
    
    // update header (title)
    console.log(song);

    // replace some dead words
    myWords = myWords.map(i => i.replace("(", "").replace(")", ""));

    // reduce myWords
    array = myWords.reduce(function(p, c) {
      p[c] = (p[c] || 0) + 1;
      return p;
    }, {});
    // update frequency variable
    freq = Object.keys(array).map(function(key) {
      return { text: key, size: array[key] };
    });
    console.log("frequency", freq);

    let sortedFreq = freq.sort((a, b) => b.size - a.size).slice(0,10);
    console.log("sorted", sortedFreq);
    //create bar chart using frequency (freq)
    draw(sortedFreq);
  }

  function draw(frequency) {
    // x axis => words
    x.domain(frequency.map(d => d.text));
    // y axis => frequency of words
    let freqMax = d3.max(frequency);
    let domainMax = freqMax.size;
    console.log("max", freqMax.size);
    console.log("max size", freqMax.size);

    y = d3
      .scaleLinear()
      .domain([0, domainMax])
      .range([height, 0]);

    //let color = d3.scaleLinear().domain([0,4]).range(["#2eb82e", "#0f3d0f"]);

    // update bars
    let bars = svg.selectAll("rect").data(frequency);
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .on("click", (event, d) => clicked(d))
      .on("mouseenter", (event, d) => {
        
        const pos = d3.pointer(event, window);
        // show tooltip
        d3.select("#tooltip")
          .style("left", pos[0] + "px")
          .style("top", pos[1] + "px")
          .html(
              `<p>Word: ${d.text} </p>` +
              `<p>Frequency: ${d.size} </p>`
          );

        //Show the tooltip
        d3.select("#tooltip").classed("hidden", false);
      
        //change color
        // d3.select(this).style("fill", "#36663f");
      })
      .on("mouseout", function(d) {
        //Hide the tooltip
        d3.select("#tooltip").classed("hidden", true);
      })  // tooltip here
      .merge(bars)
      .transition()
      .duration(300)
      .attr("x", d => x(d.text))
      .transition()
      .duration(300)
      .attr("y", d => y(d.size))
      .attr("height", d => height - y(d.size))
      .attr("width", x.bandwidth())
      .style("fill", "green")
      .style("stroke", "black");

    bars.exit().remove();

    // update axes and axis title
    xAxis.scale(x);
    yAxis.scale(y);

    svg
      .select(".x-axis")
      .transition()
      .duration(300)
      .call(xAxis)
      .selectAll("text");
      //.attr("transform", "translate(-14,0) rotate(-90)")
      //.attr("dx", "-38");

    svg
      .select(".y-axis")
      .transition()
      .duration(300)
      .style("opacity", 0)
      .transition()
      .duration(300)
      .style("opacity", 1)
      .call(yAxis);
    
    d3.selectAll(".bar")
      .on("mouseenter", function(d, i) {
        d3.selectAll(".bar").style("opacity", "50%");
        d3.select(this)
          .style("fill", "green")
          .style("opacity", "100%");
        {return hovered(d)}
      })
      .on("mouseleave", function(d, i) {
        d3.selectAll(".bar").style("opacity", "100%");
        d3.select(this)
          .transition()
          .duration(500)
          .style("fill", "green");
      })}
  

  function on(event, listener) {
    listeners[event] = listener;
  }

  function clicked(word) {
    if (word.text) {
      listeners["clicked"](word.text);
    }
  }
  
  function hovered(word){
    if (word.text){
      listeners["hovered"](word.text)
    }
  }

  return {
    update, on, hovered // ES6 shorthand for "update": update
  };
}
