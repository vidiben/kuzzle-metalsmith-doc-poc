const
  metalsmith = require('metalsmith'),
  msLayouts = require('metalsmith-layouts'),
  msMarkdown = require('metalsmith-markdown'),
  msPermalinks = require('metalsmith-permalinks'),
  msRootpath = require('metalsmith-rootpath'),
  msSass = require('metalsmith-sass'),
  msSlateIncludes = require('./lib/slate-includes'),
  msSlateTransform = require('./lib/slate-transform');

metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(msRootpath())
  .use(msSass({
    sourceMap: true,
    sourceMapContents: true
  }))
  .use(msSlateIncludes())
  .use(msMarkdown())
  .use(msLayouts({
    engine: 'handlebars',
    default: 'layout.html',
    pattern: '**/*.html'
  }))
  .use(msSlateTransform())
  .build(err => {
    if (err) {
      throw err;
    }
  });