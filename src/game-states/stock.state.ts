import { controls } from '@/core/controls';
import { HEIGHT, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData, { ProductType, products } from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import MarketState from './market.state';

class StockState implements State {
  gameData: GameData;
  selection = 0;
  private products: ProductType[] = [];
  curtainPos = 2;

  constructor(gameData: GameData) {
    this.gameData = gameData;
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
    console.log(this.products);
  }

  onUpdate(timeElapsed = 0) {
    drawEngine.drawBrickWall();
    drawEngine.drawOverlay();

    drawEngine.drawText(`Week ${this.gameData.week} - Manage Stock`, 10, 1, 1, 'indianred');
    drawEngine.drawText(`${this.gameData.money}$`, 10, WIDTH, 1, 'green', 'right');

    products
    .forEach((product, index) => {
      const row = index * 24 + 24;
      const stock = this.gameData.stock[product];

      if (!stock) return;

      drawEngine.drawText(product, 10, 1, 1 + row, 'gray');
      drawEngine.drawText(`${stock}`, 10, 1, row + 11, 'gray');

      ['-', '+'].map((s,i) => drawEngine.drawButton(
        WIDTH - 60 + i*53,
        row + 5,
        this.selection === index ? 'white' : 'gray',
        s
      ));
      drawEngine.drawText(`${this.gameData.price[product]}$`, 10, WIDTH - 33, row + 7, 'gray', 'center');
    });

    drawEngine.drawButton(
      WIDTH / 2,
      HEIGHT - 15,
      this.selection === this.products.length ? 'white' : 'gray',
      'next'
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
    if((isLeft || isRight) && this.selection < Object.keys(this.gameData.stock).length) {
      // @ts-ignore
      const product: [ProductType, number] = Object.entries(this.gameData.stock)[this.selection];
      if (product && this.gameData.price[product[0]] != undefined) {
        // @ts-ignore
        this.gameData.price[product[0]] = Math.max(0, this.gameData.price[product[0]] + (isLeft ? -1 : 1));
      }
    }

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      if (this.selection == this.products.length) {
        this.curtainPos = 0;
        setTimeout(() => {
          this.next();
        }, 1200);
      }
    }
  }
}

export default StockState;
