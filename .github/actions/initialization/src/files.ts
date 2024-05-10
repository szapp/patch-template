import { InputParameters } from './classes'
import path from 'path'
import * as io from '@actions/io'
import * as exec from '@actions/exec'
import fs from 'fs/promises'

export async function createDirs(patch: InputParameters): Promise<void> {
  // Always create resource directories
  const rscDirs = [
    ['Anims', '_compiled'],
    ['Meshes', '_compiled'],
    ['Presets'],
    ['Sound', 'SFX'],
    ['Sound', 'Speech'],
    ['Textures', '_compiled'],
    ['Worlds'],
  ]
  await Promise.all(
    rscDirs.map((dir) => exec.exec('install', ['-Dv', '/dev/null', path.join('_work', 'Data', ...dir, '.empty')], { silent: true }))
  )
  // Create Ninja directory, Content directory, or empty file as needed
  if (patch.needsInit) await io.mkdirP(path.join('Ninja', patch.name, 'Content'))
  else if (patch.needsContentScripts)
    await exec.exec('install', ['-Dv', '/dev/null', path.join('Ninja', patch.name, 'Content', '.empty')], {
      silent: true,
    })
  else if (patch.needsNinja) await io.mkdirP(path.join('Ninja', patch.name))
}

export async function writeContentSrcFiles(patch: InputParameters): Promise<void> {
  if (patch.needsContentScripts) {
    await Promise.all(
      patch.content.map((version: number) => {
        let content = ''
        if (patch.ikarus) {
          content = 'Ikarus\n'
          if (patch.lego) content += 'LeGo\n'
        }
        content += '\n// LIST YOUR FILES HERE'
        if (patch.needsInit) content += '\n\nContent\\init.d'
        content += '\n' // Trailing newline is important for parsing
        return fs.writeFile(path.join('Ninja', patch.name, `Content_G${version}.src`), content, 'ascii')
      })
    )
  }
}

export async function writeInitialization(patch: InputParameters): Promise<void> {
  if (patch.needsInit) {
    // Initialization lines
    const memInit = patch.ikarus ? '\n    MEM_InitAll();' : ''
    const mergeLego = patch.lego ? '\n    LeGo_MergeFlags( /* DESIRED LEGO PACKAGES */ );' : memInit

    // Write init.d to Content directory for content and menu initialization
    let content = ''
    if (patch.initMenu) {
      content += `/*
 * Menu initialization function called by Ninja every time a menu is opened
 */
func void Ninja_${patch.name}_Menu(var int menuPtr) {${memInit}

    // WRITE YOUR INITIALIZATIONS HERE

};
`
      if (patch.initContent) content += '\n'
    }
    if (patch.initContent) {
      content += `/*
 * Initialization function called by Ninja after "Init_Global" (G2) / "Init_<Levelname>" (G1)
 */
func void Ninja_${patch.name}_Init() {${mergeLego}

    // WRITE YOUR INITIALIZATIONS HERE

};
`
    }
    return fs.writeFile(path.join('Ninja', patch.name, 'Content', 'init.d'), content)
  }
}

export async function writeSrcFiles(patch: InputParameters): Promise<void> {
  if (patch.needsScripts) {
    // Loop over all non-content source and check which ones are needed (note that if all are needed, then only create one file with no suffix)
    const relScripts: (keyof typeof patch)[] = ['menu', 'pfx', 'vfx', 'sfx', 'music', 'fight', 'camera']
    await Promise.all(
      relScripts.map((name) => {
        const prefix = name[0].toUpperCase() + name.slice(1)
        if (JSON.stringify(patch[name]) === JSON.stringify([1, 112, 130, 2]))
          return fs.writeFile(path.join('Ninja', patch.name, `${prefix}.src`), '\n')
        else
          return Promise.all(
            (patch[name] as number[]).map((suffix) => fs.writeFile(path.join('Ninja', patch.name, `${prefix}_G${suffix}.src`), '\n'))
          )
      })
    )
  }
}

export async function writeOuFiles(patch: InputParameters): Promise<void | void[]> {
  // Content of the files
  const content = `ZenGin Archive
ver 1
zCArchiverGeneric
ASCII
saveGame 0
date 01/01/1970 00:00:00 AM
user Ninja
END
objects 4
END

[%% zCCSLib 0 0]
\tNumOfItems=int:1
\t[%% zCCSBlock 0 1]
\t\tblockName=string:NINJA_NONE_15_01
\t\tnumOfBlocks=int:1
\t\tsubBlock0=float:0
\t\t[%% zCCSAtomicBlock 0 2]
\t\t\t[%% oCMsgConversation:oCNpcMessage:zCEventMessage 0 3]
\t\t\t\tsubType=enum:0
\t\t\t\ttext=string:Dialog line shown in-game
\t\t\t\tname=string:NINJA_NONE_15_01.WAV
\t\t\t[]
\t\t[]
\t[]
[]
`
  // Write output unit files for each version or one file if all versions are needed
  if (JSON.stringify(patch.ou) === JSON.stringify([1, 112, 130, 2]))
    return await fs.writeFile(path.join('Ninja', patch.name, 'OU.csl'), content)
  else return Promise.all(patch.ou.map((version) => fs.writeFile(path.join('Ninja', patch.name, `OU_G${version}.csl`), content)))
}

export async function writeAnimFiles(patch: InputParameters): Promise<void | void[]> {
  // Content of the files
  const content = `Model ("HuS")
{

    // REGISTER NEW ARMOR HERE

    aniEnum
    {

        // ADD NEW ANIMATIONS HERE

    }
}
`

  // Write animation files for each version or one file if all versions are needed
  if (JSON.stringify(patch.anim) === JSON.stringify([1, 112, 130, 2]))
    return await fs.writeFile(path.join('Ninja', patch.name, 'Anims_Humans.mds'), content)
  else
    return Promise.all(patch.anim.map((version) => fs.writeFile(path.join('Ninja', patch.name, `Anims_Humans_G${version}.mds`), content)))
}

export async function writeVmScript(patch: InputParameters): Promise<void> {
  const content = `[BEGINVDF]
Comment=${patch.description}
BaseDir=.\\
VDFName=.\\${patch.name}.vdf

[FILES]
; Modular resources
_work\\Data\\Anims\\*.MDS
_work\\Data\\Anims\\MDS_Mobsi\\*.MDS
_work\\Data\\Anims\\MDS_Overlay\\*.MDS
_work\\Data\\Anims\\_compiled\\*.MAN
_work\\Data\\Anims\\_compiled\\*.MDH
_work\\Data\\Anims\\_compiled\\*.MDL
_work\\Data\\Anims\\_compiled\\*.MDM
_work\\Data\\Anims\\_compiled\\*.MMB
_work\\Data\\Anims\\_compiled\\*.MSB
_work\\Data\\Meshes\\_compiled\\*.MRM
_work\\Data\\Meshes\\_compiled\\*.MSH
_work\\Data\\Presets\\*.ZEN
_work\\Data\\Sound\\SFX\\*.WAV
_work\\Data\\Sound\\Speech\\*.WAV
_work\\Data\\Textures\\_compiled\\*-C.TEX
_work\\Data\\Textures\\_compiled\\*.FNT
_work\\Data\\Worlds\\*.ZEN

; Ninja resources
Ninja\\${patch.name}\\* -r

; License and README
LICENSE
README.md

[EXCLUDE]
; Exclude sub-directories
*\\Ninja\\* -r
*\\_work\\* -r

; Exclude source scripts
_work\\Data\\Scripts\\* -r

; Exclude metadata
.empty -r
*.vm
*.vdf
*.bat
*.cfg
.*

[INCLUDE]
; License and README
LICENSE
README.md

[ENDVDF]
`

  return fs.writeFile(`${patch.name}.vm`, content)
}

export async function writeDotFiles(patch: InputParameters): Promise<void[]> {
  // Patch validator configuration file
  const contentValidatorYml = `# This file is required for the patch-validator to work and may contain advanced configuration options
# For more information, visit https://github.com/szapp/patch-validator/#configuration

prefix:
ignore-declaration:
ignore-resource:
`

  // Git ignore file
  const contentGitIgnore = `*.vdf
`

  // Git attributes file
  const contentGitAttributes = `# Checkout line endings based on OS (do not force crlf where not necessary)
* text=auto

# Checkout Windows-style line endings and ensure correct encoding
# Encoding is not localization but fixed zSTRING::Upper code page handling!
# See https://forum.worldofplayers.de/forum/threads/1537187/page3
# and https://forum.worldofplayers.de/forum/threads/759496
*.[dD] text working-tree-encoding=CP1252 eol=crlf
*.[cC][sS][lL] text working-tree-encoding=CP1252 linguist-detectable=false

# Exclude (semi-) binary resources from linguist stats

# Output units
*.[bB][iI][nN] binary linguist-detectable=false

# Animation files
*.[aA][sS][cC] text linguist-detectable=false
*.[mM][dD][sS] text linguist-detectable=false
*.[mM][aA][nN] binary linguist-detectable=false
*.[mM][dD][hH] binary linguist-detectable=false
*.[mM][dD][lL] binary linguist-detectable=false
*.[mM][dD][mM] binary linguist-detectable=false
*.[mM][mM][bB] binary linguist-detectable=false
*.[mM][sS][bB] binary linguist-detectable=false
*.[sS][sS][cC] binary linguist-detectable=false

# Graphic files
*.[tT][gG][aA] binary linguist-detectable=false
*.[tT][eE][xX] binary linguist-detectable=false
*.[fF][nN][tT] binary linguist-detectable=false

# Mesh files (ZEN might be ASCII or binary)
*.3[dD][sS]    binary linguist-detectable=false
*.[mM][rR][mM] binary linguist-detectable=false
*.[mM][sS][hH] binary linguist-detectable=false
*.[zZ][eE][nN] text=auto linguist-detectable=false

# Music files
*.[dD][lL][sS] binary linguist-detectable=false
*.[sS][tT][yY] binary linguist-detectable=false
*.[sS][gG][tT] binary linguist-detectable=false

# Sound files
*.[wW][aA][vV] binary linguist-detectable=false
*.[oO][gG][gG] binary linguist-detectable=false
*.[mM][pP]3    binary linguist-detectable=false

# Video files
*.[bB][iI][kK] binary linguist-detectable=false

# VDF in case committed (mixed binary and text)
*.[vV][dD][fF] binary linguist-detectable=false
`

  // Dependabot configuration file
  const contentDependabotYml = `# This file is keeps the GitHub Actions up-to-date
# For more information, visit https://docs.github.com/en/code-security/dependabot
version: 2
updates:
- package-ecosystem: "github-actions"
  directory: "/"
  schedule:
    interval: "weekly"
`

  // Relase notes configuration files
  const contentReleaseYml = `# This file excludes bot authors from the automatically generated release notes
# For more information, visit https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes#configuring-automatically-generated-release-notes

changelog:
  exclude:
    authors:
      - dependabot
      - github-actions
`

  // Spine dependencies
  const contentToolCfg = `; This file adds dependencies for Spine
; For more information, visit https://clockwork-origins.com/spine-tutorial-tool-cfg/

[DEPENDENCIES]
Required=314
`

  return Promise.all([
    fs.writeFile('.validator.yml', contentValidatorYml),
    fs.writeFile('.gitignore', contentGitIgnore),
    fs.writeFile('.gitattributes', contentGitAttributes),
    fs.writeFile('.github/dependabot.yml', contentDependabotYml),
    fs.writeFile('.github/release.yml', contentReleaseYml),
    patch.needsNinja ? fs.writeFile('tool.cfg', contentToolCfg) : undefined,
  ])
}

export async function writeReadme(patch: InputParameters, templateRepo: string, templateRepoUrl: string): Promise<void> {
  // README badges
  let badge = patch.needsScripts
    ? `\n[![Scripts](${patch.url}/actions/workflows/scripts.yml/badge.svg)](${patch.url}/actions/workflows/scripts.yml)`
    : ''
  badge += patch.needsNinja
    ? `\n[![Validation](${patch.url}/actions/workflows/validation.yml/badge.svg)](${patch.url}/actions/workflows/validation.yml)`
    : ''
  badge += `\n[![Build](${patch.url}/actions/workflows/build.yml/badge.svg)](${patch.url}/actions/workflows/build.yml)`
  badge += `\n[![GitHub release](https://img.shields.io/github/v/release/${patch.repo}.svg)](${patch.url}/releases/latest)`

  // Compatibility notice
  let compatible = ''
  if (patch.needsVersions.length > 0) {
    compatible = 'It supports '
    const games = patch.needsVersions.map((version) => {
      switch (version) {
        case 1:
          return '<kbd>Gothic 1</kbd>'
        case 112:
          return '<kbd>Gothic Sequel</kbd>'
        case 130:
          return '<kbd>Gothic II (Classic)</kbd>'
        case 2:
          return '<kbd>Gothic II: NotR</kbd>'
      }
    })
    if (games.length > 1) {
      compatible += games.slice(0, -1).join(', ') + ' and ' + games.slice(-1)
    } else {
      compatible += games[0] + ' only'
    }
    compatible += '.'
  }

  // Installation requirements
  let requirements = ''
  if (patch.needsNinja) {
    requirements = '### Requirements\n\n'
    requirements += '<table><thead><tr>'
    if (patch.needsVersions.includes(1)) requirements += '<th>Gothic</th>'
    if (patch.needsVersions.includes(112)) requirements += '<th>Gothic Sequel</th>'
    if (patch.needsVersions.includes(130)) requirements += '<th>Gothic II (Classic)</th>'
    if (patch.needsVersions.includes(2)) requirements += '<th>Gothic II: NotR</th>'
    requirements += '</tr></thead>\n<tbody><tr>'
    if (patch.needsVersions.includes(1))
      requirements += '<td><a href="https://www.worldofgothic.de/dl/download_34.htm">Version 1.08k_mod</a></td>'
    if (patch.needsVersions.includes(112)) requirements += '<td>Version 1.12f</td>'
    if (patch.needsVersions.includes(130))
      requirements += '<td><a href="https://www.worldofgothic.de/dl/download_278.htm">Report version 1.30.0.0</a></td>'
    if (patch.needsVersions.includes(2))
      requirements += '<td><a href="https://www.worldofgothic.de/dl/download_278.htm">Report version 2.6.0.0</a></td>'
    requirements += `</tr></tbody>\n<tbody><tr><td colspan="${patch.needsVersions.length}" align="center"><a href="https://github.com/szapp/Ninja">Ninja 2.8</a> or higher</td></tr></tbody></table>`
  }

  return fs.writeFile(
    'README.md',
    `# ${patch.name}
${badge}

${patch.description}

This is a modular modification (a.k.a. patch or add-on) that can be installed and uninstalled at any time and is virtually compatible with any modification.
${compatible}

<sup>Generated from [${templateRepo}](${templateRepoUrl}).</sup>

## Installation

1. Download the latest release of \`${patch.name}.vdf\` from the [releases page](${patch.url}/releases/latest).

2. Copy the file \`${patch.name}.vdf\` to \`[Gothic]\\Data\\\`. To uninstall, remove the file again.

<!--
The patch is also available on
- [World of Gothic](https://www.worldofgothic.de/dl/download_XXXX.htm) | [Forum thread](https://forum.worldofplayers.de/forum/threads/XXXXXXX)
- [Spine Mod-Manager](https://clockwork-origins.com/spine/)
${patch.needsVersions.includes(1) ? '- [Steam Workshop Gothic 1](https://steamcommunity.com/sharedfiles/filedetails/?id=XXXXXXXXXX)\n' : ''}${patch.needsVersions.includes(2) ? '- [Steam Workshop Gothic 2](https://steamcommunity.com/sharedfiles/filedetails/?id=XXXXXXXXXX)\n' : ''}-->

${requirements}

<!--

If you are interested in writing your own patch, please do not copy this patch!
Instead refer to the PATCH TEMPLATE to build a foundation that is customized to your needs!
The patch template can found at ${templateRepoUrl}.

-->
`
  )
}

export async function writeLicense(patch: InputParameters): Promise<void> {
  const [licenseTextG1, licenseTextG2] = await Promise.all([
    fs.readFile(path.join('.github', 'actions', 'initialization', 'licenses', 'GOTHIC_MOD_Development_Kit.txt'), 'utf8'),
    fs.readFile(path.join('.github', 'actions', 'initialization', 'licenses', 'GothicMOD-Lizenz.txt'), 'utf8'),
  ])
  const licenses =
    licenseTextG2.replace('20[jj] [Inhaber der ausschließlichen Nutzungsrechte]', new Date().getUTCFullYear() + ' ' + patch.usernameFull) +
    '\n\n' +
    licenseTextG1
  return fs.writeFile('LICENSE', licenses, 'utf8')
}

export async function removeFiles(patch: InputParameters): Promise<void> {
  const delFiles = ['.github/workflows/init.yml', '.github/ISSUE_TEMPLATE', '.github/FUNDING.yml', '.github/actions']
  if (!patch.needsScripts) delFiles.push('.github/workflows/scripts.yml')
  await Promise.all(delFiles.map((file) => io.rmRF(file)))
}
