const
  debug = require('debug')('metalsmith-slate-transform'),
  SlateFileTransform = require('./slateFileTransform');

module.exports = function (opts) {

  return (files, metalsmith, done) => {
    setImmediate(done);

    for (let fn of Object.keys(files)) {
      if (!fn.endsWith('.html')) {
        continue;
      }

      const f = new SlateFileTransform(files[fn]);
      files[fn] = f.transform();
    }
  };

};