import * as core from '@actions/core'
import * as inputs from '../src/inputs'
import fs from 'fs'
import { warnings } from '../src/main'
import { VerboseError } from '../src/classes'

let readFileSyncMock: jest.SpiedFunction<typeof fs.readFileSync>

const parseInputsMock = jest.spyOn(inputs, 'parseInputs')
const parseEnvMock = jest.spyOn(inputs, 'parseEnv')
const parsePackageMock = jest.spyOn(inputs, 'parsePackage')
const checkPatchNameMock = jest.spyOn(inputs, 'checkPatchName')
const checkPatchDescMock = jest.spyOn(inputs, 'checkPatchDesc')

describe('parseInputs', () => {
  beforeEach(() => {
    while (warnings.length > 0) warnings.pop()
  })

  it('throws an error if input is missing', () => {
    const inputParams = undefined
    const errors: VerboseError[] = []

    expect(() => {
      inputs.parseInputs(inputParams!, errors)
    }).toThrow('Missing input parameters')
    expect(warnings.length).toBe(0)
    expect(errors.length).toBe(0)
  })

  it('throws an error if input parameters cannot be parsed as JSON', () => {
    const inputParams = 'invalid-json'
    const errors: VerboseError[] = []

    expect(() => {
      inputs.parseInputs(inputParams, errors)
    }).toThrow('Invalid input parameters')
    expect(warnings.length).toBe(0)
    expect(errors.length).toBe(0)
  })

  it('aggregates errors for missing parameters', () => {
    const inputParams = '{"param1": "value1", "param2": "value2"}'
    const errors: VerboseError[] = []

    const result = inputs.parseInputs(inputParams, errors)
    expect(parseInputsMock).toHaveReturned()
    expect(result).toEqual({})
    expect(warnings.length).toBe(0)
    expect(errors.length).toBe(13)
    expect(errors[0]).toEqual(new VerboseError('Invalid input Content scripts', 'Required'))
    expect(errors[1]).toEqual(new VerboseError('Invalid input Ikarus and LeGo', 'Required'))
    expect(errors[2]).toEqual(new VerboseError('Invalid input Content initialization', 'Required'))
    expect(errors[3]).toEqual(new VerboseError('Invalid input Menu initialization', 'Required'))
    expect(errors[4]).toEqual(new VerboseError('Invalid input Menu scripts', 'Required'))
    expect(errors[5]).toEqual(new VerboseError('Invalid input Particle FX scripts', 'Required'))
    expect(errors[6]).toEqual(new VerboseError('Invalid input Visual FX scripts', 'Required'))
    expect(errors[7]).toEqual(new VerboseError('Invalid input Sound FX scripts', 'Required'))
    expect(errors[8]).toEqual(new VerboseError('Invalid input Music scripts', 'Required'))
    expect(errors[9]).toEqual(new VerboseError('Invalid input Camera scripts', 'Required'))
    expect(errors[10]).toEqual(new VerboseError('Invalid input Fight AI scripts', 'Required'))
    expect(errors[11]).toEqual(new VerboseError('Invalid input Output units', 'Required'))
    expect(errors[12]).toEqual(new VerboseError('Invalid input Animations', 'Required'))
  })

  it('aggregates errors for invalid parameters', () => {
    const inputParams = {
      'Content scripts': {
        'Gothic 1': 'false',
      },
      'Ikarus and LeGo': 42,
      'Content initialization': {
        'Content initialization function': 21,
      },
      'Menu initialization': {},
      'Menu scripts': 'GameVersion',
      'Particle FX scripts': 'GameVersion',
      'Visual FX scripts': 'GameVersion',
      'Sound FX scripts': 'GameVersion',
      'Music scripts': 'GameVersion',
      'Camera scripts': 'GameVersion',
      'Fight AI scripts': 'GameVersion',
      'Output units': 'GameVersion',
      Animations: 'GameVersion',
    }
    const errors: VerboseError[] = []

    const result = inputs.parseInputs(JSON.stringify(inputParams), errors)
    expect(parseInputsMock).toHaveReturned()
    expect(result).toEqual({})
    expect(warnings.length).toBe(0)
    expect(errors.length).toBe(15)
    expect(errors[0]).toEqual(new VerboseError('Invalid input Content scripts->Gothic Sequel', 'Invalid input'))
    expect(errors[1]).toEqual(new VerboseError('Invalid input Content scripts->Gothic 2 Classic', 'Invalid input'))
    expect(errors[2]).toEqual(new VerboseError('Invalid input Content scripts->Gothic 2 NotR', 'Invalid input'))
    expect(errors[3]).toEqual(new VerboseError('Invalid input Ikarus and LeGo', 'Expected object, received number'))
    expect(errors[4]).toEqual(new VerboseError('Invalid input Content initialization->Content initialization function', 'Invalid input'))
    expect(errors[5]).toEqual(new VerboseError('Invalid input Menu initialization->Menu initialization function', 'Invalid input'))
    expect(errors[6]).toEqual(new VerboseError('Invalid input Menu scripts', 'Expected object, received string'))
    expect(errors[7]).toEqual(new VerboseError('Invalid input Particle FX scripts', 'Expected object, received string'))
    expect(errors[8]).toEqual(new VerboseError('Invalid input Visual FX scripts', 'Expected object, received string'))
    expect(errors[9]).toEqual(new VerboseError('Invalid input Sound FX scripts', 'Expected object, received string'))
    expect(errors[10]).toEqual(new VerboseError('Invalid input Music scripts', 'Expected object, received string'))
    expect(errors[11]).toEqual(new VerboseError('Invalid input Camera scripts', 'Expected object, received string'))
    expect(errors[12]).toEqual(new VerboseError('Invalid input Fight AI scripts', 'Expected object, received string'))
    expect(errors[13]).toEqual(new VerboseError('Invalid input Output units', 'Expected object, received string'))
    expect(errors[14]).toEqual(new VerboseError('Invalid input Animations', 'Expected object, received string'))
  })

  it('fails for incompatible inputs', () => {
    const basicInputs = {
      'Gothic 1': false,
      'Gothic Sequel': 'false',
      'Gothic 2 Classic': 'false',
      'Gothic 2 NotR': 'false',
    }
    const inputParams = {
      'Content scripts': basicInputs,
      'Ikarus and LeGo': {
        Ikarus: false,
        LeGo: true,
      },
      'Content initialization': {
        'Content initialization function': true,
      },
      'Menu initialization': {
        'Menu initialization function': true,
      },
      'Menu scripts': basicInputs,
      'Particle FX scripts': basicInputs,
      'Visual FX scripts': basicInputs,
      'Sound FX scripts': basicInputs,
      'Music scripts': basicInputs,
      'Camera scripts': basicInputs,
      'Fight AI scripts': basicInputs,
      'Output units': basicInputs,
      Animations: basicInputs,
    }
    const errors: VerboseError[] = []

    const result = inputs.parseInputs(JSON.stringify(inputParams), errors)
    expect(parseInputsMock).toHaveReturned()
    expect(result).toEqual({})
    expect(warnings.length).toBe(1)
    expect(warnings[0]).toEqual(new VerboseError('LeGo is enabled without Ikarus', 'LeGo requires Ikarus. Adding Ikarus to selection'))
    expect(errors.length).toBe(3)
    expect(errors[0]).toEqual(
      new VerboseError('Invalid input Content initialization', 'Cannot use initialization without using content scripts')
    )
    expect(errors[1]).toEqual(
      new VerboseError('Invalid input Menu initialization', 'Cannot use initialization without using content scripts')
    )
    expect(errors[2]).toEqual(new VerboseError('Invalid input Ikarus and LeGo->Ikarus', 'Cannot use Ikarus without using content scripts'))
  })

  it('parses valid varying inputs (no content)', () => {
    const g1Inputs = {
      'Gothic 1': 'true',
      'Gothic Sequel': 'false',
      'Gothic 2 Classic': 'false',
      'Gothic 2 NotR': 'false',
    }
    const g112Inputs = {
      'Gothic 1': 'false',
      'Gothic Sequel': 'true',
      'Gothic 2 Classic': 'false',
      'Gothic 2 NotR': 'false',
    }
    const g130Inputs = {
      'Gothic 1': 'false',
      'Gothic Sequel': 'false',
      'Gothic 2 Classic': 'true',
      'Gothic 2 NotR': 'false',
    }
    const g2Inputs = {
      'Gothic 1': 'false',
      'Gothic Sequel': 'false',
      'Gothic 2 Classic': 'false',
      'Gothic 2 NotR': 'true',
    }
    const offInputs = {
      'Gothic 1': 'false',
      'Gothic Sequel': 'false',
      'Gothic 2 Classic': 'false',
      'Gothic 2 NotR': 'false',
    }
    const inputParams = {
      'Content scripts': offInputs,
      'Ikarus and LeGo': {
        Ikarus: 'false',
        LeGo: 'false',
      },
      'Content initialization': {
        'Content initialization function': 'false',
      },
      'Menu initialization': {
        'Menu initialization function': 'false',
      },
      'Menu scripts': g1Inputs,
      'Particle FX scripts': g112Inputs,
      'Visual FX scripts': g112Inputs,
      'Sound FX scripts': g130Inputs,
      'Music scripts': g130Inputs,
      'Camera scripts': g2Inputs,
      'Fight AI scripts': g2Inputs,
      'Output units': g1Inputs,
      Animations: offInputs,
    }
    const output = {
      content: [],
      menu: [1],
      pfx: [112],
      vfx: [112],
      sfx: [130],
      music: [130],
      camera: [2],
      fight: [2],
      ou: [1],
      anim: [],
      ikarus: false,
      lego: false,
      initContent: false,
      initMenu: false,
      needsContentScripts: false,
      needsScripts: true,
      needsNinja: true,
      needsInit: false,
      needsVersions: [1, 112, 130, 2],
      name: '',
      description: '',
      username: '',
      usernameFull: '',
      userEmail: '',
      repo: '',
      url: '',
    }
    const errors: VerboseError[] = []

    const result = inputs.parseInputs(JSON.stringify(inputParams), errors)
    expect(parseInputsMock).toHaveReturned()
    expect(errors.length).toBe(0)
    expect(warnings.length).toBe(0)
    expect(result).toEqual({ userinputs: output })
  })

  it('parses valid varying inputs (only anim)', () => {
    const g1Inputs = {
      'Gothic 1': 'true',
      'Gothic Sequel': 'false',
      'Gothic 2 Classic': 'false',
      'Gothic 2 NotR': 'false',
    }
    const offInputs = {
      'Gothic 1': 'false',
      'Gothic Sequel': 'false',
      'Gothic 2 Classic': 'false',
      'Gothic 2 NotR': 'false',
    }
    const inputParams = {
      'Content scripts': offInputs,
      'Ikarus and LeGo': {
        Ikarus: 'false',
        LeGo: 'false',
      },
      'Content initialization': {
        'Content initialization function': 'false',
      },
      'Menu initialization': {
        'Menu initialization function': 'false',
      },
      'Menu scripts': offInputs,
      'Particle FX scripts': offInputs,
      'Visual FX scripts': offInputs,
      'Sound FX scripts': offInputs,
      'Music scripts': offInputs,
      'Camera scripts': offInputs,
      'Fight AI scripts': offInputs,
      'Output units': offInputs,
      Animations: g1Inputs,
    }
    const output = {
      content: [],
      menu: [],
      pfx: [],
      vfx: [],
      sfx: [],
      music: [],
      camera: [],
      fight: [],
      ou: [],
      anim: [1],
      ikarus: false,
      lego: false,
      initContent: false,
      initMenu: false,
      needsContentScripts: false,
      needsScripts: false,
      needsNinja: true,
      needsInit: false,
      needsVersions: [1],
      name: '',
      description: '',
      username: '',
      usernameFull: '',
      userEmail: '',
      repo: '',
      url: '',
    }
    const errors: VerboseError[] = []

    const result = inputs.parseInputs(JSON.stringify(inputParams), errors)
    expect(parseInputsMock).toHaveReturned()
    expect(errors.length).toBe(0)
    expect(warnings.length).toBe(0)
    expect(result).toEqual({ userinputs: output })
  })

  it('parses valid input all true', () => {
    const basicInputs = {
      'Gothic 1': 'true',
      'Gothic Sequel': 'true',
      'Gothic 2 Classic': 'true',
      'Gothic 2 NotR': 'true',
    }
    const inputParams = {
      'Content scripts': basicInputs,
      'Ikarus and LeGo': {
        Ikarus: 'true',
        LeGo: 'true',
      },
      'Content initialization': {
        'Content initialization function': 'true',
      },
      'Menu initialization': {
        'Menu initialization function': 'true',
      },
      'Menu scripts': basicInputs,
      'Particle FX scripts': basicInputs,
      'Visual FX scripts': basicInputs,
      'Sound FX scripts': basicInputs,
      'Music scripts': basicInputs,
      'Camera scripts': basicInputs,
      'Fight AI scripts': basicInputs,
      'Output units': basicInputs,
      Animations: basicInputs,
    }
    const output = {
      content: [1, 112, 130, 2],
      menu: [1, 112, 130, 2],
      pfx: [1, 112, 130, 2],
      vfx: [1, 112, 130, 2],
      sfx: [1, 112, 130, 2],
      music: [1, 112, 130, 2],
      camera: [1, 112, 130, 2],
      fight: [1, 112, 130, 2],
      ou: [1, 112, 130, 2],
      anim: [1, 112, 130, 2],
      ikarus: true,
      lego: true,
      initContent: true,
      initMenu: true,
      needsContentScripts: true,
      needsScripts: true,
      needsNinja: true,
      needsInit: true,
      needsVersions: [1, 112, 130, 2],
      name: '',
      description: '',
      username: '',
      usernameFull: '',
      userEmail: '',
      repo: '',
      url: '',
    }
    const errors: VerboseError[] = []
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const warnings = require('../src/main').warnings

    const result = inputs.parseInputs(JSON.stringify(inputParams), errors)
    expect(parseInputsMock).toHaveReturned()
    expect(errors.length).toBe(0)
    expect(warnings.length).toBe(0)
    expect(result).toEqual({ userinputs: output })
  })
})

describe('parseEnv', () => {
  it('throws an error if repository context is not available', async () => {
    await expect(inputs.parseEnv('')).rejects.toThrow('Repository context not available')
  })

  it('throws an error if repository information is invalid', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      payload: {
        repository: {
          name: 123, // Invalid type
          description: 'description',
          html_url: 'https://github.com/user/repo',
        },
      },
    }

    await expect(inputs.parseEnv('')).rejects.toThrow('Repository information not available')
  })

  it('throws an error if GitHub API token is not available', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      payload: {
        repository: {
          name: 'repo',
          description: 'description',
          html_url: 'https://github.com/user/repo',
        },
      },
    }
    jest.spyOn(core, 'getInput').mockReturnValue('')

    await expect(inputs.parseEnv('')).rejects.toThrow('GitHub API token not available')
  })

  it('throws an error if repository is not found', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      actor: 'john-doe',
      payload: {
        repository: {
          name: 'repo',
          description: 'description',
          html_url: 'https://github.com/user/repo',
        },
      },
    }
    github.getOctokit = jest.fn().mockReturnValue({
      rest: {
        repos: {
          get: jest.fn().mockResolvedValue({ data: {} }),
        },
        users: {
          getByUsername: jest.fn().mockResolvedValue({
            data: {
              name: 'John Doe',
              id: 123,
            },
          }),
        },
      },
    })

    jest.replaceProperty(process, 'env', { GITHUB_TRIGGERING_ACTOR: 'john-doe' })
    await expect(inputs.parseEnv('user/templateRepo')).rejects.toThrow('Repository must be generated from the official template')
  })

  it('throws an error if repository is a fork', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      actor: 'john-doe',
      payload: {
        repository: {
          name: 'repo',
          description: 'description',
          html_url: 'https://github.com/user/repo',
        },
      },
    }
    github.getOctokit = jest.fn().mockReturnValue({
      rest: {
        repos: {
          get: jest.fn().mockResolvedValue({
            data: {
              fork: true,
              is_template: false,
              template_repository: {
                full_name: 'user/templateRepo',
              },
            },
          }),
        },
        users: {
          getByUsername: jest.fn().mockResolvedValue({
            data: {
              name: 'John Doe',
              id: 123,
            },
          }),
        },
      },
    })

    jest.replaceProperty(process, 'env', { GITHUB_TRIGGERING_ACTOR: 'john-doe' })
    await expect(inputs.parseEnv('user/templateRepo')).rejects.toThrow('Repository must not be a fork')
  })

  it('throws an error if repository is generated from a wrong template', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      actor: 'john-doe',
      payload: {
        repository: {
          name: 'repo',
          description: 'description',
          html_url: 'https://github.com/user/repo',
        },
      },
    }
    github.getOctokit = jest.fn().mockReturnValue({
      rest: {
        repos: {
          get: jest.fn().mockResolvedValue({
            data: {
              private: false,
              fork: false,
              is_template: false,
              template_repository: {
                full_name: 'user/wrongTemplateRepo',
              },
            },
          }),
        },
        users: {
          getByUsername: jest.fn().mockResolvedValue({
            data: {
              name: 'John Doe',
              id: 123,
            },
          }),
        },
      },
    })

    jest.replaceProperty(process, 'env', { GITHUB_TRIGGERING_ACTOR: 'john-doe' })
    await expect(inputs.parseEnv('user/templateRepo')).rejects.toThrow('Repository must be generated from the official template')
  })

  it('throws an error if repository is a template', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      actor: 'john-doe',
      payload: {
        repository: {
          name: 'repo',
          description: 'description',
          html_url: 'https://github.com/user/repo',
        },
      },
    }
    github.getOctokit = jest.fn().mockReturnValue({
      rest: {
        repos: {
          get: jest.fn().mockResolvedValue({
            data: {
              fork: false,
              is_template: true,
              template_repository: {
                full_name: 'user/templateRepo',
              },
            },
          }),
        },
        users: {
          getByUsername: jest.fn().mockResolvedValue({
            data: {
              name: 'John Doe',
              id: 123,
            },
          }),
        },
      },
    })

    jest.replaceProperty(process, 'env', { GITHUB_TRIGGERING_ACTOR: 'john-doe' })
    await expect(inputs.parseEnv('user/templateRepo')).rejects.toThrow('Repository must not be a template')
  })

  it('returns parsed environment information (no process.env)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      actor: 'john-doe',
      payload: {
        repository: {
          name: 'repo',
          description: 'description',
          html_url: 'https://github.com/user/repo',
        },
      },
    }
    github.getOctokit = jest.fn().mockReturnValue({
      rest: {
        repos: {
          get: jest.fn().mockResolvedValue({
            data: {
              fork: false,
              is_template: false,
              template_repository: {
                full_name: 'user/templateRepo',
              },
            },
          }),
        },
        users: {
          getByUsername: jest.fn().mockResolvedValue({
            data: {
              name: 'John Doe',
              id: 123,
            },
          }),
        },
      },
    })

    jest.replaceProperty(process, 'env', { GITHUB_TRIGGERING_ACTOR: undefined })
    const result = await inputs.parseEnv('user/templateRepo')
    expect(parseEnvMock).toHaveReturned()
    expect(result).toEqual({
      name: 'repo',
      description: 'description',
      repo: 'user/repo',
      url: 'https://github.com/user/repo',
      username: 'john-doe',
      usernameFull: 'John Doe',
      userEmail: '123+john-doe@users.noreply.github.com',
    })
  })

  it('returns parsed environment information (with process.env)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      payload: {
        repository: {
          name: 'repo',
          description: 'description',
          html_url: 'https://github.com/user/repo',
        },
      },
    }
    github.getOctokit = jest.fn().mockReturnValue({
      rest: {
        repos: {
          get: jest.fn().mockResolvedValue({
            data: {
              fork: false,
              is_template: false,
              template_repository: {
                full_name: 'user/templateRepo',
              },
            },
          }),
        },
        users: {
          getByUsername: jest.fn().mockResolvedValue({
            data: {
              name: 'John Doe',
              id: 123,
            },
          }),
        },
      },
    })

    jest.replaceProperty(process, 'env', { GITHUB_TRIGGERING_ACTOR: 'john-doe' })
    const result = await inputs.parseEnv('user/templateRepo')
    expect(parseEnvMock).toHaveReturned()
    expect(result).toEqual({
      name: 'repo',
      description: 'description',
      repo: 'user/repo',
      url: 'https://github.com/user/repo',
      username: 'john-doe',
      usernameFull: 'John Doe',
      userEmail: '123+john-doe@users.noreply.github.com',
    })
  })

  it('returns parsed environment information (no octokit)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const github = require('@actions/github')
    github.context = {
      payload: {
        repository: {
          name: 'repo',
          description: 'description',
          html_url: 'https://github.com/user/repo',
        },
      },
    }
    github.getOctokit = jest.fn().mockReturnValue({
      rest: {
        repos: {
          get: jest.fn().mockResolvedValue({
            data: {
              fork: false,
              is_template: false,
              template_repository: {
                full_name: 'user/templateRepo',
              },
            },
          }),
        },
        users: {
          getByUsername: jest.fn().mockResolvedValue({}),
        },
      },
    })

    jest.replaceProperty(process, 'env', { GITHUB_TRIGGERING_ACTOR: 'john-doe' })
    const result = await inputs.parseEnv('user/templateRepo')
    expect(parseEnvMock).toHaveReturned()
    expect(result).toEqual({
      name: 'repo',
      description: 'description',
      repo: 'user/repo',
      url: 'https://github.com/user/repo',
      username: 'john-doe',
      usernameFull: 'john-doe',
      userEmail: 'john-doe@users.noreply.github.com',
    })
  })
})

describe('parsePackage', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockImplementation()
  })

  it('parse package metadata with git extension', () => {
    const metadata = {
      repository: {
        url: 'https://github.com/username/repo.git',
      },
    }
    readFileSyncMock.mockReturnValue(JSON.stringify(metadata))

    const errors: VerboseError[] = []
    const result = inputs.parsePackage(errors)
    expect(parsePackageMock).toHaveReturned()
    expect(readFileSyncMock).toHaveBeenCalledWith('.github/actions/initialization/package.json', 'utf8')
    expect(result).toEqual({
      templateRepo: 'username/repo',
      templateRepoUrl: 'https://github.com/username/repo',
    })
    expect(errors.length).toBe(0)
  })

  it('parse package metadata without git extension and licence info', () => {
    const metadata = {
      repository: {
        url: 'https://github.com/username/repo',
      },
    }
    readFileSyncMock.mockReturnValue(JSON.stringify(metadata))

    const errors: VerboseError[] = []
    const result = inputs.parsePackage(errors)
    expect(parsePackageMock).toHaveReturned()
    expect(readFileSyncMock).toHaveBeenCalledWith('.github/actions/initialization/package.json', 'utf8')
    expect(result).toEqual({
      templateRepo: 'username/repo',
      templateRepoUrl: 'https://github.com/username/repo',
    })
    expect(errors.length).toBe(0)
  })

  it('parse package metadata with invalid url', () => {
    const metadata = {
      repository: {
        url: 'https://example.com',
      },
    }
    readFileSyncMock.mockReturnValue(JSON.stringify(metadata))

    const errors: VerboseError[] = []
    const result = inputs.parsePackage(errors)
    expect(parsePackageMock).toHaveReturned()
    expect(readFileSyncMock).toHaveBeenCalledWith('.github/actions/initialization/package.json', 'utf8')
    expect(result).toEqual({
      templateRepo: 'Template repository',
      templateRepoUrl: 'https://example.com',
    })
    expect(errors.length).toBe(0)
  })

  it('adds an error on inaccessible package metadata', () => {
    readFileSyncMock.mockImplementation(() => {
      throw new Error('File not found')
    })

    const errors: VerboseError[] = []
    const result = inputs.parsePackage(errors)
    expect(parsePackageMock).toHaveReturned()
    expect(readFileSyncMock).toHaveBeenCalledWith('.github/actions/initialization/package.json', 'utf8')
    expect(result).toEqual({ templateRepo: '', templateRepoUrl: '' })
    expect(errors.length).toBe(1)
    expect(errors[0]).toEqual(
      new VerboseError(
        'Missing package metadata',
        'The template repository metadata could not be accessed. This should not have happened. Please try again. If the error persists, please report it.'
      )
    )
  })
})

describe('checkPatchName', () => {
  it('validates patch name with valid input', () => {
    const name = 'a'.repeat(60 - 3) + '_A2'
    const errors: VerboseError[] = []

    inputs.checkPatchName(name, errors)
    expect(checkPatchNameMock).toHaveReturned()
    expect(errors.length).toBe(0)
  })

  it('adds error for patch name that is too long', () => {
    const name = 'a'.repeat(61)
    const errors: VerboseError[] = []

    expect(name.length).toBe(61)
    inputs.checkPatchName(name, errors)
    expect(checkPatchNameMock).toHaveReturned()
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe('The patch name may not exceed 60 characters')
  })

  it('adds error for patch name that is empty', () => {
    const name = ''
    const errors: VerboseError[] = []

    inputs.checkPatchName(name, errors)
    expect(checkPatchNameMock).toHaveReturned()
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe('The patch name may not be empty')
  })

  it('adds error for patch name with leading digit', () => {
    const name = '1' + 'a'.repeat(56) + '_A2'
    const errors: VerboseError[] = []

    inputs.checkPatchName(name, errors)
    expect(checkPatchNameMock).toHaveReturned()
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe('The patch name may not start with a digit')
  })

  it('adds error for patch name with illegal characters', () => {
    const name = 'a'.repeat(60 - 3 - 26) + '_A2' + '!^#%*(){}[]:;?/.,\\`~><|&"\''
    const errors: VerboseError[] = []

    inputs.checkPatchName(name, errors)
    expect(checkPatchNameMock).toHaveReturned()
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe('The patch name may only contain characters from `0-9a-zA-Z_`')
  })

  it('adds error for patch name violating most rules', () => {
    const name = '1' + 'a'.repeat(61 - 1 - 3 - 26) + '_A2' + '!^#%*(){}[]:;?/.,\\`~><|&"\''
    const errors: VerboseError[] = []

    expect(name.length).toBe(61)
    inputs.checkPatchName(name, errors)
    expect(checkPatchNameMock).toHaveReturned()
    expect(errors.length).toBe(3)
    expect(errors[0].message).toBe('The patch name may not exceed 60 characters')
    expect(errors[1].message).toBe('The patch name may not start with a digit')
    expect(errors[2].message).toBe('The patch name may only contain characters from `0-9a-zA-Z_`')
  })
})

describe('checkPatchDesc', () => {
  it('validates patch description with valid input (no lines breaks)', () => {
    const description = 'a'.repeat(250 - 24) + '1_-!@#%*(){}[]:;?/.,\\`~'
    const errors: VerboseError[] = []

    inputs.checkPatchDesc(description, errors)
    expect(checkPatchDescMock).toHaveReturned()
    expect(errors.length).toBe(0)
  })

  it('validates patch description with valid input (three line breaks)', () => {
    const description = 'a'.repeat(250 - 3 * 3 - 24) + '%%N'.repeat(3) + '1_-!@#%*(){}[]:;?/.,\\`~'
    const errors: VerboseError[] = []

    inputs.checkPatchDesc(description, errors)
    expect(checkPatchDescMock).toHaveReturned()
    expect(errors.length).toBe(0)
  })

  it('adds error for patch description that is too long', () => {
    const description = 'a'.repeat(255 + 3 - 3 * 3 - 23) + '%%N'.repeat(3) + '1_-!@#%*(){}[]:;?/.,\\`~'
    const errors: VerboseError[] = []

    expect(description.length).toBe(255 + 3)
    inputs.checkPatchDesc(description, errors)
    expect(checkPatchDescMock).toHaveReturned()
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe('The patch description may not exceed 254 characters')
  })

  it('adds error for patch description with illegal characters', () => {
    const description = 'a'.repeat(250 - 3 * 3 - 24 - 4) + '%%N'.repeat(3) + '1_-!@#%*(){}[]:;?/.,\\`~' + '><|&'
    const errors: VerboseError[] = []

    inputs.checkPatchDesc(description, errors)
    expect(checkPatchDescMock).toHaveReturned()
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe('The patch description may not contain the characters `><|&`')
  })

  it('adds error for patch description with more than 3 line breaks', () => {
    const description = 'a'.repeat(250 - 4 * 3 - 24) + '%%N'.repeat(4) + '1_-!@#%*(){}[]:;?/.,\\`~'
    const errors: VerboseError[] = []

    inputs.checkPatchDesc(description, errors)
    expect(checkPatchDescMock).toHaveReturned()
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe('The patch description may not contain more than 3 line breaks (%%N)')
  })

  it('adds error for patch description violating all rules', () => {
    const description = 'a'.repeat(255 + 4 - 4 * 3 - 23 - 4) + '%%N'.repeat(4) + '1_-!@#%*(){}[]:;?/.,\\`~' + '><|&'
    const errors: VerboseError[] = []

    expect(description.length).toBe(255 + 4)
    inputs.checkPatchDesc(description, errors)
    expect(checkPatchDescMock).toHaveReturned()
    expect(errors.length).toBe(3)
    expect(errors[0].message).toBe('The patch description may not exceed 254 characters')
    expect(errors[1].message).toBe('The patch description may not contain the characters `><|&`')
    expect(errors[2].message).toBe('The patch description may not contain more than 3 line breaks (%%N)')
  })
})
