import { MarkdownProcessor } from "./services/markdown-processor.js"
import { FileHandler } from "./services/file-handler.js"
import { ProcessorConfig } from "./interfaces/config.js"

export { MarkdownProcessor, FileHandler }
export type { ProcessorConfig }

async function main() {
  if (process.argv.length < 4) {
    console.error("Usage: node dist/index.js <input-file> <output-file>")
    process.exit(1)
  }

  const inputFile = process.argv[2]
  const outputFile = process.argv[3]

  try {
    const config: ProcessorConfig = {
      stringifyOptions: {
        bullet: "-",
        emphasis: "_",
        fence: "`",
        fences: true,
        incrementListMarker: true,
      },
    }

    const processor = new MarkdownProcessor(config)
    const fileHandler = new FileHandler()

    // Read input file
    const content = await fileHandler.read(inputFile)

    // Process markdown
    const result = await processor.process(content)

    // Write to output file
    await fileHandler.write(result, outputFile)

    console.log(`Successfully processed ${inputFile} to ${outputFile}`)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

// Run the example if this is the main module
if (import.meta.url === new URL(import.meta.url).href) {
  main()
}
