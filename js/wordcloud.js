export default function wordcloud(container) {

  // margin convention
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 700 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;
  
  // original: 700, 600

  // append the svg object to the body of the page
  var svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const listeners = { clicked: null, hovered:null };

  // scales
  var wordScale = d3
    .scaleLinear()
    .domain([0, 20])
    .range([10, 170])
    .clamp(true);

  // relevant variables
  var myWords, array, freq, layout;

  function update(data, song) {
    // if song provided, use it
    if(song) {
      myWords = data.filter(
        data => data.song === song.song && data.artist === song.artist
      )[0];
      // check if my words is null
      if(myWords) {
        myWords = myWords.lyrics;
        document.getElementById("wc-title").innerHTML = `${song.song}`;

      }
      else {
        console.log("No lyric data for that song");
        return;
      }
    }
    // use default song
    else {
      // populate the word pool
      document.getElementById("wc-title").innerHTML = `Silver Bells `;
      myWords = data.filter(
      // SILVER BELLS and BING CROSBY will be made dynamic
      data => data.song == "SILVER BELLS" && data.artist == "Bing Crosby"
    )[0].lyrics;
    }
    
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
    svg
      .selectAll(".cloudWords")
      .on("click", function(d) {
        listeners["clicked"](this.innerHTML);
        // console.log(listeners["clicked"]);
      });

  }

  // This function takes the output of 'layout' above and draw the words
  // Better not to touch it. To change parameters, play with the 'layout' variable above
  function draw(words) {
    let cloudWords = svg
      .attr("class", "cloudBox")
      .attr(
        "transform",
        "translate(" + (layout.size()[0] + 130) / 2 + "," + layout.size()[1] / 2 + ")"
      )
      .selectAll(".cloudWords")
      .data(words);

    cloudWords
      .join("text")
      .attr("class", "cloudWords")
      .style("font-size", function(d) {
        return d.size + "px";
      })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) {
        return d.text;
      })
      .on("mouseover", function(d, i){
          console.log(this);
          d3.selectAll(".cloudWords").style("opacity", "10%");
          d3.select(this).style("font-weight", "bold").style("opacity", "100%");
      })
        .on("mouseleave", function(d){
          d3.selectAll(".cloudWords").style("opacity", "100%")
          d3.select(this).style("font-weight", "normal").style("opacity", "100%");
      });
      

    cloudWords.exit().remove();
    
  }

  function on(event, listener) {
    listeners[event] = listener;
  }

  return { update, on };
}
