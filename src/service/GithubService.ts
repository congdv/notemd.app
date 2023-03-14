import { Base64 } from 'js-base64'
import { Octokit } from 'octokit'

export class GithubService {
  username: string
  email: string
  octokit: Octokit

  constructor(accessToken: string, username: string, email: string) {
    this.username = username
    this.email = email
    this.octokit = new Octokit({ auth: accessToken })
  }

  async isCreatedRepository(repositoryName: string): Promise<boolean> {
    try {
      const response = await this.octokit.request(`GET /repos/${this.username}/${repositoryName}`)

      return true
    } catch (error) {
      return false
    }
  }

  async getExitedFilepath(repositoryName: string, filepath: string) {
    try {
      const { data } = await this.octokit.request(
        'GET /repos/{username}/{repositoryName}/contents/{filepath}',
        { username: this.username, repositoryName, filepath }
      )
      return data
    } catch (error) {
      return null
    }
  }

  async createNewRepository(repositoryName: string, visibility: string = 'private') {
    const dataRepo = {
      name: repositoryName,
      description: `Create new '${repositoryName}' repository`,
      private: true,
      visibility: visibility,
      has_issues: false,
      has_projects: false,
      has_wiki: false,
      is_template: false,
      auto_init: false,
      allow_squash_merge: false,
      allow_rebase_merge: false,
    }
    try {
      await this.octokit.request(`/user/repos`, dataRepo)
    } catch (error) {
      throw new Error('Failed to create new repository')
    }
  }

  async saveFile(repositoryName: string, fileName: string, content: string) {
    try {
      const existedFileData = await this.getExitedFilepath(repositoryName, fileName)

      let payload: any = {
        owner: this.username,
        repo: repositoryName,
        path: fileName,
        message: `Save ${fileName}`,
        content: Base64.encode(content),
        author: {
          name: this.username,
          email: this.email,
        },
      }
      if (existedFileData) {
        payload.sha = existedFileData.sha
      }

      // Create a blob
      await this.octokit.rest.repos.createOrUpdateFileContents(payload)
    } catch (error) {
      throw error
    }
  }

  async readFile(repositoryName: string, fileName: string) {
    try {
      const { data } = await this.octokit.request(
        `GET /repos/${this.username}/${repositoryName}/contents/${fileName}.txt`
      )
      const text = Base64.decode(data)
      return text
    } catch (error) {
      throw error
    }
  }

  static async authenticated(accessToken: string) {
    const octokit = new Octokit({ auth: accessToken })
    try {
      const { data } = await octokit.rest.users.getAuthenticated()
      return data
    } catch (error) {
      throw error
    }
  }
}
