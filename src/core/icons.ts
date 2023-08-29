// https://xem.github.io/miniPixelArt/

import { ProductType } from "./game-data";

export const PALETTE = [
  '000',
  'c42',
  '2a6',
  '15b',
  'ea0',
  'ddd',
  '642',
].join('');

export type Icon = {
  data: string
  size: number
  spacing: number // size + padding
  offset: number
}

export const icons: {[Property in ProductType]: Icon} = {
  apples: {
    data: "@X@@C@RSERRBWRGx@",
    size: 6,
    spacing: 6,
    offset: 0,
  },
  bread: {
    data: "hmmEmoomm}}momm}hmmExmmGxG@@@@",
    size: 8,
    spacing: 9,
    offset: -1,
  },
  oil: {
    data: "@mm@@m@@XC@[[[X[[C_[{xG",
    size: 7,
    spacing: 9,
    offset: -1,
  },
};