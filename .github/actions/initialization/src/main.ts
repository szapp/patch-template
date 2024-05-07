import * as core from '@actions/core'
import { parseInputs, parseEnv, parsePackage, checkPatchName, checkPatchDesc } from './inputs'
import * as files from './files'
import { setupIdentity, commit } from './git'
import { listNextSteps, header } from './infos'
import { AggregateError, VerboseError, InputParameters } from './classes'

export const errors: VerboseError[] = []
export const warnings: VerboseError[] = []
export const infos: VerboseError[] = []

function formatErrors(error: VerboseError): string {
  return `<table><tr><td width="2000"><sub><kbd>:x: Error</kbd></sub><h3>${error.message}</h3><i>${error.details}</i><br /></td></tr></table>`
}

function formatWarnings(warning: VerboseError): string {
  return `> [!WARNING]\n> ### ${warning.message}\n> <i>${warning.details}</i>`
}

function formatInfos(info: VerboseError, index: number): string {
  const emojiDigits = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:']
  return `<h3>${emojiDigits[index]} ${info.message}</h3>${info.details}`
}

export async function run(): Promise<void> {
  let patchName: string = ''
  try {
    // Ensure valid environment (terminate on error)
    const { templateRepo, templateRepoUrl } = parsePackage(errors)
    const envInputs = await parseEnv(templateRepo)

    // Parse inputs and aggregate errors (no errors thrown here)
    const { name, description } = envInputs
    checkPatchName(name, errors)
    checkPatchDesc(description, errors)
    const { userinputs } = parseInputs(core.getInput('parameters', { required: true }), errors)

    // Handle aggregate errors and terminate
    if (errors.length > 0) throw new AggregateError()

    // Merge all relevant patch info
    const patch = { ...userinputs, ...envInputs } as InputParameters
    patchName = patch.name

    // Create directories
    await files.createDirs(patch)

    // Create files asynchronously
    await Promise.all([
      files.writeContentSrcFiles(patch),
      files.writeInitialization(patch),
      files.writeSrcFiles(patch),
      files.writeOuFiles(patch),
      files.writeAnimFiles(patch),
      files.writeVmScript(patch),
      files.writeDotFiles(patch),
      files.writeReadme(patch, templateRepo, templateRepoUrl),
      files.writeLicense(patch),
      files.removeFiles(patch),
      setupIdentity(patch),
    ])

    // Create info for next steps
    listNextSteps(patch, infos)

    // Commit changes on new orphan branch
    await commit()
  } catch (error) {
    // Collect all errors
    if (!(error instanceof AggregateError)) {
      if (error instanceof VerboseError) errors.push(error)
      else errors.push(new VerboseError(error instanceof Error ? error.message : String(error), ''))
    }
    if (errors.length === 0)
      errors.push(
        new VerboseError(
          'An unknown error occurred',
          'This should not have happened. Please try again. If the error persists, please report it.'
        )
      )

    // Set exit code explicitly
    process.exitCode = core.ExitCode.Failure
  }

  // Format the errors into an output message for the GitHub workflow to comment
  const errorResult = errors.map(formatErrors).join('\n\n')
  const warnResult = warnings.map(formatWarnings).join('\n\n')
  const infoResult = errors.length <= 0 ? header(patchName) + infos.map(formatInfos).join('\n\n') : ''

  // Duration
  const duration = Math.round(process.uptime() * 10) / 10

  // Provide the errors and warnings as output
  core.setOutput('errors', errorResult)
  core.setOutput('warnings', warnResult)
  core.setOutput('infos', infoResult)
  core.setOutput('duration', `###### Duration: ${duration.toString()} seconds`)

  // Write the errors and warnings as workflow summary
  core.summary.addRaw(errorResult, true)
  core.summary.addRaw(warnResult, true)
  core.summary.addRaw(infoResult, true)
  core.summary.write()
}
