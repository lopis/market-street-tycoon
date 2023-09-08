import { controls } from '@/core/controls';
import { A_WHITE, HEIGHT, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData, { ProductType, products } from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import MarketState from './market.state';
import BuyState from './buy.state';

class StockState implements State {
  gameData: GameData;
  selection = 0;
  active = [-1, ''];
  private products: ProductType[] = [];
  curtainPos = 2;
  backSelected = false;

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  back() {
    playStateMachine.setState(new BuyState(this.gameData));
  }

  next() {
    playStateMachine.setState(new MarketState(this.gameData));
  }

  onEnter() {
    this.products = products.filter(product => {
      const stock = this.gameData.stock[product];
      if (!this.gameData.price[product]){
        this.gameData.price[product] = 15;
      }
      return !!stock;
    });
  }

  onUpdate(timeElapsed = 0) {
    drawEngine.drawOverlay(this.gameData.week);
    drawEngine.drawHeader('Manage stock', this.gameData);

    let index = 0;
    this.products
    .forEach((product) => {
      const row = index * 24 + 24;
      const stock = this.gameData.stock[product];

      if (!stock) return;

      drawEngine.drawText(product, 10, 1, 1 + row, A_WHITE);
      drawEngine.drawText(`${stock}`, 10, 1, row + 11, A_WHITE);

      ['–', '+'].map((s,i) => drawEngine.drawButton(
        WIDTH - 60 + i*53,
        row + 5,
        this.selection === index ? 'white' : A_WHITE,
        s,
        this.active[0] === index && this.active[1] === s,
      ));
      drawEngine.drawText(`${this.gameData.price[product as ProductType]}$`, 10, WIDTH - 33, row + 7, A_WHITE, 'center');
      index++;
    });

    drawEngine.drawButton(
      WIDTH - 30,
      HEIGHT - 15,
      !this.backSelected && this.selection === this.products.length ? 'white' : A_WHITE,
      'next',
    );

    drawEngine.drawButton(
      30,
      HEIGHT - 15,
      this.backSelected && this.selection === this.products.length ? 'white' : A_WHITE,
      'back',
    );

    if (this.curtainPos != 2) {
      this.curtainPos = Math.min(1, this.curtainPos + timeElapsed / 1000);
      drawEngine.drawCurtains(1 - this.curtainPos);
    }

    this.updateControls();
  }

  updateControls() {
    controls.updateSelection(this, this.products.length);

    const isLeft = controls.isLeft && !controls.previousState.isLeft;
    const isRight = controls.isRight && !controls.previousState.isRight;
    if((isLeft || isRight)) {
      if (this.selection < Object.keys(this.gameData.stock).length) {
        this.active = [this.selection, isLeft ? '-' : '+'];
        setTimeout(() => {
          this.active = [-1, ''];
        }, 100);

        const product = this.products[this.selection];
        if (product && this.gameData.price[product as ProductType] != undefined) {
          // @ts-ignore
          this.gameData.price[product] = Math.max(0, this.gameData.price[product] + (isLeft ? -1 : 1));
        }
      } else {
        this.backSelected = !this.backSelected;
      }
    }

    if (controls.isConfirm && !controls.previousState.isConfirm && this.curtainPos === 2) {
      if (this.selection == this.products.length) {
        if (this.backSelected) {
          this.back();
        } else {
          this.curtainPos = 0;
          setTimeout(() => {
            this.next();
          }, 1200);
        }
      }
    }
  }
}

export default StockState;
