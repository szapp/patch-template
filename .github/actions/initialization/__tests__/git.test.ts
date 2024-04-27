import * as exec from '@actions/exec'
import * as git from '../src/git'
import { InputParameters } from '../src/classes'

jest.mock('@actions/exec')

const setupIdentityMock = jest.spyOn(git, 'setupIdentity')
const commitMock = jest.spyOn(git, 'commit')

describe('git', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('setupIdentity', () => {
    it('should set git user name and email', async () => {
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
    it('should create a new branch, add files, commit, and push', async () => {
      await git.commit()
      expect(commitMock).toHaveReturned()
      expect(exec.exec).toHaveBeenNthCalledWith(1, 'git', ['checkout', '--orphan', 'init'])
      expect(exec.exec).toHaveBeenNthCalledWith(2, 'git', ['add', '.'])
      expect(exec.exec).toHaveBeenNthCalledWith(3, 'git', ['commit', '-m', 'Initialize patch'])
      expect(exec.exec).toHaveBeenNthCalledWith(4, 'git', ['push', 'origin', 'init:main', '-f'])
    })
  })
})
