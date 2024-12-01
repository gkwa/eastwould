import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { IMarkdownProcessor } from "../interfaces/processor.js"
import { ProcessorConfig } from "../interfaces/config.js"
import natural from "natural"

export class MarkdownProcessor implements IMarkdownProcessor {
  private readonly config: ProcessorConfig
  private readonly tokenizer: natural.SentenceTokenizer

  constructor(config: ProcessorConfig = {}) {
    this.config = config
    this.tokenizer = new natural.SentenceTokenizer()
  }

  private splitIntoSentences(text: string): string {
    const sentences = this.tokenizer.tokenize(text)
    return sentences.join("\n\n")
  }

  async process(content: string): Promise<string> {
    try {
      const processor = unified()
        .use(remarkParse)
        .use(() => (tree) => {
          const visit = (node: any) => {
            if (
              node.type === "paragraph" &&
              node.children?.length === 1 &&
              node.children[0].type === "text" &&
              !node.children[0].value.includes("`") &&
              !node.children[0].value.includes("*") &&
              !node.children[0].value.includes("_")
            ) {
              const text = node.children[0].value
              node.children[0].value = this.splitIntoSentences(text)
            }
            if (node.children) {
              node.children.forEach(visit)
            }
          }
          visit(tree)
        })
        .use(remarkStringify, this.config.stringifyOptions)

      const result = await processor.process(content)
      return String(result)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process markdown: ${error.message}`)
      }
      throw new Error("An unknown error occurred while processing markdown")
    }
  }
}
