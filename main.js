import wordcloud from "./js/wordcloud.js";
import heatmap from "./js/heatmap.js";
import barchart from "./js/barchart.js";
import tree from "./js/tree.js";

// load two datasets externally with Promise.all

Promise.all([
  d3.json("./data/xmas_songs.json", d3.autoType),
  d3.json("./data/xmas_lyrics.json", d3.autoType)
]).then(([songs, lyrics]) => {
  
  createVis(songs, lyrics);
});

// globally define data
let songData;
let lyricData;

// globally define charts
const hm = heatmap(".heatmap");
const wc = wordcloud(".wordcloud");
const bar = barchart(".barchart");
const t = tree(".tree");

function createVis(songs, lyrics) {
  // update dataset
  songData = songs;
  lyricData = lyrics;
  
  lyricData = lyrics.filter(
    (elem, index, self) =>
      self.findIndex(t => {
        return t.artist === elem.artist && t.song === elem.song;
      }) === index
  );
  console.log(songData, lyricData);

  // create the visualizations
  hm.update(songData, [1950, 1960], lyricData);
  wc.update(lyricData);
  bar.update(lyricData);
  t.update(lyricData, "christmas");

  // update other visualizations when the heatmap is clicked
  hm.on("clicked", song => {
    // update all other vis
    // scroll to the barchart
    document.getElementById("barchart").scrollIntoView({behavior: 'smooth'});
    wc.update(lyricData, song);
    bar.update(lyricData, song);
  });
  
  wc.on("clicked", word => {
    // word is now in main! update force diagram
    document.getElementById("tree").scrollIntoView({behavior: 'smooth'});
    t.update(lyricData, word);
  })
  
  bar.on("clicked", word => {
    document.getElementById("tree").scrollIntoView();
    t.update(lyricData, word)
  });

}

// handle select bar
document.getElementById("group-by").addEventListener("change", event => {
  let years = [Number(event.target.value), Number(event.target.value) + 10];
  hm.update(songData, years, lyricData);
});
