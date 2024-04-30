export interface CreateCmdConfig {
  appName: string
  remoteTemplateUrl?: string
  localTemplateType: 'default' | 'v16' | 'v18'
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
