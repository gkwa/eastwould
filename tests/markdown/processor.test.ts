import { test, expect, describe } from "vitest"
import { readFile, readdir } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { MarkdownProcessor } from "../../src/services/markdown-processor"
import { ProcessorConfig } from "../../src/interfaces/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const FIXTURES_DIR = "__fixtures__"
const SKIP_LIST: string[] = []

// Default config used across all tests
const defaultConfig: ProcessorConfig = {
  stringifyOptions: {
    bullet: "-", 
    emphasis: "_",
    fence: "`",
    fences: true,
    incrementListMarker: true,
  },
}

interface TestCase {
  name: string
  input: string
  golden: string
  config: ProcessorConfig
}

async function getTestCases(): Promise<TestCase[]> {
  const fixturesPath = path.join(__dirname, FIXTURES_DIR)
  const files = await readdir(fixturesPath)
  
  const testCases: TestCase[] = []
  
  // Find all .md files that aren't .golden.md
  const mdFiles = files
    .filter(f => f.endsWith('.md'))
    .filter(f => !f.endsWith('.golden.md'))
    .filter(f => !SKIP_LIST.includes(f))

  for (const file of mdFiles) {
    const name = path.basename(file, '.md')
    testCases.push({
      name: name,  
      input: path.join(FIXTURES_DIR, file),
      golden: path.join(FIXTURES_DIR, `${name}.golden.md`),
      config: defaultConfig
    })
  }

  return testCases
}

describe("MarkdownProcessor", async () => {
  const testCases = await getTestCases()
  
  test.each(testCases)("$name - should match golden file", async ({ input, golden, config }) => {
    const inputContent = await readFile(path.join(__dirname, input), "utf-8")
    const processor = new MarkdownProcessor(config)
    const actualOutput = await processor.process(inputContent)
    const goldenContent = await readFile(path.join(__dirname, golden), "utf-8")
    expect(actualOutput.trim()).toBe(goldenContent.trim())
  })
})
