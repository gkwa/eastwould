export interface ProcessorConfig {
  readonly stringifyOptions?: {
    bullet?: "*" | "+" | "-"
    emphasis?: "_" | "*"
    fence?: "~" | "`"
    fences?: boolean
    incrementListMarker?: boolean
  }
}
