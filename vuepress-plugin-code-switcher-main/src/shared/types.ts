export type LanguageMapping = Record<string, string>
export type DefaultGroups = Record<string, LanguageMapping>

export type PluginOptions = {
  groups?: DefaultGroups,
  componentName?: string,
}
