import { controls } from '@/core/controls';
import { HEIGHT, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData, { products } from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import MarketState from './market.state';

class StockState implements State {
  gameData: GameData;
  selection = 0;

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  next() {
    playStateMachine.setState(new MarketState(this.gameData));
  }

  onUpdate() {
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
      drawEngine.drawText('15$', 10, WIDTH - 33, row + 7, 'gray', 'center');
    });

    drawEngine.drawButton(
      WIDTH / 2,
      HEIGHT - 15,
      this.selection === this.gameData.suppliers.length ? 'white' : 'gray',
      'next'
    );

    this.updateControls();
  }

  updateControls() {
    controls.updateSelection(this);

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      const supplier = this.gameData.suppliers[this.selection];
      if (
        supplier &&
        supplier.stock > 0
        && supplier.price <= this.gameData.money
      ) {
        this.gameData.money -= supplier.price;
        // @ts-ignore
        this.gameData.stock[supplier.productName] += supplier.stock;
        supplier.stock = 0;
      }

      if (this.selection == this.gameData.suppliers.length) {
        this.next();
      }
    }
  }
}

export default StockState;
