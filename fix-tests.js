const fs = require('fs');
let c = fs.readFileSync('tests/build-templates.test.js', 'utf8');

// For semantic HTML elements test:
c = c.replace(/assert\.ok\(tpl\.includes\('<aside class="sidebar"'\), 'Must include aside sidebar element'\);/, 'assert.ok(tpl.includes(`class="section-indicators"`), `Must include section-indicators component`);');
c = c.replace(/assert\.ok\(tpl\.includes\('<main class="main-content">'\), 'Must include main content element'\);/, 'assert.ok(tpl.includes(`<main class="site-main">`), `Must include site-main element`);');
c = c.replace(/assert\.ok\(tpl\.includes\('<header class="page-header">'\), 'Must include page header'\);/, 'assert.ok(tpl.includes(`<header class="site-header`), `Must include site header`);');

// For CSS components test:
c = c.replace(/assert\.ok\(css\.includes\('\.sidebar'\), 'Must style \.sidebar'\);/g, 'assert.ok(css.includes(`.section-indicators`), `Must style .section-indicators`);');
c = c.replace(/assert\.ok\(css\.includes\('\.main-content'\), 'Must style \.main-content'\);/g, 'assert.ok(css.includes(`.site-main`), `Must style .site-main`);');
c = c.replace(/assert\.ok\(css\.includes\('\.page-header'\), 'Must style \.page-header'\);/g, 'assert.ok(css.includes(`.site-header`), `Must style .site-header`);');

// Also restore legacy classes test array
c = c.replace(/\['\.section-label', '\.card-grid', '\.state-machine',/, '[\'.premium-meta-header\', \'.page-header\', \'.section-label\', \'.card-grid\', \'.state-machine\',');

fs.writeFileSync('tests/build-templates.test.js', c);
