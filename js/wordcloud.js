export default function wordcloud(data){
  
  var wordScale=d3.scaleLinear().domain([0,20]).range([10,200]).clamp(true);
  
  var myWords = data.filter(data => data.song == "SILVER BELLS" && data.artist == "Bing Crosby")[0].lyrics
  myWords = myWords.map(i => i.replace("(","").replace(")",""))
  
  var array = myWords.reduce(function(p, c) {
    p[c] = (p[c] || 0) + 1;
    return p;
    }, {});
  
  var freq = Object.keys(array).map(function(key) {
   return { text: key, size: array[key] };
  });
  
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 1250 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select(".wordcloud").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  var layout = d3.layout.cloud()
    .size([width, height])
    .words(freq.map(function(d){return d}))
    .padding(10)
    .fontSize(function(freq){return wordScale((freq.size))})
    .on("end", draw);
  layout.start();
  
  var words = svg.selectAll(".cloudWords");
  var selection = words.on("click", function(d){return this.innerHTML});
  

// This function takes the output of 'layout' above and draw the words
// Better not to touch it. To change parameters, play with the 'layout' variable above
  function draw(words) {
    svg
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .attr("class", "cloudWords")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
  }
  
  return{selection}
}