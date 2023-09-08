import { startMarketMusic } from '@/core/audio';
import { WIDTH, drawEngine } from '@/core/draw-engine';
import GameData, { ProductType, ProductValue, products } from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import RecapState from './recap.state';

export const MARKET_TIME = 10000;
export const MARKET_CUSTOMERS = 20;

export interface Person {
  height: number
  step: number
  speed: number
}

class MarketState implements State {
  gameData: GameData;
  people: Person[] = [];
  productDemand: ProductValue = {};
  productSales: ProductValue = {};
  curtainPos = 0;
  time = 0;

  constructor(gameData: GameData) {
    this.gameData = gameData;
    let people = 20;
    while(people--) {
      const dir = Math.random() > 0.5 ? 1 : -1;
      const p : Person = {
        height: Math.round(Math.random() * 10 - 5),
        step: Math.round(WIDTH * Math.random() * dir),
        speed: (Math.random() * 0.5 + 0.5) * dir,
      };
      this.people.push(p);
    }
  }

  onEnter() {
    startMarketMusic();
    products.map(product => {
      const stock = this.gameData.stock[product];
      if (stock) {
        // calculted total sales based on demand
        const marketPrice = this.gameData.marketPrice[product] || 0;
        const price = this.gameData.price[product] || 1;
        const priceRatio =  marketPrice / price;
        const demand = this.gameData.demand[product] || 0;
        const totalCustomers = MARKET_CUSTOMERS;
        // Product sold each milisecond
        this.productDemand[product] = (priceRatio * demand) * totalCustomers / MARKET_TIME;
        this.productSales[product] = 0;
        console.log(priceRatio, demand);
      }
    });
  }

  onUpdate(timeElapsed = 0) {
    drawEngine.drawBrickWall();
    drawEngine.drawTent();
    drawEngine.drawBoxes();
    drawEngine.drawProducts(this.gameData.stock, this.productSales);
    drawEngine.drawState(this.gameData, this.productSales);
    drawEngine.drawPeople(this.people);
    drawEngine.drawFPS();
    drawEngine.drawClock(this.time);

    if (this.time < MARKET_TIME) {
      this.time += timeElapsed;
      Object.entries(this.productDemand).forEach(([product, demand]) => {
        const s = this.productSales[product as ProductType] || 0;
        if (s < (this.gameData.stock[product as ProductType] || 0)) {
          this.productSales[product as ProductType] = s + demand * timeElapsed;
        }
      });
    }

    if (this.time > MARKET_TIME) {
      // Round over, close curtains
      if (this.curtainPos > 0) {
        this.curtainPos = Math.max(0, this.curtainPos - timeElapsed / 1000);
      } else {
        this.gameData.save(this.productDemand, this.productSales);
        playStateMachine.setState(new RecapState(this.gameData));
      }
    } else if (this.curtainPos < 1) {
      // Start, open curtains
      this.curtainPos = Math.min(1, this.curtainPos + timeElapsed / 1000);
    }
    drawEngine.drawCurtains(this.curtainPos);
  }
}

export default MarketState;
