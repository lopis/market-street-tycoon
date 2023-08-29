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
    data: "@@@@@@C@@X@@PZj@PRR@xRz@@G@@@@@",
    size: 8,
    spacing: 6,
    offset: 0,
  },
  bread: {
    data: "@@@@@@@@@@@mmm@h}}mEhmooExmmmG@mmm@@om}@@@@@@@@",
    size: 10,
    spacing: 9,
    offset: 0,
  },
  oil: {
    data: "@@@@@@@@@@@hmE@@@m@@@@[@@@[[[@@[[[@@_[{@@@@@@@@",
    size: 10,
    spacing: 9,
    offset: 0,
  },
};