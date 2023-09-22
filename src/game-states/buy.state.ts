import { controls } from '@/core/controls';
import { A_WHITE, BLACK, HEIGHT, WHITE1, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import StockState from './stock.state';
import { icons } from '@/core/icons';
import { keySound } from '@/core/audio';

class BuyState implements State {
  gameData: GameData;
  selection = 0;
  active = -1;
  isGoingBack = false;
  totalTime = 0;

  constructor(gameData: GameData, isGoingBack = false) {
    this.gameData = gameData;
    this.isGoingBack = isGoingBack;
  }

  next() {
    playStateMachine.setState(new StockState(this.gameData));
  }

  onEnter() {
    this.gameData.removeSuppliers();
    this.gameData.save();
    if (!this.isGoingBack) {
      this.gameData.createSupplier();
    }
  }

  onUpdate(timeElapsed = 0) {
    this.totalTime += timeElapsed;
    drawEngine.drawOverlay(this.gameData.week);

    drawEngine.drawHeader('Suppliers', this.gameData);

    this.gameData.suppliers
    .forEach((supplier, index) => {
      const row = index * 28 + 15;

      drawEngine.drawIcon(icons[supplier.productName], 3, row + 6);

      drawEngine.drawText(supplier.supplierName, 14, 1 + row, WHITE1);
      const productLine = `${supplier.stock} ${supplier.productName} ${supplier.price}$`;
      drawEngine.drawText(
        supplier.stock ? productLine : 'soldout',
        14, row + 13, WHITE1
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
      WIDTH - 30,
      HEIGHT - 15,
      this.selection === this.gameData.suppliers.length ? 'white' : A_WHITE,
      'next',
    );

    if (this.gameData.week > 1 && this.totalTime > 500 && this.totalTime < 3000) {
      drawEngine.drawText(
        'Game saved',
        5, HEIGHT - 12,
        BLACK,
      );
    }

    this.updateControls();
  }

  buyProduct() {
    const supplier = this.gameData.suppliers[this.selection];
    if (
      supplier
    ) {
      if (
        supplier.stock > 0
        && supplier.price <= this.gameData.money
      ) {
        keySound(-2);
      } else {
        keySound(5);
        return;
      }
      this.gameData.money -= supplier.price;
      const avg = this.gameData.avgCost[supplier.productName] || 0;
      const price = this.gameData.price[supplier.productName] || 0;
      const stock = this.gameData.stock[supplier.productName] || 0;
      this.gameData.avgCost[supplier.productName] = Math.round(
        10 * (
          !(avg && price) ? supplier.price / supplier.stock
          : (supplier.price + price * stock) / (supplier.stock + stock)
        )
      ) / 10;
      this.gameData.stock[supplier.productName] = stock + supplier.stock;
      supplier.stock = 0;
    }
  }

  updateControls() {
    controls.updateSelection(this, this.gameData.suppliers.length);

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      this.active = this.selection;
      setTimeout(() => {
        this.active = -1;
      }, 100);
      if (this.selection == this.gameData.suppliers.length) {
        keySound(-2);
        this.next();
      }
      this.buyProduct();
    }
  }
}

export default BuyState;
