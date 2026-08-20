function parseCode(codeString, lang) {
  const comments = [];
  // Match JSDoc /** ... */
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
  let match;
  while ((match = jsdocRegex.exec(codeString)) !== null) {
    comments.push(match[1].replace(/^\s*\* ?/gm, '').trim());
  }
  // Match Python triple quote docstrings """ ... """
  if (lang === 'py' || lang === 'python') {
    const pyRegex = /"""([\s\S]*?)"""/g;
    while ((match = pyRegex.exec(codeString)) !== null) {
      comments.push(match[1].trim());
    }
  }
  return comments.join('\n\n') || codeString;
}

module.exports = { parseCode };
