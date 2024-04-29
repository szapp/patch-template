import * as files from '../src/files'
import * as io from '@actions/io'
import * as exec from '@actions/exec'
import * as path from 'path'
import fs from 'fs/promises'
import { InputParameters } from '../src/classes'

jest.mock('@actions/io')
jest.mock('@actions/exec')
jest.mock('fs/promises')

const createDirsMock = jest.spyOn(files, 'createDirs')
const writeContentSrcFilesMock = jest.spyOn(files, 'writeContentSrcFiles')
const writeInitializationMock = jest.spyOn(files, 'writeInitialization')
const writeSrcFilesMock = jest.spyOn(files, 'writeSrcFiles')
const writeOuFilesMock = jest.spyOn(files, 'writeOuFiles')
const writeAnimFilesMock = jest.spyOn(files, 'writeAnimFiles')
const writeVmScriptMock = jest.spyOn(files, 'writeVmScript')
const writeDotFilesMock = jest.spyOn(files, 'writeDotFiles')
const writeReadmeMock = jest.spyOn(files, 'writeReadme')
const writeLicenseMock = jest.spyOn(files, 'writeLicense')
const removeFilesMock = jest.spyOn(files, 'removeFiles')

describe('createDirs', () => {
  it('should create resource directories and Ninja/Content/empty', async () => {
    const patch: InputParameters = {
      needsNinja: false,
      needsContentScripts: true,
      needsInit: false,
      name: 'testPatch',
    } as InputParameters
    const rscPattern1 = path.join('_work', 'Data', '{DIR}', '_compiled', '.empty')
    const rscPattern2 = path.join('_work', 'Data', '{DIR}', '.empty')

    await files.createDirs(patch)
    expect(createDirsMock).toHaveReturned()
    expect(exec.exec).toHaveBeenCalledTimes(8)
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Anims')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Meshes')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', 'Presets')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', path.join('Sound', 'SFX'))], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', path.join('Sound', 'Speech'))], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Textures')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', 'Worlds')], {
      silent: true,
    })
    expect(io.mkdirP).not.toHaveBeenCalled()
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', path.join('Ninja', 'testPatch', 'Content', '.empty')], {
      silent: true,
    })
  })

  it('should create resource directories and Ninja/Content/', async () => {
    const patch: InputParameters = {
      needsNinja: false,
      needsContentScripts: true,
      needsInit: true,
      name: 'testPatch',
    } as InputParameters
    const rscPattern1 = path.join('_work', 'Data', '{DIR}', '_compiled', '.empty')
    const rscPattern2 = path.join('_work', 'Data', '{DIR}', '.empty')

    await files.createDirs(patch)
    expect(createDirsMock).toHaveReturned()
    expect(exec.exec).toHaveBeenCalledTimes(7)
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Anims')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Meshes')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', 'Presets')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', path.join('Sound', 'SFX'))], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', path.join('Sound', 'Speech'))], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Textures')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', 'Worlds')], {
      silent: true,
    })
    expect(io.mkdirP).toHaveBeenCalledTimes(1)
    expect(io.mkdirP).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Content'))
  })

  it('should create resource directories and Ninja/', async () => {
    const patch: InputParameters = {
      needsNinja: true,
      needsContentScripts: false,
      needsInit: false,
      name: 'testPatch',
    } as InputParameters
    const rscPattern1 = path.join('_work', 'Data', '{DIR}', '_compiled', '.empty')
    const rscPattern2 = path.join('_work', 'Data', '{DIR}', '.empty')

    await files.createDirs(patch)
    expect(createDirsMock).toHaveReturned()
    expect(exec.exec).toHaveBeenCalledTimes(7)
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Anims')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Meshes')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', 'Presets')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', path.join('Sound', 'SFX'))], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', path.join('Sound', 'Speech'))], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Textures')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', 'Worlds')], {
      silent: true,
    })
    expect(io.mkdirP).toHaveBeenCalledTimes(1)
    expect(io.mkdirP).toHaveBeenCalledWith(path.join('Ninja', 'testPatch'))
  })

  it('should create resource directories only', async () => {
    const patch: InputParameters = {
      needsNinja: false,
      needsContentScripts: false,
      needsInit: false,
      name: 'testPatch',
    } as InputParameters
    const rscPattern1 = path.join('_work', 'Data', '{DIR}', '_compiled', '.empty')
    const rscPattern2 = path.join('_work', 'Data', '{DIR}', '.empty')

    await files.createDirs(patch)
    expect(createDirsMock).toHaveReturned()
    expect(exec.exec).toHaveBeenCalledTimes(7)
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Anims')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Meshes')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', 'Presets')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', path.join('Sound', 'SFX'))], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', path.join('Sound', 'Speech'))], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern1.replace('{DIR}', 'Textures')], {
      silent: true,
    })
    expect(exec.exec).toHaveBeenCalledWith('install', ['-Dv', '/dev/null', rscPattern2.replace('{DIR}', 'Worlds')], {
      silent: true,
    })
    expect(io.mkdirP).not.toHaveBeenCalled()
  })
})

describe('writeContentSrcFiles', () => {
  it('should write all content source files with ikarus and lego', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      needsContentScripts: true,
      needsInit: true,
      ikarus: true,
      lego: true,
      content: [1, 112, 130, 2],
    } as InputParameters
    const basePath = path.join('Ninja', 'testPatch')

    await files.writeContentSrcFiles(patch)
    expect(writeContentSrcFilesMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledTimes(4)
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(basePath, 'Content_G1.src'),
      'Ikarus\nLeGo\n\n// LIST YOUR FILES HERE\n\nContent\\init.d\n'
    )
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(basePath, 'Content_G112.src'),
      'Ikarus\nLeGo\n\n// LIST YOUR FILES HERE\n\nContent\\init.d\n'
    )
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(basePath, 'Content_G130.src'),
      'Ikarus\nLeGo\n\n// LIST YOUR FILES HERE\n\nContent\\init.d\n'
    )
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(basePath, 'Content_G2.src'),
      'Ikarus\nLeGo\n\n// LIST YOUR FILES HERE\n\nContent\\init.d\n'
    )
  })

  it('should write only one content source file with ikarus', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      needsContentScripts: true,
      ikarus: true,
      lego: false,
      content: [1],
    } as InputParameters
    const basePath = path.join('Ninja', 'testPatch')

    await files.writeContentSrcFiles(patch)
    expect(writeContentSrcFilesMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(fs.writeFile).toHaveBeenCalledWith(path.join(basePath, 'Content_G1.src'), 'Ikarus\n\n// LIST YOUR FILES HERE\n')
  })

  it('should write only one content source file without ikarus and lego', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      needsContentScripts: true,
      ikarus: false,
      lego: false,
      content: [2],
    } as InputParameters
    const basePath = path.join('Ninja', 'testPatch')

    await files.writeContentSrcFiles(patch)
    expect(writeContentSrcFilesMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(fs.writeFile).toHaveBeenCalledWith(path.join(basePath, 'Content_G2.src'), '\n// LIST YOUR FILES HERE\n')
  })

  it('should write no content source file', async () => {
    const emptyContent: number[] = []
    const patch: InputParameters = {
      name: 'testPatch',
      needsContentScripts: true,
      ikarus: false,
      lego: false,
      content: emptyContent,
    } as InputParameters

    await files.writeContentSrcFiles(patch)
    expect(writeContentSrcFilesMock).toHaveReturned()
    expect(fs.writeFile).not.toHaveBeenCalled()
  })

  it('should not do anything', async () => {
    const patch: InputParameters = {
      needsContentScripts: false,
    } as InputParameters

    await files.writeContentSrcFiles(patch)
    expect(writeContentSrcFilesMock).toHaveReturned()
    expect(fs.writeFile).not.toHaveBeenCalled()
  })
})

describe('writeInitialization', () => {
  it('should write menu initialization with LeGo', async () => {
    const patch: InputParameters = {
      needsInit: true,
      ikarus: true,
      lego: true,
      initMenu: true,
      initContent: false,
      name: 'testPatch',
    } as InputParameters

    const expectedContent = `/*
 * Menu initialization function called by Ninja every time a menu is opened
 */
func void Ninja_testPatch_Menu(var int menuPtr) {
    MEM_InitAll();

    // WRITE YOUR INITIALIZATIONS HERE

};
`

    await files.writeInitialization(patch)
    expect(writeInitializationMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Content', 'init.d'), expectedContent)
  })

  it('should write content initialization with LeGo', async () => {
    const patch: InputParameters = {
      needsInit: true,
      ikarus: true,
      lego: true,
      initMenu: false,
      initContent: true,
      name: 'testPatch',
    } as InputParameters

    const expectedContent = `/*
 * Initialization function called by Ninja after "Init_Global" (G2) / "Init_<Levelname>" (G1)
 */
func void Ninja_testPatch_Init() {
    LeGo_MergeFlags( /* DESIRED LEGO PACKAGES */ );

    // WRITE YOUR INITIALIZATIONS HERE

};
`

    await files.writeInitialization(patch)
    expect(writeInitializationMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Content', 'init.d'), expectedContent)
  })

  it('should write menu initialization with Ikarus', async () => {
    const patch: InputParameters = {
      needsInit: true,
      ikarus: true,
      lego: false,
      initMenu: true,
      initContent: false,
      name: 'testPatch',
    } as InputParameters

    const expectedContent = `/*
 * Menu initialization function called by Ninja every time a menu is opened
 */
func void Ninja_testPatch_Menu(var int menuPtr) {
    MEM_InitAll();

    // WRITE YOUR INITIALIZATIONS HERE

};
`

    await files.writeInitialization(patch)
    expect(writeInitializationMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Content', 'init.d'), expectedContent)
  })

  it('should write content initialization with Ikarus', async () => {
    const patch: InputParameters = {
      needsInit: true,
      ikarus: true,
      lego: false,
      initMenu: false,
      initContent: true,
      name: 'testPatch',
    } as InputParameters

    const expectedContent = `/*
 * Initialization function called by Ninja after "Init_Global" (G2) / "Init_<Levelname>" (G1)
 */
func void Ninja_testPatch_Init() {
    MEM_InitAll();

    // WRITE YOUR INITIALIZATIONS HERE

};
`

    await files.writeInitialization(patch)
    expect(writeInitializationMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Content', 'init.d'), expectedContent)
  })

  it('should write menu and content initialization with LeGo', async () => {
    const patch: InputParameters = {
      needsInit: true,
      ikarus: true,
      lego: true,
      initMenu: true,
      initContent: true,
      name: 'testPatch',
    } as InputParameters

    const expectedContent = `/*
 * Menu initialization function called by Ninja every time a menu is opened
 */
func void Ninja_testPatch_Menu(var int menuPtr) {
    MEM_InitAll();

    // WRITE YOUR INITIALIZATIONS HERE

};

/*
 * Initialization function called by Ninja after "Init_Global" (G2) / "Init_<Levelname>" (G1)
 */
func void Ninja_testPatch_Init() {
    LeGo_MergeFlags( /* DESIRED LEGO PACKAGES */ );

    // WRITE YOUR INITIALIZATIONS HERE

};
`

    await files.writeInitialization(patch)
    expect(writeInitializationMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Content', 'init.d'), expectedContent)
  })

  it('should write menu and content initialization with Ikarus', async () => {
    const patch: InputParameters = {
      needsInit: true,
      ikarus: true,
      lego: false,
      initMenu: true,
      initContent: true,
      name: 'testPatch',
    } as InputParameters

    const expectedContent = `/*
 * Menu initialization function called by Ninja every time a menu is opened
 */
func void Ninja_testPatch_Menu(var int menuPtr) {
    MEM_InitAll();

    // WRITE YOUR INITIALIZATIONS HERE

};

/*
 * Initialization function called by Ninja after "Init_Global" (G2) / "Init_<Levelname>" (G1)
 */
func void Ninja_testPatch_Init() {
    MEM_InitAll();

    // WRITE YOUR INITIALIZATIONS HERE

};
`

    await files.writeInitialization(patch)
    expect(writeInitializationMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Content', 'init.d'), expectedContent)
  })

  it('should write menu and content initialization without Ikarus and LeGo', async () => {
    const patch: InputParameters = {
      needsInit: true,
      ikarus: false,
      lego: false,
      initMenu: true,
      initContent: true,
      name: 'testPatch',
    } as InputParameters

    const expectedContent = `/*
 * Menu initialization function called by Ninja every time a menu is opened
 */
func void Ninja_testPatch_Menu(var int menuPtr) {

    // WRITE YOUR INITIALIZATIONS HERE

};

/*
 * Initialization function called by Ninja after "Init_Global" (G2) / "Init_<Levelname>" (G1)
 */
func void Ninja_testPatch_Init() {

    // WRITE YOUR INITIALIZATIONS HERE

};
`

    await files.writeInitialization(patch)
    expect(writeInitializationMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Content', 'init.d'), expectedContent)
  })

  it('should not write initialization', async () => {
    const patch: InputParameters = {
      needsInit: false,
    } as InputParameters

    await files.writeInitialization(patch)
    expect(fs.writeFile).not.toHaveBeenCalled()
  })
})

describe('writeSrcFiles', () => {
  it('should write all non-content source files without suffixes', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      needsScripts: true,
      menu: [1, 112, 130, 2],
      pfx: [1, 112, 130, 2],
      vfx: [1, 112, 130, 2],
      sfx: [1, 112, 130, 2],
      music: [1, 112, 130, 2],
      fight: [1, 112, 130, 2],
      camera: [1, 112, 130, 2],
    } as InputParameters

    await files.writeSrcFiles(patch)
    expect(writeSrcFilesMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledTimes(7)
    for (const name of ['Menu', 'Pfx', 'Vfx', 'Sfx', 'Music', 'Fight', 'Camera'])
      expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', `${name}.src`), '\n')
  })

  it('should write some non-content source files with suffixes', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      needsScripts: true,
      menu: [1],
      pfx: [112],
      vfx: [130],
      sfx: [2],
      music: [1, 112, 130],
      fight: [112, 130, 2],
      camera: [1, 130],
    } as InputParameters

    await files.writeSrcFiles(patch)
    expect(writeSrcFilesMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledTimes(12)
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Menu_G1.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Pfx_G112.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Vfx_G130.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Sfx_G2.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Music_G1.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Music_G112.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Music_G130.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Fight_G112.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Fight_G130.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Fight_G2.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Camera_G1.src'), '\n')
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Camera_G130.src'), '\n')
  })

  it('should not write any non-content source files', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      needsScripts: false,
    } as InputParameters

    await files.writeSrcFiles(patch)
    expect(writeSrcFilesMock).toHaveReturned()
    expect(fs.writeFile).not.toHaveBeenCalled()
  })
})

describe('writeOuFiles', () => {
  it('should write output unit files for two versions', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      ou: [112, 130],
    } as InputParameters

    await files.writeOuFiles(patch)
    expect(writeOuFilesMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledTimes(2)
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'OU_G112.csl'), expect.any(String))
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'OU_G130.csl'), expect.any(String))
  })

  it('should write a single output unit file', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      ou: [1, 112, 130, 2],
    } as InputParameters

    await files.writeOuFiles(patch)
    expect(writeOuFilesMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'OU.csl'), expect.any(String))
  })

  it('should write no output unit file', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      ou: [] as number[],
    } as InputParameters

    await files.writeOuFiles(patch)
    expect(writeOuFilesMock).toHaveReturned()
    expect(fs.writeFile).not.toHaveBeenCalled()
  })
})

describe('writeAnimFiles', () => {
  it('should write animation files for two versions', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      anim: [112, 130],
    } as InputParameters

    await files.writeAnimFiles(patch)
    expect(writeAnimFilesMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledTimes(2)
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Anims_Humans_G112.mds'), expect.any(String))
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Anims_Humans_G130.mds'), expect.any(String))
  })

  it('should write a single animation file', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      anim: [1, 112, 130, 2],
    } as InputParameters

    await files.writeAnimFiles(patch)
    expect(writeAnimFilesMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('Ninja', 'testPatch', 'Anims_Humans.mds'), expect.any(String))
  })

  it('should write no animation file', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      anim: [] as number[],
    } as InputParameters

    await files.writeAnimFiles(patch)
    expect(writeAnimFilesMock).toHaveReturned()
    expect(fs.writeFile).not.toHaveBeenCalled()
  })
})

describe('writeVmScript', () => {
  it('should write the VM script', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      description: 'Test patch description',
    } as InputParameters

    await files.writeVmScript(patch)
    expect(writeVmScriptMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith(
      `${patch.name}.vm`,
      expect.stringContaining(`[BEGINVDF]\nComment=${patch.description}\nBaseDir=.\\\nVDFName=.\\${patch.name}.vdf`)
    )
  })
})

describe('writeDotFiles', () => {
  it('should write all dot files', async () => {
    await files.writeDotFiles()
    expect(writeDotFilesMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith('.validator.yml', expect.stringContaining('prefix:\nignore-declaration:\nignore-resource:'))
    expect(fs.writeFile).toHaveBeenCalledWith('.gitattributes', expect.stringContaining('* text=auto eol=lf'))
  })
})

describe('writeReadme', () => {
  it('should write the README file with badge', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      needsScripts: true,
      needsNinja: true,
      needsVersions: [1, 112, 130, 2],
      repo: 'user/repo',
      url: 'https://github.com/user/repo',
      description: 'Test patch description',
    } as InputParameters
    const templateRepo = 'template/repo'
    const templateRepoUrl = 'https://github.com/template/repo'

    await files.writeReadme(patch, templateRepo, templateRepoUrl)
    expect(writeReadmeMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith(
      'README.md',
      `# testPatch

[![Scripts](https://github.com/user/repo/actions/workflows/scripts.yml/badge.svg)](https://github.com/user/repo/actions/workflows/scripts.yml)
[![Validation](https://github.com/user/repo/actions/workflows/validation.yml/badge.svg)](https://github.com/user/repo/actions/workflows/validation.yml)
[![Build](https://github.com/user/repo/actions/workflows/build.yml/badge.svg)](https://github.com/user/repo/actions/workflows/build.yml)
[![GitHub release](https://img.shields.io/github/v/release/user/repo.svg)](https://github.com/user/repo/releases/latest)

Test patch description

This is a modular modification (a.k.a. patch or add-on) that can be installed and uninstalled at any time and is virtually compatible with any modification.
It supports <kbd>Gothic 1</kbd>, <kbd>Gothic Sequel</kbd>, <kbd>Gothic II (Classic)</kbd> and <kbd>Gothic II: NotR</kbd>.

###### Generated from [template/repo](https://github.com/template/repo).

## Installation

1. Download the latest release of \`testPatch.vdf\` from the [releases page](https://github.com/user/repo/releases/latest).

2. Copy the file \`testPatch.vdf\` to \`[Gothic]\\Data\\\`. To uninstall, remove the file again.

<!--
The patch is also available in
- [Spine Mod-Manager](https://clockwork-origins.com/spine/)
- [Steam Workshop Gothic 1](https://steamcommunity.com/sharedfiles/filedetails/?id=XXXXXXXXXX)
- [Steam Workshop Gothic 2](https://steamcommunity.com/sharedfiles/filedetails/?id=XXXXXXXXXX)
-->

### Requirements

<table><thead><tr><th>Gothic</th><th>Gothic Sequel</th><th>Gothic II (Classic)</th><th>Gothic II: NotR</th></tr></thead>
<tbody><tr><td><a href="https://www.worldofgothic.de/dl/download_6.htm">Version 1.08k_mod</a></td><td>Version 1.12f</td><td><a href="https://www.worldofgothic.de/dl/download_278.htm">Report version 1.30.0.0</a></td><td><a href="https://www.worldofgothic.de/dl/download_278.htm">Report version 2.6.0.0</a></td></tr></tbody>
<tbody><tr><td colspan="4" align="center"><a href="https://github.com/szapp/Ninja">Ninja 2</a> (or higher)</td></tr></tbody></table>

<!--

If you are interested in writing your own patch, please do not copy this patch!
Instead refer to the PATCH TEMPLATE to build a fundation that is customized to your needs!
The patch template can found at ${templateRepoUrl}.

-->
`
    )
  })

  it('should write the README file without badge', async () => {
    const patch: InputParameters = {
      name: 'testPatch',
      needsScripts: false,
      needsNinja: false,
      needsVersions: [112],
      repo: 'user/repo',
      url: 'https://github.com/user/repo',
      description: 'Test patch description',
    } as InputParameters
    const templateRepo = 'template/repo'
    const templateRepoUrl = 'https://github.com/template/repo'

    await files.writeReadme(patch, templateRepo, templateRepoUrl)
    expect(writeReadmeMock).toHaveReturned()
    expect(fs.writeFile).toHaveBeenCalledWith(
      'README.md',
      `# testPatch

[![Build](https://github.com/user/repo/actions/workflows/build.yml/badge.svg)](https://github.com/user/repo/actions/workflows/build.yml)
[![GitHub release](https://img.shields.io/github/v/release/user/repo.svg)](https://github.com/user/repo/releases/latest)

Test patch description

This is a modular modification (a.k.a. patch or add-on) that can be installed and uninstalled at any time and is virtually compatible with any modification.
It supports <kbd>Gothic Sequel</kbd> only.

###### Generated from [template/repo](https://github.com/template/repo).

## Installation

1. Download the latest release of \`testPatch.vdf\` from the [releases page](https://github.com/user/repo/releases/latest).

2. Copy the file \`testPatch.vdf\` to \`[Gothic]\\Data\\\`. To uninstall, remove the file again.

<!--
The patch is also available in
- [Spine Mod-Manager](https://clockwork-origins.com/spine/)
-->



<!--

If you are interested in writing your own patch, please do not copy this patch!
Instead refer to the PATCH TEMPLATE to build a fundation that is customized to your needs!
The patch template can found at ${templateRepoUrl}.

-->
`
    )
  })
})

describe('writeLicense', () => {
  it('should write the LICENSE file', async () => {
    const patch: InputParameters = {
      usernameFull: 'John Doe',
    } as InputParameters
    jest
      .spyOn(fs, 'readFile')
      .mockImplementation(async (file) =>
        (file as string).includes('GothicMOD-Lizenz.txt') ? 'Copyright (c) 20[jj] [Inhaber der ausschließlichen Nutzungsrechte].' : ''
      )

    await files.writeLicense(patch)
    expect(writeLicenseMock).toHaveReturned()
    expect(fs.readFile).toHaveBeenCalledTimes(2)
    expect(fs.readFile).toHaveBeenCalledWith(path.join('.github', 'actions', 'initialization', 'licenses', 'GothicMOD-Lizenz.txt'), 'utf8')
    expect(fs.readFile).toHaveBeenCalledWith(
      path.join('.github', 'actions', 'initialization', 'licenses', 'GOTHIC_MOD_Development_Kit.txt'),
      'utf8'
    )
    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(fs.writeFile).toHaveBeenNthCalledWith(
      1,
      'LICENSE',
      expect.stringContaining(new Date().getUTCFullYear() + ' ' + patch.usernameFull),
      'utf8'
    )
  })
})

describe('removeFiles', () => {
  it('should remove dot-files except for scripts.yml', async () => {
    const patch: InputParameters = {
      needsScripts: true,
    } as InputParameters

    await files.removeFiles(patch)
    expect(removeFilesMock).toHaveReturned()
    expect(io.rmRF).toHaveBeenCalledTimes(5)
    expect(io.rmRF).toHaveBeenCalledWith('.gitignore')
    expect(io.rmRF).toHaveBeenCalledWith('.github/workflows/init.yml')
    expect(io.rmRF).toHaveBeenCalledWith('.github/ISSUE_TEMPLATE')
    expect(io.rmRF).toHaveBeenCalledWith('.github/FUNDING.yml')
    expect(io.rmRF).toHaveBeenCalledWith('.github/actions')
    expect(io.rmRF).not.toHaveBeenCalledWith('.github/workflows/scripts.yml')
  })

  it('should remove dot-files including scripts.yml', async () => {
    const patch: InputParameters = {
      needsScripts: false,
    } as InputParameters

    await files.removeFiles(patch)
    expect(removeFilesMock).toHaveReturned()
    expect(io.rmRF).toHaveBeenCalledTimes(6)
    expect(io.rmRF).toHaveBeenCalledWith('.gitignore')
    expect(io.rmRF).toHaveBeenCalledWith('.github/workflows/init.yml')
    expect(io.rmRF).toHaveBeenCalledWith('.github/ISSUE_TEMPLATE')
    expect(io.rmRF).toHaveBeenCalledWith('.github/FUNDING.yml')
    expect(io.rmRF).toHaveBeenCalledWith('.github/actions')
    expect(io.rmRF).toHaveBeenCalledWith('.github/workflows/scripts.yml')
  })
})
