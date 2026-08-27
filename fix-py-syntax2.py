import re

with open('tests/build-templates.test.js', 'r') as f:
    text = f.read()

text = text.replace("fs.writeFileSync(docPath, '---\ntitle", "fs.writeFileSync(docPath, '---\\ntitle")
text = text.replace("\ncategory: \"product\"\n", "\\ncategory: \"product\"\\n")
text = text.replace("\n---\n", "\\n---\\n")
text = text.replace("\n## Executive Summary\n", "\\n## Executive Summary\\n")
text = text.replace("\nSummary content here.\n", "\\nSummary content here.\\n")
text = text.replace("\n## Directory Structure\n", "\\n## Directory Structure\\n")
text = text.replace("\n# H1 Test Page\n", "\\n# H1 Test Page\\n")
text = text.replace("\n## H1 Test Page\n", "\\n## H1 Test Page\\n")
text = text.replace("\n> **Source:** source-001.md\n", "\\n> **Source:** source-001.md\\n")
text = text.replace("fs.writeFileSync(combinedPath, '---\ntitle", "fs.writeFileSync(combinedPath, '---\\ntitle")
text = text.replace("fs.writeFileSync(docPath, '---\ntitle: \"KB Test\"\n---\n> **Source:** source-001.md\nKB Content');", 
                    "fs.writeFileSync(docPath, '---\\ntitle: \"KB Test\"\\n---\\n> **Source:** source-001.md\\nKB Content');")

with open('tests/build-templates.test.js', 'w') as f:
    f.write(text)
