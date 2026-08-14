const cheerio = require('cheerio');

function parseHtml(htmlString) {
  const $ = cheerio.load(htmlString);
  $('nav, footer, header, script, style, .ads, .sidebar').remove();
  const title = $('h1').first().text().trim() || $('title').text().trim() || 'Untitled Page';
  const bodyText = $('main, article, body').first().text().replace(/\s+/g, ' ').trim();
  return `# ${title}\n\n${bodyText}`;
}

module.exports = { parseHtml };
