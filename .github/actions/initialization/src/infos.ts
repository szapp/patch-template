import { InputParameters, VerboseError } from './classes'

export function header(patchName: string = 'Success'): string {
  return `
---

<table><tr><td width="2000" align="center">

# 🎉 ${patchName} 🎉

#### You are now ready to start working on your Gothic patch. The following steps are recommended to get you started.

<br /></td></tr></table>

> [!TIP]
> A VM script was created with which you can create the VDF using [GothicVDFS](http://www.bendlins.de/nico/gothic2/)

## Next Steps

`
}

export function listNextSteps(patch: InputParameters, infos: VerboseError[]): void {
  if (patch.needsScripts)
    infos.push(
      new VerboseError(
        'Add Scripts',
        'Add any necessary scripts in the subdirectories <code>Content</code> and <code>System</code> and register them in the respective SRC files. Be sure to follow the <a href="https://github.com/szapp/Ninja/wiki/Inject-Changes#naming-conventions">naming convention</a> to ensure compatibility with other mods.'
      )
    )
  if (patch.ou.length > 0)
    infos.push(
      new VerboseError(
        'Add Output Units',
        'The OU files are empty place holders. Replace them with your compiled versions (e.g. using Redefix). Either the CSL or the BIN file will suffice. Not both of them are required.'
      )
    )
  if (patch.anim.length > 0)
    infos.push(
      new VerboseError(
        'Add Animations',
        'The MDS file is an empty place holder. Copy/rename it to the desired model name and fill in your new armor/animations.'
      )
    )
  infos.push(
    new VerboseError(
      'Add Resources',
      'If you have further resources like textures, meshes or animations, add them in the respective directory (<code>_compiled</code>) in the directory <code>_work</code> and add their paths to the VM script. See the comments inside the VM script.'
    )
  )
  infos.push(
    new VerboseError(
      'Build the Patch',
      `In GothicVDFS click <kdb>Builder</kbd> and then <kbd>Open Script</kbd>. Navigate to and open <code>${patch.name}.vm</code>. Adjust <kbd>Root Path</kbd> to the same directory. Confirm the contents of the fields and click <kbd>Build volume</kbd>. Alternatively, you can build the VDF using the automatic GitHub workflow of this repository.`
    )
  )
  infos.push(
    new VerboseError(
      'Consult the documentation',
      'Have a look into the Ninja documentation to learn more about the possibilities of using Ninja. You can find the documentation <a href="https://github.com/szapp/Ninja">here</a>.'
    )
  )
  infos.push(
    new VerboseError(
      'Test the Patch',
      'Throughly test your patch in Gothic with different mods.' +
        (patch.lego
          ? ' It is important to try various mods that <i>do not</i> use LeGo!'
          : patch.ikarus
            ? ' It is important to try various mods that <i>do not</i> use Ikarus!'
            : '')
    )
  )
}
