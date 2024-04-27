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
      needsScripts: true,
      ou: [1, 2, 3],
      anim: [4, 5],
      lego: true,
      ikarus: true,
    } as InputParameters
    const infosArr: VerboseError[] = []

    infos.listNextSteps(patch, infosArr)

    expect(infosArr).toHaveLength(7)
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
  })

  it('should add only basic infos including ikarus', () => {
    const patch: InputParameters = {
      name: 'Test-patch',
      needsScripts: false,
      ou: [] as number[],
      anim: [] as number[],
      lego: false,
      ikarus: true,
    } as InputParameters
    const infosArr: VerboseError[] = []

    infos.listNextSteps(patch, infosArr)

    expect(infosArr).toHaveLength(4)
    expect(infosArr[0].message).toBe(infoAlways[0].message)
    expect(infosArr[1].message).toBe(infoAlways[1].message)
    expect(infosArr[1].details).toBe(infoAlways[1].details)
    expect(infosArr[2].message).toBe(infoAlways[2].message)
    expect(infosArr[3].message).toBe('Test the Patch')
    expect(infosArr[3].details).toBe(
      'Throughly test your patch in Gothic with different mods. It is important to try various mods that <i>do not</i> use Ikarus!'
    )
  })

  it('should add only basic infos without ikarus and lego', () => {
    const patch: InputParameters = {
      name: 'Test-patch',
      needsScripts: false,
      ou: [] as number[],
      anim: [] as number[],
      lego: false,
      ikarus: false,
    } as InputParameters
    const infosArr: VerboseError[] = []

    infos.listNextSteps(patch, infosArr)

    expect(infosArr).toHaveLength(4)
    expect(infosArr[0].message).toBe(infoAlways[0].message)
    expect(infosArr[1].message).toBe(infoAlways[1].message)
    expect(infosArr[1].details).toBe(infoAlways[1].details)
    expect(infosArr[2].message).toBe(infoAlways[2].message)
    expect(infosArr[3].message).toBe('Test the Patch')
    expect(infosArr[3].details).toBe('Throughly test your patch in Gothic with different mods.')
  })
})
