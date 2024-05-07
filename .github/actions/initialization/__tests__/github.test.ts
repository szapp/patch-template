import * as core from '@actions/core'
import { InputParameters } from '../src/classes'
import { updateTopics } from '../src/github'

describe('updateTopics', () => {
  it('should update repository topics', async () => {
    const patch = {
      needsVersions: [112, 130],
      needsNinja: true,
      needsScripts: false,
      topics: ['existing-topic'],
    } as InputParameters

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      repo: {
        owner: 'user',
        repo: 'repo',
      },
    }
    const replaceAllTopics = jest.fn()
    github.getOctokit = jest.fn().mockReturnValue({
      rest: {
        repos: {
          replaceAllTopics,
        },
      },
    })
    jest.spyOn(core, 'getInput').mockReturnValue('')

    await updateTopics(patch)

    expect(replaceAllTopics).toHaveBeenCalledTimes(1)
    expect(replaceAllTopics).toHaveBeenCalledWith({
      ...github.context.repo,
      names: ['gothic', 'gothic1', 'gothic2', 'modding-gothic', 'ninja', 'existing-topic'],
    })
  })

  it('should handle errors when updating repository topics', async () => {
    const patch = {
      needsVersions: [112, 130],
      needsNinja: true,
      needsScripts: true,
      topics: ['existing-topic'],
    } as InputParameters

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      repo: {
        owner: 'user',
        repo: 'repo',
      },
    }
    github.getOctokit = jest.fn().mockReturnValue({
      rest: {
        repos: {
          replaceAllTopics: jest.fn().mockRejectedValue(new Error('Test error')),
        },
      },
    })
    jest.spyOn(core, 'getInput').mockReturnValue('')

    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation()

    await updateTopics(patch)

    expect(consoleWarnMock).toHaveBeenCalledTimes(1)
    expect(consoleWarnMock).toHaveBeenCalledWith('Updating repository topics failed: ', expect.any(Error))
  })

  it('should not update repository topics if topics are already up to date', async () => {
    const patch = {
      needsVersions: [1, 2],
      needsNinja: false,
      needsScripts: true,
      topics: ['modding-gothic', 'gothic', 'gothic1', 'gothic2', 'daedalus', 'existing-topic'],
    } as InputParameters

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      repo: {
        owner: 'user',
        repo: 'repo',
      },
    }
    const replaceAllTopics = jest.fn()
    github.getOctokit = jest.fn().mockReturnValue({
      rest: {
        repos: {
          replaceAllTopics,
        },
      },
    })
    jest.spyOn(core, 'getInput').mockReturnValue('')

    await updateTopics(patch)

    expect(replaceAllTopics).not.toHaveBeenCalled()
  })
})
