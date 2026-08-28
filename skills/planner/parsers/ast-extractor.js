const Parser = require('tree-sitter');

function extractAst(code, lang) {
    try {
        const parser = new Parser();
        if (lang === 'ts' || lang === 'tsx') {
            parser.setLanguage(require('tree-sitter-typescript').typescript);
        } else if (lang === 'js' || lang === 'jsx') {
            parser.setLanguage(require('tree-sitter-javascript'));
        } else if (lang === 'py') {
            parser.setLanguage(require('tree-sitter-python'));
        } else {
            return { status: 'failed' };
        }

        const tree = parser.parse(code);
        const imports = [];
        const exports = [];
        
        // Very basic manual traversal for this minimal implementation step
        const walk = (node) => {
            if (node.type === 'import_statement' || node.type === 'import_from_statement') {
                const source = node.children.find(c => c.type === 'string');
                if (source) imports.push(source.text.replace(/['"]/g, ''));
            }
            if (node.type === 'export_statement') {
                const dec = node.children.find(c => c.type === 'lexical_declaration' || c.type === 'variable_declaration');
                if (dec) {
                    const id = dec.children.find(c => c.type === 'variable_declarator');
                    if (id && id.children[0]) exports.push(id.children[0].text);
                }
            }
            node.children.forEach(walk);
        };
        walk(tree.rootNode);

        return { status: 'success', imports, exports };
    } catch (e) {
        return { status: 'failed', error: e.message };
    }
}

module.exports = { extractAst };