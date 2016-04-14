'use strict';

const Metalsmith   = require('metalsmith')
const jade         = require('metalsmith-jade')
const sass         = require('metalsmith-sass')
const browserSync  = require('metalsmith-browser-sync')
const markdown     = require('metalsmith-markdown')
const layouts      = require('metalsmith-layouts')
const permalinks   = require('metalsmith-permalinks')
const babel        = require('metalsmith-babel')
const bourbon      = require('node-bourbon')
const path         = require('path')
const postcss      = require('metalsmith-postcss')
const autoprefixer = require('autoprefixer')
const copy         = require('metalsmith-copy')
const each         = require('metalsmith-each')
const navigation   = require('metalsmith-navigation')
const changed      = require('metalsmith-changed')
const lunr         = require('metalsmith-lunr')
const lunr_        = require('lunr')

// --- general build settings --- //
const docsVersion = 'latest';

const updatePaths = function(file, filename) {
  if (path.basename(filename) === "index.html" ) { return filename; }

  if (path.extname(filename) === '.html' &&
      path.extname(filename) !== '') {

    return filename.split(".html")[0] + "/index.html";
  }
  return filename;
};

// --------- figuring out the navigation ---------- //
const navConfig = {
    header: {
      includeDirs: true,
      pathProperty: 'nav_path',
      childrenProperty: 'nav_children',
      sortBy: 'menu_order'
    }
}

let createDocsJSON = function(obj) {
  var newObj = {
    name: obj.type,
    path: obj.path
  };

  if(obj.file) {
    newObj.file = {
      post_title: obj.file.post_title,
      menu_order: obj.file.menu_order,
      hide_from_navigation: obj.file.hide_from_navigation
    }
  }
  newObj.children = obj.children.map(createDocsJSON);

  return newObj;
}

const navSettings = {
  navListProperty: 'navs',
  permalinks: false,
  formatJSONfn: createDocsJSON
}

let nav = navigation(navConfig, navSettings);

// --------- Compiling the Markdown files to HTML --------//
let createDocs = function (event, file) {
  Metalsmith(path.join(__dirname, 'dcos-docs'))
    .source(docsVersion)
    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true
    }))
    .use(nav)
    .use(layouts({
      engine: 'jade',
      directory: path.join('..', 'layouts'),
      default: 'docs.jade',
    }))
    .use(jade({
      pretty: true
    }))
    .clean(false)
    .use(changed({
      extnames: {
        '.md': '.html' // build if src/file.md is newer than build/file.html
      }
    }))
    .use(each(updatePaths))
    .use(lunr({
      indexPath: 'lunr.json',
      fields: {
        contents: 1,
        tags: 10
      },
      pipelineFunctions: [
        lunr_.trimmer
      ]
    }))
    .destination(path.join('..', 'build', 'docs', docsVersion))
    .build((err) => {
      if (err) throw err
    })
}

Metalsmith(__dirname)
  .use(markdown({
    smartypants: true,
    gfm: true,
    tables: true
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
    presets: ['es2015'],
    only: './src/scripts/**'
  }))
  .use(copy({
    pattern: 'assets/*',
    directory: 'assets'
  }))
  .use(each(updatePaths))
  .clean(false)
  .use(changed())
  .use((() => {
    if(!process.env.CI) {
      return browserSync({
        server: {
          baseDir: './build',
          middleware: function(req, res, next) {
            var file = `./build${req.originalUrl}.html`;
            require('fs').exists(file, function(exists) {
              if (exists) req.url += '.html';
              next();
            });
          }
        },
        files: ['./src/**/*', './dcos-docs/**/*', './layouts/**/*', './mixins/**/*']
      }, null, createDocs);
    }
  })())
  .build((err) => {
    if (err) throw err
  })


createDocs();
