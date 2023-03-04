export type LanguageMapping = Record<string, string>
export type DefaultGroups = [string, string[]][]

export type PluginOptions = {
  groups?: DefaultGroups,
  fullNames?: LanguageMapping,
  componentName?: string,
}
