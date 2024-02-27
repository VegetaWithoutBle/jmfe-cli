export interface CreateCmdConfig {
  projectName: string
  remoteTemplateUrl?: string
}

export interface CreateProjectConfig {
  projectPath: string
  projectName: string
}
export interface CloneTemplateConfig {
  projectPath: string
  localTemplatePath: string
  remoteTemplateUrl?: string
}
