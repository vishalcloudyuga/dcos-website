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
const modRewrite   = require('connect-modrewrite')
const uglify       = require('metalsmith-uglify')



// --- general build settings --- //
const docsVersions = ['1.7'];

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
      sortBy: function(file, node) {
        if (file !== undefined) {
          return file.menu_order
        } else if (node.type === 'dir') {
          // for directories find the index.html and grab its menu_order
          let indexFile = node.children.find((c) => c.name == 'index.html')
          if (indexFile !== undefined) {
            return indexFile.file.menu_order || 999
          }

        } else {
          return 0;
        }

      },
      sortByNameFirst: true
    }
}

let createDocsJSON = function(obj) {
  var newObj = {
    name: obj.type,
    path: obj.path
  };

  if(obj.file) {
    newObj.file = {
      post_title: obj.file.nav_title || obj.file.post_title,
      search_blurb: obj.file.search_blurb
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
let createDocs = function(version) {
  Metalsmith(path.join(__dirname, 'dcos-docs'))
    .source(version)
    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true
    }))
    .use(nav)
    .use(layouts({
      pattern: '**/*.html',
      engine: 'jade',
      directory: path.join('..', 'layouts'),
      default: 'docs.jade'
    }))
    .use(jade({
      pretty: true
    }))
    .clean(false)
    .use(each(updatePaths))
    .destination(path.join('..', 'build', 'docs', version))
    .build((err) => {
      if (err) throw err
    })
}

let allDocs = function() {
  for (let version of docsVersions) {
    createDocs(version)
  }
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
  .use(uglify({
    // order: ['scripts/main.js', 'scripts/**/*'],
    filter: 'scripts/**/*.js',
    // concat: 'scripts/main.min.js',
    // sourceMap: !process.env.CI,
    // preserveComments: !process.env.CI,
    // removeOriginal: process.env.CI,
    // compress: process.env.CI
  }))
  .use((() => {
    if(!process.env.CI) {
      return browserSync({
        server: {
          baseDir: './build',
          middleware: [
            modRewrite([
              "^/docs/latest/(.*) /docs/" + docsVersions.slice(-1).pop() + "/$1"
            ]),
            function(req, res, next) {
              var file = `./build${req.originalUrl}.html`;
              require('fs').exists(file, function(exists) {
                if (exists) req.url += '.html';
                next();
              });
            }
          ]
        },
        files: ['./src/**/*', './dcos-docs/**/*', './layouts/**/*', './mixins/**/*']
      }, null, allDocs)
    }
  })())
  .build((err) => {
    if (err) throw err
  })

allDocs()
