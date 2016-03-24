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

const msmith = Metalsmith(__dirname)
  .use(markdown())
  .use(layouts({
    engine: 'jade',
    directory: 'layouts'
  }))
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
  .use(permalinks('documentation/:title'))
  .use(browserSync({
    server: './build',
    files: ['./src/**/*']
  }))
  .build((err) => {
    if (err) throw err
  })
