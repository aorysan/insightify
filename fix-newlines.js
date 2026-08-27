const fs = require('fs');
let text = fs.readFileSync('tests/build-templates.test.js', 'utf8');

text = text.replace(/fs\.writeFileSync\(docPath, '---[\n\r]title: "KB Test"[\n\r]---[\n\r]> \*\*Source:\*\* source-001\.md[\n\r]KB Content'\);/g, 
                    "fs.writeFileSync(docPath, '---\\ntitle: \"KB Test\"\\n---\\n> **Source:** source-001.md\\nKB Content');");
text = text.replace(/fs\.writeFileSync\(combinedPath, '---[\n\r]title: "Test"[\n\r]---[\n\r]# H1 Test Page[\n\r]## H1 Test Page[\n\r]Content'\);/g, 
                    "fs.writeFileSync(combinedPath, '---\\ntitle: \"Test\"\\n---\\n# H1 Test Page\\n## H1 Test Page\\nContent');");
text = text.replace(/fs\.writeFileSync\(combinedPath, '---[\n\r]title: "Executive Summary"[\n\r]category: "product"[\n\r]---[\n\r]## Executive Summary[\n\r]Summary content here.[\n\r]## Directory Structure[\n\r]Directory content here.'\);/g, 
                    "fs.writeFileSync(combinedPath, '---\\ntitle: \"Executive Summary\"\\ncategory: \"product\"\\n---\\n## Executive Summary\\nSummary content here.\\n## Directory Structure\\nDirectory content here.');");
text = text.replace(/fs\.writeFileSync\(docPath, '---[\n\r]title: "Executive Summary"[\n\r]category: "product"[\n\r]---[\n\r]## Executive Summary[\n\r]Summary content here.[\n\r]## Directory Structure[\n\r]Directory content here.'\);/g, 
                    "fs.writeFileSync(docPath, '---\\ntitle: \"Executive Summary\"\\ncategory: \"product\"\\n---\\n## Executive Summary\\nSummary content here.\\n## Directory Structure\\nDirectory content here.');");

fs.writeFileSync('tests/build-templates.test.js', text);
