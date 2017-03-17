# Description

This is a small proof on concept showing how to generate a `d3` SVG chart in a web worker and pass it back to the main UI thread to be injected into a webpage.

This PoC leverages `jsdom`'s experimental integration into the browser to generate a virtual DOM given web workers don't have direct access to the actual DOM. `d3` will happily use jsdom's document to generate an SVG chart - pertty cool!

Integrating `jsdom` into the browser with `Browserify` was discussed [here](https://github.com/tmpvar/jsdom/issues/1018#issuecomment-73269131). I also lifted code from [a gist](https://gist.github.com/SpencerCarstens/bd5117e217efc0dffaaf) that demonstrated how to generate a `d3` chart with a force layout. The chart example comes from the [d3 docs](https://bost.ocks.org/mike/bar/2/).

## Instructions

1) Clone the repo

2) run `npm install`

3) run `npm start` - This will generate a browser-compatible `jsdom` bundle, set a watch on the source files, and fire up a server on `http://localhost:8999`. This script works on Windows, you may want to execute the scripts separately on Mac/*nix machines.
