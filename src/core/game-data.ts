
export const products = <const> [
  'apples',
  'bread',
  'oil'
];

export type ProductType = typeof products[number]

export type Supplier = {
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
  demand: ProductValue = {
    'bread': 1,
    'apples': 0.6,
    'oil': 0.4,
  };
  marketPrice: ProductValue = {
    'bread': 3,
    'apples': 4,
    'oil': 8,
  };
  spoilRate: ProductValue = {
    'bread': 1,
    'apples': 0.4,
    'oil': 0,
  };
  week = 1;
  history: HistoryEntry[] = [];

  constructor() {
    this.money = 16;
    const bread: Supplier = {
      productName: 'bread',
      supplierName: nextName(),
      price: 0, //16,
      stock: 8,
    };
    this.suppliers.push(bread);

    const apples: Supplier = {
      productName: 'apples',
      supplierName: nextName(),
      price: 0, //16,
      stock: 8,
    };
    this.suppliers.push(apples);

    const oil: Supplier = {
      productName: 'oil',
      supplierName: nextName(),
      price: 0, //22,
      stock: 4,
    };
    this.suppliers.push(oil);
  }

  loadSave() {
    const save = localStorage.getItem('history');
    if (!save) return;
    const {history, suppliers, money, stock} = JSON.parse(save);
    this.history = history;
    this.suppliers = suppliers;
    this.money = money;
    this.stock = stock;
    this.week = history.length;
  }

  save(demand: ProductValue, sales: ProductValue) {
    this.history[this.week] = { demand, sales };
    localStorage.setItem('history', JSON.stringify({
      history: this.history,
      suppliers: this.suppliers,
      money: this.money,
      stock: this.stock,
    }));
  }
}

export default GameData;