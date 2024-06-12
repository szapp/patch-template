import { InputParameters, VerboseError } from '../src/classes'
import * as infos from '../src/infos'

const infoAlways: VerboseError[] = [
  new VerboseError('Add Resources', ''),
  new VerboseError(
    'Build the Patch',
    'In GothicVDFS click <kdb>Builder</kbd> and then <kbd>Open Script</kbd>. Navigate to and open <code>Test-patch.vm</code>. Adjust <kbd>Root Path</kbd> to the same directory. Confirm the contents of the fields and click <kbd>Build volume</kbd>. Alternatively, you can build the VDF using the automatic GitHub workflow of this repository.'
  ),
  new VerboseError('Consult the documentation', ''),
]

describe('header', () => {
  it('should return the correct header with patch name', () => {
    expect(infos.header('test')).toContain('🎉 test 🎉')
  })

  it('should return the correct header with wild card', () => {
    expect(infos.header()).toContain('🎉 Success 🎉')
  })
})

describe('listNextSteps', () => {
  it('should add all infos (except ikarus)', () => {
    const patch: InputParameters = {
      name: 'Test-patch',
      needsVersions: [112, 130],
      needsScripts: true,
      needsNinja: true,
      ou: [1, 2, 3],
      anim: [4, 5],
      lego: true,
      ikarus: true,
    } as InputParameters
    const infosArr: VerboseError[] = []

    infos.listNextSteps(patch, infosArr)

    expect(infosArr).toHaveLength(8)
    expect(infosArr[0].message).toBe('Add Scripts')
    expect(infosArr[1].message).toBe('Add Output Units')
    expect(infosArr[2].message).toBe('Add Animations')
    expect(infosArr[3].message).toBe(infoAlways[0].message)
    expect(infosArr[4].message).toBe(infoAlways[1].message)
    expect(infosArr[4].details).toBe(infoAlways[1].details)
    expect(infosArr[5].message).toBe(infoAlways[2].message)
    expect(infosArr[6].message).toBe('Test the Patch')
    expect(infosArr[6].details).toBe(
      'Throughly test your patch in Gothic with different mods. It is important to try various mods that <i>do not</i> use LeGo!'
    )
    expect(infosArr[7].message).toBe('Increase Visibility on GitHub')
    expect(infosArr[7].details).toBe(
      'To make your patch repository easier to find on GitHub, you may want to add the following common keyword topics by editing the repository details. <kbd>gothic</kbd> <kbd>gothic1</kbd> <kbd>gothic2</kbd> <kbd>modding-gothic</kbd> <kbd>ninja</kbd> <kbd>daedalus</kbd>'
    )
  })

  it('should add only basic infos including ikarus', () => {
    const patch: InputParameters = {
      name: 'Test-patch',
      needsVersions: [1],
      needsScripts: false,
      needsNinja: false,
      ou: [] as number[],
      anim: [] as number[],
      lego: false,
      ikarus: true,
    } as InputParameters
    const infosArr: VerboseError[] = []

    infos.listNextSteps(patch, infosArr)

    expect(infosArr).toHaveLength(6)
    expect(infosArr[0].message).toBe(infoAlways[0].message)
    expect(infosArr[1].message).toBe(infoAlways[1].message)
    expect(infosArr[1].details).toBe(infoAlways[1].details)
    expect(infosArr[2].message).toBe(infoAlways[2].message)
    expect(infosArr[3].message).toBe('Test the Patch')
    expect(infosArr[3].details).toBe(
      'Throughly test your patch in Gothic with different mods. It is important to try various mods that <i>do not</i> use Ikarus!'
    )
    expect(infosArr[4].message).toBe('Setup auto-deployment on Steam Workshop (optional)')
    expect(infosArr[4].details).toBe(
      'If you release your patch on the Steam Workshop for Gothic 1, you can enable auto-deployment of new versions by following the steps in `.github/workflows/build.yml`.'
    )
    expect(infosArr[5].message).toBe('Increase Visibility on GitHub')
    expect(infosArr[5].details).toBe(
      'To make your patch repository easier to find on GitHub, you may want to add the following common keyword topics by editing the repository details. <kbd>gothic</kbd> <kbd>gothic1</kbd> <kbd>modding-gothic</kbd>'
    )
  })

  it('should add only basic infos without ikarus and lego', () => {
    const patch: InputParameters = {
      name: 'Test-patch',
      needsVersions: [1, 2],
      needsScripts: false,
      needsNinja: false,
      ou: [] as number[],
      anim: [] as number[],
      lego: false,
      ikarus: false,
    } as InputParameters
    const infosArr: VerboseError[] = []

    infos.listNextSteps(patch, infosArr)

    expect(infosArr).toHaveLength(6)
    expect(infosArr[0].message).toBe(infoAlways[0].message)
    expect(infosArr[1].message).toBe(infoAlways[1].message)
    expect(infosArr[1].details).toBe(infoAlways[1].details)
    expect(infosArr[2].message).toBe(infoAlways[2].message)
    expect(infosArr[3].message).toBe('Test the Patch')
    expect(infosArr[3].details).toBe('Throughly test your patch in Gothic with different mods.')
    expect(infosArr[4].message).toBe('Setup auto-deployment on Steam Workshop (optional)')
    expect(infosArr[4].details).toBe(
      'If you release your patch on the Steam Workshop for Gothic 1 and/or Gothic 2, you can enable auto-deployment of new versions by following the steps in `.github/workflows/build.yml`.'
    )
    expect(infosArr[5].message).toBe('Increase Visibility on GitHub')
    expect(infosArr[5].details).toBe(
      'To make your patch repository easier to find on GitHub, you may want to add the following common keyword topics by editing the repository details. <kbd>gothic</kbd> <kbd>gothic1</kbd> <kbd>gothic2</kbd> <kbd>modding-gothic</kbd>'
    )
  })
})

describe('suggestTopics', () => {
  it('should return all topics', async () => {
    const patch = {
      needsVersions: [112, 130],
      needsNinja: true,
      needsScripts: true,
    } as InputParameters

    const suggestedTopics = infos.suggestTopics(patch)

    expect(suggestedTopics).toEqual(['gothic', 'gothic1', 'gothic2', 'modding-gothic', 'ninja', 'daedalus'])
  })

  it('should return fewer topics', async () => {
    const patch = {
      needsVersions: [1],
      needsNinja: false,
      needsScripts: false,
    } as InputParameters

    const suggestedTopics = infos.suggestTopics(patch)

    expect(suggestedTopics).toEqual(['gothic', 'gothic1', 'modding-gothic'])
  })
})
