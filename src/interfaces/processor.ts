export interface IMarkdownProcessor {
  process(content: string): Promise<string>
}

export interface IFileWriter {
  write(content: string, path: string): Promise<void>
}

export interface IFileReader {
  read(path: string): Promise<string>
}
