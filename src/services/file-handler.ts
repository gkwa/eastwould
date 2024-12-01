import { readFile, writeFile } from "fs/promises"
import { IFileWriter, IFileReader } from "../interfaces/processor.js"

export class FileHandler implements IFileWriter, IFileReader {
  async write(content: string, path: string): Promise<void> {
    try {
      await writeFile(path, content, "utf-8")
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to write file: ${error.message}`)
      }
      throw new Error("An unknown error occurred while writing file")
    }
  }

  async read(path: string): Promise<string> {
    try {
      return await readFile(path, "utf-8")
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read file: ${error.message}`)
      }
      throw new Error("An unknown error occurred while reading file")
    }
  }
}
