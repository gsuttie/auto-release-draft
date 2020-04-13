import * as core from '@actions/core'
import * as event from './event'
import * as version from './version'
import * as git from './git'
import * as github from './github'

export async function run(): Promise<void> {
  try {
    // implementation

    const token = core.getInput('repo-token')
    const tag = event.getCreatedTag()

    var releaseurl = ''

    if (tag && version.isSemVer(tag)) {
      const changelog = await git.getChangesIntroducedByTag(tag)

      releaseurl = await github.createReleaseDraft(tag, token, changelog)
    }

    core.setOutput('release-url', releaseurl)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
