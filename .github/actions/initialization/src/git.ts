import * as exec from '@actions/exec'
import { InputParameters } from './classes'

export async function setupIdentity(patch: InputParameters): Promise<void> {
  await exec.exec('git', ['config', 'user.name', patch.username])
  await exec.exec('git', ['config', 'user.email', patch.userEmail])
}

export async function commit(): Promise<void> {
  await exec.exec('git', ['checkout', '--orphan', 'init'])
  await exec.exec('git', ['add', '.'])
  await exec.exec('git', ['commit', '-m', 'Initialize patch'])
  await exec.exec('git', ['push', 'origin', 'init:main', '-f']) // git push origin init:main -f
}
