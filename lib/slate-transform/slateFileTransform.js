const
  cheerio = require('cheerio'),
  slugger = require('slugger');

class SlateFileTransform {

  constructor (file) {
    this.file = file;
    this.$ = cheerio.load(file.contents.toString());

    this.ids = new Set();
    this.toc = {};
  }

  transform () {
    this._transformHeaders();
    console.log(this.toc);

    return this.file;
  }

  _transformHeaders () {
    const
      $ = this.$,
      that = this;

    $('h1').each(function h1 (h1k, h1n) {
      const
        $h1n = $(h1n),
        h1Id = $h1n.attr('id') ? $h1n.attr('id') : slugger($h1n.text());

      that.toc[h1Id] = {};

      $h1n
        .nextUntil('h1', 'h2').each(function h2 (h2k, h2n) {
          const
            $h2n = $(h2n),
            h2Id = $h2n.attr('id') ? $h2n.attr('id') : slugger($h2n.text());
          that.toc[h1Id][h2Id] = {};

          $h2n
            .nextUntil('h2', 'h3').each(function h3 (h3k, h3n) {
              const
                $h3n = $(h3n),
                h3Id = $h3n.attr('id') ? $h3n.attr('id') : slugger($h3n.text());
              that.toc[h1Id][h2Id][h3Id] = true;

              // h3 formatting
              {
                const
                  issueTitle = `Issue related to [${$h1n.text()}/${$h2n.text()}] section`,
                  issueLink = 'https://github.com/kuzzleio/documentation/issues/new?labels=api-reference&title=' + encodeURIComponent(issueTitle);

                $h3n.replaceWith(`
                    <div class="heading">
                        <div class="left">
                            <h3 id="${[h1Id, h2Id, h3Id].join('--')}">
                                <span class="heading-title">${$h3n.text()}</span>
                                <div class="heading-links">
                                    <a target="_blank" rel="external" href="${issueLink}" title="${issueTitle}"
                                    ><i class="icon icon-github icon-small"></i>report an issue</a>
                                </div>
                            </h3>
                        </div>
                    </div>`);
              }

            });

          // h2 formatting
          {
            const
              issueTitle = `Issue related to [${$h1n.text()}/${$h2n.text()}] section`,
              issueLink = 'https://github.com/kuzzleio/documentation/issues/new?labels=api-reference&title=' + encodeURIComponent(issueTitle);

            $h2n.replaceWith(`
              <div class="heading ${h2n.className}">
                  <div class="left">
                      <h2 id="${[h1Id, h2Id].join('--')}">
                          <span class="heading-title">${$h2n.text()}</span>
                          <div class="heading-links">
                              <a target="_blank" rel="external" href="${issueLink}" title="${issueTitle}"
                              ><i class="icon icon-github icon-small"></i> report an issue</a>
                          </div>
                      </h2>
                  </div> 
              </div>`);
          }

        });

      // h1 formatting
      {
        const
          issueTitle = `Issue related to [${$h1n.text()}] section`,
          issueLink = 'https://github.com/kuzzleio/documentation/issues/new?labels=api-reference&title=' + encodeURIComponent(issueTitle);

        $h1n
          .replaceWith(`
            <div class="heading${h1k === 0 ? ' heading-first' : ''}">
                <div class="left">
                    <h1 id="${h1Id}">
                        <span class="heading-title">${$h1n.text()}</span>
                        <div class="heading-links">
                            <a target="_blank" rel="external" href="${issueLink}" title="${issueTitle}"><i class="icon icon-github"></i>report an issue</a>
                        </div>                    
                    </h1>
                </div>
            </div>`);
      }

    });

    this.file.contents = Buffer.from($.html());
  }

}

module.exports = SlateFileTransform;