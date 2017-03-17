//Encapsulates jsdom in a require so that browserify will bundle it and its deps
//Bundling occurs with the npm script: "browserify"
//ref: https://github.com/tmpvar/jsdom/issues/1018#issuecomment-73269131
(function () {
    var jsdom = require('jsdom');
    var Canvas = require('canvas');
    module.exports = jsdom;
}());
