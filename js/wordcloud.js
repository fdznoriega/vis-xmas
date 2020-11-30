export default function wordcloud(container) {

  // margin convention
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 1250 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const listeners = { clicked: null };

  // scales
  var wordScale = d3
    .scaleLinear()
    .domain([0, 20])
    .range([10, 200])
    .clamp(true);

  // relevant variables
  var myWords, array, freq, layout;

  function update(data) {
    // populate the word pool
    myWords = data.filter(
      // SILVER BELLS and BING CROSBY will be made dynamic
      data => data.song == "SILVER BELLS" && data.artist == "Bing Crosby"
    )[0].lyrics;

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


    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    layout = d3.layout
      .cloud()
      .size([width, height])
      .words(
        freq.map(function(d) {
          return d;
        })
      )
      .padding(10)
      .fontSize(function(freq) {
        return wordScale(freq.size);
      })
      .on("end", draw);

    layout.start();

    // word selection & drawing
    var words = svg.selectAll(".cloudWords");

    var selection = words.on("click", function(d) {
      listeners["clicked"] = this.innerHTML;
      console.log(listeners["clicked"]);
    });
  }

  // This function takes the output of 'layout' above and draw the words
  // Better not to touch it. To change parameters, play with the 'layout' variable above
  function draw(words) {
    svg
      .append("g")
      .attr(
        "transform",
        "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
      )
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function(d) {
        return d.size + "px";
      })
      .attr("class", "cloudWords")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) {
        return d.text;
      });
  }

  function on(event, listener) {
    listeners[event] = listener;
  }

  return { update, on };
}
