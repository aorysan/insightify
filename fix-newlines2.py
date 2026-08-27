import re

with open('tests/build-templates.test.js', 'r') as f:
    text = f.read()

# find all writeFileSync calls with multiline strings and replace actual newlines with \n
def replacer(match):
    return match.group(0).replace('\n', '\\n')

text = re.sub(r"fs\.writeFileSync\([^,]+,\s*'[^']*'\);", replacer, text)
text = re.sub(r"fs\.writeFileSync\([^,]+,\s*\"[^\"]*\"\);", replacer, text)

with open('tests/build-templates.test.js', 'w') as f:
    f.write(text)
