// Riffed heavily from: https://gist.github.com/SpencerCarstens/bd5117e217efc0dffaaf

/**
 * Build Worker - From Anonymous Function Body
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
var workerURL = URL.createObjectURL( new Blob( [ '(',

  function() {

    /* Message Event */
    onmessage = function( event ) {

      // jsdom has been browserified, now usable in a web worker!
      importScripts( event.data.url + '/src/jsdom_browserify.js' );
      jsdom = require( 'jsdom_capsule' );

      var data = event.data.testData;

      jsdom.env(
        '<canvas width="960" height="500"></canvas>',
        function (err, window) {
debugger;
          //"document" isn't a member of a worker's global object, so we'll attach
          //jsdom's implementation so d3 can reference it
          self.document = window.document;
          importScripts( 'http://d3js.org/d3.v4.0.0-alpha.4.min.js' );

          var canvas = document.querySelector("canvas"),
              context = canvas.getContext("2d");

          var margin = {top: 20, right: 20, bottom: 30, left: 50},
              width = canvas.width - margin.left - margin.right,
              height = canvas.height - margin.top - margin.bottom;

          var parseTime = d3.timeParse("%d-%b-%y");

          var x = d3.scaleTime()
              .range([0, width]);

          var y = d3.scaleLinear()
              .range([height, 0]);

          var line = d3.line()
              .x(function(d) { return x(d.date); })
              .y(function(d) { return y(d.close); })
              .curve(d3.curveStep)
              .context(context);

          context.translate(margin.left, margin.top);

          d3.requestTsv("data.tsv", function(d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
            return d;
          }, function(error, data) {
            if (error) throw error;

            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain(d3.extent(data, function(d) { return d.close; }));

            xAxis();
            yAxis();

            context.beginPath();
            line(data);
            context.lineWidth = 1.5;
            context.strokeStyle = "steelblue";
            context.stroke();
          });

          function xAxis() {
            var tickCount = 10,
                tickSize = 6,
                ticks = x.ticks(tickCount),
                tickFormat = x.tickFormat();

            context.beginPath();
            ticks.forEach(function(d) {
              context.moveTo(x(d), height);
              context.lineTo(x(d), height + tickSize);
            });
            context.strokeStyle = "black";
            context.stroke();

            context.textAlign = "center";
            context.textBaseline = "top";
            ticks.forEach(function(d) {
              context.fillText(tickFormat(d), x(d), height + tickSize);
            });
          }

          function yAxis() {
            var tickCount = 10,
                tickSize = 6,
                tickPadding = 3,
                ticks = y.ticks(tickCount),
                tickFormat = y.tickFormat(tickCount);

            context.beginPath();
            ticks.forEach(function(d) {
              context.moveTo(0, y(d));
              context.lineTo(-6, y(d));
            });
            context.strokeStyle = "black";
            context.stroke();

            context.beginPath();
            context.moveTo(-tickSize, 0);
            context.lineTo(0.5, 0);
            context.lineTo(0.5, height);
            context.lineTo(-tickSize, height);
            context.strokeStyle = "black";
            context.stroke();

            context.textAlign = "right";
            context.textBaseline = "middle";
            ticks.forEach(function(d) {
              context.fillText(tickFormat(d), -tickSize - tickPadding, y(d));
            });

            context.save();
            context.rotate(-Math.PI / 2);
            context.textAlign = "right";
            context.textBaseline = "top";
            context.font = "bold 10px sans-serif";
            context.fillText("Price (US$)", -10, 10);
            context.restore();
          }

          //var svg = window.document.body.querySelector( '.chart' );
          debugger;
          postMessage(svg.outerHTML);
        });
      };

  }.toString(), ')()' ], { type: 'application/javascript' } ) ),

/* Init Worker */
worker = new Worker( workerURL );

/**
 * Main Script
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/* Listen for Worker */
worker.addEventListener( 'message', function( e ) {
  if( e.data !== undefined ) {
    var fragment = document.createRange().createContextualFragment(e.data);
    document.body.appendChild(fragment);
  }
}, false );

/* Start Worker - Pass Seed Data */
var data = [4, 8, 15, 16, 23, 42];
worker.postMessage( {
  testData: data,
  url: document.location.protocol + '//' + document.location.host
} );

/* Revoke Blob */
URL.revokeObjectURL( workerURL );
