module.exports = function buildSidebar(planPages) {
  return planPages.map(page => ({
    text: page.title,
    link: '/' + page.slug
  }));
};
