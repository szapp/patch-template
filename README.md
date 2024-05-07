# Patch Template

[![Coverage](.github/actions/initialization/badges/coverage.svg)](https://github.com/szapp/patch-template)

Initialize a new Gothic VDF patch right on here GitHub.

Generating a repository from this template will initialize a new Gothic VDF patch with the necessary file structure based on individual needs. 
It is helpful to get started with a new patch and ensures everything is setup right from the start with all the necessary checks and build scripts.

Let's get started!

## Create a patch

### 1️⃣ Generate a repository [from the template](https://repo.new/?template_name=patch-template&template_owner=szapp)

> <sup>Do not fork this repository, but generate from template!</sup>  
  [![Template](.github/actions/initialization/badges/template.png)](https://repo.new/?template_name=patch-template&template_owner=szapp)

### 2️⃣ In the new repo, open a [GitHub issue](../../issues/new/choose) to initialize the patch

> <sup>The generated repository's name and its description will serve as the name and description of the patch.</sup>

### 3️⃣ Wait for the initialization to complete

> <sup>Follow the next steps in the generated issue comments.</sup>

## Checks and continuous integration

The generated patch repository will be equipped with tests and continuous integration using the following GitHub Actions.

<table><tbody>
  <tr><td>
    
  [![szapp/parsiphae-action](https://img.shields.io/badge/szapp-parsiphae--action-34D058?logo=github&logoColor=959DA5&labelColor=444D56)](https://github.com/szapp/parsiphae-action)
    
  </td>
  <td>checks the Daedalus syntax on every commit.</td>
  </tr>
  <tr><td>
    
  [![szapp/patch-validator](https://img.shields.io/badge/szapp-patch--validator-34D058?logo=github&logoColor=959DA5&labelColor=444D56)](https://github.com/szapp/patch-validator)
  
  </td>
  <td>checks the Daedalus symbols and resource file names on every commit.</td>
  </tr>
  <tr><td>
  
  [![kirides/vdfsbuilder](https://img.shields.io/badge/kirides-vdfsbuilder-34D058?logo=github&logoColor=959DA5&labelColor=444D56)](https://github.com/kirides/vdfsbuilder)
  
  </td>
  <td>builds the patch into a ready to use VDF on every tag and release.</td>
  </tr>
</tbody></table>

## Documentation

For details on writing patches, please consult the [Ninja documentation](https://github.com/szapp/Ninja/wiki).

## Troubleshooting

In case the initialization does not start automatically after opening an issue in the generated repository, check the repository settings.
Actions and workflows should not be disabled. After enabling them create a new issue and try again.
