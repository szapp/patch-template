import * as core from '@actions/core'
import * as main from '../src/main'
import * as inputs from '../src/inputs'
import * as files from '../src/files'
import * as infos from '../src/infos'
import * as git from '../src/git'
import { AggregateError, VerboseError, InputParameters } from '../src/classes'

jest.mock('@actions/core')
jest.mock('../src/inputs')
jest.mock('../src/files')
jest.mock('../src/infos')
jest.mock('../src/git')

const runMock = jest.spyOn(main, 'run')

describe('run', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    while (main.errors.length > 0) main.errors.pop()
    while (main.warnings.length > 0) main.warnings.pop()
    while (main.infos.length > 0) main.infos.pop()
  })

  it('should run the main function successfully', async () => {
    const envInputs = {
      name: 'Test',
      description: 'Test description',
      url: 'https://example.com/user/repo',
      username: 'john-doe',
      usernameFull: 'John Doe',
      userEmail: 'john-doe@example.com',
    } as InputParameters
    const userInputs = {
      content: [1],
      initContent: true,
      initMenu: true,
      needsContentScripts: true,
      needsScripts: true,
      needsNinja: true,
      needsInit: true,
      ou: [] as number[],
      anim: [] as number[],
      ikarus: true,
      lego: true,
    } as InputParameters
    const patch = { ...envInputs, ...userInputs } as InputParameters
    const outputWarnings = '> [!WARNING]\n> ### Test warning\n> <i>Test details</i>'
    const outputInfos = '<h3>:one: Test info</h3>Test details'

    jest.spyOn(inputs, 'parseEnv').mockResolvedValue(envInputs)
    jest.spyOn(inputs, 'parsePackage').mockReturnValue({ templateRepo: 'repo', templateRepoUrl: 'repoUrl', licenseType: 'MIT' })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jest.spyOn(inputs, 'parseInputs').mockImplementation((_inputs, _errors) => {
      main.warnings.push(new VerboseError('Test warning', 'Test details'))
      return { userinputs: userInputs }
    })
    jest.spyOn(inputs, 'checkPatchName').mockImplementation()
    jest.spyOn(inputs, 'checkPatchDesc').mockImplementation()
    jest.spyOn(files, 'createDirs').mockResolvedValue()
    jest.spyOn(files, 'writeContentSrcFiles').mockResolvedValue()
    jest.spyOn(files, 'writeInitialization').mockResolvedValue()
    jest.spyOn(files, 'writeSrcFiles').mockResolvedValue()
    jest.spyOn(files, 'writeOuFiles').mockResolvedValue()
    jest.spyOn(files, 'writeAnimFiles').mockResolvedValue()
    jest.spyOn(files, 'writeVmScript').mockResolvedValue()
    jest.spyOn(files, 'writeReadme').mockResolvedValue()
    jest.spyOn(files, 'writeLicense').mockResolvedValue()
    jest.spyOn(files, 'removeFiles').mockResolvedValue()
    jest.spyOn(infos, 'listNextSteps').mockImplementation((_patch, infos) => {
      infos.push(new VerboseError('Test info', 'Test details'))
    })
    jest.spyOn(infos, 'header').mockReturnValue('')
    jest.spyOn(git, 'setupIdentity').mockResolvedValue()
    jest.spyOn(git, 'commit').mockResolvedValue()

    await main.run()
    expect(runMock).toHaveReturned()
    expect(inputs.parseEnv).toHaveBeenCalledTimes(1)
    expect(inputs.parseEnv).toHaveReturned()
    expect(inputs.parsePackage).toHaveBeenCalledTimes(1)
    expect(inputs.parsePackage).toHaveReturned()
    expect(inputs.parseInputs).toHaveBeenCalledTimes(1)
    expect(inputs.parseInputs).toHaveBeenCalledWith(core.getInput('inputs', { required: true }), expect.any(Array))
    expect(inputs.parseInputs).toHaveReturned()
    expect(inputs.checkPatchName).toHaveBeenCalledTimes(1)
    expect(inputs.checkPatchName).toHaveBeenCalledWith(envInputs.name, expect.any(Array))
    expect(inputs.checkPatchName).toHaveReturned()
    expect(inputs.checkPatchDesc).toHaveBeenCalledTimes(1)
    expect(inputs.checkPatchDesc).toHaveBeenCalledWith(envInputs.description, expect.any(Array))
    expect(inputs.checkPatchDesc).toHaveReturned()
    expect(files.createDirs).toHaveBeenCalledTimes(1)
    expect(files.createDirs).toHaveBeenCalledWith(patch)
    expect(files.createDirs).toHaveReturned()
    expect(files.writeContentSrcFiles).toHaveBeenCalledTimes(1)
    expect(files.writeContentSrcFiles).toHaveBeenCalledWith(patch)
    expect(files.writeContentSrcFiles).toHaveReturned()
    expect(files.writeInitialization).toHaveBeenCalledTimes(1)
    expect(files.writeInitialization).toHaveBeenCalledWith(patch)
    expect(files.writeInitialization).toHaveReturned()
    expect(files.writeSrcFiles).toHaveBeenCalledTimes(1)
    expect(files.writeSrcFiles).toHaveBeenCalledWith(patch)
    expect(files.writeSrcFiles).toHaveReturned()
    expect(files.writeOuFiles).toHaveBeenCalledTimes(1)
    expect(files.writeOuFiles).toHaveBeenCalledWith(patch)
    expect(files.writeOuFiles).toHaveReturned()
    expect(files.writeAnimFiles).toHaveBeenCalledTimes(1)
    expect(files.writeAnimFiles).toHaveBeenCalledWith(patch)
    expect(files.writeAnimFiles).toHaveReturned()
    expect(files.writeVmScript).toHaveBeenCalledTimes(1)
    expect(files.writeVmScript).toHaveBeenCalledWith(patch)
    expect(files.writeVmScript).toHaveReturned()
    expect(files.writeReadme).toHaveBeenCalledTimes(1)
    expect(files.writeReadme).toHaveBeenCalledWith(patch, 'repo', 'repoUrl')
    expect(files.writeReadme).toHaveReturned()
    expect(files.writeLicense).toHaveBeenCalledTimes(1)
    expect(files.writeLicense).toHaveBeenCalledWith(patch, 'repo', 'MIT')
    expect(files.writeLicense).toHaveReturned()
    expect(files.removeFiles).toHaveBeenCalledTimes(1)
    expect(files.removeFiles).toHaveBeenCalledWith(patch)
    expect(files.removeFiles).toHaveReturned()
    expect(git.setupIdentity).toHaveBeenCalledTimes(1)
    expect(git.setupIdentity).toHaveBeenCalledWith(patch)
    expect(git.setupIdentity).toHaveReturned()
    expect(infos.listNextSteps).toHaveBeenCalledTimes(1)
    expect(infos.listNextSteps).toHaveBeenCalledWith(patch, expect.any(Array))
    expect(infos.listNextSteps).toHaveReturned()
    expect(git.commit).toHaveBeenCalledTimes(1)
    expect(git.commit).toHaveReturned()
    expect(infos.header).toHaveBeenCalledTimes(1)
    expect(infos.header).toHaveReturned()
    expect(core.setOutput).toHaveBeenCalledTimes(4)
    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'errors', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(2, 'warnings', outputWarnings)
    expect(core.setOutput).toHaveBeenNthCalledWith(3, 'infos', outputInfos)
    expect(core.setOutput).toHaveBeenNthCalledWith(4, 'duration', expect.stringMatching(/###### Duration: [\d.]+ seconds/))
    expect(core.summary.addRaw).toHaveBeenCalledTimes(3)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(1, '', true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(2, outputWarnings, true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(3, outputInfos, true)
    expect(core.summary.write).toHaveBeenCalledTimes(1)
    expect(core.summary.write).toHaveReturned()
  })

  it('should handle errors and set the appropriate outputs (Error)', async () => {
    const error = new Error('Test error')
    const output = '<table><tr><td width="2000"><sub><kbd>:x: Error</kbd></sub><h3>Test error</h3><i></i><br /></td></tr></table>'
    jest.spyOn(inputs, 'parseEnv').mockRejectedValue(error)

    await main.run()
    expect(runMock).toHaveReturned()
    expect(inputs.parseEnv).toHaveBeenCalledTimes(1)
    expect(core.setOutput).toHaveBeenCalledTimes(4)
    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'errors', output)
    expect(core.setOutput).toHaveBeenNthCalledWith(2, 'warnings', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(3, 'infos', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(4, 'duration', expect.stringMatching(/###### Duration: [\d.]+ seconds/))
    expect(core.summary.addRaw).toHaveBeenCalledTimes(3)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(1, output, true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(2, '', true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(3, '', true)
    expect(core.summary.write).toHaveBeenCalledTimes(1)
    expect(core.summary.write).toHaveReturned()
    expect(process.exitCode).toBe(core.ExitCode.Failure)
  })

  it('should handle errors and set the appropriate outputs (VerboseError)', async () => {
    const error = new VerboseError('Test error', 'Error details')
    const output =
      '<table><tr><td width="2000"><sub><kbd>:x: Error</kbd></sub><h3>Test error</h3><i>Error details</i><br /></td></tr></table>'
    jest.spyOn(inputs, 'parseEnv').mockRejectedValue(error)

    await main.run()
    expect(runMock).toHaveReturned()
    expect(inputs.parseEnv).toHaveBeenCalledTimes(1)
    expect(core.setOutput).toHaveBeenCalledTimes(4)
    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'errors', output)
    expect(core.setOutput).toHaveBeenNthCalledWith(2, 'warnings', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(3, 'infos', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(4, 'duration', expect.stringMatching(/###### Duration: [\d.]+ seconds/))
    expect(core.summary.addRaw).toHaveBeenCalledTimes(3)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(1, output, true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(2, '', true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(3, '', true)
    expect(core.summary.write).toHaveBeenCalledTimes(1)
    expect(core.summary.write).toHaveReturned()
    expect(process.exitCode).toBe(core.ExitCode.Failure)
  })

  it('should handle errors and set the appropriate outputs (non-Error)', async () => {
    const error = 'Test error'
    const output = '<table><tr><td width="2000"><sub><kbd>:x: Error</kbd></sub><h3>Test error</h3><i></i><br /></td></tr></table>'
    jest.spyOn(inputs, 'parseEnv').mockRejectedValue(error)

    await main.run()
    expect(runMock).toHaveReturned()
    expect(inputs.parseEnv).toHaveBeenCalledTimes(1)
    expect(core.setOutput).toHaveBeenCalledTimes(4)
    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'errors', output)
    expect(core.setOutput).toHaveBeenNthCalledWith(2, 'warnings', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(3, 'infos', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(4, 'duration', expect.stringMatching(/###### Duration: [\d.]+ seconds/))
    expect(core.summary.addRaw).toHaveBeenCalledTimes(3)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(1, output, true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(2, '', true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(3, '', true)
    expect(core.summary.write).toHaveBeenCalledTimes(1)
    expect(core.summary.write).toHaveReturned()
    expect(process.exitCode).toBe(core.ExitCode.Failure)
  })

  it('should handle unexpected errors', async () => {
    const error = new AggregateError()
    const output =
      '<table><tr><td width="2000"><sub><kbd>:x: Error</kbd></sub><h3>An unknown error occurred</h3><i>This should not have happened. Please try again. If the error persists, please report it.</i><br /></td></tr></table>'
    jest.spyOn(inputs, 'parseEnv').mockRejectedValue(error)

    await main.run()
    expect(runMock).toHaveReturned()
    expect(inputs.parseEnv).toHaveBeenCalledTimes(1)
    expect(core.setOutput).toHaveBeenCalledTimes(4)
    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'errors', output)
    expect(core.setOutput).toHaveBeenNthCalledWith(2, 'warnings', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(3, 'infos', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(4, 'duration', expect.stringMatching(/###### Duration: [\d.]+ seconds/))
    expect(core.summary.addRaw).toHaveBeenCalledTimes(3)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(1, output, true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(2, '', true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(3, '', true)
    expect(core.summary.write).toHaveBeenCalledTimes(1)
    expect(core.summary.write).toHaveReturned()
    expect(process.exitCode).toBe(core.ExitCode.Failure)
  })

  it('should handle AggregateError and set the appropriate outputs', async () => {
    const output = [1, 2, 3, 4]
      .map((idx) => `<table><tr><td width="2000"><sub><kbd>:x: Error</kbd></sub><h3>Test error</h3><i>${idx}</i><br /></td></tr></table>`)
      .join('\n\n')
    jest.spyOn(inputs, 'parseEnv').mockResolvedValue({} as InputParameters)
    jest.spyOn(inputs, 'parsePackage').mockImplementation((errors) => {
      errors.push(new VerboseError('Test error', '1'))
      return { templateRepo: '', templateRepoUrl: '', licenseType: '' }
    })
    jest.spyOn(inputs, 'checkPatchName').mockImplementation((_str, errors) => {
      errors.push(new VerboseError('Test error', '2'))
    })
    jest.spyOn(inputs, 'checkPatchDesc').mockImplementation((_str, errors) => {
      errors.push(new VerboseError('Test error', '3'))
    })
    jest.spyOn(inputs, 'parseInputs').mockImplementation((_patch, errors) => {
      errors.push(new VerboseError('Test error', '4'))
      return {}
    })
    jest.spyOn(files, 'createDirs').mockResolvedValue()
    jest.spyOn(files, 'writeContentSrcFiles').mockResolvedValue()
    jest.spyOn(files, 'writeSrcFiles').mockResolvedValue()
    jest.spyOn(files, 'writeOuFiles').mockResolvedValue()
    jest.spyOn(files, 'writeAnimFiles').mockResolvedValue()
    jest.spyOn(files, 'writeVmScript').mockResolvedValue()
    jest.spyOn(files, 'writeReadme').mockResolvedValue()
    jest.spyOn(files, 'writeLicense').mockResolvedValue()
    jest.spyOn(files, 'removeFiles').mockResolvedValue()
    jest.spyOn(infos, 'listNextSteps').mockImplementation()
    jest.spyOn(infos, 'header').mockImplementation()
    jest.spyOn(git, 'setupIdentity').mockResolvedValue()
    jest.spyOn(git, 'commit').mockResolvedValue()

    await main.run()
    expect(runMock).toHaveReturned()
    expect(core.setOutput).toHaveBeenCalledTimes(4)
    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'errors', output)
    expect(core.setOutput).toHaveBeenNthCalledWith(2, 'warnings', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(3, 'infos', '')
    expect(core.setOutput).toHaveBeenNthCalledWith(4, 'duration', expect.stringMatching(/###### Duration: [\d.]+ seconds/))
    expect(core.summary.addRaw).toHaveBeenCalledTimes(3)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(1, output, true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(2, '', true)
    expect(core.summary.addRaw).toHaveBeenNthCalledWith(3, '', true)
    expect(core.summary.write).toHaveBeenCalledTimes(1)
    expect(core.summary.write).toHaveReturned()
    expect(process.exitCode).toBe(core.ExitCode.Failure)
  })
})
