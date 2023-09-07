
export const products = <const> [
  'apples',
  'bread',
  'oil'
];

export type ProductType = typeof products[number]

type Supplier = {
  productName: ProductType
  supplierName: string
  price: number
  stock: number
}

export type Stock = {[Property in ProductType]?: number}

const names = [
  'Catarina',
  'Leonor',
  'Bento',
  'Marcos',
  'Aparícia',
  'Isabel',
  'Manuel',
  'Graça',
  'Teresa',
  'Vicente',
  'Jacinta',
  'João',
  'Diogo',
  'Simão',
  'Luciana',
  'Gil',
];

const nextName = () => {
  const n : string = names.pop() as string;
  names.unshift(n);

  return n;
};

class GameData {
  suppliers: Supplier[] = [];
  money: number;
  stock: Stock = {};
  price: {[Property in ProductType]?: number} = {};
  week = 1;

  constructor() {
    this.money = 20;
    const apple1: Supplier = {
      productName: 'apples',
      supplierName: nextName(),
      price: 10,
      stock: 10,
    };
    this.suppliers.push(apple1);

    const apple2: Supplier = {
      productName: 'apples',
      supplierName: nextName(),
      price: 20,
      stock: 24,
    };
    this.suppliers.push(apple2);
  }
}

export default GameData;