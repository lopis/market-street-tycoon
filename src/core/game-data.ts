
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

export type ProductValue = {[Property in ProductType]?: number}

type HistoryEntry = {
  demand: ProductValue
  sales: ProductValue
}

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
  stock: ProductValue = {};
  price: ProductValue = {};
  demand: ProductValue = {};
  marketPrice: ProductValue = {};
  week = 1;
  history: HistoryEntry[] = [];

  constructor() {
    this.money = 20;
    const bread: Supplier = {
      productName: 'bread',
      supplierName: nextName(),
      price: 10,
      stock: 10,
    };
    this.demand.bread = 0.6;
    this.marketPrice.bread = 3;
    this.suppliers.push(bread);

    const apples: Supplier = {
      productName: 'apples',
      supplierName: nextName(),
      price: 20,
      stock: 24,
    };
    this.demand.apples = 0.5;
    this.marketPrice.apples = 4;
    this.suppliers.push(apples);

    const oil: Supplier = {
      productName: 'oil',
      supplierName: nextName(),
      price: 25,
      stock: 10,
    };
    this.demand.oil = 0.3;
    this.marketPrice.oil = 8;
    this.suppliers.push(oil);
  }

  save(demand: ProductValue, sales: ProductValue) {
    this.history[this.week] = { demand, sales };
  }
}

export default GameData;