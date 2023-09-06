import { controls } from '@/core/controls';
import { HEIGHT, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import StockState from './stock.state';

class BuyState implements State {
  gameData: GameData;
  selection = 0;

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  next() {
    playStateMachine.setState(new StockState(this.gameData));
  }

  onUpdate() {
    drawEngine.drawBrickWall();
    drawEngine.drawOverlay();

    drawEngine.drawText(`Week ${this.gameData.week} - Suppliers`, 10, 1, 1, 'indianred');
    drawEngine.drawText(`${this.gameData.money}$`, 10, WIDTH, 1, 'green', 'right');

    this.gameData.suppliers
    .forEach((supplier, index) => {
      const row = index * 24 + 24;

      drawEngine.drawText(supplier.supplierName, 10, 1, 1 + row, 'gray');
      const productLine = `${supplier.stock} ${supplier.productName}   ${supplier.price}$`;
      drawEngine.drawText(
        supplier.stock ? productLine : 'soldout',
        10, 1, row + 11, 'gray'
      );

      drawEngine.drawButton(
        WIDTH - 20,
        row + 5,
        this.selection === index ? 'white' : 'gray',
        'BUY'
      );
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
    controls.updateSelection(this, this.gameData.suppliers.length);


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

export default BuyState;
