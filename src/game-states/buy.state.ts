import { controls } from '@/core/controls';
import { HEIGHT, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData from '@/core/game-data';
import { State } from '@/core/state';
// import { drawEngine } from '@/core/draw-engine';
// import { controls } from '@/core/controls';
// import { gameStateMachine } from '@/game-state-machine';
// import { menuState } from '@/game-states/menu.state';

class BuyState implements State {
  gameData: GameData;
  selectedSupplier: number = 0;

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter() {

  }

  onUpdate() {
    drawEngine.drawBrickWall();
    drawEngine.drawOverlay();

    drawEngine.drawText('Suppliers', 10, 1, 1, 'indianred');
    drawEngine.drawText(`${this.gameData.money}$`, 10, WIDTH, 1, 'green', 'right');

    this.gameData.suppliers
    .forEach((supplier, index) => {
      const row = index * 24 + 24;

      drawEngine.drawText(supplier.name, 10, 1, 1 + row, 'gray');
      const productLine = `${supplier.stock} ${supplier.product}   ${supplier.price}$`;
      drawEngine.drawText(
        supplier.stock ? productLine : 'soldout',
        10, 1, row + 11, 'gray'
      );

      drawEngine.drawButton(
        WIDTH - 20,
        row + 5,
        this.selectedSupplier === index ? 'white' : 'gray',
        'BUY'
      );
    });

    drawEngine.drawButton(
      WIDTH / 2,
      HEIGHT - 15,
      this.selectedSupplier === this.gameData.suppliers.length ? 'white' : 'gray',
      'next'
    );
    
    this.updateControls();
  }

  updateControls() {
    if (controls.isUp && !controls.previousState.isUp && this.selectedSupplier > 0) {
      this.selectedSupplier--;
    }
    if (controls.isDown && !controls.previousState.isDown && this.selectedSupplier < this.gameData.suppliers.length) {
      this.selectedSupplier++;
    }

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      const supplier = this.gameData.suppliers[this.selectedSupplier];
      if (
        supplier && 
        supplier.stock > 0
        && supplier.price <= this.gameData.money
      ) {
        this.gameData.money -= supplier.price;
        supplier.stock = 0;
        this.gameData.stock[supplier.product] = (this.gameData.stock[supplier.product] ?? 0) + supplier.stock;
      }
    }
  }
}

export default BuyState;
