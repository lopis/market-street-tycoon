import { controls } from '@/core/controls';
import { A_WHITE, HEIGHT, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import StockState from './stock.state';
import { icons } from '@/core/icons';

class BuyState implements State {
  gameData: GameData;
  selection = 0;
  active = -1;

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  next() {
    playStateMachine.setState(new StockState(this.gameData));
  }

  onUpdate() {
    drawEngine.drawOverlay(this.gameData.week);

    drawEngine.drawHeader('Suppliers', this.gameData);

    this.gameData.suppliers
    .forEach((supplier, index) => {
      const row = index * 24 + 24;

      drawEngine.drawIcon(icons[supplier.productName], 3, row + 6);

      drawEngine.drawText(supplier.supplierName, 10, 12, 1 + row, A_WHITE);
      const productLine = `${supplier.stock} ${supplier.productName}   ${supplier.price}$`;
      drawEngine.drawText(
        supplier.stock ? productLine : 'soldout',
        10, 12, row + 11, A_WHITE
      );

      drawEngine.drawButton(
        WIDTH - 20,
        row + 5,
        this.selection === index ? 'white' : A_WHITE,
        'BUY',
        this.active === index
      );
    });

    drawEngine.drawButton(
      WIDTH / 2,
      HEIGHT - 15,
      this.selection === this.gameData.suppliers.length ? 'white' : A_WHITE,
      'next',
      this.active === this.gameData.suppliers.length
    );

    this.updateControls();
  }

  updateControls() {
    controls.updateSelection(this, this.gameData.suppliers.length);

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      this.active = this.selection;
      setTimeout(() => {
        this.active = -1;
      }, 100);
      const supplier = this.gameData.suppliers[this.selection];
      if (
        supplier &&
        supplier.stock > 0
        && supplier.price <= this.gameData.money
      ) {
        this.gameData.money -= supplier.price;
        const s = this.gameData.stock[supplier.productName] || 0;
        this.gameData.stock[supplier.productName] = s + supplier.stock;
      }

      if (this.selection == this.gameData.suppliers.length) {
        this.next();
      }
    }
  }
}

export default BuyState;
