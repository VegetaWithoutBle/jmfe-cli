export interface CreateCmdConfig {
  appName: string
  remoteTemplateUrl?: string
}

export interface CreateProjectConfig {
  appPath: string
  appName: string
}
export interface CloneTemplateConfig {
  appPath: string
  localTemplatePath: string
  remoteTemplateUrl?: string
}
