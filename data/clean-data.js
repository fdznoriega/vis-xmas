
let songData, lyricData;

Promise.all([
  d3.csv(
    "https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-12-24/christmas_songs.csv",
    d3.autoType
  ),
  d3.tsv(
    "https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-12-24/christmas_lyrics.tsv",
    d3.autoType
  )
]).then(([songs, lyrics]) => {
  // data cleaning!!
  songs = songs.map(d => {
    return {
      artist: d.performer,
      song: d.song.toUpperCase(),
      songid: d.performer.substring(0, 3).toUpperCase() + d.song.substring(0, 5).toUpperCase(),
      rank: d.week_position,
      weeks: d.weeks_on_chart,
      year: d.year,
      month: d.month,
      date: new Date(d.year, d.month, d.day)
    };
  });

  // collapse lyrics into a "track_title" => "lyrics" dictionary
  let collapsedLyrics = [];

  // first, iterate through the entire lyric data set
  for (let i = 0; i < lyrics.length; i++) {
    // do we have lyrics registered for this song yet?
    if (
      !collapsedLyrics.map(d => d.track_title).includes(lyrics[i].track_title)
    ) {
      // create lyrics array
      let lyricsFromSong = [];

      for (let j = i; j < lyrics.length; j++) {
        // check if the track title has changed while iterating
        if (lyrics[j].track_title !== lyrics[i].track_title) {
          // create new object to store in songs
          let song = {
            artist: lyrics[i].artist,
            song: lyrics[i].track_title.toUpperCase(),
            songid: lyrics[i].artist.substring(0, 3).toUpperCase() + lyrics[i].track_title.substring(0, 5).toUpperCase(),
            lyrics: lyricsFromSong
          };
          // append new song to the uniqueSongs
          collapsedLyrics.push(song);
          // skip ahead because we iterated through a bunch
          i = j - 1;
          break;
        } else {
          // replace all commas with empty and make all lyrics lower case as they are secondary.
          let words = lyrics[j].lyric
            .toLowerCase()
            .replaceAll(",", "")
            .split(/\s+/);

          // append words to lyricsFromSong!
          words.forEach(d => lyricsFromSong.push(d));
        }
      }
    }
  }

  // update lyrics with better format
  lyrics = collapsedLyrics;
  
  songData = songs;
  lyricData = lyrics;

});