import * as github from '@actions/github'
import * as core from '@actions/core'
import { InputParameters } from './classes'

export async function updateTopics(patch: InputParameters): Promise<void> {
  // Extra topics
  const versionTopics = [
    ...new Set(
      patch.needsVersions.map((version) => {
        switch (version) {
          case 112:
            version = 1
            break
          case 130:
            version = 2
        }
        return `gothic${version}`
      })
    ),
  ]
  const methodsTopics = [patch.needsNinja ? ['ninja'] : [], patch.needsScripts ? ['daedalus'] : []].flat()

  // Suggested repository keywords for Gothic patches
  const suggestedTopics = ['gothic', ...versionTopics, 'modding-gothic', ...methodsTopics]

  // Combine suggested topics with existing topics
  const allTopics = [...new Set([...suggestedTopics, ...patch.topics])]

  // Update repository topics if necessary
  const topicsBefore = [...patch.topics].sort()
  const topicsAfter = [...allTopics].sort()
  if (JSON.stringify(topicsBefore) !== JSON.stringify(topicsAfter)) {
    try {
      const token = core.getInput('token', { required: true })
      const octokit = github.getOctokit(token)
      await octokit.rest.repos.replaceAllTopics({
        ...github.context.repo,
        names: allTopics,
      })
    } catch (error) {
      console.warn('Updating repository topics failed: ', error)
    }
  }
}
