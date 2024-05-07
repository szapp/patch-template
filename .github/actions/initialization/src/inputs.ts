import { InputParameters, VerboseError } from './classes'
import z from 'zod'
import * as github from '@actions/github'
import * as core from '@actions/core'
import fs from 'fs'

export function parseInputs(inputs: string, errors: VerboseError[]): { userinputs?: InputParameters } {
  if (typeof inputs !== 'string')
    throw new VerboseError(
      'Missing input parameters',
      'The input parameters are missing. This should not have happened. Please try again. If the error persists, please report it.'
    )
  let json: JSON
  try {
    json = JSON.parse(inputs)
  } catch (error) {
    throw new VerboseError(
      'Invalid input parameters',
      'The input parameters could not be parsed as JSON. This should not have happened. Please try again. If the error persists, please report it.'
    )
  }
  try {
    return { userinputs: InputParameters.parse(json) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err) => errors.push(new VerboseError(`Invalid input ${err?.path.join('->')}`, err.message)))
      return {}
    }
    // Unexcepted error
    /* istanbul ignore next */
    throw error
  }
}

export async function parseEnv(templateRepo: string): Promise<{
  name: string
  description: string
  repo: string
  url: string
  topics: string[]
  username: string
  usernameFull: string
  userEmail: string
}> {
  if (typeof github?.context?.payload?.repository === 'undefined')
    throw new VerboseError(
      'Repository context not available',
      'Basic information about the repository could not be accessed. Please try again later'
    )
  const { name: patchName, description, html_url: url } = github.context.payload.repository
  const repo = (url as string)
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
    .match(/(?<=\/)[^/]+\/[^/]+$/)?.[0]
  if (typeof patchName !== 'string' || typeof description !== 'string' || typeof url !== 'string' || typeof repo !== 'string')
    throw new VerboseError(
      'Repository information not available',
      'Basic information about the repository is invalid. Please try again later'
    )

  let octokit: ReturnType<typeof github.getOctokit>
  try {
    const token = core.getInput('token', { required: true })
    octokit = github.getOctokit(token)
  } catch (error) {
    throw new VerboseError(
      'GitHub API token not available',
      'The GitHub API token is required to access the repository information. Please try again later'
    )
  }

  const { GITHUB_TRIGGERING_ACTOR: triggeringActor } = process.env
  const username = String(triggeringActor ? triggeringActor : github.context.actor)
  const { data } = await octokit.rest.users.getByUsername({ username })
  const usernameFull = data?.name ?? username
  const actorId = data?.id ?? ''
  const userEmail = `${actorId ? actorId + '+' : ''}${username}@users.noreply.github.com`

  // Check if repository is generated template from source
  const {
    data: { private: is_private, fork, is_template, template_repository, topics },
  } = await octokit.rest.repos.get(github.context.repo)
  if (fork) {
    // Must not be a fork
    throw new VerboseError(
      'Repository must not be a fork',
      `The repository must not be a fork of the template repository. Please create a new repository, generated from the template ${templateRepo}.`
    )
  }
  if (!is_private && template_repository?.full_name !== templateRepo) {
    // Must be sourced from the template
    throw new VerboseError(
      'Repository must be generated from the official template',
      `The repository must be generated from the official template repository. Please create a new repository, generated from the template ${templateRepo}.`
    )
  }
  if (is_template) {
    // Must not be a template
    throw new VerboseError(
      'Repository must not be a template',
      'The repository must not be a template repository. Please create change the settings of this repository and try again.'
    )
  }

  const topicList = typeof topics === 'undefined' ? [] : topics.map((t) => t.toLowerCase())

  return { name: patchName, description, url, repo, topics: topicList, username, usernameFull, userEmail }
}

export function parsePackage(errors: VerboseError[]): { templateRepo: string; templateRepoUrl: string } {
  let templateRepo = ''
  let templateRepoUrl = ''
  try {
    const metadata = JSON.parse(fs.readFileSync('.github/actions/initialization/package.json', 'utf8'))
    templateRepoUrl = (metadata.repository.url as string).replace(/^git\+/, '').replace(/\.git$/, '')
    templateRepo = /(?<=\/)[^/]+\/[^/]+$/.exec(templateRepoUrl)?.[0] ?? 'Template repository'
  } catch (error) {
    errors.push(
      new VerboseError(
        'Missing package metadata',
        'The template repository metadata could not be accessed. This should not have happened. Please try again. If the error persists, please report it. Please note that this process only works from the original template repository.'
      )
    )
  }
  return { templateRepo, templateRepoUrl }
}

export function checkPatchName(name: string, errors: VerboseError[]): void {
  const details =
    'The repository name is used as the name of the patch. The patch will be identified by this name and it determines the name of the VDF. Allowed are alphanumerical characters [0-9a-zA-Z_] only, not starting with a digit with a maximum length of 60 characters'
  if (name.length > 60) errors.push(new VerboseError('The patch name may not exceed 60 characters', details))
  if (name.length === 0) errors.push(new VerboseError('The patch name may not be empty', details))
  if (/^\d/.test(name)) errors.push(new VerboseError('The patch name may not start with a digit', details))
  if (!/^[_a-z0-9A-Z]*$/.test(name)) errors.push(new VerboseError('The patch name may only contain characters from `0-9a-zA-Z_`', details))
}

export function checkPatchDesc(description: string, errors: VerboseError[]): void {
  const details =
    'The repository description is used as a brief sentence describing the patch. It serves as basic information for players in the ingame console and inside the VDF. Maximum length is 250 characters. Illegal characters: ><|& You may use %%N for line breaks. No more than three lines are supported.'
  const numNL = (description.match(/%%N/g) || []).length
  if (description.length - numNL > 254) {
    errors.push(new VerboseError('The patch description may not exceed 254 characters', details))
  }
  if (!/^[^><|&]*$/.test(description)) {
    errors.push(new VerboseError('The patch description may not contain the characters `><|&`', details))
  }
  if (numNL > 3) {
    errors.push(new VerboseError('The patch description may not contain more than 3 line breaks (%%N)', details))
  }
}
