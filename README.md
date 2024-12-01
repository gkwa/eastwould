# TypeScript Markdown Processor

A simple TypeScript implementation of a markdown processor using unified, remark, and rehype.

## Installation

```bash
pnpm install
```

## Building

```bash
pnpm build
```

## Running

```bash
pnpm start
```

## Development

To watch for changes and rebuild automatically:

```bash
pnpm dev
```

## Usage

```typescript
import { processMarkdown } from "./dist/index.js"

const markdown = "# Hello World"
const html = await processMarkdown(markdown)
console.log(html)
```
