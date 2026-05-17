import * as exec from '@actions/exec'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { InputParameters } from './classes.js'
import * as git from './git.js'

vi.mock('@actions/exec')

const setupIdentityMock = vi.spyOn(git, 'setupIdentity')
const commitMock = vi.spyOn(git, 'commit')

describe('git', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setupIdentity', () => {
    test('should set git user name and email', async () => {
      const patch: InputParameters = {
        username: 'john-doe',
        userEmail: 'john.doe@example.com',
      } as InputParameters

      await git.setupIdentity(patch)
      expect(setupIdentityMock).toHaveReturned()
      expect(exec.exec).toHaveBeenNthCalledWith(1, 'git', ['config', 'user.name', patch.username])
      expect(exec.exec).toHaveBeenNthCalledWith(2, 'git', ['config', 'user.email', patch.userEmail])
    })
  })

  describe('commit', () => {
    test('should create a new branch, add files, commit, and push', async () => {
      await git.commit()
      expect(commitMock).toHaveReturned()
      expect(exec.exec).toHaveBeenNthCalledWith(1, 'git', ['checkout', '--orphan', 'init'])
      expect(exec.exec).toHaveBeenNthCalledWith(2, 'git', ['add', '.'])
      expect(exec.exec).toHaveBeenNthCalledWith(3, 'git', ['commit', '-m', 'Initialize patch'])
      expect(exec.exec).toHaveBeenNthCalledWith(4, 'git', ['push', 'origin', 'init:main', '-f'])
    })
  })
})
