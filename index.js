'use strict';

const Metalsmith = require('metalsmith')
const jade = require('metalsmith-jade')
const sass = require('metalsmith-sass')
const browserSync = require('metalsmith-browser-sync')
const markdown = require('metalsmith-markdown')
const layouts = require('metalsmith-layouts')
const permalinks = require('metalsmith-permalinks')
const babel = require('metalsmith-babel')
const bourbon = require('node-bourbon')
const path = require('path')
const postcss = require('metalsmith-postcss')
const autoprefixer = require('autoprefixer')
const copy = require('metalsmith-copy')
const each = require('metalsmith-each')

const updatePaths = function(file, filename){
  if(filename.substr(filename.length-5, filename.length) === '.html' && filename.substr(0, 5) !== 'docs/') {
    console.log(`Change filename ${filename} to ${filename.substr(0, filename.length-5)}`);
    return filename = filename.substr(0, filename.length-5);
  }
  return filename;
};

Metalsmith(__dirname)
  .use(markdown({
    smartypants: true,
    gfm: true,
    tables: true
  }))
  // .use(layouts({
  //   engine: 'jade',
  //   directory: './layouts'
  // }))
  .use(jade({
    pretty: true
  }))
  .use(sass({
    outputStyle: 'expanded',
    includePaths: [
      '/node_modules/',
      path.join(__dirname, 'node_modules/support-for/sass')
     ].concat(bourbon.includePaths)
  }))
  .use(postcss([
    autoprefixer({ browsers: ['last 4 versions'] })
  ]))
  .use(babel({
    presets: ['es2015']
  }))
  .use(copy({
    pattern: 'assets/*',
    directory: 'assets'
  }))
  // .use(permalinks('documentation/:title'))
  .use((() => {
    if(!process.env.CI) {
      return browserSync({
        server: {
          baseDir: './build',
          middleware: function(req, res, next) {
            if (req.originalUrl.indexOf('.') === -1) {
              var file = './build' + req.originalUrl;
              require('fs').exists(file, function(exists) {
                if (exists) req.url;
                next();
              });
            } else {
              next();
            }
          }
        },
        files: ['./src/**/*']
      });
    }
  })())
  .use(each(updatePaths))
  .build((err) => {
    if (err) throw err
  })