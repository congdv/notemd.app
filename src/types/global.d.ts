type TreeNode = {
  name: string
  contents?: TreeNode[]
  path: string
  sha?: string
}

type GithubFormData = {
  accessToken: string
  repository: string
  saveAs: string
}
