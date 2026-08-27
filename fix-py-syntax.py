import re

with open('tests/build-templates.test.js', 'r') as f:
    content = f.read()

content = content.replace("fs.writeFileSync(combinedPath, '---\ntitle:", "fs.writeFileSync(combinedPath, '---\\ntitle:")
content = content.replace("\ncategory: \"product\"\n", "\\ncategory: \"product\"\\n")
content = content.replace("\n---\n", "\\n---\\n")
content = content.replace("\n## Executive Summary\n", "\\n## Executive Summary\\n")
content = content.replace("\nSummary content here.\n", "\\nSummary content here.\\n")
content = content.replace("\n## Directory Structure\n", "\\n## Directory Structure\\n")
content = content.replace("\n# H1 Test Page\n", "\\n# H1 Test Page\\n")
content = content.replace("\n## H1 Test Page\n", "\\n## H1 Test Page\\n")
content = content.replace("\n> **Source:** source-001.md\n", "\\n> **Source:** source-001.md\\n")

with open('tests/build-templates.test.js', 'w') as f:
    f.write(content)
