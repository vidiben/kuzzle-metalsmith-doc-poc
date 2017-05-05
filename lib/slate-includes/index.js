const
  debug = require('debug')('metalsmith-slate-includes'),
  fs = require('fs'),
  path = require('path');

module.exports = function (opts) {
  /**
   * @param {Array} files
   * @param {Metalsmith} metalsmith
   */
  return (files, metalsmith, done) => {
    setImmediate(done);

    for (let fn of Object.keys(files)) {
      let file = files[fn];

      if (!file.includes) {
        continue;
      }

      let contents = file.contents.toString();
      for (let inc of file.includes) {
        const p = path.join(metalsmith._directory, metalsmith._source, path.dirname(fn), 'includes', `_${inc}.md`);
        contents += fs.readFileSync(p, {
          encoding: 'utf8'
        }).replace(/^---\n.*?\n---\n/m, '');
      }

      files[fn].contents = Buffer.from(contents);
    }
  };
};