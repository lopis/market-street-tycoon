
export const products = <const> [
  'apples',
  'bread',
  'oil',
  'wood',
  'eggs',
  'pies',
  'ceramics',
  'gems',
  'spice',
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

let names = [
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

const shuffleNames = () => {
  const ns = new Array(names.length);
  while (names.length != 0) {
    let r = Math.round(Math.random() * (ns.length - 1));
    while(ns[r]) {
      r = (r + 1) % ns.length;
    }
    ns[r] = names.pop();
  }
  names = ns;
};

const nextName = () => {
  const n : string = names.pop() as string;
  names.unshift(n);

  return n;
};

export const LOCALSTORAGE_KEY = 'market_street_tycoon_history';

class GameData {
  suppliers: Supplier[] = [];
  money: number;
  stock: ProductValue = {};
  price: ProductValue = {};
  avgCost: ProductValue = {};
  reputation: ProductValue = {};
  demand: ProductValue = {
    'bread': 1,
    'apples': 0.6,
    'oil': 0.5,
    'eggs': 0.8,
    'wood': 1,
    'ceramics': 0.5,
    'pies': 0.8,
    'gems': 0.8,
    'spice': 1,
  };
  marketPrice: ProductValue = {
    'bread': 6,
    'apples': 8,
    'eggs': 4,
    'oil': 16,
    'wood': 3,
    'ceramics': 20,
    'pies': 10,
    'gems': 30,
    'spice': 40,
  };
  spoilProb: ProductValue = {
    'bread': 1,
    'apples': 0.4,
    'eggs': 0.1,
    'oil': 0,
    'wood': 0,
    'ceramics': 0,
    'pies': 1,
    'gems': 0,
  };
  week = 1;
  history: HistoryEntry[] = [];

  constructor() {
    this.money = 15;
    shuffleNames();
    this.seedSuppliers();
  }

  seedSuppliers() {
    this.suppliers = [
      {
        productName: 'apples',
        supplierName: nextName(),
        price: 15,
        stock: 6,
      },
      {
        productName: 'bread',
        supplierName: nextName(),
        price: 15,
        stock: 5,
      },
      {
        productName: 'oil',
        supplierName: nextName(),
        price: 64,
        stock: 4,
      }
    ];
  }

  removeSuppliers() {
    this.suppliers = this.suppliers.filter((supplier: Supplier) => {
      return supplier.stock > 0;
    });
  }

  createSupplier() {
    // Checks if the player is so broke that
    // all suppliers are too expensive.
    const isBroke = !this.suppliers.some(supplier => {
      return this.money >= supplier.price;
    });

    if (isBroke) {
      this.suppliers = this.suppliers.filter(supplier => supplier.productName != 'wood');
      this.suppliers.push({
        productName: 'wood',
        supplierName: nextName(),
        price: this.money,
        stock: Math.ceil(this.money / 2),
      });
    }

    while (this.suppliers.length < 3) {
      const MIN_REPUTATION = 25; // nr of products sold
      let possibleProduct : ProductType[] = ['apples', 'bread', 'oil', 'wood', 'eggs'];
      // @ts-ignore -- it's ok if they are undefined, this still works.
      if(this.reputation['apples'] > MIN_REPUTATION // @ts-ignore
        && this.reputation['bread'] > MIN_REPUTATION // @ts-ignore
        && this.reputation['eggs'] > MIN_REPUTATION // @ts-ignore
      ) {
        possibleProduct.push('pies');
      }
      if(Object.values(this.reputation).some(r => r > MIN_REPUTATION)) {
        possibleProduct.push('ceramics');
        possibleProduct.push('spice');
      }
      // @ts-ignore -- it's ok if they are undefined, this still works.
      if (this.reputation['ceramics'] > MIN_REPUTATION) {
        possibleProduct.push('gems');
      }

      // Avoid repeated products
      possibleProduct = possibleProduct.filter(product => !this.suppliers.some(s => s.productName == product));

      const product = possibleProduct[Math.floor(Math.random() * (possibleProduct.length - 0.01))];
      const reputation = this.reputation[product] || 0;
      const multiplier = 15 * reputation / 100;
      const stock = Math.round(multiplier * Math.random() + 5);
      const price = Math.round(stock * (this.marketPrice[product] || 1) * (0.6 + 0.6 * Math.random()));
      this.suppliers.push({
        productName: product,
        supplierName: nextName(),
        price: price,
        stock: stock,
      });

    }
  }

  loadSave() {
    const save = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!save) return;
    const {history, suppliers, money, stock, reputation, avgCost, price, week} = JSON.parse(save);
    this.history = history;
    this.suppliers = suppliers;
    this.money = money;
    this.stock = stock;
    this.reputation = reputation;
    this.avgCost = avgCost;
    this.price = price;
    this.week = week;
  }

  save() {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({
      history: this.history,
      suppliers: this.suppliers,
      money: this.money,
      stock: this.stock,
      reputation: this.reputation,
      avgCost: this.avgCost,
      price: this.price,
      week: this.week,
    }));
  }

  delete() {
    localStorage.removeItem(LOCALSTORAGE_KEY);
  }

  recordHistory(demand: ProductValue, sales: ProductValue){
    this.history[this.week] = { demand, sales };
  }
}

export default GameData;