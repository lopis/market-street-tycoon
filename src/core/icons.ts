// https://xem.github.io/miniPixelArt/

import { ProductType } from './game-data';

export type Icon = {
  data: string
  size: number
  padding: number // size + padding
  y: number
}

export const icons: {[Property in ProductType]: Icon} = {
  'apples': {
    data: '@X@@C@RSERRBWRGx@',
    size: 6,
    padding: 6,
    y: 0,
  },
  'bread': {
    data: 'hmmEmoomm}}momm}hmmExmmGxG@@@@',
    size: 8,
    padding: 9,
    y: -1,
  },
  'oil': {
    data: '@mm@@m@@XC@[[[X[[C_[{xG',
    size: 7,
    padding: 9,
    y: -1,
  },
  'wood': {
    data: '@II@HIIAHIIAHAxmmGx}oGxmmG@@',
    size: 8,
    padding: 8,
    y: -2,
  },
  'pies': {
    data: '@@@@xGojjzWUU}xG@@@@',
    size: 8,
     padding: 9,
     y: 0,
  },
  'ceramics': {
    data: 'PRRB@RR@PRRBQRRJJIIQRRRRQRRJHIIA',
    size: 8,
    padding: 9,
    y: -1,
  },
  'gems': {
    data: '@@@@`d@hdlh`dhE@@EE@E@mE@',
    size: 7,
    padding: 10,
    y: -1,
  },
  'spice': {
    data: '@@@@@PG@@Rz@PRWGRRzzPRWG@@@@@@@@',
    size: 8,
    padding: 8,
    y: -1,
  },
  'eggs': {
    data: 'hEhmEmmhmEhE@',
    size: 5,
    padding: 5,
    y: 0,
  }
};