import { UnionToTuple } from '../types/ts-utils.ts'
import config from '../../config.ts'

export type Word = keyof typeof config.nodes

export const words = Object.keys(config) as UnionToTuple<Word>
