var path = require('path');
var virtualize = require('../virtualize');
var fs = require('fs');
var toHTML = require('./util/toHTML');
var jsdom = require("jsdom").jsdom;

describe('marko-vdom/virtualize', () => {
    require('./util/autotest').scanDir(
        path.join(__dirname, 'autotests-virtualize'),
        function(dir, helpers, done) {
            helpers.virtualize = virtualize;

            var inputPath = path.join(dir, 'input.html');
            if (fs.existsSync(inputPath)) {
                var inputHtml = fs.readFileSync(inputPath, { encoding: 'utf8' });
                var document = jsdom('<html><body>' + inputHtml + '</body></html>');
                var domNode = document.body.firstChild;
                var vdomNode = virtualize(domNode);
                var vdomHTML = toHTML(vdomNode);
                helpers.compare(vdomHTML, { suffix: '.html', prefix: 'virtualized-' });

                var actualDOM = vdomNode.actualize(document);

                fs.writeFileSync(path.join(dir, 'actualized-expected.html'), vdomHTML, { encoding: 'utf8' });
                var actualDOMHTML = toHTML(actualDOM);
                helpers.compare(actualDOMHTML, { suffix: '.html', prefix: 'actualized-' });
            }
            done();
        }
    );
});