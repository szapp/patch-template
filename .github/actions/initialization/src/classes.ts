import { z } from 'zod'
import { warnings } from './main'

export class VerboseError extends Error {
  details: string
  constructor(message: string, details: string) {
    super(message)
    this.details = details
  }
}

export class AggregateError extends Error {}

const TrueFalse = z
  .union([z.literal('true'), z.literal('false'), z.literal(true), z.literal(false)])
  .transform((val) => val === 'true' || val === true)

const GameSwitch = z
  .object({
    'Gothic 1': TrueFalse,
    'Gothic Sequel': TrueFalse,
    'Gothic 2 Classic': TrueFalse,
    'Gothic 2 NotR': TrueFalse,
  })
  .required()
  .transform((obj) => {
    const prop: number[] = []
    if (obj['Gothic 1']) prop.push(1)
    if (obj['Gothic Sequel']) prop.push(112)
    if (obj['Gothic 2 Classic']) prop.push(130)
    if (obj['Gothic 2 NotR']) prop.push(2)
    return prop
  })

export const InputParameters = z
  .object({
    'Content scripts': GameSwitch,
    'Ikarus and LeGo': z
      .object({
        Ikarus: TrueFalse,
        LeGo: TrueFalse,
      })
      .required()
      .transform((data) => {
        if (data.LeGo && !data.Ikarus) {
          warnings.push(new VerboseError('LeGo is enabled without Ikarus', 'LeGo requires Ikarus. Adding Ikarus to selection'))
          return { Ikarus: true, LeGo: true }
        }
        return { Ikarus: data.Ikarus, LeGo: data.LeGo }
      }),
    'Content initialization': z
      .object({
        'Content initialization function': TrueFalse,
      })
      .required()
      .transform((obj) => obj['Content initialization function']),
    'Menu initialization': z
      .object({
        'Menu initialization function': TrueFalse,
      })
      .required()
      .transform((obj) => obj['Menu initialization function']),
    'Menu scripts': GameSwitch,
    'Particle FX scripts': GameSwitch,
    'Visual FX scripts': GameSwitch,
    'Sound FX scripts': GameSwitch,
    'Music scripts': GameSwitch,
    'Camera scripts': GameSwitch,
    'Fight AI scripts': GameSwitch,
    'Output units': GameSwitch,
    Animations: GameSwitch,
  })
  .required()
  .refine((data) => (data['Content initialization'] ? data['Content scripts'].length > 0 : true), {
    message: 'Cannot use initialization without using content scripts',
    path: ['Content initialization'],
  })
  .refine((data) => (data['Menu initialization'] ? data['Content scripts'].length > 0 : true), {
    message: 'Cannot use initialization without using content scripts',
    path: ['Menu initialization'],
  })
  .refine((data) => (data['Ikarus and LeGo'].Ikarus ? data['Content scripts'].length > 0 : true), {
    message: 'Cannot use Ikarus without using content scripts',
    path: ['Ikarus and LeGo', 'Ikarus'],
  })
  .transform((data) => {
    const out = {
      content: data['Content scripts'],
      menu: data['Menu scripts'],
      pfx: data['Particle FX scripts'],
      vfx: data['Visual FX scripts'],
      sfx: data['Sound FX scripts'],
      music: data['Music scripts'],
      camera: data['Camera scripts'],
      fight: data['Fight AI scripts'],
      ou: data['Output units'],
      anim: data['Animations'],
      ikarus: data['Ikarus and LeGo'].Ikarus,
      lego: data['Ikarus and LeGo'].LeGo,
      initContent: data['Content initialization'],
      initMenu: data['Menu initialization'],
      needsContentScripts: false,
      needsScripts: false,
      needsNinja: false,
      needsInit: false,
      needsVersions: [0],
      name: '',
      description: '',
      username: '',
      usernameFull: '',
      userEmail: '',
      repo: '',
      url: '',
    }
    out.needsContentScripts = out.content.length > 0
    out.needsScripts =
      out.needsContentScripts || [...out.menu, ...out.pfx, ...out.vfx, ...out.sfx, ...out.music, ...out.camera, ...out.fight].length > 0
    out.needsNinja = out.needsScripts || [...out.ou, ...out.anim].length > 0
    out.needsInit = out.initContent || out.initMenu
    out.needsVersions = [
      ...new Set([
        ...out.content,
        ...out.menu,
        ...out.pfx,
        ...out.vfx,
        ...out.sfx,
        ...out.music,
        ...out.camera,
        ...out.fight,
        ...out.ou,
        ...out.anim,
      ]),
    ]
    return out
  })
export type InputParameters = z.infer<typeof InputParameters>
