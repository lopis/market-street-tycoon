const products = <const> [
  'apples',
  'bread',
  'oil'
];

export type ProductType = typeof products[number]

type Supplier = {
  product: ProductType
  name: string
  price: number
  stock: number
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
  'Luciana',
  'Simão',
  'Gil',
];

const nextName = () => {
  const name : string = names.pop() as string;
  names.unshift(name);

  return name;
};

class GameData {
  suppliers: Supplier[] = [];
  money: number;
  stock: {[Property in ProductType]?: number} = {};
  week: number = 1;

  constructor() {
    products.forEach(product => {
      this.stock[product] = 30;
    });

    this.money = 2;
    const apple1: Supplier = {
      product: 'apples',
      name: nextName(),
      price: 1,
      stock: 10,
    };
    this.suppliers.push(apple1);

    const apple2: Supplier = {
      product: 'apples',
      name: nextName(),
      price: 2,
      stock: 24,
    };
    this.suppliers.push(apple2);
  }
}

export default GameData;