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
        '<svg class="chart"></svg>',
        function (err, window) {

          //"document" isn't a member of a worker's global object, so we'll attach
          //jsdom's implementation so d3 can reference it
          self.document = window.document;
          importScripts( 'http://d3js.org/d3.v3.min.js' );

          //The following example lifted from: https://bost.ocks.org/mike/bar/2/
          var width = 420,
              barHeight = 20;

          var x = d3.scale.linear()
              .domain( [0, d3.max(data)] )
              .range( [0, width] );

          var chart = d3.select( '.chart' )
              .attr( 'width', width )
              .attr( 'height', barHeight * data.length );

          var bar = chart.selectAll( 'g' )
              .data(data)
            .enter().append( 'g' )
              .attr( 'transform', function(d, i) { return 'translate(0,' + i * barHeight + ')'; } );

          bar.append( 'rect' )
              .attr( 'width', x )
              .attr( 'height', barHeight - 1 );

          bar.append( 'text' )
              .attr( 'x', function(d) { return x(d) - 3; } )
              .attr( 'y', barHeight / 2 )
              .attr( 'dy', '.35em' )
              .text( function(d) { return d; } );

          var svg = window.document.body.querySelector( '.chart' );
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
