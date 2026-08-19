# Insightify

Automated Documentation Website & Product Knowledge Base Generator.

Insightify is a multi-platform documentation generator plugin structured as a 6-stage sequential pipeline orchestrated by a central skill. It takes raw inputs (files, URLs, PDFs), extracts structured product knowledge, and automatically plans, writes, reviews, and builds a complete VitePress-ready documentation site.

## Architecture

The architecture uses a "Multi-Skill Pipeline with Per-Stage Folders" approach. The entry point orchestrates six independent stage skills:

1. **Stage 1 (Ingest)**: Reads inputs using parsers (`code`, `html`, `pdf`) and outputs normalized markdown.
2. **Stage 2 (Extract)**: Extracts structured product knowledge from sources into specific categories using LLM extraction schemas.
3. **Stage 3 (Plan)**: Analyzes knowledge and generates a documentation plan requiring user approval.
4. **Stage 4 (Write)**: Generates markdown documentation pages in dependency-aware waves based on the approved plan.
5. **Stage 5 (Review)**: Automatically reviews generated docs across 5 dimensions and sends targeted issues back to Stage 4 for revision if needed.
6. **Stage 6 (Build)**: Transforms markdown into a VitePress-ready site, finalizes the knowledge base, and outputs the final project configuration.

## Features

- **Multi-Source Ingestion**: Supports parsing code, HTML, and PDF files.
- **Automated Extraction**: Uses LLMs to structure knowledge from raw inputs.
- **Smart Planning**: Dependency-aware generation to write documentation systematically.
- **Self-Reviewing**: Automated quality checks to refine output iteratively.
- **VitePress Ready**: Outputs a fully functional VitePress site configuration.

## Development

- **Run unit tests**: `npm test` (Runs native Node.js test runner)
- **Install dependencies**: `npm install`

## License

MIT License
