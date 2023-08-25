type ProductType =
  'apples'
  |'bread'
  |'olives'

type Supplier = {
  product: ProductType
  name: string
  price: number
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

  constructor() {
    const apple1: Supplier = {
      product: 'apples',
      name: nextName(),
      price: 1
    };
    this.suppliers.push(apple1);

    const apple2: Supplier = {
      product: 'apples',
      name: nextName(),
      price: 2
    };
    this.suppliers.push(apple2);
  }
}

export default GameData;